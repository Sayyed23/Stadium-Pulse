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

function getRedis(): Redis | null {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.error(
        "⚠️  Upstash Redis not configured. Falling back to in-memory rate limiting."
      );
      return null;
    }

    redis = new Redis({ url, token });
  }
  return redis;
}

// ─── In-Memory Rate Limiter Fallback ─────────────────────────

export class InMemoryRatelimit {
  private readonly limitCount: number;
  private readonly windowMs: number;
  private readonly prefix: string;
  private static readonly stores = new Map<string, Map<string, number[]>>();
  private static lastCleanup = Date.now();

  constructor(config: { limit: number; windowMs: number; prefix: string }) {
    this.limitCount = config.limit;
    this.windowMs = config.windowMs;
    this.prefix = config.prefix;
  }

  async limit(identifier: string) {
    if (!InMemoryRatelimit.stores.has(this.prefix)) {
      InMemoryRatelimit.stores.set(this.prefix, new Map());
    }
    const store = InMemoryRatelimit.stores.get(this.prefix)!;
    const now = Date.now();
    const cutoff = now - this.windowMs;

    // Passive cleanup of all keys in the store every 60 seconds
    if (now - InMemoryRatelimit.lastCleanup > 60000) {
      InMemoryRatelimit.lastCleanup = now;
      for (const [id, timestamps] of store.entries()) {
        const active = timestamps.filter((t) => t > cutoff);
        if (active.length === 0) {
          store.delete(id);
        } else {
          store.set(id, active);
        }
      }
    }

    if (!store.has(identifier)) {
      store.set(identifier, []);
    }
    const timestamps = store.get(identifier)!;

    // Filter out old timestamps
    const activeTimestamps = timestamps.filter((t) => t > cutoff);

    if (activeTimestamps.length >= this.limitCount) {
      const oldest = activeTimestamps[0];
      const reset = oldest + this.windowMs;
      store.set(identifier, activeTimestamps);
      return { success: false, reset };
    }

    activeTimestamps.push(now);
    store.set(identifier, activeTimestamps);
    return { success: true, reset: now + this.windowMs };
  }
}

// ─── Rate Limiters ──────────────────────────────────────────

/**
 * Fan assistant rate limiter: 20 requests per 60-second window.
 * Keyed by session_id — fans don't log in.
 */
export function getAssistantLimiter(): Ratelimit | InMemoryRatelimit {
  const r = getRedis();
  if (!r) {
    return new InMemoryRatelimit({
      limit: 20,
      windowMs: 60 * 1000,
      prefix: "ratelimit:assistant",
    });
  }

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
export function getCopilotLimiter(): Ratelimit | InMemoryRatelimit {
  const r = getRedis();
  if (!r) {
    return new InMemoryRatelimit({
      limit: 30,
      windowMs: 60 * 1000,
      prefix: "ratelimit:copilot",
    });
  }

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
  limiter: Ratelimit | InMemoryRatelimit | null,
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!limiter) {
    // If somehow no limiter is provided, fail closed for security
    return { allowed: false, retryAfter: 60 };
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
    console.error("Cache set failed:", err);
  }
}
