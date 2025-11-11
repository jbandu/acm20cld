/**
 * API Endpoint: Get Onboarding Status
 *
 * Returns user's current onboarding progress
 */

import { NextResponse } from "next/server";
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

    // Get user's research profile with onboarding status
    const profile = await prisma.userResearchProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        onboardingComplete: true,
        onboardingStep: true,
      },
    });

    // Get user's basic info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        title: true,
        institution: true,
        department: true,
      },
    });

    return NextResponse.json({
      onboardingComplete: profile?.onboardingComplete || false,
      currentStep: profile?.onboardingStep || 0,
      user,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch onboarding status",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
