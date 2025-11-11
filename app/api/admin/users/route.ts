/**
 * API Endpoint: Admin - List Users
 *
 * Returns all users with their profile data for admin management
 */

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

    // Check if user is admin/manager
    if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const onboardingStatus = searchParams.get("onboarding") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { institution: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (onboardingStatus === "complete") {
      where.researchProfile = {
        onboardingComplete: true,
      };
    } else if (onboardingStatus === "incomplete") {
      where.OR = [
        { researchProfile: null },
        { researchProfile: { onboardingComplete: false } },
      ];
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with profile data
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        title: true,
        institution: true,
        department: true,
        location: true,
        createdAt: true,
        researchProfile: {
          select: {
            onboardingComplete: true,
            onboardingStep: true,
            expertiseLevel: true,
            primaryInterests: true,
            highestDegree: true,
          },
        },
        queries: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            queries: true,
            goals: true,
          },
        },
      },
    });

    // Transform data for response
    const usersData = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      institution: user.institution,
      department: user.department,
      location: user.location,
      createdAt: user.createdAt,
      onboarding: {
        complete: user.researchProfile?.onboardingComplete || false,
        currentStep: user.researchProfile?.onboardingStep || 0,
      },
      profile: {
        expertiseLevel: user.researchProfile?.expertiseLevel,
        interests: user.researchProfile?.primaryInterests || [],
        highestDegree: user.researchProfile?.highestDegree,
      },
      stats: {
        totalQueries: user._count.queries,
        completedQueries: user.queries.filter((q) => q.status === "COMPLETED").length,
        goals: user._count.goals,
      },
    }));

    return NextResponse.json({
      users: usersData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
