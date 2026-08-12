import { NextResponse } from 'next/server';
import { EmailDripEngine } from '@/lib/emailDripEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, clientName, clientEmail, stepIndex } = body;

    if (!clientEmail) {
      return NextResponse.json({ success: false, error: 'clientEmail is required' }, { status: 400 });
    }

    const result = await EmailDripEngine.triggerDripStep(
      { leadId, clientName, clientEmail },
      stepIndex || 1
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dripDetails: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
