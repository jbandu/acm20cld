import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-config";
import { getRedisClient } from "@/lib/db/redis";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is manager or admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["MANAGER", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    // If userId is provided, get stats for that user; otherwise get all users
    if (userId) {
      const stats = await getUserRateLimitStats(userId);
      return NextResponse.json(stats);
    } else {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      const statsPromises = allUsers.map(async (user) => {
        const stats = await getUserRateLimitStats(user.id);
        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          ...stats,
        };
      });

      const allStats = await Promise.all(statsPromises);

      return NextResponse.json(allStats);
    }
  } catch (error) {
    console.error("Error fetching rate limit stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate limit stats" },
      { status: 500 }
    );
  }
}

async function getUserRateLimitStats(userId: string) {
  const redis = await getRedisClient();

  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const dayAgo = now - 24 * 60 * 60 * 1000;

  try {
    // Get rate limit keys for this user
    const hourKey = `ratelimit:${userId}:hour`;
    const dayKey = `ratelimit:${userId}:day`;

    // Get current counts
    const hourCount = await redis.get(hourKey);
    const dayCount = await redis.get(dayKey);

    // Get TTL for the keys
    const hourTTL = await redis.ttl(hourKey);
    const dayTTL = await redis.ttl(dayKey);

    // Get recent queries from database
    const recentQueries = await prisma.query.count({
      where: {
        userId,
        startedAt: {
          gte: new Date(hourAgo),
        },
      },
    });

    const todayQueries = await prisma.query.count({
      where: {
        userId,
        startedAt: {
          gte: new Date(dayAgo),
        },
      },
    });

    // Rate limits (adjust these based on your configuration)
    const HOUR_LIMIT = 20;
    const DAY_LIMIT = 100;

    return {
      hourly: {
        count: parseInt(hourCount || "0"),
        limit: HOUR_LIMIT,
        remaining: HOUR_LIMIT - parseInt(hourCount || "0"),
        resetIn: hourTTL > 0 ? hourTTL : 3600,
      },
      daily: {
        count: parseInt(dayCount || "0"),
        limit: DAY_LIMIT,
        remaining: DAY_LIMIT - parseInt(dayCount || "0"),
        resetIn: dayTTL > 0 ? dayTTL : 86400,
      },
      recentActivity: {
        lastHour: recentQueries,
        last24Hours: todayQueries,
      },
    };
  } catch (error) {
    console.error("Error getting user rate limit stats:", error);
    // Return default values if Redis is not available
    return {
      hourly: {
        count: 0,
        limit: 20,
        remaining: 20,
        resetIn: 3600,
      },
      daily: {
        count: 0,
        limit: 100,
        remaining: 100,
        resetIn: 86400,
      },
      recentActivity: {
        lastHour: 0,
        last24Hours: 0,
      },
    };
  }
}
