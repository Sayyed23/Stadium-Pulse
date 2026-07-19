import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/incidents/route";

vi.mock("../lib/db", () => ({
  prisma: {
    zone: {
      findUnique: vi.fn().mockResolvedValue({ id: "zone_1" }),
    },
    incident: {
      create: vi.fn().mockResolvedValue({ id: "inc_1", category: "medical", status: "reported" }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    volunteer: {
      update: vi.fn().mockResolvedValue({}),
    }
  },
}));

vi.mock("../lib/auth", () => ({
  verifyStaff: vi.fn().mockResolvedValue({ staffId: "user_1", role: "operator" }),
}));

describe("API Incidents Route", () => {
  it("returns 400 for invalid body", async () => {
    const req = new NextRequest("http://localhost/api/incidents", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates incident for valid request", async () => {
    const req = new NextRequest("http://localhost/api/incidents", {
      method: "POST",
      body: JSON.stringify({
        category: "medical",
        zone_id: "zone_1",
        priority: "high",
        description: "Need medic at gate 1",
        created_by: "user_1",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.incident.id).toBe("inc_1");
  });

  it("POST returns 404 for missing zone", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.zone.findUnique as any).mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/incidents", {
      method: "POST",
      body: JSON.stringify({
        category: "medical",
        zone_id: "zone_1",
        priority: "high",
        description: "Need medic at gate 1",
        created_by: "user_1",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("creates incident with assigned volunteer", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.zone.findUnique as any).mockResolvedValueOnce({ id: "zone_1" });
    const req = new NextRequest("http://localhost/api/incidents", {
      method: "POST",
      body: JSON.stringify({
        category: "medical",
        zone_id: "zone_1",
        priority: "high",
        description: "Need medic",
        created_by: "user_1",
        assigned_volunteer_id: "vol_1"
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(prisma.volunteer.update).toHaveBeenCalledWith({
      where: { id: "vol_1" },
      data: { availability: "busy" }
    });
  });

  it("POST returns 500 on DB error", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.zone.findUnique as any).mockRejectedValueOnce(new Error("DB error"));
    const req = new NextRequest("http://localhost/api/incidents", {
      method: "POST",
      body: JSON.stringify({
        category: "medical",
        zone_id: "zone_1",
        priority: "high",
        description: "Need medic",
        created_by: "user_1",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

import { GET } from "../app/api/incidents/route";

describe("API Incidents Route - GET", () => {
  it("GET returns incidents", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.incident.findMany as any).mockResolvedValueOnce([{ id: "inc_1", status: "reported" }]);
    const req = new NextRequest("http://localhost/api/incidents?zone_id=zone_1&status=reported&category=medical");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.incidents).toHaveLength(1);
  });

  it("GET handles DB error", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.incident.findMany as any).mockRejectedValueOnce(new Error("DB error"));
    const req = new NextRequest("http://localhost/api/incidents");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
