'use client';

import React, { useState, useEffect } from 'react';
import { MASTER_PAYOUT, SELAR_DIGITAL_PRODUCTS } from '@/data/monetizationCatalog';

export const ExitIntentOfferModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user already saw exit modal this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('bm_exit_modal_shown')) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Desktop: Detect mouse leaving top of screen (towards address bar or back button)
      if (e.clientY <= 10 && !hasTriggered) {
        triggerModal();
      }
    };

    const triggerModal = () => {
      setIsOpen(true);
      setHasTriggered(true);
      sessionStorage.setItem('bm_exit_modal_shown', 'true');
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered]);

  if (!isOpen) return null;

  const leadGenProduct = SELAR_DIGITAL_PRODUCTS[0]; // B2B LeadGen OS (₦44k)

  const copyAccount = () => {
    navigator.clipboard.writeText(MASTER_PAYOUT.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappInquiryUrl = `${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+saw+your+exclusive+exit+offer.+I+want+to+claim+the+5,000+Lagos+B2B+Leads+OS+(₦44,000)+or+discuss+a+custom+prototype.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-base font-bold w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Exclusive Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
          <span>🎁 EXCLUSIVE OPERATOR ACCESS &middot; LIMITED AVAILABILITY</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
          Before You Go: Close More B2B Clients This Week!
        </h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Get direct access to the <strong>Bethelmind B2B LeadGen &amp; WhatsApp Sales OS</strong> or deploy a tailored 24/7 AI conversion bot for your specific sector.
        </p>

        {/* Offer Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/30 mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-slate-300">Instant Asset Delivery:</span>
            <span className="text-xl font-black text-amber-400">{leadGenProduct.priceNgn} <span className="text-xs text-slate-400">({leadGenProduct.priceUsd})</span></span>
          </div>

          <div className="text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>5,000+ Verified Lagos B2B Decision Makers</strong> (Phone, Email, Sector)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>1-Click Make.com WhatsApp Sales Bot</strong> &amp; Webhook Blueprint</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>Direct NIP Settlement:</strong> {MASTER_PAYOUT.bankName} (<code>{MASTER_PAYOUT.accountNumber}</code>)</span>
            </div>
          </div>
        </div>

        {/* Direct Action Grid */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 1-Click Copy Account */}
            <button
              onClick={copyAccount}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>💳 {copied ? '✓ Account Copied!' : 'Copy OPay Account'}</span>
            </button>

            {/* Direct Selar Gateway */}
            <a
              href={leadGenProduct.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs text-center transition-all hover:scale-105 shadow-md flex items-center justify-center gap-1.5"
            >
              Instant Card / Selar Access →
            </a>
          </div>

          {/* Direct WhatsApp Closer */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-colors"
          >
            <span>💬 Chat Direct with Lagos Desk on WhatsApp (0802 279 1227) →</span>
          </a>

          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-500">
              Zero risk &middot; Direct Nigerian Bank Settlement &middot; Instant Digital Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
