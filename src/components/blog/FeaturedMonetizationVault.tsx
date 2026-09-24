'use client';

import React, { useState } from 'react';
import { SELAR_DIGITAL_PRODUCTS, MASTER_PAYOUT, DFY_PROTOTYPE_OFFERS, ProductOffer } from '@/data/monetizationCatalog';
import { DirectOPayCheckoutModal } from './DirectOPayCheckoutModal';

export const FeaturedMonetizationVault: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const turnkeyOffer: ProductOffer = {
    id: 'dfy-turnkey',
    niche: 'Turnkey Commercial Web Portals',
    title: '100% Turnkey DFY Commercial Business Portal',
    tagline: 'Custom Domain, Google Maps SEO & 24/7 AI WhatsApp Closer Bot',
    summary: '48-Hour SLA Delivery: We build, brand, and launch your business conversion portal with 24/7 WhatsApp quote engine and direct OPay settlement.',
    priceNgn: '₦75,000 Deposit',
    priceUsd: '₦150,000 Full',
    checkoutUrl: DFY_PROTOTYPE_OFFERS[0].ctaUrl,
    type: 'turnkey_prototype',
    badge: '48H TURNAROUND',
    features: [
      'Pre-configured 24/7 AI WhatsApp quoter',
      'Branded .com.ng custom domain included',
      'Local Lagos/Nigeria Google Maps SEO optimization',
      'Instant direct OPay settlement integration'
    ]
  };

  const showcaseProducts = [
    SELAR_DIGITAL_PRODUCTS[1], // 500+ CleanTech Decision Makers Vault (₦650,000 / $499)
    SELAR_DIGITAL_PRODUCTS[0], // B2B LeadGen OS & 5k Lagos Leads (₦44,000 / $29)
    turnkeyOffer,              // Turnkey DFY Portal (₦75k Deposit)
    SELAR_DIGITAL_PRODUCTS[3], // 2026 Solar ROI Calculator OS (₦11,000 / $7)
  ];

  const handleOpenModal = (prod: ProductOffer) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/25 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div 
        className="pointer-events-none absolute -top-32 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-2">
              <span>⚡ HIGH-YIELD OPERATIONAL ASSETS &amp; DFY SYSTEMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Commercial Monetization &amp; Revenue Assets Vault
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Tested B2B data directories, clean energy decision-maker vaults, and turnkey client acquisition engines deployed in under 48 hours.
            </p>
          </div>
          <div className="text-xs text-slate-400 shrink-0">
            Official Settlement: <strong className="text-amber-400">{MASTER_PAYOUT.bankName}</strong> ({MASTER_PAYOUT.accountNumber})
          </div>
        </div>

        {/* 4-Card Revenue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {showcaseProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/25">
                    {prod.badge || 'PRO ASSET'}
                  </span>
                  <span className="text-base font-black text-amber-400">
                    {prod.priceNgn}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors leading-snug">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {prod.summary || prod.tagline}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenModal(prod)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span>⚡ Direct OPay Transfer</span>
                </button>
                {prod.checkoutUrl && (
                  <a
                    href={prod.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs text-center block transition-colors"
                  >
                    Card / Selar Access ({prod.priceUsd}) →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner note */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>All digital assets dispatched automatically within 5 minutes of payment confirmation.</span>
          </div>
          <a
            href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+inquire+about+your+commercial+digital+products+and+turnkey+portals.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
          >
            <span>💬 Speak with Lagos Desk on WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {selectedProduct && (
        <DirectOPayCheckoutModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};
