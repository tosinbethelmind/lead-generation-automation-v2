'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageCircle, 
  Download, 
  CreditCard, 
  Building2, 
  Lock, 
  Sparkles, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export interface DualCheckoutTrustCardProps {
  productTitle: string;
  price: string;
  selarUrl: string;
  category?: string;
  amountNgn?: number;
  adminPhone?: string;
}

export const DualCheckoutTrustCard: React.FC<DualCheckoutTrustCardProps> = ({
  productTitle,
  price,
  selarUrl,
  category = 'Commercial Assets',
  amountNgn = 15000,
  adminPhone = '2348022791227',
}) => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [activeTab, setActiveTab] = useState<'selar' | 'transfer'>('selar');

  const bankAccount = '6805375225';
  const bankName = 'Moniepoint Microfinance Bank';
  const accountName = 'Bethelmind Digital Solutions';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const whatsappReceiptUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
    `Hello Bethelmind Support! I have completed a direct Moniepoint bank transfer of ${price} for the *${productTitle}* (Account 6805375225 - Bethelmind Digital Solutions). Here is my payment receipt/proof so you can release my instant PDF & spreadsheet files.`
  )}`;

  return (
    <section className="bg-gradient-to-br from-[#0c1222] via-[#090e1a] to-[#060a12] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-slate-100">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Commercial Asset & Blueprint</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> CAC RC 7034297
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline">256-Bit Encrypted Settlement</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Product Value Narrative */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight font-['Outfit']">
            {productTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gain immediate, unrestricted access to verified production spreadsheets, financial models, binding legal contract templates, and automated calculation workflows tailored for the Nigerian commercial landscape.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {[
              '100% Editable Excel & Notion Templates',
              'Instant Automated Email & WhatsApp Delivery',
              'Real NGN Cost & Tariff Sizers (2026 Updated)',
              'Zero Recurring Subscription Fees'
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Pricing Highlight */}
          <div className="pt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-emerald-400">{price}</span>
            <span className="text-xs text-slate-400 line-through">₦45,000 Normal Agency Rate</span>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Save 66% Today
            </span>
          </div>
        </div>

        {/* Right Column: Dual Payment Choice Selector */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          
          {/* Method Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('selar')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'selar'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Selar 1-Click</span>
            </button>

            <button
              onClick={() => setActiveTab('transfer')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'transfer'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Transfer</span>
            </button>
          </div>

          {/* Method A: Selar Instant Online Checkout */}
          {activeTab === 'selar' && (
            <div className="space-y-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-300 block">Instant Card / USSD / Bank Checkout</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Pay securely with ATM card, bank transfer, or USSD on Selar. Your files download immediately on the confirmation screen and are sent to your email.
                </p>
              </div>

              <a
                href={selarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#080d19] font-black text-xs transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unlock Blueprint on Selar ({price}) →</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Zero card details stored · 100% SSL Encrypted</span>
              </div>
            </div>
          )}

          {/* Method B: Direct Moniepoint MFB Transfer */}
          {activeTab === 'transfer' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Bank Name:</span>
                  <span className="text-white font-bold">{bankName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Account Name:</span>
                  <span className="text-emerald-400 font-bold">{accountName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-slate-300 font-semibold">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white font-mono">{bankAccount}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <a
                href={whatsappReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Confirm Payment on WhatsApp →</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Settlement verified directly by Bethelmind Accounts Desk</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default DualCheckoutTrustCard;
