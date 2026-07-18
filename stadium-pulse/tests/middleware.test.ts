import { describe, it, expect, vi } from "vitest";
import { middleware } from "../proxy";
import { NextRequest } from "next/server";
import { encodeSession } from "../lib/auth";

vi.mock("next/server", async () => {
  const original = await vi.importActual<typeof import("next/server")>("next/server");
  return {
    ...original,
    NextResponse: {
      ...original.NextResponse,
      redirect: vi.fn((url) => ({
        status: 307,
        headers: { get: () => url.toString() },
        redirectedUrl: url.toString()
      })),
      next: vi.fn(() => ({
        status: 200,
        headers: { set: vi.fn() }
      })),
      json: vi.fn((body, init) => ({
        status: init?.status || 200,
        json: async () => body
      }))
    }
  };
});

describe("Auth Gate Middleware Integration", () => {
  it("should redirect unauthenticated request targeting protected ops route to login page", async () => {
    const req = new NextRequest(new URL("http://localhost:3000/ops/dashboard"));
    const res = await middleware(req);
    expect((res as any).redirectedUrl || (res.headers as any).get("Location")).toContain("/ops/login");
  });

  it("should allow request with valid staff session token", async () => {
    const token = await encodeSession({
      staffId: "123",
      name: "Alice",
      role: "operator"
    });

    const req = new NextRequest(new URL("http://localhost:3000/ops/dashboard"));
    req.cookies.set("sp_staff_session", token);

    const res = await middleware(req);
    expect(res.status).toBe(200);
  });
});
