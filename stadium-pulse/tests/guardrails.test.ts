 
import { describe, it, expect, vi } from "vitest";
import { verifyGrounding, verifyNavigationResponse } from "../lib/ai/guardrails";
import { prisma } from "../lib/db";

// Mock Prisma client methods
vi.mock("../lib/db", () => ({
  prisma: {
    zone: {
      findMany: vi.fn(),
    },
    amenity: {
      findMany: vi.fn(),
    },
  },
}));

describe("Grounding & Hallucination Guardrails Test Suite", () => {
  it("should return verified sources when all mentioned zone IDs exist in database", async () => {
    vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
      { id: "zone_a", name: "Zone A" },
      { id: "zone_b", name: "Zone B" },
    ] as any);

    const result = await verifyGrounding("Go through Zone A and Zone B", ["zone_a", "zone_b"], []);
    expect(result.hasHallucination).toBe(false);
    expect(result.verifiedSources).toEqual(["zone_a", "zone_b"]);
    expect(result.hallucinations).toHaveLength(0);
  });

  it("should detect hallucinated zone IDs missing from database", async () => {
    vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
      { id: "zone_a", name: "Zone A" },
    ] as any);

    const result = await verifyGrounding("Go to Zone Fake", ["zone_a", "zone_fake_999"], []);
    expect(result.hasHallucination).toBe(true);
    expect(result.hallucinations).toContain("zone:zone_fake_999");
    expect(result.verifiedSources).toEqual(["zone_a"]);
  });

  it("should verify amenity IDs against database records", async () => {
    vi.mocked(prisma.amenity.findMany).mockResolvedValueOnce([
      { id: "food_north", name: "North Food Court" },
    ] as any);

    const result = await verifyGrounding("Food near Gate 1", [], ["food_north", "amenity_fake"]);
    expect(result.hasHallucination).toBe(true);
    expect(result.hallucinations).toContain("amenity:amenity_fake");
    expect(result.verifiedSources).toEqual(["food_north"]);
  });

  it("should verify structured navigation response routes and sources", async () => {
    vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
      { id: "zone_a" },
    ] as any);
    vi.mocked(prisma.amenity.findMany).mockResolvedValueOnce([
      { id: "food_north" },
    ] as any);

    const res = await verifyNavigationResponse({
      answer: "Turn left at Zone A towards North Food Court",
      route: ["zone_a"],
      grounded_sources: ["food_north", "fake_id"],
    });

    expect(res.hasHallucination).toBe(true);
    expect(res.hallucinations).toEqual(["fake_id"]);
    expect(res.verifiedSources).toContain("zone_a");
    expect(res.verifiedSources).toContain("food_north");
  });

  it("should verify structured navigation response with NO hallucinations", async () => {
    vi.mocked(prisma.zone.findMany).mockResolvedValueOnce([
      { id: "zone_a" },
    ] as any);
    vi.mocked(prisma.amenity.findMany).mockResolvedValueOnce([
      { id: "food_north" },
    ] as any);

    const res = await verifyNavigationResponse({
      answer: "Turn left at Zone A towards North Food Court",
      route: ["zone_a"],
      grounded_sources: ["food_north"],
    });

    expect(res.hasHallucination).toBe(false);
    expect(res.hallucinations).toHaveLength(0);
    expect(res.verifiedSources).toContain("zone_a");
    expect(res.verifiedSources).toContain("food_north");
  });
});
