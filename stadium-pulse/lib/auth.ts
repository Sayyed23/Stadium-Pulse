import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

/**
 * StadiumPulse AI — Staff Authentication Helpers
 *
 * Simple session-based auth for the (ops) route group.
 * Fan routes require no login — session_id only.
 *
 * For the hackathon, we use a simple cookie-based approach.
 * In production, this would use NextAuth.js with proper JWT/session handling.
 */

export interface StaffSession {
  staffId: string;
  name: string;
  role: "operator" | "volunteer" | "admin";
}

const SESSION_COOKIE = "sp_staff_session";

/**
 * Encode a staff session into a simple base64 token.
 * In production, this would be a signed JWT.
 */
export function encodeSession(session: StaffSession): string {
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

/**
 * Decode a session token back into a StaffSession.
 */
export function decodeSession(token: string): StaffSession | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    if (parsed.staffId && parsed.name && parsed.role) {
      return parsed as StaffSession;
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
  return decodeSession(token);
}

/**
 * Validate staff credentials and create a session.
 * Returns the session token or null if invalid.
 */
export async function authenticateStaff(
  name: string,
  role: string
): Promise<{ token: string; session: StaffSession } | null> {
  // Look up the volunteer/staff member by name
  const staff = await prisma.volunteer.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      role: role as "operator" | "volunteer" | "admin",
    },
  });

  if (!staff) return null;

  const session: StaffSession = {
    staffId: staff.id,
    name: staff.name,
    role: staff.role as "operator" | "volunteer" | "admin",
  };

  const token = encodeSession(session);
  return { token, session };
}

/**
 * Cookie name exported for middleware use.
 */
export { SESSION_COOKIE };
