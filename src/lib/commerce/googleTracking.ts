export type BusinessDivisionKey =
  | 'business_solutions'
  | 'bethelmind_foods'
  | 'academic_research';

export type TrackingEventName =
  | 'page_view'
  | 'view_service'
  | 'view_package'
  | 'cta_click'
  | 'click_whatsapp'
  | 'form_start'
  | 'book_consultation'
  | 'generate_lead'
  | 'begin_checkout'
  | 'purchase'
  | 'qualified_lead';

export interface AttributionData {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ab_variant?: string;
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
    fbq?: (...args: any[]) => void;
  }
}

export function resolveDivisionFromPath(pathname: string = ''): BusinessDivisionKey {
  if (pathname.startsWith('/foods')) return 'bethelmind_foods';
  if (pathname.startsWith('/academic-research')) return 'academic_research';
  return 'business_solutions';
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
      ...(params.get('fbclid') ? { fbclid: params.get('fbclid')! } : {}),
      ...(params.get('utm_source') ? { utm_source: params.get('utm_source')! } : {}),
      ...(params.get('utm_medium') ? { utm_medium: params.get('utm_medium')! } : {}),
      ...(params.get('utm_campaign') ? { utm_campaign: params.get('utm_campaign')! } : {}),
      ...(params.get('utm_term') ? { utm_term: params.get('utm_term')! } : {}),
      ...(params.get('utm_content') ? { utm_content: params.get('utm_content')! } : {}),
      ...(params.get('variant') ? { ab_variant: params.get('variant')! } : {}),
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
    if (typeof window.fbq === 'function') {
      window.fbq('consent', status === 'granted' ? 'grant' : 'revoke');
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

  if (options?.dedupeKey && hasEventFired(options.dedupeKey)) {
    return false;
  }

  const attribution = getStoredAttribution();
  const division: BusinessDivisionKey =
    params.business_division || resolveDivisionFromPath(window.location.pathname);

  const payload = {
    ...params,
    business_division: division,
    ...(attribution.gclid ? { gclid: attribution.gclid } : {}),
    ...(attribution.gbraid ? { gbraid: attribution.gbraid } : {}),
    ...(attribution.wbraid ? { wbraid: attribution.wbraid } : {}),
    ...(attribution.fbclid ? { fbclid: attribution.fbclid } : {}),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_campaign ? { campaign: attribution.utm_campaign } : {}),
    ...(attribution.ab_variant ? { ab_variant: attribution.ab_variant } : {}),
  };

  // 1. GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  // 2. Google Ads / GA4 gtag
  if (typeof window.gtag === 'function') {
    if (options?.userData && getConsentPreference() === 'granted') {
      window.gtag('set', 'user_data', options.userData);
    }

    window.gtag('event', eventName, payload);

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

  // 3. Meta Pixel (never record WhatsApp click as Purchase)
  if (typeof window.fbq === 'function') {
    if (eventName === 'page_view') window.fbq('track', 'PageView');
    else if (eventName === 'view_service' || eventName === 'view_package') {
      window.fbq('track', 'ViewContent', { content_category: division, value: params.value || 0, currency: 'NGN' });
    } else if (eventName === 'click_whatsapp') {
      window.fbq('track', 'Contact', { content_category: division });
    } else if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', { content_category: division, value: params.value || 0, currency: 'NGN' });
    } else if (eventName === 'begin_checkout') {
      window.fbq('track', 'InitiateCheckout', { content_category: division, value: params.value || 0, currency: 'NGN' });
    } else if (eventName === 'purchase') {
      window.fbq('track', 'Purchase', { content_category: division, value: params.value || 0, currency: 'NGN' });
    }
  }

  // 4. First-party Sales Dashboard Telemetry (real counts only, non-blocking)
  if (['page_view', 'click_whatsapp', 'generate_lead', 'begin_checkout', 'purchase'].includes(eventName)) {
    try {
      fetch('/api/commerce/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName,
          businessDivision: division,
          utmSource: attribution.utm_source || (attribution.gclid ? 'google' : attribution.fbclid ? 'meta' : 'direct'),
          utmCampaign: attribution.utm_campaign || 'untagged',
          abVariant: attribution.ab_variant || 'control',
          valueNgn: eventName === 'purchase' ? Number(params.value || 0) : 0,
        }),
      }).catch(() => {});
    } catch {}
  }

  // 5. Meta Conversions API (server-side event relay for Lead, InitiateCheckout, Purchase)
  if (['generate_lead', 'begin_checkout', 'purchase'].includes(eventName) && getConsentPreference() !== 'denied') {
    try {
      fetch('/api/tracking/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName,
          eventId: options?.dedupeKey || params.transaction_id || `${eventName}_${Date.now()}`,
          businessDivision: division,
          valueNgn: Number(params.value || 0),
          email: options?.userData?.email,
          phone: options?.userData?.phone_number,
          fbclid: attribution.fbclid,
          eventSourceUrl: window.location.href,
        }),
      }).catch(() => {});
    } catch {}
  }

  if (options?.dedupeKey) {
    markEventFired(options.dedupeKey);
  }
  return true;
}
