import { describe, it, expect, vi } from "vitest";

// Because we're unit testing the API routes built on next/server, we mock NextRequest.
import { NextRequest } from "next/server";
import { POST } from "../app/api/assistant/route";

vi.mock("../lib/rate-limit", () => ({
  getAssistantLimiter: vi.fn(),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  getCached: vi.fn().mockResolvedValue(null),
  setCache: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../lib/ai/guardrails", () => ({
  verifyGrounding: vi.fn().mockResolvedValue({
    hasHallucination: false,
    hallucinations: [],
    verifiedSources: ["zone_1"],
  }),
  verifyNavigationResponse: vi.fn().mockResolvedValue({
    hasHallucination: false,
    hallucinations: [],
    verifiedSources: ["zone_1"],
  }),
}));

vi.mock("../lib/db", () => ({
  prisma: {
    zone: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    chatLog: {
      create: vi.fn().mockResolvedValue({}),
    }
  },
}));

vi.mock("../lib/ai/client", () => ({
  generateTextOutput: vi.fn().mockResolvedValue({
    text: "Head to zone 1",
  }),
  generateStructuredOutput: vi.fn().mockResolvedValue({
    data: {
      answer: "Head to zone 1",
      route: ["zone_1"],
      grounded_sources: ["zone_1"]
    },
    meta: {
      model: "test-model",
      latencyMs: 100,
      tokenCount: { total: 10 }
    }
  })
}));

describe("API Assistant Route", () => {
  it("returns 400 for invalid body", async () => {
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({}), // Missing required fields
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("processes a valid request", async () => {
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({
        session_id: "test-sess",
        query: "How do I get to Zone 1?"
      }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.answer).toBeDefined();
  });

  it("detects languages correctly", async () => {
    const queries = [
      { text: "How do I get to Zone 1?", lang: "en" },
      { text: "मी झोन 1 मध्ये कसा जाऊ? जवळ कुठे आहे?", lang: "mr" },
      { text: "ज़ोन 1 तक कैसे पहुंचे?", lang: "hi" },
      { text: "மண்டலம் 1க்கு எப்படி செல்வது?", lang: "ta" },
      { text: "జోన్ 1కి ఎలా వెళ్లాలి?", lang: "te" },
      { text: "জোন 1 এ কিভাবে যাব?", lang: "bn" },
    ];
    
    for (const q of queries) {
      const req = new NextRequest("http://localhost/api/assistant", {
        method: "POST",
        body: JSON.stringify({
          session_id: "test-sess",
          query: q.text
        }),
      });
      const res = await POST(req);
      const data = await res.json();
      expect(data.detected_language).toBe(q.lang);
    }
  });

  it("returns 500 on DB error", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.zone.findMany as any).mockRejectedValueOnce(new Error("DB error"));
    
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({
        session_id: "test-sess",
        query: "Hello"
      }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("handles rate limit exceeded", async () => {
    const { checkRateLimit } = await import("../lib/rate-limit");
    (checkRateLimit as any).mockResolvedValueOnce({ allowed: false, retryAfter: 60 });
    
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({ session_id: "test-sess", query: "Hello" }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("Rate limit exceeded");
  });

  it("returns cached response if available", async () => {
    const { getCached } = await import("../lib/rate-limit");
    (getCached as any).mockResolvedValueOnce({ answer: "cached answer", route: [] });
    
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({ session_id: "test-sess", query: "Hello" }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.cached).toBe(true);
    expect(data.answer).toBe("cached answer");
  });

  it("processes zones with amenities correctly", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.zone.findMany as any).mockResolvedValueOnce([
      { 
        id: "z1", name: "Zone 1", capacity: 100, currentCount: 50, sectionMetadata: {},
        amenities: [
          { id: "a1", name: "Restroom", type: "restroom", accessibilityFlags: ["wheelchair"], status: "open" }
        ]
      }
    ]);
    
    const req = new NextRequest("http://localhost/api/assistant", {
      method: "POST",
      body: JSON.stringify({ session_id: "test-sess", query: "Hello" }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
