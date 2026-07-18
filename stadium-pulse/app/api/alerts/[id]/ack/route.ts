import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alertAckSchema, validateRequest } from "@/lib/validators";

/**
 * POST /api/alerts/[id]/ack
 *
 * Operator acknowledges an AlertLog entry.
 * Staff-session gated via middleware.
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validation = validateRequest(alertAckSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const { acknowledged_by } = validation.data;

    // Check alert exists
    const alert = await prisma.alertLog.findUnique({ where: { id } });
    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    if (alert.acknowledged) {
      return NextResponse.json(
        { error: "Alert already acknowledged", acknowledged_by: alert.acknowledgedBy },
        { status: 409 }
      );
    }

    // Acknowledge
    const updated = await prisma.alertLog.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedBy: acknowledged_by,
      },
    });

    return NextResponse.json({
      success: true,
      alert: updated,
    });
  } catch (error) {
    console.error("Alert ack error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
