/**
 * LLM-Powered Question Generator
 *
 * Uses Claude to generate highly contextual questions based on
 * comprehensive user profile, history, and research landscape.
 */

import { queryClaude } from "@/lib/integrations/claude";
import { prisma } from "@/lib/db/prisma";
import type { QuestionCategory, QuestionSource } from "@prisma/client";

export interface LLMGeneratedQuestion {
  question: string;
  type: QuestionCategory;
  reasoning: string;
  priority: "high" | "medium" | "low";
  score: number;
  sourceType: QuestionSource;
}

interface UserContext {
  profile: {
    name?: string;
    department?: string;
    interests: string[];
    expertise: string;
    phdFocus?: string;
    yearsInField?: number;
    techniques?: string[];
    computationalSkills?: string[];
    highestDegree?: string;
  };
  recentQueries: Array<{ query: string; date: string }>;
  importantPapers: Array<{ title: string; concepts?: string[] }>;
  projects: Array<{ title: string; description?: string; status?: string }>;
  goals: Array<{ type: string; title: string; targetDate?: string; daysUntil?: number }>;
  teamActivity: Array<{ researcher: string; topic: string }>;
  gaps: string[];
}

export class LLMQuestionGenerator {
  /**
   * Use Claude to generate highly contextual questions
   */
  async generateFromContext(userId: string): Promise<LLMGeneratedQuestion[]> {
    try {
      // Gather rich context
      const context = await this.gatherUserContext(userId);

      if (context.recentQueries.length === 0) {
        // New user - generate introductory questions
        return this.generateNewUserQuestions(context);
      }

      // Generate questions using Claude
      const prompt = this.buildPrompt(context);
      const response = await queryClaude({
        prompt,
        maxTokens: 3000,
        temperature: 0.8, // Higher temperature for more creative questions
      });

      // Parse response
      const result = this.parseClaudeResponse(response.content);
      return result;
    } catch (error) {
      console.error("Error generating LLM-based questions:", error);
      return [];
    }
  }

