/**
 * API Endpoint: Track Question Click
 *
 * Records when a user clicks on a suggested question.
 * This helps us learn which questions are most engaging.
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
        { error: "Unauthorized to track this question" },
        { status: 403 }
      );
    }

    // Update click status
    await prisma.suggestedQuestion.update({
      where: { id: questionId },
      data: {
        clicked: true,
        clickedAt: new Date(),
      },
    });

    console.log(`Question ${questionId} clicked by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      questionId,
      message: "Click tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking question click:", error);
    return NextResponse.json(
      {
        error: "Failed to track click",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
