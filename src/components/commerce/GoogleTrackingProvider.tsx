'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  captureAdAttribution,
  getConsentPreference,
  setConsentPreference,
  trackConversionEvent,
} from '@/lib/commerce/googleTracking';

export default function GoogleTrackingProvider() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  const isFoodsRoute = pathname?.startsWith('/foods');

  useEffect(() => {
    if (isFoodsRoute) return;
    captureAdAttribution();
    const pref = getConsentPreference();
    if (pref === null) {
      setShowBanner(true);
    }
  }, [isFoodsRoute]);

  useEffect(() => {
    if (pathname && !isFoodsRoute) {
      trackConversionEvent('page_view', { page_path: pathname });
    }
  }, [pathname, isFoodsRoute]);

  if (!showBanner || isFoodsRoute) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy and analytics preferences"
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-50 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-lg text-xs text-slate-300 space-y-2.5"
    >
      <p className="leading-relaxed">
        We use essential storage and analytics cookies to measure ad enquiries and improve service delivery.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            setConsentPreference('denied');
            setShowBanner(false);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
        >
          Essential Only
        </button>
        <button
          onClick={() => {
            setConsentPreference('granted');
            setShowBanner(false);
          }}
          className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold"
        >
          Accept Analytics
        </button>
      </div>
    </div>
  );
}
