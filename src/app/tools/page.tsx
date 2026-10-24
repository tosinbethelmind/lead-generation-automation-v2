'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Flame, 
  Globe, 
  Building2, 
  TrendingUp, 
  Heart, 
  Zap, 
  ArrowRight, 
  Search, 
  Calculator, 
  Sun,
  Smile,
  Activity,
  Car,
  Layers,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Scissors,
  UtensilsCrossed,
  Truck,
  GraduationCap,
  Scale,
  Hotel
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface ToolItem {
  id: string;
  title: string;
  badge: string;
  category: 'b2b' | 'wealth' | 'realestate' | 'lifestyle';
  description: string;
  icon: any;
  color: string;
  href: string;
  upsell: string;
}

const TOOLS: ToolItem[] = [
  // --- High-Conversion Nigerian B2B Monetization Tools ---
  {
    id: 'solar-boq',
    title: 'Solar & Renewable Energy BOQ Load Sizer',
    badge: 'NERC Band A Avoidance',
    category: 'b2b',
    description: 'Precision load calculation, DisCo Band A/B/C tariff avoidance vs generator diesel fuel economics, and automated customer WhatsApp BOQ proposal generator.',
    icon: Sun,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/solar-boq',
    upsell: '₦35,000 Starter Setup'
  },
  {
    id: 'tokunbo-duty',
    title: 'Tokunbo VIN Customs Duty & Port Landing Sizer',
    badge: 'NCS 2026 Tariff',
    category: 'b2b',
    description: 'Calculates statutory 20% import duty, 15% NAC levy, 7.5% VAT, and PTML/Tin Can terminal charges for Lagos car dealers and auto auction importers.',
    icon: Car,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    href: '/tools/tokunbo-duty',
    upsell: '₦35,000 Auto Suite'
  },
  {
    id: 'salon-booking',
    title: 'Salon & Spa 24/7 Booking & Deposit Lock Engine',
    badge: 'Anti-No-Show Lock',
    category: 'b2b',
    description: '24/7 appointment scheduler that locks client stylist slots with instant Paystack/Moniepoint bank transfer deposits, eliminating empty salon chairs and fake alerts.',
    icon: Scissors,
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    href: '/tools/salon-booking',
    upsell: '₦35,000 Salon Setup'
  },
  {
    id: 'restaurant-order',
    title: 'Restaurant Direct Food Order & 0% Commission Menu',
    badge: 'Chowdeck Saver',
    category: 'b2b',
    description: 'Direct digital food ordering engine and automated kitchen ticket printer that saves restaurants 25% delivery aggregator commissions with instant Moniepoint settlement.',
    icon: UtensilsCrossed,
    color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400',
    href: '/tools/restaurant-order',
    upsell: '₦35,000 Food Suite'
  },
  {
    id: 'retail-catalog',
    title: 'Retail WhatsApp Catalog Closer & Stock Reservation',
    badge: 'Sub-3s Closer',
    category: 'b2b',
    description: 'Fast WhatsApp catalog assistant that presents variants, validates inventory, calculates interstate waybill, and locks customer orders in under 3 seconds.',
    icon: ShoppingBag,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/retail-catalog',
    upsell: '₦35,000 Retail Suite'
  },
  {
    id: 'mortgage-calculator',
    title: 'Plot Layout, Survey Levies & Mortgage Amortization',
    badge: 'Real Estate Pro',
    category: 'realestate',
    description: 'Calculates 300 sqm Half Plot vs 500/600 sqm Full Plot outright packages, registered survey (Red Copy) fees, deed of assignment levies, and developer installment spreads.',
    icon: Building2,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/mortgage-calculator',
    upsell: '₦35,000 Property Suite'
  },
  {
    id: 'clinic-hmo',
    title: 'Clinic HMO Claims & Procedure Co-Pay Reconciler',
    badge: 'Healthcare Risk Guard',
    category: 'b2b',
    description: 'Reconciles HMO procedure tariffs, patient co-pay deductions, and secondary AuthCodes to prevent claim rejections, with upfront surgical admission deposits.',
    icon: Activity,
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    href: '/tools/clinic-hmo',
    upsell: '₦35,000 Clinic Setup'
  },
  {
    id: 'school-portal',
    title: 'Private School Term Tuition & Result PIN Portal',
    badge: 'Fee Recovery Gate',
    category: 'b2b',
    description: 'Student term fee payment gateway that automatically gates digital term report cards and broadsheets until school fees clear, with scratch-PIN batch accounting.',
    icon: GraduationCap,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    href: '/tools/school-portal',
    upsell: '₦35,000 School Suite'
  },
  {
    id: 'logistics-quote',
    title: 'Hyperlocal Dispatch & Long-Haul Trip Freight Sizer',
    badge: 'Waybill & Diesel Audit',
    category: 'b2b',
    description: 'Aggregates multi-carrier dispatch pricing, generates automated WhatsApp waybill tracking links for customers, and audits driver interstate diesel consumption.',
    icon: Truck,
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    href: '/tools/logistics-quote',
    upsell: '₦35,000 Haulage Suite'
  },
  {
    id: 'cac-filing',
    title: 'CAC Corporate Filing Fees & Legal Retainer Suite',
    badge: 'Compliance Matrix',
    category: 'b2b',
    description: 'Calculates statutory CAC registration and annual return arrears, FIRS stamp duty, SCUML anti-money laundering certification fees, and itemized debit notes.',
    icon: Scale,
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    href: '/tools/cac-filing',
    upsell: '₦35,000 Legal Retainer'
  },
  {
    id: 'shortlet-reconciler',
    title: 'Shortlet Electricity Token & Caution Deposit Reconciler',
    badge: 'DisCo kWh Ledger',
    category: 'realestate',
    description: 'Reconciles guest nightly rates, 250kVA generator overtime surcharges, and actual DisCo prepaid meter consumption against refundable caution deposits.',
    icon: Hotel,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/shortlet-reconciler',
    upsell: '₦35,000 Hospitality Suite'
  },
  {
    id: 'fake-alert-shield',
    title: 'Fake-Alert Proof Virtual Account Transfer Shield',
    badge: 'NIBSS Reconciled',
    category: 'b2b',
    description: 'Provisions instant dynamic Moniepoint bank accounts that verify incoming NIP bank credits via real-time webhooks, eliminating fake alert scam losses entirely.',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/fake-alert-shield',
    upsell: '₦35,000 Fintech Shield'
  },

  // --- Lifestyle & Family Free Utilities ---
  {
    id: 'kids-learning',
    title: 'Tiny Learners™ 3D Kids Phonics & Activity Generator',
    badge: 'Family & Toddlers',
    category: 'lifestyle',
    description: 'Generate instant, screen-free phonics games, counting quests, and printable coloring activities for toddlers and preschoolers.',
    icon: Smile,
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    href: '/tools/kids-learning',
    upsell: '₦7,500 PDF Pack'
  },
  {
    id: 'biohack-longevity',
    title: 'Biohack Longevity™ Macro & Autophagy Engine',
    badge: 'Biotech Health',
    category: 'lifestyle',
    description: 'Calculate personalized BMR/TDEE, cellular autophagy hours, optimal protein floor, and intermittent fasting windows.',
    icon: Activity,
    color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
    href: '/tools/biohack-longevity',
    upsell: '₦15,000 Protocol'
  },
  {
    id: 'prayer-journal',
    title: 'Daily Grace™ Scripture & Prayer Journal',
    badge: 'Faith & Soul',
    category: 'lifestyle',
    description: 'Scripture promise finder, prayer journal with audio devotionals, and daily faith affirmations.',
    icon: Heart,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    href: '/tools/prayer-journal',
    upsell: '₦5,000 Devotional'
  },
  {
    id: 'sure-score',
    title: 'SureScore AI™ Football Match Predictor & Acca Slip Builder',
    badge: '2026 Poisson xG Engine',
    category: 'lifestyle',
    description: 'Simulate 1X2 win probabilities, projected scorelines, BTTS, and 1-click load accumulator tickets on SportyBet and Bet9ja.',
    icon: Flame,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/sure-score',
    upsell: 'VIP Club & ₦15k Model'
  },
  {
    id: 'drama-radar',
    title: 'DramaRadar AI™ Fake vs Real Reddit Detective & Confession Vault',
    badge: 'Reddit Story Detective',
    category: 'lifestyle',
    description: 'Interactive Fake vs Real drama detective micro-game, anonymous true confession submissions, and viral storytelling blueprints.',
    icon: Sparkles,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    href: '/tools/drama-radar',
    upsell: '₦15k Story Blueprint'
  },
  {
    id: 'saas-radar',
    title: 'SaaSRadar AI™ Software Alternatives & Lifetime Deal Finder',
    badge: 'SaaS Spend Optimizer',
    category: 'b2b',
    description: 'Slash recurring subscription costs. Compare expensive SaaS tools against open-source, free, and lifetime deal alternatives.',
    icon: Zap,
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    href: '/tools/saas-radar',
    upsell: '₦150k B2B Migration'
  },
  {
    id: 'goal-grid',
    title: 'GoalGrid AI™ Daily Football Mystery Star & Club Game',
    badge: 'Viral Wordle Mechanic',
    category: 'lifestyle',
    description: 'Guess today 5-letter football star in 6 tries, share your emoji grid on WhatsApp, and unlock 4.85x acca slips.',
    icon: Flame,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/goal-grid',
    upsell: 'VIP Club & ₦15k Model'
  },
  {
    id: 'typing-speed',
    title: 'TypeMaster AI™ 60-Second WPM Typing Speed & Accuracy Test',
    badge: 'Global Speed Benchmark',
    category: 'b2b',
    description: 'Benchmark your typing speed (WPM) and accuracy in 60 seconds with verified certificate sharing.',
    icon: Zap,
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    href: '/tools/typing-speed',
    upsell: '₦15k Freelance Pack'
  },
  {
    id: 'focus-timer',
    title: 'FocusFlow AI™ 25/5 Pomodoro Deep Work Timer & Soundscapes',
    badge: 'Deep Work Suite',
    category: 'lifestyle',
    description: 'Scientific Pomodoro cycles with zero-bandwidth synthesized ambient soundscapes and sprint checklist.',
    icon: Sparkles,
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    href: '/tools/focus-timer',
    upsell: '₦15k Notion OS'
  },
  {
    id: 'runway-radar',
    title: 'RunwayRadar AI™ "Can I Quit My Job?" Financial Runway Sizer',
    badge: '⏳ Freedom Countdown',
    category: 'wealth',
    description: 'Calculate your exact emergency runway in months and days to determine your safe resignation date.',
    icon: Calculator,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/runway-radar',
    upsell: '₦15k Cashflow Pack'
  },
  {
    id: 'salary-calc',
    title: 'SalaryTakeHome AI™ 2026 Net Pay & PAYE Tax Sizer',
    badge: ' Statutory Payroll Engine',
    category: 'wealth',
    description: 'Calculate your true monthly net salary after PAYE tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    icon: Calculator,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/salary-calc',
    upsell: '₦15k Wealth Model'
  },
  {
    id: 'higher-lower',
    title: 'Higher or Lower AI™ Viral Football Values & Wealth Game',
    badge: '500M+ Play Challenge',
    category: 'lifestyle',
    description: 'Addictive comparison game: guess which football star has a higher transfer valuation or billionaire net worth. Beat your streak!',
    icon: Sparkles,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/higher-lower',
    upsell: '₦15k Sports Model'
  },
];

