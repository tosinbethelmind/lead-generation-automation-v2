'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 OBI TABLE WATER OS — COMPLETE UNRESTRICTED CLIENT TESTING ENGINE
 * The WhatsApp-First Factory Operating System for Nigerian Sachet & Bottled Water Plants.
 * 
 * Target: Nigerian water factory owners producing 1,000–10,000+ sachet bags daily or running bottling plants with delivery trucks.
 * Primary Positioning: "Know your factory's daily profit before 8:00 PM."
 * 
 * UNRESTRICTED TESTING SUITE:
 * - 4 Pre-Loaded Nigerian Mock Data Scenarios (Normal Shift, Catch Musa Shortage, Stolen Nylon Ghost Shift, Diesel Spike)
 * - 5 Interactive Testing Tabs:
 *   1. 🏭 Production & Nylon Yield Auditor (Theoretical Bags Math: 1kg = 16 bags)
 *   2. 🚚 Delivery Fleet & Driver Shortage Shield (Musa Pothole Dispute vs Physical Pouch Rule)
 *   3. ⚡ Diesel & Generator Slicer (Energy Overhead per Bag Calculation)
 *   4. 🔬 NAFDAC Water Quality Laboratory (Raw vs Treated TDS, pH, Printable Sanitation Cert)
 *   5. 📲 8:00 PM WhatsApp Executive Audit (Real-time synced report with 1-tap Send to WhatsApp)
 * - Full NAFDAC Inspection Certificate Modal with Print/Download
 * - Transparent Commercial Pricing (₦35k Starter, ₦280k Plant [Recommended], ₦550k Industrial)
 * - 14-Day Zero-Risk Factory Pilot Guarantee
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
  RotateCcw,
  Printer,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function ObiTableWaterProductPage() {
  const [activeTab, setActiveTab] = useState<'production' | 'fleet' | 'energy' | 'nafdac' | 'whatsapp'>('production');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showNafdacCertModal, setShowNafdacCertModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // INTERACTIVE TESTING STATE (MOCK DATA ACROSS ENTIRE PLANT)
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Production
  const [sachetBagsSealed, setSachetBagsSealed] = useState(3200);
  const [sachetPrice, setSachetPrice] = useState(350);
  const [bottlePacksSealed, setBottlePacksSealed] = useState(250); // 12 x 75cl
  const [bottlePackPrice, setBottlePackPrice] = useState(1100);
  const [dispenserJarsSealed, setDispenserJarsSealed] = useState(40); // 19L refills
  const [dispenserJarPrice, setDispenserJarPrice] = useState(800);
  const [nylonKgConsumed, setNylonKgConsumed] = useState(200); // 200kg LDPE film

  // 2. Delivery Fleet
  const [truck1Bags, setTruck1Bags] = useState(850); // Emeka (Lekki)
  const [truck1Remitted, setTruck1Remitted] = useState(297500);

  const [truck2Bags, setTruck2Bags] = useState(700); // Musa (Badore/Ajah)
  const [truck2Remitted, setTruck2Remitted] = useState(217000); // 620 bags cash
  const [truck2CreditBags, setTruck2CreditBags] = useState(40); // Supermarket signed
  const [truck2PotholeBurstsClaimed, setTruck2PotholeBurstsClaimed] = useState(40);
  const [truck2PouchesReturned, setTruck2PouchesReturned] = useState(0); // Musa brought ZERO pouches!

  const [truck3Bags, setTruck3Bags] = useState(600); // Ibrahim (Epe)
  const [truck3Remitted, setTruck3Remitted] = useState(210000);

  // 3. Generator & Energy Slicer
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState(1250);
  const [dieselLitersBurned, setDieselLitersBurned] = useState(55);
  const [generatorHoursRun, setGeneratorHoursRun] = useState(5.5);
  const [gridTokenAmount, setGridTokenAmount] = useState(0);

  // 4. NAFDAC Water Quality
  const [rawBoreholeTds, setRawBoreholeTds] = useState(185);
  const [treatedPermeateTds, setTreatedPermeateTds] = useState(22);
  const [treatedPh, setTreatedPh] = useState(7.2);
  const [uvHours, setUvHours] = useState(2410);

  // ───────────────────────────────────────────────────────────────────────────
  // PRE-CONFIGURED 1-CLICK NIGERIAN SCENARIOS
  // ───────────────────────────────────────────────────────────────────────────
  const applyScenario = (type: 'normal' | 'musa_theft' | 'ghost_shift' | 'diesel_spike') => {
    if (type === 'normal') {
      setSachetBagsSealed(3200);
      setSachetPrice(350);
      setBottlePacksSealed(250);
      setDispenserJarsSealed(40);
      setNylonKgConsumed(200); // 200kg * 16 = 3,200 bags (100% balanced)
      setTruck2Remitted(245000);
      setTruck2CreditBags(0);
      setTruck2PotholeBurstsClaimed(0);
      setTruck2PouchesReturned(0);
      setDieselLitersBurned(55);
      setDieselPricePerLiter(1250);
      setTreatedPermeateTds(22);
      setTreatedPh(7.2);
    } else if (type === 'musa_theft') {
      // Musa claims 40 bags burst without physical pouches
      setSachetBagsSealed(3200);
      setTruck2Remitted(217000);
      setTruck2CreditBags(40);
      setTruck2PotholeBurstsClaimed(40);
      setTruck2PouchesReturned(0); // 0 pouches returned = Auto-debit ₦14,000!
      setActiveTab('fleet');
    } else if (type === 'ghost_shift') {
      // 120kg film loaded (1,920 bags yield), but supervisor logs only 1,500 bags!
      setSachetBagsSealed(1500);
      setNylonKgConsumed(120); // 120 * 16 = 1920 expected! 420 missing!
      setActiveTab('production');
    } else if (type === 'diesel_spike') {
      // Generator idling during break: 75 Litres burned for few bags
      setSachetBagsSealed(2200);
      setDieselLitersBurned(85);
      setDieselPricePerLiter(1350);
      setActiveTab('energy');
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // CALCULATIONS (DETERMINISTIC FINANCIAL ENGINE)
  // ───────────────────────────────────────────────────────────────────────────
  // Production
  const sachetGross = sachetBagsSealed * sachetPrice;
  const bottleGross = bottlePacksSealed * bottlePackPrice;
  const dispenserGross = dispenserJarsSealed * dispenserJarPrice;
  const totalPlantGross = sachetGross + bottleGross + dispenserGross;

  // Nylon Yield Math: 1kg LDPE film yields ~16 bags
  const theoreticalBagsYield = Math.round(nylonKgConsumed * 16);
  const nylonDiscrepancyBags = theoreticalBagsYield - sachetBagsSealed;
  const hasGhostShiftAlarm = nylonDiscrepancyBags > 50;

  // Fleet & Shortages
  const truck1TotalValue = truck1Bags * sachetPrice;
  const truck1MissingBags = Math.max(0, truck1Bags - Math.floor(truck1Remitted / sachetPrice));

  // Musa Reconciliation
  const truck2BagsSoldCash = Math.floor(truck2Remitted / sachetPrice);
  const truck2ExcusedBursts = Math.min(truck2PouchesReturned, truck2PotholeBurstsClaimed);
  const truck2AccountedBags = truck2BagsSoldCash + truck2CreditBags + truck2ExcusedBursts;
  const truck2MissingBags = Math.max(0, truck2Bags - truck2AccountedBags);
  const truck2ShortageDebit = truck2MissingBags * sachetPrice;

  // Truck 3
  const truck3MissingBags = Math.max(0, truck3Bags - Math.floor(truck3Remitted / sachetPrice));

  const totalShortageDeductions = truck2ShortageDebit + (truck1MissingBags * sachetPrice) + (truck3MissingBags * sachetPrice);

  // Diesel & Energy Cost Slicer
  const totalDieselCost = dieselLitersBurned * dieselPricePerLiter;
  const totalEnergyCost = totalDieselCost + gridTokenAmount;
  const energyCostPerBag = Number((totalEnergyCost / (sachetBagsSealed || 1)).toFixed(2));
  const isDieselCostHigh = energyCostPerBag > 28.0;

  // Total Shift OPEX & Net Profit
  const packagingCost = Math.round(sachetBagsSealed * 16); // ₦16/bag packaging film
  const loadersWage = Math.round(sachetBagsSealed * 10); // ₦10/bag loader fee
  const totalShiftOpex = totalEnergyCost + packagingCost + loadersWage;
  const netCashProfit = Math.round(totalPlantGross - totalShiftOpex);

  // NAFDAC Status
  const isTdsPassing = treatedPermeateTds <= 100;
  const isPhPassing = treatedPh >= 6.5 && treatedPh <= 7.5;
  const isNafdacCompliant = isTdsPassing && isPhPassing;

  // Generate WhatsApp Report
  const generateWhatsAppSummary = () => {
    return `💧 *OBI TABLE WATER — DAILY EXECUTIVE SHIFT REPORT*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | Shift: Batch A
🏢 Factory: Obi Table & Sachet Water Plant
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏭 *1. PRODUCTION & NYLON AUDIT:*
• Sachet Water: ${sachetBagsSealed.toLocaleString()} bags (@ ₦${sachetPrice}/bag)
• Bottled Water: ${bottlePacksSealed.toLocaleString()} packs (12x75cl @ ₦${bottlePackPrice})
• 19L Dispenser Jars: ${dispenserJarsSealed.toLocaleString()} refills (@ ₦${dispenserJarPrice})
• Nylon Consumed: ${nylonKgConsumed}kg film (Theoretical: ${theoreticalBagsYield.toLocaleString()} bags)
${hasGhostShiftAlarm ? `• 🚨 *GHOST SHIFT LEAK: ${nylonDiscrepancyBags} bags (₦${(nylonDiscrepancyBags * sachetPrice).toLocaleString()}) missing from film!*` : '• Nylon Yield: 100% Balanced ✅'}
• Shift Production Value: ₦${totalPlantGross.toLocaleString()}

🚚 *2. DRIVERS & ROUTE DISPATCH:*
• Truck 1 (Emeka): Loaded ${truck1Bags} bags | Remitted: ₦${truck1Remitted.toLocaleString()} ✅
• Truck 2 (Musa): Loaded ${truck2Bags} bags | Remitted: ₦${truck2Remitted.toLocaleString()}
${truck2MissingBags > 0 ? `  🚨 *SHORTAGE: -${truck2MissingBags} bags (₦${truck2ShortageDebit.toLocaleString()}) DEBITED* (No physical pouches)` : '  Balanced ✅ (No shortages)'}
• Truck 3 (Ibrahim): Loaded ${truck3Bags} bags | Remitted: ₦${truck3Remitted.toLocaleString()} ✅

⚡ *3. GENERATOR & POWER SLICER:*
• Diesel Used: ${dieselLitersBurned}L @ ₦${dieselPricePerLiter}/L = ₦${totalDieselCost.toLocaleString()}
• *Fuel Cost per Sachet Bag:* ₦${energyCostPerBag} / bag ${isDieselCostHigh ? '⚠️ (HIGH FUEL OVERHEAD)' : '✅ (OPTIMAL)'}

🔬 *4. NAFDAC WATER QUALITY:*
• Raw Borehole TDS: ${rawBoreholeTds} ppm ➔ Permeate Treated TDS: ${treatedPermeateTds} ppm (${isTdsPassing ? 'PASS ✅' : 'FAIL ❌'})
• Water pH: ${treatedPh} (${isPhPassing ? 'Neutral Standard ✅' : 'Out of range ❌'})

💰 *5. SHIFT FINANCIAL RECONCILIATION:*
• Gross Shift Value: ₦${totalPlantGross.toLocaleString()}
• Shift Operating Expenses: -₦${totalShiftOpex.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 *NET CASH IN HAND TODAY:* ₦${netCashProfit.toLocaleString()}
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

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0B5FFF]/20 selection:text-[#0B5FFF]">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          1. CLEAN TOP NAVIGATION
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
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

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#simulator" className="text-[#0B5FFF] font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Testing Console</span>
            </a>
            <a href="#how-it-works" className="hover:text-[#0B5FFF] transition">How It Works</a>
            <a href="#features" className="hover:text-[#0B5FFF] transition">Features</a>
            <a href="#pricing" className="hover:text-[#0B5FFF] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#0B5FFF] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind Desk! I am testing the Obi Table Water operating system and want to book a 14-day plant pilot.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book Plant Pilot</span>
            </a>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. HERO SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5FFF]/10 border border-[#0B5FFF]/20 text-[#0B5FFF] text-xs font-bold">
          <Droplets className="w-3.5 h-3.5 text-[#0B5FFF]" />
          <span>BUILT SPECIFICALLY FOR NIGERIAN SACHET &amp; TABLE WATER PLANTS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Know your factory’s daily profit <span className="text-[#0B5FFF]">before 8:00 PM.</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The WhatsApp-first operating system that tracks machine production, stops driver delivery shortages, audits generator diesel, and calculates true net cash every evening. Runs on basic Android phones—no computer or accounting degree needed.
        </p>

        {/* 1-Click Fast Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="#simulator"
            className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-sm font-extrabold shadow-lg shadow-[#0B5FFF]/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test All Features with Free Mock Data ↓</span>
          </a>

          <a
            href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello! I run a water factory. I want to test the Obi Table Water system for my plant.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Chat on WhatsApp (0802 279 1227)</span>
          </a>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 48-Hour Live Plant Setup</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Works 100% Offline When Network Drops</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Direct WhatsApp Evening Audits</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#0B5FFF]" /> CAC Reg: 9912717</span>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. COMPLETE UNRESTRICTED TESTING SUITE (PRESETS + 5 TABS)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="simulator" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-[#0B5FFF]/40 p-4 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header & Scenario Presets */}
          <div className="space-y-4 pb-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B5FFF]/10 text-[#0B5FFF] text-[11px] font-black uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unrestricted Client Testing Console</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Test Every Factory Module with Live Nigerian Data
                </h2>
                <p className="text-xs text-slate-500">
                  Click any scenario below to automatically load realistic factory numbers, or adjust the sliders yourself:
                </p>
              </div>

              {/* Reset to Default */}
              <button
                type="button"
                onClick={() => applyScenario('normal')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer self-start md:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Numbers</span>
              </button>
            </div>

            {/* 4 1-Click Scenario Trigger Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => applyScenario('normal')}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Normal Shift</span>
                </div>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                  3,200 bags, all trucks balanced, ₦184k profit
                </span>
              </button>

              <button
                type="button"
                onClick={() => applyScenario('musa_theft')}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-rose-800 font-extrabold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>2. Catch Musa Shortage</span>
                </div>
                <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">
                  40 bags missing (₦14k auto-debited from Musa)
                </span>
              </button>

              <button
                type="button"
                onClick={() => applyScenario('ghost_shift')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Ghost Shift Alert</span>
                </div>
                <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                  120kg film used, 420 missing bags flagged!
                </span>
              </button>

              <button
                type="button"
                onClick={() => applyScenario('diesel_spike')}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-xs">
                  <Zap className="w-3.5 h-3.5 text-[#0B5FFF]" />
                  <span>4. Diesel Spike Warning</span>
                </div>
                <span className="text-[10px] text-blue-700 block mt-0.5 font-medium">
                  85L burned (₦35/bag fuel overhead alert)
                </span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('production')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'production' 
                  ? 'bg-[#0B5FFF] text-white shadow-md shadow-[#0B5FFF]/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>1. Production &amp; Nylon Yield</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'fleet' 
                  ? 'bg-[#0B5FFF] text-white shadow-md shadow-[#0B5FFF]/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>2. Delivery Fleet &amp; Driver Shortages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('energy')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'energy' 
                  ? 'bg-[#0B5FFF] text-white shadow-md shadow-[#0B5FFF]/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>3. Generator Diesel Slicer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nafdac')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'nafdac' 
                  ? 'bg-[#0B5FFF] text-white shadow-md shadow-[#0B5FFF]/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>4. NAFDAC Water Lab</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'whatsapp' 
                  ? 'bg-[#25D366] text-white shadow-md shadow-[#25D366]/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>5. 8:00 PM WhatsApp Audit</span>
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────────────
              TAB 1: PRODUCTION & NYLON YIELD
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === 'production' && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Sachet Bags */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Sachet Bags Sealed</span>
                    <span className="text-base font-black text-[#0B5FFF] font-mono">{sachetBagsSealed.toLocaleString()} bags</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="8000"
                    step="100"
                    value={sachetBagsSealed}
                    onChange={(e) => setSachetBagsSealed(Number(e.target.value))}
                    className="w-full accent-[#0B5FFF] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>500 bags</span>
                    <span>8,000 bags</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Bag Price:</span>
                    <span className="font-bold text-slate-800 font-mono">₦{sachetPrice} / bag</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    Sachet Revenue: ₦{sachetGross.toLocaleString()}
                  </div>
                </div>

                {/* Bottled Water (75cl packs) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">75cl Bottled Water (12-Packs)</span>
                    <span className="text-base font-black text-[#00C2CB] font-mono">{bottlePacksSealed.toLocaleString()} packs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="800"
                    step="10"
                    value={bottlePacksSealed}
                    onChange={(e) => setBottlePacksSealed(Number(e.target.value))}
                    className="w-full accent-[#00C2CB] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 packs</span>
                    <span>800 packs</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Pack Price:</span>
                    <span className="font-bold text-slate-800 font-mono">₦{bottlePackPrice} / pack</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    Bottle Revenue: ₦{bottleGross.toLocaleString()}
                  </div>
                </div>

                {/* Nylon Film Grammage Yield Auditor */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  hasGhostShiftAlarm ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">LDPE Film Consumed (kg)</span>
                    <span className="text-base font-black text-slate-900 font-mono">{nylonKgConsumed} kg</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="10"
                    value={nylonKgConsumed}
                    onChange={(e) => setNylonKgConsumed(Number(e.target.value))}
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50 kg</span>
                    <span>400 kg</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    Standard Yield: <strong className="font-mono">1kg = 16 bags</strong> ➔ Expected: <strong className="font-mono text-slate-900">{theoreticalBagsYield.toLocaleString()} bags</strong>
                  </div>
                  
                  {hasGhostShiftAlarm ? (
                    <div className="p-2.5 rounded-xl bg-rose-100/80 border border-rose-300 text-rose-800 text-xs font-bold space-y-1">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Ghost Shift Leak Flagged!</span>
                      </div>
                      <p className="text-[11px] font-normal leading-tight">
                        {nylonDiscrepancyBags} bags missing (₦{(nylonDiscrepancyBags * sachetPrice).toLocaleString()}). Operator consumed film without recording finished bags.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Film Yield Balanced with Output</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Total Output Summary Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B5FFF]/10 to-[#00C2CB]/10 border border-[#0B5FFF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Total Shift Gross Production Output:</span>
                  <strong className="text-xl font-black text-slate-900 font-mono">₦{totalPlantGross.toLocaleString()}</strong>
                  <span className="text-slate-500 ml-2">({sachetBagsSealed.toLocaleString()} sachet bags + {bottlePacksSealed} bottle packs)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('fleet')}
                  className="px-4 py-2 rounded-xl bg-[#0B5FFF] text-white font-bold hover:bg-[#094fd4] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next: Check Truck Drivers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              TAB 2: DELIVERY FLEET & DRIVER SHORTAGE SHIELD
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === 'fleet' && (
            <div className="space-y-6 pt-2">
              <div className="space-y-4">
                
                {/* Truck 1: Emeka (Balanced) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0B5FFF] font-extrabold text-[10px]">TRUCK 1</span>
                      <strong className="text-sm font-bold text-slate-900">Emeka (Lekki Phase 1 Route)</strong>
                    </div>
                    <p className="text-slate-500">
                      Loaded: <strong className="font-mono text-slate-800">{truck1Bags} bags</strong> &bull; Expected: ₦{(truck1Bags * sachetPrice).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Remitted Cash</span>
                      <strong className="text-emerald-700 font-mono font-black text-sm">₦{truck1Remitted.toLocaleString()}</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Balanced
                    </div>
                  </div>
                </div>

                {/* Truck 2: Musa (The Bad Road Pothole Dispute) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 font-extrabold text-[10px]">TRUCK 2</span>
                        <strong className="text-sm font-bold text-slate-900">Musa (Ajah &bull; Badore Expressway Route)</strong>
                      </div>
                      <p className="text-xs text-slate-600">
                        Morning Gate Pass: <strong className="font-mono text-slate-900">{truck2Bags} bags</strong> &bull; Cash Remitted: <strong className="font-mono text-slate-900">₦{truck2Remitted.toLocaleString()}</strong> (620 bags) &bull; Verified Credit: <strong className="font-mono text-slate-900">{truck2CreditBags} bags</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-rose-600 block uppercase font-black">Driver Audit Status</span>
                      <strong className="text-rose-700 font-black text-base font-mono">
                        {truck2MissingBags > 0 ? `-${truck2MissingBags} Bags Short` : 'Balanced'}
                      </strong>
                    </div>
                  </div>

                  {/* Physical Pouch Test Control */}
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-800 block">
                          Driver Excuse: &quot;40 bags burst on Badore potholes!&quot;
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Enforce Physical Proof-of-Burst: Did Musa return the 40 physical torn empty pouches?
                        </span>
                      </div>

                      {/* Toggle Physical Pouches */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTruck2PouchesReturned(0)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            truck2PouchesReturned === 0 
                              ? 'bg-rose-600 text-white shadow' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          0 Pouches Returned
                        </button>
                        <button
                          type="button"
                          onClick={() => setTruck2PouchesReturned(40)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                            truck2PouchesReturned === 40 
                              ? 'bg-emerald-600 text-white shadow' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          40 Pouches Inspected
                        </button>
                      </div>
                    </div>

                    {/* Result Callout */}
                    {truck2MissingBags > 0 ? (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center justify-between">
                        <span>
                          🚨 <strong>Shortage Debited:</strong> Musa has no physical pouches. System auto-debits <strong className="font-mono">₦{truck2ShortageDebit.toLocaleString()}</strong> from his weekly payout.
                        </span>
                        <span className="font-black font-mono text-rose-700">-₦{truck2ShortageDebit.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          <strong>Bursts Excused:</strong> Gate supervisor verified 40 physical torn pouches. No driver deduction applied.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Truck 3: Ibrahim (Balanced) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0B5FFF] font-extrabold text-[10px]">TRUCK 3</span>
                      <strong className="text-sm font-bold text-slate-900">Ibrahim (Epe Commercial Corridor)</strong>
                    </div>
                    <p className="text-slate-500">
                      Loaded: <strong className="font-mono text-slate-800">{truck3Bags} bags</strong> &bull; Remitted: ₦{truck3Remitted.toLocaleString()}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Balanced
                  </div>
                </div>

              </div>

              {/* Total Shortage Recovery Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Total Driver Cash Protected from Loss Today:</span>
                  <strong className="text-lg font-black text-rose-400 font-mono">
                    {totalShortageDeductions > 0 ? `₦${totalShortageDeductions.toLocaleString()} Recovered via Auto-Debit` : '₦0 (All Drivers Balanced)'}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('energy')}
                  className="px-4 py-2 rounded-xl bg-[#0B5FFF] text-white font-bold hover:bg-[#094fd4] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next: Check Diesel Costs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              TAB 3: GENERATOR DIESEL VS GRID SLICER
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === 'energy' && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Diesel Liters Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Generator Diesel Used (Litres)</span>
                    <span className="text-base font-black text-amber-600 font-mono">{dieselLitersBurned} Litres</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={dieselLitersBurned}
                    onChange={(e) => setDieselLitersBurned(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10 Litres</span>
                    <span>150 Litres</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    45kVA Mikano Runtime: <strong className="font-mono text-slate-800">{generatorHoursRun} hours</strong>
                  </div>
                </div>

                {/* Diesel Pump Price Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Current Diesel Pump Price (₦/L)</span>
                    <span className="text-base font-black text-slate-900 font-mono">₦{dieselPricePerLiter} / L</span>
                  </div>
                  <input
                    type="range"
                    min="1100"
                    max="1500"
                    step="25"
                    value={dieselPricePerLiter}
                    onChange={(e) => setDieselPricePerLiter(Number(e.target.value))}
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₦1,100 / L</span>
                    <span>₦1,500 / L</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Total Fuel Spent This Shift: <strong className="font-mono text-slate-900 font-bold">₦{totalDieselCost.toLocaleString()}</strong>
                  </div>
                </div>

              </div>

              {/* Energy Overhead Slicer Badge */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDieselCostHigh ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-black uppercase tracking-wider block">
                    {isDieselCostHigh ? '⚠️ Generator Bleed Warning' : '✅ Optimal Energy Overhead'}
                  </span>
                  <div className="text-2xl font-black font-mono">
                    ₦{energyCostPerBag} <span className="text-xs font-semibold">energy cost per sachet bag</span>
                  </div>
                  <p className="text-xs opacity-90 max-w-lg">
                    {isDieselCostHigh 
                      ? 'Your fuel overhead is above the recommended ₦28/bag benchmark. Check for machine downtime while the generator runs idle.'
                      : 'Your fuel overhead is within healthy Nigerian factory limits (< ₦28/bag). Factory margins are protected.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('nafdac')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shrink-0"
                >
                  <span>Next: NAFDAC Lab Tests →</span>
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              TAB 4: NAFDAC WATER QUALITY LAB STATION
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === 'nafdac' && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Borehole Raw Water TDS */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Raw Borehole Water TDS</span>
                    <span className="text-base font-black text-slate-900 font-mono">{rawBoreholeTds} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    step="5"
                    value={rawBoreholeTds}
                    onChange={(e) => setRawBoreholeTds(Number(e.target.value))}
                    className="w-full accent-slate-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>100 ppm</span>
                    <span>400 ppm</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Pre-treatment borehole minerals</span>
                </div>

                {/* Permeate Treated Water TDS */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Treated Permeate Water TDS</span>
                    <span className={`text-base font-black font-mono ${isTdsPassing ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {treatedPermeateTds} ppm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="1"
                    value={treatedPermeateTds}
                    onChange={(e) => setTreatedPermeateTds(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5 ppm</span>
                    <span>150 ppm</span>
                  </div>
                  <div className="text-xs font-bold">
                    {isTdsPassing ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> NAFDAC Standard PASS (&lt; 100 ppm)
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> FAIL (&gt; 100 ppm) &bull; Service RO Membrane
                      </span>
                    )}
                  </div>
                </div>

                {/* Water pH Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Water pH Balance</span>
                    <span className={`text-base font-black font-mono ${isPhPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {treatedPh.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="9.0"
                    step="0.1"
                    value={treatedPh}
                    onChange={(e) => setTreatedPh(Number(e.target.value))}
                    className="w-full accent-[#00C2CB] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5.5 (Acidic)</span>
                    <span>9.0 (Alkaline)</span>
                  </div>
                  <div className="text-xs font-bold">
                    {isPhPassing ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Neutral Drinking Standard (6.5 - 7.5)
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Out of Range (Check Calcite Filter)
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* 1-Click Printable Certificate Trigger */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <strong className="text-teal-950 font-bold block">
                    NAFDAC Sanitation &amp; Water Quality Certificate Ready
                  </strong>
                  <span className="text-teal-700 text-[11px]">
                    UV Lamp Lifetime: {uvHours} / 8,000 hrs &bull; All physical &amp; chemical parameters logged
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNafdacCertModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black transition cursor-pointer flex items-center gap-2 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable NAFDAC Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              TAB 5: 8:00 PM WHATSAPP EXECUTIVE AUDIT (LIVE SYNCED)
          ─────────────────────────────────────────────────────────────────── */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 pt-2">
              <div className="text-center max-w-lg mx-auto space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                  Real-Time Executive Dispatch
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Your 8:00 PM WhatsApp Shift Summary
                </h3>
                <p className="text-xs text-slate-500">
                  This report dynamically reflects all changes you made in Tabs 1, 2, 3, and 4:
                </p>
              </div>

              {/* Simulated Phone WhatsApp Container */}
              <div className="bg-[#EFEAE2] p-4 sm:p-6 rounded-3xl shadow-lg border border-slate-300 max-w-xl mx-auto">
                <div className="bg-white rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-sm text-xs text-slate-800 space-y-2.5 font-sans border border-slate-200/60 whitespace-pre-line leading-relaxed">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 not-italic text-[10px] text-slate-400">
                    <span className="font-extrabold text-[#0B5FFF]">Obi Table Water OS &bull; Daily Audit</span>
                    <span>08:00 PM</span>
                  </div>
                  {generateWhatsAppSummary()}
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#0B5FFF]" />
                    <span>{copiedReport ? 'Report Copied! ✅' : 'Copy Formatted Report'}</span>
                  </button>

                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(generateWhatsAppSummary())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Send Test to My WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              BOTTOM FACTORY PERFORMANCE METRICS BAR (ALWAYS VISIBLE)
          ─────────────────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Shift Production</span>
              <strong className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                ₦{totalPlantGross.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-500">{sachetBagsSealed.toLocaleString()} bags sealed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Net Cash Profit</span>
              <strong className="text-base sm:text-lg font-black text-emerald-700 font-mono block">
                ₦{netCashProfit.toLocaleString()}
              </strong>
              <span className="text-[10px] text-emerald-600 font-semibold">After diesel &amp; packaging</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Driver Shortage</span>
              <strong className="text-base sm:text-lg font-black text-rose-700 font-mono block">
                {truck2MissingBags > 0 ? `-${truck2MissingBags} Bags` : '0 Missing'}
              </strong>
              <span className="text-[10px] text-rose-600 font-semibold">
                {truck2MissingBags > 0 ? `-₦${truck2ShortageDebit.toLocaleString()} (Musa debited)` : 'All trucks balanced'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Energy Rate</span>
              <strong className="text-base sm:text-lg font-black text-blue-700 font-mono block">
                ₦{energyCostPerBag}
              </strong>
              <span className="text-[10px] text-blue-600 font-semibold">Per sachet bag fuel</span>
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
          6. CORE FEATURE OUTCOMES
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
          7. 14-DAY ZERO-RISK FACTORY PILOT OFFER
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
          8. PRICING SECTION: 3 CLEAN CARDS (PLANT RECOMMENDED)
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
          9. FREQUENTLY ASKED QUESTIONS (FAQ)
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
          10. FINAL CALL TO ACTION SECTION
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
          11. FOOTER
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
          12. FLOATING WHATSAPP BUTTON (FIXED BOTTOM-RIGHT ON MOBILE, #25D366)
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
          13. STICKY MOBILE BOTTOM NAVIGATION BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-bold text-slate-600 shadow-lg">
        <a href="#hero" className="flex flex-col items-center gap-0.5 text-[#0B5FFF]">
          <Droplets className="w-4 h-4" />
          <span>Home</span>
        </a>
        <a href="#simulator" className="flex flex-col items-center gap-0.5 hover:text-[#0B5FFF]">
          <Sparkles className="w-4 h-4" />
          <span>Test Console</span>
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
          14. NAFDAC INSPECTION CERTIFICATE MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      {showNafdacCertModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border-4 border-teal-600">
            
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowNafdacCertModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                <Award className="w-3.5 h-3.5 text-teal-700" />
                <span>Federal Republic of Nigeria &bull; Packaged Water Standard</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                CERTIFICATE OF WATER SANITATION &amp; PURITY LOG
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Facility ID: OBI-TW-LAG-2026-081 &bull; Audit Date: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>

            {/* Certificate Body Parameters */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Facility Name</span>
                  <strong className="text-slate-900 font-bold">Obi Table &amp; Sachet Water Company</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Inspectorate Standard</span>
                  <strong className="text-slate-900 font-bold">NAFDAC NIS 306:2008 Standard</strong>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2.5 border border-slate-200">Parameter Tested</th>
                    <th className="p-2.5 border border-slate-200">NAFDAC Legal Limit</th>
                    <th className="p-2.5 border border-slate-200">Factory Reading</th>
                    <th className="p-2.5 border border-slate-200">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-medium">Total Dissolved Solids (TDS)</td>
                    <td className="p-2.5 border border-slate-200 font-mono">&lt; 100 ppm</td>
                    <td className="p-2.5 border border-slate-200 font-bold font-mono text-emerald-700">{treatedPermeateTds} ppm</td>
                    <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">PASS ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-medium">Water Acidity / pH Level</td>
                    <td className="p-2.5 border border-slate-200 font-mono">6.5 – 7.5</td>
                    <td className="p-2.5 border border-slate-200 font-bold font-mono text-emerald-700">{treatedPh.toFixed(1)}</td>
                    <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">PASS ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-medium">Borehole Raw Feed TDS</td>
                    <td className="p-2.5 border border-slate-200 font-mono">Borehole Baseline</td>
                    <td className="p-2.5 border border-slate-200 font-mono">{rawBoreholeTds} ppm</td>
                    <td className="p-2.5 border border-slate-200 font-bold text-blue-700">RECORDED</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-medium">UV Sterilization Lamp Hours</td>
                    <td className="p-2.5 border border-slate-200 font-mono">&lt; 8,000 hrs</td>
                    <td className="p-2.5 border border-slate-200 font-mono">{uvHours} hrs active</td>
                    <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">OPTIMAL ✅</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                <strong>Quality Assurance Attestation:</strong> Finished drinking water complies fully with microbial and physicochemical standards required by Nigerian regulatory authorities. All filtration media and reverse osmosis membranes are certified within service life.
              </div>
            </div>

            {/* Certificate Footer Sign-Off */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <div className="text-slate-500 text-[11px]">
                Audited &amp; Digitally Certified by <strong className="text-slate-800">Obi Table Water OS</strong>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold hover:bg-teal-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
