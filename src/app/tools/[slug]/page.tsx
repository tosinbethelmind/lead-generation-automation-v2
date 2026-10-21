import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Maximize2, 
  CheckCircle2, 
  Lock, 
  Share2, 
  MessageCircle,
  Zap,
  ShoppingBag,
  Download
} from 'lucide-react';
import { SectorToolsWidget } from '@/components/SectorToolsWidget';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';
import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

// Complete Registry of the 12 Viral Interactive Tools
export const VIRAL_TOOLS: Record<string, {
  id: string;
  file: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  highlights: string[];
  selarUrl: string;
  selarProduct: string;
  selarPrice: string;
}> = {
  'solar-savings': {
    id: 'solar-savings',
    file: 'solar-savings.html',
    title: 'Solar & Clean Energy Savings Calculator',
    category: 'Solar & Renewable Energy',
    badge: '⚡ Clean Energy ROI Sizer',
    summary: 'Calculate 25-year rooftop solar savings, panel count, battery bank requirements, and 30% clean energy rebates.',
    highlights: ['25-Year Cumulative Savings', 'Battery Bank & Inverter Sizer', 'Direct WhatsApp BOQ Proposal'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Solar Master Procurement Blueprint',
    selarPrice: '₦15,000 / $19',
  },
  'crypto-dca': {
    id: 'crypto-dca',
    file: 'crypto-dca.html',
    title: 'Crypto DCA Wealth Engine & Profit Simulator',
    category: 'Crypto & Digital Assets',
    badge: '📈 DCA Wealth Simulator',
    summary: 'Model Dollar-Cost Averaging across BTC, ETH, and SOL with historical market cycles, compounding yield, and risk metrics.',
    highlights: ['Multi-Cycle DCA Modeling', 'Compounding Wealth Projection', 'Drawdown Risk Guard Matrix'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Algorithmic Crypto DCA Playbook',
    selarPrice: '₦12,500 / $15',
  },
  'kids-learning': {
    id: 'kids-learning',
    file: 'kids-learning.html',
    title: 'Kids Interactive 3D Learning & Phonics Studio',
    category: 'Education & Kids Learning',
    badge: '🎈 Phonics & Math Studio',
    summary: 'Engaging interactive spelling, animal phonics, arithmetic drills, and printable milestone reward certificates.',
    highlights: ['Interactive Phonics Engine', 'Printable Milestone Certificates', 'Zero Screen Distractions'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Early Childhood STEM Curriculum Pack',
    selarPrice: '₦7,500 / $9',
  },
  'biohack-longevity': {
    id: 'biohack-longevity',
    file: 'biohack-longevity.html',
    title: 'Biohack Longevity Protocol & Biological Age Sizer',
    category: 'Health & Biohacking',
    badge: '🧬 Biological Age Sizer',
    summary: 'Score cardiovascular fitness, deep sleep architecture, fasting protocols, and personalized supplement stacks.',
    highlights: ['Biological Age Offset Score', 'Sleep & HRV Optimization', 'Evidence-Based Protocol Stack'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Peak Biomarker Longevity Protocol',
    selarPrice: '₦15,000 / $19',
  },
  'wealth-calculator': {
    id: 'wealth-calculator',
    file: 'wealth-calculator.html',
    title: 'Passive Income & Wealth Freedom Calculator',
    category: 'Personal Finance & Wealth',
    badge: '💰 FIRE Number Calculator',
    summary: 'Compute your exact Financial Independence number, monthly passive income runway, and safe withdrawal timeline.',
    highlights: ['FIRE Target Milestone Matrix', 'Compounding Portfolio Engine', 'Inflation-Adjusted Projections'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Passive Income Architecture Guide',
    selarPrice: '₦12,500 / $15',
  },
  'deal-calculator': {
    id: 'deal-calculator',
    file: 'cashflow-calculator.html',
    title: 'Real Estate Cashflow & Deal Sizer',
    category: 'Real Estate & Property',
    badge: '🏡 Deal Underwriting Sizer',
    summary: 'Underwrite residential & commercial rental properties with Cap Rate, Cash-on-Cash ROI, DSCR, and 10-year IRR.',
    highlights: ['Cap Rate & Cash-on-Cash Matrix', 'DSCR Lender Safety Check', 'Automated Deal Summary PDF'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Institutional Real Estate Underwriter Bundle',
    selarPrice: '₦25,000 / $30',
  },
  'cashflow': {
    id: 'cashflow',
    file: 'cashflow-calculator.html',
    title: 'Real Estate Cashflow & Deal Sizer',
    category: 'Real Estate & Property',
    badge: '🏡 Deal Underwriting Sizer',
    summary: 'Underwrite residential & commercial rental properties with Cap Rate, Cash-on-Cash ROI, DSCR, and 10-year IRR.',
    highlights: ['Cap Rate & Cash-on-Cash Matrix', 'DSCR Lender Safety Check', 'Automated Deal Summary PDF'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Institutional Real Estate Underwriter Bundle',
    selarPrice: '₦25,000 / $30',
  },
  'wholesaling-loi': {
    id: 'wholesaling-loi',
    file: 'wholesaling-loi.html',
    title: 'Wholesaling LOI & Property Offer Generator',
    category: 'Real Estate Wholesaling',
    badge: '📜 Binding LOI Generator',
    summary: 'Generate institutional Letters of Intent, maximum allowable offers (MAO), repair margins, and seller contracts.',
    highlights: ['Instant 1-Click Formal LOI PDF', '70% Rule MAO Formula', 'Inspection Contingency Clauses'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Wholesale Assignment Contract Vault',
    selarPrice: '₦20,000 / $25',
  },
  'script-generator': {
    id: 'script-generator',
    file: 'script-generator.html',
    title: 'Viral Social Script & Hook Generator',
    category: 'Creator & Social Media',
    badge: '🎬 Viral Script Generator',
    summary: 'High-retention 60-second video scripts, pattern interrupts, psychological hooks, and high-converting CTAs.',
    highlights: ['3-Second Visual Hook Matrix', 'Dynamic Retention Pacing', 'Niche-Specific Viral Templates'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: '100+ Viral Hook & Script Vault',
    selarPrice: '₦10,000 / $12',
  },
  'site-audit': {
    id: 'site-audit',
    file: 'site-audit.html',
    title: 'SEO & High-Performance Site Audit Engine',
    category: 'B2B Software & SEO',
    badge: '🔍 Instant Technical SEO Audit',
    summary: 'Audit core web vitals, mobile responsiveness, SSL security headers, schema markup, and conversion leaks.',
    highlights: ['Core Web Vitals Diagnosis', 'Mobile Viewport Health Check', 'Lead-Leak Action Checklist'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Local SEO Domination Agency Playbook',
    selarPrice: '₦20,000 / $25',
  },
  'prayer-journal': {
    id: 'prayer-journal',
    file: 'prayer-journal.html',
    title: 'Scripture & Daily Prayer Journal Suite',
    category: 'Faith & Devotional',
    badge: '🙏 Guided Faith Journal',
    summary: 'Daily devotional reflection, topical scripture finder, answered prayer tracking, and printable spiritual journals.',
    highlights: ['Topical Scripture Matcher', 'Testimony & Prayer Tracker', 'Printable Devotional Layouts'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: '365-Day Guided Devotional & Prayer Journal',
    selarPrice: '₦5,000 / $6',
  },
  'sports-edge': {
    id: 'sports-edge',
    file: 'sports-edge.html',
    title: 'Sports Edge Odds & Bankroll Calculator',
    category: 'Sports Analytics',
    badge: '🎯 Kelly Criterion Bankroll Guard',
    summary: 'Arbitrage detection, expected value (+EV) calculations, Kelly criterion stake sizing, and bankroll preservation.',
    highlights: ['Kelly Criterion Stake Sizer', '+EV Margin Calculator', 'No-Vig Probability Converter'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Quantitative Sports Analytics Model',
    selarPrice: '₦15,000 / $19',
  },
  'ai-stack-finder': {
    id: 'ai-stack-finder',
    file: 'ai-stack-finder.html',
    title: 'Enterprise AI Tech Stack Finder',
    category: 'AI & Enterprise Software',
    badge: '🤖 Enterprise AI Architecture',
    summary: 'Match your business workflow to the ideal LLMs, automation pipelines, vector databases, and enterprise agents.',
    highlights: ['Vendor Lock-in Evaluation', 'TCO & API Token Sizer', 'Production Integration Map'],
    selarUrl: 'https://selar.co/m/bethelmind',
    selarProduct: 'Complete Enterprise AI Blueprint 2026',
    selarPrice: '₦35,000 / $45',
  },
};

export async function generateStaticParams() {
  const viralSlugs = Object.keys(VIRAL_TOOLS).map(slug => ({ slug }));
  const sectorSlugs = [
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
  return [...viralSlugs, ...sectorSlugs];
}

interface SectorProfile {
  title: string;
  category: string;
  tag: string;
  summary: string;
  highlightPills: string[];
}

function getSectorProfile(rawSlug: string): SectorProfile {
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
  const cleanSlug = slug.toLowerCase().replace(/\.html$/i, '');
  const viralTool = VIRAL_TOOLS[cleanSlug];

  if (viralTool) {
    return {
      title: `${viralTool.title} | Free Interactive Tool | Bethelmind Analytics`,
      description: viralTool.summary,
      openGraph: {
        title: `${viralTool.title} | Bethelmind Digital Solutions Nigeria`,
        description: viralTool.summary,
        url: `https://www.bethelmindanalytics.com/tools/${cleanSlug}`,
        siteName: 'Bethelmind Digital Solutions',
        locale: 'en_NG',
        type: 'website',
      },
    };
  }

  const profile = getSectorProfile(cleanSlug);
  return {
    title: `${profile.title} Nigeria | Bethelmind Digital Solutions`,
    description: profile.summary,
    openGraph: {
      title: `${profile.title} | Bethelmind Digital Solutions Nigeria`,
      description: profile.summary,
      url: `https://www.bethelmindanalytics.com/tools/${cleanSlug}`,
      siteName: 'Bethelmind Digital Solutions',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().replace(/\.html$/i, '');

  if (cleanSlug === 'integrations') {
    return <IntegrationBlueprintDashboard />;
  }

  // Check if this slug matches one of our 12 Viral Interactive Tools
  const viralTool = VIRAL_TOOLS[cleanSlug];

  if (viralTool) {
    const standaloneCalcUrl = `/calc/${viralTool.file}`;

    return (
      <main className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Hairline Metallic Accent Glow */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 opacity-90 shadow-[0_0_20px_rgba(6,182,212,0.6)]" />

        {/* Atmospheric Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          
          {/* Executive Header & Navigation */}
          <header className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/5 space-y-4">
            
            {/* Top Navigation Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Tools Directory</span>
                </Link>

                <Link
                  href="/home"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  <span>Bethelmind Ecosystem</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Free 100% Client-Side Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Live Verified 2026
                </span>
              </div>
            </div>

            {/* Headline, Category, & Description */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{viralTool.badge}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
                  {viralTool.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  {viralTool.summary}
                </p>

                {/* Highlights Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {viralTool.highlights.map((pill, i) => (
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

              {/* Action Buttons: Full Screen & Direct Link */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                <a
                  href={standaloneCalcUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
                  title="Open standalone zero-distraction view"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen View</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind! I am using the *${viralTool.title}* on your website. I want to deploy this custom engine for my business.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Setup</span>
                </a>
              </div>
            </div>
          </header>

          {/* Interactive Calculator Embed Frame */}
          <section 
            aria-label="Interactive Tool View"
            className="w-full bg-slate-900/60 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative min-h-[780px]"
          >
            {/* Embedded Standalone Calculator Frame */}
            <iframe
              src={standaloneCalcUrl}
              title={viralTool.title}
              className="w-full h-[780px] sm:h-[860px] border-0 rounded-3xl bg-[#090d16]"
              loading="lazy"
              allow="clipboard-write; clipboard-read"
            />
          </section>

          {/* Digital Upsell & Monetization Offer Card */}
          <section className="bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                <ShoppingBag className="w-3 h-3 text-indigo-400" />
                <span>Verified Commercial Blueprint Available</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Get the Complete {viralTool.selarProduct}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Unlock full editable financial spreadsheets, commercial contract clauses, step-by-step video walkthrough, and instant downloadable implementation assets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <div className="text-center md:text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Instant Access</span>
                <span className="text-lg font-black text-emerald-400">{viralTool.selarPrice}</span>
              </div>
              <a
                href={viralTool.selarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unlock Blueprint on Selar →</span>
              </a>
            </div>
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
          sector={viralTool.category}
          agentTitle={`Bethel — ${viralTool.category} AI Specialist`}
        />
      </main>
    );
  }

  // Fallback for Existing B2B Sector Tools
  const profile = getSectorProfile(cleanSlug);

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
              href="/tools"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Tools Directory</span>
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
          {cleanSlug === 'recruitment' ? (
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
