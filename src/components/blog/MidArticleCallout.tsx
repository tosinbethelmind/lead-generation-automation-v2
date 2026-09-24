'use client';

import React, { useState } from 'react';
import { MASTER_PAYOUT, DFY_PROTOTYPE_OFFERS, ProductOffer } from '@/data/monetizationCatalog';
import { DirectOPayCheckoutModal } from './DirectOPayCheckoutModal';

interface MidArticleCalloutProps {
  category: string;
  postTitle: string;
}

const SECTOR_TOOL_MAPPING: Record<string, { toolName: string; hook: string; setupPrice: string; retainerPrice: string }> = {
  'CleanTech & Solar Energy': {
    toolName: 'Solar & Inverter Instant BOQ Quoter & Load Sizer',
    hook: 'Stops after-hours quote abandonment by calculating exact battery & panel loads in 60 seconds on WhatsApp.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦25,000–₦50,000/mo'
  },
  'Healthcare & Clinic Management': {
    toolName: 'Automated Patient Booking & Consultation Deposit Lock',
    hook: 'Eliminates clinic no-shows by collecting commitment deposits and syncing doctor calendars 24/7.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦15,000–₦35,000/mo'
  },
  'Hospitality & Luxury Shortlets': {
    toolName: 'Direct WhatsApp Booking Engine & Dynamic Midweek Pricing',
    hook: 'Replaces 20% Airbnb fees with direct bookings and automated caution deposit verification.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦30,000–₦60,000/mo'
  },
  'Private Education & Schools': {
    toolName: 'Private School Term Fee Portal with Result Gating',
    hook: 'Eliminates manual bank teller audits by auto-gating digital report cards until school fees clear.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦50,000–₦100,000/term'
  },
  'Auto Clearing & Customs Logistics': {
    toolName: '24/7 Tokunbo VIN Customs Duty & Vehicle Quoter',
    hook: 'Gives buyers instant import duty and drive-away valuations on WhatsApp, closing vehicle sales 3x faster.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦20,000–₦45,000/mo'
  },
  'Beauty, Spas & Wellness': {
    toolName: 'Automated VIP Chair Booking & Retail Aftercare Closer',
    hook: 'Fills slow weekday chairs with automated WhatsApp appointment reminders and deposit locks.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦15,000–₦30,000/mo'
  },
  'Logistics, Haulage & Supply Chain': {
    toolName: 'Hyperlocal Freight Quoter & Waybill Tracking Aggregator',
    hook: 'Turns shipping inquiries into paid consignments in under 3 minutes with automated rate calculation.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦20,000–₦45,000/mo'
  },
  'Real Estate & Diaspora Wealth': {
    toolName: 'Tenant Service Charge & Rent Escrow Manager',
    hook: 'Automates diaspora rent collections, title verification checks, and maintenance breakdown alerts.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦50,000–₦150,000/mo'
  },
  'Corporate Compliance, CAC & Legal Ops': {
    toolName: 'Corporate Legal Intake & Annual Return Compliance Engine',
    hook: 'Prevents CAC inactive status penalties with automated document intake and digital agreements.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦25,000–₦50,000/mo'
  }
};

export const MidArticleCallout: React.FC<MidArticleCalloutProps> = ({ category, postTitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const matched = SECTOR_TOOL_MAPPING[category] || {
    toolName: 'Instant WhatsApp Speed-to-Lead & Catalog Closer',
    hook: 'Sub-3s WhatsApp catalog and automated FAQ assistant converting Instagram & retail prospects 24/7.',
    setupPrice: '₦75,000 Deposit (₦150,000 Full)',
    retainerPrice: '₦15,000–₦30,000/mo'
  };

  const depositProduct: ProductOffer = {
    id: 'dfy-deposit',
    niche: category,
    title: `100% Turnkey DFY Setup: ${matched.toolName}`,
    tagline: matched.hook,
    summary: '48-Hour delivery guarantee: Branded .com.ng domain, Google Maps SEO discovery, 24/7 AI WhatsApp bot, and Vercel cloud hosting.',
    priceNgn: '₦75,000',
    priceUsd: '$49',
    checkoutUrl: DFY_PROTOTYPE_OFFERS[0].ctaUrl,
    type: 'turnkey_prototype',
    badge: '48-HOUR SLA',
    features: [
      'Pre-configured for your exact business niche',
      'Instant direct OPay settlement integration',
      '24/7 automated WhatsApp quoter bot',
      'Zero monthly hosting lock-in'
    ]
  };

  const whatsappUrl = `${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+deploy+the+${encodeURIComponent(matched.toolName)}+prototype+(₦75k+deposit)+for+my+business.+Saw+your+briefing+on+${encodeURIComponent(postTitle)}`;

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-slate-950 border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
            <span>🚀 48-HOUR TURNKEY DEPLOYMENT GUARANTEE</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Standard Setup: </span>
            <span className="text-sm font-black text-amber-400">{matched.setupPrice}</span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
          Deploy This in Your Business: {matched.toolName}
        </h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {matched.hook} We build, brand, and deploy your complete turnkey portal in <strong>under 48 hours</strong> with a 50% milestone deposit.
        </p>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Direct OPay Milestone Deposit */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>⚡ Lock 50% Setup Deposit (₦75,000) via OPay</span>
          </button>

          {/* 1-Line Embed Script Option */}
          <a
            href={DFY_PROTOTYPE_OFFERS[1].whatsappCta}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm text-center transition-colors"
          >
            1-Line Script Embed (₦35k) →
          </a>

          {/* WhatsApp Direct Consult */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>💬 Ask Lagos Desk</span>
          </a>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>🔒 Direct Payout Settlement: <strong>{MASTER_PAYOUT.bankName}</strong> ({MASTER_PAYOUT.accountNumber} &mdash; {MASTER_PAYOUT.accountName})</span>
          <span className="text-emerald-400 font-semibold">✓ 100% Guaranteed 48-Hour Live Delivery</span>
        </div>
      </div>

      <DirectOPayCheckoutModal
        product={depositProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
