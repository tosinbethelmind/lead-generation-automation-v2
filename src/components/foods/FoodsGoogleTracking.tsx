'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { TrackingConfig } from '@/lib/foods-types';
import {
  captureAndGetAttribution,
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackFoodsEvent,
} from '@/lib/foods-tracking';

interface Props {
  config: TrackingConfig;
}

export default function FoodsGoogleTracking({ config }: Props) {
  const [consent, setConsent] = useState<'granted' | 'denied'>('granted');
  const [showConsentBar, setShowConsentBar] = useState(false);

  const gtmId = config.gtmContainerId?.trim();
  const ga4Id = config.ga4MeasurementId?.trim();
  const adsId = config.googleAdsId?.trim();

  useEffect(() => {
    captureAndGetAttribution();
    const current = getAnalyticsConsent();
    setConsent(current);
    try {
      const hasChoice = localStorage.getItem('bm_foods_consent_v1');
      if (!hasChoice) {
        setShowConsentBar(true);
      }
    } catch {
      // ignore
    }

    trackFoodsEvent(
      'page_view',
      { page_title: document.title, page_location: window.location.pathname },
      { dedupeKey: `page_view_${window.location.pathname}`, trackingConfig: config }
    );
  }, [config]);

  const primaryGtagId = ga4Id || adsId;

  return (
    <>
      {/* Consent Default Initialization */}
      <Script id="foods-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            'analytics_storage': '${consent}',
            'ad_storage': '${consent}',
            'ad_user_data': '${consent}',
            'ad_personalization': '${consent}'
          });
        `}
      </Script>

      {/* Google Tag Manager (only injected if GTM_CONTAINER_ID is configured) */}
      {gtmId ? (
        <Script id="foods-gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      ) : null}

      {/* Google Analytics 4 / Google Ads gtag.js (only injected if ID is configured) */}
      {primaryGtagId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryGtagId}`}
            strategy="afterInteractive"
          />
          <Script id="foods-gtag-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${ga4Id ? `gtag('config', '${ga4Id}', { send_page_view: false });` : ''}
              ${adsId ? `gtag('config', '${adsId}');` : ''}
            `}
          </Script>
        </>
      ) : null}

      {/* Lightweight, Non-Intrusive Consent Bar */}
      {showConsentBar ? (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-40 bg-emerald-950/95 text-white border border-amber-400/40 rounded-xl p-3 shadow-xl text-xs flex items-center justify-between gap-3">
          <p className="text-emerald-100 leading-snug">
            We use cookies to measure ad performance and improve your ordering experience.
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAnalyticsConsent('denied');
                setConsent('denied');
                setShowConsentBar(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 hover:bg-emerald-800"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => {
                setAnalyticsConsent('granted');
                setConsent('granted');
                setShowConsentBar(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300"
            >
              Accept
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
