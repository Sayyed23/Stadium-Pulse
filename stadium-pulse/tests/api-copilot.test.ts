import { test, expect, describe, vi } from "vitest";
import { POST } from "../app/api/copilot/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/client";
import * as rateLimit from "@/lib/rate-limit";

vi.mock("@/lib/db", () => ({
  prisma: {
    zone: { findMany: vi.fn() },
    volunteer: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/ai/client", () => ({
  generateStructuredOutput: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  getCopilotLimiter: vi.fn(),
  checkRateLimit: vi.fn(),
}));

describe("Copilot API Route", () => {
  test("POST missing body fields", async () => {
    const req = new NextRequest("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("POST rate limit exceeded", async () => {
    (rateLimit.checkRateLimit as any).mockResolvedValue({ allowed: false, retryAfter: 60 });
    const req = new NextRequest("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ reporter_id: "vol_1", description: "Help" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  test("POST success returns draft", async () => {
    (rateLimit.checkRateLimit as any).mockResolvedValue({ allowed: true });
    (prisma.zone.findMany as any).mockResolvedValue([{ id: "z1", name: "Zone 1" }]);
    (prisma.volunteer.findMany as any).mockResolvedValue([
      { id: "v1", name: "Vol 1", preferredLanguage: "en", zoneAssignmentId: "z1", zoneAssignment: { name: "Zone 1" } }
    ]);
    (generateStructuredOutput as any).mockResolvedValue({
      data: {
        draft_incident: { category: "medical", priority: "high", description: "Need medic", zone_id: "z1" },
        suggested_volunteer: { id: "v1", name: "Vol 1", language: "en", zone_assignment: "z1" },
        dispatch_message_localized: "Medic required",
        needs_followup: false,
        followup_question: null
      },
      meta: { model: "gemini-test", latencyMs: 100, tokenCount: { total: 50 } }
    });

    const req = new NextRequest("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ reporter_id: "vol_1", description: "Need medic" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.requires_confirmation).toBe(true);
    expect(data.draft_incident.category).toBe("medical");
  });

  test("POST with followup_response", async () => {
    (rateLimit.checkRateLimit as any).mockResolvedValue({ allowed: true });
    (prisma.zone.findMany as any).mockResolvedValue([{ id: "z1", name: "Zone 1" }]);
    (prisma.volunteer.findMany as any).mockResolvedValue([]);
    (generateStructuredOutput as any).mockResolvedValue({
      data: { draft_incident: { category: "medical", priority: "high", description: "Need medic", zone_id: "z1" } },
      meta: { model: "gemini-test", latencyMs: 100, tokenCount: { total: 50 } }
    });

    const req = new NextRequest("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ reporter_id: "vol_1", description: "Need medic", followup_response: "Yes, 3rd floor" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("POST handles DB error", async () => {
    (rateLimit.checkRateLimit as any).mockResolvedValue({ allowed: true });
    (prisma.zone.findMany as any).mockRejectedValue(new Error("DB Error"));
    
    const req = new NextRequest("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ reporter_id: "vol_1", description: "Help" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
