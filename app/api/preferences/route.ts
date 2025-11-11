/**
 * API Endpoint: User Preferences Management
 *
 * GET: Fetch user preferences
 * PATCH: Update user preferences
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Return defaults if no preferences exist yet
    if (!preferences) {
      preferences = {
        id: "",
        userId: session.user.id,
        preferredSources: ["openalex", "pubmed"],
        preferredLLMs: ["claude"],
        defaultSearchDepth: "standard",
        openAccessOnly: false,
        preferredJournals: [],
        excludeJournals: [],
        minCitations: null,
        maxYearsOld: null,
        preferReviews: false,
        preferOriginalResearch: true,
        preferClinical: false,
        emailDigest: true,
        digestFrequency: "weekly",
        notifyNewPapers: true,
        notifyTeamActivity: true,
        resultsPerPage: 20,
        showAbstracts: true,
        showKeyFindings: true,
        compactView: false,
        questionSuggestions: true,
        proactiveSuggestions: true,
        suggestionFrequency: "moderate",
        profileVisibility: "team",
        shareActivityFeed: true,
        shareKnowledge: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch preferences",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Check if preferences exist
    const existing = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    let preferences;
    if (existing) {
      preferences = await prisma.userPreferences.update({
        where: { userId: session.user.id },
        data: body,
      });
    } else {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          ...body,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to update preferences",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
