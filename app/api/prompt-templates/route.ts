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
    const category = searchParams.get("category");

    const templates = await prisma.promptTemplate.findMany({
      where: {
        AND: [
          category ? { category } : {},
          {
            OR: [{ isPublic: true }, { createdBy: session.user.id }],
          },
        ],
      },
      orderBy: [{ isDefault: "desc" }, { usageCount: "desc" }],
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching prompt templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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
    const { name, description, category, template, variables, isPublic } =
      body;

    if (!name || !category || !template) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTemplate = await prisma.promptTemplate.create({
      data: {
        name,
        description,
        category,
        template,
        variables: variables || [],
        isPublic: isPublic || false,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error("Error creating prompt template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
