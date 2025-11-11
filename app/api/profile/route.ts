/**
 * API Endpoint: User Profile Management
 *
 * GET: Fetch complete user profile
 * PATCH: Update user profile
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

    // Get complete user profile with all relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        researchProfile: {
          include: {
            education: true,
            currentProjectDetails: true,
          },
        },
        preferences: true,
        goals: {
          include: {
            milestones: true,
          },
          orderBy: {
            targetDate: "asc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch profile",
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
    const {
      // Basic user fields
      name,
      title,
      institution,
      department,
      location,
      bio,
      avatar,
      // Research profile fields
      researchAreas,
      primaryInterests,
      secondaryInterests,
      techniques,
      computationalSkills,
      expertiseLevel,
      yearsInField,
      highestDegree,
      phdFocus,
      researchStatement,
      googleScholarId,
      orcid,
    } = body;

    // Update User model
    const userUpdate: any = {};
    if (name !== undefined) userUpdate.name = name;
    if (title !== undefined) userUpdate.title = title;
    if (institution !== undefined) userUpdate.institution = institution;
    if (department !== undefined) userUpdate.department = department;
    if (location !== undefined) userUpdate.location = location;
    if (bio !== undefined) userUpdate.bio = bio;
    if (avatar !== undefined) userUpdate.avatar = avatar;

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userUpdate,
      });
    }

    // Update Research Profile
    const profileUpdate: any = {};
    if (researchAreas !== undefined) profileUpdate.researchAreas = researchAreas;
    if (primaryInterests !== undefined) profileUpdate.primaryInterests = primaryInterests;
    if (secondaryInterests !== undefined) profileUpdate.secondaryInterests = secondaryInterests;
    if (techniques !== undefined) profileUpdate.techniques = techniques;
    if (computationalSkills !== undefined) profileUpdate.computationalSkills = computationalSkills;
    if (expertiseLevel !== undefined) profileUpdate.expertiseLevel = expertiseLevel;
    if (yearsInField !== undefined) profileUpdate.yearsInField = yearsInField;
    if (highestDegree !== undefined) profileUpdate.highestDegree = highestDegree;
    if (phdFocus !== undefined) profileUpdate.phdFocus = phdFocus;
    if (researchStatement !== undefined) profileUpdate.researchStatement = researchStatement;
    if (googleScholarId !== undefined) profileUpdate.googleScholarId = googleScholarId;
    if (orcid !== undefined) profileUpdate.orcid = orcid;

    if (Object.keys(profileUpdate).length > 0) {
      // Get or create research profile
      const existingProfile = await prisma.userResearchProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (existingProfile) {
        await prisma.userResearchProfile.update({
          where: { userId: session.user.id },
          data: profileUpdate,
        });
      } else {
        await prisma.userResearchProfile.create({
          data: {
            userId: session.user.id,
            ...profileUpdate,
            primaryInterests: profileUpdate.primaryInterests || [],
            secondaryInterests: profileUpdate.secondaryInterests || [],
            researchAreas: profileUpdate.researchAreas || [],
            techniques: profileUpdate.techniques || [],
            computationalSkills: profileUpdate.computationalSkills || [],
            collaborators: [],
            institutions: [],
            preferredSources: [],
            preferredLLMs: [],
            currentProjects: [],
            currentGoals: [],
            researchGoals: [],
            similarResearchers: [],
            teamInterests: [],
            queryFrequency: {},
            activeHours: {},
            weeklyPattern: {},
            paperPreferences: {},
            topicVelocity: {},
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
