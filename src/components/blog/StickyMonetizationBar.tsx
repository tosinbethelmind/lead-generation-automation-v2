'use client';

import React, { useState, useEffect } from 'react';
import { ProductOffer, MASTER_PAYOUT, DFY_PROTOTYPE_OFFERS } from '@/data/monetizationCatalog';
import { DirectOPayCheckoutModal } from './DirectOPayCheckoutModal';

interface StickyMonetizationBarProps {
  product?: ProductOffer;
  postTitle: string;
}

export const StickyMonetizationBar: React.FC<StickyMonetizationBarProps> = ({ product, postTitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      const scrollPosition = window.scrollY;
      // Show after user has scrolled 350px down
      if (scrollPosition > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const displayProduct = product || {
    id: 'da-b2bleadgen',
    niche: 'B2B Growth & Commercial Prototypes',
    title: 'Bethelmind Turnkey Prototype & LeadGen OS',
    tagline: '100% Turnkey DFY Prototype Setup & WhatsApp Sales Engine',
    summary: 'Custom domain, Google Maps SEO, 24/7 AI WhatsApp Closer Bot, and Vercel cloud hosting.',
    priceNgn: '₦75,000',
    priceUsd: '$49',
    checkoutUrl: DFY_PROTOTYPE_OFFERS[0].ctaUrl,
    type: 'turnkey_prototype' as const,
    badge: 'HIGH CONVERSION',
    features: ['48-Hour Live Delivery', 'Direct OPay Settlement', '24/7 Sales Bot']
  };

  const isDfy = displayProduct.type === 'turnkey_prototype';
  const whatsappUrl = `${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+claim+the+${encodeURIComponent(displayProduct.title)}+(${displayProduct.priceNgn})+from+your+article+on+${encodeURIComponent(postTitle)}`;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-lg border-t-2 border-amber-400/40 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 animate-slide-up">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Product summary & pricing */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-base shrink-0 shadow-md">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {displayProduct.badge || 'RECOMMENDED ASSET'}
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {displayProduct.priceNgn} {displayProduct.priceUsd ? `(${displayProduct.priceUsd})` : ''}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-white truncate max-w-sm sm:max-w-md">
                {displayProduct.title}
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Direct OPay Transfer Modal Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>⚡ Direct OPay Transfer</span>
            </button>

            {/* Selar or Prototype Link */}
            {displayProduct.checkoutUrl && !isDfy && (
              <a
                href={displayProduct.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors whitespace-nowrap"
              >
                Card / Selar
              </a>
            )}

            {/* WhatsApp Closer */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>💬 WhatsApp Desk</span>
            </a>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss banner"
              className="text-slate-400 hover:text-white text-xs w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Direct OPay Checkout Modal */}
      <DirectOPayCheckoutModal
        product={displayProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
