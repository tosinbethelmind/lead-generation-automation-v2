'use client';

/**
 * @file src/app/services/page.tsx
 * 
 * 🏛️ BETHELMIND DIGITAL SOLUTIONS — PILLAR ONE COMMERCIAL SOLUTIONS DIRECTORY
 * CAC Certified Nigerian Enterprise (Reg: 9912717)
 * 100% Zero-Crypto B2B SME Revenue Tools & Turnkey Prototypes
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Search, 
  ExternalLink, 
  Copy, 
  Smartphone, 
  Sun, 
  Building2, 
  ShoppingBag, 
  Scissors, 
  Hotel, 
  Truck, 
  GraduationCap, 
  Layers, 
  Zap, 
  Car,
  MessageCircle
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { PILLAR_ONE_SERVICES, PillarOneService } from '@/lib/pillarOneCatalog';

export default function ServicesDirectoryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All 13 Solutions' },
    { id: 'Web & Mobile', label: 'Websites & Mobile Apps' },
    { id: 'Engineering & Energy', label: 'Solar & Engineering' },
    { id: 'Fintech & Security', label: 'Fintech & Security' },
    { id: 'Hospitality & Real Estate', label: 'Shortlet & Real Estate' },
    { id: 'Retail & Supply Chain', label: 'Retail, Salon & Supply' },
    { id: 'EdTech & Portals', label: 'Schools & Portals' },
    { id: 'Automotive', label: 'Automotive VIN' },
  ];

  const filteredServices = PILLAR_ONE_SERVICES.filter(service => {
    const matchesCategory = filter === 'all' || service.category === filter;
    const matchesSearch = 
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.headline.toLowerCase().includes(search.toLowerCase()) ||
      service.problem.toLowerCase().includes(search.toLowerCase()) ||
      service.shortTitle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPitchLink = (serviceId: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/onboard?service=${serviceId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(serviceId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Web & Mobile': return Smartphone;
      case 'Engineering & Energy': return Sun;
      case 'Fintech & Security': return ShieldCheck;
      case 'Hospitality & Real Estate': return Hotel;
      case 'Retail & Supply Chain': return ShoppingBag;
      case 'EdTech & Portals': return GraduationCap;
      case 'Automotive': return Car;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24 space-y-12">
        
        {/* Editorial Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0a0e17] border border-[#d4af37]/30 rounded-full text-xs font-semibold text-[#d4af37] uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Pillar One • 100% Commercial SME Growth Engine</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            13 High-Conversion Sector Solutions &amp; <span className="text-[#d4af37]">DFY Prototypes</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Turnkey Nigerian business software engineered for speed, sub-1s mobile loading, and direct revenue. Zero developer delays. Fully operational in 24 to 48 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> CAC Certified Enterprise (Reg: 9912717)
            </span>
            <span>&bull;</span>
            <span className="text-slate-300">Moniepoint Microfinance Bank (6805375225)</span>
            <span>&bull;</span>
            <span className="text-[#d4af37]">48-Hour Live Delivery SLA</span>
          </div>

          {/* Quick Pricing Explainer Banner */}
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#d4af37]/10 to-sky-500/10 border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="font-bold text-white block">✨ Transparent 2-Option Pricing:</span>
              <span><strong>Starter:</strong> ₦35,000 Setup + ₦7,000/mo &bull; <strong>Annual Pass:</strong> ₦80,000 Flat (1 Full Year Free Maintenance — Save ₦39k)</span>
            </div>
            <Link
              href="/onboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold shrink-0 hover:brightness-110 transition shadow-md"
            >
              Start Admission
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0e17] border border-white/[0.08] p-3 rounded-2xl shadow-xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab.id 
                    ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search solutions or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#070b14] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = getIconForCategory(service.category);
            const isPortal = Boolean(service.pricing.isPortal);

            return (
              <div 
                key={service.id}
                id={service.id}
                className="bg-[#0a0e17] border border-white/[0.08] hover:border-[#d4af37]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl shadow-black/60 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[#d4af37] rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium mb-3">
                    {service.headline}
                  </p>

                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    {service.solution}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 mb-6 pt-2 border-t border-white/5">
                    {service.deliverables.slice(0, 4).map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Pricing & Action Section */}
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  {/* Pricing Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Starter Activation</div>
                      <div className="font-extrabold text-white">
                        ₦{service.pricing.starterSetup.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">+ ₦{service.pricing.starterMonthly.toLocaleString()}/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 uppercase font-semibold">Annual Pass (1 Yr Free)</div>
                      <div className="font-extrabold text-emerald-400">
                        ₦{service.pricing.annualPass.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/year</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={service.liveDemoUrl}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition"
                    >
                      <span>Test Demo</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>

                    <Link
                      href={`/onboard?service=${service.id}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] text-xs font-extrabold hover:brightness-110 shadow-md transition"
                    >
                      <span>Deploy (48h)</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 1-Tap Copy Pitch Link */}
                  <button
                    type="button"
                    onClick={() => handleCopyPitchLink(service.id)}
                    className="w-full flex items-center justify-center gap-1 text-[10px] text-slate-400 hover:text-[#d4af37] transition pt-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === service.id ? '✅ Quote Link Copied to Clipboard!' : 'Copy Direct Client Order Link'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Assistance / Advisory Desk Card */}
        <div className="bg-gradient-to-r from-[#0e1424] to-[#0a0e17] border border-[#d4af37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              Bethelmind Lagos Commercial Advisory Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need a Custom Solution or Enterprise Portal?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Talk directly with our senior solutions engineers. We can customize any calculator, deploy multi-agent WhatsApp inboxes, or build an enterprise portal for your firm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Desk!%20I%20would%20like%20to%20discuss%20a%20custom%20commercial%20software%20deployment%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat with Admin (0802 279 1227)</span>
            </a>

            <Link
              href="/onboard"
              className="flex items-center gap-1.5 py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold text-xs shadow-lg hover:brightness-110 transition"
            >
              <span>Instant Admission Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
