import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck, Zap, MessageCircle, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { SectorToolsWidget } from '@/components/SectorToolsWidget';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';
import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { slug: 'website-grader' },
    { slug: 'google-visibility' },
    { slug: 'solar-boq' },
    { slug: 'solar-quote-pro' },
    { slug: 'solar-quote' },
    { slug: 'salon-booking' },
    { slug: 'tokunbo-duty' },
    { slug: 'mortgage-calc' },
    { slug: 'clinic-booking' },
    { slug: 'school-tuition' },
    { slug: 'logistics-waybill' },
    { slug: 'cac-filing' },
    { slug: 'shortlet-booking' },
    { slug: 'recruitment' },
    { slug: 'integrations' },
    { slug: 'social-ads' },
  ];
}

interface ToolProfile {
  title: string;
  category: string;
  tag: string;
  summary: string;
  highlightPills: string[];
}

function getToolProfile(rawSlug: string): ToolProfile {
  const slug = (rawSlug || 'solar').toLowerCase().replace(/\.html$/i, '');

  if (/solar|boq|inverter|energy/.test(slug)) {
    return {
      title: 'Solar & Renewable Energy BOQ Load Sizer',
      category: 'Solar & Renewable Energy',
      tag: '⚡ NERC Band A Tariff Avoidance Suite',
      summary: 'Precision load calculation, DisCo Band A/B/C tariff avoidance vs generator diesel fuel economics, and automated customer WhatsApp BOQ proposal generator for Nigerian solar installers.',
      highlightPills: ['Sub-2s WhatsApp BOQ', '51.2V LiFePO4 Sizing', 'Diesel vs Solar Payback Matrix'],
    };
  }

  if (/tokunbo|duty|auto|car|clearing/.test(slug)) {
    return {
      title: 'Tokunbo VIN Customs Duty & Port Landing Sizer',
      category: 'Automobile & Tokunbo Dealership',
      tag: '🚗 NCS 2026 Single-Sheet Tariff',
      summary: 'Calculates statutory 20% import duty, 15% NAC levy, 7.5% VAT, and PTML/Tin Can terminal charges for Lagos car dealers and auto auction importers.',
      highlightPills: ['17-Digit VIN Decode', 'NCS 2026 Valuation Matrix', 'Terminal Demurrage Estimator'],
    };
  }

  if (/salon|beauty|spa|hair|stylist/.test(slug)) {
    return {
      title: 'Salon & Spa 24/7 Booking & Deposit Lock Engine',
      category: 'Beauty & Hair Salon',
      tag: '💅 25% Anti-No-Show Deposit Lock',
      summary: '24/7 appointment scheduler that locks client stylist slots with instant Paystack/Moniepoint bank transfer deposits, eliminating empty salon chairs and fake alerts.',
      highlightPills: ['Zero Fake Alerts', '24/7 WhatsApp Appointment Desk', 'Stylist Commission Split Ledger'],
    };
  }

  if (/mortgage|real-estate|estate|property|land/.test(slug)) {
    return {
      title: 'Plot Layout, Survey Levies & Mortgage Amortization Suite',
      category: 'Real Estate & Property Development',
      tag: '🏡 Title & Infrastructure Allocation',
      summary: 'Calculates 300 sqm Half Plot vs 500/600 sqm Full Plot outright packages, registered survey (Red Copy) fees, deed of assignment levies, and developer installment spreads.',
      highlightPills: ['Survey & Deed Sizer', 'Multi-Tier Realtor 5% WHT Ledger', 'Diaspora Forex Milestone Tracker'],
    };
  }

  if (/clinic|healthcare|medical|doctor|hmo/.test(slug)) {
    return {
      title: 'Clinic HMO Claims & Procedure Co-Pay Reconciler',
      category: 'Clinic & Healthcare HMO',
      tag: '🏥 60% Upfront Admission Deposit',
      summary: 'Reconciles HMO procedure tariffs, patient co-pay deductions, and secondary AuthCodes to prevent 60-day claim rejections, with upfront surgical admission deposits.',
      highlightPills: ['Reliance / Hygeia AuthCode Risk Guard', '60% Admission Deposit Lock', 'Diagnostic Lab Panel Sizer'],
    };
  }

  if (/school|tuition|education|pin/.test(slug)) {
    return {
      title: 'Private School Term Tuition & Result PIN Portal',
      category: 'Private Education & Schools',
      tag: '🎓 Result Broadsheet Gating',
      summary: 'Student term fee payment gateway that automatically gates digital term report cards and WAEC broadsheets until school fees clear, with scratch-PIN batch accounting.',
      highlightPills: ['Auto-Gated Report Cards', 'PIN Batch Profit Accounting', 'Direct Bank Transfer Remittance'],
    };
  }

  if (/logistics|waybill|dispatch|freight|haulage/.test(slug)) {
    return {
      title: 'Hyperlocal Dispatch & Long-Haul Trip Freight Sizer',
      category: 'Logistics & Freight Haulage',
      tag: '📦 Interstate Diesel & Waybill Tracker',
      summary: 'Aggregates multi-carrier dispatch pricing, generates automated WhatsApp waybill tracking links for customers, and audits driver interstate diesel consumption.',
      highlightPills: ['Auto-SMS Waybill Tracking', 'Diesel Pilferage Audit', 'NURTW Interstate Levy Estimator'],
    };
  }

  if (/cac|legal|filing|compliance/.test(slug)) {
    return {
      title: 'CAC Corporate Filing Fees & Legal Retainer Suite',
      category: 'Legal & CAC Corporate Services',
      tag: '⚖️ CAC & SCUML Compliance Matrix',
      summary: 'Calculates statutory CAC registration and annual return arrears, FIRS stamp duty, SCUML anti-money laundering certification fees, and itemized counsel debit notes.',
      highlightPills: ['Official CAC Fee Matrix', 'SCUML & TCC Cost Sizer', 'FIRS 7.5% VAT & 5% WHT Credit Note'],
    };
  }

  if (/shortlet|hospitality|hotel|apartment/.test(slug)) {
    return {
      title: 'Shortlet Electricity Token & Caution Deposit Reconciler',
      category: 'Shortlet & Hospitality Apartments',
      tag: '🏨 DisCo kWh & Damage Deposit Ledger',
      summary: 'Reconciles guest nightly rates, 250kVA generator overtime surcharges, and actual DisCo prepaid meter consumption against refundable caution deposits.',
      highlightPills: ['Prepaid Meter Token Deduction', 'Refundable Caution Splitter', 'Instant WhatsApp Check-In Receipt'],
    };
  }

  return {
    title: `${rawSlug.replace(/\.html$/i, '').replace(/[-_]+/g, ' ').toUpperCase()} Commercial Tool`,
    category: 'Commercial Enterprise',
    tag: '⚡ 2026 Enterprise Engine',
    summary: 'Automated 24/7 business calculation, quotation, and client qualification engine pre-configured for Nigerian commercial operators.',
    highlightPills: ['Instant WhatsApp Dispatch', '₦0 Upfront Preview', 'Bankable PDF Quote Generator'],
  };
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const profile = getToolProfile(slug);

  return {
    title: `${profile.title} Nigeria | Bethelmind Digital Solutions`,
    description: profile.summary,
    openGraph: {
      title: `${profile.title} | Bethelmind Digital Solutions Nigeria`,
      description: profile.summary,
      url: `https://www.bethelmindanalytics.com/tools/${slug}`,
      siteName: 'Bethelmind Digital Solutions',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  if (slug === 'integrations') {
    return <IntegrationBlueprintDashboard />;
  }

  const profile = getToolProfile(slug);

  return (
    <main className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Hairline Metallic Accent Glow */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 opacity-90 shadow-[0_0_20px_rgba(6,182,212,0.6)]" />

      {/* Atmospheric Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        
        {/* Executive Luxury Header Bar */}
        <header className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/5 space-y-5">
          
          {/* Top Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10 pb-4">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bethelmind Ecosystem</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                CAC Certified Enterprise · RC 7034297
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                2026 Production Release
              </span>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.tag}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
                {profile.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {profile.summary}
              </p>

              {/* Value Highlight Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {profile.highlightPills.map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-lg"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{pill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Commercial Activation CTA Card */}
            <div className="lg:w-72 shrink-0 bg-gradient-to-br from-slate-900/90 to-slate-950 p-4 rounded-2xl border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Custom SME Setup</span>
                <span className="text-emerald-400 font-black">₦35,000 Starter</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Want this exact tool + 24/7 AI WhatsApp closer deployed on your dedicated custom domain?
              </p>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Digital Solutions! I am testing the live *${profile.title}* on your website. I would like to activate our dedicated business setup with 24/7 AI WhatsApp closer (₦35k Starter Package).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Claim Setup on WhatsApp →</span>
              </a>
            </div>
          </div>
        </header>

        {/* Feature Interactive Suite */}
        <section aria-label="Interactive Tool Engine">
          {slug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget businessCategory={profile.category} />
          )}
        </section>

        {/* Security & Verification Footer Seal */}
        <footer className="text-center py-6 text-xs text-slate-500 border-t border-white/5 space-y-2">
          <p className="flex items-center justify-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Bank-Grade 256-bit Encrypted Telemetry · Settlement via Moniepoint Microfinance Bank (6805375225)</span>
          </p>
          <p>© 2026 Bethelmind Digital Solutions · Plot 12, Commercial Corridor, Lagos, Nigeria.</p>
        </footer>
      </div>

      {/* 24/7 Bethel AI Concierge */}
      <CustomerAiAgentWidget
        sector={profile.category}
        agentTitle={`Bethel — ${profile.category} AI Specialist`}
      />
    </main>
  );
}
