/**
 * Pattern-Based Question Generator
 *
 * Analyzes user's query patterns to suggest logical next questions
 * based on research trajectories, topic focus, and query evolution.
 */

import { prisma } from "@/lib/db/prisma";
import { maxSimilarity } from "./semantic-utils";
import type { QuestionCategory } from "@prisma/client";

export interface PatternInsight {
  question: string;
  reasoning: string;
  score: number;
  category: QuestionCategory;
  patternType: string;
  sourceQueryIds: string[];
}

interface QueryPattern {
  type: "deep_dive" | "comparison" | "exploration" | "problem_solving" | "new_user";
  topics: string[][];
  queries: any[];
  focus?: string;
}

export class PatternQuestionGenerator {
  /**
   * Analyze user's query patterns and suggest logical next questions
   */
  async generateFromPatterns(userId: string): Promise<PatternInsight[]> {
    try {
      // Get user's query history
      const queries = await prisma.query.findMany({
        where: {
          userId,
          status: "COMPLETED",
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          responses: {
            include: {
              feedback: true,
            },
          },
        },
      });

      if (queries.length === 0) {
        return this.generateNewUserQuestions(userId);
      }

      // Detect query patterns
      const pattern = await this.detectPatterns(queries);

      // Generate questions based on detected pattern
      const questions: PatternInsight[] = [];

      switch (pattern.type) {
        case "deep_dive":
          questions.push(...this.generateDeepDiveQuestions(pattern));
          break;
        case "comparison":
          questions.push(...this.generateComparisonQuestions(pattern));
          break;
        case "exploration":
          questions.push(...this.generateExplorationQuestions(pattern));
          break;
        case "problem_solving":
          questions.push(...this.generateProblemSolvingQuestions(pattern));
          break;
        case "new_user":
          questions.push(...(await this.generateNewUserQuestions(userId)));
          break;
      }

      return questions;
    } catch (error) {
      console.error("Error generating pattern-based questions:", error);
      return [];
    }
  }

  /**
   * Detect what pattern the user's queries follow
   */
  private async detectPatterns(queries: any[]): Promise<QueryPattern> {
    const recentQueries = queries.slice(0, 5);

    // Extract topics from queries
    const topics = recentQueries.map((q) => this.extractKeywords(q.originalQuery));

    // Calculate topic overlap
    const overlap = this.calculateOverlap(topics);

    // Check for comparison patterns
    const hasComparison = this.isComparison(recentQueries);

    if (overlap > 0.7 && !hasComparison) {
      // User is diving deep into a specific topic
      return {
        type: "deep_dive",
        topics,
        queries: recentQueries,
        focus: topics[0][0], // Main keyword
      };
    } else if (hasComparison) {
      // User is comparing different approaches/concepts
      return {
        type: "comparison",
        topics,
        queries: recentQueries,
      };
    } else if (overlap < 0.3) {
      // User is exploring broadly
      return {
        type: "exploration",
        topics,
        queries: recentQueries,
      };
    } else {
      // User has a specific problem they're trying to solve
      return {
        type: "problem_solving",
        topics,
        queries: recentQueries,
        focus: topics[0][0],
      };
    }
  }

  /**
   * Generate continuation questions for deep dive pattern
   */
  private generateDeepDiveQuestions(pattern: QueryPattern): PatternInsight[] {
    const topic = pattern.focus || pattern.topics[0]?.[0] || "your research area";
    const sourceQueryIds = pattern.queries.map((q) => q.id);

    return [
      {
        question: `What are the current limitations of ${topic} approaches?`,
        reasoning: `You've been exploring ${topic} in depth. Understanding limitations is key to advancing the field.`,
        score: 0.85,
        category: "DEEPENING",
        patternType: "deep_dive",
        sourceQueryIds,
      },
      {
        question: `How has ${topic} research evolved in the last 2 years?`,
        reasoning: `You're focused on ${topic}. Tracking recent developments will reveal emerging trends.`,
        score: 0.8,
        category: "TREND",
        patternType: "deep_dive",
        sourceQueryIds,
      },
      {
        question: `What are the clinical applications of ${topic}?`,
        reasoning: `Deep knowledge of ${topic} enables exploration of practical applications.`,
        score: 0.75,
        category: "PRACTICAL",
        patternType: "deep_dive",
        sourceQueryIds,
      },
      {
        question: `Which research groups are leading ${topic} development?`,
        reasoning: `Your deep interest in ${topic} suggests tracking key contributors would be valuable.`,
        score: 0.7,
        category: "EXPLORATION",
        patternType: "deep_dive",
        sourceQueryIds,
      },
    ];
  }

