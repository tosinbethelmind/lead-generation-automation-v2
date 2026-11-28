import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

const META_EVENT_MAP: Record<string, string> = {
  generate_lead: 'Lead',
  qualified_lead: 'Lead',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
  click_whatsapp: 'Contact',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const eventName = String(body.eventName || '');
    const metaEventName = META_EVENT_MAP[eventName];

    if (!metaEventName) {
      return NextResponse.json({ success: false, error: 'Unsupported CAPI event' }, { status: 400 });
    }

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
    const accessToken = process.env.META_ACCESS_TOKEN || '';

    if (!pixelId || !accessToken) {
      return NextResponse.json({
        success: true,
        sent: false,
        reason: 'META_CAPI_NOT_CONFIGURED',
      });
    }

    const userData: Record<string, any> = {
      client_user_agent: request.headers.get('user-agent') || undefined,
    };
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      userData.client_ip_address = forwardedFor.split(',')[0].trim();
    }
    if (body.email) {
      userData.em = [sha256(String(body.email))];
    }
    if (body.phone) {
      userData.ph = [sha256(String(body.phone).replace(/\D/g, ''))];
    }
    if (body.fbclid) {
      userData.fbc = `fb.1.${Date.now()}.${String(body.fbclid)}`;
    }

    const payload = {
      data: [
        {
          event_name: metaEventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.eventId ? String(body.eventId) : undefined,
          action_source: 'website',
          event_source_url: body.eventSourceUrl ? String(body.eventSourceUrl) : undefined,
          user_data: userData,
          custom_data: {
            currency: 'NGN',
            value: Number(body.valueNgn || 0),
            content_category: String(body.businessDivision || 'business_solutions'),
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v20.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({
      success: res.ok,
      sent: res.ok,
      metaResponse: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, sent: false, error: err?.message || 'CAPI dispatch failed' },
      { status: 500 }
    );
  }
}
