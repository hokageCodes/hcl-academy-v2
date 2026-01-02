import { Redis } from "@upstash/redis";

// Initialize Redis client (supports both Vercel KV and Upstash)
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

/**
 * Simple rate limiter using INCR + EXPIRE (works with all Redis permissions)
 * Uses fixed window algorithm
 */
export async function rateLimit({
  identifier,
  limit = 5,
  window = 60, // seconds
  prefix = "rl",
}) {
  const client = getRedis();
  
  if (!client) {
    // No Redis configured, use memory fallback
    return rateLimitMemory({ identifier, limit, window: window * 1000 });
  }

  const key = `${prefix}:${identifier}:${Math.floor(Date.now() / (window * 1000))}`;

  try {
    // Simple INCR - creates key with value 1 if doesn't exist
    const count = await client.incr(key);
    
    // Set expiry only on first request (when count is 1)
    if (count === 1) {
      await client.expire(key, window);
    }

    const remaining = Math.max(0, limit - count);
    const isAllowed = count <= limit;

    return {
      success: isAllowed,
      remaining,
      limit,
      reset: Math.ceil(Date.now() / 1000) + window,
    };
  } catch (error) {
    console.error("Rate limit error:", error.message);
    // Fail open - allow request if Redis has issues
    return {
      success: true,
      remaining: limit,
      limit,
      reset: Math.ceil(Date.now() / 1000) + window,
      error: true,
    };
  }
}

/**
 * Fallback in-memory rate limiter for development
 * WARNING: Does not persist across serverless invocations
 */
const memoryStore = new Map();

export function rateLimitMemory({
  identifier,
  limit = 5,
  window = 60000, // milliseconds
}) {
  const now = Date.now();
  const windowKey = Math.floor(now / window);
  const key = `${identifier}:${windowKey}`;

  // Get or create entry
  let count = memoryStore.get(key) || 0;
  count++;
  memoryStore.set(key, count);

  // Cleanup old entries periodically
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

/**
 * Smart rate limiter that uses Redis if available, falls back to memory
 */
export async function smartRateLimit(options) {
  const client = getRedis();

  if (client) {
    return rateLimit(options);
  }

  // Development fallback
  if (process.env.NODE_ENV === "development") {
    console.warn("Using in-memory rate limiting (Redis not configured)");
  }
  
  return rateLimitMemory({
    ...options,
    window: (options.window || 60) * 1000,
  });
}
