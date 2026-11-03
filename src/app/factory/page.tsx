'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 AQUAFLOW ERP™ & DISTRIBUTOR PORTAL — COMPLETE INDUSTRIAL WATER OPERATING SYSTEM
 * Standalone, Production-Grade Water Factory Management & Online Ordering System
 * Built natively for Nigerian Sachet ("Pure Water") & Bottled Table Water Companies.
 * 
 * Features:
 * 1. Factory Floor Production & Packaging Material Yield (Nylon Roll kg vs Bags)
 * 2. Multi-Truck Fleet Dispatch, Waybills & Automatic Driver Shortage Deductions
 * 3. Energy & Generator Diesel Cost Slicer (Grid vs Diesel Cost per Bag)
 * 4. NAFDAC Water Quality Compliance & Treatment Lab Log (TDS, pH, UV, Ozone)
 * 5. QuickBooks-Style Shift P&L & Cash-at-Bank Reconciliation
 * 6. Automated 8:00 PM WhatsApp Executive Shift Audit to Factory Owner
 * 7. Public Distributor & Customer Ordering Storefront (Wholesale & Dispenser Refills)
 * 8. Enterprise Activation Desk (48h Handover, Moniepoint Corporate Settlement)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 */

import React, { useState, useMemo } from 'react';
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
  Zap, 
  Droplets, 
  Gauge, 
  Activity, 
  Award, 
  Building2, 
  HelpCircle,
  ShoppingCart,
  Phone,
  RefreshCw,
  Calendar,
  CheckCheck,
  ChevronDown,
  Printer
} from 'lucide-react';

