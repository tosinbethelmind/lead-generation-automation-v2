'use client';

import { AttributionData, TrackingConfig } from './foods-types';

const ATTRIBUTION_STORAGE_KEY = 'bm_foods_attribution_v1';
const FIRED_EVENTS_KEY = 'bm_foods_fired_events_v1';
const CONSENT_STORAGE_KEY = 'bm_foods_consent_v1';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function captureAndGetAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const existingRaw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const existing: AttributionData = existingRaw ? JSON.parse(existingRaw) : {};

    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid') || existing.gclid;
    const gbraid = params.get('gbraid') || existing.gbraid;
    const wbraid = params.get('wbraid') || existing.wbraid;
    const utmSource = params.get('utm_source') || existing.utmSource;
    const utmMedium = params.get('utm_medium') || existing.utmMedium;
    const utmCampaign = params.get('utm_campaign') || existing.utmCampaign;

    const merged: AttributionData = {
      ...(gclid ? { gclid } : {}),
      ...(gbraid ? { gbraid } : {}),
      ...(wbraid ? { wbraid } : {}),
      ...(utmSource ? { utmSource } : {}),
      ...(utmMedium ? { utmMedium } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
      landingUrl: existing.landingUrl || window.location.pathname + window.location.search,
    };

    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return {};
  }
}

export function getAnalyticsConsent(): 'granted' | 'denied' {
  if (typeof window === 'undefined') return 'granted';
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    return saved === 'denied' ? 'denied' : 'granted';
  } catch {
    return 'granted';
  }
}

export function setAnalyticsConsent(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: status,
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
      });
    }
  } catch {
    // ignore storage errors
  }
}

function hasFiredOnce(dedupeKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(FIRED_EVENTS_KEY);
    const map: Record<string, boolean> = raw ? JSON.parse(raw) : {};
    if (map[dedupeKey]) return true;
    map[dedupeKey] = true;
    sessionStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(map));
    return false;
  } catch {
    return false;
  }
}

export type FoodsTrackingEvent =
  | 'page_view'
  | 'view_item'
  | 'select_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_delivery_info'
  | 'click_whatsapp'
  | 'generate_lead'
  | 'purchase';

export function trackFoodsEvent(
  eventName: FoodsTrackingEvent,
  params: Record<string, unknown> = {},
  options?: { dedupeKey?: string; trackingConfig?: TrackingConfig }
): void {
  if (typeof window === 'undefined') return;
  if (getAnalyticsConsent() === 'denied') return;
  if (options?.dedupeKey && hasFiredOnce(options.dedupeKey)) return;

  const attribution = captureAndGetAttribution();
  // Strictly strip any PII; only pass non-PII commerce & attribution metadata
  const safePayload: Record<string, unknown> = {
    event: eventName,
    currency: 'NGN',
    ...params,
    ...(attribution.gclid ? { gclid: attribution.gclid } : {}),
    ...(attribution.gbraid ? { gbraid: attribution.gbraid } : {}),
    ...(attribution.wbraid ? { wbraid: attribution.wbraid } : {}),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(safePayload);

  if (typeof window.gtag === 'function') {
    const { event: _ev, ...gtagParams } = safePayload;
    window.gtag('event', eventName, gtagParams);

    // Fire Google Ads conversion ONLY on generate_lead (lead conversion) or purchase (verified payment)
    // Never count every WhatsApp click as a purchase!
    const cfg = options?.trackingConfig;
    if (
      eventName === 'generate_lead' &&
      cfg?.googleAdsId &&
      cfg?.googleAdsConversionLabel
    ) {
      window.gtag('event', 'conversion', {
        send_to: `${cfg.googleAdsId}/${cfg.googleAdsConversionLabel}`,
        transaction_id: params.transaction_id || undefined,
        value: typeof params.value === 'number' ? params.value : 0,
        currency: 'NGN',
      });
    }
  }
}
