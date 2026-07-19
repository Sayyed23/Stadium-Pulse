import { describe, it, expect, vi } from "vitest";
import { encodeSession, decodeSession, authenticateStaff, getStaffSession, loginRateLimiter } from "../lib/auth";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("../lib/db", () => ({
  prisma: {
    volunteer: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    }
  }
}));

describe("Auth Utilities", () => {
  it("should encode and decode a valid session", async () => {
    const payload = { staffId: "user_1", name: "Alice", role: "admin" as const };
    const token = await encodeSession(payload);
    const decoded = await decodeSession(token);

    expect(decoded).not.toBeNull();
    expect(decoded?.staffId).toBe("user_1");
    expect(decoded?.name).toBe("Alice");
    expect(decoded?.role).toBe("admin");
  });

  it("should return null for invalid token", async () => {
    const decoded = await decodeSession("invalid.token.here");
    expect(decoded).toBeNull();
  });

  it("should return null if SESSION_SECRET is missing", async () => {
    const oldSecret = process.env.SESSION_SECRET;
    delete process.env.SESSION_SECRET;

    const decoded = await decodeSession("sometoken");
    expect(decoded).toBeNull();

    // Restore for other tests
    process.env.SESSION_SECRET = oldSecret;
  });
});


vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

describe("Authentication functions", () => {
  it("authenticateStaff works without password if hash is missing", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.volunteer.findFirst as any).mockResolvedValueOnce({
      id: "v1", name: "Alice", role: "operator", passwordHash: null
    });

    const res = await authenticateStaff("Alice", "operator");
    expect(res).not.toBeNull();
    expect(res?.session.name).toBe("Alice");
  });

  it("authenticateStaff returns null for invalid password", async () => {
    const { prisma } = await import("../lib/db");
    (prisma.volunteer.findFirst as any).mockResolvedValueOnce({
      id: "v1", name: "Alice", role: "operator", passwordHash: "hashed"
    });
    
    // override bcrypt.compare mock for this test
    const bcrypt = await import("bcrypt");
    (bcrypt.compare as any).mockResolvedValueOnce(false);
    
    const res = await authenticateStaff("Alice", "operator", "wrong");
    expect(res).toBeNull();
  });

  it("getStaffSession returns session if valid", async () => {
    const payload = { staffId: "v1", name: "Alice", role: "operator" as const };
    const token = await encodeSession(payload);

    (cookies as any).mockResolvedValueOnce({
      get: () => ({ value: token })
    });

    const { prisma } = await import("../lib/db");
    (prisma.volunteer.findUnique as any).mockResolvedValueOnce({
      id: "v1", name: "Alice", role: "operator"
    });

    const session = await getStaffSession();
    expect(session).not.toBeNull();
    expect(session?.name).toBe("Alice");
  });

  it("loginRateLimiter works", () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      expect(loginRateLimiter.limit(ip).success).toBe(true);
    }
    expect(loginRateLimiter.limit(ip).success).toBe(false);
  });

  it("encodeSession throws if SESSION_SECRET is missing", async () => {
    const oldSecret = process.env.SESSION_SECRET;
    delete process.env.SESSION_SECRET;
    vi.resetModules();
    const { encodeSession } = await import("../lib/auth");
    await expect(encodeSession({ staffId: "1", name: "A", role: "admin" }))
      .rejects.toThrow("SESSION_SECRET environment variable is missing.");
    process.env.SESSION_SECRET = oldSecret;
    vi.resetModules();
  });

  it("decodeSession returns null for expired token", async () => {
    const secret = process.env.SESSION_SECRET || "dummy";
    const payloadData = { staffId: "1", name: "A", role: "admin", exp: Date.now() - 1000 };
    const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const signature = Buffer.from(signatureBuffer).toString("base64url");
    const token = `${payload}.${signature}`;
    
    expect(await decodeSession(token)).toBeNull();
  });

  it("decodeSession returns null if parsed data is missing fields", async () => {
    const secret = process.env.SESSION_SECRET || "dummy";
    const payloadData = { staffId: "1", name: "A", exp: Date.now() + 10000 };
    const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const signature = Buffer.from(signatureBuffer).toString("base64url");
    const token = `${payload}.${signature}`;
    
    expect(await decodeSession(token)).toBeNull();
  });

  it("getStaffSession returns null if staff missing or role changed", async () => {
    const payload = { staffId: "v1", name: "Alice", role: "operator" as const };
    const token = await encodeSession(payload);

    (cookies as any).mockResolvedValue({
      get: () => ({ value: token })
    });

    const { prisma } = await import("../lib/db");
    // Staff removed
    (prisma.volunteer.findUnique as any).mockResolvedValueOnce(null);
    expect(await getStaffSession()).toBeNull();

    // Role changed
    (prisma.volunteer.findUnique as any).mockResolvedValueOnce({
      id: "v1", name: "Alice", role: "admin"
    });
    expect(await getStaffSession()).toBeNull();
  });
});
