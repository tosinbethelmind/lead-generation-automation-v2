'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 OBI TABLE WATER OS — CONVERSION MASTER PRODUCT PAGE & FACTORY ENGINE
 * The WhatsApp-First Factory Operating System for Nigerian Sachet & Bottled Water Plants.
 * 
 * Target: Nigerian water factory owners producing 1,000–10,000+ sachet bags daily or running bottling plants with delivery trucks.
 * Primary Positioning: "Know your factory's daily profit before 8:00 PM."
 * 
 * Features:
 * - Pain-Aware Hero with single promise and primary WhatsApp pilot booking CTA
 * - Embedded 10-Second Interactive Shift Simulator (Production, Musa Shortage, Diesel Cost)
 * - "The 4 Hidden Leaks Bleeding Nigerian Water Factories" breakdown
 * - 6 Money-Saving Feature Outcomes (Material Yield, Waybills, Burst Rule, Diesel Slicer, NAFDAC Lab, 8 PM WhatsApp)
 * - Authentic Simulated 8:00 PM WhatsApp Shift Bubble with 1-click copy
 * - 3-Tier Transparent Commercial Pricing (Starter ₦35k, Plant ₦280k [Recommended], Industrial ₦550k)
 * - 14-Day Zero-Risk Factory Pilot Guarantee
 * - Full Nigerian Reality FAQ (Android, Offline Sync, QuickBooks, Burst Disputes, Supervisor Tampering)
 * - Fixed Mobile Bottom Navigation & Floating WhatsApp Button (#25D366)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
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
  Copy,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function ObiTableWaterProductPage() {
  const [showInteractiveModal, setShowInteractiveModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Embedded Interactive Live Demo State
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
  const shortageDebit = demoTruckShortage * demoPrice;
  const packagingAndLaborCost = demoBags * 28; // ₦28/bag packaging roll film + loaders
  const energyCostPerBag = (dieselCost / (demoBags || 1)).toFixed(2);
  const estimatedNetProfit = Math.round(shiftGross - dieselCost - packagingAndLaborCost);

  const generateWhatsAppSummary = () => {
    return `💧 *OBI TABLE WATER — DAILY EXECUTIVE SHIFT REPORT*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | Shift: Batch A
🏢 Factory: Obi Table & Sachet Water Plant
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏭 *1. PRODUCTION & NYLON AUDIT:*
• Sachet Water: ${demoBags.toLocaleString()} bags sealed (@ ₦${demoPrice}/bag)
• Theoretical Yield: ${demoBags.toLocaleString()} / ${demoBags.toLocaleString()} bags (100% Balanced ✅)
• Shift Factory Output Value: ₦${shiftGross.toLocaleString()}

🚚 *2. DRIVERS & ROUTE DISPATCH:*
• Truck 1 (Emeka): Loaded 850 bags | Remitted: ₦297,500 | Balanced ✅
• Truck 2 (Musa): Loaded 700 bags | 🚨 *SHORTAGE: -${demoTruckShortage} bags (₦${shortageDebit.toLocaleString()}) DEBITED*
• Truck 3 (Ibrahim): Loaded 600 bags | Remitted: ₦210,000 | Balanced ✅
• Factory Gate Walk-in Cash: ₦315,000 (Moniepoint POS Verified)

⚡ *3. GENERATOR & POWER SLICER:*
• Diesel Used: ${demoDieselLiters}L @ ₦${demoDieselPrice}/L = ₦${dieselCost.toLocaleString()}
• Fuel Cost per Bag: ₦${energyCostPerBag} / bag ✅

🔬 *4. NAFDAC WATER QUALITY:*
• Raw Borehole TDS: 185 ppm ➔ Permeate Treated TDS: 22 ppm (PASS ✅)
• Water pH: 7.2 (Neutral Drinking Standard)

💰 *5. SHIFT FINANCIAL RECONCILIATION:*
• Gross Shift Revenue: ₦${shiftGross.toLocaleString()}
• Net Cash Profit Today: ₦${estimatedNetProfit.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Status:* Tamper-proof audit logged on Obi Table Water OS.`;
  };

  const handleCopySummary = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generateWhatsAppSummary());
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0B5FFF]/20 selection:text-[#0B5FFF]">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          1. CLEAN TOP NAVIGATION (4 SIMPLE ITEMS + WHATSAPP HOTLINE)
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-md shadow-[#0B5FFF]/25">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#0F172A] tracking-tight block">
                Obi Table Water OS
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block leading-none">
                Water Factory Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Clean Menu */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#0B5FFF] transition">How It Works</a>
            <a href="#calculator" className="hover:text-[#0B5FFF] transition">Live Demo</a>
            <a href="#features" className="hover:text-[#0B5FFF] transition">Features</a>
            <a href="#pricing" className="hover:text-[#0B5FFF] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#0B5FFF] transition">FAQ</a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I run a water factory. I want to test the Obi Table Water operating system and book a 14-day plant pilot.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Start WhatsApp Demo</span>
            </a>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. HERO SECTION: "KNOW YOUR FACTORY'S DAILY PROFIT BEFORE 8:00 PM"
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-10 sm:pt-16 pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Small Nigerian Water Factory Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5FFF]/10 border border-[#0B5FFF]/20 text-[#0B5FFF] text-xs font-bold">
          <Droplets className="w-3.5 h-3.5 text-[#0B5FFF]" />
          <span>BUILT SPECIFICALLY FOR NIGERIAN SACHET &amp; TABLE WATER PLANTS</span>
        </div>

        {/* Clear Champion Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Know your factory’s daily profit <span className="text-[#0B5FFF]">before 8:00 PM.</span>
        </h1>

        {/* Subheadline in Plain Business Language */}
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The WhatsApp-first operating system that tracks machine production, stops driver delivery shortages, audits generator diesel, and calculates true net cash every evening. Runs on basic Android phones—no computer or accounting degree needed.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I run a water factory. I want to start a 14-day pilot for my plant.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-extrabold shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Start 14-Day Factory Pilot on WhatsApp</span>
          </a>

          <a
            href="#calculator"
            className="w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-[#0B5FFF]" />
            <span>Test Live Shift Calculator</span>
          </a>
        </div>

        {/* Sub-Hero Trust Ticker */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 48-Hour Live Plant Setup</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Works 100% Offline When Glo/MTN Drops</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Formatted for WhatsApp</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#0B5FFF]" /> CAC Reg: 9912717</span>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. EMBEDDED 10-SECOND INTERACTIVE SHIFT CALCULATOR
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="calculator" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B5FFF]/10 text-[#0B5FFF] text-[11px] font-black uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Shift Simulator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                See how your factory reconciles in 10 seconds
              </h2>
              <p className="text-xs text-slate-500">
                Move the sliders below to simulate today’s production, driver shortage, and diesel cost.
              </p>
            </div>

            <button
              onClick={handleCopySummary}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-[#0B5FFF]" />
              <span>{copiedReport ? 'Report Copied! ✅' : 'Copy WhatsApp Audit'}</span>
            </button>
          </div>

          {/* Interactive Sliders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Slider 1: Sachet Bags Sealed */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">1. Sachet Bags Sealed</span>
                <span className="text-sm font-black text-[#0B5FFF] font-mono">{demoBags.toLocaleString()} bags</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={demoBags}
                onChange={(e) => setDemoBags(Number(e.target.value))}
                className="w-full accent-[#0B5FFF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>500 bags</span>
                <span>8,000 bags</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Gross Value: <strong className="text-slate-800 font-mono">₦{(demoBags * demoPrice).toLocaleString()}</strong> (@ ₦{demoPrice}/bag)
              </div>
            </div>

            {/* Slider 2: Driver Shortage Missing */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800">2. Driver Shortage (Musa)</span>
                <span className="text-sm font-black text-rose-700 font-mono">-{demoTruckShortage} bags</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={demoTruckShortage}
                onChange={(e) => setDemoTruckShortage(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-rose-400 font-mono">
                <span>0 bags</span>
                <span>120 missing</span>
              </div>
              <div className="text-[11px] text-rose-600 font-semibold">
                Auto-Debited: <strong className="font-mono text-rose-700">-₦{shortageDebit.toLocaleString()}</strong> from payout
              </div>
            </div>

            {/* Slider 3: Diesel Litres Burned */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">3. Generator Diesel Used</span>
                <span className="text-sm font-black text-amber-700 font-mono">{demoDieselLiters} Litres</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={demoDieselLiters}
                onChange={(e) => setDemoDieselLiters(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-amber-500 font-mono">
                <span>10L</span>
                <span>150L</span>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Fuel Cost: <strong className="font-mono">₦{dieselCost.toLocaleString()}</strong> (₦{energyCostPerBag}/bag)
              </div>
            </div>

          </div>

          {/* Real-Time Outcome Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Shift Revenue</span>
              <strong className="text-lg font-black text-slate-900 font-mono block">₦{shiftGross.toLocaleString()}</strong>
              <span className="text-[10px] text-slate-500">{demoBags.toLocaleString()} bags sealed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">True Net Cash</span>
              <strong className="text-lg font-black text-emerald-700 font-mono block">₦{estimatedNetProfit.toLocaleString()}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">After diesel &amp; packaging</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Missing Recovered</span>
              <strong className="text-lg font-black text-rose-700 font-mono block">₦{shortageDebit.toLocaleString()}</strong>
              <span className="text-[10px] text-rose-600 font-semibold">Protected from loss</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Energy Overhead</span>
              <strong className="text-lg font-black text-blue-700 font-mono block">₦{energyCostPerBag}</strong>
              <span className="text-[10px] text-blue-600 font-semibold">Per bag fuel rate</span>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. THE 4 HIDDEN LEAKS BLEEDING NIGERIAN WATER FACTORIES
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-slate-900 text-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">The Reality On The Ground</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Why produce 4,000 bags daily if the bank balance doesn’t match?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Packaged water is a high-volume business, but four unmonitored leaks erase factory profits every week:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white">The &quot;Ghost Shift&quot; &amp; Stolen Film</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Operators run unrecorded night shifts using your diesel power, seal 500+ bags, sell to cart-pushers, and claim the sealing machine was broken.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white">The &quot;Bad Road Pothole&quot; Excuse</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drivers deliver 770 of 800 bags, pocket cash for 30 bags, and claim they burst on expressway potholes without presenting physical torn pouches.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Idle Generator Diesel Bleed</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your 40kVA generator burns ₦1,250/L diesel while packing staff take long breaks, pushing your actual energy cost above ₦40 per bag.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Uncontrolled Retailer Debt</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drivers drop 40 bags on credit with roadside kiosks without receipts. By month end, uncollected debts reach ₦500,000+ and shops deny it.
              </p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B5FFF]/20 to-[#00C2CB]/20 border border-[#0B5FFF]/40 text-center text-xs font-semibold text-blue-200">
            Obi Table Water OS eliminates all four leaks starting on your very first shift.
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. HOW IT WORKS (3 FRICTIONLESS STEPS)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Fast Implementation</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Obi OS goes live in your plant in 48 hours
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Zero downtime. We calibrate your factory parameters without interrupting production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B5FFF]/10 text-[#0B5FFF] font-black flex items-center justify-center text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Connect on WhatsApp (Day 1)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share your factory’s daily capacity, number of delivery vans, driver names, and wholesale bag prices with our technical team.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B5FFF]/10 text-[#0B5FFF] font-black flex items-center justify-center text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">48-Hour Plant Calibration (Day 2)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We configure your sealing machine ratios, truck route manifests, driver shortage rules, and automated 8:00 PM WhatsApp reporting triggers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Receive 8:00 PM Audits (Day 3+)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your floor supervisor takes 2 minutes at 6:00 PM to log closing bag numbers on their phone. You receive a verified executive P&L on WhatsApp wherever you are.
            </p>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. CORE FEATURE OUTCOMES (MONEY-SAVING & CONTROL FOCUS)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Financial Control</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            6 Ways Obi OS Protects Your Factory Profits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Practical tools built for Nigerian manufacturing conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Production Tracking */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B5FFF]/10 text-[#0B5FFF] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Production &amp; Nylon Yield Auditor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stop ghost shifts using proven grammage math: 1kg of printed LDPE film yields ~16 sachet bags. If 120kg film is consumed, the system expects 1,920 bags—flagging missing stock instantly.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-[#0B5FFF]">
              ✓ Auto-reconciles packaging roll grammage
            </div>
          </div>

          {/* Card 2: Delivery Van Route Waybills */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B5FFF] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delivery Van Shortage Shield</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stop driver shortages with proof, not end-of-day shouting matches. The system balances morning loading passes against cash remitted, verified credit, intact returns, and physical burst counts.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-[#0B5FFF]">
              ✓ Auto-debits missing bags from driver payouts
            </div>
          </div>

          {/* Card 3: Physical Proof-of-Burst Enforcement */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Physical Proof-of-Burst Rule</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminate fake pothole burst excuses. Drivers must physically present torn empty sachets to the gate supervisor to qualify for excused waivers; unreturned pouches are debited as shortages.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-rose-600">
              ✓ Requires physical torn sachet pouch inspection
            </div>
          </div>

          {/* Card 4: Generator Diesel vs Grid Energy Slicer */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Generator Diesel Cost Slicer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Know your exact energy overhead per bag down to the kobo. Tracks generator running hours against Disco grid tokens, showing you if fuel cost exceeds ₦28/bag so you stop idle generator burn.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-amber-700">
              ✓ Real-time energy cost per bag calculation
            </div>
          </div>

          {/* Card 5: NAFDAC Water Quality Compliance Station */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">NAFDAC Compliance Station</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pass unannounced NAFDAC, SON, and Ministry of Health factory audits without panic. Logs raw borehole vs treated permeate TDS (&lt;100 ppm) and pH with 1-click printable inspection certificates.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-teal-600">
              ✓ 1-Click printable laboratory sanitation log
            </div>
          </div>

          {/* Card 6: 8:00 PM WhatsApp Shift Summary */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">8:00 PM WhatsApp Shift Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Know your factory’s true net profit before 8:00 PM wherever you are. Receive a formatted WhatsApp audit detailing bags sealed, driver shortages, diesel consumed, and net cash in hand.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-[#25D366]">
              ✓ Delivered directly to your personal WhatsApp
            </div>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          7. THE VERIFIED 8:00 PM WHATSAPP AUDIT (SIMULATED PHONE BUBBLE)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-slate-100 border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">The 8:00 PM WhatsApp Experience</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              What lands on your phone every evening
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              No computer login or complex accounting dashboard needed. Just open WhatsApp:
            </p>
          </div>

          {/* WhatsApp Message Bubble Mockup */}
          <div className="bg-[#EFEAE2] p-4 sm:p-6 rounded-3xl shadow-lg border border-slate-300 max-w-xl mx-auto">
            <div className="bg-white rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-sm text-xs text-slate-800 space-y-2 font-sans border border-slate-200/60">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-extrabold text-[#0B5FFF]">Obi Table Water OS &bull; Daily Audit</span>
                <span className="text-[10px] text-slate-400">08:00 PM</span>
              </div>
              <p className="font-bold text-slate-900">💧 *OBI TABLE WATER — DAILY EXECUTIVE SHIFT REPORT*</p>
              <p className="text-slate-500 text-[11px]">📅 Today | Shift: Batch A | Factory: Obi Table &amp; Sachet Plant</p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">🏭 *1. PRODUCTION &amp; NYLON AUDIT:*</p>
                <p>• Sachet Water: 3,200 bags sealed (4 rolls / 120kg film)</p>
                <p>• Theoretical Yield: 3,200 / 3,200 bags (100% Balanced ✅)</p>
                <p>• Machine Sealing Burst: 22 bags (Within normal 1% tolerance)</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">🚚 *2. DRIVERS &amp; ROUTE DISPATCH:*</p>
                <p>• Truck 1 (Emeka): Loaded 850 bags | Remitted: ₦297,500 ✅</p>
                <p className="text-rose-600 font-bold">• Truck 2 (Musa): Loaded 700 bags | 🚨 SHORTAGE: -40 bags (₦14,000) DEBITED</p>
                <p>• Truck 3 (Ibrahim): Loaded 600 bags | Remitted: ₦210,000 ✅</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">⚡ *3. GENERATOR &amp; POWER SLICER:*</p>
                <p>• Generator Runtime: 5.5 hours (55L @ ₦1,250/L = ₦68,750)</p>
                <p className="font-bold text-emerald-700">• Energy Cost Per Sachet Bag: ₦21.40 / bag ✅ (Optimal)</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">💰 *4. SHIFT FINANCIAL RECONCILIATION:*</p>
                <p>• Gross Shift Output: ₦1,120,000</p>
                <p className="font-extrabold text-emerald-700 text-sm">💵 NET CASH PROFIT TODAY: ₦184,500</p>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 italic">
                ✓ Tamper-proof audit logged on Obi Table Water OS.
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#0B5FFF]" />
                <span>{copiedReport ? 'Report Copied! ✅' : 'Copy Sample WhatsApp Message'}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          8. 14-DAY ZERO-RISK FACTORY PILOT OFFER
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B5FFF]/10 via-white to-[#00C2CB]/10 border-2 border-[#0B5FFF]/30 shadow-lg space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B5FFF] text-white text-xs font-black uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>14-Day Zero-Risk Factory Pilot Guarantee</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 max-w-xl mx-auto">
            Test Obi Table Water OS for 14 Days. If it doesn’t catch driver shortages in week one, pay ₦0.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We understand Nigerian factory owners distrust software claims. We calibrate your plant in 48 hours. Your supervisors log shifts alongside their paper book. If the system fails to improve staff accountability and save money within 14 days, your setup deposit is refunded in full.
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I want to activate the 14-day zero-risk factory pilot for my plant.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 px-6 py-3 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-black shadow-md transition cursor-pointer"
            >
              <span>Claim 14-Day Pilot on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          9. PRICING SECTION: 3 CLEAN CARDS (PLANT RECOMMENDED)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Clear Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Simple, honest pricing in Naira
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No foreign currency charges. Choose the tier that matches your plant setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: Starter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Starter Depot</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Single Sales Depot</h3>
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
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Daily cash &amp; transfer record</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp sales catalogue</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Direct phone support</li>
              </ul>
            </div>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I want to activate the ₦35,000 Starter Depot Edition.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[48px] py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
            </a>
          </div>

          {/* Plan 2: Plant Edition (RECOMMENDED) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#0B5FFF] shadow-xl relative flex flex-col justify-between space-y-5 md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0B5FFF] text-white text-[10px] font-black uppercase tracking-wider shadow">
              Recommended for Water Factories
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#0B5FFF] uppercase tracking-wider block">Plant Edition</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Full Water Factory</h3>
                <span className="text-xs text-slate-500 block">For active sachet &amp; bottling factories (1–5 trucks)</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">₦280,000</div>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  50% milestone deposit (₦140,000) to begin setup; 50% balance paid ONLY after live testing at your factory.
                </span>
                <span className="text-xs font-bold text-[#0B5FFF] block mt-1">+ ₦15,000 / month (Cloud &amp; WhatsApp Sync)</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Complete factory management: production counters, delivery truck shortage audits, diesel costing, and daily WhatsApp reports.
              </p>

              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Sachet &amp; bottle production tracking</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Nylon film yield &amp; theoretical bag auditor</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Multi-truck waybills &amp; driver shortages</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0B5FFF]" /> Physical proof-of-burst validation rule</li>
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
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Industrial Suite</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Multi-Truck / Multi-Branch</h3>
                <span className="text-xs text-slate-500 block">For commercial plants &amp; regional depots</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">₦550,000</div>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  50% milestone deposit (₦275,000)
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-1">+ ₦35,000 / month</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                For large high-speed bottling plants running 6+ delivery trucks and supplying multiple regional distribution points.
              </p>

              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Multi-branch and regional depot linking</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bank transfer auto-reconciliation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Custom domain &amp; on-site staff training</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Priority 24/7 technical lead support</li>
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

        <div className="text-center text-xs text-slate-500 pt-2">
          Official Corporate Settlement: <strong>Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions, CAC Reg: 9912717)</strong>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          10. FREQUENTLY ASKED QUESTIONS (FAQ)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B5FFF]">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently asked questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Straightforward answers for Nigerian water plant owners.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Does this software require my supervisors to have expensive computers?',
              a: 'No. The system is designed mobile-first. Your supervisor only needs an ordinary Android smartphone. The interface features large numerical buttons (+50, +100, +500) and simple fields so shift closing takes less than 2 minutes.'
            },
            {
              q: 'What happens when internet connection drops at the factory?',
              a: 'The application functions offline. It saves all shift inputs directly to the phone’s internal memory. Even if Glo, MTN, or Airtel network drops while your supervisor is typing, nothing is lost. The data syncs automatically once connectivity returns.'
            },
            {
              q: 'Why can’t I just keep using QuickBooks or Excel spreadsheets?',
              a: 'QuickBooks was built for foreign retail stores, not Nigerian water plants. QuickBooks cannot calculate how many bags a 30kg roll of printed film should yield. QuickBooks cannot audit delivery truck drivers returning with physical torn sachets vs missing bags. QuickBooks charges expensive monthly fees in US Dollars and requires an accountant to operate. Obi Table Water OS is built specifically for Nigerian water factory conditions.'
            },
            {
              q: 'How does the system stop drivers from claiming fake pothole bursts?',
              a: 'The system enforces the Physical Sachet Return Rule. An excused burst requires the driver to return the physical torn empty sachets to the loading bay supervisor. If a driver claims 40 bags burst but cannot produce the empty pouches, the system marks the discrepancy as an unverified driver shortage and debits it from their weekly commission.'
            },
            {
              q: 'What if my supervisor or staff tries to change figures to hide shortages?',
              a: 'The system maintains a secure, tamper-proof audit log. Once a shift is closed, changes cannot be made without triggering an alert on the owner’s WhatsApp summary. Every entry carries an unalterable timestamp.'
            },
            {
              q: 'How long does setup take, and when do I pay?',
              a: 'Setup takes exactly 48 hours. You pay a 50% milestone deposit (₦140,000 for the Plant Edition) directly into our corporate Moniepoint account to begin configuration. The remaining 50% balance is paid ONLY after the system is live and tested at your factory.'
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
          11. FINAL CALL TO ACTION SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#0B5FFF] to-[#0848c4] text-white px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to stop factory cash leaks and take control of your water business?
          </h2>

          <p className="text-xs sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Chat with our technical team on WhatsApp right now. We will review your plant capacity and schedule your 48-hour live setup.
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind Desk! I want to get started with the Obi Table Water operating system for my factory.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[50px] items-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-extrabold shadow-xl hover:shadow-2xl transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp with Technical Lead (0802 279 1227)</span>
            </a>
          </div>

          <span className="text-[11px] text-blue-200 block">
            Moniepoint Microfinance Bank &bull; Bethelmind Digital Solutions (CAC Reg: 9912717)
          </span>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          12. FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>
          Obi Table Water OS &bull; Powered by Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
        </p>
        <p className="text-[11px] text-slate-400">
          Official Hotline: 0802 279 1227 &bull; Corporate Account: Moniepoint Microfinance Bank (6805375225)
        </p>
      </footer>

      {/* ──────────────────────────────────────────────────────────────────────────
          13. FLOATING WHATSAPP BUTTON (FIXED BOTTOM-RIGHT ON MOBILE, #25D366)
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
          14. STICKY MOBILE BOTTOM NAVIGATION BAR (Home · Features · Pricing · WhatsApp)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-bold text-slate-600 shadow-lg">
        <a href="#hero" className="flex flex-col items-center gap-0.5 text-[#0B5FFF]">
          <Droplets className="w-4 h-4" />
          <span>Home</span>
        </a>
        <a href="#calculator" className="flex flex-col items-center gap-0.5 hover:text-[#0B5FFF]">
          <Sliders className="w-4 h-4" />
          <span>Calculator</span>
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

    </div>
  );
}
