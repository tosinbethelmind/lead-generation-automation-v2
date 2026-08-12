import { NextRequest, NextResponse } from 'next/server';
import { sendMetaCapiEvent, sendGA4MeasurementProtocol, CapiEventPayload } from '@/lib/capiGateway';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    const payload: CapiEventPayload = {
      siteId: body.siteId || 'universal',
      eventName: body.eventName || 'Lead',
      eventId: body.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventTime: body.eventTime || Math.floor(Date.now() / 1000),
      eventSourceUrl: body.eventSourceUrl || req.headers.get('referer') || 'https://apexreach-leads.vercel.app',
      userData: {
        ...(body.userData || {}),
        clientIpAddress: clientIp,
        clientUserAgent: userAgent
      },
      customData: body.customData || {}
    };

    // Dual Edge Dispatch to Meta CAPI + GA4 Measurement Protocol
    const [metaResult, ga4Result] = await Promise.all([
      sendMetaCapiEvent(payload),
      sendGA4MeasurementProtocol(payload)
    ]);

    return NextResponse.json({
      success: true,
      eventId: payload.eventId,
      metaCapi: metaResult,
      ga4Protocol: ga4Result
    });
  } catch (error: any) {
    console.error('[CAPI Gateway Route Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
