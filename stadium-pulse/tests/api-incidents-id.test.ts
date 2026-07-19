import { test, expect, describe, vi } from "vitest";
import { PATCH } from "../app/api/incidents/[id]/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    incident: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    volunteer: {
      update: vi.fn(),
    },
  },
}));

describe("Incident PATCH API Route", () => {
  test("PATCH invalid body fields", async () => {
    const req = new NextRequest("http://localhost/api/incidents/123", {
      method: "PATCH",
      body: JSON.stringify({ status: "fake_status" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(400);
  });

  test("PATCH incident not found", async () => {
    (prisma.incident.findUnique as any).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/incidents/123", {
      method: "PATCH",
      body: JSON.stringify({ status: "resolved" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(404);
  });

  test("PATCH resolved sets volunteer free", async () => {
    (prisma.incident.findUnique as any).mockResolvedValue({ id: "123", assignedVolunteerId: "v1" });
    (prisma.incident.update as any).mockResolvedValue({ id: "123", status: "resolved" });
    (prisma.volunteer.update as any).mockResolvedValue({});
    
    const req = new NextRequest("http://localhost/api/incidents/123", {
      method: "PATCH",
      body: JSON.stringify({ status: "resolved" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(200);
    expect(prisma.volunteer.update).toHaveBeenCalledWith({
      where: { id: "v1" },
      data: { availability: "available" }
    });
  });

  test("PATCH assign volunteer sets them busy", async () => {
    (prisma.incident.findUnique as any).mockResolvedValue({ id: "123" });
    (prisma.incident.update as any).mockResolvedValue({ id: "123", assignedVolunteerId: "v2" });
    (prisma.volunteer.update as any).mockResolvedValue({});
    
    const req = new NextRequest("http://localhost/api/incidents/123", {
      method: "PATCH",
      body: JSON.stringify({ assigned_volunteer_id: "v2" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(200);
    expect(prisma.volunteer.update).toHaveBeenCalledWith({
      where: { id: "v2" },
      data: { availability: "busy" }
    });
  });

  test("PATCH handles DB error", async () => {
    (prisma.incident.findUnique as any).mockRejectedValueOnce(new Error("DB error"));
    
    const req = new NextRequest("http://localhost/api/incidents/123", {
      method: "PATCH",
      body: JSON.stringify({ status: "resolved" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(500);
  });
});
