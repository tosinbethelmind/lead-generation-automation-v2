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
  Coins,
  Smile,
  Activity,
  Car,
  Layers,
  ShoppingBag
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface ToolItem {
  id: string;
  title: string;
  badge: string;
  category: 'wealth' | 'realestate' | 'creator' | 'lifestyle' | 'b2b';
  description: string;
  icon: any;
  color: string;
  href: string;
  upsell: string;
}

const TOOLS: ToolItem[] = [
  // --- Wealth & Real Estate ---
  {
    id: 'solar-savings',
    title: 'Solar & Clean Energy Savings Calculator',
    badge: 'High Solar ROI',
    category: 'wealth',
    description: 'Calculate 25-year rooftop solar savings, panel count, battery bank requirements, and 30% clean energy rebates.',
    icon: Sun,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/solar-savings',
    upsell: '💎 $97 Sizing Blueprint'
  },
  {
    id: 'wealth-calculator',
    title: 'WealthPulse Pro™ Compound Growth Model',
    badge: 'Finance Magnet',
    category: 'wealth',
    description: 'Interactive compound interest, financial freedom timeline, and annual savings projection visualizer.',
    icon: TrendingUp,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/wealth-calculator',
    upsell: '💎 $47 Wealth Blueprint'
  },
  {
    id: 'deal-calculator',
    title: 'DealCheck™ Rental Property Cashflow & Cap Rate',
    badge: 'Real Estate Pro',
    category: 'realestate',
    description: 'Calculate net cash-on-cash return, cap rate, and mortgage DSCR for long-term rental and Airbnb properties.',
    icon: Calculator,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/deal-calculator',
    upsell: '💎 $37 Rental Analyzer'
  },
  {
    id: 'wholesaling-loi',
    title: 'Real Estate Wholesaling & Auto-LOI Contract',
    badge: 'Deal Closer',
    category: 'realestate',
    description: 'Calculate 70% Rule Maximum Allowable Offer (MAO), rehab repair tiers, and auto-generate 1-page cash offer LOI contracts.',
    icon: Building2,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/wholesaling-loi',
    upsell: '💎 $29 Closer / $97 Legal'
  },
  {
    id: 'crypto-dca',
    title: 'WhaleDCA™ Crypto & Profit Target Exit Ladder',
    badge: 'Crypto Alpha',
    category: 'wealth',
    description: 'Simulate Bitcoin, ETH & Solana dollar-cost averaging and auto-generate institutional 4-tier take-profit exit targets.',
    icon: Coins,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/crypto-dca',
    upsell: '💎 $47 Whale Strategy'
  },

  // --- Creator & AI Diagnostics ---
  {
    id: 'script-generator',
    title: 'Viral Shorts Hook & Script Studio',
    badge: 'Trending #1',
    category: 'creator',
    description: 'Generate 0–3s high-contrast hooks, scene-by-scene B-roll prompts, and APV > 100% loop bridges in 10 seconds.',
    icon: Sparkles,
    color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400',
    href: '/tools/script-generator',
    upsell: '💎 $29 Pro / $97 Agency'
  },
  {
    id: 'site-audit',
    title: 'Website Health & SEO Audit Scorecard',
    badge: 'Client Closer',
    category: 'creator',
    description: 'Instant 360° audit grading Google Core Web Vitals, On-Page SEO, security headers, and revenue leakage with auto client pitch.',
    icon: Globe,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    href: '/tools/site-audit',
    upsell: '💎 $29 Pro / $97 Closing'
  },
  {
    id: 'ai-stack-finder',
    title: 'AI & Micro-SaaS Stack ROI Finder',
    badge: 'Automation',
    category: 'creator',
    description: 'Discover the top AI software stack for your business and calculate exact monthly hours and dollars saved.',
    icon: Zap,
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    href: '/tools/ai-stack-finder',
    upsell: '💎 $47 Full-Stack Vault'
  },

  // --- Lifestyle, Health, Faith & Kids ---
  {
    id: 'kids-learning',
    title: 'Tiny Learners™ 3D Kids Phonics & Activity Generator',
    badge: 'Family & Toddlers',
    category: 'lifestyle',
    description: 'Generate instant, screen-free phonics games, counting quests, and printable coloring activities for toddlers and preschoolers.',
    icon: Smile,
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    href: '/tools/kids-learning',
    upsell: '💎 $19 100+ PDF Bundle'
  },
  {
    id: 'biohack-longevity',
    title: 'Biohack Longevity™ Macro & Autophagy Engine',
    badge: 'Biotech Health',
    category: 'lifestyle',
    description: 'Calculate personalized BMR/TDEE, cellular autophagy hours, optimal protein floor, and intermittent fasting windows.',
    icon: Activity,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/biohack-longevity',
    upsell: '💎 $47 Longevity Blueprint'
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
    upsell: '💎 $19 365 Devotional'
  },
  {
    id: 'sports-edge',
    title: 'SportsBet Edge™ Expected Value Matrix',
    badge: 'High Engagement',
    category: 'lifestyle',
    description: 'Calculate positive expected value (+EV), fractional Kelly Criterion staking, and eliminate emotional wagering tilt.',
    icon: Flame,
    color: 'from-rose-500/20 to-orange-500/10 border-rose-500/30 text-rose-400',
    href: '/tools/sports-edge',
    upsell: '💎 $37 VIP Formula'
  },

  // --- Bethelmind B2B Engines ---
  {
    id: 'solar-boq',
    title: 'SolarQuote Pro (Nigerian Inverter & BOQ Engine)',
    badge: 'Commercial Grade',
    category: 'b2b',
    description: 'Professional load sizing, battery requirement calculation, and instant PDF quote generator for Nigerian installers.',
    icon: Sun,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/solar',
    upsell: '🚀 Turnkey Solar Engine'
  },
  {
    id: 'tokunbo-duty',
    title: 'Tokunbo VIN & Nigerian Customs Duty Checker',
    badge: 'Auto Dealers',
    category: 'b2b',
    description: 'Instant accident history verification, auction report lookup, and official Nigerian Customs VIN clearing duty calculation.',
    icon: Car,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    href: '/vin',
    upsell: '🚀 Car Dealer Suite'
  },
  {
    id: 'p2p-arbitrage',
    title: 'Real-Time P2P Arbitrage & FX Spread Tracker',
    badge: 'Live Spreads',
    category: 'b2b',
    description: 'Real-time monitoring of Binance P2P, Bybit, and Nigerian parallel market FX arbitrage margins and trade spreads.',
    icon: Coins,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    href: '/arbitrage',
    upsell: '🚀 VIP Arbitrage Bot'
  },
  {
    id: 'marketplace',
    title: 'Bethelmind B2B Lead Marketplace & Store',
    badge: 'Verified Leads',
    category: 'b2b',
    description: 'Verified decision-maker business contacts, WhatsApp outreach automation, and enterprise B2B sales pipelines.',
    icon: ShoppingBag,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/marketplace',
    upsell: '🚀 Verified Lead Lists'
  }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
            🚀 BETHELMIND FREE TOOLS & CALCULATORS DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Interactive Calculators, Generators & Audits
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Free, high-performance tools engineered to solve immediate problems in seconds. No login required. Calculate savings, audit deals, generate scripts, and unlock expert blueprints.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'wealth', label: 'Wealth & Solar' },
              { id: 'realestate', label: 'Real Estate' },
              { id: 'creator', label: 'Creator & AI' },
              { id: 'lifestyle', label: 'Health & Family' },
              { id: 'b2b', label: 'B2B Software' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === cat.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Grid of Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  <span className="text-amber-400 text-[11px] font-bold">
                    {tool.upsell}
                  </span>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
