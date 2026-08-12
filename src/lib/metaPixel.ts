import crypto from 'crypto';

/**
 * Meta Pixel & Server-Side Conversions API (CAPI) Dual Tracking Engine
 */

export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface MetaEventPayload {
  eventName: 'PageView' | 'Lead' | 'CompleteRegistration' | 'ViewContent' | 'InitiateCheckout' | 'Purchase' | 'Contact';
  eventSourceUrl: string;
  eventId: string;
  userData?: MetaUserData;
  customData?: Record<string, any>;
}

// SHA-256 Hash helper required by Meta Graph API specifications
export function hashMetaUserData(value?: string): string | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Generates a unique event ID for dual client/server deduplication
 */
export function generateEventId(eventName: string): string {
  return `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Client-side Meta Pixel initializer & event dispatcher
 */
export async function trackDualMetaEvent(payload: MetaEventPayload, pixelId?: string): Promise<{ success: boolean; eventId: string }> {
  const eventId = payload.eventId || generateEventId(payload.eventName);
  const updatedPayload = { ...payload, eventId };

  // 1. Client Browser Pixel dispatch (if window.fbq is available)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      (window as any).fbq('track', updatedPayload.eventName, updatedPayload.customData || {}, {
        eventID: eventId,
      });
      console.log(`[Meta Pixel Browser] Tracked event: ${updatedPayload.eventName} (ID: ${eventId})`);
    } catch (err) {
      console.warn('[Meta Pixel Browser Warning]', err);
    }
  }

  // 2. Dual Dispatch to Server-Side CAPI Gateway Proxy Route
  try {
    const response = await fetch('/api/tracking/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updatedPayload,
        pixelId: pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '123456789012345',
      }),
    });
    const result = await response.json();
    return { success: result.success ?? false, eventId };
  } catch (err) {
    console.error('[Meta CAPI Gateway Error]', err);
    return { success: false, eventId };
  }
}
