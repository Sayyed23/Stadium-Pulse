import { describe, it, expect } from "vitest";
import { encodeSession, decodeSession, StaffSession } from "../lib/auth";
import { InMemoryRatelimit, checkRateLimit } from "../lib/rate-limit";

describe("Security Fixes", () => {
  describe("Cryptographic Session Tokens", () => {
    const mockSession: StaffSession = {
      staffId: "volunteer_123",
      name: "John Doe",
      role: "volunteer",
    };

    it("should encode and decode a session successfully", async () => {
      const token = await encodeSession(mockSession);
      expect(token).toContain("."); // Should contain a separator between payload and signature

      const decoded = await decodeSession(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.staffId).toBe(mockSession.staffId);
      expect(decoded?.role).toBe(mockSession.role);
    });

    it("should reject tampered payload", async () => {
      const token = await encodeSession(mockSession);
      const [payload, signature] = token.split(".");
      
      // Tamper with the payload (e.g. escalating privilege to admin)
      const tamperedPayloadObj = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
      tamperedPayloadObj.role = "admin";
      const tamperedPayload = Buffer.from(JSON.stringify(tamperedPayloadObj)).toString("base64");
      
      const tamperedToken = `${tamperedPayload}.${signature}`;
      const decoded = await decodeSession(tamperedToken);
      expect(decoded).toBeNull();
    });

    it("should reject invalid/malformed tokens", async () => {
      expect(await decodeSession("invalid-token")).toBeNull();
      expect(await decodeSession("payload-without-signature.")).toBeNull();
    });
  });

  describe("In-Memory Rate Limiter Fallback", () => {
    it("should limit requests after limit threshold", async () => {
      const limiter = new InMemoryRatelimit({
        limit: 3,
        windowMs: 500, // short window for testing
        prefix: "test:limit",
      });

      // First 3 requests should be allowed
      const r1 = await checkRateLimit(limiter, "user_1");
      const r2 = await checkRateLimit(limiter, "user_1");
      const r3 = await checkRateLimit(limiter, "user_1");
      expect(r1.allowed).toBe(true);
      expect(r2.allowed).toBe(true);
      expect(r3.allowed).toBe(true);

      // 4th request should be rate limited
      const r4 = await checkRateLimit(limiter, "user_1");
      expect(r4.allowed).toBe(false);
      expect(r4.retryAfter).toBeGreaterThan(0);

      // Wait for window to reset
      await new Promise((resolve) => setTimeout(resolve, 550));

      // Should be allowed again
      const r5 = await checkRateLimit(limiter, "user_1");
      expect(r5.allowed).toBe(true);
    });
  });
});
