import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        researchProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive fields before returning
    const { password, mfaSecret, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name.trim(),
        title: body.title,
        department: body.department,
        institution: body.institution,
        location: body.location,
        bio: body.bio,
        emailNotifications: body.emailNotifications,
        notifyOnQueryComplete: body.notifyOnQueryComplete,
        notifyWeeklyDigest: body.notifyWeeklyDigest,
      },
    });

    // Update or create research profile if data is provided
    if (body.researchProfile) {
      const researchProfileData = {
        highestDegree: body.researchProfile.highestDegree,
        yearsInField: body.researchProfile.yearsInField,
        orcidId: body.researchProfile.orcidId,
        googleScholarId: body.researchProfile.googleScholarId,
        phdFocus: body.researchProfile.phdFocus,
        primaryInterests: body.researchProfile.primaryInterests || [],
        secondaryInterests: body.researchProfile.secondaryInterests || [],
        techniques: body.researchProfile.techniques || [],
        computationalSkills: body.researchProfile.computationalSkills || [],
      };

      await prisma.userResearchProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          ...researchProfileData,
          researchAreas: [],
          currentProjects: [],
          currentGoals: [],
          researchGoals: [],
          preferredSources: [],
          preferredLLMs: [],
          queryFrequency: {},
          activeHours: {},
          weeklyPattern: {},
          paperPreferences: {},
          topicVelocity: {},
          similarResearchers: [],
          teamInterests: [],
          collaborators: [],
          institutions: [],
        },
        update: researchProfileData,
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
