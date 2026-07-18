import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";

/**
 * StadiumPulse AI — Single Auth Gate
 *
 * middleware.ts enforces:
 * - (ops)/* routes (except /ops/login): requires valid staff session cookie
 * - (fan)/* routes: open, session-based, no login required
 * - (public)/* routes: open
 * - /api/copilot, /api/incidents, /api/alerts: requires staff session
 */

// Routes that require staff authentication
const PROTECTED_ROUTES = [
  "/ops/dashboard",
  "/ops/alerts",
  "/ops/copilot",
  "/ops/incidents",
  "/ops/sustainability",
];

const PROTECTED_API_ROUTES = [
  "/api/copilot",
  "/api/incidents",
  "/api/alerts",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected page route
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is a protected API route
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedPage || isProtectedApi) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

    if (!sessionToken) {
      if (isProtectedApi) {
        return NextResponse.json(
          { error: "Unauthorized. Staff login required." },
          { status: 401 }
        );
      }
      // Redirect to login page for page routes
      const loginUrl = new URL("/ops/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate the session
    const session = await decodeSession(sessionToken);
    if (!session) {
      if (isProtectedApi) {
        return NextResponse.json(
          { error: "Invalid session. Please re-authenticate." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/ops/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Add staff info to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-staff-id", session.staffId);
    response.headers.set("x-staff-name", session.name);
    response.headers.set("x-staff-role", session.role);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all ops routes except login
    "/ops/:path*",
    // Match protected API routes
    "/api/copilot/:path*",
    "/api/incidents/:path*",
    "/api/alerts/:path*",
  ],
};
