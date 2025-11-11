/**
 * Collaborative Question Generator
 *
 * Uses collaborative filtering to suggest questions based on what
 * similar researchers are asking. Learns from collective research behavior.
 */

import { prisma } from "@/lib/db/prisma";
import { calculateSimilarities, getBatchEmbeddings } from "./semantic-utils";
import type { QuestionCategory } from "@prisma/client";

export interface CollaborativeInsight {
  question: string;
  reasoning: string;
  score: number;
  category: QuestionCategory;
  sourceType: string;
  sourceQueryIds: string[];
  similarResearchers: string[];
}

interface SimilarResearcher {
  userId: string;
  name: string;
  similarity: number;
  sharedInterests: string[];
}

export class CollaborativeQuestionGenerator {
  /**
   * Generate questions based on what similar researchers are asking
   */
  async generateFromCollaboration(userId: string): Promise<CollaborativeInsight[]> {
    try {
      // 1. Find similar researchers
      const similarResearchers = await this.findSimilarResearchers(userId);

      if (similarResearchers.length === 0) {
        return [];
      }

      // 2. Get their recent successful queries
      const insights = await this.getQueriesFromSimilarResearchers(
        userId,
        similarResearchers
      );

      return insights;
    } catch (error) {
      console.error("Error generating collaborative questions:", error);
      return [];
    }
  }

