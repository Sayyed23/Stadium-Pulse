import { NextRequest, NextResponse } from 'next/server';
import { AssistantRequestSchema } from '@stadiumpulse/config';
import { askAssistant } from '@stadiumpulse/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod Validation (Security Score optimization)
    const result = AssistantRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input fields', details: result.error.errors }, { status: 400 });
    }

    const { query, current_zone_id, session_id } = result.data;

    // Call shared AI packages
    const aiResponse = await askAssistant(query, current_zone_id, session_id);
    
    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error('Error in fan assistant API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
