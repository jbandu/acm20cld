/**
 * Question Orchestrator
 *
 * Coordinates all question generation strategies, scores and ranks questions,
 * ensures diversity, and manages caching for optimal performance.
 */

import { GraphQuestionGenerator } from "./graph-question-generator";
import { PatternQuestionGenerator } from "./pattern-question-generator";
import { LLMQuestionGenerator } from "./llm-question-generator";
import { CollaborativeQuestionGenerator } from "./collaborative-question-generator";
import { prisma } from "@/lib/db/prisma";
import { getRedisClient } from "@/lib/db/redis";
import {
  calculateSimilarities,
  deduplicateBySimilarity,
  getBatchEmbeddings,
} from "./semantic-utils";
import type { QuestionCategory } from "@prisma/client";

export interface RankedQuestion {
  question: string;
  category: QuestionCategory;
  reasoning: string;
  scores: {
    relevance: number;
    novelty: number;
    actionability: number;
    impact: number;
    diversity: number;
  };
  overallScore: number;
  sourceType: string;
  sourceIds?: string[];
}

export class QuestionOrchestrator {
  private graphGenerator = new GraphQuestionGenerator();
  private patternGenerator = new PatternQuestionGenerator();
  private llmGenerator = new LLMQuestionGenerator();
  private collaborativeGenerator = new CollaborativeQuestionGenerator();

  /**
   * Generate and rank top questions to show user
   */
  async getTopQuestions(userId: string, limit: number = 5): Promise<RankedQuestion[]> {
    try {
      // Check cache first (refresh every 5 minutes)
      const cached = await this.getCachedQuestions(userId);
      if (cached && cached.length > 0) {
        return cached.slice(0, limit);
      }

      // Generate questions from all sources in parallel
      console.log(`Generating questions for user ${userId}...`);

      const [graphQuestions, patternQuestions, llmQuestions, collaborativeQuestions] =
        await Promise.allSettled([
          this.graphGenerator.generateFromGraph(userId),
          this.patternGenerator.generateFromPatterns(userId),
          this.llmGenerator.generateFromContext(userId),
          this.collaborativeGenerator.generateFromCollaboration(userId),
        ]);

      // Extract successful results
      const allQuestions = [
        ...(graphQuestions.status === "fulfilled" ? graphQuestions.value : []),
        ...(patternQuestions.status === "fulfilled" ? patternQuestions.value : []),
        ...(llmQuestions.status === "fulfilled" ? llmQuestions.value : []),
        ...(collaborativeQuestions.status === "fulfilled"
          ? collaborativeQuestions.value
          : []),
      ];

      console.log(`Generated ${allQuestions.length} candidate questions`);

      if (allQuestions.length === 0) {
        return [];
      }

      // Format questions to common structure
      const formattedQuestions = this.formatAllQuestions(allQuestions);

      // Deduplicate semantically similar questions
      const uniqueQuestions = await this.deduplicateQuestions(formattedQuestions);

      console.log(`${uniqueQuestions.length} unique questions after deduplication`);

      // Score each question
      const scoredQuestions = await Promise.all(
        uniqueQuestions.map((q) => this.scoreQuestion(q, userId))
      );

      // Ensure diversity
      const diverseQuestions = await this.ensureDiversity(scoredQuestions);

      // Sort by overall score
      const ranked = diverseQuestions.sort((a, b) => b.overallScore - a.overallScore);

      // Take top N
      const topQuestions = ranked.slice(0, Math.max(limit, 10)); // Get extra for cache

      // Save to database
      await this.saveQuestions(userId, topQuestions);

      // Cache for 5 minutes
      await this.cacheQuestions(userId, topQuestions);

      console.log(`Returning top ${limit} questions`);

      return topQuestions.slice(0, limit);
    } catch (error) {
      console.error("Error in question orchestrator:", error);
      return [];
    }
  }

  /**
   * Format questions from different generators to common structure
   */
  private formatAllQuestions(questions: any[]): any[] {
    return questions.map((q) => {
      // Different generators have slightly different formats
      return {
        question: q.question,
        category: q.category || q.type || "EXPLORATION",
        reasoning: q.reasoning,
        baseScore: q.score || 0.5,
        sourceType: q.sourceType || "HYBRID",
        sourceIds: q.sourceIds || q.sourceQueryIds || [],
      };
    });
  }

  /**
   * Deduplicate semantically similar questions
   */
  private async deduplicateQuestions(questions: any[]): Promise<any[]> {
    if (questions.length === 0) return [];

    try {
      const questionTexts = questions.map((q) => q.question);
      const uniqueIndices = await deduplicateBySimilarity(questionTexts, 0.85);

      return uniqueIndices.map((i) => questions[i]);
    } catch (error) {
      console.error("Error deduplicating questions:", error);
      return questions; // Return all if deduplication fails
    }
  }

