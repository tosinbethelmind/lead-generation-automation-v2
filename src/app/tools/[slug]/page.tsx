'use client';

/**
 * @file src/app/tools/[slug]/page.tsx
 * Ultra-Luxurious, Editorial Private Client Specification Portal for Nigerian SMEs.
 *
 * Designed with restrained obsidian base (#070b14), warm ivory/slate typography,
 * champagne gold metallic accents (#d4af37), and zero visual clutter.
 */

import React, { use } from 'react';
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
  Download,
  Building,
  Home,
  Sun,
  Car,
  Scissors,
  Utensils,
  GraduationCap,
  Activity,
  Truck,
  Scale,
  Hotel
} from 'lucide-react';
import { SectorToolsWidget, SectorToolTab } from '@/components/SectorToolsWidget';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';
import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';
import { ViralToolShareBar } from '@/components/ViralToolShareBar';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

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
    badge: 'Clean Energy ROI Sizer',
    summary: 'Calculate 25-year rooftop solar savings, panel count, battery bank requirements, and 30% clean energy rebates.',
    highlights: ['25-Year Cumulative Savings', 'Battery Bank & Inverter Sizer', 'Direct WhatsApp BOQ Proposal'],
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=solar-buster&amount=10000',
    selarProduct: 'Solar Master Procurement Blueprint',
    selarPrice: '₦15,000 / $19',
  },
  'crypto-dca': {
    id: 'crypto-dca',
    file: 'crypto-dca.html',
    title: 'Crypto DCA Wealth Engine & Profit Simulator',
    category: 'Crypto & Digital Assets',
    badge: 'DCA Wealth Simulator',
    summary: 'Model Dollar-Cost Averaging across BTC, ETH, and SOL with historical market cycles, compounding yield, and risk metrics.',
    highlights: ['Multi-Cycle DCA Modeling', 'Compounding Wealth Projection', 'Drawdown Risk Guard Matrix'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: 'Algorithmic Crypto DCA Playbook',
    selarPrice: '₦12,500 / $15',
  },
  'kids-learning': {
    id: 'kids-learning',
    file: 'kids-learning.html',
    title: 'Kids Interactive 3D Learning & Phonics Studio',
    category: 'Education & Kids Learning',
    badge: 'Phonics & Math Studio',
    summary: 'Engaging interactive spelling, animal phonics, arithmetic drills, and printable milestone reward certificates.',
    highlights: ['Interactive Phonics Engine', 'Printable Milestone Certificates', 'Zero Screen Distractions'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-kids',
    selarProduct: 'Early Childhood STEM Curriculum Pack',
    selarPrice: '₦7,500 / $9',
  },
  'biohack-longevity': {
    id: 'biohack-longevity',
    file: 'biohack-longevity.html',
    title: 'Biohack Longevity Protocol & Biological Age Sizer',
    category: 'Health & Biohacking',
    badge: 'Biological Age Sizer',
    summary: 'Score cardiovascular fitness, deep sleep architecture, fasting protocols, and personalized supplement stacks.',
    highlights: ['Biological Age Offset Score', 'Sleep & HRV Optimization', 'Evidence-Based Protocol Stack'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-health',
    selarProduct: 'Peak Biomarker Longevity Protocol',
    selarPrice: '₦15,000 / $19',
  },
  'wealth-calculator': {
    id: 'wealth-calculator',
    file: 'wealth-calculator.html',
    title: 'Passive Income & Wealth Freedom Calculator',
    category: 'Personal Finance & Wealth',
    badge: 'FIRE Number Calculator',
    summary: 'Compute your exact Financial Independence number, monthly passive income runway, and safe withdrawal timeline.',
    highlights: ['FIRE Target Milestone Matrix', 'Compounding Portfolio Engine', 'Inflation-Adjusted Projections'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: 'Passive Income Architecture Guide',
    selarPrice: '₦12,500 / $15',
  },
  'deal-calculator': {
    id: 'deal-calculator',
    file: 'cashflow-calculator.html',
    title: 'Real Estate Cashflow & Deal Sizer',
    category: 'Real Estate & Property',
    badge: 'Deal Underwriting Sizer',
    summary: 'Underwrite residential & commercial rental properties with Cap Rate, Cash-on-Cash ROI, DSCR, and 10-year IRR.',
    highlights: ['Cap Rate & Cash-on-Cash Matrix', 'DSCR Lender Safety Check', 'Automated Deal Summary PDF'],
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000',
    selarProduct: 'Institutional Real Estate Underwriter Bundle',
    selarPrice: '₦25,000 / $30',
  },
  'cashflow': {
    id: 'cashflow',
    file: 'cashflow-calculator.html',
    title: 'Real Estate Cashflow & Deal Sizer',
    category: 'Real Estate & Property',
    badge: 'Deal Underwriting Sizer',
    summary: 'Underwrite residential & commercial rental properties with Cap Rate, Cash-on-Cash ROI, DSCR, and 10-year IRR.',
    highlights: ['Cap Rate & Cash-on-Cash Matrix', 'DSCR Lender Safety Check', 'Automated Deal Summary PDF'],
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000',
    selarProduct: 'Institutional Real Estate Underwriter Bundle',
    selarPrice: '₦25,000 / $30',
  },
  'wholesaling-loi': {
    id: 'wholesaling-loi',
    file: 'wholesaling-loi.html',
    title: 'Wholesaling LOI & Property Offer Generator',
    category: 'Real Estate Wholesaling',
    badge: 'Binding LOI Generator',
    summary: 'Generate institutional Letters of Intent, maximum allowable offers (MAO), repair margins, and seller contracts.',
    highlights: ['Instant 1-Click Formal LOI PDF', '70% Rule MAO Formula', 'Inspection Contingency Clauses'],
    selarUrl: 'https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000',
    selarProduct: 'Wholesale Assignment Contract Vault',
    selarPrice: '₦20,000 / $25',
  },
  'script-generator': {
    id: 'script-generator',
    file: 'script-generator.html',
    title: 'Viral Social Script & Hook Generator',
    category: 'Creator & Social Media',
    badge: 'Viral Script Generator',
    summary: 'High-retention 60-second video scripts, pattern interrupts, psychological hooks, and high-converting CTAs.',
    highlights: ['3-Second Visual Hook Matrix', 'Dynamic Retention Pacing', 'Niche-Specific Viral Templates'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-faceless',
    selarProduct: 'Faceless Short-Form Content Empire',
    selarPrice: '₦10,000 / $12',
  },
  'footy-wordle': {
    id: 'footy-wordle',
    file: 'footy-wordle.html',
    title: 'FootyWordle AI™ | Daily Football Wordle & Mystery Player Game',
    category: 'Sports Analytics',
    badge: 'Viral Daily Football Wordle',
    summary: 'The viral daily football Wordle. Guess today 5-letter football star or club in 6 tries, share your emoji grid on WhatsApp, and unlock high-confidence value slips.',
    highlights: ['Daily 5-Letter Football Mystery', 'WhatsApp Emoji Grid Sharing', 'Unlocked 4.85x Acca Value Slip'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-sports',
    selarProduct: 'Quantitative Sports Analytics Model & Bankroll Matrix',
    selarPrice: '₦15,000 / $19',
  },
  'typing-speed': {
    id: 'typing-speed',
    file: 'typing-speed.html',
    title: 'TypeMaster AI™ | 60-Second WPM Typing Speed & Accuracy Test',
    category: 'Software & Productivity',
    badge: 'Productivity Benchmark Suite',
    summary: 'Benchmark your typing speed, accuracy, and keystrokes in 60 seconds. Claim your verified typing certificate and share your score.',
    highlights: ['Real-Time WPM & Accuracy Telemetry', 'Shareable Verified Scorecard', 'Remote Job Blueprint Upsell'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-aitools',
    selarProduct: 'Remote Work & High-Income Freelancing Blueprint',
    selarPrice: '₦15,000 / $19',
  },
  'focus-timer': {
    id: 'focus-timer',
    file: 'focus-timer.html',
    title: 'FocusFlow AI™ | 25/5 Pomodoro Deep Work Timer & Ambient Soundscape',
    category: 'Software & Productivity',
    badge: 'Deep Work & Productivity Suite',
    summary: 'Eliminate distractions with scientific 25-minute Pomodoro cycles and zero-bandwidth mathematically synthesized ambient soundscapes.',
    highlights: ['Client-Side Web Audio Soundscapes', 'Sprint Task Checklist', 'High Dwell-Time Engine'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-aitools',
    selarProduct: 'Executive Deep-Work & Notion Operating System',
    selarPrice: '₦15,000 / $19',
  },
  'runway-radar': {
    id: 'runway-radar',
    file: 'runway-radar.html',
    title: 'RunwayRadar AI™ | Financial Runway & Freedom Sizer',
    category: 'Finance & Investing',
    badge: 'Financial Freedom Sizer',
    summary: 'Calculate exactly how many months and days you can survive without a job. Gauge your financial freedom index and safe resignation date.',
    highlights: ['Net Burn & Liquid Runway Sizer', 'Quit Readiness Index Score', 'Instant WhatsApp Share'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: '2026 Solopreneur & Autonomous Cashflow Blueprint',
    selarPrice: '₦15,000 / $19',
  },
  'salary-calc': {
    id: 'salary-calc',
    file: 'salary-calc.html',
    title: 'SalaryTakeHome AI™ | Net Pay, PAYE & Remote Income Sizer',
    category: 'Finance & Investing',
    badge: 'Statutory Payroll Engine',
    summary: 'Calculate your true monthly take-home income after statutory PAYE personal income tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    highlights: ['PITA Statutory Calculation', 'Itemized PAYE & Pension Deductions', 'Instant WhatsApp Salary Slip Share'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: 'Passive Wealth Compounding & Cashflow Model',
    selarPrice: '₦15,000 / $19',
  },
  'higher-lower': {
    id: 'higher-lower',
    file: 'higher-lower.html',
    title: 'Higher or Lower AI™ | Viral Comparison Game',
    category: 'Entertainment & Gaming',
    badge: 'Market Value Comparison Arena',
    summary: 'The viral Higher or Lower game. Compare football player market values and celebrity net worths with real-time feedback.',
    highlights: ['Transfer Values vs Net Worths', 'Streak Sharing on WhatsApp', 'Integrated Market Intelligence'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-sports',
    selarProduct: 'Quantitative Sports Analytics Model',
    selarPrice: '₦15,000 / $19',
  },
};

interface SectorProfile {
  title: string;
  category: string;
  tag: string;
  summary: string;
  highlightPills: string[];
  sectorTab: SectorToolTab;
}

function getSectorProfile(rawSlug: string): SectorProfile {
  const slug = (rawSlug || 'solar').toLowerCase().replace(/\.html$/i, '');

  if (/solar|boq|inverter|energy/.test(slug)) {
    return {
      title: 'Solar & Renewable Energy BOQ Load Sizer',
      category: 'Solar & Renewable Energy',
      tag: 'NERC Band A Avoidance Suite',
      summary: 'Precision load calculation, DisCo Band A/B/C tariff avoidance vs generator diesel economics, and automated customer WhatsApp BOQ proposals for Nigerian solar installers.',
      highlightPills: ['Sub-2s WhatsApp BOQ', '51.2V LiFePO4 Sizing', 'Diesel vs Solar Payback Matrix'],
      sectorTab: 'solar',
    };
  }

  if (/tokunbo|duty|auto|car|clearing|vin/.test(slug)) {
    return {
      title: 'Tokunbo VIN Customs Duty & Port Landing Sizer',
      category: 'Automobile & Tokunbo Dealership',
      tag: 'NCS 2026 Single-Sheet Tariff',
      summary: 'Calculates statutory 20% import duty, 15% NAC levy, 7.5% VAT, and PTML/Tin Can terminal charges for Lagos car dealers and auto auction importers.',
      highlightPills: ['17-Digit VIN Decode', 'NCS Valuation Matrix', 'Terminal Demurrage Estimator'],
      sectorTab: 'auto',
    };
  }

  if (/salon|beauty|spa|hair|stylist/.test(slug)) {
    return {
      title: 'Salon & Spa 24/7 Booking & Deposit Lock Engine',
      category: 'Beauty & Hair Salon',
      tag: 'Anti-No-Show Reservation Lock',
      summary: '24/7 appointment scheduler that locks client stylist slots with instant Paystack/Moniepoint bank transfer deposits, eliminating empty salon chairs and fake alerts.',
      highlightPills: ['Zero Fake Alerts', '24/7 WhatsApp Appointment Desk', 'Stylist Commission Split Ledger'],
      sectorTab: 'beauty',
    };
  }

  if (/retail|catalog|closer|boutique|store|ecommerce|shop/.test(slug)) {
    return {
      title: 'Retail & E-Commerce WhatsApp Catalog Closer',
      category: 'Retail & Boutiques',
      tag: 'Sub-3s WhatsApp Catalog Closer',
      summary: 'Automated 24/7 product catalog assistant that answers customer queries, checks real-time sizing and stock, and closes orders directly on WhatsApp.',
      highlightPills: ['Sub-3s WhatsApp Closer', 'Live Inventory & Sizing Check', 'OPay/Moniepoint Transfer Verification'],
      sectorTab: 'retail',
    };
  }

  if (/restaurant|food|kitchen|eatery|dining|lounge/.test(slug)) {
    return {
      title: 'Restaurant & Lounge 0% Commission Direct Menu Engine',
      category: 'Restaurant & Hospitality',
      tag: '0% Third-Party Commission',
      summary: 'Digital QR food menu and table-side ordering engine that routes customer orders and table reservations straight to your WhatsApp with zero commissions.',
      highlightPills: ['Direct WhatsApp Food Orders', 'Zero Aggregator Commissions', 'Instant Table Reservation Lock'],
      sectorTab: 'restaurant',
    };
  }

  if (/mortgage|real-estate|estate|property|land/.test(slug)) {
    return {
      title: 'Plot Layout, Survey Levies & Mortgage Amortization Suite',
      category: 'Real Estate & Property Development',
      tag: 'Title & Infrastructure Allocation',
      summary: 'Calculates 300 sqm Half Plot vs 500/600 sqm Full Plot outright packages, registered survey (Red Copy) fees, deed of assignment levies, and developer installment spreads.',
      highlightPills: ['Survey & Deed Sizer', 'Multi-Tier Realtor 5% WHT Ledger', 'Diaspora Forex Milestone Tracker'],
      sectorTab: 'mortgage',
    };
  }

  if (/clinic|healthcare|medical|doctor|hmo/.test(slug)) {
    return {
      title: 'Clinic HMO Claims & Procedure Co-Pay Reconciler',
      category: 'Clinic & Healthcare HMO',
      tag: 'Admission Deposit Lock',
      summary: 'Reconciles HMO procedure tariffs, patient co-pay deductions, and secondary AuthCodes to prevent 60-day claim rejections, with upfront surgical admission deposits.',
      highlightPills: ['Reliance / Hygeia AuthCode Risk Guard', '60% Admission Deposit Lock', 'Diagnostic Lab Panel Sizer'],
      sectorTab: 'healthcare',
    };
  }

  if (/school|tuition|education|pin/.test(slug)) {
    return {
      title: 'Private School Term Tuition & Result PIN Portal',
      category: 'Private Education & Schools',
      tag: 'Result Broadsheet Gating',
      summary: 'Student term fee payment gateway that automatically gates digital term report cards and WAEC broadsheets until school fees clear, with scratch-PIN batch accounting.',
      highlightPills: ['Auto-Gated Report Cards', 'PIN Batch Profit Accounting', 'Direct Bank Transfer Remittance'],
      sectorTab: 'education',
    };
  }

  if (/logistics|waybill|dispatch|freight|haulage/.test(slug)) {
    return {
      title: 'Hyperlocal Dispatch & Long-Haul Trip Freight Sizer',
      category: 'Logistics & Freight Haulage',
      tag: 'Interstate Diesel & Waybill Tracker',
      summary: 'Aggregates multi-carrier dispatch pricing, generates automated WhatsApp waybill tracking links for customers, and audits driver interstate diesel consumption.',
      highlightPills: ['Auto-SMS Waybill Tracking', 'Diesel Pilferage Audit', 'NURTW Interstate Levy Estimator'],
      sectorTab: 'logistics',
    };
  }

  if (/cac|legal|filing|compliance/.test(slug)) {
    return {
      title: 'CAC Corporate Filing Fees & Legal Retainer Suite',
      category: 'Legal & CAC Corporate Services',
      tag: 'CAC & SCUML Compliance Matrix',
      summary: 'Calculates statutory CAC registration and annual return arrears, FIRS stamp duty, SCUML anti-money laundering certification fees, and itemized counsel debit notes.',
      highlightPills: ['Official CAC Fee Matrix', 'SCUML & TCC Cost Sizer', 'FIRS 7.5% VAT & 5% WHT Credit Note'],
      sectorTab: 'legal',
    };
  }

  if (/shortlet|hospitality|hotel|apartment/.test(slug)) {
    return {
      title: 'Shortlet Electricity Token & Caution Deposit Reconciler',
      category: 'Shortlet & Hospitality Apartments',
      tag: 'DisCo kWh & Caution Deposit Ledger',
      summary: 'Reconciles guest nightly rates, generator overtime surcharges, and actual DisCo prepaid meter consumption against refundable caution deposits.',
      highlightPills: ['Prepaid Meter Token Deduction', 'Refundable Caution Splitter', 'Instant WhatsApp Check-In Receipt'],
      sectorTab: 'hospitality',
    };
  }

  if (/dva|transfer|bank|reconciliation|alert|fraud/.test(slug)) {
    return {
      title: '"Fake Alert Proof" Automated Bank Transfer Reconciliation',
      category: 'Fintech & Merchant Settlements',
      tag: 'Cryptographic Moniepoint Settlement',
      summary: 'Reconciles incoming bank transfers via real-time Moniepoint NIP webhooks, generating instant confirmation passes and 100% eliminating fake payment screenshots.',
      highlightPills: ['Moniepoint NIP Webhook Lock', 'Zero Fake Transfer Alert Risk', 'Instant Digital Payment Receipt'],
      sectorTab: 'dva',
    };
  }

  return {
    title: `${rawSlug.replace(/\.html$/i, '').replace(/[-_]+/g, ' ').toUpperCase()} Commercial Tool`,
    category: 'Commercial Enterprise',
    tag: 'Bespoke Advisory Engine',
    summary: 'Automated 24/7 business calculation, quotation, and client qualification engine pre-configured for Nigerian commercial operators.',
    highlightPills: ['Instant WhatsApp Dispatch', '₦0 Upfront Preview', 'Bankable PDF Quote Generator'],
    sectorTab: 'solar',
  };
}

export default function StandaloneToolPage({ params }: ToolPageProps) {
  const { slug } = use(params);
  const cleanSlug = slug.toLowerCase().replace(/\.html$/i, '');

  if (cleanSlug === 'integrations') {
    return <IntegrationBlueprintDashboard />;
  }

  // Check if this slug matches one of our 12 Viral Interactive Tools
  const viralTool = VIRAL_TOOLS[cleanSlug];

  if (viralTool) {
    const standaloneCalcUrl = `/calc/${viralTool.file}`;

    return (
      <div className="min-h-screen bg-[#070b14] text-[#c9c4bc] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
        <Navbar />

        <main className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
          
          {/* Executive Editorial Header */}
          <header className="space-y-4 pt-4 border-b border-white/[0.06] pb-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#8e887e] hover:text-[#d4af37] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sector Tools Directory</span>
              </Link>
              
              <div className="flex items-center gap-3 text-xs text-[#8e887e] font-light">
                <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CAC RC: 7034297
                </span>
                <span>&bull;</span>
                <span>Lagos Engineering Desk</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
                {viralTool.category} &bull; Client Specification
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug md:leading-tight">
                {viralTool.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-[#c9c4bc] font-light leading-relaxed max-w-3xl">
                {viralTool.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {viralTool.highlights.map((pill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs text-[#c9c4bc] bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full font-light"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </header>

          {/* Interactive Calculator Embed Frame */}
          <section 
            aria-label="Interactive Tool View"
            className="w-full bg-[#0a0e17] rounded-3xl border border-[#d4af37]/25 overflow-hidden shadow-2xl shadow-black/80 relative min-h-[780px]"
          >
            <iframe
              src={standaloneCalcUrl}
              title={viralTool.title}
              className="w-full h-[780px] sm:h-[860px] border-0 rounded-3xl bg-[#070b14]"
              loading="lazy"
              allow="clipboard-write; clipboard-read"
            />
          </section>

          {/* Executive Commercial Activation Suite */}
          <section className="rounded-3xl bg-[#0c101a] border border-[#d4af37]/30 p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
                Commercial Deployment & Turnkey Activation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f3ef]">
                Deploy This Exact Engine for {viralTool.category}
              </h2>
              <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
                Eliminate quote fatigue, stop unverified payment slips, and close prospects 24/7 with your branded website and automated WhatsApp quotation assistant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Option 1: Starter Go-Live */}
              <div className="p-6 rounded-2xl bg-[#070b14] border border-white/[0.08] hover:border-[#d4af37]/40 transition-colors space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8e887e] font-semibold">Tier 1 &bull; Fast Activation</span>
                  <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">Starter Go-Live Setup</h3>
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-serif text-[#d4af37]">₦35,000</span>
                    <span className="text-xs text-[#8e887e]">one-time setup (or ₦25,000/mo)</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-[#c9c4bc] font-light">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Pre-built official mobile website</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 24/7 AI WhatsApp closer configured with your pricing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> OPay & Moniepoint transfer verification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 48-Hour delivery guarantee</li>
                </ul>
                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I want to activate the Starter Setup (₦35,000) for our ${viralTool.category} business. Please connect with our team.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f3ef] border border-white/[0.12] text-xs font-semibold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Request Starter Activation (₦35k)</span>
                </a>
              </div>

              {/* Option 2: Full Turnkey Suite */}
              <div className="p-6 rounded-2xl bg-[#090d16] border border-[#d4af37]/40 space-y-4 shadow-xl shadow-black/50 relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">Tier 2 &bull; Turnkey Enterprise</span>
                  <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">Full Custom Domain Suite</h3>
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-serif text-[#d4af37]">₦75,000</span>
                    <span className="text-xs text-[#8e887e]">50% milestone deposit (₦150k total)</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-[#c9c4bc] font-light">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Dedicated .com or .com.ng custom domain included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Google Search & Maps #1 ranking setup</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Full sector calculator + WhatsApp ledger</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 100% code ownership & source code handover</li>
                </ul>
                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! We want to commission the Full Turnkey Custom Domain Suite (₦75,000 milestone deposit) for our ${viralTool.category} enterprise. Please send scope.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] text-xs font-bold transition-all shadow-md shadow-[#d4af37]/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Commission Turnkey Suite (₦75k Deposit)</span>
                </a>
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8e887e] font-light">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions)
              </span>
              <span>Balance payable ONLY upon your verified live sign-off</span>
            </div>
          </section>

          {/* Share Bar */}
          <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-5 shadow-xl">
            <ViralToolShareBar
              toolTitle={viralTool.title}
              toolSlug={`tools/${cleanSlug}`}
              summaryText={viralTool.summary}
              highlights={viralTool.highlights ? viralTool.highlights.map(h => ({ label: 'Feature', value: h })) : []}
              category={viralTool.category}
              hideDisclaimer={true}
            />
          </div>

          {/* Statutory Legal Notice & Disclaimer */}
          <aside aria-label="Statutory Notice" className="bg-[#070b14] border border-white/[0.06] rounded-2xl p-5 text-xs text-[#8e887e] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#c9c4bc] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span className="uppercase tracking-wider text-[11px] text-[#d4af37] font-semibold">
                  Statutory Notice & Estimator Disclaimer
                </span>
              </div>
              <span className="text-[10px] text-[#8e887e] font-mono">RC: 7034297</span>
            </div>
            <p className="leading-relaxed font-light">
              This calculation engine provides automated preliminary feasibility estimates for planning purposes only. Bethelmind Digital Solutions operates as a technology and automation provider, not a COREN-registered engineering consultant, licensed customs broker, surveying authority, or chartered tax practitioner. Formal structural projects, customs clearance declarations, and binding agreements require on-site professional verification.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] text-[#8e887e] flex-wrap border-t border-white/[0.05]">
              <span className="font-medium text-[#c9c4bc]">Statutory Policies:</span>
              <Link href="/legal/disclaimer" className="text-[#d4af37] hover:underline">Sector Tools Disclaimer</Link>
              <span>&bull;</span>
              <Link href="/legal/terms" className="text-[#d4af37] hover:underline">Terms of Service</Link>
              <span>&bull;</span>
              <Link href="/legal/privacy" className="text-[#d4af37] hover:underline">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/legal/delivery" className="text-[#d4af37] hover:underline">Delivery SLA</Link>
            </div>
          </aside>
        </main>

        <CustomerAiAgentWidget
          sector={viralTool.category}
          agentTitle={`Bethel — ${viralTool.category} Specialist`}
        />

        <Footer />
      </div>
    );
  }

  // Fallback for Existing B2B Sector Tools
  const profile = getSectorProfile(cleanSlug);

  return (
    <div className="min-h-screen bg-[#070b14] text-[#c9c4bc] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        
        {/* Executive Luxury Header Bar (Spacious, Serene & Balanced) */}
        <header className="space-y-4 pt-4 border-b border-white/[0.06] pb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#8e887e] hover:text-[#d4af37] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sector Tools Directory</span>
            </Link>

            <div className="flex items-center gap-3 text-xs text-[#8e887e] font-light">
              <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
                <ShieldCheck className="w-3.5 h-3.5" />
                CAC RC: 7034297
              </span>
              <span>&bull;</span>
              <span>Moniepoint NIP Settlement</span>
              <span>&bull;</span>
              <span>48-Hour SLA</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
              {profile.category} &bull; Commercial Specification Engine
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug md:leading-tight">
              {profile.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#c9c4bc] font-light leading-relaxed max-w-3xl">
              {profile.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {profile.highlightPills.map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs text-[#c9c4bc] bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full font-light"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{pill}</span>
              </span>
            ))}
          </div>
        </header>

        {/* Feature Interactive Suite (Dedicated to this sector, tabs suppressed) */}
        <section aria-label="Interactive Tool Engine" className="rounded-3xl bg-[#0a0e17] border border-[#d4af37]/25 p-4 sm:p-8 shadow-2xl shadow-black/80">
          {cleanSlug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget 
              businessCategory={profile.category} 
              hideHeader={true} 
              lockTab={profile.sectorTab}
              hideTabBar={true}
            />
          )}
        </section>

        {/* Executive Commercial Activation Suite (Clear 2-Tier Options & Moniepoint Escrow) */}
        <section className="rounded-3xl bg-[#0c101a] border border-[#d4af37]/30 p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
              Commercial Deployment & Turnkey Activation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f3ef]">
              Deploy This Exact Engine for {profile.category}
            </h2>
            <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
              Eliminate quote fatigue, stop unverified payment slips, and close prospects 24/7 with your branded website and automated WhatsApp quotation assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Option 1: Starter Go-Live */}
            <div className="p-6 rounded-2xl bg-[#070b14] border border-white/[0.08] hover:border-[#d4af37]/40 transition-colors space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8e887e] font-semibold">Tier 1 &bull; Fast Activation</span>
                <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">Starter Go-Live Setup</h3>
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-serif text-[#d4af37]">₦35,000</span>
                  <span className="text-xs text-[#8e887e]">one-time setup (or ₦25,000/mo)</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-[#c9c4bc] font-light">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Pre-built official mobile website</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 24/7 AI WhatsApp closer configured with your pricing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> OPay & Moniepoint transfer verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 48-Hour delivery guarantee</li>
              </ul>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I want to activate the Starter Setup (₦35,000) for our ${profile.category} business. Please connect with our team.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f3ef] border border-white/[0.12] text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Request Starter Activation (₦35k)</span>
              </a>
            </div>

            {/* Option 2: Full Turnkey Suite */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-[#d4af37]/40 space-y-4 shadow-xl shadow-black/50 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">Tier 2 &bull; Turnkey Enterprise</span>
                <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">Full Custom Domain Suite</h3>
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-serif text-[#d4af37]">₦75,000</span>
                  <span className="text-xs text-[#8e887e]">50% milestone deposit (₦150k total)</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-[#c9c4bc] font-light">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Dedicated .com or .com.ng custom domain included</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Google Search & Maps #1 ranking setup</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> Full sector calculator + WhatsApp ledger</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" /> 100% code ownership & source code handover</li>
              </ul>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! We want to commission the Full Turnkey Custom Domain Suite (₦75,000 milestone deposit) for our ${profile.category} enterprise. Please send scope.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] text-xs font-bold transition-all shadow-md shadow-[#d4af37]/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Commission Turnkey Suite (₦75k Deposit)</span>
              </a>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8e887e] font-light">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions)
            </span>
            <span>Balance payable ONLY upon your verified live sign-off</span>
          </div>
        </section>

        {/* Share Bar */}
        <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-5 shadow-xl">
          <ViralToolShareBar
            toolTitle={profile.title}
            toolSlug={`tools/${cleanSlug}`}
            summaryText={profile.summary}
            highlights={profile.highlightPills ? profile.highlightPills.map(p => ({ label: 'Highlight', value: p })) : []}
            category={profile.category}
            hideDisclaimer={true}
          />
        </div>

        {/* Statutory Legal Notice & Disclaimer */}
        <aside aria-label="Statutory Notice" className="bg-[#070b14] border border-white/[0.06] rounded-2xl p-5 text-xs text-[#8e887e] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[#c9c4bc] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="uppercase tracking-wider text-[11px] text-[#d4af37] font-semibold">
                Statutory Notice & Estimator Disclaimer
              </span>
            </div>
            <span className="text-[10px] text-[#8e887e] font-mono">RC: 7034297</span>
          </div>
          <p className="leading-relaxed font-light">
            This calculation engine provides automated preliminary feasibility estimates for planning purposes only. Bethelmind Digital Solutions operates as a technology and automation provider, not a COREN-registered engineering consultant, licensed customs broker, surveying authority, or chartered tax practitioner. Formal structural projects, customs clearance declarations, and binding agreements require on-site professional verification.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[11px] text-[#8e887e] flex-wrap border-t border-white/[0.05]">
            <span className="font-medium text-[#c9c4bc]">Statutory Policies:</span>
            <Link href="/legal/disclaimer" className="text-[#d4af37] hover:underline">Sector Tools Disclaimer</Link>
            <span>&bull;</span>
            <Link href="/legal/terms" className="text-[#d4af37] hover:underline">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/legal/privacy" className="text-[#d4af37] hover:underline">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/legal/delivery" className="text-[#d4af37] hover:underline">Delivery SLA</Link>
          </div>
        </aside>

      </main>

      <CustomerAiAgentWidget
        sector={profile.category}
        agentTitle={`Bethel — ${profile.category} Specialist`}
      />

      <Footer />
    </div>
  );
}
