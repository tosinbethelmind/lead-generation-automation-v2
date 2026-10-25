'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  MessageCircle, 
  Code, 
  Layers, 
  HelpCircle,
  Clock,
  Building,
  CheckCircle2,
  Lock,
  Scale
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import InvoiceModal, { InvoiceItem } from '@/components/InvoiceModal';
import { 
  PLANS_NEED_WEBSITE, 
  PLANS_HAVE_WEBSITE, 
  OUTRIGHT_PACKAGES, 
  MAINTENANCE_OPTIONS, 
  ON_DEMAND_TASK_MENU,
  getPlanById 
} from '@/config/plans';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';

export default function PricingPage() {
  const [tab, setTab] = useState<'turnkey' | 'embed' | 'outright' | 'maintenance'>('turnkey');
  const [invoicePlanId, setInvoicePlanId] = useState<string | null>(null);
  const [customInvoiceItems, setCustomInvoiceItems] = useState<InvoiceItem[] | null>(null);

  const selectedPlan = invoicePlanId ? getPlanById(invoicePlanId, tab === 'embed' ? 'have_website' : 'need_website') : null;

  const handleOpenInvoice = (planId: string, customItems?: InvoiceItem[]) => {
    setInvoicePlanId(planId);
    setCustomInvoiceItems(customItems || null);
  };

  const waGeneralLink = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    'Hello Bethelmind Lagos Pricing Desk! I am reviewing your package pricing and would like to speak with a solutions consultant.'
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Commercial Pricing &bull; CAC Certified Enterprise RC 7034297</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
            Invest in a 24/7 Revenue Engine. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Zero Risk.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Pay a 50% commitment deposit to start. Test your live prototype on your phone within 48 hours. Pay the balance <span className="text-white font-bold underline decoration-[#d4af37] underline-offset-4">ONLY after you approve the build</span>.
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>48-Hour Deployment SLA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>100% Code & Domain Ownership</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Moniepoint MFB Corporate Escrow (6805375225)</span>
            </span>
          </div>
        </div>

        {/* Pricing Category Navigation Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg gap-1 max-w-full overflow-x-auto">
            {[
              { id: 'turnkey', label: 'Turnkey Websites + AI (Need Website)' },
              { id: 'embed', label: '1-Line Embed (Have Website)' },
              { id: 'outright', label: 'Outright Source Code Buyout' },
              { id: 'maintenance', label: 'Maintenance & Support Vouchers' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-[#080d19] shadow-md shadow-[#d4af37]/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: TURNKEY PACKAGES (NEED WEBSITE) */}
        {tab === 'turnkey' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANS_NEED_WEBSITE.map((plan) => {
                const isPopular = plan.id === 'pro';
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                      isPopular
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/10 -translate-y-1.5'
                        : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-xl'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-[#080d19] font-black text-[11px] uppercase tracking-wider shadow-md">
                        Corporate Choice &bull; Most Popular
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                          {plan.id === 'starter' ? 'Starter Activation' : plan.id === 'pro' ? 'Corporate Pro Suite' : 'Enterprise Web + APK'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Pricing Block */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">Total Project Value:</span>
                          <span className="text-lg font-black text-white font-mono">
                            ₦{plan.totalAmountNGN.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-white/5 pt-2">
                          <span className="text-xs text-emerald-400 font-bold">50% Deposit to Start:</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            ₦{plan.depositAmountNGN.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-white/5 pt-2">
                          <span className="text-xs text-slate-400">Balance on Live Approval:</span>
                          <span className="text-xs font-bold text-slate-300 font-mono">
                            ₦{plan.balanceAmountNGN.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Guaranteed Delivery in {plan.slaHours} Hours &bull; 1 Full Year Domain & Hosting Included</span>
                        </p>
                      </div>

                      {/* Deliverables List */}
                      <ul className="space-y-2.5 pt-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTAs */}
                    <div className="pt-6 space-y-2.5 border-t border-white/5 mt-6">
                      <a
                        href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                          `Hello Bethelmind Lagos Desk! I want to start with the *${plan.name}* (₦${plan.depositAmountNGN.toLocaleString()} deposit, ₦${plan.totalAmountNGN.toLocaleString()} total). Please issue our official onboarding invoice and project roadmap.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#080d19] font-black shadow-lg shadow-[#d4af37]/20 active:scale-95'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Start With ₦{plan.depositAmountNGN.toLocaleString()} Deposit →</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenInvoice(plan.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Generate Bankable Proforma Invoice (PDF)</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Turnkey Guarantee Banner */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">48-Hour Live Inspection & Balance Lock</h4>
                  <p className="text-xs text-slate-400">
                    You never pay the balance until your official website and 24/7 AI WhatsApp assistant are fully tested live on your phone.
                  </p>
                </div>
              </div>
              <a
                href={waGeneralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 whitespace-nowrap"
              >
                Chat with Solutions Lead
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: 1-LINE EMBED (HAVE WEBSITE) */}
        {tab === 'embed' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Keep Your Existing Website &bull; Add 24/7 AI & Calculators in 60 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Works seamlessly with WordPress, Shopify, Wix, WooCommerce, Webflow, and custom HTML. Zero disruption to your current domain or hosting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS_HAVE_WEBSITE.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                      {plan.badge || '1-Line Embed Upgrade'}
                    </span>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {plan.tagline}
                    </p>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">One-Time Setup:</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        ₦{plan.totalAmountNGN.toLocaleString()}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                      `Hello Bethelmind Lagos Desk! I want to order the *1-Line Embed Upgrade: ${plan.name}* (₦${plan.totalAmountNGN.toLocaleString()} one-time). Please send the embed script tag and integration guide.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Get 1-Line Embed Script →</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OUTRIGHT CODE BUYOUT (ZERO MONTHLY FEES) */}
        {tab === 'outright' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Complete Source Code & Legal Intellectual Property (IP) Handover
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Own 100% of your software asset. Includes full GitHub repository access, ZIP bundle, signed IP assignment deed, and self-hosting documentation. ₦0 monthly subscriptions forever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {OUTRIGHT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-3xl p-6 bg-slate-900/80 border border-[#d4af37]/35 hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider inline-block">
                      {pkg.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">1-Time Outright Price:</span>
                      <span className="text-xl font-black text-[#d4af37] font-mono">
                        ₦{pkg.priceNGN.toLocaleString()}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                      `Hello Bethelmind Lagos Desk! I want to order the *1-Time Outright Purchase & Source Code Handover* for *${pkg.name}* (₦${pkg.priceNGN.toLocaleString()} one-off, ₦0 monthly). Please provide the legal IP assignment deed and payment details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#080d19] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-[#d4af37]/20 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Claim Full Code Ownership →</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MAINTENANCE & SUPPORT VOUCHERS */}
        {tab === 'maintenance' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Post-Launch Peace of Mind & Support Vouchers
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Hands-free annual domain renewals, cloud hosting, and on-demand developer tasks. No long-term lock-in contracts.
              </p>
            </div>

            {/* Maintenance Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {MAINTENANCE_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      {opt.badge}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-['Outfit']">
                      {opt.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {opt.desc}
                    </p>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Investment:</span>
                      <div>
                        <span className="text-2xl font-black text-emerald-400 font-mono">
                          ₦{opt.priceNGN.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 ml-1.5">{opt.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {opt.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                      `Hello Bethelmind Lagos Support Desk! I want to activate the *${opt.name}* (₦${opt.priceNGN.toLocaleString()}). Please send setup details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Activate Support Pass →</span>
                  </a>
                </div>
              ))}
            </div>

            {/* On-Demand Pay-As-You-Go Menu */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span>On-Demand Pay-As-You-Go Developer Menu (Single Task Requests)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ON_DEMAND_TASK_MENU.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white">{item.task}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        <span>Turnaround: {item.turnaround}</span>
                      </p>
                    </div>
                    <span className="text-sm font-black text-[#d4af37] font-mono shrink-0 ml-3">
                      ₦{item.priceNGN.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Corporate Settlement & Fraud Prevention Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs text-slate-400 max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building className="w-4 h-4 text-[#d4af37]" />
            <span>Official Corporate Settlement Account &bull; Moniepoint Microfinance Bank</span>
          </div>

          <p className="leading-relaxed">
            All payments and deposits for Bethelmind Digital Solutions are strictly settled to our official registered corporate account:
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block">Bank Name</span>
              <span className="text-sm font-bold text-white">Moniepoint Microfinance Bank</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Account Number</span>
              <span className="text-base font-black text-emerald-400">6805375225</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Account Name</span>
              <span className="text-sm font-bold text-white">Bethelmind Digital Solutions</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">CAC Registration</span>
              <span className="text-xs text-slate-300">RC 7034297</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-[11px] text-amber-300 leading-normal">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Fraud Prevention Advisory:</strong> We will NEVER ask you to make payment into a personal bank account or crypto wallet. Always verify the corporate account name reads <strong>Bethelmind Digital Solutions</strong> before transferring funds.
            </p>
          </div>
        </div>

        {/* Statutory Policy Strip */}
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#d4af37]" />
            <span>All pricing and milestones governed by statutory Nigerian consumer policies.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/legal/delivery" className="text-[#d4af37] hover:underline">Delivery SLA</Link>
            <span>·</span>
            <Link href="/legal/terms" className="text-[#d4af37] hover:underline">Terms</Link>
            <span>·</span>
            <Link href="/legal/refund" className="text-[#d4af37] hover:underline">Refund Policy</Link>
          </div>
        </div>

        {/* Pricing FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white font-['Outfit']">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">Everything you need to know about our milestone billing & delivery guarantee.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does the 50% milestone commitment deposit work?',
                a: 'You pay 50% upfront to initiate dedicated engineering, custom design, and domain registration. Our team builds your live prototype within 48 hours. You test it directly on your phone and verify all features before paying the 50% balance.'
              },
              {
                q: 'What if I am not satisfied with the 48-hour prototype?',
                a: 'We provide unlimited revisions during the initial review session to ensure the branding, price lists, sector calculators, and WhatsApp flows match your exact requirements before final production handover.'
              },
              {
                q: 'Are there any recurring monthly fees on the Turnkey builds?',
                a: 'No monthly rent is charged for the first full year. Your first year of custom .com or .com.ng domain registration and high-speed cloud hosting is 100% included in the total package price. Subsequent years are renewed at low annual rates (or managed via our Annual Peace of Mind Pass).'
              },
              {
                q: 'Can my human sales team take over conversations on WhatsApp?',
                a: 'Yes, 100%. The AI assistant responds instantly in under 3 seconds to qualify leads, quote prices, and share BOQs, but your human staff can jump in and chat directly on WhatsApp whenever they choose.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>{item.q}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Invoice Modal */}
      {invoicePlanId && selectedPlan && (
        <InvoiceModal
          isOpen={Boolean(invoicePlanId)}
          onClose={() => setInvoicePlanId(null)}
          planId={invoicePlanId}
          businessName="Your Business"
          industry="Commercial Enterprise"
          district="Lagos"
          items={
            customInvoiceItems || [
              { name: `${selectedPlan.name} (50% Milestone Deposit to Start)`, price: selectedPlan.depositAmountNGN, qty: 1 },
              { name: 'Milestone Balance (Payable ONLY after live preview inspection & approval)', price: selectedPlan.balanceAmountNGN, qty: 1 }
            ]
          }
        />
      )}

      <Footer />
    </div>
  );
}
