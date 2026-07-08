import { NextRequest, NextResponse } from 'next/server';
import { CopilotRequestSchema } from '@stadiumpulse/config';
import { draftIncident } from '@stadiumpulse/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod validation (Security Score optimization)
    const result = CopilotRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input fields', details: result.error.errors }, { status: 400 });
    }

    const { reporter_id, description } = result.data;

    // Call shared AI packages
    const copilotResponse = await draftIncident(description, reporter_id);
    
    return NextResponse.json(copilotResponse);
  } catch (error: any) {
    console.error('Error in ops copilot API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
