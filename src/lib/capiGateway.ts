import crypto from 'crypto';

export interface UserDataPayload {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

export interface CapiEventPayload {
  siteId?: string;
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData: UserDataPayload;
  customData?: Record<string, any>;
  pixelId?: string;
  accessToken?: string;
}

/**
 * SHA-256 Hash helper according to Meta Conversions API specifications
 */
export function hashUserData(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Clean & Format phone numbers for CAPI (remove non-digits, ensure E.164 without standard + sign)
 */
export function formatPhoneForCapi(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  return hashUserData(digits);
}

/**
 * Dispatch server-to-server Meta Conversions API Event
 */
export async function sendMetaCapiEvent(payload: CapiEventPayload) {
  const pixelId = payload.pixelId || process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || 'DEMO_PIXEL_ID';
  const accessToken = payload.accessToken || process.env.META_CAPI_ACCESS_TOKEN || 'DEMO_ACCESS_TOKEN';

  const user_data = {
    em: payload.userData.email ? [hashUserData(payload.userData.email)] : undefined,
    ph: payload.userData.phone ? [formatPhoneForCapi(payload.userData.phone)] : undefined,
    fn: payload.userData.firstName ? [hashUserData(payload.userData.firstName)] : undefined,
    ln: payload.userData.lastName ? [hashUserData(payload.userData.lastName)] : undefined,
    ct: payload.userData.city ? [hashUserData(payload.userData.city)] : undefined,
    st: payload.userData.state ? [hashUserData(payload.userData.state)] : undefined,
    zp: payload.userData.zip ? [hashUserData(payload.userData.zip)] : undefined,
    country: payload.userData.country ? [hashUserData(payload.userData.country)] : undefined,
    client_ip_address: payload.userData.clientIpAddress || '127.0.0.1',
    client_user_agent: payload.userData.clientUserAgent || ''
  };

  const metaEvent = {
    event_name: payload.eventName,
    event_time: payload.eventTime || Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    event_source_url: payload.eventSourceUrl || 'https://apexreach-leads.vercel.app',
    action_source: 'website',
    user_data,
    custom_data: payload.customData || {}
  };

  console.log(`[Meta CAPI Gateway Dispatch] Event: ${payload.eventName} | EventID: ${payload.eventId} | Hashed Email: ${user_data.em?.[0] || 'N/A'}`);

  // Perform actual HTTPS POST to Graph API if credentials exist
  if (accessToken !== 'DEMO_ACCESS_TOKEN' && pixelId !== 'DEMO_PIXEL_ID') {
    try {
      const graphUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      const res = await fetch(graphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [metaEvent] })
      });
      const data = await res.json();
      return { success: true, metaResponse: data };
    } catch (err: any) {
      console.error('[Meta CAPI Dispatch Failed]:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Simulated success response for development/demo mode
  return {
    success: true,
    simulated: true,
    pixelId,
    eventId: payload.eventId,
    hashedFields: Object.keys(user_data).filter(k => (user_data as any)[k] !== undefined)
  };
}

/**
 * Dispatch server-to-server GA4 Measurement Protocol Event
 */
export async function sendGA4MeasurementProtocol(payload: CapiEventPayload) {
  const measurementId = process.env.GA4_MEASUREMENT_ID || 'G-DEMO123456';
  const apiSecret = process.env.GA4_API_SECRET || 'DEMO_GA4_SECRET';

  const ga4Payload = {
    client_id: payload.userData.email ? hashUserData(payload.userData.email) : payload.eventId,
    events: [
      {
        name: payload.eventName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        params: {
          session_id: payload.eventId,
          engagement_time_msec: '100',
          ...payload.customData
        }
      }
    ]
  };

  console.log(`[GA4 Measurement Protocol Dispatch] Event: ${payload.eventName} | Measurement ID: ${measurementId}`);

  if (apiSecret !== 'DEMO_GA4_SECRET') {
    try {
      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ga4Payload)
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, simulated: true };
}
