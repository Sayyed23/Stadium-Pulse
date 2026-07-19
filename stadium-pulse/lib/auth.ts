import { cookies } from "next/headers";
import { prisma } from "./db";
import * as bcrypt from "bcrypt";

// Simple in-memory rate limiter for login
class InMemoryRatelimit {
  private readonly store = new Map<string, { count: number; resetTime: number }>();

  limit(ip: string): { success: boolean } {
    const now = Date.now();
    const record = this.store.get(ip);
    
    if (!record || now > record.resetTime) {
      this.store.set(ip, { count: 1, resetTime: now + 60 * 1000 }); // 1 minute window
      return { success: true };
    }
    
    if (record.count >= 5) {
      return { success: false };
    }
    
    record.count += 1;
    return { success: true };
  }
}

export const loginRateLimiter = new InMemoryRatelimit();

/**
 * StadiumPulse AI — Staff Authentication Helpers
 *
 * Simple session-based auth for the (ops) route group.
 * Fan routes require no login — session_id only.
 *
 * For the hackathon, we use a simple cookie-based approach.
 * In production, this would use NextAuth.js with proper JWT/session handling.
 */

type StaffRole = "operator" | "volunteer" | "admin";

export interface StaffSession {
  staffId: string;
  name: string;
  role: StaffRole;
}

const SESSION_COOKIE = "sp_staff_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-secret-for-stadium-pulse-auth-key-123456";

/**
 * Encode a staff session into a signed token.
 */
export async function encodeSession(session: StaffSession): Promise<string> {
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is missing.");
  }
  const payloadData = {
    ...session,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration
  };
  const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64");
  const encoder = new TextEncoder();
  
  // Web Crypto HMAC signing
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  
  const signature = Buffer.from(signatureBuffer).toString("base64url");
  return `${payload}.${signature}`;
}

/**
 * Decode a session token and verify its HMAC signature.
 */
export async function decodeSession(token: string): Promise<StaffSession | null> {
  if (!SESSION_SECRET) {
    return null;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;

    const encoder = new TextEncoder();
    
    // Web Crypto HMAC verification
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(signature, "base64url"),
      encoder.encode(payload)
    );

    if (!isValid) return null;

    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    // Validate expiration claim (exp)
    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }

    if (parsed.staffId && parsed.name && parsed.role) {
      return {
        staffId: parsed.staffId,
        name: parsed.name,
        role: parsed.role,
      } as StaffSession;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get the current staff session from the request cookies.
 * Returns null if not authenticated.
 */
export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await decodeSession(token);
  if (!session) return null;

  // Revalidate staff existence and current role in database to prevent unauthorized access
  const staff = await prisma.volunteer.findUnique({
    where: { id: session.staffId }
  });
  if (!staff || staff.role as string !== session.role) {
    return null; // Staff removed or role changed!
  }

  return session;
}

/**
 * Validate staff credentials and create a session.
 * Returns the session token or null if invalid.
 */
export async function authenticateStaff(
  name: string,
  role: string,
  password?: string
): Promise<{ token: string; session: StaffSession } | null> {
  // Look up the volunteer/staff member by name
  const staff = await prisma.volunteer.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      role: role as "operator" | "volunteer" | "admin",
    },
  });

  if (!staff) return null;

  if (staff.passwordHash) {
    if (!password) return null;
    const isValidPassword = await bcrypt.compare(password, staff.passwordHash);
    if (!isValidPassword) return null;
  }

  const session: StaffSession = {
    staffId: staff.id,
    name: staff.name,
    role: staff.role as "operator" | "volunteer" | "admin",
  };

  const token = await encodeSession(session);
  return { token, session };
}

/**
 * Cookie name exported for middleware use.
 */
export { SESSION_COOKIE };