  /**
   * Find researchers with similar interests and query patterns
   */
  private async findSimilarResearchers(
    userId: string
  ): Promise<SimilarResearcher[]> {
    // Get current user's profile and interests
    const userProfile = await prisma.userResearchProfile.findUnique({
      where: { userId },
    });

    const userQueries = await prisma.query.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { originalQuery: true, intent: true },
    });

    if (userQueries.length === 0) {
      return [];
    }

    // Extract user's research themes
    const userInterests = new Set([
      ...(userProfile?.primaryInterests || []),
      ...(userProfile?.secondaryInterests || []),
    ]);

    const userQueryTexts = userQueries.map((q) => q.originalQuery);

    // Get all other researchers in same department or institution
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { department: true, institution: true },
    });

    const potentialSimilar = await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { department: user?.department },
          { institution: user?.institution },
        ],
      },
      include: {
        researchProfile: {
          select: {
            primaryInterests: true,
            secondaryInterests: true,
            researchAreas: true,
            expertiseLevel: true,
            techniques: true,
            computationalSkills: true,
          },
        },
        queries: {
          where: { status: "COMPLETED" },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { originalQuery: true },
        },
      },
    });

    // Calculate similarity scores
    const similarities: SimilarResearcher[] = [];

    // Get user's research areas for additional matching
    const userResearchAreas = new Set(userProfile?.researchAreas || []);
    const userTechniques = new Set(userProfile?.techniques || []);

    for (const other of potentialSimilar) {
      if (other.queries.length === 0) continue;

      // Interest overlap
      const otherInterests = new Set([
        ...(other.researchProfile?.primaryInterests || []),
        ...(other.researchProfile?.secondaryInterests || []),
      ]);

      const sharedInterests = [...userInterests].filter((i) => otherInterests.has(i));
      const interestSimilarity =
        sharedInterests.length / Math.max(userInterests.size, otherInterests.size, 1);

      // Research area overlap
      const otherResearchAreas = new Set(other.researchProfile?.researchAreas || []);
      const sharedAreas = [...userResearchAreas].filter((a) => otherResearchAreas.has(a));
      const areaSimilarity =
        sharedAreas.length / Math.max(userResearchAreas.size, otherResearchAreas.size, 1);

      // Technique overlap (indicates methodological similarity)
      const otherTechniques = new Set(other.researchProfile?.techniques || []);
      const sharedTechniques = [...userTechniques].filter((t) => otherTechniques.has(t));
      const techniqueSimilarity =
        userTechniques.size > 0 && otherTechniques.size > 0
          ? sharedTechniques.length / Math.max(userTechniques.size, otherTechniques.size, 1)
          : 0;

      // Expertise level similarity (prefer similar levels for better question relevance)
      const expertiseSimilarity =
        userProfile?.expertiseLevel === other.researchProfile?.expertiseLevel ? 0.5 : 0;

      // Query similarity (using embeddings)
      const otherQueryTexts = other.queries.map((q) => q.originalQuery);
      const querySimilarity = await this.calculateQuerySimilarity(
        userQueryTexts,
        otherQueryTexts
      );

      // Combined similarity (weighted average)
      const overallSimilarity =
        interestSimilarity * 0.25 +
        areaSimilarity * 0.25 +
        querySimilarity * 0.3 +
        techniqueSimilarity * 0.1 +
        expertiseSimilarity * 0.1;

      if (overallSimilarity > 0.3) {
        // Threshold for similarity
        similarities.push({
          userId: other.id,
          name: other.name,
          similarity: overallSimilarity,
          sharedInterests,
        });
      }
    }

    // Sort by similarity and return top 5
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  /**
   * Calculate average similarity between two sets of queries
   */
  private async calculateQuerySimilarity(
    userQueries: string[],
    otherQueries: string[]
  ): Promise<number> {
    if (userQueries.length === 0 || otherQueries.length === 0) return 0;

    try {
      // Sample queries to avoid too many API calls
      const sampleUser = userQueries.slice(0, 5);
      const sampleOther = otherQueries.slice(0, 5);

      const [userEmbeddings, otherEmbeddings] = await Promise.all([
        getBatchEmbeddings(sampleUser),
        getBatchEmbeddings(sampleOther),
      ]);

      // Calculate average max similarity
      let totalSimilarity = 0;
      let count = 0;

      for (const userEmb of userEmbeddings) {
        let maxSim = 0;
        for (const otherEmb of otherEmbeddings) {
          const sim = this.cosineSimilarity(userEmb, otherEmb);
          maxSim = Math.max(maxSim, sim);
        }
        totalSimilarity += maxSim;
        count++;
      }

      return count > 0 ? totalSimilarity / count : 0;
    } catch (error) {
      console.error("Error calculating query similarity:", error);
      return 0;
    }
  }

  /**
   * Helper: cosine similarity calculation
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return magA === 0 || magB === 0 ? 0 : dotProduct / (magA * magB);
  }

  /**
   * Get successful queries from similar researchers that user hasn't tried
   */
  private async getQueriesFromSimilarResearchers(
    userId: string,
    similarResearchers: SimilarResearcher[]
  ): Promise<CollaborativeInsight[]> {
    const insights: CollaborativeInsight[] = [];

    // Get user's past queries to avoid duplicates
    const userQueries = await prisma.query.findMany({
      where: { userId },
      select: { originalQuery: true },
    });

    const userQueryTexts = userQueries.map((q) => q.originalQuery.toLowerCase());

    // Get queries from similar researchers
    for (const similar of similarResearchers) {
      const theirQueries = await prisma.query.findMany({
        where: {
          userId: similar.userId,
          status: "COMPLETED",
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        include: {
          responses: {
            include: {
              feedback: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Filter for successful queries (have positive feedback)
      const successfulQueries = theirQueries.filter((q) => {
        const hasPositiveFeedback = q.responses.some((r) =>
          r.feedback.some((f) => f.type === "LIKE" || f.type === "IMPORTANT")
        );
        return hasPositiveFeedback;
      });

      // Check if user has already asked similar questions
      for (const query of successfulQueries) {
        const isDuplicate = userQueryTexts.some(
          (uq) => uq === query.originalQuery.toLowerCase()
        );

        if (!isDuplicate) {
          // Check semantic similarity to avoid near-duplicates
          const similarities = await calculateSimilarities(
            query.originalQuery,
            userQueryTexts.slice(0, 10) // Check against recent queries
          );

          const maxSim = Math.max(...similarities, 0);

          if (maxSim < 0.8) {
            // Not too similar to existing queries
            const category = this.inferCategory(query.originalQuery);

            insights.push({
              question: query.originalQuery,
              reasoning: `${similar.name} (${Math.round(similar.similarity * 100)}% similar to you) found this question valuable${similar.sharedInterests.length > 0 ? `. You share interest in: ${similar.sharedInterests.slice(0, 2).join(", ")}` : ""}.`,
              score: similar.similarity * 0.8, // Weighted by researcher similarity
              category,
              sourceType: "collaborative",
              sourceQueryIds: [query.id],
              similarResearchers: [similar.name],
            });
          }
        }
      }
    }

    // Sort by score and return top insights
    return insights.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Infer question category from query text
   */
  private inferCategory(query: string): QuestionCategory {
    const lowerQuery = query.toLowerCase();

    // Simple keyword-based inference
    if (
      lowerQuery.includes("compare") ||
      lowerQuery.includes("vs") ||
      lowerQuery.includes("versus") ||
      lowerQuery.includes("difference")
    ) {
      return "COMPARISON";
    }

    if (
      lowerQuery.includes("latest") ||
      lowerQuery.includes("recent") ||
      lowerQuery.includes("new") ||
      lowerQuery.includes("emerging") ||
      lowerQuery.includes("breakthrough")
    ) {
      return "TREND";
    }

    if (
      lowerQuery.includes("how does") ||
      lowerQuery.includes("mechanism") ||
      lowerQuery.includes("why") ||
      lowerQuery.includes("what causes")
    ) {
      return "DEEPENING";
    }

    if (
      lowerQuery.includes("clinical") ||
      lowerQuery.includes("patient") ||
      lowerQuery.includes("treatment") ||
      lowerQuery.includes("therapy")
    ) {
      return "PRACTICAL";
    }

    if (
      lowerQuery.includes("relationship") ||
      lowerQuery.includes("connection") ||
      lowerQuery.includes("link") ||
      lowerQuery.includes("related")
    ) {
      return "BRIDGING";
    }

    // Default to exploration
    return "EXPLORATION";
  }

  /**
   * Update user's research profile with similar researchers
   */
  async updateSimilarResearchers(userId: string): Promise<void> {
    try {
      const similar = await this.findSimilarResearchers(userId);

      // Update or create research profile
      await prisma.userResearchProfile.upsert({
        where: { userId },
        update: {
          similarResearchers: similar.map((s) => s.userId),
        },
        create: {
          userId,
          similarResearchers: similar.map((s) => s.userId),
          primaryInterests: [],
          secondaryInterests: [],
          preferredSources: [],
          preferredLLMs: [],
          currentProjects: [],
          currentGoals: [],
          teamInterests: [],
          queryFrequency: {},
          activeHours: {},
          weeklyPattern: {},
          paperPreferences: {},
          topicVelocity: {},
        },
      });
    } catch (error) {
      console.error("Error updating similar researchers:", error);
    }
  }

  /**
   * Get trending questions across the platform
   */
  async getTrendingQuestions(department?: string): Promise<CollaborativeInsight[]> {
    try {
      // Get queries from last 7 days with positive feedback
      const recentSuccessful = await prisma.query.findMany({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          ...(department && {
            user: {
              department,
            },
          }),
          responses: {
            some: {
              feedback: {
                some: {
                  type: { in: ["LIKE", "IMPORTANT"] },
                },
              },
            },
          },
        },
        include: {
          user: true,
          responses: {
            include: {
              feedback: true,
            },
          },
        },
        take: 50,
      });

      // Count frequency of similar queries
      const queryGroups = new Map<string, { count: number; examples: any[] }>();

      for (const query of recentSuccessful) {
        const key = query.originalQuery.toLowerCase().substring(0, 50);
        const existing = queryGroups.get(key) || { count: 0, examples: [] };
        existing.count++;
        existing.examples.push(query);
        queryGroups.set(key, existing);
      }

      // Convert to insights
      const trending = Array.from(queryGroups.entries())
        .filter(([_, data]) => data.count >= 2) // At least 2 people asked similar
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([_, data]) => {
          const example = data.examples[0];
          return {
            question: example.originalQuery,
            reasoning: `${data.count} researchers asked about this in the last 7 days. Trending topic in ${department || "the platform"}.`,
            score: Math.min(data.count / 5, 1.0),
            category: this.inferCategory(example.originalQuery),
            sourceType: "trending",
            sourceQueryIds: data.examples.map((e) => e.id),
            similarResearchers: data.examples.map((e) => e.user.name),
          };
        });

      return trending;
    } catch (error) {
      console.error("Error getting trending questions:", error);
      return [];
    }
  }
}
