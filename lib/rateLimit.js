import { Redis } from "@upstash/redis";

const REDIS_TIMEOUT_MS = 1500;

let redis = null;

function getRedis() {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redis = new Redis({ url, token });
  }

  return redis;
}

function withTimeout(promise, ms = REDIS_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Redis timeout")), ms)
    ),
  ]);
}

/**
 * Simple rate limiter using INCR + EXPIRE (works with all Redis permissions)
 */
export async function rateLimit({
  identifier,
  limit = 5,
  window = 60,
  prefix = "rl",
}) {
  const client = getRedis();

  if (!client) {
    return rateLimitMemory({ identifier, limit, window: window * 1000 });
  }

  const key = `${prefix}:${identifier}:${Math.floor(Date.now() / (window * 1000))}`;

  try {
    const count = await withTimeout(client.incr(key));

    if (count === 1) {
      await withTimeout(client.expire(key, window));
    }

    const remaining = Math.max(0, limit - count);

    return {
      success: count <= limit,
      remaining,
      limit,
      reset: Math.ceil(Date.now() / 1000) + window,
    };
  } catch (error) {
    console.error("Rate limit error:", error.message);
    return rateLimitMemory({ identifier, limit, window: window * 1000 });
  }
}

const memoryStore = new Map();

export function rateLimitMemory({
  identifier,
  limit = 5,
  window = 60000,
}) {
  const now = Date.now();
  const windowKey = Math.floor(now / window);
  const key = `${identifier}:${windowKey}`;

  let count = memoryStore.get(key) || 0;
  count++;
  memoryStore.set(key, count);

  if (memoryStore.size > 1000) {
    const cutoff = Math.floor(now / window) - 2;
    for (const k of memoryStore.keys()) {
      const keyWindow = parseInt(k.split(":").pop(), 10);
      if (keyWindow < cutoff) {
        memoryStore.delete(k);
      }
    }
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    limit,
  };
}

export async function smartRateLimit(options) {
  // Local dev: skip Upstash when Redis isn't reachable (avoids multi-second timeouts)
  if (
    process.env.NODE_ENV === "development" &&
    process.env.USE_REDIS_RATE_LIMIT !== "true"
  ) {
    return rateLimitMemory({
      ...options,
      window: (options.window || 60) * 1000,
    });
  }

  const client = getRedis();

  if (!client) {
    return rateLimitMemory({
      ...options,
      window: (options.window || 60) * 1000,
    });
  }

  return rateLimit(options);
}
