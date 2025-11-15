import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";
import { calculateUserSpending } from "@/lib/utils/cost-calculator";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    // Only managers and admins can access cost reports
    if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Manager or Admin role required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "30");

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (userId) {
      // Get cost report for specific user
      const queries = await prisma.query.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
        },
      });

      const spending = calculateUserSpending(queries);

      return NextResponse.json({
        user,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
        spending: {
          ...spending,
          recentQueries: queries.slice(0, 10).map((q) => ({
            id: q.id,
            query: q.originalQuery,
            createdAt: q.createdAt,
            status: q.status,
            llms: q.llms,
            sources: q.sources,
          })),
        },
      });
    } else {
      // Get cost report for all users
      const allQueries = await prisma.query.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Group queries by user
      const queriesByUser: Record<string, any[]> = {};
      allQueries.forEach((query) => {
        if (!queriesByUser[query.userId]) {
          queriesByUser[query.userId] = [];
        }
        queriesByUser[query.userId].push(query);
      });

      // Calculate spending per user
      const userSpending = Object.entries(queriesByUser).map(
        ([userId, queries]) => {
          const user = queries[0].user;
          const spending = calculateUserSpending(queries);

          return {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department,
            },
            spending,
          };
        }
      );

      // Sort by total cost descending
      userSpending.sort((a, b) => b.spending.totalCost - a.spending.totalCost);

      // Calculate organization totals
      const orgTotal = userSpending.reduce(
        (sum, u) => sum + u.spending.totalCost,
        0
      );
      const orgQueryCount = userSpending.reduce(
        (sum, u) => sum + u.spending.queryCount,
        0
      );

      return NextResponse.json({
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
        organization: {
          totalCost: orgTotal,
          totalQueries: orgQueryCount,
          averageCostPerQuery:
            orgQueryCount > 0 ? orgTotal / orgQueryCount : 0,
          userCount: userSpending.length,
        },
        users: userSpending,
      });
    }
  } catch (error: any) {
    console.error("Cost report API error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "An error occurred while generating cost report",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
