'use client';

/**
 * @file src/app/tools/page.tsx
 * Ultra-Luxurious, Editorial Sector Tools & Sizers Directory for Nigerian Commercial Operators.
 * Base obsidian (#070b14), warm ivory/slate typography, champagne gold (#d4af37) metallic accents.
 * 100% link preservation.
 */

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
import { TurnkeySmeSetupBanner } from '@/components/TurnkeySmeSetupBanner';

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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
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
    color: 'text-[#d4af37]',
    href: '/tools/fake-alert-shield',
    upsell: '₦35,000 Fintech Shield'
  },

  {
    id: 'cac-registration-sizer',
    title: 'CAC Business Name & Company Incorporation Fee Sizer',
    badge: 'Official CAC & Stamp Duty',
    category: 'b2b',
    description: 'Instant statutory CAC filing fees, name reservation availability check, FIRS stamp duty, and SCUML compliance matrix for Nigerian business owners and accredited agents.',
    icon: Scale,
    color: 'text-[#d4af37]',
    href: '/tools/cac-registration-sizer',
    upsell: '₦35,000 Legal Suite'
  },
  {
    id: 'shortlet-booking-escrow',
    title: 'Shortlet Apartment Booking & Caution Escrow Lock',
    badge: 'DisCo Token & Caution Lock',
    category: 'realestate',
    description: 'Direct guest booking engine that locks reservation deposits, automates check-in receipts, and reconciles prepaid DisCo electricity token quotas against caution deposits.',
    icon: Hotel,
    color: 'text-[#d4af37]',
    href: '/tools/shortlet-booking-escrow',
    upsell: '₦35,000 Hospitality Suite'
  },
  {
    id: 'gps-tracker-fuel-audit',
    title: 'Commercial GPS Fleet Tracker & Diesel Siphon Auditor',
    badge: 'Anti-Siphon Fuel Guard',
    category: 'b2b',
    description: 'Reconciles real-time GPS trip odometer distances against fuel station allocations, auditing driver consumption and generating instant debit notes for siphoned diesel.',
    icon: Truck,
    color: 'text-[#d4af37]',
    href: '/tools/gps-tracker-fuel-audit',
    upsell: '₦35,000 Haulage Suite'
  },
  {
    id: 'starlink-installation-sizer',
    title: 'Starlink Satellite Internet Installation & Estate Mesh Sizer',
    badge: 'High-Speed Satellite',
    category: 'b2b',
    description: 'Precision hardware, roof ridge/wall pipe mounts, multi-floor duplex WiFi mesh nodes, lightning surge arrestors, and pure sine wave UPS backup sizer for Nigerian estates and offices.',
    icon: Zap,
    color: 'text-[#d4af37]',
    href: '/tools/starlink-installation-sizer',
    upsell: '₦35,000 Starlink Suite'
  },
  {
    id: 'cleaning-fumigation-sizer',
    title: 'Residential Deep Cleaning & Post-Construction Fumigation Sizer',
    badge: 'Per-Sqm Estimator',
    category: 'b2b',
    description: 'Instant square-meter quotes for post-construction scrubbing, cement haze scraping, deep janitorial sanitization, and 4-hour chemical fumigation pest barriers.',
    icon: Sparkles,
    color: 'text-[#d4af37]',
    href: '/tools/cleaning-fumigation-sizer',
    upsell: '₦35,000 Cleaning Suite'
  },

  // --- Lifestyle & Wealth Utility Engines ---
  {
    id: 'kids-learning',
    title: 'Tiny Learners 3D Kids Phonics & Activity Generator',
    badge: 'Family & Toddlers',
    category: 'lifestyle',
    description: 'Generate instant, screen-free phonics games, counting quests, and printable coloring activities for toddlers and preschoolers.',
    icon: Smile,
    color: 'text-[#d4af37]',
    href: '/tools/kids-learning',
    upsell: '₦7,500 Curriculum Pack'
  },
  {
    id: 'biohack-longevity',
    title: 'Biohack Longevity Macro & Autophagy Engine',
    badge: 'Biotech Health',
    category: 'lifestyle',
    description: 'Calculate personalized BMR/TDEE, cellular autophagy hours, optimal protein floor, and intermittent fasting windows.',
    icon: Activity,
    color: 'text-[#d4af37]',
    href: '/tools/biohack-longevity',
    upsell: '₦15,000 Protocol'
  },
  {
    id: 'prayer-journal',
    title: 'Daily Grace Scripture & Prayer Journal',
    badge: 'Faith & Soul',
    category: 'lifestyle',
    description: 'Scripture promise finder, prayer journal with audio devotionals, and daily faith affirmations.',
    icon: Heart,
    color: 'text-[#d4af37]',
    href: '/tools/prayer-journal',
    upsell: '₦5,000 Devotional'
  },
  {
    id: 'sure-score',
    title: 'SureScore AI Football Match Predictor & Acca Slip Builder',
    badge: 'Poisson xG Engine',
    category: 'lifestyle',
    description: 'Simulate 1X2 win probabilities, projected scorelines, BTTS, and 1-click load accumulator tickets on SportyBet and Bet9ja.',
    icon: Flame,
    color: 'text-[#d4af37]',
    href: '/tools/sure-score',
    upsell: 'Quantitative Analytics'
  },
  {
    id: 'drama-radar',
    title: 'DramaRadar AI Story Detective & Confession Vault',
    badge: 'Story Detective',
    category: 'lifestyle',
    description: 'Interactive Fake vs Real drama detective micro-game, anonymous true confession submissions, and viral storytelling blueprints.',
    icon: Sparkles,
    color: 'text-[#d4af37]',
    href: '/tools/drama-radar',
    upsell: '₦15k Story Blueprint'
  },
  {
    id: 'saas-radar',
    title: 'SaaSRadar Software Alternatives & Lifetime Deal Finder',
    badge: 'SaaS Spend Optimizer',
    category: 'b2b',
    description: 'Slash recurring subscription costs. Compare expensive SaaS tools against open-source, free, and lifetime deal alternatives.',
    icon: Zap,
    color: 'text-[#d4af37]',
    href: '/tools/saas-radar',
    upsell: 'B2B Cost Audit'
  },
  {
    id: 'goal-grid',
    title: 'GoalGrid Daily Football Mystery Star & Club Game',
    badge: 'Daily Game Mechanic',
    category: 'lifestyle',
    description: 'Guess today 5-letter football star in 6 tries, share your score on WhatsApp, and unlock high-confidence analytics slips.',
    icon: Flame,
    color: 'text-[#d4af37]',
    href: '/tools/goal-grid',
    upsell: 'Quantitative Model'
  },
  {
    id: 'typing-speed',
    title: 'TypeMaster 60-Second WPM Typing Speed & Accuracy Test',
    badge: 'Global Speed Benchmark',
    category: 'b2b',
    description: 'Benchmark your typing speed (WPM) and accuracy in 60 seconds with verified certificate sharing.',
    icon: Zap,
    color: 'text-[#d4af37]',
    href: '/tools/typing-speed',
    upsell: 'Productivity Suite'
  },
  {
    id: 'focus-timer',
    title: 'FocusFlow 25/5 Pomodoro Deep Work Timer & Soundscapes',
    badge: 'Deep Work Suite',
    category: 'lifestyle',
    description: 'Scientific Pomodoro cycles with zero-bandwidth synthesized ambient soundscapes and sprint checklist.',
    icon: Sparkles,
    color: 'text-[#d4af37]',
    href: '/tools/focus-timer',
    upsell: 'Executive Deep Work'
  },
  {
    id: 'runway-radar',
    title: 'RunwayRadar Financial Runway & Freedom Sizer',
    badge: 'Freedom Countdown',
    category: 'wealth',
    description: 'Calculate your exact emergency runway in months and days to determine your safe resignation date and passive buffer.',
    icon: Calculator,
    color: 'text-[#d4af37]',
    href: '/tools/runway-radar',
    upsell: 'Cashflow Architecture'
  },
  {
    id: 'salary-calc',
    title: 'SalaryTakeHome 2026 Net Pay & PAYE Tax Sizer',
    badge: 'Statutory Payroll Engine',
    category: 'wealth',
    description: 'Calculate your true monthly net salary after PAYE tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    icon: Calculator,
    color: 'text-[#d4af37]',
    href: '/tools/salary-calc',
    upsell: 'Tax & Net Pay Engine'
  },
  {
    id: 'higher-lower',
    title: 'Higher or Lower Market Value Comparison Game',
    badge: 'Comparison Arena',
    category: 'lifestyle',
    description: 'Comparison game: gauge which football star has a higher transfer valuation or entrepreneur net worth.',
    icon: Sparkles,
    color: 'text-[#d4af37]',
    href: '/tools/higher-lower',
    upsell: 'Sports Valuation Suite'
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
    <div className="min-h-screen bg-[#070b14] text-[#c9c4bc] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 pb-20 w-full space-y-10">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0a0e17] border border-[#d4af37]/30 rounded-full text-xs font-medium text-[#d4af37] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>2026 Production Sector Tools &amp; Sizers Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug sm:leading-tight">
            Commercial Calculators, Sizers &amp; Surcharges
          </h1>
          <p className="text-[#c9c4bc] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Instant, high-performance Nigerian commercial calculation tools. No login required. Calculate Band A tariffs, Tokunbo customs duty, salon deposit locks, and school fee broadsheet gating in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[#8e887e] font-light">
            <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              CAC RC: 7034297 Certified
            </span>
            <span>&bull;</span>
            <span>Moniepoint NIP Reconciliation</span>
            <span>&bull;</span>
            <span>48-Hour Turnkey Deployment</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0e17] border border-white/[0.08] p-3 rounded-2xl shadow-xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Sector Engines' },
              { id: 'b2b', label: 'Commercial B2B Suites' },
              { id: 'realestate', label: 'Property & Construction' },
              { id: 'wealth', label: 'Financial & Sizing Engines' },
              { id: 'lifestyle', label: 'Enterprise & Practice' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === tab.id 
                    ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm' 
                    : 'text-[#8e887e] hover:text-[#f5f3ef] hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8e887e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#070b14] border border-white/[0.08] rounded-xl text-xs text-[#f5f3ef] placeholder-[#8e887e] focus:outline-none focus:border-[#d4af37] transition-colors"
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
                className="bg-[#0a0e17] border border-white/[0.06] hover:border-[#d4af37]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl shadow-black/60 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 group-hover:scale-105 transition-transform text-[#d4af37]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-white/[0.03] border border-white/10 text-[#8e887e] rounded-full">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-normal text-[#f5f3ef] group-hover:text-[#d4af37] transition-colors mb-2">
                    {tool.title}
                  </h3>
                  
                  <p className="text-xs text-[#8e887e] font-light leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-emerald-400">
                    {tool.upsell}
                  </span>
                  
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d4af37] hover:underline group-hover:translate-x-1 transition-all"
                  >
                    <span>Open Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Turnkey B2B SME Setup Banner */}
        <div className="pt-6">
          <TurnkeySmeSetupBanner
            toolName="Commercial Sizer &amp; Quoting Engine"
            category="Enterprise"
          />
        </div>

        {/* Statutory Legal Notice & Sector Tools Disclaimer */}
        <aside aria-label="Statutory Notice" className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-6 text-xs text-[#8e887e] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[#c9c4bc] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="uppercase tracking-wider text-[11px] text-[#d4af37] font-semibold">
                Statutory Notice &amp; Sector Tools Accuracy Policy
              </span>
            </div>
            <span className="text-[10px] text-[#8e887e] font-mono">RC: 7034297</span>
          </div>
          <p className="leading-relaxed font-light">
            Interactive calculation tools across this directory provide automated preliminary estimates for planning and feasibility assessment only. Bethelmind Digital Solutions operates as a technology and workflow automation provider, not a COREN-registered engineering consultant, licensed customs broker, surveying authority, or chartered tax practitioner. Formal structural projects, customs clearance declarations, and binding agreements require on-site professional verification.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[11px] text-[#8e887e] flex-wrap border-t border-white/[0.05]">
            <span className="font-medium text-[#c9c4bc]">Statutory Policies:</span>
            <Link href="/legal/disclaimer" className="text-[#d4af37] hover:underline">
              Sector Tools Disclaimer
            </Link>
            <span>&bull;</span>
            <Link href="/legal/terms" className="text-[#d4af37] hover:underline">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/legal/privacy" className="text-[#d4af37] hover:underline">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/legal/delivery" className="text-[#d4af37] hover:underline">
              Delivery SLA
            </Link>
            <span>&bull;</span>
            <Link href="/legal/refund" className="text-[#d4af37] hover:underline">
              Refund Policy
            </Link>
          </div>
        </aside>

      </main>

      <Footer />
    </div>
  );
}
