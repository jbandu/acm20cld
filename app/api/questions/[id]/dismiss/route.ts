/**
 * API Endpoint: Dismiss Question
 *
 * Records when a user dismisses a suggested question.
 * This helps us learn which questions are not useful.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: questionId } = await params;

    // Validate question ID
    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Check if question exists and belongs to user
    const question = await prisma.suggestedQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to dismiss this question" },
        { status: 403 }
      );
    }

    // Update dismissal status
    await prisma.suggestedQuestion.update({
      where: { id: questionId },
      data: {
        dismissed: true,
        dismissedAt: new Date(),
      },
    });

    console.log(`Question ${questionId} dismissed by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      questionId,
      message: "Question dismissed successfully",
    });
  } catch (error) {
    console.error("Error dismissing question:", error);
    return NextResponse.json(
      {
        error: "Failed to dismiss question",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
