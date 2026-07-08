import { NextRequest } from 'next/server';
import { prisma } from '@stadiumpulse/db';

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { 
        status,
        resolvedAt: status === 'resolved' ? new Date() : null
      }
    });

    return new Response(JSON.stringify({ success: true, incident: updatedIncident }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to update incident:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