export default function ToolsHubPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredTools = TOOLS.filter(tool => {
    const matchesFilter = filter === 'all' || tool.category === filter;
    const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      {/* Top Metallic Accent Glow */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-xs font-bold text-[#d4af37] uppercase tracking-wider">
            2026 PRODUCTION SECTOR TOOLS & SIZERS DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Commercial Calculators, Sizers & Surcharges
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Instant, high-performance Nigerian commercial calculation tools. No login required. Calculate Band A tariffs, Tokunbo customs duty, salon deposit locks, and school fee broadsheet gating in seconds.
          </p>
        </div>

        {/* Nairaland & Forum Traffic Launchpad Banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-slate-950 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
              🇳🇬
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  High-Yield Organic Traffic
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Over 2M+ Forum Impressions
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Nairaland & Forum Traffic Distribution Launchpad
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                1-Click copy ready-to-post BBCode campaigns for Nairaland Auto, Properties, and Investment sections to drive thousands of targeted Nigerian visitors.
              </p>
            </div>
          </div>
          <Link
            href="/tools/nairaland"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-95 whitespace-nowrap shrink-0 relative z-10"
          >
            <Share2 className="w-4 h-4" />
            <span>Open Nairaland Hub →</span>
          </Link>
        </div>

        {/* Turnkey B2B Whitelabel & Digital Store Monetization Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/60 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                 B2B Whitelabel & Commercial Licensing
              </span>
              <span className="text-[10px] font-bold text-amber-400">
                Turnkey from ₦35,000 / $45
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white font-['Outfit']">
              Want Any of These Interactive Engines Branded for Your Business?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deploy custom branding, automated lead capture, and a 24/7 AI WhatsApp closer directly on your dedicated domain. Built for coaches, agencies, fintechs, and commercial operators.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://selar.com/showlove/bethelmind"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Selar Digital Store →</span>
            </a>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind Digital Solutions! I want to deploy a turnkey white-label interactive tool/calculator for my business.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Claim Setup on WhatsApp →</span>
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-lg">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'wealth', label: ' Viral Games & Wealth' },
              { id: 'b2b', label: '🇳🇬 High-Yield B2B' },
              { id: 'realestate', label: ' Property & Land' },
              { id: 'lifestyle', label: ' Family & Lifestyle' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:scale-105 transition-transform text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-white/[0.03] border border-white/10 text-slate-300 rounded-full">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors mb-2 font-['Outfit']">
                    {tool.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-emerald-400">
                    {tool.upsell}
                  </span>
                  
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Launch Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Verification Footer Seal */}
        <footer className="text-center py-10 text-xs text-slate-500 border-t border-white/5 space-y-2 mt-12">
          <p className="flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Bank-Grade 256-bit Encrypted Telemetry · Settlement via Moniepoint Microfinance Bank (6805375225)</span>
          </p>
          <p>© 2026 Bethelmind Digital Solutions · Plot 12, Commercial Corridor, Lagos, Nigeria.</p>
        </footer>
      </main>

      <Footer />
    </div>
  );
}