  /**
   * Gather comprehensive context about user
   */
  private async gatherUserContext(userId: string): Promise<UserContext> {
    // User profile with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        researchProfile: {
          include: {
            currentProjectDetails: {
              where: {
                status: {
                  in: ["PLANNING", "IN_PROGRESS", "ANALYZING"],
                },
              },
              take: 5,
            },
          },
        },
        goals: {
          where: {
            status: {
              in: ["NOT_STARTED", "IN_PROGRESS"],
            },
          },
          orderBy: {
            targetDate: "asc",
          },
          take: 5,
        },
        queries: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            responses: {
              include: {
                feedback: {
                  where: { type: "IMPORTANT" },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Recent queries
    const recentQueries = user.queries.map((q) => ({
      query: q.originalQuery,
      date: q.createdAt.toISOString().split("T")[0],
    }));

    // Important papers (from responses with IMPORTANT feedback)
    const importantPapers = user.queries
      .flatMap((q) => q.responses)
      .filter((r) => r.feedback.length > 0)
      .map((r) => {
        const metadata = r.metadata as any;
        return {
          title: r.summary.substring(0, 100),
          concepts: metadata?.concepts || [],
        };
      })
      .slice(0, 5);

    // Current projects from ProjectFocus table
    const projects = user.researchProfile?.currentProjectDetails?.map((p) => ({
      title: p.title,
      description: p.description,
      status: p.status,
    })) || [];

    // Upcoming goals with deadlines
    const goals = user.goals.map((g) => {
      const daysUntil = g.targetDate
        ? Math.ceil((g.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : undefined;
      return {
        type: g.type,
        title: g.title,
        targetDate: g.targetDate?.toISOString().split("T")[0],
        daysUntil,
      };
    });

    // Team activity
    const teamActivity = await this.getTeamActivity(user.department || "");

    // Knowledge gaps
    const gaps = await this.getKnowledgeGaps(userId);

    return {
      profile: {
        name: user.name,
        department: user.department || "General",
        interests: user.researchProfile?.primaryInterests || [],
        expertise: user.researchProfile?.expertiseLevel || "STUDENT",
        phdFocus: user.researchProfile?.phdFocus || undefined,
        yearsInField: user.researchProfile?.yearsInField || undefined,
        techniques: user.researchProfile?.techniques || [],
        computationalSkills: user.researchProfile?.computationalSkills || [],
        highestDegree: user.researchProfile?.highestDegree || undefined,
      },
      recentQueries,
      importantPapers,
      projects,
      goals,
      teamActivity,
      gaps,
    };
  }

  /**
   * Build comprehensive prompt for Claude
   */
  private buildPrompt(context: UserContext): string {
    return `You are an AI research advisor for a researcher at ACM Research Platform.

USER PROFILE:
- Name: ${context.profile.name}
- Department: ${context.profile.department}
- Highest Degree: ${context.profile.highestDegree || "Not specified"}
- Expertise Level: ${context.profile.expertise}${context.profile.yearsInField ? `\n- Years in Field: ${context.profile.yearsInField}` : ""}${context.profile.phdFocus ? `\n- PhD Research Focus: ${context.profile.phdFocus}` : ""}
- Primary Research Interests: ${context.profile.interests.join(", ") || "Not specified yet"}${context.profile.techniques?.length ? `\n- Laboratory Techniques: ${context.profile.techniques.join(", ")}` : ""}${context.profile.computationalSkills?.length ? `\n- Computational Skills: ${context.profile.computationalSkills.join(", ")}` : ""}

RECENT RESEARCH ACTIVITY (Last 10 queries):
${context.recentQueries.map((q) => `- "${q.query}" (${q.date})`).join("\n") || "No recent queries"}

PAPERS MARKED AS IMPORTANT:
${context.importantPapers.map((p) => `- ${p.title}${p.concepts?.length ? ` [Concepts: ${p.concepts.join(", ")}]` : ""}`).join("\n") || "None yet"}

CURRENT RESEARCH PROJECTS:
${context.projects.length > 0 ? context.projects.map((p) => `- ${p.title}${p.description ? `: ${p.description.substring(0, 100)}` : ""} [Status: ${p.status}]`).join("\n") : "No active projects specified"}

UPCOMING GOALS & DEADLINES:
${context.goals.length > 0 ? context.goals.map((g) => `- [${g.type}] ${g.title}${g.daysUntil !== undefined ? ` (${g.daysUntil > 0 ? `in ${g.daysUntil} days` : g.daysUntil === 0 ? "TODAY!" : `${Math.abs(g.daysUntil)} days overdue`})` : ""}`).join("\n") : "No upcoming goals"}

TEAM RESEARCH ACTIVITY (Same department):
${context.teamActivity.length > 0 ? context.teamActivity.map((a) => `- ${a.researcher}: ${a.topic}`).join("\n") : "No team activity data"}

KNOWLEDGE GAPS (Areas not yet explored):
${context.gaps.join(", ") || "No gaps identified"}

INSTRUCTIONS:
Generate 10 highly relevant research questions this person should explore next. Make them:
1. Highly relevant to their current research trajectory${context.profile.phdFocus ? ` and PhD focus (${context.profile.phdFocus})` : ""}
2. Actionable (can be researched using available tools)
3. Progressive (build on existing knowledge and expertise)
4. Diverse (cover different aspects and question types)
5. Timely (consider current trends${context.goals.length > 0 ? ` and upcoming deadlines` : ""})
6. Valuable (high potential to advance their research${context.projects.length > 0 ? " projects" : ""})${context.goals.some((g) => g.daysUntil !== undefined && g.daysUntil <= 30 && g.daysUntil >= 0) ? `\n7. URGENT: Prioritize questions that help with upcoming goals/deadlines (within 30 days)` : ""}

Mix these question types:
- CONTINUATION: Natural follow-ups to recent work
- DEEPENING: Dig into specific mechanisms or details
- BRIDGING: Connect different research areas
- TREND: What's new and emerging in the field
- PRACTICAL: Clinical/translational applications${context.profile.techniques?.length ? ` (relevant to their techniques: ${context.profile.techniques?.join(", ")})` : ""}
- GAP: Unexplored but relevant areas
- COMPARISON: Compare approaches or concepts
- EXPLORATION: New promising directions

For each question, consider:
- The researcher's expertise level (${context.profile.expertise})${context.profile.yearsInField ? ` with ${context.profile.yearsInField} years experience` : ""}
- Their recent query patterns and research trajectory
- Active research projects and their current status
- Upcoming goals and deadlines (especially urgent ones)
- Their laboratory skills${context.profile.techniques?.length ? ` (${context.profile.techniques.slice(0, 3).join(", ")})` : ""}
- Their computational abilities${context.profile.computationalSkills?.length ? ` (${context.profile.computationalSkills.slice(0, 3).join(", ")})` : ""}
- Team interests and potential collaborations
- Identified knowledge gaps

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "question": "The specific research question",
      "type": "CONTINUATION|DEEPENING|BRIDGING|TREND|PRACTICAL|GAP|COMPARISON|EXPLORATION",
      "reasoning": "Why this question is relevant and valuable (1-2 sentences)",
      "priority": "high|medium|low"
    }
  ]
}

Make questions natural, specific, and genuinely useful for advancing their research.`;
  }

  /**
   * Parse Claude's response into structured questions
   */
  private parseClaudeResponse(content: string): LLMGeneratedQuestion[] {
    try {
      // Extract JSON from response (Claude sometimes adds markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in Claude response");
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        console.error("Invalid questions format");
        return [];
      }

      return parsed.questions.map((q: any) => ({
        question: q.question,
        type: this.mapToQuestionCategory(q.type),
        reasoning: q.reasoning,
        priority: q.priority || "medium",
        score: this.priorityToScore(q.priority),
        sourceType: "LLM_GENERATED",
      }));
    } catch (error) {
      console.error("Error parsing Claude response:", error);
      return [];
    }
  }

  /**
   * Map LLM response type to QuestionCategory enum
   */
  private mapToQuestionCategory(type: string): QuestionCategory {
    const mapping: Record<string, QuestionCategory> = {
      CONTINUATION: "CONTINUATION",
      DEEPENING: "DEEPENING",
      BRIDGING: "BRIDGING",
      TREND: "TREND",
      PRACTICAL: "PRACTICAL",
      GAP: "GAP",
      COMPARISON: "COMPARISON",
      EXPLORATION: "EXPLORATION",
    };

    return mapping[type] || "EXPLORATION";
  }

  /**
   * Convert priority to numeric score
   */
  private priorityToScore(priority: string): number {
    const scores: Record<string, number> = {
      high: 0.9,
      medium: 0.7,
      low: 0.5,
    };

    return scores[priority] || 0.7;
  }

  /**
   * Generate questions for new users
   */
  private async generateNewUserQuestions(
    context: UserContext
  ): Promise<LLMGeneratedQuestion[]> {
    const prompt = `You are an AI research advisor for a new researcher at ACM Research Platform.

USER PROFILE:
- Department: ${context.profile.department}
- Expertise Level: ${context.profile.expertise}
- Stated Interests: ${context.profile.interests.join(", ") || "Not specified yet"}

This is a NEW USER with no query history yet.

Generate 5 excellent starter questions for someone in ${context.profile.department} to help them:
1. Get familiar with the research platform
2. Explore their field effectively
3. Discover relevant recent breakthroughs
4. Understand current trends
5. Find impactful research directions

Return ONLY a valid JSON object:
{
  "questions": [
    {
      "question": "The specific research question",
      "type": "TREND|EXPLORATION|PRACTICAL",
      "reasoning": "Why this is a great starting question",
      "priority": "high"
    }
  ]
}`;

    try {
      const response = await queryClaude({
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      });

      return this.parseClaudeResponse(response.content);
    } catch (error) {
      console.error("Error generating new user questions:", error);
      // Fallback to hardcoded questions
      return this.getFallbackNewUserQuestions(context.profile.department || "general");
    }
  }

  /**
   * Fallback questions if LLM fails
   */
  private getFallbackNewUserQuestions(department: string): LLMGeneratedQuestion[] {
    const questions: Record<string, LLMGeneratedQuestion[]> = {
      "Cancer Research": [
        {
          question: "What are the latest breakthroughs in CAR-T cell therapy for solid tumors?",
          type: "TREND",
          reasoning: "CAR-T therapy is rapidly evolving. Understanding recent advances is crucial.",
          priority: "high",
          score: 0.9,
          sourceType: "LLM_GENERATED",
        },
        {
          question: "Which immunotherapy approaches show the most promise in 2025?",
          type: "TREND",
          reasoning: "Staying current with immunotherapy trends is essential for cancer research.",
          priority: "high",
          score: 0.9,
          sourceType: "LLM_GENERATED",
        },
      ],
      General: [
        {
          question: "What are the most cited cancer research papers published this year?",
          type: "TREND",
          reasoning: "High-impact papers shape the direction of research.",
          priority: "high",
          score: 0.9,
          sourceType: "LLM_GENERATED",
        },
      ],
    };

    return questions[department] || questions["General"];
  }

  /**
   * Get what other team members are researching
   */
  private async getTeamActivity(
    department: string
  ): Promise<Array<{ researcher: string; topic: string }>> {
    if (!department) return [];

    try {
      const recentTeamQueries = await prisma.query.findMany({
        where: {
          user: {
            department,
          },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
          status: "COMPLETED",
        },
        include: {
          user: true,
        },
        take: 10,
      });

      return recentTeamQueries.map((q) => ({
        researcher: q.user.name,
        topic: q.originalQuery.substring(0, 60),
      }));
    } catch (error) {
      console.error("Error fetching team activity:", error);
      return [];
    }
  }

  /**
   * Get knowledge gaps from database
   */
  private async getKnowledgeGaps(userId: string): Promise<string[]> {
    try {
      const gaps = await prisma.knowledgeGraphGap.findMany({
        where: {
          relevantUsers: {
            has: userId,
          },
          addressed: false,
        },
        orderBy: {
          potentialImpact: "desc",
        },
        take: 5,
      });

      return gaps.map((g) => g.missingConcept);
    } catch (error) {
      console.error("Error fetching knowledge gaps:", error);
      return [];
    }
  }
}
