import { NextRequest } from 'next/server';
import { prisma } from '@stadiumpulse/db';

export async function POST(req: NextRequest) {
  try {
    const { category, zone_id, priority, description, assigned_volunteer_id } = await req.json();

    if (!category || !zone_id || !priority || !description) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const newIncident = await prisma.incident.create({
      data: {
        category,
        zoneId: zone_id,
        priority,
        description,
        assignedVolunteerId: assigned_volunteer_id,
        createdBy: 'op_meera_control'
      }
    });

    return new Response(JSON.stringify({ success: true, incident: newIncident }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to create incident:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