  /**
   * Score a question based on multiple factors
   */
  private async scoreQuestion(
    question: any,
    userId: string
  ): Promise<RankedQuestion> {
    // Get user profile for relevance scoring
    const profile = await this.getUserProfile(userId);

    // 1. Relevance: How related to user's interests (0-1)
    const relevance = await this.calculateRelevance(
      question.question,
      profile.interests
    );

    // 2. Novelty: How different from recent queries (0-1)
    const novelty = await this.calculateNovelty(question.question, userId);

    // 3. Actionability: Can user research this now? (0-1)
    const actionability = this.calculateActionability(question.question);

    // 4. Impact: Potential importance (0-1)
    const impact = question.baseScore || 0.5;

    // 5. Diversity: Will be adjusted later
    const diversity = 1.0;

    // Weighted combination (total = 1.0)
    const weights = {
      relevance: 0.35,
      novelty: 0.20,
      actionability: 0.20,
      impact: 0.15,
      diversity: 0.10,
    };

    const overallScore =
      relevance * weights.relevance +
      novelty * weights.novelty +
      actionability * weights.actionability +
      impact * weights.impact +
      diversity * weights.diversity;

    return {
      question: question.question,
      category: question.category,
      reasoning: question.reasoning,
      scores: {
        relevance,
        novelty,
        actionability,
        impact,
        diversity,
      },
      overallScore,
      sourceType: question.sourceType,
      sourceIds: question.sourceIds,
    };
  }

  /**
   * Calculate relevance using semantic similarity
   */
  private async calculateRelevance(
    question: string,
    interests: string[]
  ): Promise<number> {
    if (interests.length === 0) return 0.5; // Neutral if no interests

    try {
      const similarities = await calculateSimilarities(question, interests);
      return Math.max(...similarities, 0);
    } catch (error) {
      console.error("Error calculating relevance:", error);
      return 0.5;
    }
  }

  /**
   * Calculate novelty (how different from recent queries)
   */
  private async calculateNovelty(question: string, userId: string): Promise<number> {
    try {
      const recentQueries = await prisma.query.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { originalQuery: true },
      });

      if (recentQueries.length === 0) return 1.0; // Maximally novel for new users

      const recentTexts = recentQueries.map((q) => q.originalQuery);
      const similarities = await calculateSimilarities(question, recentTexts);

