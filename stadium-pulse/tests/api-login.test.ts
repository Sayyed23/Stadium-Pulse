import { test, expect, describe, vi } from "vitest";
import { POST, DELETE } from "../app/api/auth/login/route";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({
  authenticateStaff: vi.fn().mockResolvedValue({
    token: "mock_token",
    session: { staffId: "1", name: "Admin", role: "admin" }
  }),
  SESSION_COOKIE: "sp_staff_session",
  loginRateLimiter: {
    limit: vi.fn().mockReturnValue({ success: true })
  }
}));

describe("Login API Route", () => {
  test("POST missing name/role", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("POST valid login", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name: "Admin", role: "admin", passcode: "admin123" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  test("DELETE logout", async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
  });

  test("POST invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(500); // request.json() throws, triggering catch block
  });

  test("POST rate limit exceeded", async () => {
    const auth = await import("@/lib/auth");
    (auth.loginRateLimiter.limit as any).mockReturnValueOnce({ success: false });

    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name: "Admin", role: "admin", passcode: "admin123" }),
      headers: { "x-forwarded-for": "127.0.0.1" }
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  test("POST server error", async () => {
    const auth = await import("@/lib/auth");
    (auth.loginRateLimiter.limit as any).mockImplementationOnce(() => {
      throw new Error("Redis failure");
    });

    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name: "Admin", role: "admin", passcode: "admin123" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
