import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createIncidentSchema,
  validateRequest,
} from "@/lib/validators";

/**
 * GET  /api/incidents — List incidents (filterable)
 * POST /api/incidents — Create a confirmed incident
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get("zone_id");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (zoneId) where.zoneId = zoneId;
    if (status) where.status = status;
    if (category) where.category = category;

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        zone: { select: { name: true } },
        assignedVolunteer: {
          select: { name: true, preferredLanguage: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error("Incidents GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(createIncidentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify zone exists
    const zone = await prisma.zone.findUnique({
      where: { id: data.zone_id },
    });
    if (!zone) {
      return NextResponse.json(
        { error: "Zone not found" },
        { status: 404 }
      );
    }

    // Create incident
    const incident = await prisma.incident.create({
      data: {
        category: data.category,
        zoneId: data.zone_id,
        priority: data.priority,
        description: data.description,
        createdBy: data.created_by,
        assignedVolunteerId: data.assigned_volunteer_id,
        status: data.assigned_volunteer_id ? "dispatched" : "reported",
      },
      include: {
        zone: { select: { name: true } },
        assignedVolunteer: {
          select: { name: true, preferredLanguage: true },
        },
      },
    });

    // If a volunteer is assigned, mark them busy
    if (data.assigned_volunteer_id) {
      await prisma.volunteer.update({
        where: { id: data.assigned_volunteer_id },
        data: { availability: "busy" },
      });
    }

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error("Incidents POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
