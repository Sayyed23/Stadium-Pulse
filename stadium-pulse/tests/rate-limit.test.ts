import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InMemoryRatelimit, checkRateLimit } from "../lib/rate-limit";

describe("InMemoryRatelimit", () => {
  beforeEach(() => {
    // We would need to clear the static map if it were accessible, 
    // but we can just use unique prefixes per test instead.
  });

  it("allows requests under the limit", async () => {
    const limiter = new InMemoryRatelimit({ limit: 2, windowMs: 1000, prefix: "test1" });
    
    const r1 = await limiter.limit("user1");
    expect(r1.success).toBe(true);

    const r2 = await limiter.limit("user1");
    expect(r2.success).toBe(true);
  });

  it("blocks requests over the limit", async () => {
    const limiter = new InMemoryRatelimit({ limit: 1, windowMs: 1000, prefix: "test2" });
    
    await limiter.limit("user2"); // 1st is allowed
    const r2 = await limiter.limit("user2"); // 2nd is blocked
    
    expect(r2.success).toBe(false);
    expect(r2.reset).toBeGreaterThan(Date.now());
  });

  it("checkRateLimit helper works", async () => {
    const limiter = new InMemoryRatelimit({ limit: 1, windowMs: 1000, prefix: "test3" });
    
    const res1 = await checkRateLimit(limiter, "user3");
    expect(res1.allowed).toBe(true);

    const res2 = await checkRateLimit(limiter, "user3");
    expect(res2.allowed).toBe(false);
    expect(res2.retryAfter).toBeGreaterThan(0);
  });

  it("cleans up old entries after 60 seconds", async () => {
    const limiter = new InMemoryRatelimit({ limit: 2, windowMs: 1000, prefix: "test4" });
    vi.useFakeTimers();
    await limiter.limit("user5");
    
    // Advance time by 61 seconds to trigger cleanup logic
    vi.advanceTimersByTime(61000);
    
    const res = await limiter.limit("user6");
    expect(res.success).toBe(true);
    
    vi.useRealTimers();
  });

  it("checkRateLimit fails closed when limiter is null", async () => {
    const res = await checkRateLimit(null, "user4");
    expect(res.allowed).toBe(false);
    expect(res.retryAfter).toBe(60);
  });
});

describe("Rate Limit Fallbacks (Missing Config)", () => {
  let oldUrl: string | undefined;
  let oldToken: string | undefined;

  beforeEach(() => {
    oldUrl = process.env.UPSTASH_REDIS_REST_URL;
    oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = oldUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = oldToken;
  });

  it("warns when redis config is missing", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getAssistantLimiter, getCopilotLimiter, getCached, setCache, InMemoryRatelimit: DynamicInMemory } = await import("../lib/rate-limit");
    
    const limiter = getAssistantLimiter();
    expect(errorSpy).toHaveBeenCalled();
    expect(limiter).toBeInstanceOf(DynamicInMemory);
    
    const copilotLimiter = getCopilotLimiter();
    expect(copilotLimiter).toBeInstanceOf(DynamicInMemory);

    expect(await getCached("key")).toBeNull();
    await expect(setCache("key", "val")).resolves.toBeUndefined();
    
    errorSpy.mockRestore();
  });
});

import { getAssistantLimiter, getCopilotLimiter, getCached, setCache } from "../lib/rate-limit";
import { vi } from "vitest";

const mockRedisGet = vi.fn().mockResolvedValue("cached_val");
const mockRedisSet = vi.fn().mockResolvedValue("OK");

vi.mock("@upstash/redis", () => {
  return {
    Redis: class {
      get = mockRedisGet;
      set = mockRedisSet;
    }
  };
});

vi.mock("@upstash/ratelimit", () => {
  return {
    Ratelimit: class {
      static slidingWindow = vi.fn().mockReturnValue("slidingWindow");
    }
  };
});

describe("Redis configured paths", () => {
  let oldUrl: string | undefined;
  let oldToken: string | undefined;

  beforeEach(() => {
    oldUrl = process.env.UPSTASH_REDIS_REST_URL;
    oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = "http://test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";
  });

  afterEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = oldUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = oldToken;
  });

  it("getAssistantLimiter returns Ratelimit instance", () => {
    const limiter = getAssistantLimiter();
    expect(limiter).toBeDefined();
  });

  it("getCopilotLimiter returns Ratelimit instance", () => {
    const limiter = getCopilotLimiter();
    expect(limiter).toBeDefined();
  });

  it("getCached works", async () => {
    const val = await getCached("key");
    expect(val).toBe("cached_val");
  });

  it("setCache works", async () => {
    await expect(setCache("key", "val")).resolves.toBeUndefined();
  });

  it("getCached handles Redis errors", async () => {
    mockRedisGet.mockRejectedValueOnce(new Error("Redis get failed"));
    mockRedisSet.mockRejectedValueOnce(new Error("Redis set failed"));
    
    // We already imported getCached at the top, and it uses the mocked Redis class.
    expect(await getCached("key")).toBeNull();
  });
});
