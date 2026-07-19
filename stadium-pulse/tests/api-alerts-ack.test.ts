import { test, expect, describe, vi } from "vitest";
import { POST } from "../app/api/alerts/[id]/ack/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    alertLog: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Alert Ack API Route", () => {
  test("POST missing body fields", async () => {
    const req = new NextRequest("http://localhost/api/alerts/123/ack", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(400);
  });

  test("POST alert not found", async () => {
    (prisma.alertLog.findUnique as any).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/alerts/123/ack", {
      method: "POST",
      body: JSON.stringify({ acknowledged_by: "Admin" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(404);
  });

  test("POST alert already acknowledged", async () => {
    (prisma.alertLog.findUnique as any).mockResolvedValue({ acknowledged: true, acknowledgedBy: "Other" });
    const req = new NextRequest("http://localhost/api/alerts/123/ack", {
      method: "POST",
      body: JSON.stringify({ acknowledged_by: "Admin" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(409);
  });

  test("POST successful ack", async () => {
    (prisma.alertLog.findUnique as any).mockResolvedValue({ acknowledged: false });
    (prisma.alertLog.update as any).mockResolvedValue({ acknowledged: true, acknowledgedBy: "Admin" });
    const req = new NextRequest("http://localhost/api/alerts/123/ack", {
      method: "POST",
      body: JSON.stringify({ acknowledged_by: "Admin" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(200);
  });

  test("POST handles DB error", async () => {
    (prisma.alertLog.findUnique as any).mockRejectedValue(new Error("DB Error"));
    const req = new NextRequest("http://localhost/api/alerts/123/ack", {
      method: "POST",
      body: JSON.stringify({ acknowledged_by: "Admin" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(500);
  });
});
