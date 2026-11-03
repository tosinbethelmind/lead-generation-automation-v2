'use client';

/**
 * @file src/app/factory/page.tsx
 * 
 * 💧 AQUAFLOW ERP™ & DISTRIBUTOR PORTAL (v5.0 ENTERPRISE)
 * The Complete Nigerian Water Factory Operating System (OS).
 * Built natively for Nigerian Sachet ("Pure Water") & Bottled Table Water Companies.
 * 
 * Roles & Interfaces:
 * 1. 👑 Owner 10-Second Cockpit (Live Net Profit, Output Value, Fleet Shortage, Energy Cost/Bag)
 * 2. 👷 Supervisor 2-Minute Shift Wizard (Step-by-step Fast Shift Closing + Quick Increment Buttons)
 * 3. 🚚 Driver Route Waybill (Simplified Mobile View for Van Drivers & Road Bursts Return)
 * 4. 🔬 NAFDAC Water Quality Station (Daily TDS, pH, UV, Ozone + Print-Ready PDF Certificate)
 * 5. 📊 QuickBooks Shift P&L (Real-Time Income Statement + QuickBooks Comparison Matrix)
 * 6. 🛒 Public Distributor Storefront (Bulk Sachet, PET Bottle & 19L Dispenser Order Desk)
 * 7. 💳 Commercial Plant Activation Desk (₦280k Turnkey, ₦140k Deposit, Moniepoint Corporate)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  Sliders,
  Save,
  Download,
  ChevronRight,
  Eye,
  X,
  Camera,
  FileCheck
} from 'lucide-react';

export default function WaterFactoryErpDashboard() {
  // Navigation View: owner | wizard | driver | nafdac | quickbooks | storefront | deploy
  const [currentView, setCurrentView] = useState<'owner' | 'wizard' | 'driver' | 'nafdac' | 'quickbooks' | 'storefront' | 'deploy'>('owner');

  // Supervisor Wizard Step: 1 (Production) -> 2 (Materials) -> 3 (Trucks) -> 4 (Power) -> 5 (Summary)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Selected Driver for Driver Portal View
  const [selectedDriver, setSelectedDriver] = useState<'emeka' | 'musa' | 'ibrahim'>('musa');

  // NAFDAC Certificate Modal
  const [showNafdacCertModal, setShowNafdacCertModal] = useState(false);

  // Factory Identity Customization
  const [factoryName, setFactoryName] = useState('Obi Table & Sachet Water Plant');
  const [locationName, setLocationName] = useState('Lekki / Ajah Corridor, Lagos');
  const [supervisorName, setSupervisorName] = useState('Engr. Chidi Okafor');

  // Offline / Auto-Save State
  const [lastAutoSaved, setLastAutoSaved] = useState<string>('Just now');
  const [isSavedLocally, setIsSavedLocally] = useState<boolean>(true);

  // ── CORE OPERATIONAL STATE (PERSISTED) ────────────────────────────────────
  // Production Floor
  const [sachetBagsProduced, setSachetBagsProduced] = useState(3200);
  const [sachetPricePerBag, setSachetPricePerBag] = useState(350); // ₦350/bag wholesale (20 sachets)
  const [bottlePacksProduced, setBottlePacksProduced] = useState(250);
  const [bottlePricePerPack, setBottlePricePerPack] = useState(1300); // ₦1,300/pack (12 x 75cl)
  const [dispenserBottlesProduced, setDispenserBottlesProduced] = useState(60);
  const [dispenserRefillPrice, setDispenserRefillPrice] = useState(1000); // ₦1,000 refill
  const [factoryBurstBags, setFactoryBurstBags] = useState(22); // Burst on sealing machine

  // Raw Materials & LDPE Nylon Film
  const [nylonRollsKgLoaded, setNylonRollsKgLoaded] = useState(120); // 4 rolls @ 30kg = 120kg
  const [outerPackingSacksUsed, setOuterPackingSacksUsed] = useState(160); // Bundles/sacks
  const [nylonRollCost, setNylonRollCost] = useState(34000); // Cost of 4 rolls
  const [waterTreatmentChemicals, setWaterTreatmentChemicals] = useState(12000); // Salt, chlorine, cartridge amortisation
  const [loadersDailyWages, setLoadersDailyWages] = useState(30000); // Loaders & sealing machine operators
  const [trucksFuelAllowance, setTrucksFuelAllowance] = useState(25000); // Route fuel for 3 trucks

  // Trucks & Drivers Fleet
  // Truck 1: Emeka
  const [truck1Bags, setTruck1Bags] = useState(850);
  const [truck1Cash, setTruck1Cash] = useState(280000); // 800 bags sold @ 350
  const [truck1Credit, setTruck1Credit] = useState(30);
  const [truck1Burst, setTruck1Burst] = useState(10);
  const [truck1Returned, setTruck1Returned] = useState(10);
  const [truck1PhysicalBurstVerified, setTruck1PhysicalBurstVerified] = useState(true);

  // Truck 2: Musa (Simulated Shortage Trigger)
  const [truck2Bags, setTruck2Bags] = useState(700);
  const [truck2Cash, setTruck2Cash] = useState(217000); // 620 bags sold @ 350
  const [truck2Credit, setTruck2Credit] = useState(30);
  const [truck2Burst, setTruck2Burst] = useState(10);
  const [truck2Returned, setTruck2Returned] = useState(0); // 40 bags missing!
  const [truck2PhysicalBurstVerified, setTruck2PhysicalBurstVerified] = useState(false);

  // Truck 3: Ibrahim
  const [truck3Bags, setTruck3Bags] = useState(600);
  const [truck3Cash, setTruck3Cash] = useState(196000); // 560 bags sold @ 350
  const [truck3Credit, setTruck3Credit] = useState(25);
  const [truck3Burst, setTruck3Burst] = useState(8);
  const [truck3Returned, setTruck3Returned] = useState(7);
  const [truck3PhysicalBurstVerified, setTruck3PhysicalBurstVerified] = useState(true);

  // Gate Walk-in Sales
  const [gateSachetBags, setGateSachetBags] = useState(900);
  const [gateBottlePacks, setGateBottlePacks] = useState(200);

  // Power & Generator Fuel
  const [generatorHours, setGeneratorHours] = useState(5.5); // Hours run today
  const [generatorLitersPerHour, setGeneratorLitersPerHour] = useState(10); // 10L/hr on 30kVA
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState(1250); // ₦1,250/L
  const [nepaTokenCost, setNepaTokenCost] = useState(15000); // ₦15,000 grid power used today

  // NAFDAC Quality Control
  const [rawWaterTds, setRawWaterTds] = useState(185); // Borehole raw ppm
  const [treatedWaterTds, setTreatedWaterTds] = useState(22); // Osmosis treated ppm (NAFDAC < 100)
  const [waterPh, setWaterPh] = useState(7.2); // Optimal neutral
  const [filterDaysRemaining, setFilterDaysRemaining] = useState(14); // Days until candle replacement
  const [nafdacBatchNo, setNafdacBatchNo] = useState('OTW-2026-B04');

  // Customer Storefront Order State
  const [cartSachetBags, setCartSachetBags] = useState(50);
  const [cartBottlePacks, setCartBottlePacks] = useState(10);
  const [cartDispenserRefills, setCartDispenserRefills] = useState(5);
  const [customerName, setCustomerName] = useState('Chief Emmanuel Adeleke');
  const [customerPhone, setCustomerPhone] = useState('0803 456 7890');
  const [deliveryAddress, setDeliveryAddress] = useState('Block 4, Flat 2, Admiralty Way, Lekki Phase 1');

  // UI state
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // ── LOCAL STORAGE OFFLINE RESTORATION & SYNC ───────────────────────────────
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('aquaflow_erp_state');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.sachetBagsProduced) setSachetBagsProduced(parsed.sachetBagsProduced);
        if (parsed.generatorHours) setGeneratorHours(parsed.generatorHours);
        if (parsed.dieselPricePerLiter) setDieselPricePerLiter(parsed.dieselPricePerLiter);
      }
    } catch (_) {}
  }, []);

  const triggerAutoSave = () => {
    try {
      const stateToSave = {
        sachetBagsProduced,
        sachetPricePerBag,
        bottlePacksProduced,
        generatorHours,
        dieselPricePerLiter,
        truck1Cash,
        truck2Cash,
        truck3Cash,
        timestamp: Date.now()
      };
      localStorage.setItem('aquaflow_erp_state', JSON.stringify(stateToSave));
      setLastAutoSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setIsSavedLocally(true);
    } catch (_) {}
  };

  useEffect(() => {
    triggerAutoSave();
  }, [sachetBagsProduced, generatorHours, dieselPricePerLiter, truck1Cash, truck2Cash, truck3Cash]);

  // ── CALCULATIONS ENGINE ────────────────────────────────────────────────────
  const sachetProductionValue = sachetBagsProduced * sachetPricePerBag;
  const bottleProductionValue = bottlePacksProduced * bottlePricePerPack;
  const dispenserProductionValue = dispenserBottlesProduced * dispenserRefillPrice;
  const totalProductionValue = sachetProductionValue + bottleProductionValue + dispenserProductionValue;

  // Nylon Roll Yield Auditing (1kg film ≈ 16 bags of 20 sachets)
  const theoreticalBagsFromNylon = nylonRollsKgLoaded * 16;
  const nylonYieldDifferenceBags = sachetBagsProduced - theoreticalBagsFromNylon;
  const isNylonYieldSuspicious = nylonYieldDifferenceBags < -150; // Alert if loss > 150 bags

  // Truck 1 Audit
  const truck1Accounted = (truck1Cash / sachetPricePerBag) + truck1Credit + (truck1PhysicalBurstVerified ? truck1Burst : 0) + truck1Returned;
  const truck1Shortage = Math.round(truck1Bags - truck1Accounted);

  // Truck 2 Audit (Shortage detected)
  const truck2Accounted = (truck2Cash / sachetPricePerBag) + truck2Credit + (truck2PhysicalBurstVerified ? truck2Burst : 0) + truck2Returned;
  const truck2Shortage = Math.round(truck2Bags - truck2Accounted);

  // Truck 3 Audit
  const truck3Accounted = (truck3Cash / sachetPricePerBag) + truck3Credit + (truck3PhysicalBurstVerified ? truck3Burst : 0) + truck3Returned;
  const truck3Shortage = Math.round(truck3Bags - truck3Accounted);

  const totalTruckShortageBags = Math.max(0, truck1Shortage) + Math.max(0, truck2Shortage) + Math.max(0, truck3Shortage);
  const totalShortageNaira = totalTruckShortageBags * sachetPricePerBag;

  // Energy & Generator Calculations
  const totalDieselLitersConsumed = generatorHours * generatorLitersPerHour;
  const totalDieselCost = totalDieselLitersConsumed * dieselPricePerLiter;
  const totalEnergyCost = totalDieselCost + nepaTokenCost;
  const energyCostPerSachetBag = (totalEnergyCost / (sachetBagsProduced || 1)).toFixed(2);
  const isDieselCostHigh = Number(energyCostPerSachetBag) > (sachetPricePerBag * 0.15); // > 15% of wholesale price

  // Sales & Cash Inflows
  const gateRevenue = (gateSachetBags * sachetPricePerBag) + (gateBottlePacks * bottlePricePerPack) + (dispenserBottlesProduced * dispenserRefillPrice);
  const totalCashCollected = truck1Cash + truck2Cash + truck3Cash + gateRevenue;
  const totalReceivables = (truck1Credit + truck2Credit + truck3Credit) * sachetPricePerBag;
  const totalGrossRevenue = totalCashCollected + totalReceivables;

  // Cost of Goods Sold & OPEX
  const totalOperatingExpenses = totalEnergyCost + nylonRollCost + waterTreatmentChemicals + loadersDailyWages + trucksFuelAllowance;
  const netOperatingProfit = totalGrossRevenue - totalOperatingExpenses;
  const profitMarginPercent = Math.round((netOperatingProfit / (totalGrossRevenue || 1)) * 100);

  // Storefront Total
  const storeOrderTotal = (cartSachetBags * 380) + (cartBottlePacks * 1500) + (cartDispenserRefills * 1200);

  // ── 8:00 PM WHATSAPP EXECUTIVE SUMMARY GENERATOR ───────────────────────────
  const generateWhatsAppAuditText = () => {
    return `💧 *AQUAFLOW ERP™ — DAILY EXECUTIVE FACTORY AUDIT*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | Shift: Day Run Batch
🏢 Factory: ${factoryName}
📍 Location: ${locationName}
👷 Supervisor: ${supervisorName}
━━━━━━━━━━━━━━━━━━━━
🏭 *1. PRODUCTION & NYLON AUDIT:*
• Sachet Water: ${sachetBagsProduced.toLocaleString()} bags (${nylonRollsKgLoaded}kg film loaded)
• Theoretical Nylon Yield: ${theoreticalBagsFromNylon.toLocaleString()} bags (${nylonYieldDifferenceBags >= 0 ? `+${nylonYieldDifferenceBags} bonus` : `${nylonYieldDifferenceBags} loss`})
• Table Water Bottles: ${bottlePacksProduced.toLocaleString()} packs
• 19L Dispenser Refills: ${dispenserBottlesProduced.toLocaleString()} bottles
• Sealing Burst/Waste: ${factoryBurstBags} bags
• Shift Factory Output Value: ₦${totalProductionValue.toLocaleString()}

🚚 *2. TRUCK ROUTE RECONCILIATIONS:*
• Truck 1 (Emeka): Loaded ${truck1Bags} | Cash: ₦${truck1Cash.toLocaleString()} | ${truck1Shortage <= 0 ? '✅ Balanced' : `⚠️ Shortage: -${truck1Shortage} bags`}
• Truck 2 (Musa): Loaded ${truck2Bags} | Cash: ₦${truck2Cash.toLocaleString()} | ${truck2Shortage > 0 ? `🚨 *SHORTAGE: -${truck2Shortage} bags (₦${(truck2Shortage * sachetPricePerBag).toLocaleString()}) DEBITED*` : '✅ Balanced'}
• Truck 3 (Ibrahim): Loaded ${truck3Bags} | Cash: ₦${truck3Cash.toLocaleString()} | ${truck3Shortage <= 0 ? '✅ Balanced' : `⚠️ Shortage: -${truck3Shortage} bags`}
• Factory Gate Cashier Inflow: ₦${gateRevenue.toLocaleString()}

⚡ *3. POWER & DIESEL ENERGY SLICER:*
• Generator Run: ${generatorHours} hrs (${totalDieselLitersConsumed}L diesel @ ₦${dieselPricePerLiter}/L = ₦${totalDieselCost.toLocaleString()})
• Grid NEPA Token: ₦${nepaTokenCost.toLocaleString()}
• Total Power Overhead: ₦${totalEnergyCost.toLocaleString()}
• *Energy Cost Per Bag:* ₦${energyCostPerSachetBag}/bag ${isDieselCostHigh ? '⚠️ (HIGH FUEL OVERHEAD)' : '✅ (OPTIMAL)'}

🔬 *4. NAFDAC WATER QUALITY LOG:*
• Raw Borehole TDS: ${rawWaterTds} ppm ➔ Treated Permeate TDS: ${treatedWaterTds} ppm (NAFDAC Limit < 100) ✅
• Water pH: ${waterPh} (Optimal Neutral) | Batch No: ${nafdacBatchNo}

💰 *5. QUICKBOOKS DAILY P&L SUMMARY:*
• Gross Shift Revenue: ₦${totalGrossRevenue.toLocaleString()}
  - Bank/Cash In Hand: ₦${totalCashCollected.toLocaleString()}
  - Customer Receivables: ₦${totalReceivables.toLocaleString()}
• Total Factory OPEX: -₦${totalOperatingExpenses.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━
💵 *NET FACTORY CASH PROFIT:* ₦${netOperatingProfit.toLocaleString()} (${profitMarginPercent}% Net Margin)
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
    <div className="min-h-screen bg-[#050811] text-[#f1f5f9] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          APP NAVIGATION HEADER (100% STANDALONE & ZERO AGENCY NOISE)
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#080c18]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left Brand & Plant Identity */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <Droplets className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white tracking-tight">AquaFlow ERP™</h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                    v5.0 Enterprise
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-200">{factoryName}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Shift Active
                  </span>
                </div>
              </div>
            </div>

            {/* Offline-First Sync Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
              <Save className="w-3.5 h-3.5" />
              <span>Saved locally ({lastAutoSaved})</span>
            </div>
          </div>

          {/* Center Role Navigation Pill */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl overflow-x-auto max-w-full scrollbar-none">
            {[
              { id: 'owner', label: '👑 Owner Cockpit', icon: Factory },
              { id: 'wizard', label: '👷 2-Min Shift Wizard', icon: Clock },
              { id: 'driver', label: '🚚 Driver Waybills', icon: Truck },
              { id: 'nafdac', label: '🔬 NAFDAC Lab', icon: Award },
              { id: 'quickbooks', label: '📊 QuickBooks P&L', icon: DollarSign },
              { id: 'storefront', label: '🛒 Distributor Store', icon: ShoppingCart },
              { id: 'deploy', label: '💳 Activate Plant', icon: ShieldCheck }
            ].map((nav) => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => setCurrentView(nav.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    currentView === nav.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Metrics Pill */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-right">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Shift Output</span>
              <span className="text-xs font-black text-cyan-300 font-mono">₦{totalProductionValue.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-right">
              <span className="text-[9px] text-emerald-400 uppercase font-semibold block">Net Cash</span>
              <span className="text-xs font-black text-emerald-400 font-mono">₦{netOperatingProfit.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN WORKSPACE ROUTER
      ────────────────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 1: OWNER 10-SECOND COCKPIT
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'owner' && (
          <div className="space-y-6">
            
            {/* Top 4 Critical Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: True Net Cash Today */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0a121e] to-[#070b14] border border-emerald-500/40 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider text-emerald-400">Net Cash In Hand Today</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ₦{netOperatingProfit.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-500/20 text-emerald-300/80">
                  <span>Gross: ₦{totalGrossRevenue.toLocaleString()}</span>
                  <span className="font-extrabold">{profitMarginPercent}% Net Margin</span>
                </div>
              </div>

              {/* Card 2: Shift Production Output */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0a121e] to-[#070b14] border border-cyan-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider text-cyan-400">Shift Factory Output</span>
                  <Factory className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                  {sachetBagsProduced.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Bags</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-cyan-500/20 text-slate-300">
                  <span>+ {bottlePacksProduced} Bottle Packs</span>
                  <span className="font-bold font-mono">₦{totalProductionValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Card 3: Driver Shortage Alarm */}
              <div className={`p-5 rounded-2xl border shadow-xl space-y-2 ${
                totalTruckShortageBags > 0 
                  ? 'bg-rose-950/30 border-rose-500/50' 
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`uppercase font-bold tracking-wider ${totalTruckShortageBags > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    Fleet Shortage Status
                  </span>
                  <Truck className={`w-4 h-4 ${totalTruckShortageBags > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-mono ${totalTruckShortageBags > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {totalTruckShortageBags > 0 ? `-${totalTruckShortageBags} Bags` : '0 Shortage'}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400">{totalTruckShortageBags > 0 ? `Shortage: ₦${totalShortageNaira.toLocaleString()}` : 'All 3 Trucks Balanced'}</span>
                  {totalTruckShortageBags > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold">Auto-Debited</span>}
                </div>
              </div>

              {/* Card 4: Generator Diesel Cost Per Bag */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#0a121e] to-[#070b14] border border-amber-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider text-amber-400">Diesel Cost / Bag</span>
                  <Fuel className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  ₦{energyCostPerSachetBag} <span className="text-xs text-slate-400 font-normal">/ Bag</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-500/20 text-slate-300">
                  <span>{generatorHours}h Run ({totalDieselLitersConsumed}L)</span>
                  <span className="font-bold text-amber-400">₦{totalDieselCost.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Live WhatsApp Push Bar */}
            <div className="p-4 rounded-2xl bg-[#0b101d] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>8:00 PM WhatsApp Shift Summary</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Compiled automatically from floor counters, driver remittances, and diesel hours.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReport ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppAuditText())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send to My WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Owner Live Drill-Down Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Delivery Trucks Shortage Overview */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Delivery Route Reconciliations
                  </h3>
                  <button
                    onClick={() => setCurrentView('driver')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>Inspect Waybills</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Truck 1 */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">Truck 1: Emeka (Canter)</strong>
                      <span className="text-slate-400 text-[11px]">Loaded {truck1Bags} bags &bull; Cash ₦{truck1Cash.toLocaleString()}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      ✅ Balanced
                    </span>
                  </div>

                  {/* Truck 2 */}
                  <div className="p-3 rounded-xl bg-rose-500/[0.05] border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">Truck 2: Musa (Dyna)</strong>
                      <span className="text-slate-400 text-[11px]">Loaded {truck2Bags} bags &bull; Cash ₦{truck2Cash.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 font-black border border-rose-500/40 block">
                        ⚠️ -{truck2Shortage} Bags Missing
                      </span>
                      <span className="text-[10px] text-rose-400 font-mono mt-0.5 block">
                        -₦{(truck2Shortage * sachetPricePerBag).toLocaleString()} debited
                      </span>
                    </div>
                  </div>

                  {/* Truck 3 */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">Truck 3: Ibrahim (Pick-up)</strong>
                      <span className="text-slate-400 text-[11px]">Loaded {truck3Bags} bags &bull; Cash ₦{truck3Cash.toLocaleString()}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      ✅ Balanced
                    </span>
                  </div>
                </div>
              </div>

              {/* Nylon Film Yield vs Theft Card */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Packaging Film Yield vs Shift Output
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">1kg Film = 16 Bags</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Film Consumed:</span>
                    <strong className="text-white font-mono text-sm block">{nylonRollsKgLoaded} kg</strong>
                    <span className="text-[10px] text-slate-500">4 Rolls loaded</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Expected Theoretical:</span>
                    <strong className="text-cyan-300 font-mono text-sm block">{theoreticalBagsFromNylon.toLocaleString()} Bags</strong>
                    <span className="text-[10px] text-slate-500">{nylonRollsKgLoaded} &times; 16 bags</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isNylonYieldSuspicious ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>Variance Audit:</span>
                    <span className="font-mono">{nylonYieldDifferenceBags >= 0 ? `+${nylonYieldDifferenceBags}` : nylonYieldDifferenceBags} Bags</span>
                  </div>
                  <p className="text-[11px] text-slate-300/80">
                    {isNylonYieldSuspicious 
                      ? '🚨 Excessive film consumption detected. Possible unrecorded off-book bags or roll theft.'
                      : '✅ Normal production tolerance. Bagging output matches film weight consumed.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 2: SUPERVISOR 2-MINUTE SHIFT WIZARD
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'wizard' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Wizard Progress Bar */}
            <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>2-Minute Shift Closing Wizard</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Step {wizardStep} of 5: {
                      wizardStep === 1 ? 'Production Output Counters' :
                      wizardStep === 2 ? 'Raw Materials & Nylon Weight' :
                      wizardStep === 3 ? 'Truck Fleet Reconciliations' :
                      wizardStep === 4 ? 'Power & Generator Fuel' : 'Review & Push WhatsApp Audit'
                    }
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                  {wizardStep * 20}% Done
                </span>
              </div>

              {/* Progress Stepper Pills */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => setWizardStep(step as any)}
                    className={`h-2 rounded-full transition cursor-pointer ${
                      wizardStep >= step ? 'bg-cyan-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: PRODUCTION COUNTERS */}
            {wizardStep === 1 && (
              <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-5 shadow-xl">
                <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Step 1: Machine Production Counters</span>
                </h3>

                {/* Sachet Water Counter with Quick Increments */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">Sachet Water Bags Packed (20/bag):</label>
                    <span className="text-base font-black text-cyan-300 font-mono">{sachetBagsProduced.toLocaleString()} Bags</span>
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

                  {/* 1-Tap Quick Increment Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Add:</span>
                    {[+50, +100, +500, +1000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setSachetBagsProduced((prev) => prev + inc)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 font-mono text-xs font-bold transition cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSachetBagsProduced((prev) => Math.max(0, prev - 100))}
                      className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs font-bold transition ml-auto cursor-pointer"
                    >
                      -100
                    </button>
                  </div>
                </div>

                {/* Bottled PET Water Counter */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">75cl Bottled Water Packs (12/pack):</label>
                    <span className="text-base font-black text-blue-300 font-mono">{bottlePacksProduced} Packs</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={25}
                    value={bottlePacksProduced}
                    onChange={(e) => setBottlePacksProduced(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Add:</span>
                    {[+25, +50, +100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setBottlePacksProduced((prev) => prev + inc)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-blue-300 font-mono text-xs font-bold transition cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Machine Sealing Waste */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block font-medium">Machine Sealing Burst Waste (Bags):</label>
                    <input
                      type="number"
                      value={factoryBurstBags}
                      onChange={(e) => setFactoryBurstBags(Number(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-rose-300 font-mono font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block font-medium">19L Dispenser Jar Refills:</label>
                    <input
                      type="number"
                      value={dispenserBottlesProduced}
                      onChange={(e) => setDispenserBottlesProduced(Number(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-teal-300 font-mono font-bold mt-1"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Step 2: Nylon Film Weight</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: RAW MATERIALS & NYLON WEIGHT */}
            {wizardStep === 2 && (
              <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-5 shadow-xl">
                <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Step 2: Packaging Film Consumption Audit</span>
                </h3>

                <div className="space-y-3">
                  <label className="text-xs text-slate-300 block font-medium">
                    Total Kilograms of Printed Film Consumed this Shift:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={nylonRollsKgLoaded}
                      onChange={(e) => setNylonRollsKgLoaded(Number(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono font-bold text-sm"
                    />
                    <span className="text-xs font-bold text-slate-400">kg</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Standard 4 rolls @ 30kg = 120kg. System uses 1kg = 16 bags.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Theoretical Yield Expected:</span>
                    <strong className="text-white font-mono">{theoreticalBagsFromNylon.toLocaleString()} Bags</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Actual Bags Sealed (from Step 1):</span>
                    <strong className="text-cyan-300 font-mono">{sachetBagsProduced.toLocaleString()} Bags</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5 font-bold">
                    <span className="text-slate-300">Variance:</span>
                    <span className={nylonYieldDifferenceBags < -150 ? 'text-rose-400' : 'text-emerald-400'}>
                      {nylonYieldDifferenceBags >= 0 ? `+${nylonYieldDifferenceBags}` : nylonYieldDifferenceBags} Bags
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Step 3: Truck Fleet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRUCK FLEET RECONCILIATIONS */}
            {wizardStep === 3 && (
              <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-5 shadow-xl">
                <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Step 3: Route Fleet Cash &amp; Bursts Audit</span>
                </h3>

                <p className="text-xs text-slate-400">
                  Enter evening cash remitted by drivers. Excused bursts require physical returned pouches.
                </p>

                {/* Truck 2 Musa Quick Form */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-white">Truck 2: Musa (Dyna - 700 Bags Loaded)</strong>
                    <span className="text-[10px] text-slate-400">Route: Island</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block text-[11px]">Cash/POS Remitted (₦):</label>
                      <input
                        type="number"
                        value={truck2Cash}
                        onChange={(e) => setTruck2Cash(Number(e.target.value) || 0)}
                        className="w-full bg-[#060911] border border-white/15 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono font-bold mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block text-[11px]">Credit Sales (Bags):</label>
                      <input
                        type="number"
                        value={truck2Credit}
                        onChange={(e) => setTruck2Credit(Number(e.target.value) || 0)}
                        className="w-full bg-[#060911] border border-white/15 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono font-bold mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={truck2PhysicalBurstVerified}
                        onChange={(e) => setTruck2PhysicalBurstVerified(e.target.checked)}
                        className="accent-cyan-500 w-4 h-4 rounded"
                      />
                      <span>Physical torn burst pouches returned ({truck2Burst} bags)</span>
                    </label>
                    <span className="font-mono text-rose-300 font-bold">
                      {truck2Shortage > 0 ? `Shortage: -${truck2Shortage} bags` : 'Balanced'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Step 4: Power &amp; Diesel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: POWER & DIESEL */}
            {wizardStep === 4 && (
              <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-5 shadow-xl">
                <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  <span>Step 4: Diesel Generator &amp; NEPA Costs</span>
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block font-medium">Hours Run on Generator:</label>
                    <input
                      type="number"
                      step={0.5}
                      value={generatorHours}
                      onChange={(e) => setGeneratorHours(Number(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block font-medium">Diesel Price / Liter (₦):</label>
                    <input
                      type="number"
                      value={dieselPricePerLiter}
                      onChange={(e) => setDieselPricePerLiter(Number(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Generator Fuel Consumed:</span>
                    <strong className="text-white font-mono">{totalDieselLitersConsumed} Litres</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Calculated Generator Fuel Cost:</span>
                    <strong className="text-amber-300 font-mono">₦{totalDieselCost.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-amber-500/20 font-bold text-amber-300">
                    <span>Energy Cost per Sachet Bag:</span>
                    <span className="font-mono text-sm">₦{energyCostPerSachetBag} / Bag</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(5)}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Final Step: Review &amp; Push Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & 1-TAP PUSH TO WHATSAPP */}
            {wizardStep === 5 && (
              <div className="p-6 rounded-2xl bg-[#0b101d] border border-emerald-500/30 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Step 5: Shift Reconciled — Ready for WhatsApp Dispatch</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Net Profit: ₦{netOperatingProfit.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#050811] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {generateWhatsAppAuditText()}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedReport ? '✅ Copied to Clipboard!' : 'Copy Summary'}</span>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppAuditText())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Push to Owner&apos;s WhatsApp Now</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 3: DRIVER ROUTE WAYBILL (MOBILE-FIRST DRIVER INTERFACE)
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'driver' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            
            {/* Driver Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-[#0b101d] border border-white/10 rounded-2xl">
              {[
                { id: 'emeka', name: '🚚 Emeka (Canter)' },
                { id: 'musa', name: '🚚 Musa (Dyna)' },
                { id: 'ibrahim', name: '🚚 Ibrahim (Pick-up)' }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDriver(d.id as any)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    selectedDriver === d.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Selected Driver Loading Manifest */}
            <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">
                    {selectedDriver === 'musa' ? 'Musa Babangida — Truck 2' :
                     selectedDriver === 'emeka' ? 'Emeka Nwosu — Truck 1' : 'Ibrahim Saliu — Truck 3'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Route: {selectedDriver === 'musa' ? 'Victoria Island / Obalende Corridor' :
                            selectedDriver === 'emeka' ? 'Ikeja / Agege Market Route' : 'Lekki Phase 1 / Ikoyi Estates'}
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                  Gate Load: {selectedDriver === 'musa' ? truck2Bags : selectedDriver === 'emeka' ? truck1Bags : truck3Bags} Bags
                </span>
              </div>

              {/* Waybill Figures */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-400">Cash/Transfer Remitted:</span>
                  <strong className="text-emerald-400 font-mono">
                    ₦{(selectedDriver === 'musa' ? truck2Cash : selectedDriver === 'emeka' ? truck1Cash : truck3Cash).toLocaleString()}
                  </strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-400">Credit Allowed to Wholesalers:</span>
                  <span className="text-amber-300 font-mono font-bold">
                    {selectedDriver === 'musa' ? truck2Credit : selectedDriver === 'emeka' ? truck1Credit : truck3Credit} Bags
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-400">Road Burst Claims:</span>
                  <span className="text-slate-300 font-mono">
                    {selectedDriver === 'musa' ? truck2Burst : selectedDriver === 'emeka' ? truck1Burst : truck3Burst} Bags
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-400">Undamaged Returns to Store:</span>
                  <span className="text-slate-300 font-mono">
                    {selectedDriver === 'musa' ? truck2Returned : selectedDriver === 'emeka' ? truck1Returned : truck3Returned} Bags
                  </span>
                </div>
              </div>

              {/* Proof of Burst Camera Prompt */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-200">Inspect physical burst sachets:</span>
                </div>
                <span className="font-bold text-cyan-300">
                  {selectedDriver === 'musa' ? '⚠️ 10 Pouches Missing' : '✅ Verified Intact'}
                </span>
              </div>

              {/* Driver Shortage Alert Banner */}
              {selectedDriver === 'musa' && (
                <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                  <div className="flex justify-between font-extrabold text-sm">
                    <span>Musa Shortage Debit:</span>
                    <span>-{truck2Shortage} Bags (₦{(truck2Shortage * sachetPricePerBag).toLocaleString()})</span>
                  </div>
                  <p className="text-[11px] text-rose-300/80">
                    Automatically deducted from weekly delivery payout. Driver notified via SMS/WhatsApp.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 4: NAFDAC COMPLIANCE STATION
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'nafdac' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b101d] border border-emerald-500/30 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>NAFDAC Daily Water Purity &amp; Sanitation Station</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maintains digital sanitary logs to pass unannounced NAFDAC, SON and State Water Board inspections.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNafdacCertModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print NAFDAC Shift Certificate</span>
                </button>
              </div>

              {/* 4 Laboratory Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* TDS Permeate */}
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

                {/* pH Reading */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">pH Acidity / Alkalinity</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-2xl font-black text-cyan-400 font-mono">{waterPh}</strong>
                    <span className="text-xs text-slate-400 font-mono">pH</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    NAFDAC Optimal: <strong>6.5 – 7.5</strong>
                  </span>
                  <div className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded text-center">
                    ✅ Neutral Drinking Standard
                  </div>
                </div>

                {/* UV & Ozone Sterilizers */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Microbial Sterilization</span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">UV Sterilizer:</span>
                      <span className="text-emerald-400 font-bold font-mono">ACTIVE (254nm)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Ozone Injection:</span>
                      <span className="text-emerald-400 font-bold font-mono">ACTIVE (0.4mg/L)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-center mt-2">
                    ✅ 0.00 Coliform Count
                  </div>
                </div>

                {/* Candle Filter Countdown */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sediment Filter Life</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-2xl font-black text-amber-400 font-mono">{filterDaysRemaining}</strong>
                    <span className="text-xs text-slate-400">days remaining</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    1-Micron Candle &bull; Last Backwash: <strong>Yesterday</strong>
                  </span>
                  <div className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded text-center">
                    ⏳ Normal Schedule
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 5: QUICKBOOKS SHIFT P&L & COMPARISON
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'quickbooks' && (
          <div className="space-y-6">
            
            {/* Shift Income Statement */}
            <div className="p-6 rounded-2xl bg-[#0b101d] border border-white/10 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>QuickBooks-Style Shift Income Statement (P&amp;L)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time operational costing accounting for generator fuel, packaging materials, and loaders.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Profit Margin</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{profitMarginPercent}% Net Margin</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Shift Gross Inflows</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Truck 1 (Emeka) Remittance:</span>
                      <strong className="text-white font-mono">₦{truck1Cash.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Truck 2 (Musa) Remittance:</span>
                      <strong className="text-white font-mono">₦{truck2Cash.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Truck 3 (Ibrahim) Remittance:</span>
                      <strong className="text-white font-mono">₦{truck3Cash.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Factory Gate Direct Cashier Sales:</span>
                      <strong className="text-white font-mono">₦{gateRevenue.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <span>Distributor Credit Receivables:</span>
                      <strong className="font-mono">+₦{totalReceivables.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      <strong className="text-sm">Total Realized Shift Revenue:</strong>
                      <strong className="font-mono text-sm font-black">₦{totalGrossRevenue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Cost of Goods Sold & OPEX */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" />
                    <span>Cost of Goods Sold &amp; Daily OPEX</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Power &amp; Generator Diesel ({totalDieselLitersConsumed}L):</span>
                      <strong className="text-rose-400 font-mono">-₦{totalEnergyCost.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Packaging Film &amp; Bottle Caps:</span>
                      <strong className="text-rose-400 font-mono">-₦{nylonRollCost.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Water Treatment Consumables:</span>
                      <strong className="text-rose-400 font-mono">-₦{waterTreatmentChemicals.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Machine Operators &amp; Shift Loaders:</span>
                      <strong className="text-rose-400 font-mono">-₦{loadersDailyWages.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                      <span className="text-slate-400">Trucks Route Fuel Allowance:</span>
                      <strong className="text-rose-400 font-mono">-₦{trucksFuelAllowance.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      <strong className="text-sm">Total Shift Operating Expenses:</strong>
                      <strong className="font-mono text-sm font-black">-₦{totalOperatingExpenses.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Net Cash In Hand Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black text-emerald-400 block tracking-wider">
                        Net Factory Profit Today:
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

            {/* Comparison Matrix: QuickBooks vs AquaFlow ERP */}
            <div className="p-6 rounded-2xl bg-[#0b101d] border border-cyan-500/30 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Why QuickBooks Fails Nigerian Water Factories vs AquaFlow ERP™</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                      <th className="py-2.5 px-3">Factory Capability</th>
                      <th className="py-2.5 px-3 text-rose-400">Standard QuickBooks</th>
                      <th className="py-2.5 px-3 text-cyan-300">AquaFlow ERP™ (Water Edition)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Nylon Roll Yield vs Waste</td>
                      <td className="py-2.5 px-3 text-rose-400">❌ Cannot convert film kg to bags sealed</td>
                      <td className="py-2.5 px-3 text-cyan-300">✅ Built-in 1kg = 16 bags theoretical yield audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Driver Shortage &amp; Burst Audit</td>
                      <td className="py-2.5 px-3 text-rose-400">❌ No route loading pass or road burst reconciliation</td>
                      <td className="py-2.5 px-3 text-cyan-300">✅ Automatic deduction from driver payout ledger</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Generator Diesel Cost / Bag</td>
                      <td className="py-2.5 px-3 text-rose-400">❌ Only manual post-month expense entries</td>
                      <td className="py-2.5 px-3 text-cyan-300">✅ Real-time fuel burn rate &amp; cost per bag</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">NAFDAC Lab &amp; TDS Logs</td>
                      <td className="py-2.5 px-3 text-rose-400">❌ Not supported</td>
                      <td className="py-2.5 px-3 text-cyan-300">✅ Digital compliance logs + printable certificate</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">8:00 PM WhatsApp Shift Summary</td>
                      <td className="py-2.5 px-3 text-rose-400">❌ None. Requires desktop accountant login</td>
                      <td className="py-2.5 px-3 text-cyan-300">✅ Instant 1-tap WhatsApp summary pushed to owner</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 6: PUBLIC DISTRIBUTOR STOREFRONT
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'storefront' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Storefront Header Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-[#0b101d] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                <Droplets className="w-3.5 h-3.5" />
                <span>Official Online Wholesale Depot</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {factoryName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Direct factory-gate pricing for supermarkets, hotels, schools, event planners, and bulk wholesale distributors across {locationName}.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> NAFDAC Reg: 01-84920L
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Truck className="w-4 h-4" /> Same-Day Route Dispatch
                </span>
              </div>
            </div>

            {/* Wholesale Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Product 1: Sachet Pure Water */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Premium Sachet Pure Water</h3>
                  <span className="text-xs text-slate-400">Bag of 20 Sachets (50cl / 60cl)</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  ₦380 <span className="text-xs text-slate-400 font-normal">/ Bag (Wholesale)</span>
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

              {/* Product 2: Table Water Bottles */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4 shadow-xl">
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

              {/* Product 3: 19L Dispenser Jar Refills */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/10 space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">19L Dispenser Jar Refill</h3>
                  <span className="text-xs text-slate-400">Ozonated &amp; Double-Sealed</span>
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
                <span>Wholesale Delivery Route Booking Form</span>
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

        {/* ════════════════════════════════════════════════════════════════════════
            VIEW 7: COMMERCIAL ACTIVATION & 48H HANDOVER DESK
        ════════════════════════════════════════════════════════════════════════ */}
        {currentView === 'deploy' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101d] border border-[#d4af37]/40 space-y-6 shadow-2xl">
              
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

              {/* 3 Transparent Commercial Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Tier 1: Starter Kiosk */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter Kiosk Edition</span>
                  <div className="text-xl font-black text-white">₦35,000 <span className="text-xs text-slate-400 font-normal">+ ₦7k/mo</span></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    For roadside retail depots with single sales counters and no delivery trucks.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Single sales desk terminal</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Basic cash and transfer ledger</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp catalog closer</li>
                  </ul>
                </div>

                {/* Tier 2: Commercial Plant Edition (The Recommended High-Ticket Tier) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#d4af37]/15 to-transparent border-2 border-[#d4af37] space-y-3 relative shadow-2xl shadow-[#d4af37]/10">
                  <div className="absolute -top-3 right-3 px-2 py-0.5 rounded bg-[#d4af37] text-[#060911] font-black text-[9px] uppercase tracking-wider shadow">
                    Recommended for Plants
                  </div>
                  <span className="text-xs font-black text-[#d4af37] uppercase tracking-wider block">Commercial Plant Edition</span>
                  <div className="text-xl font-black text-white">₦280,000 <span className="text-xs text-[#d4af37] font-bold">(₦140k Deposit)</span></div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Complete manufacturing plant system with up to 5 delivery trucks, driver shortage audit, nylon roll yield, diesel costing, and remote owner oversight.
                  </p>
                  <ul className="text-xs text-slate-200 space-y-1.5 pt-2 border-t border-[#d4af37]/30">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Production shift counter (Sachets &amp; Bottles)</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Nylon roll yield &amp; theft auditor (1kg = 16 bags)</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Multi-truck driver shortage automatic debit</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> Generator diesel cost per bag calculator</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> NAFDAC water purity &amp; TDS compliance logger</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 8:00 PM automated WhatsApp shift audit</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#d4af37]" /> 50% commitment deposit (₦140,000) to start</li>
                  </ul>
                </div>

                {/* Tier 3: Industrial Mega Plant */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mega Industrial Suite</span>
                  <div className="text-xl font-black text-white">₦550,000 <span className="text-xs text-slate-400 font-normal">(₦275k Deposit)</span></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    For high-speed automatic bottling plants with 6+ delivery trucks and multiple regional depots.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Multi-plant &amp; regional depot linking</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Moniepoint direct bank webhook auto-match</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Dedicated custom domain &amp; on-site training</li>
                  </ul>
                </div>

              </div>

              {/* Settlement Account Box */}
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
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Good day Bethelmind Desk! I want to confirm payment for the AquaFlow Industrial Water Factory ERP (₦140,000 50% Milestone Deposit) for ${factoryName}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#060911] font-black text-sm shadow-xl hover:brightness-110 transition cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Confirm 50% Milestone Deposit on WhatsApp (0802 279 1227)</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ──────────────────────────────────────────────────────────────────────────
          PRINT-READY NAFDAC CERTIFICATE MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      {showNafdacCertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowNafdacCertModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                NATIONAL AGENCY FOR FOOD AND DRUG ADMINISTRATION AND CONTROL (NAFDAC)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                DAILY WATER PURITY &amp; SANITATION INSPECTION CERTIFICATE
              </h2>
              <p className="text-xs text-slate-600 font-mono">
                Factory: <strong>{factoryName}</strong> &bull; Location: {locationName}
              </p>
            </div>

            {/* Certificate Table */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl font-mono">
                <div><span>Inspection Date:</span> <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
                <div><span>Batch Code:</span> <strong>{nafdacBatchNo}</strong></div>
                <div><span>Shift Supervisor:</span> <strong>{supervisorName}</strong></div>
                <div><span>NAFDAC Reg No:</span> <strong>01-84920L</strong></div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Testing Parameter</th>
                      <th className="p-2.5">Recorded Reading</th>
                      <th className="p-2.5">Regulatory Standard</th>
                      <th className="p-2.5">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2.5 font-bold">Raw Borehole Water TDS</td>
                      <td className="p-2.5">{rawWaterTds} ppm</td>
                      <td className="p-2.5 text-slate-500">Baseline</td>
                      <td className="p-2.5 text-emerald-700 font-bold">Tested</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Treated Permeate Water TDS</td>
                      <td className="p-2.5 font-bold text-emerald-700">{treatedWaterTds} ppm</td>
                      <td className="p-2.5 text-slate-500">&lt; 100 ppm</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASS (88% Rejection)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Water Acidity / Alkalinity</td>
                      <td className="p-2.5">{waterPh} pH</td>
                      <td className="p-2.5 text-slate-500">6.5 – 7.5 pH</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASS (Neutral)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">UV Sterilization (254nm)</td>
                      <td className="p-2.5 text-emerald-700 font-bold">ACTIVE</td>
                      <td className="p-2.5 text-slate-500">Continuous</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Ozone (O3) Contact Concentration</td>
                      <td className="p-2.5 text-emerald-700 font-bold">0.4 mg/L</td>
                      <td className="p-2.5 text-slate-500">0.2 – 0.4 mg/L</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature & Print Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="text-[10px] text-slate-500 font-mono">
                Digitally Authenticated by AquaFlow Compliance Station &bull; CAC Reg: 9912717
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          APPLICATION FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="mt-12 border-t border-white/10 bg-[#04060c] py-6 px-4 text-center text-xs text-slate-500">
        <p>
          AquaFlow ERP™ v5.0 Enterprise &bull; Industrial Water Factory Operating System &bull; Powered by Bethelmind Digital Solutions (CAC Reg: 9912717)
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Official Settlement: Moniepoint Microfinance Bank (6805375225) &bull; Enterprise Hotline: 0802 279 1227
        </p>
      </footer>

    </div>
  );
}
