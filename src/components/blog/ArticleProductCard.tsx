'use client';

import React, { useState } from 'react';
import { ProductOffer, MASTER_PAYOUT } from '@/data/monetizationCatalog';
import { DirectOPayCheckoutModal } from './DirectOPayCheckoutModal';

interface ArticleProductCardProps {
  product: ProductOffer;
  position?: 'inline' | 'bottom';
}

export const ArticleProductCard: React.FC<ArticleProductCardProps> = ({ 
  product, 
  position = 'bottom' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`my-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
      position === 'inline' ? 'my-8' : 'my-12'
    }`}>
      {/* Background Glow Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider">
            {product.badge || 'VERIFIED OPERATIONAL ASSET'}
          </span>
          <span className="text-xs text-slate-400 font-medium">Instant Digital Delivery</span>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-amber-400">
            {product.priceNgn}
          </span>
          <span className="text-xs text-slate-400 block">
            or {product.priceUsd} via Gumroad/Card
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
        {product.title}
      </h3>
      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        {product.summary || product.tagline}
      </p>

      {/* Feature Bullet Points */}
      {product.features && product.features.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs text-slate-200">
          {product.features.map((feat, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Conversion Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        {/* 1. Direct OPay Transfer Modal Button (Instant Zero-Gateway) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <span>⚡ Pay Direct to OPay (Instant NGN Bank Transfer)</span>
        </button>

        {/* 2. Selar / Gumroad Digital Gateway Button */}
        <a
          href={product.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm text-center transition-colors"
        >
          {product.type === 'gumroad' ? 'Buy via Gumroad ($)' : 'Pay via Selar / Card'}
        </a>

        {/* 3. WhatsApp Direct Help */}
        <a
          href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+acquire+${encodeURIComponent(product.title)}+(${product.priceNgn}).+Please+guide+me.`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-1.5 transition-colors"
        >
          <span>💬 WhatsApp Help</span>
        </a>
      </div>

      {/* Guarantee & Compliance Note */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>🔒 Settlement Account: <strong>{MASTER_PAYOUT.bankName}</strong> ({MASTER_PAYOUT.accountNumber} — {MASTER_PAYOUT.accountName})</span>
        <span className="text-amber-400/80">⚡ 100% Verified by Bethelmind Analytics Lagos Desk</span>
      </div>

      {/* Direct OPay Modal */}
      <DirectOPayCheckoutModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
