import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const responseId = searchParams.get("responseId");

    if (!responseId) {
      return NextResponse.json(
        { error: "responseId is required" },
        { status: 400 }
      );
    }

    const annotations = await prisma.annotation.findMany({
      where: {
        responseId,
        OR: [{ isPublic: true }, { userId: session.user.id }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(annotations);
  } catch (error) {
    console.error("Error fetching annotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch annotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      responseId,
      content,
      highlightedText,
      startOffset,
      endOffset,
      isPublic,
      tags,
    } = body;

    if (!responseId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const annotation = await prisma.annotation.create({
      data: {
        responseId,
        userId: session.user.id,
        content,
        highlightedText,
        startOffset,
        endOffset,
        isPublic: isPublic || false,
        tags: tags || [],
      },
    });

    return NextResponse.json(annotation);
  } catch (error) {
    console.error("Error creating annotation:", error);
    return NextResponse.json(
      { error: "Failed to create annotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const annotationId = searchParams.get("id");

    if (!annotationId) {
      return NextResponse.json(
        { error: "annotation id is required" },
        { status: 400 }
      );
    }

    // Check if user owns the annotation
    const annotation = await prisma.annotation.findUnique({
      where: { id: annotationId },
    });

    if (!annotation || annotation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.annotation.delete({
      where: { id: annotationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting annotation:", error);
    return NextResponse.json(
      { error: "Failed to delete annotation" },
      { status: 500 }
    );
  }
}
