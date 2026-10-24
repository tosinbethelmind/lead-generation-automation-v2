'use client';

import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Zap, Laptop, Clock } from 'lucide-react';

export interface TurnkeySmeSetupBannerProps {
  toolName: string;
  category?: string;
  adminPhone?: string;
}

export const TurnkeySmeSetupBanner: React.FC<TurnkeySmeSetupBannerProps> = ({
  toolName,
  category = 'Commercial Business',
  adminPhone = '2348022791227',
}) => {
  const whatsAppSetupUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
    `Hello Bethelmind Digital Solutions! I am using the *${toolName}* on your website. I want to deploy this exact branded interactive calculator + 24/7 AI WhatsApp closer for my own company (₦35,000 SME Starter Package). How do we begin?`
  )}`;

  return (
    <aside aria-label="Turnkey B2B SME Setup Offer" className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-950 border border-[#d4af37]/35 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle Glow Accent */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Narrative */}
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Turnkey B2B SME Deployment (48-Hour Guarantee)</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight font-['Outfit']">
            Want This Exact {toolName} Branded for Your Business?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Stop losing potential customers to slow quotation replies. We deploy your own custom-branded calculation engine, complete with your logo, custom pricing formulas, and an autonomous 24/7 AI WhatsApp closer that books appointments and captures qualified phone numbers while you sleep.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Laptop className="w-4 h-4 text-[#d4af37]" /> Custom Domain or Subdomain
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-emerald-400" /> Live in 48 Hours
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Zero Technical Skills Required
            </span>
          </div>
        </div>

        {/* Right CTA Price Box */}
        <div className="shrink-0 w-full sm:w-auto bg-black/40 border border-white/10 rounded-2xl p-5 text-center space-y-3 shadow-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Complete Turnkey Setup
          </div>
          
          <div className="text-3xl font-black text-emerald-400 font-mono">
            ₦35,000
          </div>
          
          <div className="text-[10px] text-slate-400">
            One-time activation · No monthly software trap
          </div>

          <a
            href={whatsAppSetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#080d19] font-black text-xs transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Deploy My Branded Setup →</span>
          </a>
        </div>

      </div>
    </aside>
  );
};

export default TurnkeySmeSetupBanner;
