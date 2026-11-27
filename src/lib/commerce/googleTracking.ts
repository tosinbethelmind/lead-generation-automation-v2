export type TrackingEventName =
  | 'page_view'
  | 'view_service'
  | 'view_package'
  | 'click_whatsapp'
  | 'form_start'
  | 'generate_lead'
  | 'begin_checkout'
  | 'purchase'
  | 'qualified_lead';

export interface AttributionData {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  captured_at?: string;
}

const ATTRIBUTION_KEY = 'bma_ads_attribution_v1';
const CONSENT_KEY = 'bma_tracking_consent_v1';
const FIRED_EVENTS_KEY = 'bma_fired_conversions_v1';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function captureAdAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};
  try {
    const existingRaw = sessionStorage.getItem(ATTRIBUTION_KEY) || localStorage.getItem(ATTRIBUTION_KEY);
    const existing: AttributionData = existingRaw ? JSON.parse(existingRaw) : {};
    const params = new URLSearchParams(window.location.search);

    const updated: AttributionData = {
      ...existing,
      ...(params.get('gclid') ? { gclid: params.get('gclid')! } : {}),
      ...(params.get('gbraid') ? { gbraid: params.get('gbraid')! } : {}),
      ...(params.get('wbraid') ? { wbraid: params.get('wbraid')! } : {}),
      ...(params.get('utm_source') ? { utm_source: params.get('utm_source')! } : {}),
      ...(params.get('utm_medium') ? { utm_medium: params.get('utm_medium')! } : {}),
      ...(params.get('utm_campaign') ? { utm_campaign: params.get('utm_campaign')! } : {}),
      ...(params.get('utm_term') ? { utm_term: params.get('utm_term')! } : {}),
      ...(params.get('utm_content') ? { utm_content: params.get('utm_content')! } : {}),
      landing_page: existing.landing_page || window.location.pathname,
      captured_at: existing.captured_at || new Date().toISOString(),
    };

    const serialized = JSON.stringify(updated);
    sessionStorage.setItem(ATTRIBUTION_KEY, serialized);
    localStorage.setItem(ATTRIBUTION_KEY, serialized);
    return updated;
  } catch {
    return {};
  }
}

export function getStoredAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY) || localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getConsentPreference(): 'granted' | 'denied' | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(CONSENT_KEY);
    if (val === 'granted' || val === 'denied') return val;
  } catch {}
  return null;
}

export function setConsentPreference(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_KEY, status);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: status,
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
      });
    }
  } catch {}
}

function hasEventFired(dedupeKey: string): boolean {
  if (typeof window === 'undefined' || !dedupeKey) return false;
  try {
    const raw = sessionStorage.getItem(FIRED_EVENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(dedupeKey);
  } catch {
    return false;
  }
}

function markEventFired(dedupeKey: string): void {
  if (typeof window === 'undefined' || !dedupeKey) return;
  try {
    const raw = sessionStorage.getItem(FIRED_EVENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(dedupeKey)) {
      list.push(dedupeKey);
      sessionStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(list.slice(-100)));
    }
  } catch {}
}

export function trackConversionEvent(
  eventName: TrackingEventName,
  params: Record<string, any> = {},
  options?: { dedupeKey?: string; userData?: { email?: string; phone_number?: string } }
): boolean {
  if (typeof window === 'undefined') return false;

  // Never fire duplicate conversions on refresh when dedupeKey is provided
  if (options?.dedupeKey && hasEventFired(options.dedupeKey)) {
    return false;
  }

  const attribution = getStoredAttribution();
  const payload = {
    ...params,
    ...(attribution.gclid ? { gclid: attribution.gclid } : {}),
    ...(attribution.gbraid ? { gbraid: attribution.gbraid } : {}),
    ...(attribution.wbraid ? { wbraid: attribution.wbraid } : {}),
    ...(attribution.utm_campaign ? { campaign: attribution.utm_campaign } : {}),
  };

  // Push to GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (typeof window.gtag === 'function') {
    // Enhanced conversions user_data when consented
    if (options?.userData && getConsentPreference() === 'granted') {
      window.gtag('set', 'user_data', options.userData);
    }

    window.gtag('event', eventName, payload);

    // Fire dedicated Google Ads conversion if configured
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18553825002';
    const leadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL;
    const purchaseLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL;

    if (eventName === 'generate_lead' && adsId && leadLabel) {
      window.gtag('event', 'conversion', {
        send_to: `${adsId}/${leadLabel}`,
        value: params.value || 0,
        currency: 'NGN',
        ...(options?.dedupeKey ? { transaction_id: options.dedupeKey } : {}),
      });
    }

    if (eventName === 'purchase' && adsId && purchaseLabel) {
      window.gtag('event', 'conversion', {
        send_to: `${adsId}/${purchaseLabel}`,
        value: params.value || 0,
        currency: 'NGN',
        transaction_id: params.transaction_id || options?.dedupeKey || '',
      });
    }
  }

  if (options?.dedupeKey) {
    markEventFired(options.dedupeKey);
  }
  return true;
}
