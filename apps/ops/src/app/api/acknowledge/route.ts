import { NextRequest, NextResponse } from 'next/server';
import { AcknowledgeAlertSchema } from '@stadiumpulse/config';
import { prisma } from '@stadiumpulse/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod validation (Security Score optimization)
    const result = AcknowledgeAlertSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input fields', details: result.error.errors }, { status: 400 });
    }

    const { alert_id, operator_id } = result.data;

    // Parameterized prisma update
    const updatedAlert = await prisma.alertLog.update({
      where: { id: alert_id },
      data: {
        acknowledged: true,
        acknowledgedBy: operator_id
      }
    });
    
    return NextResponse.json({ success: true, alert: updatedAlert });
  } catch (error: any) {
    console.error('Error in ops alert acknowledgment API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
