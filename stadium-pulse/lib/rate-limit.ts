import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * StadiumPulse AI — Redis Token-Bucket Rate Limiter
 *
 * Protects /api/assistant and /api/copilot from abuse-driven cost spikes.
 * Uses Upstash Redis for serverless-compatible rate limiting.
 */

// ─── Redis Client Singleton ─────────────────────────────────

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.warn(
        "⚠️  Upstash Redis not configured. Rate limiting disabled."
      );
      // Return a mock that always allows
      return null as unknown as Redis;
    }

    redis = new Redis({ url, token });
  }
  return redis;
}

// ─── Rate Limiters ──────────────────────────────────────────

/**
 * Fan assistant rate limiter: 20 requests per 60-second window.
 * Keyed by session_id — fans don't log in.
 */
export function getAssistantLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  return new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    prefix: "ratelimit:assistant",
    analytics: true,
  });
}

/**
 * Copilot rate limiter: 30 requests per 60-second window.
 * Keyed by staff user ID.
 */
export function getCopilotLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  return new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "ratelimit:copilot",
    analytics: true,
  });
}

/**
 * Check rate limit for a given identifier.
 * Returns { allowed: true } if within limits, or { allowed: false, retryAfter }
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!limiter) {
    // Rate limiting not configured — allow all (dev mode)
    return { allowed: true };
  }

  const result = await limiter.limit(identifier);

  if (!result.success) {
    return {
      allowed: false,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    };
  }

  return { allowed: true };
}

// ─── Cache Helpers ──────────────────────────────────────────

/**
 * Simple Redis cache for venue KB lookups and repeated navigation queries.
 * Short TTL to keep data fresh while avoiding redundant DB/LLM calls.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (!r) return null;

  try {
    const cached = await r.get<T>(key);
    return cached;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number = 300
): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (err) {
    console.warn("Cache set failed:", err);
  }
}
