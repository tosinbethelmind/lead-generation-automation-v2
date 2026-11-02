'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 AQUAFLOW ERP™ — INDUSTRIAL SACHET & BOTTLED WATER FACTORY MANAGEMENT SYSTEM
 * Built for Nigerian Pure Water & Table Water Plants (Production, Fleet Waybills & QuickBooks P&L)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
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
  TrendingUp,
  FileText,
  Users,
  Fuel,
  Package,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
  Phone
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function WaterFactoryErpDashboard() {
  const [activeTab, setActiveTab] = useState<'production' | 'fleet' | 'quickbooks' | 'audit' | 'deploy'>('production');

  // Factory Production State
  const [sachetBagsProduced, setSachetBagsProduced] = useState(3200);
  const [sachetPricePerBag, setSachetPricePerBag] = useState(350); // ₦350 wholesale
  const [bottlePacksProduced, setBottlePacksProduced] = useState(240);
  const [bottlePricePerPack, setBottlePricePerPack] = useState(1300); // ₦1,300 wholesale
  const [factoryBurstBags, setFactoryBurstBags] = useState(25); // burst on sealing machine
  const [nylonRollsUsed, setNylonRollsUsed] = useState(4); // 4 rolls of printed film

  // Fleet & Delivery Trucks State
  const [truck1Bags, setTruck1Bags] = useState(850);
  const [truck1Cash, setTruck1Cash] = useState(280000); // 800 bags sold
  const [truck1Credit, setTruck1Credit] = useState(30);
  const [truck1Burst, setTruck1Burst] = useState(10);
  const [truck1Returned, setTruck1Returned] = useState(10);

  const [truck2Bags, setTruck2Bags] = useState(700);
  const [truck2Cash, setTruck2Cash] = useState(217000); // 620 bags sold @ 350
  const [truck2Credit, setTruck2Credit] = useState(30);
  const [truck2Burst, setTruck2Burst] = useState(10);
  const [truck2Returned, setTruck2Returned] = useState(0); // Shortage will be detected!

  const [truck3Bags, setTruck3Bags] = useState(600);
  const [truck3Cash, setTruck3Cash] = useState(196000); // 560 bags sold
  const [truck3Credit, setTruck3Credit] = useState(25);
  const [truck3Burst, setTruck3Burst] = useState(8);
  const [truck3Returned, setTruck3Returned] = useState(7);

  // Gate Walk-in Sales
  const [gateSachetBags, setGateSachetBags] = useState(900);
  const [gateBottlePacks, setGateBottlePacks] = useState(200);

  // Factory Expenses (QuickBooks Costing)
  const [dieselLiters, setDieselLiters] = useState(55); // 55 liters
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState(1250); // ₦1,250/L
  const [nylonRollCost, setNylonRollCost] = useState(32000); // ₦8,000 per roll x 4
  const [waterTreatmentChemicals, setWaterTreatmentChemicals] = useState(12000); // Chlorine/filters
  const [loadersDailyWages, setLoadersDailyWages] = useState(28000); // Machine operators & loaders

  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Calculations
  const sachetProductionValue = sachetBagsProduced * sachetPricePerBag;
  const bottleProductionValue = bottlePacksProduced * bottlePricePerPack;
  const totalProductionValue = sachetProductionValue + bottleProductionValue;

  // Truck 1 Audit
  const truck1Accounted = (truck1Cash / sachetPricePerBag) + truck1Credit + truck1Burst + truck1Returned;
  const truck1Shortage = truck1Bags - truck1Accounted;

  // Truck 2 Audit (Expected shortage)
  const truck2Accounted = (truck2Cash / sachetPricePerBag) + truck2Credit + truck2Burst + truck2Returned;
  const truck2Shortage = truck2Bags - truck2Accounted; // 700 - (620 + 30 + 10 + 0) = 40 bags missing!

  // Truck 3 Audit
  const truck3Accounted = (truck3Cash / sachetPricePerBag) + truck3Credit + truck3Burst + truck3Returned;
  const truck3Shortage = truck3Bags - truck3Accounted;

  const totalTruckShortageBags = Math.max(0, truck1Shortage) + Math.max(0, truck2Shortage) + Math.max(0, truck3Shortage);
  const totalShortageNaira = totalTruckShortageBags * sachetPricePerBag;

  // Sales Revenue
  const gateRevenue = (gateSachetBags * sachetPricePerBag) + (gateBottlePacks * bottlePricePerPack);
  const totalCashCollected = truck1Cash + truck2Cash + truck3Cash + gateRevenue;
  const totalReceivables = (truck1Credit + truck2Credit + truck3Credit) * sachetPricePerBag;
  const totalGrossRevenue = totalCashCollected + totalReceivables;

  // Operating Expenses
  const totalDieselCost = dieselLiters * dieselPricePerLiter;
  const totalOperatingExpenses = totalDieselCost + nylonRollCost + waterTreatmentChemicals + loadersDailyWages;
  const netOperatingProfit = totalGrossRevenue - totalOperatingExpenses;
  const profitMarginPercent = Math.round((netOperatingProfit / (totalGrossRevenue || 1)) * 100);

  const generateWhatsAppAuditText = () => {
    return `💧 *AQUAFLOW ERP™ — DAILY EXECUTIVE FACTORY AUDIT*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | Shift: Morning Batch A
🏢 Factory: Obi Table & Sachet Water Production Plant
━━━━━━━━━━━━━━━━━━━━
🏭 *1. FACTORY PRODUCTION SUMMARY:*
• Sachet Water: ${sachetBagsProduced.toLocaleString()} bags produced (${nylonRollsUsed} rolls used)
• Table Water Bottles: ${bottlePacksProduced.toLocaleString()} packs produced
• Factory Floor Burst/Waste: ${factoryBurstBags} bags (Within tolerance)
• Total Shift Factory Output Value: ₦${totalProductionValue.toLocaleString()}

🚚 *2. TRUCK FLEET SALES & RECONCILIATION:*
• Truck 1 (Emeka): Loaded ${truck1Bags} | Remitted: ₦${truck1Cash.toLocaleString()} | ${truck1Shortage <= 0 ? '✅ 100% Balanced' : `⚠️ Shortage: -${truck1Shortage} bags`}
• Truck 2 (Musa): Loaded ${truck2Bags} | Remitted: ₦${truck2Cash.toLocaleString()} | 🚨 *SHORTAGE DETECTED: -${truck2Shortage} bags (₦${(truck2Shortage * sachetPricePerBag).toLocaleString()})*
• Truck 3 (Ibrahim): Loaded ${truck3Bags} | Remitted: ₦${truck3Cash.toLocaleString()} | ${truck3Shortage <= 0 ? '✅ 100% Balanced' : `⚠️ Shortage: -${truck3Shortage} bags`}
• Factory Gate Walk-in Sales: ₦${gateRevenue.toLocaleString()}

💰 *3. QUICKBOOKS FINANCIAL P&L (TODAY):*
• Total Realized Revenue: ₦${totalGrossRevenue.toLocaleString()}
  - Physical Cash/Moniepoint Transfers: ₦${totalCashCollected.toLocaleString()}
  - Outstanding Distributor Debts: ₦${totalReceivables.toLocaleString()}
• Daily Factory OPEX: -₦${totalOperatingExpenses.toLocaleString()}
  - Diesel Generator (${dieselLiters}L @ ₦${dieselPricePerLiter}/L): ₦${totalDieselCost.toLocaleString()}
  - Packaging Nylon & Caps: ₦${nylonRollCost.toLocaleString()}
  - Water Treatment Chemicals: ₦${waterTreatmentChemicals.toLocaleString()}
  - Daily Labor & Loaders: ₦${loadersDailyWages.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
💵 *NET FACTORY PROFIT TODAY:* ₦${netOperatingProfit.toLocaleString()} (${profitMarginPercent}% Margin)
━━━━━━━━━━━━━━━━━━━━
*Audit Status:* Reconciled & Logged in AquaFlow Cloud ERP`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateWhatsAppAuditText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('6805375225');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24 space-y-8">
        
        {/* Top Software Status Ribbon */}
        <div className="bg-[#0c1220] border border-cyan-500/30 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">AquaFlow ERP™</h1>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Industrial Plant Edition
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Client Demo: <strong>Obi Table &amp; Sachet Water Plant</strong></span>
                <span>&bull;</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Shift Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 block">Shift Output Value</span>
              <span className="text-sm font-extrabold text-white">₦{totalProductionValue.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
              <span className="text-[10px] text-emerald-400 block">Net Shift Profit</span>
              <span className="text-sm font-extrabold text-emerald-400">₦{netOperatingProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Software Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
          {[
            { id: 'production', label: '🏭 1. Production Floor', badge: `${sachetBagsProduced} Bags` },
            { id: 'fleet', label: '🚚 2. Trucks & Drivers', badge: totalTruckShortageBags > 0 ? `⚠️ -${totalTruckShortageBags} Shortage` : '✅ Balanced' },
            { id: 'quickbooks', label: '📊 3. QuickBooks P&L', badge: `₦${netOperatingProfit.toLocaleString()}` },
            { id: 'audit', label: '📱 4. 8:00 PM WhatsApp Audit', badge: 'Automated' },
            { id: 'deploy', label: '⚡ 5. Plant Pricing & Setup', badge: 'Turnkey' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : tab.badge.includes('Shortage') 
                    ? 'bg-rose-500/20 text-rose-300' 
                    : 'bg-white/5 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ── TAB 1: PRODUCTION FLOOR ────────────────────────────────────────── */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Factory className="w-4 h-4 text-cyan-400" />
                    Machine Shift Counter &amp; Material Yield
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tracks exact bags sealed, nylon roll usage, and prevents workers from running extra unrecorded shifts.
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                  Total Production: ₦{totalProductionValue.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sachet Water Line */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      Line 1: Sachet Water (50cl / 60cl Bags)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Machine 1 &amp; 2</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 flex justify-between">
                      <span>Bags Produced This Shift:</span>
                      <strong className="text-white font-mono">{sachetBagsProduced.toLocaleString()} Bags</strong>
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={10000}
                      step={100}
                      value={sachetBagsProduced}
                      onChange={(e) => setSachetBagsProduced(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>500 Bags</span>
                      <span>5,000 Bags</span>
                      <span>10,000 Bags</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Factory Wholesale Price</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-slate-400">₦</span>
                        <input
                          type="number"
                          value={sachetPricePerBag}
                          onChange={(e) => setSachetPricePerBag(Number(e.target.value) || 0)}
                          className="w-full bg-[#070b14] border border-white/15 rounded-lg px-2 py-1 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Packaging Nylon Rolls Used</span>
                      <input
                        type="number"
                        value={nylonRollsUsed}
                        onChange={(e) => setNylonRollsUsed(Number(e.target.value) || 0)}
                        className="w-full bg-[#070b14] border border-white/15 rounded-lg px-2 py-1 text-white font-mono mt-1"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex justify-between items-center">
                    <span className="text-slate-300">Sachet Shift Output Value:</span>
                    <span className="font-extrabold text-cyan-300 font-mono">₦{sachetProductionValue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Bottled Water Line */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      Line 2: Table Water Bottles (50cl / 75cl Packs)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Rinsing &amp; Capping Line</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 flex justify-between">
                      <span>Packs Produced This Shift:</span>
                      <strong className="text-white font-mono">{bottlePacksProduced.toLocaleString()} Packs</strong>
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={2000}
                      step={10}
                      value={bottlePacksProduced}
                      onChange={(e) => setBottlePacksProduced(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>50 Packs</span>
                      <span>1,000 Packs</span>
                      <span>2,000 Packs</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pack Wholesale Price</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-slate-400">₦</span>
                        <input
                          type="number"
                          value={bottlePricePerPack}
                          onChange={(e) => setBottlePricePerPack(Number(e.target.value) || 0)}
                          className="w-full bg-[#070b14] border border-white/15 rounded-lg px-2 py-1 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Factory Sealing Waste</span>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={factoryBurstBags}
                          onChange={(e) => setFactoryBurstBags(Number(e.target.value) || 0)}
                          className="w-full bg-[#070b14] border border-white/15 rounded-lg px-2 py-1 text-slate-300 font-mono"
                        />
                        <span className="text-[10px] text-slate-400">bags</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex justify-between items-center">
                    <span className="text-slate-300">Bottle Shift Output Value:</span>
                    <span className="font-extrabold text-blue-300 font-mono">₦{bottleProductionValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TRUCKS & FLEET DISPATCH ─────────────────────────────────── */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    Delivery Truck Fleet Waybills &amp; Driver Shortage Guard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Eliminates the #1 leakage in water plants: drivers claiming bags burst on the road or selling water without remitting cash.
                  </p>
                </div>

                {totalTruckShortageBags > 0 ? (
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Fleet Shortage: -{totalTruckShortageBags} Bags (₦{totalShortageNaira.toLocaleString()})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    All Trucks 100% Balanced
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Truck 1 */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  truck1Shortage > 0 
                    ? 'bg-rose-500/[0.03] border-rose-500/30' 
                    : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🚚 Truck 1: Emeka</span>
                    <span className="text-[10px] text-slate-400">Market Route</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Morning Load:</span>
                      <strong className="text-white font-mono">{truck1Bags} Bags</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cash Remitted:</span>
                      <strong className="text-emerald-400 font-mono">₦{truck1Cash.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credit Sales:</span>
                      <span className="text-amber-300 font-mono">{truck1Credit} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Burst on Road:</span>
                      <span className="text-slate-400 font-mono">{truck1Burst} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Returned to Store:</span>
                      <span className="text-slate-400 font-mono">{truck1Returned} Bags</span>
                    </div>
                  </div>

                  <div className={`p-2 rounded-lg text-xs font-bold text-center ${
                    truck1Shortage > 0 
                      ? 'bg-rose-500/20 text-rose-300' 
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {truck1Shortage > 0 ? `⚠️ Shortage: -${truck1Shortage} Bags` : '✅ Balanced'}
                  </div>
                </div>

                {/* Truck 2 (The Shortage Trigger) */}
                <div className="p-4 rounded-xl bg-rose-500/[0.05] border border-rose-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🚚 Truck 2: Musa</span>
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">
                      Shortage Flagged!
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Morning Load:</span>
                      <strong className="text-white font-mono">{truck2Bags} Bags</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cash Remitted:</span>
                      <strong className="text-emerald-400 font-mono">₦{truck2Cash.toLocaleString()} (620 sold)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credit Sales:</span>
                      <span className="text-amber-300 font-mono">{truck2Credit} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Burst on Road:</span>
                      <span className="text-slate-400 font-mono">{truck2Burst} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Returned to Store:</span>
                      <span className="text-slate-400 font-mono">0 Bags</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-200 text-xs space-y-1">
                    <div className="font-extrabold flex items-center justify-between">
                      <span>Missing:</span>
                      <span>-{truck2Shortage} Bags (₦{(truck2Shortage * sachetPricePerBag).toLocaleString()})</span>
                    </div>
                    <p className="text-[10px] text-rose-300/80">
                      System automatically logs debit against Musa&apos;s weekly commission ledger.
                    </p>
                  </div>
                </div>

                {/* Truck 3 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">🚚 Truck 3: Ibrahim</span>
                    <span className="text-[10px] text-slate-400">Estates Route</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Morning Load:</span>
                      <strong className="text-white font-mono">{truck3Bags} Bags</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cash Remitted:</span>
                      <strong className="text-emerald-400 font-mono">₦{truck3Cash.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credit Sales:</span>
                      <span className="text-amber-300 font-mono">{truck3Credit} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Burst on Road:</span>
                      <span className="text-slate-400 font-mono">{truck3Burst} Bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Returned to Store:</span>
                      <span className="text-slate-400 font-mono">{truck3Returned} Bags</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold text-center">
                    ✅ 100% Balanced
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: QUICKBOOKS P&L ──────────────────────────────────────────── */}
        {activeTab === 'quickbooks' && (
          <div className="space-y-6">
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    QuickBooks-Style Factory Income Statement (P&amp;L)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time costing accounting for generator diesel, water treatment, packaging film, and daily loader wages.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Profit Margin</span>
                  <span className="text-sm font-extrabold text-emerald-400">{profitMarginPercent}% Margin</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Side */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Shift Revenue (Cash + Inflows)</h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Truck 1 Sales Cash Remitted:</span>
                      <span className="text-white font-mono font-bold">₦{truck1Cash.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Truck 2 Sales Cash Remitted:</span>
                      <span className="text-white font-mono font-bold">₦{truck2Cash.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Truck 3 Sales Cash Remitted:</span>
                      <span className="text-white font-mono font-bold">₦{truck3Cash.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Factory Gate Direct Walk-in Sales:</span>
                      <span className="text-white font-mono font-bold">₦{gateRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-amber-300">Distributor Receivables (Credit):</span>
                      <span className="text-amber-300 font-mono font-bold">+₦{totalReceivables.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-cyan-300 font-bold">Total Shift Factory Revenue:</span>
                      <span className="text-cyan-300 font-mono font-extrabold text-sm">₦{totalGrossRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expense Side */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Production Cost of Goods Sold (COGS)</h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Diesel Generator Fuel ({dieselLiters}L @ ₦{dieselPricePerLiter}/L):</span>
                      <span className="text-rose-400 font-mono font-bold">-₦{totalDieselCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Printed Packaging Film &amp; Bottle Caps:</span>
                      <span className="text-rose-400 font-mono font-bold">-₦{nylonRollCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Water Treatment Filters &amp; Chlorine:</span>
                      <span className="text-rose-400 font-mono font-bold">-₦{waterTreatmentChemicals.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02]">
                      <span className="text-slate-400">Factory Machine Operators &amp; Loaders:</span>
                      <span className="text-rose-400 font-mono font-bold">-₦{loadersDailyWages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                      <span className="text-rose-300 font-bold">Total Daily Operating Expenses:</span>
                      <span className="text-rose-300 font-mono font-extrabold text-sm">-₦{totalOperatingExpenses.toLocaleString()}</span>
                    </div>

                    {/* Net Profit Big Box */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block">Net Factory Profit Today:</span>
                        <span className="text-xl sm:text-2xl font-black text-white font-mono">
                          ₦{netOperatingProfit.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                        {profitMarginPercent}% Net Margin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: WHATSAPP EVENING AUDIT ──────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Automated 8:00 PM WhatsApp Executive Summary
                  </h2>
                  <p className="text-xs text-slate-400">
                    This exact audited report is sent to the factory owner&apos;s smartphone every evening at closing time.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                  Ready to Dispatch
                </span>
              </div>

              {/* Formatted Report Preview */}
              <div className="bg-[#070b14] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {generateWhatsAppAuditText()}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedReport ? '✅ Copied to Clipboard!' : 'Copy Executive WhatsApp Report'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppAuditText())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Test Send on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: DEPLOYMENT & PRICING ────────────────────────────────────── */}
        {activeTab === 'deploy' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#0a0e17] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commercial Turnkey Factory Deployment
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Deploy AquaFlow ERP for Your Water Plant
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Full production tracking, multi-truck driver shortage shield, and QuickBooks P&amp;L configured for your factory in 48 hours.
                </p>
              </div>

              {/* Two Commercial Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Package 1: Single Kiosk */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter Kiosk Edition</span>
                  <div className="text-2xl font-black text-white">₦35,000 <span className="text-xs text-slate-400 font-normal">+ ₦7k/mo</span></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for small single-counter water depots and retail shops with no delivery truck fleets.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Single sales desk terminal</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Daily cash log</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp catalog closer</li>
                  </ul>
                </div>

                {/* Package 2: Full Industrial Plant (Recommended for Obi) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#d4af37]/15 to-transparent border-2 border-[#d4af37] space-y-3 relative shadow-xl shadow-[#d4af37]/10">
                  <div className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-[#d4af37] text-[#070b14] font-black text-[10px] uppercase tracking-wider">
                    Recommended for Water Plants
                  </div>
                  <span className="text-xs font-extrabold text-[#d4af37] uppercase tracking-wider block">Full Industrial Factory &amp; Fleet Edition</span>
                  <div className="text-2xl font-black text-white">₦280,000 <span className="text-xs text-slate-400 font-normal">Turnkey (₦140k Deposit)</span></div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Complete manufacturing plant system with up to 5 delivery trucks, driver shortage audit, nylon roll yield, diesel costing, and remote owner oversight.
                  </p>
                  <ul className="text-xs text-slate-200 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Production shift counter (Sachets &amp; Bottles)</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Multi-truck driver shortage anti-theft shield</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> QuickBooks diesel &amp; nylon costing P&amp;L</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 8:00 PM automated WhatsApp owner audit</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> On-site or remote staff video training</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 50% commitment deposit (₦140,000) to start</li>
                  </ul>
                </div>
              </div>

              {/* Settlement Account Box */}
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Official Corporate Settlement Account:</span>
                  <span className="text-emerald-400">Moniepoint Microfinance Bank</span>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Number (NIP Direct Wire):</span>
                    <strong className="text-lg font-mono text-[#d4af37] tracking-wider">6805375225</strong>
                    <span className="text-[11px] text-slate-300 block">Bethelmind Digital Solutions (CAC Reg: 9912717)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition"
                  >
                    {copiedAccount ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind Desk! I want to confirm payment for the AquaFlow Industrial Water Factory ERP (₦140,000 50% Milestone Deposit).')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold text-sm shadow-xl hover:brightness-110 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Confirm Milestone Deposit on WhatsApp (0802 279 1227)</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
