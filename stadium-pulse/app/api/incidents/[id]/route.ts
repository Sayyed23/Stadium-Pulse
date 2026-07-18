import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateIncidentSchema, validateRequest } from "@/lib/validators";

/**
 * PATCH /api/incidents/[id]
 *
 * Update incident status (reported → dispatched → resolved).
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validation = validateRequest(updateIncidentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check incident exists
    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    // Build update payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;
      if (data.status === "resolved") {
        updateData.resolvedAt = new Date();

        // Free up the assigned volunteer
        if (existing.assignedVolunteerId) {
          await prisma.volunteer.update({
            where: { id: existing.assignedVolunteerId },
            data: { availability: "available" },
          });
        }
      }
    }

    if (data.assigned_volunteer_id) {
      updateData.assignedVolunteerId = data.assigned_volunteer_id;

      // Mark new volunteer as busy
      await prisma.volunteer.update({
        where: { id: data.assigned_volunteer_id },
        data: { availability: "busy" },
      });
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: updateData,
      include: {
        zone: { select: { name: true } },
        assignedVolunteer: {
          select: { name: true, preferredLanguage: true },
        },
      },
    });

    return NextResponse.json({ incident: updated });
  } catch (error) {
    console.error("Incident PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
