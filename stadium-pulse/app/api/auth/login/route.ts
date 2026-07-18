import { NextRequest, NextResponse } from "next/server";
import { authenticateStaff, SESSION_COOKIE, encodeSession } from "@/lib/auth";

/**
 * POST /api/auth/login
 *
 * Staff authentication endpoint.
 * Sets a session cookie for (ops) route group access.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const result = await authenticateStaff(name, role);

    if (!result) {
      return NextResponse.json(
        { error: "Invalid credentials. Staff member not found." },
        { status: 401 }
      );
    }

    // Set the session cookie
    const response = NextResponse.json({
      success: true,
      staff: {
        id: result.session.staffId,
        name: result.session.name,
        role: result.session.role,
      },
    });

    response.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/login — Logout
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
