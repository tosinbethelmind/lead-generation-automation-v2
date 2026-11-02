'use client';

/**
 * @file src/app/tools/fmcg-dispatch/page.tsx
 * 
 * 💧 SACHET & BOTTLED WATER FACTORY PRODUCTION, SALES & TRUCK FLEET RECONCILER
 * Designed for Nigerian Table Water Plants & Pure Water Factory Operators.
 * 
 * Solves:
 * 1. Factory Floor Production Tracking (Sachet bags & bottle packs)
 * 2. Multi-Truck Delivery Route Dispatch & Driver Shortage Auditing
 * 3. Walk-in Gate Cashier & Distributor Credit Balances
 * 4. Diesel & Packaging Cost Reconciliation vs Net Daily Profit
 * 5. 8:00 PM WhatsApp Executive Evening Summary to Owner
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Factory, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function WaterFactoryReconcilerPage() {
  // Factory Production State
  const [sachetBagsProduced, setSachetBagsProduced] = useState(2500);
  const [sachetPricePerBag, setSachetPricePerBag] = useState(350); // ₦350 wholesale
  const [bottlePacksProduced, setBottlePacksProduced] = useState(180);
  const [bottlePricePerPack, setBottlePricePerPack] = useState(1300); // ₦1,300 wholesale

  // Fleet Dispatch Allocation
  const [truck1Bags, setTruck1Bags] = useState(800);
  const [truck1CashRemitted, setTruck1CashRemitted] = useState(262500); // 750 bags sold @ 350
  const [truck1CreditBags, setTruck1CreditBags] = useState(30); // 30 on credit
  const [truck1BurstBags, setTruck1BurstBags] = useState(10); // 10 burst on road
  const [truck1BroughtBack, setTruck1BroughtBack] = useState(10); // 10 returned

  const [truck2Bags, setTruck2Bags] = useState(700);
  const [truck2CashRemitted, setTruck2CashRemitted] = useState(227500); // 650 sold
  const [truck2CreditBags, setTruck2CreditBags] = useState(35);
  const [truck2BurstBags, setTruck2BurstBags] = useState(8);
  const [truck2BroughtBack, setTruck2BroughtBack] = useState(7);

  const [factoryGateBagsSold, setFactoryGateBagsSold] = useState(900);
  const [factoryGateBottleSold, setFactoryGateBottleSold] = useState(150);

  // Daily Expenses
  const [dieselExpense, setDieselExpense] = useState(45000); // Generator fuel
  const [nylonPackingCost, setNylonPackingCost] = useState(28000); // Rolls & caps
  const [dailyLaborWages, setDailyLaborWages] = useState(22000); // Operators & loaders

  const [copiedSummary, setCopiedSummary] = useState(false);

  // Calculations
  const totalProductionValue = (sachetBagsProduced * sachetPricePerBag) + (bottlePacksProduced * bottlePricePerPack);

  // Truck 1 Audit
  const truck1AccountedBags = (truck1CashRemitted / sachetPricePerBag) + truck1CreditBags + truck1BurstBags + truck1BroughtBack;
  const truck1ShortageBags = truck1Bags - truck1AccountedBags;
  const truck1ShortageAmount = truck1ShortageBags * sachetPricePerBag;

  // Truck 2 Audit
  const truck2AccountedBags = (truck2CashRemitted / sachetPricePerBag) + truck2CreditBags + truck2BurstBags + truck2BroughtBack;
  const truck2ShortageBags = truck2Bags - truck2AccountedBags;
  const truck2ShortageAmount = truck2ShortageBags * sachetPricePerBag;

  // Gate Sales
  const factoryGateCash = (factoryGateBagsSold * sachetPricePerBag) + (factoryGateBottleSold * bottlePricePerPack);

  // Total Realized Cash & Debts
  const totalCashCollected = truck1CashRemitted + truck2CashRemitted + factoryGateCash;
  const totalCustomerCredit = (truck1CreditBags + truck2CreditBags) * sachetPricePerBag;
  const totalTotalRevenueRealized = totalCashCollected + totalCustomerCredit;

  // Expenses & Net Profit
  const totalDailyExpenses = dieselExpense + nylonPackingCost + dailyLaborWages;
  const netOperatingProfit = totalTotalRevenueRealized - totalDailyExpenses;

  // WhatsApp 8PM Evening Summary Generator
  const generateEveningWhatsAppReport = () => {
    return `💧 *DAILY WATER FACTORY EXECUTIVE AUDIT REPORT*
📅 Date: ${new Date().toLocaleDateString('en-GB')}
🏢 Factory: Obi Table & Sachet Water Plant
━━━━━━━━━━━━━━━━━━━━
🏭 *1. PRODUCTION SHIFT TOTAL:*
• Sachet Water Produced: ${sachetBagsProduced.toLocaleString()} bags (₦${(sachetBagsProduced * sachetPricePerBag).toLocaleString()})
• Bottle Water Produced: ${bottlePacksProduced.toLocaleString()} packs (₦${(bottlePacksProduced * bottlePricePerPack).toLocaleString()})
• Total Shift Value: ₦${totalProductionValue.toLocaleString()}

🚚 *2. TRUCK FLEET SALES & RECONCILIATION:*
• Truck 1 (Driver Emeka): Loaded ${truck1Bags} bags
  - Cash Remitted: ₦${truck1CashRemitted.toLocaleString()}
  - Credit Sales: ${truck1CreditBags} bags
  - Burst/Damaged: ${truck1BurstBags} bags
  - ${truck1ShortageBags > 0 ? `⚠️ *SHORTAGE DETECTED:* -${truck1ShortageBags} bags (₦${truck1ShortageAmount.toLocaleString()})` : '✅ Balanced'}

• Truck 2 (Driver Musa): Loaded ${truck2Bags} bags
  - Cash Remitted: ₦${truck2CashRemitted.toLocaleString()}
  - Credit Sales: ${truck2CreditBags} bags
  - Burst/Damaged: ${truck2BurstBags} bags
  - ${truck2ShortageBags > 0 ? `⚠️ *SHORTAGE DETECTED:* -${truck2ShortageBags} bags (₦${truck2ShortageAmount.toLocaleString()})` : '✅ Balanced'}

🚪 *3. FACTORY GATE SALES:*
• Sachet Walk-ins: ${factoryGateBagsSold.toLocaleString()} bags
• Bottle Water Walk-ins: ${factoryGateBottleSold.toLocaleString()} packs
• Gate Revenue: ₦${factoryGateCash.toLocaleString()}

💰 *4. FINANCIAL BOTTOM-LINE (QUICKBOOKS SUMMARY):*
• Total Cash Collected Today: ₦${totalCashCollected.toLocaleString()}
• Total Credit Balances (Receivables): ₦${totalCustomerCredit.toLocaleString()}
• Total Daily Expenses (Diesel + Nylon + Wages): ₦${totalDailyExpenses.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
💵 *NET FACTORY PROFIT TODAY:* ₦${netOperatingProfit.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
*Audit Status:* Verified via Bethelmind Water Plant ERP Suite`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateEveningWhatsAppReport());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 pt-32 sm:pt-36 space-y-10">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Factory className="w-3.5 h-3.5" />
            Pure Water &amp; Bottled Water Plant Management Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Water Factory Production, Fleet &amp; <span className="text-[#d4af37]">Driver Shortage Reconciler</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Interactive live simulation. Reconciles morning production quantity, delivery truck loading, driver cash remittance, burst bags, diesel generator fuel, and generates an 8:00 PM WhatsApp audit summary to your phone.
          </p>
        </div>

        {/* 3 Core Interactive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Factory Floor & Drivers (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Module 1: Production Shift Floor */}
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                  <Factory className="w-4 h-4" />
                  1. Shift Production Quantity Entry
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Total Value: ₦{totalProductionValue.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Bags of Sachet Water Produced</label>
                  <input
                    type="number"
                    value={sachetBagsProduced}
                    onChange={(e) => setSachetBagsProduced(Number(e.target.value) || 0)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="text-[10px] text-slate-500">Wholesale Price: ₦{sachetPricePerBag}/bag</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Packs of Bottle Water Produced</label>
                  <input
                    type="number"
                    value={bottlePacksProduced}
                    onChange={(e) => setBottlePacksProduced(Number(e.target.value) || 0)}
                    className="w-full bg-[#070b14] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="text-[10px] text-slate-500">Wholesale Price: ₦{bottlePricePerPack}/pack</div>
                </div>
              </div>
            </div>

            {/* Module 2: Multi-Truck Delivery Route Dispatch & Driver Shortage Guard */}
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  2. Truck Fleet Waybill &amp; Evening Driver Audit
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Anti-Theft Active
                </span>
              </div>

              {/* Truck 1 Card */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">🚚 Truck 1 (Driver: Emeka &bull; Route: Market Corridor)</span>
                  {truck1ShortageBags > 0 ? (
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Shortage: -{truck1ShortageBags} bags (₦{truck1ShortageAmount.toLocaleString()})
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> 100% Balanced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Morning Load</span>
                    <input
                      type="number"
                      value={truck1Bags}
                      onChange={(e) => setTruck1Bags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cash Remitted (₦)</span>
                    <input
                      type="number"
                      value={truck1CashRemitted}
                      onChange={(e) => setTruck1CashRemitted(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Credit Sales (Bags)</span>
                    <input
                      type="number"
                      value={truck1CreditBags}
                      onChange={(e) => setTruck1CreditBags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-amber-300 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Burst Bags (Road)</span>
                    <input
                      type="number"
                      value={truck1BurstBags}
                      onChange={(e) => setTruck1BurstBags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Truck 2 Card */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">🚚 Truck 2 (Driver: Musa &bull; Route: Residential Estates)</span>
                  {truck2ShortageBags > 0 ? (
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Shortage: -{truck2ShortageBags} bags (₦{truck2ShortageAmount.toLocaleString()})
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> 100% Balanced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Morning Load</span>
                    <input
                      type="number"
                      value={truck2Bags}
                      onChange={(e) => setTruck2Bags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cash Remitted (₦)</span>
                    <input
                      type="number"
                      value={truck2CashRemitted}
                      onChange={(e) => setTruck2CashRemitted(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Credit Sales (Bags)</span>
                    <input
                      type="number"
                      value={truck2CreditBags}
                      onChange={(e) => setTruck2CreditBags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-amber-300 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Burst Bags (Road)</span>
                    <input
                      type="number"
                      value={truck2BurstBags}
                      onChange={(e) => setTruck2BurstBags(Number(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2 py-1 text-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3: Daily Factory Production Costs (Diesel, Nylon, Labor) */}
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  3. Production Operating Expenses (QuickBooks Costing)
                </div>
                <span className="text-[10px] text-slate-400">Total: ₦{totalDailyExpenses.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300">Generator Diesel Fuel (₦)</label>
                  <input
                    type="number"
                    value={dieselExpense}
                    onChange={(e) => setDieselExpense(Number(e.target.value) || 0)}
                    className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300">Nylon Rolls &amp; Caps (₦)</label>
                  <input
                    type="number"
                    value={nylonPackingCost}
                    onChange={(e) => setNylonPackingCost(Number(e.target.value) || 0)}
                    className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300">Daily Factory Labor / Loaders (₦)</label>
                  <input
                    type="number"
                    value={dailyLaborWages}
                    onChange={(e) => setDailyLaborWages(Number(e.target.value) || 0)}
                    className="w-full bg-[#070b14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: QuickBooks-Style Daily Financial Statement & WhatsApp Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Executive Statement Card */}
            <div className="bg-gradient-to-b from-[#0e1424] to-[#070b14] border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block">Daily P&amp;L Statement</span>
                  <div className="text-base font-extrabold text-white">Water Factory Executive Ledger</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Live Audit
                </span>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Total Cash Collected Today:</span>
                  <span className="text-white font-bold">₦{totalCashCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Distributor Receivables (Credit):</span>
                  <span className="text-amber-300 font-bold">+₦{totalCustomerCredit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Total Factory Revenue:</span>
                  <span className="text-cyan-300 font-extrabold">₦{totalTotalRevenueRealized.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Total Operating Expenses (OPEX):</span>
                  <span className="text-rose-400 font-bold">-₦{totalDailyExpenses.toLocaleString()}</span>
                </div>

                <div className="pt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider block">Net Shift Profit:</span>
                    <span className="text-[10px] text-slate-400">After all diesel, nylon &amp; driver costs</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    ₦{netOperatingProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Driver Shortage Warning if Any */}
              {(truck1ShortageBags > 0 || truck2ShortageBags > 0) && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-200">Driver Shortage Flagged!</strong>
                    Total of {(truck1ShortageBags + truck2ShortageBags)} bags unaccounted for (₦{(truck1ShortageAmount + truck2ShortageAmount).toLocaleString()}). Shortage automatically debited against driver commission ledger.
                  </div>
                </div>
              )}

              {/* 1-Tap Copy WhatsApp 8PM Evening Summary */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  📱 Owner&apos;s 8:00 PM WhatsApp Audit Summary:
                </span>
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{copiedSummary ? '✅ Report Copied to Clipboard!' : 'Copy 8:00 PM WhatsApp Owner Summary'}</span>
                </button>
              </div>

            </div>

            {/* Industrial Plant Commercial Tier Box */}
            <div className="bg-[#0a0e17] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#d4af37] uppercase tracking-wider">
                  🏭 Full Industrial Factory Edition
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Turnkey Plant ERP
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Includes Multi-Truck Fleet Dispatch, Raw Material / Nylon Roll Yield Tracking, Cashier Permission Lock, Driver Commission Ledger, Moniepoint POS Webhook Verification &amp; 48-Hour Onboarding.
              </p>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Commercial Setup Investment:</span>
                  <span className="text-white font-bold">₦280,000 Total</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">50% Commitment Deposit:</span>
                  <span className="text-emerald-400 font-extrabold">₦140,000 to Start</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Balance of ₦140,000 due ONLY after live factory testing and staff training.
                </div>
              </div>

              <Link
                href="/onboard?service=retail_inventory&biz=Water%20Factory%20Plant"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold text-xs hover:brightness-110 shadow-md transition"
              >
                <span>Deploy Industrial Water Plant Edition</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
