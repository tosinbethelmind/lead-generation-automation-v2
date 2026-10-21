'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface TurnkeyAdBannerProps {
  position?: 'top' | 'bottom' | 'inline';
  category?: string;
  className?: string;
}

export function TurnkeyAdBanner({ position = 'top', category = 'general', className = '' }: TurnkeyAdBannerProps) {
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdsenseLoaded(true);
      } catch (e) {
        console.warn('AdSense initialization fallback to house ad:', e);
      }
    }
  }, [adsenseId]);

  // If live Google AdSense is active, render AdSense unit
  if (adsenseId && adsenseLoaded) {
    return (
      <aside 
        aria-label="Advertisement" 
        className={`w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-2 text-center my-3 ${className}`}
      >
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseId}
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  // High-CTR Turnkey House Monetization Banners (Active Right Now with Zero Setup)
  const getHouseAd = () => {
    const cat = (category || '').toLowerCase();

    if (cat.includes('sport') || cat.includes('game') || cat.includes('footy')) {
      return {
        badge: '⚡ SureScore AI Partner',
        title: "Unlock Today's Algorithm 3-Match Value Slip & Over/Under Matrix",
        desc: "Quantitative mathematical predictions, expected value (+EV) edges, and Kelly criterion stake sizing.",
        ctaText: 'Access Sports Slip on Selar →',
        ctaHref: 'https://selar.com/showlove/bethelmind?product=da-sports',
        accentColor: 'from-emerald-500/15 via-teal-500/10 to-slate-900/90 border-emerald-500/30 text-emerald-300',
        btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
      };
    }

    if (cat.includes('finance') || cat.includes('wealth') || cat.includes('salary') || cat.includes('runway') || cat.includes('crypto')) {
      return {
        badge: '💎 2026 Wealth OS',
        title: 'Download the Automated 12-Month Financial Freedom & Runway OS',
        desc: 'Plug-and-play budgeting spreadsheet, tax shield guide, and passive income acceleration framework.',
        ctaText: 'Download on Selar (₦3,500 / $5) →',
        ctaHref: 'https://selar.com/showlove/bethelmind?product=da-finance',
        accentColor: 'from-amber-500/15 via-orange-500/10 to-slate-900/90 border-amber-500/30 text-amber-300',
        btnColor: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
      };
    }

    if (cat.includes('productivity') || cat.includes('software') || cat.includes('ai') || cat.includes('typing') || cat.includes('focus')) {
      return {
        badge: '🚀 Second-Brain Notion OS',
        title: 'Unlock 500+ Deep Work Notion Templates & Speed Mastery Drills',
        desc: 'Eliminate procrastination with our battle-tested time-blocking architectures, project dashboards, and speed drills.',
        ctaText: 'Unlock Notion OS (₦4,500 / $7) →',
        ctaHref: 'https://selar.com/showlove/bethelmind?product=da-aitools',
        accentColor: 'from-indigo-500/15 via-purple-500/10 to-slate-900/90 border-indigo-500/30 text-indigo-300',
        btnColor: 'bg-indigo-400 hover:bg-indigo-300 text-slate-950',
      };
    }

    // Default B2B Turnkey Setup Offer
    return {
      badge: '🏢 Commercial License Available',
      title: 'Want This Custom Interactive Tool Deployed on Your Website?',
      desc: 'Capture 3x more qualified leads with custom branding, instant WhatsApp closer, and bankable PDF quotes.',
      ctaText: 'Inquire on WhatsApp (₦75k Setup) →',
      ctaHref: `https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind! I am interested in licensing a turnkey interactive tool or calculator for my business.')}`,
      accentColor: 'from-cyan-500/15 via-blue-500/10 to-slate-900/90 border-cyan-500/30 text-cyan-300',
      btnColor: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950',
    };
  };

  const ad = getHouseAd();

  return (
    <aside
      aria-label="Partner Showcase"
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 backdrop-blur-xl bg-gradient-to-r ${ad.accentColor} shadow-xl transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15">
              {ad.badge}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Partner
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-black text-white leading-snug">
            {ad.title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            {ad.desc}
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
          <a
            href={ad.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 ${ad.btnColor}`}
          >
            <span>{ad.ctaText}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default TurnkeyAdBanner;
