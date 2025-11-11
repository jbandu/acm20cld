import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    try {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn("Redis connection failed after 3 retries");
            return null; // Stop retrying
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        lazyConnect: true, // Don't connect immediately
      });

      redis.on("error", (error) => {
        console.warn("Redis connection error (non-critical):", error.message);
      });

      redis.on("connect", () => {
        console.log("✅ Redis connected");
      });
    } catch (error) {
      console.warn("Redis initialization failed:", error);
      throw error;
    }
  }

  return redis;
}

export async function closeRedisClient(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

// Cache helper functions

export async function cacheSet(
  key: string,
  value: any,
  ttlSeconds: number = 3600
): Promise<void> {
  const client = getRedisClient();
  await client.setex(key, ttlSeconds, JSON.stringify(value));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const data = await client.get(key);

  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function cacheDel(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

export async function cacheExists(key: string): Promise<boolean> {
  const client = getRedisClient();
  const exists = await client.exists(key);
  return exists === 1;
}

// Rate limiting

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const client = getRedisClient();

    // Try to connect if not connected
    if (client.status !== "ready") {
      await client.connect();
    }

    const key = `rate_limit:${identifier}`;

    const current = await client.incr(key);

    if (current === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);

    return {
      allowed: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
    };
  } catch (error) {
    console.warn("Rate limiting unavailable, allowing request:", error);
    // If Redis is unavailable, allow the request
    return {
      allowed: true,
      remaining: maxRequests,
    };
  }
}

// Session management

export async function createSession(
  sessionId: string,
  data: any,
  ttlSeconds: number = 86400
): Promise<void> {
  const client = getRedisClient();
  await client.setex(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  return cacheGet<T>(`session:${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await cacheDel(`session:${sessionId}`);
}

// Job queue helpers (for BullMQ)

export async function getQueueStats(queueName: string) {
  const client = getRedisClient();

  const [waiting, active, completed, failed] = await Promise.all([
    client.llen(`bull:${queueName}:wait`),
    client.llen(`bull:${queueName}:active`),
    client.scard(`bull:${queueName}:completed`),
    client.scard(`bull:${queueName}:failed`),
  ]);

  return { waiting, active, completed, failed };
}
