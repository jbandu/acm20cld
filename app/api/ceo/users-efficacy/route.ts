import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/CEO
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users with their research metrics
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        title: true,
        department: true,
        institution: true,
        lastLoginAt: true,
        createdAt: true,
        queries: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        feedback: {
          select: {
            id: true,
            type: true,
            createdAt: true,
          },
        },
        contributions: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        researchProfile: {
          select: {
            onboardingComplete: true,
            primaryInterests: true,
            expertiseLevel: true,
            yearsInField: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Calculate efficacy metrics for each user
    const usersWithMetrics = users.map((user) => {
      const totalQueries = user.queries.length;
      const completedQueries = user.queries.filter(
        (q) => q.status === "COMPLETED"
      ).length;
      const failedQueries = user.queries.filter(
        (q) => q.status === "FAILED"
      ).length;

      // Calculate queries per week
      const accountAge = Date.now() - user.createdAt.getTime();
      const weeksActive = accountAge / (1000 * 60 * 60 * 24 * 7);
      const queriesPerWeek = weeksActive > 0 ? totalQueries / weeksActive : 0;

      // Calculate average completion time
      const completedWithTime = user.queries.filter(
        (q) => q.completedAt && q.status === "COMPLETED"
      );
      const avgCompletionTime =
        completedWithTime.length > 0
          ? completedWithTime.reduce((sum, q) => {
              const time =
                (q.completedAt!.getTime() - q.createdAt.getTime()) /
                (1000 * 60);
              return sum + time;
            }, 0) / completedWithTime.length
          : 0;

      // Last activity
      const lastQuery =
        user.queries.length > 0 ? user.queries[0].createdAt : null;
      const lastActivity = lastQuery || user.lastLoginAt || user.createdAt;

      // Days since last activity
      const daysSinceLastActivity = Math.floor(
        (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Success rate
      const successRate =
        totalQueries > 0 ? (completedQueries / totalQueries) * 100 : 0;

      // Engagement score (0-100)
      const engagementScore = Math.min(
        100,
        Math.round(
          queriesPerWeek * 10 +
            successRate * 0.5 +
            user.feedback.length * 2 +
            user.contributions.length * 5
        )
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title || "Researcher",
        department: user.department,
        institution: user.institution,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        lastActivity,
        daysSinceLastActivity,
        onboardingComplete: user.researchProfile?.onboardingComplete || false,
        primaryInterests: user.researchProfile?.primaryInterests || [],
        expertiseLevel: user.researchProfile?.expertiseLevel,
        yearsInField: user.researchProfile?.yearsInField,
        metrics: {
          totalQueries,
          completedQueries,
          failedQueries,
          queriesPerWeek: Math.round(queriesPerWeek * 10) / 10,
          avgCompletionTimeMinutes: Math.round(avgCompletionTime * 10) / 10,
          successRate: Math.round(successRate * 10) / 10,
          totalFeedback: user.feedback.length,
          totalContributions: user.contributions.length,
          engagementScore,
        },
      };
    });

    // Calculate platform-wide statistics
    const totalUsers = usersWithMetrics.length;
    const activeUsers = usersWithMetrics.filter(
      (u) => u.daysSinceLastActivity <= 7
    ).length;
    const totalQueries = usersWithMetrics.reduce(
      (sum, u) => sum + u.metrics.totalQueries,
      0
    );
    const avgEngagement =
      totalUsers > 0
        ? usersWithMetrics.reduce(
            (sum, u) => sum + u.metrics.engagementScore,
            0
          ) / totalUsers
        : 0;

    return NextResponse.json({
      users: usersWithMetrics,
      platformStats: {
        totalUsers,
        activeUsers,
        totalQueries,
        avgEngagement: Math.round(avgEngagement),
        onboardingComplete: usersWithMetrics.filter(
          (u) => u.onboardingComplete
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching user efficacy data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user efficacy data" },
      { status: 500 }
    );
  }
}
