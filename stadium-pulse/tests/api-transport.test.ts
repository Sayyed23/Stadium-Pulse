import { test, expect, describe, vi } from "vitest";
import { GET } from "../app/api/transport/route";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    transportZone: {
      findMany: vi.fn(),
    },
    wasteBin: {
      findMany: vi.fn(),
    },
  },
}));

describe("Transport API Route", () => {
  test("GET transport zones and waste bins", async () => {
    (prisma.transportZone.findMany as any).mockResolvedValue([
      { id: "tz1", name: "Lot A", type: "parking", capacity: 1000, currentCount: 950 }, // 95% full
      { id: "tz2", name: "Lot B", type: "parking", capacity: 1000, currentCount: 750 }, // 75% full
      { id: "tz3", name: "Lot C", type: "parking", capacity: 1000, currentCount: 500 }, // 50% available
    ]);

    (prisma.wasteBin.findMany as any).mockResolvedValue([
      { id: "wb1", zoneId: "z1", fillPct: 0.9, lastUpdated: new Date(), zone: { name: "Zone 1" } }, // needs collection
      { id: "wb2", zoneId: "z2", fillPct: 0.5, lastUpdated: new Date(), zone: { name: "Zone 2" } }, // ok
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.transport_zones).toHaveLength(3);
    expect(data.transport_zones[0].status).toBe("full");
    expect(data.transport_zones[1].status).toBe("filling");
    expect(data.transport_zones[2].status).toBe("available");

    expect(data.waste_bins).toHaveLength(2);
    expect(data.waste_bins[0].status).toBe("needs_collection");
    expect(data.waste_bins[1].status).toBe("ok");
  });

  test("GET handles errors", async () => {
    (prisma.transportZone.findMany as any).mockRejectedValue(new Error("Database error"));
    
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
