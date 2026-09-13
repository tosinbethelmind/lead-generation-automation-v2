'use client';

import React, { useState } from 'react';
import { MASTER_PAYOUT, ProductOffer } from '@/data/monetizationCatalog';

interface ModalProps {
  product: ProductOffer;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectOPayCheckoutModal: React.FC<ModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const refCode = `BM-${product.id.slice(0, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const copyAccount = () => {
    navigator.clipboard.writeText(MASTER_PAYOUT.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappReceiptUrl = `${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+have+completed+bank+transfer+of+${encodeURIComponent(product.priceNgn)}+for+${encodeURIComponent(product.title)}+[Ref:+${refCode}].+Please+confirm+and+dispatch+my+access.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl text-white">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span>⚡ Instant Direct Bank Settlement (Zero Gateways)</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black mb-1">{product.title}</h3>
        <p className="text-xs text-slate-400 mb-6">{product.tagline}</p>

        {/* Price Tag */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-6">
          <span className="text-xs text-slate-300 font-medium">Total Payable (NGN):</span>
          <span className="text-2xl font-black text-amber-400">{product.priceNgn}</span>
        </div>

        {/* Direct OPay Bank Transfer Details */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-950 to-slate-950 border border-amber-500/30 mb-6">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
            Official Nigerian Bank Settlement Account:
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400 text-xs">Bank Name:</span>
              <span className="font-bold text-white">{MASTER_PAYOUT.bankName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 items-center">
              <span className="text-slate-400 text-xs">Account Number:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                  {MASTER_PAYOUT.accountNumber}
                </span>
                <button 
                  onClick={copyAccount}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400 text-xs">Account Name:</span>
              <span className="font-bold text-white">{MASTER_PAYOUT.accountName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 text-xs">Payment Reference:</span>
              <span className="font-mono text-xs text-slate-300 font-bold">{refCode}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Verification CTA */}
        <div className="space-y-3">
          <a 
            href={whatsappReceiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-xl hover:scale-105 transition-all"
          >
            💬 I Have Paid — Send Receipt on WhatsApp (0802 279 1227) →
          </a>
          <div className="text-center">
            <span className="text-[11px] text-slate-400">
              Instant digital delivery link dispatched via WhatsApp & Email within 5 minutes of transfer confirmation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