  /**
   * Generate comparison questions
   */
  private generateComparisonQuestions(pattern: QueryPattern): PatternInsight[] {
    const topics = pattern.topics.slice(0, 2);
    const topicA = topics[0]?.[0] || "approach A";
    const topicB = topics[1]?.[0] || "approach B";
    const sourceQueryIds = pattern.queries.map((q) => q.id);

    return [
      {
        question: `How do ${topicA} and ${topicB} compare in terms of clinical efficacy?`,
        reasoning: `You're comparing different approaches. Clinical outcomes are the ultimate test.`,
        score: 0.85,
        category: "COMPARISON",
        patternType: "comparison",
        sourceQueryIds,
      },
      {
        question: `What are the cost-benefit tradeoffs between ${topicA} and ${topicB}?`,
        reasoning: `Practical implementation requires understanding economic factors beyond efficacy.`,
        score: 0.8,
        category: "PRACTICAL",
        patternType: "comparison",
        sourceQueryIds,
      },
      {
        question: `Can ${topicA} and ${topicB} be combined for synergistic effects?`,
        reasoning: `Your comparative analysis suggests exploring combination strategies could be valuable.`,
        score: 0.75,
        category: "EXPLORATION",
        patternType: "comparison",
        sourceQueryIds,
      },
      {
        question: `Which patient populations benefit most from ${topicA} vs ${topicB}?`,
        reasoning: `Personalized medicine requires understanding which approach works best for whom.`,
        score: 0.7,
        category: "PRACTICAL",
        patternType: "comparison",
        sourceQueryIds,
      },
    ];
  }

  /**
   * Generate exploration questions
   */
  private generateExplorationQuestions(pattern: QueryPattern): PatternInsight[] {
    const recentTopics = pattern.topics.slice(0, 3).map((t) => t[0]);
    const sourceQueryIds = pattern.queries.map((q) => q.id);

    return [
      {
        question: `What connects ${recentTopics[0]} and ${recentTopics[1]}?`,
        reasoning: `You're exploring diverse topics. Finding connections could reveal new research directions.`,
        score: 0.85,
        category: "BRIDGING",
        patternType: "exploration",
        sourceQueryIds,
      },
      {
        question: `What's the current state of the art in ${recentTopics[0]}?`,
        reasoning: `Your broad exploration would benefit from understanding the frontier in each area.`,
        score: 0.75,
        category: "TREND",
        patternType: "exploration",
        sourceQueryIds,
      },
      {
        question: `How do these different areas inform each other?`,
        reasoning: `Exploring multiple fields creates opportunity for cross-pollination of ideas.`,
        score: 0.7,
        category: "BRIDGING",
        patternType: "exploration",
        sourceQueryIds,
      },
    ];
  }

  /**
   * Generate problem-solving questions
   */
  private generateProblemSolvingQuestions(pattern: QueryPattern): PatternInsight[] {
    const topic = pattern.focus || pattern.topics[0]?.[0] || "this problem";
    const sourceQueryIds = pattern.queries.map((q) => q.id);

    return [
      {
        question: `What are alternative approaches to solving ${topic}?`,
        reasoning: `You seem focused on a specific challenge. Exploring alternatives often leads to breakthroughs.`,
        score: 0.85,
        category: "EXPLORATION",
        patternType: "problem_solving",
        sourceQueryIds,
      },
      {
        question: `What barriers have prevented progress on ${topic}?`,
        reasoning: `Understanding obstacles is crucial when working on specific problems.`,
        score: 0.8,
        category: "DEEPENING",
        patternType: "problem_solving",
        sourceQueryIds,
      },
      {
        question: `How have others successfully addressed similar challenges?`,
        reasoning: `Learning from analogous problems can provide valuable insights.`,
        score: 0.75,
        category: "EXPLORATION",
        patternType: "problem_solving",
        sourceQueryIds,
      },
    ];
  }

