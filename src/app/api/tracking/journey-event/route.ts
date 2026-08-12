import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, eventType, path, targetElement, scrollPercentage, timeOnPageSec, metadata } = body;

    console.log(`[Customer Journey Event] Lead: ${leadId || 'Anonymous'} | Event: ${eventType} | Path: ${path} | Target: ${targetElement || 'N/A'}`);

    return NextResponse.json({
      success: true,
      loggedAt: new Date().toISOString(),
      event: {
        leadId,
        eventType,
        path,
        targetElement,
        scrollPercentage,
        timeOnPageSec,
        metadata
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
