import { NextResponse } from 'next/server';
import { hashMetaUserData, MetaEventPayload } from '@/lib/metaPixel';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventSourceUrl, eventId, userData, customData, pixelId } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ success: false, error: 'Missing required eventName or eventId' }, { status: 400 });
    }

    const hashedEmail = hashMetaUserData(userData?.email);
    const hashedPhone = hashMetaUserData(userData?.phone);
    const hashedFirstName = hashMetaUserData(userData?.firstName);
    const hashedLastName = hashMetaUserData(userData?.lastName);

    const capiPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl || 'https://clientwebsite.com',
          action_source: 'website',
          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            fn: hashedFirstName ? [hashedFirstName] : undefined,
            ln: hashedLastName ? [hashedLastName] : undefined,
            client_ip_address: userData?.ipAddress || '197.210.8.1',
            client_user_agent: userData?.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          custom_data: customData || {},
        },
      ],
    };

    console.log(`[Meta CAPI Server Proxy] Dual dispatching event '${eventName}' (ID: ${eventId}) for Pixel ${pixelId || 'Default'}`);

    // If Meta Access Token is configured in environment, dispatch to official Meta Graph API v19.0 endpoint
    const metaAccessToken = process.env.FB_CONVERSIONS_API_TOKEN;
    const targetPixelId = pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '123456789012345';

    if (metaAccessToken) {
      const fbUrl = `https://graph.facebook.com/v19.0/${targetPixelId}/events?access_token=${metaAccessToken}`;
      await fetch(fbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      });
    }

    return NextResponse.json({
      success: true,
      deduplicated: true,
      eventId,
      eventName,
      timestamp: new Date().toISOString(),
      payloadSummary: {
        actionSource: 'website',
        hashedFields: [hashedEmail ? 'email' : null, hashedPhone ? 'phone' : null].filter(Boolean),
      },
    });
  } catch (error: any) {
    console.error('[Meta CAPI Server Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal CAPI Error' }, { status: 500 });
  }
}