  /**
   * Generate questions for new users based on their department
   */
  private async generateNewUserQuestions(userId: string): Promise<PatternInsight[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { researchProfile: true },
    });

    const department = user?.department || "General";
    const interests = user?.researchProfile?.primaryInterests || [];

    // Department-specific starter questions
    const starterQuestions: Record<string, PatternInsight[]> = {
      "Cancer Research": [
        {
          question: "What are the latest CAR-T cell therapy breakthroughs in solid tumors?",
          reasoning: "CAR-T is revolutionizing cancer treatment. Understanding latest advances is essential.",
          score: 0.9,
          category: "TREND",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
        {
          question: "How effective are checkpoint inhibitors in different cancer types?",
          reasoning: "Checkpoint inhibitors are a cornerstone of modern immunotherapy.",
          score: 0.85,
          category: "EXPLORATION",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
        {
          question: "What are emerging biomarkers for immunotherapy response prediction?",
          reasoning: "Predicting treatment response is critical for personalized medicine.",
          score: 0.85,
          category: "PRACTICAL",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
        {
          question: "How can we overcome tumor microenvironment barriers to therapy?",
          reasoning: "The TME is a major obstacle to effective cancer treatment.",
          score: 0.8,
          category: "DEEPENING",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
      ],
      General: [
        {
          question: "What are the most highly cited papers in my research area this year?",
          reasoning: "High-impact papers shape the direction of the field.",
          score: 0.8,
          category: "TREND",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
        {
          question: "What conferences should I attend in the next 6 months?",
          reasoning: "Conferences are crucial for networking and staying current.",
          score: 0.75,
          category: "PRACTICAL",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
        {
          question: "What are the emerging trends in cancer biology research?",
          reasoning: "Understanding trends helps identify promising research directions.",
          score: 0.75,
          category: "TREND",
          patternType: "new_user_starter",
          sourceQueryIds: [],
        },
      ],
    };

    // Use interest-specific questions if available
    if (interests.length > 0) {
      return interests.map((interest) => ({
        question: `What are the latest developments in ${interest}?`,
        reasoning: `This aligns with your stated research interest in ${interest}.`,
        score: 0.9,
        category: "TREND" as QuestionCategory,
        patternType: "new_user_interest",
        sourceQueryIds: [],
      }));
    }

    return starterQuestions[department] || starterQuestions["General"];
  }

  /**
   * Helper: Extract keywords from query
   */
  private extractKeywords(query: string): string[] {
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "in",
      "on",
      "at",
      "for",
      "to",
      "of",
      "and",
      "or",
      "how",
      "what",
      "when",
      "where",
      "why",
      "which",
      "who",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
    ]);

    return query
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word))
      .slice(0, 5); // Top 5 keywords
  }

  /**
   * Calculate topic overlap between query sets
   */
  private calculateOverlap(topics: string[][]): number {
    if (topics.length < 2) return 0;

    const set1 = new Set(topics[0]);
    const set2 = new Set(topics[1]);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Check if queries are comparison-type
   */
  private isComparison(queries: any[]): boolean {
    const comparisonKeywords = [
      "vs",
      "versus",
      "compare",
      "comparison",
      "difference",
      "better",
      "alternative",
      "instead",
    ];

    return queries.some((q) =>
      comparisonKeywords.some((kw) => q.originalQuery.toLowerCase().includes(kw))
    );
  }

  /**
   * Analyze temporal patterns in query activity
   */
  async analyzeTemporalPatterns(userId: string): Promise<{
    queryFrequency: string;
    peakHours: number[];
    weeklyPattern: Record<string, number>;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const queries = await prisma.query.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Calculate query frequency
    const queriesPerDay = queries.length / 30;
    const queryFrequency =
      queriesPerDay > 2 ? "high" : queriesPerDay > 0.5 ? "medium" : "low";

    // Find peak hours
    const hourCounts = new Map<number, number>();
    queries.forEach((q) => {
      const hour = q.createdAt.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const peakHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);

    // Weekly pattern
    const weeklyPattern: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    const dayNames = Object.keys(weeklyPattern);
    queries.forEach((q) => {
      const dayName = dayNames[q.createdAt.getDay()];
      if (dayName) {
        weeklyPattern[dayName]++;
      }
    });

    return {
      queryFrequency,
      peakHours,
      weeklyPattern,
    };
  }
}