      // Novelty is inverse of max similarity
      const maxSimilarity = Math.max(...similarities, 0);
      return Math.max(0, 1 - maxSimilarity);
    } catch (error) {
      console.error("Error calculating novelty:", error);
      return 0.5;
    }
  }

  /**
   * Calculate actionability (can research this now)
   */
  private calculateActionability(question: string): number {
    const length = question.split(" ").length;
    const isSpecific = length >= 5 && length <= 25; // Not too broad, not too narrow

    // Check for vague or overly broad terms
    const vaguePhrases = [
      "everything about",
      "all aspects of",
      "complete guide to",
      "cure cancer",
      "solve",
    ];
    const isVague = vaguePhrases.some((phrase) =>
      question.toLowerCase().includes(phrase)
    );

    // Check if it's actionable (uses research-oriented language)
    const actionableTerms = [
      "latest",
      "recent",
      "current",
      "effective",
      "mechanism",
      "role",
      "impact",
      "relationship",
      "compare",
      "development",
    ];
    const hasActionableTerms = actionableTerms.some((term) =>
      question.toLowerCase().includes(term)
    );

    let score = 0.5; // Base score

    if (isSpecific) score += 0.2;
    if (!isVague) score += 0.2;
    if (hasActionableTerms) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Ensure diversity in question types and topics
   */
  private async ensureDiversity(questions: RankedQuestion[]): Promise<RankedQuestion[]> {
    // Track categories to ensure variety
    const categoryCounts = new Map<QuestionCategory, number>();

    // Track topic clusters to avoid too many similar topics
    const questionTexts = questions.map((q) => q.question);
    let topicClusters: number[][] = [];

    try {
      const embeddings = await getBatchEmbeddings(questionTexts);

      // Simple clustering: group very similar questions
      topicClusters = await this.clusterQuestions(embeddings, 0.75);
    } catch (error) {
      console.error("Error clustering for diversity:", error);
    }

    // Adjust diversity scores
    return questions.map((q, index) => {
      // Penalize repeated categories
      const categoryCount = categoryCounts.get(q.category) || 0;
      categoryCounts.set(q.category, categoryCount + 1);
      const categoryPenalty = categoryCount * 0.15;

      // Penalize if in same cluster as earlier high-scoring question
      let clusterPenalty = 0;
      for (const cluster of topicClusters) {
        if (cluster.includes(index)) {
          // Check if any earlier question in cluster has higher score
          const earlierInCluster = cluster.filter((i) => i < index);
          if (earlierInCluster.length > 0) {
            clusterPenalty = 0.2;
          }
          break;
        }
      }

      // Update diversity score
      q.scores.diversity = Math.max(0, 1.0 - categoryPenalty - clusterPenalty);

      // Recalculate overall score
      const weights = {
        relevance: 0.35,
        novelty: 0.20,
        actionability: 0.20,
        impact: 0.15,
        diversity: 0.10,
      };

      q.overallScore =
        q.scores.relevance * weights.relevance +
        q.scores.novelty * weights.novelty +
        q.scores.actionability * weights.actionability +
        q.scores.impact * weights.impact +
        q.scores.diversity * weights.diversity;

      return q;
    });
  }

  /**
   * Simple clustering based on embeddings
   */
  private async clusterQuestions(
    embeddings: number[][],
    threshold: number
  ): Promise<number[][]> {
    const clusters: number[][] = [];
    const assigned = new Set<number>();

    for (let i = 0; i < embeddings.length; i++) {
      if (assigned.has(i)) continue;

      const cluster: number[] = [i];
      assigned.add(i);

      for (let j = i + 1; j < embeddings.length; j++) {
        if (assigned.has(j)) continue;

        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        if (similarity >= threshold) {
          cluster.push(j);
          assigned.add(j);
        }
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  /**
   * Helper: cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0,
      magA = 0,
      magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    return magA === 0 || magB === 0 ? 0 : dot / (magA * magB);
  }

  /**
   * Get user profile for scoring
   */
  private async getUserProfile(userId: string): Promise<{ interests: string[] }> {
    const profile = await prisma.userResearchProfile.findUnique({
      where: { userId },
    });

    return {
      interests: [
        ...(profile?.primaryInterests || []),
        ...(profile?.secondaryInterests || []),
      ],
    };
  }

  /**
   * Save questions to database
   */
  private async saveQuestions(
    userId: string,
    questions: RankedQuestion[]
  ): Promise<void> {
    try {
      // Set expiration to 24 hours from now
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.suggestedQuestion.createMany({
        data: questions.map((q) => ({
          userId,
          question: q.question,
          rationale: q.reasoning,
          category: q.category,
          relevanceScore: q.scores.relevance,
          noveltyScore: q.scores.novelty,
          actionabilityScore: q.scores.actionability,
          impactScore: q.scores.impact,
          overallScore: q.overallScore,
          sourceType: q.sourceType as any,
          sourceIds: q.sourceIds || [],
          generatedBy: "orchestrator",
          contextSnapshot: {
            timestamp: new Date().toISOString(),
            scores: q.scores,
          },
          expiresAt,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      console.error("Error saving questions to database:", error);
    }
  }

  /**
   * Cache questions in Redis
   */
  private async cacheQuestions(
    userId: string,
    questions: RankedQuestion[]
  ): Promise<void> {
    try {
      const redis = getRedisClient();
      if (redis.status !== "ready") {
        await redis.connect().catch(() => null);
      }

      if (redis.status === "ready") {
        const cacheKey = `suggested_questions:${userId}`;
        await redis.setex(cacheKey, 300, JSON.stringify(questions)); // 5 minutes
      }
    } catch (error) {
      console.warn("Redis caching unavailable:", error);
    }
  }

  /**
   * Get cached questions
   */
  private async getCachedQuestions(userId: string): Promise<RankedQuestion[] | null> {
    try {
      const redis = getRedisClient();
      if (redis.status !== "ready") {
        await redis.connect().catch(() => null);
      }

      if (redis.status === "ready") {
        const cacheKey = `suggested_questions:${userId}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
          return JSON.parse(cached);
        }
      }

      return null;
    } catch (error) {
      console.warn("Redis cache retrieval unavailable:", error);
      return null;
    }
  }

  /**
   * Clear cache for a user (e.g., after they complete a query)
   */
  async clearCache(userId: string): Promise<void> {
    try {
      const redis = getRedisClient();
      if (redis.status !== "ready") {
        await redis.connect().catch(() => null);
      }

      if (redis.status === "ready") {
        const cacheKey = `suggested_questions:${userId}`;
        await redis.del(cacheKey);
      }
    } catch (error) {
      console.warn("Redis cache clearing unavailable:", error);
    }
  }
}
