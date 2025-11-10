import { Queue, Worker, Job } from "bullmq";
import { prisma } from "@/lib/db/prisma";
import { searchOpenAlex } from "@/lib/integrations/openalex";
import { searchPubMed } from "@/lib/integrations/pubmed";
import { searchGooglePatents } from "@/lib/integrations/google-patents";
import { extractConcepts } from "@/lib/integrations/claude";

let researchQueue: Queue | null = null;
let nightlyWorker: Worker | null = null;

export function getResearchQueue(): Queue {
  if (!researchQueue) {
    researchQueue = new Queue("nightly-research", {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        maxRetriesPerRequest: null,
      },
    });
  }
  return researchQueue;
}

export interface NightlyResearchJob {
  date: string;
}

export async function scheduleNightlyResearch() {
  // Schedule daily at 2 AM
  const queue = getResearchQueue();
  await queue.add(
    "collect-research",
    { date: new Date().toISOString() },
    {
      repeat: {
        pattern: "0 2 * * *",
      },
      removeOnComplete: {
        count: 10, // Keep last 10 completed jobs
      },
      removeOnFail: {
        count: 5, // Keep last 5 failed jobs
      },
    }
  );

  console.log("✅ Nightly research agent scheduled");
}

export function getNightlyWorker(): Worker {
  if (!nightlyWorker) {
    nightlyWorker = new Worker<NightlyResearchJob>(
      "nightly-research",
      async (job: Job<NightlyResearchJob>) => {
    console.log(`🌙 Starting nightly research collection for ${job.data.date}...`);

    try {
      // 1. Get all active data sources
      const sources = await prisma.dataSource.findMany({
        where: { enabled: true },
      });

      // 2. Extract topics from recent user queries
      const topics = await extractTopicsFromRecentQueries();

      if (topics.length === 0) {
        console.log("No topics found, skipping research collection");
        return { status: "skipped", reason: "no topics" };
      }

      const results = {
        totalArticles: 0,
        topTopics: topics.slice(0, 10),
        keyFindings: [] as any[],
        sources: sources.map((s) => s.name),
      };

      // 3. Search each source for each topic
      for (const topic of topics.slice(0, 5)) {
        // Limit to top 5 topics
        console.log(`Researching topic: ${topic}`);

        // Get yesterday's date for filtering
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        try {
          // OpenAlex search
          const openAlexResults = await searchOpenAlex({
            query: topic,
            filters: {
              from_publication_date: yesterdayStr,
              is_oa: true,
            },
            max_results: 10,
          });

          results.totalArticles += openAlexResults.length;

          // PubMed search
          const pubmedResults = await searchPubMed({
            query: topic,
            date_from: yesterdayStr,
            max_results: 10,
          });

          results.totalArticles += pubmedResults.length;

          // Patents search
          const patentResults = await searchGooglePatents({
            query: topic,
            max_results: 5,
          });

          results.totalArticles += patentResults.length;

          // Store significant findings
          if (
            openAlexResults.length > 0 ||
            pubmedResults.length > 0 ||
            patentResults.length > 0
          ) {
            results.keyFindings.push({
              topic,
              openAlexCount: openAlexResults.length,
              pubmedCount: pubmedResults.length,
              patentCount: patentResults.length,
              topPapers: openAlexResults.slice(0, 3).map((p) => ({
                title: p.display_name,
                doi: p.doi,
                citations: p.cited_by_count,
              })),
            });
          }
        } catch (error) {
          console.error(`Error searching for topic ${topic}:`, error);
        }
      }

      // 4. Create research digest
      const digest = await prisma.researchDigest.create({
        data: {
          date: new Date(job.data.date),
          sources: results.sources,
          totalArticles: results.totalArticles,
          topTopics: results.topTopics,
          keyFindings: results.keyFindings,
          status: "completed",
        },
      });

      console.log(
        `✅ Nightly research completed: ${results.totalArticles} articles collected`
      );

      return {
        status: "completed",
        digestId: digest.id,
        totalArticles: results.totalArticles,
        topicsProcessed: topics.length,
      };
    } catch (error) {
      console.error("❌ Nightly research error:", error);
      throw error;
    }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT || "6379"),
          maxRetriesPerRequest: null,
        },
        concurrency: 1,
      }
    );

    // Event listeners
    nightlyWorker.on("completed", (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    nightlyWorker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    nightlyWorker.on("error", (err) => {
      console.error("Worker error:", err);
    });
  }
  return nightlyWorker;
}

async function extractTopicsFromRecentQueries(): Promise<string[]> {
  // Get queries from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentQueries = await prisma.query.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
      status: "COMPLETED",
    },
    select: {
      originalQuery: true,
      intent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  if (recentQueries.length === 0) {
    return [];
  }

  // Extract concepts from queries
  const allTopics: string[] = [];

  for (const query of recentQueries) {
    try {
      const concepts = await extractConcepts(query.originalQuery);
      allTopics.push(...concepts);

      // Also extract from intent if available
      if (query.intent && typeof query.intent === "object") {
        const intent = query.intent as any;
        if (intent.concepts && Array.isArray(intent.concepts)) {
          allTopics.push(...intent.concepts);
        }
      }
    } catch (error) {
      console.error("Error extracting concepts:", error);
    }
  }

  // Count frequency and return top topics
  const topicCounts = new Map<string, number>();
  for (const topic of allTopics) {
    topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
  }

  const sortedTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  return sortedTopics.slice(0, 20); // Return top 20 topics
}
