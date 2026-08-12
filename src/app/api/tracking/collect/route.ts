import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, eventName, eventData, sessionId, timestamp, location } = body;

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    // Log & Process Event
    console.log(`[SDK Tracking] Event: "${eventName}" | Site: ${siteId} | IP: ${clientIp}`);

    // Downstream lead form automation processing
    if (eventName === 'lead_form_submit' && (eventData?.email || eventData?.phone)) {
      console.log(`⚡ [Automated Lead Bridge] Instant lead captured via external website SDK! Email: ${eventData.email || 'N/A'}, Phone: ${eventData.phone || 'N/A'}`);
      // Here: Trigger instant automated drip, lead score calculation, or WhatsApp autoresponder
    }

    return NextResponse.json({
      success: true,
      received: true,
      siteId,
      eventName,
      timestamp: timestamp || new Date().toISOString(),
      processedBy: 'ApexReach Dual Edge Ingestion'
    });
  } catch (error: any) {
    console.error('[SDK Tracking Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Invalid payload' }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  });
}
