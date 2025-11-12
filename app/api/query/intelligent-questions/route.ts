import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

interface QuestionSuggestion {
  id: string;
  text: string;
  category: "trending" | "profile" | "recent" | "team" | "conference";
  reasoning: string;
  relevanceScore: number;
}

export async function GET() {
  try {
    const session = await requireAuth();

    // Fetch user profile with research interests
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        researchProfile: true,
      },
    });

    // Fetch user's recent queries
    const recentQueries = await prisma.query.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        originalQuery: true,
        createdAt: true,
      },
    });

    // Fetch team activity (queries from same department)
    const teamActivity = userProfile?.department
      ? await prisma.query.findMany({
          where: {
            user: {
              department: userProfile.department,
            },
            NOT: {
              userId: session.user.id,
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            originalQuery: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        })
      : [];

    const questions: QuestionSuggestion[] = [];

    // Generate questions based on user's research profile
    if (userProfile?.researchProfile) {
      const interests = userProfile.researchProfile.primaryInterests || [];
      const expertiseLevel = userProfile.researchProfile.expertiseLevel || "Intermediate";

      if (interests.length > 0) {
        // Profile-based question 1
        questions.push({
          id: `profile-${Date.now()}-1`,
          text: `What are the latest breakthroughs in ${interests[0]}?`,
          category: "profile",
          reasoning: `Based on your primary research interest in ${interests[0]}`,
          relevanceScore: 95,
        });

        // Profile-based question 2 (if multiple interests)
        if (interests.length > 1) {
          questions.push({
            id: `profile-${Date.now()}-2`,
            text: `How does ${interests[0]} intersect with ${interests[1]}?`,
            category: "profile",
            reasoning: `Connecting your research interests in ${interests[0]} and ${interests[1]}`,
            relevanceScore: 90,
          });
        }

        // Expertise-level specific question
        if (expertiseLevel === "STUDENT" || expertiseLevel === "EARLY_CAREER") {
          questions.push({
            id: `profile-${Date.now()}-3`,
            text: `What foundational papers should I read about ${interests[0]}?`,
            category: "profile",
            reasoning: `Recommended for early-career researchers in ${interests[0]}`,
            relevanceScore: 88,
          });
        } else {
          questions.push({
            id: `profile-${Date.now()}-3`,
            text: `What are emerging research gaps in ${interests[0]}?`,
            category: "profile",
            reasoning: `Advanced research opportunities in ${interests[0]}`,
            relevanceScore: 92,
          });
        }
      }
    }

    // Generate questions based on recent queries
    if (recentQueries.length > 0) {
      const latestQuery = recentQueries[0];
      const daysSinceLastQuery = Math.floor(
        (Date.now() - new Date(latestQuery.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      questions.push({
        id: `recent-${Date.now()}-1`,
        text: `Any updates on "${latestQuery.originalQuery.substring(0, 50)}${latestQuery.originalQuery.length > 50 ? "..." : ""}"?`,
        category: "recent",
        reasoning: `Follow-up on your query from ${daysSinceLastQuery} day${daysSinceLastQuery !== 1 ? "s" : ""} ago`,
        relevanceScore: 85,
      });
    }

    // Generate questions based on team activity
    if (teamActivity.length > 0) {
      const randomTeamQuery = teamActivity[Math.floor(Math.random() * Math.min(5, teamActivity.length))];
      questions.push({
        id: `team-${Date.now()}-1`,
        text: randomTeamQuery.originalQuery,
        category: "team",
        reasoning: `Recently explored by ${randomTeamQuery.user.name.split(" ")[0]} in your department`,
        relevanceScore: 75,
      });
    }

    // Add trending/timely questions for cancer research
    const trendingQuestions = [
      {
        id: `trending-${Date.now()}-1`,
        text: "What are the latest CAR-T cell therapy developments for solid tumors?",
        category: "trending" as const,
        reasoning: "Hot topic in cancer immunotherapy research this month",
        relevanceScore: 82,
      },
      {
        id: `trending-${Date.now()}-2`,
        text: "How are AI models being used in drug discovery for cancer?",
        category: "trending" as const,
        reasoning: "Rapidly growing intersection of AI and oncology",
        relevanceScore: 80,
      },
      {
        id: `trending-${Date.now()}-3`,
        text: "What new biomarkers are being validated for early cancer detection?",
        category: "trending" as const,
        reasoning: "Major focus area in precision oncology",
        relevanceScore: 78,
      },
    ];

    // Add conference-related questions
    const conferenceQuestions = [
      {
        id: `conference-${Date.now()}-1`,
        text: "What were the key announcements at ASCO 2024?",
        category: "conference" as const,
        reasoning: "Major oncology conference with recent updates",
        relevanceScore: 77,
      },
      {
        id: `conference-${Date.now()}-2`,
        text: "What are the submission deadlines for upcoming cancer research conferences?",
        category: "conference" as const,
        reasoning: "Plan ahead for presenting your research",
        relevanceScore: 70,
      },
    ];

    // Mix in some trending and conference questions
    questions.push(trendingQuestions[Math.floor(Math.random() * trendingQuestions.length)]);
    questions.push(conferenceQuestions[Math.floor(Math.random() * conferenceQuestions.length)]);

    // Sort by relevance score and return top questions
    const sortedQuestions = questions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json({
      questions: sortedQuestions,
    });
  } catch (error: any) {
    console.error("Intelligent questions API error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
