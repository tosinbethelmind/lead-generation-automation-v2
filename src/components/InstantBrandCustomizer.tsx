'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, ShieldCheck, CheckCircle2, ArrowRight, Building2, Smartphone, Zap } from 'lucide-react';

export interface InstantBrandCustomizerProps {
  toolTitle: string;
  category: string;
  defaultSectorName?: string;
}

export const InstantBrandCustomizer: React.FC<InstantBrandCustomizerProps> = ({
  toolTitle,
  category,
  defaultSectorName = 'Your Business'
}) => {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'full'>('starter');

  const displayName = businessName.trim() || defaultSectorName;
  const displayPhone = phone.trim() || '0802 279 1227';

  const planText = selectedPlan === 'starter' 
    ? '₦35,000 Starter Go-Live (or ₦25,000/mo Pay-Small-Small)' 
    : '₦75,000 Milestone Deposit (₦150,000 Total Custom Domain Suite)';

  const waMessage = encodeURIComponent(
    `Hello Bethelmind Digital Solutions!\n\n` +
    `I just tested the *${toolTitle}* on your website and previewed it for my enterprise: *${displayName}*.\n\n` +
    `• Business Name: ${displayName}\n` +
    `• Contact Phone: ${displayPhone}\n` +
    `• Selected Plan: ${planText}\n\n` +
    `Please issue our official invoice and Moniepoint settlement account to activate our 24/7 AI WhatsApp closer and dedicated mobile website.`
  );

  const waUrl = `https://wa.me/2348022791227?text=${waMessage}`;

  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950 border-2 border-cyan-500/30 p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] space-y-6">
      
      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SME Commercial Deployment Engine</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit'] tracking-tight">
            Deploy This Exact Tool For Your Business in 24 Hours
          </h3>
          <p className="text-xs text-slate-300">
            Stop losing customers on WhatsApp. Type your business name below to preview your branded engine live:
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CAC Certified RC 7034297</span>
        </div>
      </div>

      {/* Interactive Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enter Your Business or Store Name:</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Apex Solar Lekki, Kene Autos, Glamour Spa"
            className="w-full bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your WhatsApp Business Phone Number:</span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0802 123 4567"
            className="w-full bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Instant Real-Time Brand Preview Card */}
      <div className="bg-slate-950/80 rounded-2xl border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            Live Client-Facing Mobile Preview:
          </span>
          <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Real-Time Simulated
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">{displayName}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Official {category} Portal</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Interactive {toolTitle} + 24/7 AI WhatsApp closer routing all inquiries to <strong className="text-emerald-300">{displayPhone}</strong>.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Delivery Time</span>
            <span className="text-xs font-black text-cyan-300">Under 24–48 Hours</span>
          </div>
        </div>
      </div>

      {/* 2-Tier Pricing Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tier 1: Starter */}
        <div
          onClick={() => setSelectedPlan('starter')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            selectedPlan === 'starter'
              ? 'bg-cyan-950/40 border-cyan-400/80 ring-2 ring-cyan-400/30'
              : 'bg-slate-900/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-white">Tier 1: Starter Go-Live</span>
            <span className="text-xs font-black text-emerald-400">₦35,000</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2">
            Instant activation (or <strong>₦25,000/month</strong> Pay-Small-Small). Pre-built mobile portal + 24/7 AI WhatsApp closer.
          </p>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>Live in 24 Hours · OPay/Moniepoint Shield</span>
          </div>
        </div>

        {/* Tier 2: Turnkey Custom Domain */}
        <div
          onClick={() => setSelectedPlan('full')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            selectedPlan === 'full'
              ? 'bg-indigo-950/40 border-indigo-400/80 ring-2 ring-indigo-400/30'
              : 'bg-slate-900/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-white">Tier 2: Full Custom Suite</span>
            <span className="text-xs font-black text-cyan-300">₦75,000 Deposit</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2">
            ₦150,000 total (50% milestone deposit). Dedicated <strong>.com.ng</strong> domain + Google SEO ranking + 100% code ownership.
          </p>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
            <span>Turnkey Handover in 48 Hours · Full Assets</span>
          </div>
        </div>
      </div>

      {/* Primary WhatsApp Action Button & Settlement Notice */}
      <div className="space-y-3 pt-1">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Deploy For {displayName} On WhatsApp (From ₦35,000) →</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Direct Corporate Settlement: <strong>Moniepoint Microfinance Bank (6805375225)</strong>
          </span>
          <span className="text-slate-500">
            Bethelmind Digital Solutions · CAC RC 7034297
          </span>
        </div>
      </div>

    </div>
  );
};
