import { prisma } from "@/lib/db/prisma";
import { refineQuery, summarizeResearchResults } from "@/lib/integrations/claude";
import { queryOpenAI } from "@/lib/integrations/openai";
import { analyzeWithOllama, isOllamaAvailable } from "@/lib/integrations/ollama";
import { searchOpenAlex, reconstructAbstract } from "@/lib/integrations/openalex";
import { searchPubMed } from "@/lib/integrations/pubmed";
import { searchGooglePatents } from "@/lib/integrations/google-patents";

export interface QueryConfig {
  query: string;
  sources: string[];
  llms: string[];
  paywalls?: boolean;
  deepSearch?: boolean;
  maxResults?: number;
}

export interface QueryResult {
  queryId: string;
  status: "completed" | "failed";
  responses: any[];
}

export class QueryOrchestrator {
  async executeQuery(config: QueryConfig, userId: string): Promise<string> {
    // 1. Create query record
    const query = await prisma.query.create({
      data: {
        userId,
        originalQuery: config.query,
        sources: config.sources,
        llms: config.llms,
        status: "PROCESSING",
      },
    });

    console.log("Query record created:", query.id);

    try {
      // 2. Refine query with LLM (skip if API key not available)
      let refined;
      try {
        console.log("Refining query with LLM...");
        refined = await refineQuery(config.query);
        console.log("Query refined successfully");

        await prisma.query.update({
          where: { id: query.id },
          data: {
            refinedQuery: refined.refinedQuery,
            intent: refined as any,
          },
        });
      } catch (llmError: any) {
        console.warn("Query refinement failed, using original query:", llmError.message);
        refined = {
          refinedQuery: config.query,
          intent: { primary: config.query, secondary: [] },
          concepts: [],
          suggestedTerms: [],
        };
      }

      // 3. Execute parallel searches across all sources
      const searchPromises = [];

      if (config.sources.includes("openalex")) {
        console.log("Adding OpenAlex search...");
        searchPromises.push(
          this.searchOpenAlex(refined.refinedQuery, config.maxResults)
        );
      }

      if (config.sources.includes("pubmed")) {
        console.log("Adding PubMed search...");
        searchPromises.push(
          this.searchPubMed(refined.refinedQuery, config.maxResults)
        );
      }

      if (config.sources.includes("patents")) {
        console.log("Adding Patents search...");
        searchPromises.push(
          this.searchPatents(refined.refinedQuery, config.maxResults)
        );
      }

      console.log(`Executing ${searchPromises.length} parallel searches...`);
      const results = await Promise.allSettled(searchPromises);
      console.log("Search results:", results.map(r => r.status));

      // 4. Collect successful results
      const successfulResults = results
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value)
        .flat();

      // 5. Process results with multiple LLMs
      const llmSummaries = await this.processWithLLMs(
        successfulResults,
        config.llms,
        config.query
      );

      // 6. Store all responses
      for (const summary of llmSummaries) {
        await prisma.response.create({
          data: {
            queryId: query.id,
            source: summary.source,
            rawData: summary.rawData || {},
            summary: summary.summary,
            fullContent: summary.fullContent,
            relevanceScore: summary.relevanceScore,
            citationCount: summary.citationCount,
            metadata: summary.metadata || {},
          },
        });
      }

      // Also store raw source responses
      const sourceResponseMap: Record<string, any[]> = {
        openalex: [],
        pubmed: [],
        patents: [],
      };

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const source = config.sources[index];
          sourceResponseMap[source] = result.value;
        }
      });

      for (const [source, data] of Object.entries(sourceResponseMap)) {
        if (data.length > 0) {
          await prisma.response.create({
            data: {
              queryId: query.id,
              source: source,
              rawData: data as any,
              summary: `Found ${data.length} results from ${source}`,
              fullContent: JSON.stringify(data, null, 2),
            },
          });
        }
      }

      // 7. Mark query as completed
      await prisma.query.update({
        where: { id: query.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return query.id;
    } catch (error) {
      console.error("Query orchestration error:", error);

      // Mark query as failed
      await prisma.query.update({
        where: { id: query.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  private async searchOpenAlex(query: string, maxResults?: number) {
    const results = await searchOpenAlex({
      query,
      max_results: maxResults || 25,
      filters: {
        is_oa: true,
      },
    });

    return results.map((work) => ({
      type: "paper",
      source: "openalex",
      id: work.id,
      doi: work.doi,
      title: work.display_name,
      abstract: reconstructAbstract(work.abstract_inverted_index),
      publicationDate: work.publication_date,
      citationCount: work.cited_by_count,
      authors: work.authorships.map((a) => a.author.display_name),
      journal: work.primary_location?.source?.display_name,
      concepts: work.concepts.map((c) => ({
        name: c.display_name,
        score: c.score,
      })),
      isOpenAccess: work.is_oa,
    }));
  }

  private async searchPubMed(query: string, maxResults?: number) {
    const results = await searchPubMed({
      query,
      max_results: maxResults || 25,
    });

    return results.map((article) => ({
      type: "paper",
      source: "pubmed",
      id: article.pmid,
      doi: article.doi,
      title: article.title,
      abstract: article.abstract,
      publicationDate: article.publicationDate,
      authors: article.authors.map((a) => a.name),
      journal: article.journal,
      keywords: article.keywords,
      meshTerms: article.meshTerms,
    }));
  }

  private async searchPatents(query: string, maxResults?: number) {
    const results = await searchGooglePatents({
      query,
      max_results: maxResults || 25,
    });

    return results.map((patent) => ({
      type: "patent",
      source: "patents",
      id: patent.id,
      title: patent.title,
      abstract: patent.abstract,
      publicationNumber: patent.publicationNumber,
      filingDate: patent.filingDate,
      assignee: patent.assignee,
      inventors: patent.inventors,
      classifications: patent.classifications,
      citationCount: patent.citationCount,
      url: patent.url,
    }));
  }

  private async processWithLLMs(
    results: any[],
    llms: string[],
    originalQuery: string
  ) {
    const summaries = [];

    for (const llm of llms) {
      try {
        const summary = await this.summarizeWithLLM(results, llm, originalQuery);
        summaries.push(summary);
      } catch (error) {
        console.error(`Error processing with ${llm}:`, error);
      }
    }

    return summaries;
  }

  private async summarizeWithLLM(
    results: any[],
    llm: string,
    originalQuery: string
  ) {
    let summary: string;
    let relevanceScore = 0.8;

    if (llm === "claude") {
      summary = await summarizeResearchResults(results, originalQuery);
    } else if (llm === "gpt4") {
      const response = await queryOpenAI({
        prompt: `Analyze these research results and provide:
1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Relevance Assessment
4. Recommended Next Steps

Original Query: "${originalQuery}"

Results: ${JSON.stringify(results.slice(0, 10))}`,
        maxTokens: 4000,
      });
      summary = response.content;
    } else if (llm === "ollama") {
      // Check if Ollama is available
      if (await isOllamaAvailable()) {
        const context = results.slice(0, 10).map((r) =>
          JSON.stringify({
            title: r.title,
            abstract: r.abstract,
            citations: r.citationCount,
          })
        );
        summary = await analyzeWithOllama(originalQuery, context);
      } else {
        summary = "Ollama is not available. Please ensure Ollama is running locally.";
      }
    } else {
      summary = "Summary not available for this LLM";
    }

    // Calculate average citation count
    const citationCount = Math.round(
      results.reduce((sum, r) => sum + (r.citationCount || 0), 0) / results.length
    );

    return {
      source: llm,
      rawData: { results: results.slice(0, 10) },
      summary,
      fullContent: summary,
      relevanceScore,
      citationCount,
      metadata: {
        totalResults: results.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getQueryResults(queryId: string) {
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: {
        responses: true,
        feedback: true,
      },
    });

    return query;
  }

  async getQueryHistory(userId: string, limit: number = 50) {
    return await prisma.query.findMany({
      where: { userId },
      include: {
        responses: {
          select: {
            id: true,
            source: true,
            summary: true,
            relevanceScore: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}

export const queryOrchestrator = new QueryOrchestrator();
