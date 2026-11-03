'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 OBI TABLE WATER — SIMPLE, MODERN PRODUCT WEBSITE & SYSTEM
 * Designed specifically for Nigerian Sachet ("Pure Water") & Bottled Table Water Companies.
 * 
 * Aesthetic: Clean water-brand (Deep Blue #0B5FFF, Fresh Aqua #00C2CB, Clean Light #F8FAFC, Dark Navy #0F172A)
 * Features:
 * - Clear hero with single promise, one supporting line, and primary WhatsApp CTA
 * - Interactive Mockup preview with 1-click live demo test
 * - "See How It Works" in 3 simple steps
 * - 6 Core feature benefit cards in plain Nigerian business language
 * - "Who It Is For" section (Sachet plants, bottling factories, wholesale depots)
 * - Clean 3-tier pricing (₦35k Starter, ₦280k Plant [Recommended], ₦550k Industrial)
 * - Trust & compliance section (CAC Reg: 9912717, 48h Handover, local support)
 * - FAQ section addressing common objections
 * - Fixed mobile bottom navigation & floating WhatsApp button (#25D366)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Package, 
  Truck, 
  DollarSign, 
  Users, 
  Award, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  X,
  Droplets,
  Zap,
  Phone,
  CheckCircle2,
  Sliders,
  FileText,
  Copy
} from 'lucide-react';

export default function ObiTableWaterProductPage() {
  const [showInteractiveModal, setShowInteractiveModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Interactive Live Demo State (within the interactive modal or preview)
  const [demoBags, setDemoBags] = useState(3200);
  const [demoPrice, setDemoPrice] = useState(350);
  const [demoTruckShortage, setDemoTruckShortage] = useState(40);
  const [demoDieselLiters, setDemoDieselLiters] = useState(55);
  const [demoDieselPrice, setDemoDieselPrice] = useState(1250);
  const [copiedReport, setCopiedReport] = useState(false);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const shiftGross = demoBags * demoPrice;
  const dieselCost = demoDieselLiters * demoDieselPrice;
  const energyCostPerBag = (dieselCost / (demoBags || 1)).toFixed(1);
  const estimatedNetProfit = Math.round(shiftGross - dieselCost - (demoBags * 28)); // ₦28/bag packaging & loaders

  const generateWhatsAppSummary = () => {
    return `💧 *OBI TABLE WATER — DAILY EVENING SHIFT REPORT*
📅 Date: ${new Date().toLocaleDateString('en-GB')}
━━━━━━━━━━━━━━━━━━━━
🏭 *1. PRODUCTION:*
• Sachet Water: ${demoBags.toLocaleString()} bags sealed (@ ₦${demoPrice}/bag)
• Shift Production Value: ₦${shiftGross.toLocaleString()}

🚚 *2. DRIVERS & DELIVERIES:*
• Truck 1 (Emeka): Loaded 850 bags | Remitted: ₦280,000 | Balanced ✅
• Truck 2 (Musa): Loaded 700 bags | ⚠️ Shortage: -${demoTruckShortage} bags (₦${(demoTruckShortage * demoPrice).toLocaleString()} debited)
• Truck 3 (Ibrahim): Loaded 600 bags | Balanced ✅

⚡ *3. GENERATOR & POWER:*
• Diesel Used: ${demoDieselLiters} Litres @ ₦${demoDieselPrice}/L = ₦${dieselCost.toLocaleString()}
• Fuel Cost per Bag: ₦${energyCostPerBag} / bag

💰 *4. SHIFT FINANCIALS:*
• Estimated Net Cash Profit Today: ₦${estimatedNetProfit.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
Report logged & verified on Obi Table Water System.`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateWhatsAppSummary());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0B5FFF]/20 selection:text-[#0B5FFF]">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          1. CLEAN TOP NAVIGATION (4 SIMPLE ITEMS + WHATSAPP)
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-md shadow-[#0B5FFF]/25">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#0F172A] tracking-tight block">
                Obi Table Water
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block leading-none">
                Water Factory Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Clean Menu */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#0B5FFF] transition">How It Works</a>
            <a href="#features" className="hover:text-[#0B5FFF] transition">Features</a>
            <a href="#pricing" className="hover:text-[#0B5FFF] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#0B5FFF] transition">FAQ</a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowInteractiveModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#0B5FFF]" />
              <span>Test Interactive Demo</span>
            </button>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind! I run a water factory. I want to test the Obi Table Water operating system and see how it works for my plant.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. HERO SECTION: 1 CLEAR PROMISE, 1 VISUAL, 1 ACTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Small Nigerian Water Factory Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5FFF]/10 border border-[#0B5FFF]/20 text-[#0B5FFF] text-xs font-bold">
          <Droplets className="w-3.5 h-3.5 text-[#0B5FFF]" />
          <span>Built for Nigerian Sachet &amp; Table Water Factories</span>
        </div>

        {/* Clear Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight max-w-3xl mx-auto leading-tight">
          Run your table and sachet water business with confidence.
        </h1>

        {/* Subheadline in Plain Business Language */}
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Obi Table Water helps you track production, deliveries, sales, staff shortages, and daily profit in one simple system.
        </p>

        {/* Primary and Secondary Action Buttons (Min 48px Height) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I want to start a free WhatsApp demo of the water factory management system for my plant.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-extrabold shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Start Free WhatsApp Demo</span>
          </a>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Clean Dashboard Preview Card (The One Visual) */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-5 shadow-2xl relative overflow-hidden group">
            
            {/* Mockup Top Window Chrome */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">obitablewater.com.ng &bull; Daily Shift Overview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInteractiveModal(true)}
                className="text-xs font-bold text-[#0B5FFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Test Sliders Live</span>
              </button>
            </div>

            {/* Clean Visual Preview (4 Key Numbers at a Glance) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 sm:p-4 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Today&apos;s Output</span>
                <strong className="text-lg sm:text-xl font-black text-slate-900 block font-mono">3,200 Bags</strong>
                <span className="text-[10px] text-slate-500">+ 250 Bottle Packs</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700 block">Net Profit Today</span>
                <strong className="text-lg sm:text-xl font-black text-emerald-700 block font-mono">₦184,500</strong>
                <span className="text-[10px] text-emerald-600 font-semibold">After all fuel &amp; labor</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                <span className="text-[11px] font-semibold text-rose-700 block">Driver Shortage</span>
                <strong className="text-lg sm:text-xl font-black text-rose-700 block font-mono">-40 Bags</strong>
                <span className="text-[10px] text-rose-600 font-semibold">₦14,000 debited (Musa)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700 block">Diesel Cost / Bag</span>
                <strong className="text-lg sm:text-xl font-black text-amber-700 block font-mono">₦34.80</strong>
                <span className="text-[10px] text-amber-600 font-semibold">55L generator run</span>
              </div>
            </div>

            {/* Mockup Teaser Callout */}
            <div className="mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#0B5FFF]/5 to-[#00C2CB]/10 border border-[#0B5FFF]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0B5FFF] text-white flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold">8:00 PM WhatsApp Shift Summary Ready</strong>
                  <span className="text-slate-500">Your supervisor enters shift numbers in 2 minutes; you get the report on WhatsApp.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInteractiveModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Open Live Demo</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. HOW IT WORKS (3 SIMPLE STEPS)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Simple Setup</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How it works for your factory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No complicated installation or accounting courses. We set everything up for you in 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#0B5FFF] text-white font-black text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tell us about your factory
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Share your daily production volume, delivery trucks, driver names, and wholesale prices on WhatsApp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#00C2CB] text-white font-black text-sm flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                We set up your system
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We configure production counters, truck loading sheets, driver deduction rules, and your WhatsApp reporting desk.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white font-black text-sm flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Start managing daily
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your team records daily shift numbers on their phone; you receive a clean WhatsApp summary every evening at 8:00 PM.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. CORE FEATURES (6 CLEAN BENEFIT CARDS IN PLAIN LANGUAGE)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Practical Tools</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Everything you need to stop factory leaks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Built specifically to solve the real everyday problems of Nigerian water company owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Production Tracking */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B5FFF]/10 text-[#0B5FFF] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Production tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Know exactly how many sachet bags and bottled water packs were produced each shift.
            </p>
          </div>

          {/* Card 2: Delivery Management */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B5FFF] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delivery management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track trucks, delivery drivers, waybills, and undamaged returns across your routes.
            </p>
          </div>

          {/* Card 3: Sales and Cash Records */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Sales and cash records</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See cash in hand, bank transfers, gate retail sales, and outstanding distributor credit balances.
            </p>
          </div>

          {/* Card 4: Staff Accountability */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Staff accountability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record driver shortages, machine sealing damages, and automatically apply deductions clearly.
            </p>
          </div>

          {/* Card 5: Water Quality Records */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Water quality records</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keep simple NAFDAC-related checks (TDS and pH) ready to print when inspectors visit.
            </p>
          </div>

          {/* Card 6: Owner Reports */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Owner reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a daily WhatsApp summary of factory performance, diesel used, and net profit.
            </p>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. WHO IT IS FOR
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-slate-100 border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Who is Obi Table Water built for?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed specifically for three kinds of water operations in Nigeria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <span className="text-xs font-black text-[#0B5FFF] uppercase block">1. Sachet Water Factories</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plants sealing 1,000 to 10,000+ bags daily that want to stop nylon roll theft and driver burst excuses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <span className="text-xs font-black text-[#00C2CB] uppercase block">2. Bottled Water Plants</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Factories producing 50cl, 75cl, and 19L dispenser jars for supermarkets, hotels, and corporate offices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <span className="text-xs font-black text-emerald-600 uppercase block">3. Major Depots &amp; Fleets</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Water distributors running 2 or more delivery vans to supply open markets and neighborhood shops.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. PRICING SECTION: 3 CLEAN CARDS (PLANT RECOMMENDED)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Clear Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Simple, honest pricing in Naira
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No foreign currency charges. Choose the plan that fits your factory size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: Starter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Starter</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Single Depot / Kiosk</h3>
                <span className="text-xs text-slate-500 block">For small roadside sales points</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">₦35,000</div>
                <span className="text-xs text-slate-500">+ ₦7,000 / month</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Simple sales records and WhatsApp catalogue for single-counter water depots with no delivery vans.
              </p>

              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Single sales desk terminal</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Daily cash and transfer record</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp sales catalogue</li>
              </ul>
            </div>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I want to activate the ₦35,000 Starter Edition of the water management system.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[48px] py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
            </a>
          </div>

          {/* Plan 2: Plant (RECOMMENDED) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#0B5FFF] shadow-xl relative flex flex-col justify-between space-y-5 md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0B5FFF] text-white text-[10px] font-black uppercase tracking-wider shadow">
              Recommended for Water Factories
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#0B5FFF] uppercase tracking-wider block">Plant Edition</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Full Water Factory</h3>
                <span className="text-xs text-slate-500 block">For active sachet &amp; bottling factories</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">₦280,000</div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  50% milestone deposit (₦140,000) to begin setup; balance paid only after live testing at your factory.
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Complete factory management: production counters, delivery truck shortage audits, diesel costing, and daily WhatsApp reports.
              </p>

              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Sachet &amp; bottle production tracking</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Truck delivery waybills &amp; driver shortages</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Generator diesel cost per bag calculator</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> NAFDAC water purity checks log</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Daily 8:00 PM WhatsApp owner report</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> 48-Hour delivery guarantee</li>
              </ul>
            </div>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind! I run an active water factory. I want to deploy the ₦280,000 Plant Edition (₦140,000 50% milestone deposit) for my factory.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-black shadow-lg shadow-[#0B5FFF]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Deploy Plant Edition</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Plan 3: Industrial */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Industrial</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Multi-Truck / Multi-Branch</h3>
                <span className="text-xs text-slate-500 block">For commercial plants &amp; regional depots</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">₦550,000</div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  50% milestone deposit (₦275,000)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                For large high-speed bottling plants running 6+ delivery trucks and supplying multiple regional distribution points.
              </p>

              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Multi-branch and regional depot linking</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bank transfer auto-reconciliation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Custom website domain and on-site staff training</li>
              </ul>
            </div>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I run a large multi-truck water operation. I want to discuss the ₦550,000 Industrial Suite.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[48px] py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Contact Enterprise Desk</span>
            </a>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          7. TRUST & CREDIBILITY SECTION (CALM & PROFESSIONAL)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0B5FFF]" />
            <span>Trusted Commercial Partner</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Backed by Bethelmind Digital Solutions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-2">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">CAC Certified</span>
              <strong className="text-sm font-bold text-slate-900 block mt-1">Reg: 9912717</strong>
              <span className="text-[11px] text-slate-500">Registered Nigerian Enterprise</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Turnaround SLA</span>
              <strong className="text-sm font-bold text-slate-900 block mt-1">48-Hour Delivery</strong>
              <span className="text-[11px] text-slate-500">Live setup &amp; handover</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Local Support</span>
              <strong className="text-sm font-bold text-slate-900 block mt-1">WhatsApp &amp; Call</strong>
              <span className="text-[11px] text-slate-500">Direct technical help</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Zero-Risk Terms</span>
              <strong className="text-sm font-bold text-slate-900 block mt-1">50% Milestone</strong>
              <span className="text-[11px] text-slate-500">Balance only after sign-off</span>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          8. FREQUENTLY ASKED QUESTIONS (FAQ)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently asked questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Straightforward answers for water plant owners.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Does this software work on ordinary Android phones?',
              a: 'Yes. It is designed to work on any standard Android smartphone, tablet, or laptop. Your supervisors and drivers do not need expensive devices.'
            },
            {
              q: 'What if internet connection is slow or bad at the factory?',
              a: 'The system is built light and saves all shift data directly to the phone’s memory. If the network drops while your supervisor is typing, nothing is lost.'
            },
            {
              q: 'Can this replace QuickBooks for my water company?',
              a: 'Yes, and it works better because it understands sachet water. QuickBooks cannot track how many bags 1kg of nylon film produces, and it cannot audit driver road burst claims. This system does all of that specifically for water factories.'
            },
            {
              q: 'How does it stop drivers from stealing water?',
              a: 'Every morning, the system logs the bags loaded into each truck. In the evening, the driver must remit cash, verified credit sales, undamaged returned bags, and physical torn pouches. Any missing bags are automatically logged as shortages and debited from the driver’s balance.'
            },
            {
              q: 'How long does setup take, and when do I pay?',
              a: 'Setup takes 48 hours. You pay a 50% milestone deposit (₦140,000 for the Plant Edition) to begin configuration. The remaining 50% balance is paid ONLY after the system is live and tested at your factory.'
            }
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-[#0B5FFF] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {activeFaq === i && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          9. FINAL CALL TO ACTION SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#0B5FFF] to-[#0848c4] text-white px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to stop factory leaks and run your water business with confidence?
          </h2>

          <p className="text-xs sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Chat with our technical team on WhatsApp. We will show you how it works for your plant and get your system live in 48 hours.
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind Desk! I want to get started with the Obi Table Water operating system for my factory.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-extrabold shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat with Us on WhatsApp (0802 279 1227)</span>
            </a>
          </div>

          <span className="text-[11px] text-blue-200 block">
            Moniepoint Microfinance Bank &bull; Bethelmind Digital Solutions (CAC Reg: 9912717)
          </span>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          10. FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>
          Obi Table Water System &bull; Powered by Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
        </p>
        <p className="text-[11px] text-slate-400">
          Official Hotline: 0802 279 1227 &bull; Corporate Account: Moniepoint Microfinance Bank (6805375225)
        </p>
      </footer>

      {/* ──────────────────────────────────────────────────────────────────────────
          11. FLOATING WHATSAPP BUTTON (FIXED BOTTOM-RIGHT ON MOBILE, #25D366)
      ────────────────────────────────────────────────────────────────────────── */}
      <a
        href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind! I am on the Obi Table Water page and want to ask a question.')}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 sm:bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ring-4 ring-white/80"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>

      {/* ──────────────────────────────────────────────────────────────────────────
          12. STICKY MOBILE BOTTOM NAVIGATION BAR (Home · Features · Pricing · WhatsApp)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-bold text-slate-600 shadow-lg">
        <a href="#hero" className="flex flex-col items-center gap-0.5 text-[#0B5FFF]">
          <Droplets className="w-4 h-4" />
          <span>Home</span>
        </a>
        <a href="#features" className="flex flex-col items-center gap-0.5 hover:text-[#0B5FFF]">
          <Package className="w-4 h-4" />
          <span>Features</span>
        </a>
        <a href="#pricing" className="flex flex-col items-center gap-0.5 hover:text-[#0B5FFF]">
          <DollarSign className="w-4 h-4" />
          <span>Pricing</span>
        </a>
        <a
          href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I am viewing Obi Table Water on mobile.')}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-0.5 text-[#25D366]"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          13. INTERACTIVE LIVE SLIDERS DEMO MODAL (POP-UP WHEN USER WANTS TO PLAY)
      ────────────────────────────────────────────────────────────────────────── */}
      {showInteractiveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1220] text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            
            <button
              onClick={() => setShowInteractiveModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                Interactive Software Simulator
              </span>
              <h3 className="text-xl font-black text-white">
                Test the Obi Table Water Daily Shift Math
              </h3>
              <p className="text-xs text-slate-400">
                Adjust the sliders below to see production, driver shortages, diesel cost, and WhatsApp report recalculate instantly.
              </p>
            </div>

            {/* Slider 1: Production Bags */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Sachet Pure Water Bags Produced:</span>
                <strong className="text-cyan-300 font-mono text-sm">{demoBags.toLocaleString()} Bags</strong>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={demoBags}
                onChange={(e) => setDemoBags(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>500 Bags</span>
                <span>Wholesale: ₦{demoPrice}/bag</span>
                <span>10,000 Bags</span>
              </div>
            </div>

            {/* Slider 2: Driver Shortage */}
            <div className="p-4 rounded-xl bg-rose-500/[0.05] border border-rose-500/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-rose-300 font-semibold">Truck 2 (Musa) Unaccounted Shortage:</span>
                <strong className="text-rose-400 font-mono text-sm">-{demoTruckShortage} Bags (₦{(demoTruckShortage * demoPrice).toLocaleString()})</strong>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={5}
                value={demoTruckShortage}
                onChange={(e) => setDemoTruckShortage(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Automatically deducted from Musa&apos;s weekly payout ledger.
              </span>
            </div>

            {/* Slider 3: Generator Fuel */}
            <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-amber-300 font-semibold">Generator Diesel Consumed:</span>
                <strong className="text-amber-400 font-mono text-sm">{demoDieselLiters}L @ ₦{demoDieselPrice}/L</strong>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={demoDieselLiters}
                onChange={(e) => setDemoDieselLiters(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-bold text-amber-300 pt-1">
                <span>Total Fuel Cost: ₦{dieselCost.toLocaleString()}</span>
                <span>Energy Cost: ₦{energyCostPerBag} / bag</span>
              </div>
            </div>

            {/* Shift Result Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Estimated Net Shift Cash:</span>
                <strong className="text-2xl font-black text-white font-mono">₦{estimatedNetProfit.toLocaleString()}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedReport ? 'Copied!' : 'Copy WhatsApp Report'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowInteractiveModal(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Close Demo Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
