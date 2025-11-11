/**
 * API Endpoint: Get Suggested Questions
 *
 * Returns intelligent question suggestions for the authenticated user
 * based on their research profile, history, and knowledge graph.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { QuestionOrchestrator } from "@/lib/intelligence/question-orchestrator";

const orchestrator = new QuestionOrchestrator();

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: "Invalid limit parameter (must be between 1 and 20)" },
        { status: 400 }
      );
    }

    console.log(`Fetching ${limit} suggested questions for user ${session.user.id}`);

    // Generate top questions
    const questions = await orchestrator.getTopQuestions(session.user.id, limit);

    // Mark as displayed
    if (questions.length > 0) {
      // We'll update the database to mark these as displayed in a non-blocking way
      // This could be done in a background job or async task
      setImmediate(async () => {
        try {
          const { prisma } = await import("@/lib/db/prisma");
          const questionTexts = questions.map((q) => q.question);

          await prisma.suggestedQuestion.updateMany({
            where: {
              userId: session.user!.id,
              question: { in: questionTexts },
              displayed: false,
            },
            data: {
              displayed: true,
              displayedAt: new Date(),
            },
          });
        } catch (error) {
          console.error("Error marking questions as displayed:", error);
        }
      });
    }

    return NextResponse.json({
      questions,
      count: questions.length,
      generated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in suggested questions API:", error);
    return NextResponse.json(
      {
        error: "Failed to generate question suggestions",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to manually refresh suggestions (bypass cache)
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log(`Force refreshing questions for user ${session.user.id}`);

    // Clear cache first
    await orchestrator.clearCache(session.user.id);

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Generate fresh questions
    const questions = await orchestrator.getTopQuestions(session.user.id, limit);

    return NextResponse.json({
      questions,
      count: questions.length,
      generated: new Date().toISOString(),
      refreshed: true,
    });
  } catch (error) {
    console.error("Error refreshing questions:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh question suggestions",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