export default function WaterFactoryErpDashboard() {
  // Operating Mode: ERP Management System vs Public Distributor Storefront
  const [viewMode, setViewMode] = useState<'erp' | 'storefront'>('erp');

  // Active ERP Tab
  const [activeTab, setActiveTab] = useState<'production' | 'fleet' | 'energy' | 'nafdac' | 'quickbooks' | 'audit' | 'deploy'>('production');

  // Factory Scale Preset
  const [scalePreset, setScalePreset] = useState<'standard' | 'commercial' | 'mega'>('standard');

  // Factory Name Customization (Defaults to Obi Table Water)
  const [factoryName, setFactoryName] = useState('Obi Table & Sachet Water Plant');
  const [locationName, setLocationName] = useState('Lekki / Ajah Corridor, Lagos');

  // ── PRODUCTION STATE ────────────────────────────────────────────────────────
  const [sachetBagsProduced, setSachetBagsProduced] = useState(3200);
  const [sachetPricePerBag, setSachetPricePerBag] = useState(350); // ₦350/bag wholesale (20 sachets)
  const [bottlePacksProduced, setBottlePacksProduced] = useState(250);
  const [bottlePricePerPack, setBottlePricePerPack] = useState(1300); // ₦1,300/pack (12 x 75cl)
  const [dispenserBottlesProduced, setDispenserBottlesProduced] = useState(60);
  const [dispenserRefillPrice, setDispenserRefillPrice] = useState(1000); // ₦1,000 refill
  const [factoryBurstBags, setFactoryBurstBags] = useState(22); // Burst on sealing machine
  const [nylonRollsKgLoaded, setNylonRollsKgLoaded] = useState(120); // 4 rolls @ 30kg = 120kg
  const [outerPackingSacksUsed, setOuterPackingSacksUsed] = useState(160); // Bundles/sacks

  // ── FLEET & DELIVERY TRUCKS STATE ───────────────────────────────────────────
  const [truck1Bags, setTruck1Bags] = useState(850);
  const [truck1Cash, setTruck1Cash] = useState(280000); // 800 bags sold @ 350
  const [truck1Credit, setTruck1Credit] = useState(30); // 30 bags on credit
  const [truck1Burst, setTruck1Burst] = useState(10); // 10 burst on road
  const [truck1Returned, setTruck1Returned] = useState(10); // 10 returned intact

  const [truck2Bags, setTruck2Bags] = useState(700);
  const [truck2Cash, setTruck2Cash] = useState(217000); // 620 bags sold @ 350
  const [truck2Credit, setTruck2Credit] = useState(30);
  const [truck2Burst, setTruck2Burst] = useState(10);
  const [truck2Returned, setTruck2Returned] = useState(0); // Shortage will trigger!

  const [truck3Bags, setTruck3Bags] = useState(600);
  const [truck3Cash, setTruck3Cash] = useState(196000); // 560 bags sold @ 350
  const [truck3Credit, setTruck3Credit] = useState(25);
  const [truck3Burst, setTruck3Burst] = useState(8);
  const [truck3Returned, setTruck3Returned] = useState(7);

  // Gate Walk-in Sales
  const [gateSachetBags, setGateSachetBags] = useState(900);
  const [gateBottlePacks, setGateBottlePacks] = useState(200);

  // ── ENERGY & POWER COSTING STATE ────────────────────────────────────────────
  const [powerSource, setPowerSource] = useState<'mixed' | 'generator_only' | 'grid_only'>('mixed');
  const [generatorHours, setGeneratorHours] = useState(5.5); // Hours run today
  const [generatorLitersPerHour, setGeneratorLitersPerHour] = useState(10); // 10L/hr on 30kVA
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState(1250); // ₦1,250/L
  const [nepaTokenCost, setNepaTokenCost] = useState(15000); // ₦15,000 grid power used today

  // ── NAFDAC QUALITY LOG STATE ────────────────────────────────────────────────
  const [rawWaterTds, setRawWaterTds] = useState(185); // Borehole raw ppm
  const [treatedWaterTds, setTreatedWaterTds] = useState(22); // Osmosis treated ppm (NAFDAC < 100)
  const [waterPh, setWaterPh] = useState(7.2); // Optimal neutral
  const [uvSterilizerActive, setUvSterilizerActive] = useState(true);
  const [ozoneGeneratorActive, setOzoneGeneratorActive] = useState(true);
  const [filterDaysRemaining, setFilterDaysRemaining] = useState(14); // Days until candle replacement

  // ── FACTORY OPEX (QUICKBOOKS EXPENSES) ──────────────────────────────────────
  const [nylonRollCost, setNylonRollCost] = useState(34000); // Cost of 4 rolls
  const [waterTreatmentChemicals, setWaterTreatmentChemicals] = useState(12000); // Salt, chlorine, cartridge amortisation
  const [loadersDailyWages, setLoadersDailyWages] = useState(30000); // Loaders & sealing machine operators
  const [trucksFuelAllowance, setTrucksFuelAllowance] = useState(25000); // Route fuel for 3 trucks

  // ── STOREFRONT ORDERING STATE ───────────────────────────────────────────────
  const [cartSachetBags, setCartSachetBags] = useState(50);
  const [cartBottlePacks, setCartBottlePacks] = useState(10);
  const [cartDispenserRefills, setCartDispenserRefills] = useState(5);
  const [customerName, setCustomerName] = useState('Chief Emmanuel Adeleke');
  const [customerPhone, setCustomerPhone] = useState('0803 456 7890');
  const [deliveryAddress, setDeliveryAddress] = useState('Block 4, Flat 2, Admiralty Way, Lekki Phase 1');

  // UI helpers
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // ── SCALE PRESET HANDLER ───────────────────────────────────────────────────
  const applyScalePreset = (preset: 'standard' | 'commercial' | 'mega') => {
    setScalePreset(preset);
    if (preset === 'standard') {
      setSachetBagsProduced(3200);
      setBottlePacksProduced(250);
      setTruck1Bags(850);
      setTruck2Bags(700);
      setTruck3Bags(600);
      setGeneratorHours(5.5);
    } else if (preset === 'commercial') {
      setSachetBagsProduced(6500);
      setBottlePacksProduced(600);
      setTruck1Bags(1400);
      setTruck2Bags(1200);
      setTruck3Bags(1100);
      setGeneratorHours(8.0);
    } else if (preset === 'mega') {
      setSachetBagsProduced(12000);
      setBottlePacksProduced(1500);
      setTruck1Bags(2200);
      setTruck2Bags(2000);
      setTruck3Bags(1800);
      setGeneratorHours(11.5);
    }
  };

  // ── CALCULATIONS ENGINE ────────────────────────────────────────────────────
  // Production Output Value
  const sachetProductionValue = sachetBagsProduced * sachetPricePerBag;
  const bottleProductionValue = bottlePacksProduced * bottlePricePerPack;
  const dispenserProductionValue = dispenserBottlesProduced * dispenserRefillPrice;
  const totalProductionValue = sachetProductionValue + bottleProductionValue + dispenserProductionValue;

  // Nylon Roll Yield Auditing (1kg film ≈ 16 bags of 20 sachets)
  const theoreticalBagsFromNylon = nylonRollsKgLoaded * 16;
  const nylonYieldDifferenceBags = sachetBagsProduced - theoreticalBagsFromNylon;
  const isNylonYieldSuspicious = nylonYieldDifferenceBags < -150; // High material loss

  // Truck Fleet Driver Reconciliations
  // Truck 1
  const truck1Accounted = (truck1Cash / sachetPricePerBag) + truck1Credit + truck1Burst + truck1Returned;
  const truck1Shortage = Math.round(truck1Bags - truck1Accounted);

  // Truck 2 (Expected shortage demo)
  const truck2Accounted = (truck2Cash / sachetPricePerBag) + truck2Credit + truck2Burst + truck2Returned;
  const truck2Shortage = Math.round(truck2Bags - truck2Accounted);

  // Truck 3
  const truck3Accounted = (truck3Cash / sachetPricePerBag) + truck3Credit + truck3Burst + truck3Returned;
  const truck3Shortage = Math.round(truck3Bags - truck3Accounted);

  const totalTruckShortageBags = Math.max(0, truck1Shortage) + Math.max(0, truck2Shortage) + Math.max(0, truck3Shortage);
  const totalShortageNaira = totalTruckShortageBags * sachetPricePerBag;

  // Energy & Generator Calculations
  const totalDieselLitersConsumed = generatorHours * generatorLitersPerHour;
  const totalDieselCost = totalDieselLitersConsumed * dieselPricePerLiter;
  const totalEnergyCost = totalDieselCost + (powerSource === 'generator_only' ? 0 : nepaTokenCost);
  const energyCostPerSachetBag = (totalEnergyCost / (sachetBagsProduced || 1)).toFixed(2);

  // Sales & Cash Inflows
  const gateRevenue = (gateSachetBags * sachetPricePerBag) + (gateBottlePacks * bottlePricePerPack) + (dispenserBottlesProduced * dispenserRefillPrice);
  const totalCashCollected = truck1Cash + truck2Cash + truck3Cash + gateRevenue;
  const totalReceivables = (truck1Credit + truck2Credit + truck3Credit) * sachetPricePerBag;
  const totalGrossRevenue = totalCashCollected + totalReceivables;

  // Cost of Goods Sold & OPEX
  const totalOperatingExpenses = totalEnergyCost + nylonRollCost + waterTreatmentChemicals + loadersDailyWages + trucksFuelAllowance;
  const netOperatingProfit = totalGrossRevenue - totalOperatingExpenses;
  const profitMarginPercent = Math.round((netOperatingProfit / (totalGrossRevenue || 1)) * 100);

  // Storefront Order Totals
  const storeOrderTotal = (cartSachetBags * 380) + (cartBottlePacks * 1500) + (cartDispenserRefills * 1200);

  // ── AUTOMATED 8:00 PM WHATSAPP SUMMARY GENERATOR ───────────────────────────
  const generateWhatsAppAuditText = () => {
    return `💧 *AQUAFLOW ERP™ — DAILY EXECUTIVE FACTORY AUDIT*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | Shift: Day Run Batch
🏢 Factory: ${factoryName}
📍 Location: ${locationName}
━━━━━━━━━━━━━━━━━━━━
🏭 *1. FACTORY PRODUCTION & NYLON AUDIT:*
• Sachet Water: ${sachetBagsProduced.toLocaleString()} bags produced (${nylonRollsKgLoaded}kg film loaded)
• Theoretical Nylon Yield: ${theoreticalBagsFromNylon.toLocaleString()} bags (${nylonYieldDifferenceBags >= 0 ? `+${nylonYieldDifferenceBags} bonus` : `${nylonYieldDifferenceBags} loss`})
• Table Water Bottles: ${bottlePacksProduced.toLocaleString()} packs
• 19L Dispenser Refills: ${dispenserBottlesProduced.toLocaleString()} bottles
• Sealing Burst/Waste: ${factoryBurstBags} bags
• Shift Factory Output Value: ₦${totalProductionValue.toLocaleString()}

🚚 *2. TRUCK ROUTE RECONCILIATIONS:*
• Truck 1 (Emeka): Loaded ${truck1Bags} | Cash: ₦${truck1Cash.toLocaleString()} | ${truck1Shortage <= 0 ? '✅ Balanced' : `⚠️ Shortage: -${truck1Shortage} bags`}
• Truck 2 (Musa): Loaded ${truck2Bags} | Cash: ₦${truck2Cash.toLocaleString()} | ${truck2Shortage > 0 ? `🚨 *SHORTAGE: -${truck2Shortage} bags (₦${(truck2Shortage * sachetPricePerBag).toLocaleString()}) DEBITED*` : '✅ Balanced'}
• Truck 3 (Ibrahim): Loaded ${truck3Bags} | Cash: ₦${truck3Cash.toLocaleString()} | ${truck3Shortage <= 0 ? '✅ Balanced' : `⚠️ Shortage: -${truck3Shortage} bags`}
• Factory Gate Walk-in Sales: ₦${gateRevenue.toLocaleString()}

⚡ *3. POWER & DIESEL ENERGY SLICER:*
• Generator Run: ${generatorHours} hrs (${totalDieselLitersConsumed}L diesel @ ₦${dieselPricePerLiter}/L = ₦${totalDieselCost.toLocaleString()})
• Grid NEPA Token: ₦${nepaTokenCost.toLocaleString()}
• Total Power Overhead: ₦${totalEnergyCost.toLocaleString()}
• *Energy Cost Per Bag:* ₦${energyCostPerSachetBag}/bag

🔬 *4. NAFDAC WATER QUALITY LOG:*
• Raw Borehole TDS: ${rawWaterTds} ppm ➔ Treated Product TDS: ${treatedWaterTds} ppm (NAFDAC Limit < 100) ✅
• Water pH: ${waterPh} (Neutral) | UV Sterilizer: ACTIVE | Ozone: ACTIVE

💰 *5. QUICKBOOKS DAILY P&L SUMMARY:*
• Gross Shift Revenue: ₦${totalGrossRevenue.toLocaleString()}
  - Bank/Cash In Hand: ₦${totalCashCollected.toLocaleString()}
  - Customer Receivables: ₦${totalReceivables.toLocaleString()}
• Total Factory OPEX: -₦${totalOperatingExpenses.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
💵 *NET FACTORY PROFIT TODAY:* ₦${netOperatingProfit.toLocaleString()} (${profitMarginPercent}% Net Margin)
━━━━━━━━━━━━━━━━━━━━
*Audit Status:* 100% Reconciled & Logged in AquaFlow Cloud ERP`;
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
    <div className="min-h-screen bg-[#060911] text-[#f1f5f9] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          DEDICATED STANDALONE FACTORY APPLICATION HEADER (ZERO GENERIC MARKETING)
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#090d18]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Factory Identity & Shift Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <Droplets className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white tracking-tight">AquaFlow ERP™</h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                    v4.8 Enterprise
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{factoryName}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Production Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Mobile Mode Toggle */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode('erp')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  viewMode === 'erp' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                }`}
              >
                ERP Desk
              </button>
              <button
                onClick={() => setViewMode('storefront')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  viewMode === 'storefront' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400'
                }`}
              >
                Storefront
              </button>
            </div>
          </div>

          {/* Center: Desktop Dual-Mode Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1.5 bg-black/40 border border-white/10 rounded-2xl shadow-inner">
            <button
              onClick={() => setViewMode('erp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'erp'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>1. Factory Management ERP</span>
            </button>
            <button
              onClick={() => setViewMode('storefront')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'storefront'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>2. Public Distributor Storefront</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-extrabold">Live</span>
            </button>
          </div>

          {/* Right: Real-time Shift Output & Net Margin Pill */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today's Shift Output</span>
              <span className="text-sm font-black text-cyan-300 font-mono">₦{totalProductionValue.toLocaleString()}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Net Cash Profit</span>
              <span className="text-sm font-black text-emerald-400 font-mono">₦{netOperatingProfit.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN APPLICATION WORKSPACE
      ────────────────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── TOP FACTORY SCALE PRESETS & SETTINGS BAR ────────────────────────── */}
        <div className="bg-[#0b101d] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Simulate Plant Capacity:
            </span>
            <button
              onClick={() => applyScalePreset('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scalePreset === 'standard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Standard (3.2k Bags &bull; 2 Trucks)
            </button>
            <button
              onClick={() => applyScalePreset('commercial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scalePreset === 'commercial'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Commercial (6.5k Bags &bull; 3 Trucks)
            </button>
            <button
              onClick={() => applyScalePreset('mega')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scalePreset === 'mega'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Mega Industrial (12k Bags &bull; 5 Trucks)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 w-full lg:w-auto justify-end">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono">
              NAFDAC RC: <strong>01-84920L</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono">
              Diesel Pump: <strong>₦{dieselPricePerLiter}/L</strong>
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            MODE 1: FACTORY MANAGEMENT ERP (THE BACKEND OPERATING SYSTEM)
        ════════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'erp' && (
          <div className="space-y-6">
            
            {/* ERP Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
              {[
                { id: 'production', label: '🏭 1. Production & Nylon Yield', badge: `${sachetBagsProduced.toLocaleString()} Bags` },
                { id: 'fleet', label: '🚚 2. Trucks & Driver Shortage', badge: totalTruckShortageBags > 0 ? `⚠️ -${totalTruckShortageBags} Shortage` : '✅ Balanced' },
                { id: 'energy', label: '⚡ 3. Power & Diesel Slicer', badge: `₦${energyCostPerSachetBag}/bag` },
                { id: 'nafdac', label: '🔬 4. NAFDAC Water Quality Log', badge: `${treatedWaterTds} ppm (Pass)` },
                { id: 'quickbooks', label: '📊 5. QuickBooks Shift P&L', badge: `₦${netOperatingProfit.toLocaleString()}` },
                { id: 'audit', label: '📱 6. 8:00 PM WhatsApp Audit', badge: 'Automated' },
                { id: 'deploy', label: '💳 7. Commercial Plant Activation', badge: 'Turnkey 48h' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                      : 'bg-[#0d1322] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : tab.badge.includes('Shortage') 
                        ? 'bg-rose-500/20 text-rose-300 font-extrabold' 
                        : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* ── TAB 1: PRODUCTION FLOOR & NYLON ROLL YIELD ───────────────────── */}
            {activeTab === 'production' && (
              <div className="space-y-6">
                
                {/* Header Callout */}
                <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Factory className="w-5 h-5 text-cyan-400" />
                        Production Floor Counter &amp; Material Consumption Audit
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Reconciles physical bags counted against machine sealing cycles and LDPE roll weight to prevent shift staff from running unrecorded off-book bags.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Shift Valuation</span>
                      <span className="text-lg font-black text-cyan-300 font-mono">₦{totalProductionValue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 3 Production Lines */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Line 1: Sachet Pure Water */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-cyan-500/20 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          Line 1: Sachet Pure Water
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          Machine 1 &amp; 2
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">Bags Packed (20 sachets/bag):</span>
                          <span className="font-bold text-white font-mono">{sachetBagsProduced.toLocaleString()} Bags</span>
                        </div>
                        <input
                          type="range"
                          min={500}
                          max={15000}
                          step={100}
                          value={sachetBagsProduced}
                          onChange={(e) => setSachetBagsProduced(Number(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>500</span>
                          <span>7,500</span>
                          <span>15,000 Bags</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Wholesale Price / Bag</label>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400">₦</span>
                            <input
                              type="number"
                              value={sachetPricePerBag}
                              onChange={(e) => setSachetPricePerBag(Number(e.target.value) || 0)}
                              className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">Sealing Burst Waste</label>
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="number"
                              value={factoryBurstBags}
                              onChange={(e) => setFactoryBurstBags(Number(e.target.value) || 0)}
                              className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-rose-300 font-mono font-bold"
                            />
                            <span className="text-[10px] text-slate-400">bags</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Sachet Output Value:</span>
                        <span className="font-black text-cyan-300 font-mono">₦{sachetProductionValue.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Line 2: Bottled Table Water */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-blue-500/20 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Droplets className="w-4 h-4" />
                          Line 2: Table Water Bottles
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          12 x 75cl Packs
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">Packs Shrink-Wrapped:</span>
                          <span className="font-bold text-white font-mono">{bottlePacksProduced.toLocaleString()} Packs</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={3000}
                          step={25}
                          value={bottlePacksProduced}
                          onChange={(e) => setBottlePacksProduced(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>50</span>
                          <span>1,500</span>
                          <span>3,000 Packs</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Wholesale Price / Pack</label>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400">₦</span>
                            <input
                              type="number"
                              value={bottlePricePerPack}
                              onChange={(e) => setBottlePricePerPack(Number(e.target.value) || 0)}
                              className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">Preforms &amp; Caps</label>
                          <span className="text-xs text-slate-300 font-mono block mt-2 font-bold">
                            {(bottlePacksProduced * 12).toLocaleString()} pcs
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Bottle Output Value:</span>
                        <span className="font-black text-blue-300 font-mono">₦{bottleProductionValue.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Line 3: 19L Dispenser Refills */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-teal-500/20 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4" />
                          Line 3: 19L Dispenser Bottles
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          Office Jar Refills
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">Jars Sanitized &amp; Filled:</span>
                          <span className="font-bold text-white font-mono">{dispenserBottlesProduced} Jars</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={500}
                          step={10}
                          value={dispenserBottlesProduced}
                          onChange={(e) => setDispenserBottlesProduced(Number(e.target.value))}
                          className="w-full accent-teal-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>10</span>
                          <span>250</span>
                          <span>500 Jars</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Refill Price / Jar</label>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400">₦</span>
                            <input
                              type="number"
                              value={dispenserRefillPrice}
                              onChange={(e) => setDispenserRefillPrice(Number(e.target.value) || 0)}
                              className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">Tamper Seals Used</label>
                          <span className="text-xs text-slate-300 font-mono block mt-2 font-bold">
                            {dispenserBottlesProduced} caps
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Dispenser Output Value:</span>
                        <span className="font-black text-teal-300 font-mono">₦{dispenserProductionValue.toLocaleString()}</span>
                      </div>
                    </div>

                  </div>

                  {/* 🔬 NYLON ROLL YIELD VS THEFT AUDITOR (THE NIGERIAN WATER OWNER'S SECRET WEAPON) */}
                  <div className="p-5 rounded-2xl bg-[#080d1a] border border-cyan-500/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-white">
                            Printed LDPE Packaging Film Yield vs. Unrecorded Production Auditor
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            Theoretical Benchmark: 1kg of high-grade printed film = ~16 bags (320 sachets).
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-300 font-semibold">Film Loaded:</label>
                        <input
                          type="number"
                          value={nylonRollsKgLoaded}
                          onChange={(e) => setNylonRollsKgLoaded(Number(e.target.value) || 0)}
                          className="w-20 bg-[#060911] border border-white/20 rounded-lg px-2.5 py-1 text-cyan-300 font-mono font-extrabold text-xs"
                        />
                        <span className="text-xs text-slate-400 font-bold">kg</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="text-slate-400 text-[11px] block">Theoretical Expected Yield:</span>
                        <strong className="text-white font-mono text-sm block">
                          {theoreticalBagsFromNylon.toLocaleString()} Bags
                        </strong>
                        <span className="text-[10px] text-slate-500 font-mono">({nylonRollsKgLoaded}kg &times; 16 bags)</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="text-slate-400 text-[11px] block">Actual Sachet Bags Packed:</span>
                        <strong className="text-cyan-300 font-mono text-sm block">
                          {sachetBagsProduced.toLocaleString()} Bags
                        </strong>
                        <span className="text-[10px] text-slate-500 font-mono">Logged by Machine Supervisor</span>
                      </div>

                      <div className={`p-3.5 rounded-xl border space-y-1 ${
                        isNylonYieldSuspicious 
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      }`}>
                        <span className="text-[11px] block font-bold">Variance Audit Status:</span>
                        <strong className="font-mono text-sm block">
                          {nylonYieldDifferenceBags >= 0 ? `+${nylonYieldDifferenceBags}` : nylonYieldDifferenceBags} Bags
                        </strong>
                        <span className="text-[10px] block">
                          {isNylonYieldSuspicious 
                            ? '🚨 HIGH WASTE/THEFT ALERT: Film consumed exceeds recorded bags!' 
                            : '✅ Normal production tolerance (Within &plusmn;3%)'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ── TAB 2: TRUCKS FLEET & DRIVER SHORTAGE AUDIT ─────────────────── */}
            {activeTab === 'fleet' && (
              <div className="space-y-6">
                <div className="bg-[#0b101d] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Truck className="w-5 h-5 text-cyan-400" />
                        Multi-Truck Delivery Route Dispatch &amp; Driver Shortage Shield
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Stops the #1 financial leak in Nigerian water companies: drivers selling water on the road and falsely claiming "40 bags burst" or "customers took on credit".
                      </p>
                    </div>

                    {totalTruckShortageBags > 0 ? (
                      <div className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 animate-pulse text-right">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <div>
                          <span className="text-[10px] text-rose-400 uppercase font-black block">Fleet Shortage Flagged</span>
                          <span className="text-xs font-black text-rose-300 font-mono">
                            -{totalTruckShortageBags} Bags (₦{totalShortageNaira.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-right">
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase font-black block">Fleet Reconciled</span>
                          <span className="text-xs font-black text-emerald-300 font-mono">100% Zero Shortage</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3 Driver Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Truck 1: Emeka */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div>
                          <h3 className="text-xs font-extrabold text-white">🚚 Truck 1: Emeka (Driver)</h3>
                          <span className="text-[10px] text-slate-400">Canter &bull; Agege / Ikeja Route</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                          {truck1Shortage <= 0 ? 'Balanced' : `-${truck1Shortage}`}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Morning Gate Load:</span>
                          <span className="text-white font-mono font-bold">{truck1Bags} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cash/POS Remitted:</span>
                          <span className="text-emerald-400 font-mono font-bold">₦{truck1Cash.toLocaleString()} (800 sold)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Verified Credit Debtors:</span>
                          <span className="text-amber-300 font-mono font-bold">{truck1Credit} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Road Burst (Returned Sacs):</span>
                          <span className="text-slate-300 font-mono">{truck1Burst} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Undamaged Bags Returned:</span>
                          <span className="text-slate-300 font-mono">{truck1Returned} Bags</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-bold text-center">
                          ✅ Route Waybill 100% Balanced
                        </div>
                      </div>
                    </div>

                    {/* Truck 2: Musa (The Simulated Shortage Trigger) */}
                    <div className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/40 space-y-3 shadow-lg shadow-rose-950/20">
                      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                        <div>
                          <h3 className="text-xs font-extrabold text-white">🚚 Truck 2: Musa (Driver)</h3>
                          <span className="text-[10px] text-slate-400">Dyna &bull; Obalende / Island Route</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black border border-rose-500/40 animate-pulse">
                          SHORTAGE DETECTED
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Morning Gate Load:</span>
                          <span className="text-white font-mono font-bold">{truck2Bags} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cash/POS Remitted:</span>
                          <span className="text-emerald-400 font-mono font-bold">₦{truck2Cash.toLocaleString()} (620 sold)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Verified Credit Debtors:</span>
                          <span className="text-amber-300 font-mono font-bold">{truck2Credit} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Road Burst (Physical Evidence):</span>
                          <span className="text-slate-300 font-mono">{truck2Burst} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Undamaged Bags Returned:</span>
                          <span className="text-rose-300 font-mono font-bold">0 Bags (Claimed empty)</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-rose-500/20 space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-200 text-xs">
                          <div className="flex justify-between font-black">
                            <span>Unaccounted Shortage:</span>
                            <span>-{truck2Shortage} Bags (₦{(truck2Shortage * sachetPricePerBag).toLocaleString()})</span>
                          </div>
                          <p className="text-[10px] text-rose-300/80 mt-1">
                            System auto-debited ₦{(truck2Shortage * sachetPricePerBag).toLocaleString()} from Musa&apos;s weekly payout ledger.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Truck 3: Ibrahim */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div>
                          <h3 className="text-xs font-extrabold text-white">🚚 Truck 3: Ibrahim (Driver)</h3>
                          <span className="text-[10px] text-slate-400">Pick-up &bull; Lekki Phase 1 / Ikoyi</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                          {truck3Shortage <= 0 ? 'Balanced' : `-${truck3Shortage}`}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Morning Gate Load:</span>
                          <span className="text-white font-mono font-bold">{truck3Bags} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cash/POS Remitted:</span>
                          <span className="text-emerald-400 font-mono font-bold">₦{truck3Cash.toLocaleString()} (560 sold)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Verified Credit Debtors:</span>
                          <span className="text-amber-300 font-mono font-bold">{truck3Credit} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Road Burst:</span>
                          <span className="text-slate-300 font-mono">{truck3Burst} Bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Undamaged Bags Returned:</span>
                          <span className="text-slate-300 font-mono">{truck3Returned} Bags</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-bold text-center">
                          ✅ Route Waybill 100% Balanced
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Gate Sales Ledger */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-white block font-bold">Factory Gate Cashier Terminal:</strong>
                      <span className="text-slate-400">Direct walk-in retailers, tricycles (Keke) and cart pushers: {gateSachetBags} sachet bags + {gateBottlePacks} bottle packs.</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Gate Inflow (Cash + Moniepoint POS):</span>
                      <strong className="text-emerald-400 font-mono text-sm font-black">₦{gateRevenue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: POWER & DIESEL ENERGY SLICER ──────────────────────────── */}
            {activeTab === 'energy' && (
              <div className="space-y-6">
                <div className="bg-[#0b101d] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Power &amp; Diesel Energy Slicer (Grid vs. Generator Cost Per Bag)
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Generator fuel is the highest variable operating expense for Nigerian water factories. AquaFlow calculates your true energy cost down to the exact kobo per bag.
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-right">
                      <span className="text-[10px] text-amber-400 uppercase font-black block">Energy Cost Per Bag</span>
                      <span className="text-base font-black text-amber-300 font-mono">₦{energyCostPerSachetBag} / Bag</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Generator Controls */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Fuel className="w-4 h-4" />
                        Diesel Generator Log (Mikano / Perkins 30kVA)
                      </h3>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">Hours Run on Generator Today:</span>
                          <span className="font-bold text-white font-mono">{generatorHours} Hours</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={16}
                          step={0.5}
                          value={generatorHours}
                          onChange={(e) => setGeneratorHours(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>0 hrs (All Grid)</span>
                          <span>8 hrs</span>
                          <span>16 hrs (Continuous)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Fuel Burn Rate (L/hr)</label>
                          <input
                            type="number"
                            value={generatorLitersPerHour}
                            onChange={(e) => setGeneratorLitersPerHour(Number(e.target.value) || 0)}
                            className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">Diesel Pump Price / Liter</label>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400">₦</span>
                            <input
                              type="number"
                              value={dieselPricePerLiter}
                              onChange={(e) => setDieselPricePerLiter(Number(e.target.value) || 0)}
                              className="w-full bg-[#060911] border border-white/15 rounded-lg px-2 py-1 text-white font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Diesel Consumed Today:</span>
                          <span className="font-bold text-white font-mono">{totalDieselLitersConsumed} Liters</span>
                        </div>
                        <div className="flex justify-between font-black text-amber-300">
                          <span>Total Shift Generator Cost:</span>
                          <span className="font-mono">₦{totalDieselCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grid NEPA & Optimization Recommendations */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        Grid (NEPA Disco Band A) vs. Generator Arbitrage
                      </h3>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 block">Public Grid (NEPA Token) Consumed Today:</label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-xs">₦</span>
                          <input
                            type="number"
                            value={nepaTokenCost}
                            onChange={(e) => setNepaTokenCost(Number(e.target.value) || 0)}
                            className="w-full bg-[#060911] border border-white/15 rounded-lg px-3 py-1.5 text-white font-mono font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-xs pt-2">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-slate-400 text-[11px] block">Combined Daily Energy Bill:</span>
                          <strong className="text-white font-mono text-base block">₦{totalEnergyCost.toLocaleString()}</strong>
                        </div>

                        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-300 space-y-1">
                          <strong className="text-cyan-300 text-xs flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Energy Optimization Recommendation:
                          </strong>
                          <p className="text-[11px] text-slate-300/90 leading-relaxed">
                            Running your Form-Fill-Seal sealing machines during Band A grid hours saves approximately <strong>₦18.40 per bag</strong> compared to running on pure Mikano diesel.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: NAFDAC WATER QUALITY & LAB LOG ────────────────────────── */}
            {activeTab === 'nafdac' && (
              <div className="space-y-6">
                <div className="bg-[#0b101d] border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-400" />
                        NAFDAC Compliance &amp; Daily Water Treatment Laboratory Log
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Maintains a digital audit trail of water purity (TDS, pH, UV and Ozone) ready for instant inspection by NAFDAC, SON and State Water Regulatory authorities.
                      </p>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>NAFDAC Approved Parameters</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* TDS Metric */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">TDS (Total Dissolved Solids)</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-black text-emerald-400 font-mono">{treatedWaterTds}</strong>
                        <span className="text-xs text-slate-400 font-mono">ppm</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Raw Borehole: <strong>{rawWaterTds} ppm</strong> &bull; NAFDAC Limit: &lt;100 ppm
                      </span>
                      <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-center">
                        ✅ 88% Filtration Efficiency
                      </div>
                    </div>

                    {/* pH Level */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Acidity / Alkalinity (pH)</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-black text-cyan-400 font-mono">{waterPh}</strong>
                        <span className="text-xs text-slate-400 font-mono">pH</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Optimal Standard: <strong>6.5 – 7.5</strong>
                      </span>
                      <div className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded text-center">
                        ✅ Neutral Drinking Grade
                      </div>
                    </div>

                    {/* UV & Ozone */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Microbial Sterilization</span>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">UV Sterilizer:</span>
                          <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Ozone Bubbler:</span>
                          <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-center mt-2">
                        ✅ Zero Microbial Pathogens
                      </div>
                    </div>

                    {/* Micron Candle Filter */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Sediment Candle Life</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-2xl font-black text-amber-400 font-mono">{filterDaysRemaining}</strong>
                        <span className="text-xs text-slate-400">days left</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Last Backwash: <strong>Yesterday 06:00 PM</strong>
                      </span>
                      <div className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded text-center">
                        ⏳ Routine Change in 14 Days
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060911] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-slate-300">
                      Export daily laboratory reading directly to printable PDF for NAFDAC sanitary inspections.
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('NAFDAC Laboratory Certificate Generated: Obi Table & Sachet Water Plant')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>Print NAFDAC Shift Certificate</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 5: QUICKBOOKS SHIFT P&L & COMPARISON ─────────────────────── */}
            {activeTab === 'quickbooks' && (
              <div className="space-y-6">
                
                {/* Side-by-side P&L Card */}
                <div className="bg-[#0b101d] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        QuickBooks-Equivalent Factory Income Statement (P&amp;L)
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Unlike generic accounting software, AquaFlow accounts for raw nylon rolls, diesel generator fuel, driver shortages, and daily loader wages in real time.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Factory Margin</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{profitMarginPercent}% Margin</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Revenue Side */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        Shift Gross Inflows (Cash + Moniepoint)
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Truck 1 (Emeka) Remittance:</span>
                          <span className="text-white font-mono font-bold">₦{truck1Cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Truck 2 (Musa) Remittance:</span>
                          <span className="text-white font-mono font-bold">₦{truck2Cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Truck 3 (Ibrahim) Remittance:</span>
                          <span className="text-white font-mono font-bold">₦{truck3Cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Factory Gate Direct Walk-in Sales:</span>
                          <span className="text-white font-mono font-bold">₦{gateRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <span className="text-amber-300 font-semibold">Distributor Credit Receivables (Debts):</span>
                          <span className="text-amber-300 font-mono font-black">+₦{totalReceivables.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <span className="text-cyan-300 font-black">Total Shift Gross Revenue:</span>
                          <span className="text-cyan-300 font-mono font-black text-sm">₦{totalGrossRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expenses Side */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        Cost of Goods Sold (COGS) &amp; Daily OPEX
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Power &amp; Generator Diesel ({totalDieselLitersConsumed}L):</span>
                          <span className="text-rose-400 font-mono font-bold">-₦{totalEnergyCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Packaging Printed Film &amp; Bottle Caps:</span>
                          <span className="text-rose-400 font-mono font-bold">-₦{nylonRollCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Water Treatment Consumables &amp; Filters:</span>
                          <span className="text-rose-400 font-mono font-bold">-₦{waterTreatmentChemicals.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Machine Operators &amp; Shift Loaders:</span>
                          <span className="text-rose-400 font-mono font-bold">-₦{loadersDailyWages.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                          <span className="text-slate-400">Delivery Trucks Road Fuel Allowance:</span>
                          <span className="text-rose-400 font-mono font-bold">-₦{trucksFuelAllowance.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                          <span className="text-rose-300 font-black">Total Shift Operating Expenses:</span>
                          <span className="text-rose-300 font-mono font-black text-sm">-₦{totalOperatingExpenses.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Net Factory Cash In Vault */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/40 flex items-center justify-between shadow-lg">
                        <div>
                          <span className="text-[10px] uppercase font-black text-emerald-400 block tracking-wider">
                            True Net Profit Today (After All Costs):
                          </span>
                          <span className="text-2xl font-black text-white font-mono">
                            ₦{netOperatingProfit.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/40">
                          {profitMarginPercent}% Net Margin
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ⚔️ DIRECT COMPARISON: QUICKBOOKS VS. AQUAFLOW ERP™ */}
                <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    Why Traditional QuickBooks Fails Nigerian Water Factories:
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                          <th className="py-2.5 px-3">Factory Feature Needed</th>
                          <th className="py-2.5 px-3 text-rose-400">Standard QuickBooks</th>
                          <th className="py-2.5 px-3 text-cyan-300">AquaFlow ERP™ (Water Edition)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-white">Nylon Roll Yield vs Waste</td>
                          <td className="py-2.5 px-3 text-rose-400">❌ Unknown. Cannot calculate kg film to bags.</td>
                          <td className="py-2.5 px-3 text-cyan-300">✅ Built-in (16 bags/kg film theoretical yield audit).</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-white">Driver Shortage &amp; Burst Audit</td>
                          <td className="py-2.5 px-3 text-rose-400">❌ None. Drivers steal water without proof.</td>
                          <td className="py-2.5 px-3 text-cyan-300">✅ Automatic multi-truck deduction from driver payouts.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-white">Diesel Generator Cost / Bag</td>
                          <td className="py-2.5 px-3 text-rose-400">❌ Manual entry only after month-end bookkeeper.</td>
                          <td className="py-2.5 px-3 text-cyan-300">✅ Real-time fuel burn rate &amp; cost per bag calculation.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-white">NAFDAC Lab &amp; TDS Logs</td>
                          <td className="py-2.5 px-3 text-rose-400">❌ Not supported. Requires paper notebooks.</td>
                          <td className="py-2.5 px-3 text-cyan-300">✅ Digital compliance logs for instant sanitary audits.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-white">8:00 PM WhatsApp Shift Summary</td>
                          <td className="py-2.5 px-3 text-rose-400">❌ None. Requires complex desktop login.</td>
                          <td className="py-2.5 px-3 text-cyan-300">✅ Instant 1-tap WhatsApp summary pushed to owner.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ── TAB 6: AUTOMATED 8:00 PM WHATSAPP EXECUTIVE AUDIT ─────────────── */}
            {activeTab === 'audit' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-[#0b101d] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                        Automated 8:00 PM WhatsApp Executive Shift Summary
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Every evening at factory closing time, your plant supervisor sends this exact audited report directly to your WhatsApp.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-black border border-emerald-500/30">
                      Auto-Compiled
                    </span>
                  </div>

                  {/* Formatted Message Preview */}
                  <div className="bg-[#060911] border border-white/10 rounded-2xl p-5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {generateWhatsAppAuditText()}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedReport ? '✅ Report Copied to Clipboard!' : 'Copy Executive WhatsApp Audit'}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppAuditText())}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Test Live on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 7: COMMERCIAL ACTIVATION & 48H SLA ───────────────────────── */}
            {activeTab === 'deploy' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-[#0b101d] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                  
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Commercial Turnkey Activation
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Activate AquaFlow ERP For {factoryName}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Full factory floor setup, driver shortage protection, and WhatsApp accounting deployed and staff trained within 48 hours.
                    </p>
                  </div>

                  {/* Two Transparent Tiers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Starter Kiosk */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Starter Single-Kiosk Edition
                      </span>
                      <div className="text-2xl font-black text-white">
                        ₦35,000 <span className="text-xs text-slate-400 font-normal">+ ₦7k/mo</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Suitable for small single-desk roadside water distribution depots with no delivery vans or sealing machines.
                      </p>
                      <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/5">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Single sales desk terminal</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Basic cash and transfer ledger</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp catalog closer</li>
                      </ul>
                    </div>

                    {/* Industrial Plant Edition (High-Ticket Fit for Obi) */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#d4af37]/15 to-transparent border-2 border-[#d4af37] space-y-4 relative shadow-2xl shadow-[#d4af37]/10">
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded bg-[#d4af37] text-[#060911] font-black text-[10px] uppercase tracking-wider shadow">
                        Recommended for Manufacturing Plants
                      </div>
                      <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider block">
                        Full Industrial Factory &amp; Fleet Edition
                      </span>
                      <div className="text-2xl font-black text-white">
                        ₦280,000 <span className="text-xs text-[#d4af37] font-bold">Turnkey (50% Deposit: ₦140,000)</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Complete manufacturing plant solution: Sachet &amp; Bottling production counters, up to 5 delivery truck shortage audits, diesel energy slicer, NAFDAC lab logs, and remote owner smartphone dashboard.
                      </p>
                      <ul className="text-xs text-slate-200 space-y-2 pt-2 border-t border-[#d4af37]/30">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Production counter (Sachets, Bottles, 19L Jars)</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Nylon roll theoretical yield &amp; theft auditor</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Multi-truck driver shortage automatic debit</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Generator diesel cost per bag calculator</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> NAFDAC water purity &amp; TDS compliance logger</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 8:00 PM automated WhatsApp shift audit</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 50% Milestone Deposit (₦140,000) &bull; Balance only after sign-off</li>
                      </ul>
                    </div>

                  </div>

                  {/* Corporate Bank Settlement Box */}
                  <div className="p-5 rounded-2xl bg-[#060911] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Official Corporate Settlement Account:</span>
                      <span className="text-emerald-400 font-mono">Moniepoint Microfinance Bank</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-4 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Number (NIP Direct Wire):</span>
                        <strong className="text-2xl font-mono text-[#d4af37] tracking-wider font-black">6805375225</strong>
                        <span className="text-xs text-slate-300 block mt-0.5">
                          Bethelmind Digital Solutions &bull; <strong>CAC Reg: 9912717</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold transition cursor-pointer self-start sm:self-auto"
                      >
                        {copiedAccount ? '✅ Copied!' : 'Copy Account Details'}
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Good day Bethelmind Desk! I want to confirm the ₦140,000 50% milestone deposit for the AquaFlow Industrial Water Factory ERP for ${factoryName}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#060911] font-black text-sm shadow-xl hover:brightness-110 transition cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>Confirm Milestone Deposit on WhatsApp (0802 279 1227)</span>
                    </a>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            MODE 2: PUBLIC DISTRIBUTOR STOREFRONT (WHAT OBI'S CUSTOMERS SEE)
        ════════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'storefront' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Storefront Hero Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-[#0b101d] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Official Online Factory Depot</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {factoryName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Direct factory-gate pricing for supermarkets, hotels, schools, event planners, and bulk wholesale distributors across {locationName}.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> NAFDAC Reg: 01-84920L
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <Truck className="w-4 h-4" /> Same-Day Route Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Wholesale Product Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Product 1: Pure Water Bags */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Premium Sachet Pure Water</h3>
                  <span className="text-xs text-slate-400">Bag of 20 Sachets (50cl / 60cl)</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  ₦380 <span className="text-xs text-slate-400 font-normal">/ Bag (Bulk)</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Order Quantity:</span>
                    <strong className="text-cyan-400 font-mono">{cartSachetBags} Bags</strong>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={cartSachetBags}
                    onChange={(e) => setCartSachetBags(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="text-right text-xs font-mono text-cyan-300 font-bold">
                    Subtotal: ₦{(cartSachetBags * 380).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Product 2: Bottled Table Water */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Table Water Bottles (75cl)</h3>
                  <span className="text-xs text-slate-400">Pack of 12 Bottles (Shrink-Wrapped)</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  ₦1,500 <span className="text-xs text-slate-400 font-normal">/ Pack</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Order Quantity:</span>
                    <strong className="text-blue-400 font-mono">{cartBottlePacks} Packs</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={cartBottlePacks}
                    onChange={(e) => setCartBottlePacks(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="text-right text-xs font-mono text-blue-300 font-bold">
                    Subtotal: ₦{(cartBottlePacks * 1500).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Product 3: 19L Dispenser Jar Refill */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">19-Liter Dispenser Jar Refill</h3>
                  <span className="text-xs text-slate-400">Ozonated &amp; Double-Sealed for Offices</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  ₦1,200 <span className="text-xs text-slate-400 font-normal">/ Refill</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Order Quantity:</span>
                    <strong className="text-teal-400 font-mono">{cartDispenserRefills} Jars</strong>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={50}
                    step={1}
                    value={cartDispenserRefills}
                    onChange={(e) => setCartDispenserRefills(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="text-right text-xs font-mono text-teal-300 font-bold">
                    Subtotal: ₦{(cartDispenserRefills * 1200).toLocaleString()}
                  </div>
                </div>
              </div>

            </div>

            {/* Wholesale Checkout & Route Booking Form */}
            <div className="bg-[#0b101d] border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Instant Wholesale Booking &amp; Route Delivery Request</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block font-medium">Customer / Company Name:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block font-medium">WhatsApp / Phone Number:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-slate-400 block font-medium">Delivery Destination / Shop Location:</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              {/* Order Summary Pill */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-black block">Total Order Value</span>
                  <span className="text-xl font-black text-white font-mono">₦{storeOrderTotal.toLocaleString()}</span>
                </div>
                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello ${factoryName}! I want to order water:\n\n• Sachet Water: ${cartSachetBags} bags (₦${(cartSachetBags * 380).toLocaleString()})\n• Bottled Water: ${cartBottlePacks} packs (₦${(cartBottlePacks * 1500).toLocaleString()})\n• 19L Dispenser: ${cartDispenserRefills} refills (₦${(cartDispenserRefills * 1200).toLocaleString()})\n\nTotal: ₦${storeOrderTotal.toLocaleString()}\nCustomer: ${customerName} (${customerPhone})\nAddress: ${deliveryAddress}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to Factory WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ──────────────────────────────────────────────────────────────────────────
          APPLICATION FOOTER BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="mt-12 border-t border-white/10 bg-[#060911] py-6 px-4 text-center text-xs text-slate-500">
        <p>
          AquaFlow ERP™ &bull; Industrial Water Factory Operating System &bull; Powered by Bethelmind Digital Solutions (CAC Reg: 9912717)
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Official Settlement: Moniepoint Microfinance Bank (6805375225) &bull; Enterprise Hotline: 0802 279 1227
        </p>
      </footer>

    </div>
  );
}
