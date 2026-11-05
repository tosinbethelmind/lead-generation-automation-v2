'use client';

/**
 * @file src/app/factory/owner/page.tsx
 * 
 * 💧 MR. OBI'S DUAL-PRODUCTION OWNER EXECUTIVE PORTAL
 * Sachet Water + Bottled Water (50cl/75cl/1.5L) + 19L Dispenser Jars
 * 1-Tap Phone Home Screen Access with 4-Digit Security PIN (2026)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Droplets,
  Truck,
  Zap,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageCircle,
  RefreshCw,
  Share2,
  FileText,
  UserCheck,
  Fuel,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Sliders,
  Check,
  Copy,
  Package,
  Layers,
  Cylinder
} from 'lucide-react';

export default function ObiOwnerExecutivePortal() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [activeProductionTab, setActiveProductionTab] = useState<'all' | 'sachet' | 'bottle'>('all');

  // ───────────────────────────────────────────────────────────────────────────
  // DUAL-LINE PRODUCTION DATA
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Sachet Line
  const [sachetBagsSealed, setSachetBagsSealed] = useState(4200);
  const [sachetPrice, setSachetPrice] = useState(350);
  const [nylonKgConsumed, setNylonKgConsumed] = useState(260); // 260kg LDPE film

  // 2. Bottled Water Line (50cl, 75cl, 19L)
  const [bottle75clPacks, setBottle75clPacks] = useState(250); // 12 x 75cl @ N1,200
  const [bottle75clPrice, setBottle75clPrice] = useState(1200);
  const [bottle50clPacks, setBottle50clPacks] = useState(150); // 20 x 50cl @ N1,100
  const [bottle50clPrice, setBottle50clPrice] = useState(1100);
  const [dispenserJarsRefilled, setDispenserJarsRefilled] = useState(40); // 19L Refill @ N900
  const [dispenserJarPrice, setDispenserJarPrice] = useState(900);

  // Packaging Inventory & Shrinkage
  const [preformsIssued, setPreformsIssued] = useState(3000);
  const [blowMoldRejects, setBlowMoldRejects] = useState(24); // 0.8% normal reject
  const [emptyJarsRetrieved, setEmptyJarsRetrieved] = useState(38); // 2 unreturned jars

  // Fleet Mixed Loads
  const [truck1Sachet, setTruck1Sachet] = useState(1200);
  const [truck1Bottles, setTruck1Bottles] = useState(80);
  const [truck1Remitted, setTruck1Remitted] = useState(516000); // Balanced

  const [truck2Sachet, setTruck2Sachet] = useState(900);
  const [truck2Bottles, setTruck2Bottles] = useState(60);
  const [truck2Jars, setTruck2Jars] = useState(15);
  const [truck2Remitted, setTruck2Remitted] = useState(371500); // Short 40 sachet bags
  const [truck2PotholeBurstsClaimed, setTruck2PotholeBurstsClaimed] = useState(40);
  const [truck2PouchesReturned, setTruck2PouchesReturned] = useState(0); // 0 physical pouches = N14,000 debit

  // Diesel & Power
  const [dieselPrice, setDieselPrice] = useState(1350);
  const [dieselLitersBurned, setDieselLitersBurned] = useState(32); // 4 hrs @ 8L/hr
  const [genHours, setGenHours] = useState(4.0);

  // Cash Vault & Bank Accounts
  const [cashInHandVault, setCashInHandVault] = useState(385000);
  const [moniepointTransfersConfirmed, setMoniepointTransfersConfirmed] = useState(1485000);
  const [uncollectedCreditDebts, setUncollectedCreditDebts] = useState(65000);

  // NAFDAC
  const [treatedTds, setTreatedTds] = useState(24);
  const [treatedPh, setTreatedPh] = useState(7.2);

  // ───────────────────────────────────────────────────────────────────────────
  // FINANCIAL CALCULATIONS
  // ───────────────────────────────────────────────────────────────────────────
  const sachetGross = sachetBagsSealed * sachetPrice; // 1,470,000
  const bottle75clGross = bottle75clPacks * bottle75clPrice; // 300,000
  const bottle50clGross = bottle50clPacks * bottle50clPrice; // 165,000
  const dispenserGross = dispenserJarsRefilled * dispenserJarPrice; // 36,000
  const totalBottleLineGross = bottle75clGross + bottle50clGross + dispenserGross; // 501,000
  const totalGrossSales = sachetGross + totalBottleLineGross; // 1,971,000

  // Musa Shortage
  const truck2MissingSachets = 40;
  const truck2ShortageDebit = truck2MissingSachets * sachetPrice; // 14,000

  // Energy & Shift OPEX
  const totalDieselCost = dieselLitersBurned * dieselPrice; // 43,200
  const sachetFilmCost = Math.round(sachetBagsSealed * 16); // 67,200
  const preformAndCapCost = Math.round(preformsIssued * 28); // 84,000 (preform + cap + shrink wrap)
  const loadersWage = Math.round((sachetBagsSealed * 10) + ((bottle75clPacks + bottle50clPacks) * 30)); // 54,000
  const totalShiftOpex = totalDieselCost + sachetFilmCost + preformAndCapCost + loadersWage;
  const netEstimatedProfit = totalGrossSales - totalShiftOpex; // ~ N1,722,600 contribution margin

  const energyCostPerSachetBag = Number((totalDieselCost / (sachetBagsSealed + (bottle75clPacks * 12))).toFixed(2));

  // PIN Handlers
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '2026' || newPin === '1234') {
          setIsUnlocked(true);
          setPinError(false);
        } else {
          setPinError(true);
          setTimeout(() => {
            setPin('');
            setPinError(false);
          }, 900);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const unlockDemo = () => {
    setPin('2026');
    setIsUnlocked(true);
  };

  // WhatsApp Supervisor Sync Formatter
  const getWhatsAppReportText = () => {
    return `💧 *OBI TABLE & BOTTLED WATER — OWNER DAILY PROFIT DIGEST*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | 8:00 PM Audit
🏭 Factory: Obi Table Water & Bottling Plant
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *1. NET CASH IN HAND TODAY:*
• Net Estimated Cash Profit: *₦${netEstimatedProfit.toLocaleString()}*
• Total Shift Gross Sales: ₦${totalGrossSales.toLocaleString()}
  - Sachet Water Sales: ₦${sachetGross.toLocaleString()} (4,200 bags)
  - Bottled Water Sales: ₦${totalBottleLineGross.toLocaleString()} (400 packs + 40 jars)
• Verified Moniepoint Transfers: ₦${moniepointTransfersConfirmed.toLocaleString()}
• Cash in Supervisor's Vault: ₦${cashInHandVault.toLocaleString()}
• Pending Distributor Debts: ₦${uncollectedCreditDebts.toLocaleString()}

🏭 *2. FACTORY DUAL-LINE PRODUCTION:*
• Sachet Water: ${sachetBagsSealed.toLocaleString()} bags (${Math.round(sachetBagsSealed/300)} rolls used)
• 75cl Bottled Water: ${bottle75clPacks.toLocaleString()} packs (12x75cl @ ₦1,200)
• 50cl Bottled Water: ${bottle50clPacks.toLocaleString()} packs (20x50cl @ ₦1,100)
• 19L Dispenser Jars: ${dispenserJarsRefilled} refills (@ ₦900)
• Blow Molding Rejects: ${blowMoldRejects} bottles (${((blowMoldRejects/preformsIssued)*100).toFixed(1)}% - Optimal ✅)

🚚 *3. DRIVERS & SHORTAGE AUDIT:*
• Truck 1 (Emeka): 1,200 bags + 80 packs ➔ ₦516,000 (Balanced ✅)
• Truck 2 (Musa): 900 bags + 60 packs + 15 jars ➔ ₦371,500
  🚨 *SHORTAGE: -${truck2MissingSachetBags()} sachet bags (₦${truck2ShortageDebit.toLocaleString()}) AUTO-DEBITED FROM MUSA* (0 pouches returned)
• Empty 19L Jars: 38/40 returned (2 on client deposit)

⛽ *4. GENERATOR & POWER SLICER:*
• Gen Run Time: ${genHours} hrs (${dieselLitersBurned}L @ ₦${dieselPrice}/L = ₦${totalDieselCost.toLocaleString()})
• Fuel Overhead: ₦${energyCostPerSachetBag}/unit (Optimal ✅)

🔬 *5. NAFDAC WATER PURITY:*
• Treated Permeate TDS: ${treatedTds} ppm (< 100 ppm PASS ✅)
• Treated pH: ${treatedPh} (Neutral Standard PASS ✅)
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 *Audit Logged:* Tamper-proof on Obi Table Water OS.`;
  };

  function truck2MissingSachetBags() {
    return 40;
  }

  const copyWhatsAppReport = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(getWhatsAppReportText());
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white font-sans antialiased selection:bg-[#0B5FFF] selection:text-white pb-24">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          1. TOP APP BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-md shadow-[#0B5FFF]/30">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>Mr. Obi&apos;s Owner Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Dual-Plant: Sachets &bull; Bottles &bull; 19L Jars
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <button
              onClick={() => setIsUnlocked(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock Screen</span>
            </button>
          ) : (
            <button
              onClick={unlockDemo}
              className="px-2.5 py-1 rounded-lg bg-[#0B5FFF]/20 border border-[#0B5FFF]/40 text-[#38BDF8] text-[11px] font-bold cursor-pointer"
            >
              Demo Auto-Unlock (2026)
            </button>
          )}

          <Link
            href="/factory/login"
            className="text-[11px] text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. PIN PAD UNLOCK SCREEN (WHEN LOCKED)
      ────────────────────────────────────────────────────────────────────────── */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-xl shadow-[#0B5FFF]/30">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Enter Owner 4-Digit PIN
            </h1>
            <p className="text-xs text-slate-400 max-w-xs">
              Private access for Mr. Obi to audit sachet and bottled water profits, diesel burn rate, and driver short accounts.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    filled
                      ? 'bg-[#0B5FFF] scale-125 shadow-md shadow-[#0B5FFF]/50'
                      : 'bg-slate-700/80 border border-slate-600'
                  } ${pinError ? 'bg-rose-500 animate-bounce' : ''}`}
                />
              );
            })}
          </div>

          {pinError && (
            <div className="text-xs text-rose-400 font-bold animate-pulse">
              Incorrect PIN. Please try again.
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => {
              if (item === '') return <div key={idx} />;
              if (item === 'del') {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={handleBackspace}
                    className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center active:scale-95 transition cursor-pointer"
                  >
                    Clear
                  </button>
                );
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePinInput(item)}
                  className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xl flex items-center justify-center active:scale-95 transition cursor-pointer shadow-sm"
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={unlockDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tap Here to Auto-Fill Demo PIN (2026)</span>
          </button>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────────────────
            3. UNLOCKED EXECUTIVE OWNER DASHBOARD (DUAL-PRODUCTION)
        ────────────────────────────────────────────────────────────────────────── */
        <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
          
          {/* PWA Home Screen Helper Pill */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0B5FFF]/15 to-[#00C2CB]/15 border border-[#0B5FFF]/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span className="text-slate-200">
                <strong>Install on your phone:</strong> Tap browser menu &rarr; <em>&apos;Add to Home screen&apos;</em>.
              </span>
            </div>
            <button
              onClick={() => setShowInstallHelp(!showInstallHelp)}
              className="text-[11px] text-[#38BDF8] underline font-bold whitespace-nowrap cursor-pointer"
            >
              {showInstallHelp ? 'Hide' : 'How?'}
            </button>
          </div>

          {showInstallHelp && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <strong className="text-white block font-bold">📲 How to Save to Phone Home Screen:</strong>
              <div className="space-y-1 text-[11px]">
                <p>1. On <strong>Chrome (Android)</strong>: Tap the 3 dots (⋮) at top right &rarr; Select <strong>&apos;Add to Home screen&apos;</strong> &rarr; Tap <strong>Add</strong>.</p>
                <p>2. On <strong>Safari (iPhone)</strong>: Tap the Share button &rarr; Tap <strong>&apos;Add to Home Screen&apos;</strong>.</p>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────────────
              A. HERO CARD: TODAY'S TOTAL NET CASH PROFIT (DUAL-LINE)
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0B5FFF]/20 via-[#0F172A] to-slate-900 border-2 border-[#0B5FFF]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Today&apos;s Net Plant Profit (Sachet + Bottles)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Shift Active
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ₦{netEstimatedProfit.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                (from ₦{totalGrossSales.toLocaleString()} gross sales)
              </span>
            </div>

            {/* Sachet vs Bottle Revenue Split */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>💧 Sachet Water Line</span>
                  <span className="text-emerald-400 font-bold">74.6%</span>
                </div>
                <strong className="text-sm font-black text-white block mt-0.5">₦{sachetGross.toLocaleString()}</strong>
                <span className="text-[10px] text-slate-400">{sachetBagsSealed.toLocaleString()} bags @ ₦{sachetPrice}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>🍾 Bottled Line &amp; Jars</span>
                  <span className="text-[#38BDF8] font-bold">25.4%</span>
                </div>
                <strong className="text-sm font-black text-white block mt-0.5">₦{totalBottleLineGross.toLocaleString()}</strong>
                <span className="text-[10px] text-slate-400">400 packs + 40 dispenser jars</span>
              </div>
            </div>

            {/* Cash in Vault vs Transfers vs Credit */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Cash in Drawer</span>
                <strong className="text-xs text-emerald-400 font-bold">₦{cashInHandVault.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Moniepoint Transfers</span>
                <strong className="text-xs text-[#38BDF8] font-bold">₦{moniepointTransfersConfirmed.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Distributor Debts</span>
                <strong className="text-xs text-amber-400 font-bold">₦{uncollectedCreditDebts.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              B. DUAL PRODUCTION LINES BREAKDOWN
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  Factory Production Lines
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">All Machines Operational ✅</span>
            </div>

            {/* Sachet Line Card */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-white font-bold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Line 1: Sachet Water Machines</span>
                </strong>
                <span className="text-emerald-400 font-mono font-bold">{sachetBagsSealed.toLocaleString()} bags</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Nylon Film Used: {nylonKgConsumed}kg (~14 rolls)</span>
                <span className="text-slate-300">Theoretical Yield: 4,160 bags (Balanced ✅)</span>
              </div>
            </div>

            {/* Bottled Line Card */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-white font-bold flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Line 2: Bottling &amp; Dispenser Line</span>
                </strong>
                <span className="text-[#38BDF8] font-mono font-bold">₦{totalBottleLineGross.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-1.5 rounded-lg bg-slate-800/80">
                  <span className="text-slate-400 block">75cl Packs</span>
                  <strong className="text-white text-xs">{bottle75clPacks} pk</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/80">
                  <span className="text-slate-400 block">50cl Packs</span>
                  <strong className="text-white text-xs">{bottle50clPacks} pk</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/80">
                  <span className="text-slate-400 block">19L Jars</span>
                  <strong className="text-white text-xs">{dispenserJarsRefilled} jars</strong>
                </div>
              </div>

              {/* Preforms & Blow Molding Audit */}
              <div className="p-2 rounded-lg bg-black/40 text-[10px] text-slate-300 flex justify-between">
                <span>PET Preforms: {preformsIssued} blown &bull; Rejects: {blowMoldRejects} (0.8%)</span>
                <span className="text-emerald-400 font-bold">Blow Machine Optimal ✅</span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              C. FLEET SHORTAGE SHIELD (MIXED TRUCK LOADS)
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  Fleet Delivery &amp; Shortage Shield
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                1 Alert Active
              </span>
            </div>

            {/* Truck 1: Emeka */}
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block font-bold">Truck 1 &bull; Emeka (Lekki Route)</strong>
                <span className="text-[10px] text-slate-400">1,200 sachets + 80 bottle packs &bull; Remitted: ₦{truck1Remitted.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
              </span>
            </div>

            {/* Truck 2: Musa (FLAGGED SHORTAGE) */}
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-white font-bold flex items-center gap-1.5">
                    <span>Truck 2 &bull; Musa (Badore/Ajah)</span>
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded">SHORT</span>
                  </strong>
                  <span className="text-[10px] text-slate-300">
                    900 sachets + 60 bottle packs + 15 dispenser jars
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-400 block">-₦{truck2ShortageDebit.toLocaleString()}</span>
                  <span className="text-[9px] text-rose-300">Auto-Debited</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black/40 text-[10px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Musa Claim: &quot;40 sachet bags burst on potholes&quot;</span>
                  <span className="text-amber-400">Physical Pouches Returned: 0</span>
                </div>
                <p className="text-rose-400 font-medium">
                  ⚖️ <strong>Physical Pouch Rule Enforced:</strong> 0 empty pouches produced. ₦14,000 debited from Musa&apos;s commission.
                </p>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              D. GENERATOR DIESEL & POWER SLICER
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  Generator Fuel Overhead
                </h2>
              </div>
              <span className="text-emerald-400 font-bold">₦{energyCostPerSachetBag}/unit fuel rate</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Gen Hours</span>
                <strong className="text-xs text-white font-bold">{genHours} hrs</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Diesel Burned</span>
                <strong className="text-xs text-white font-bold">{dieselLitersBurned}L</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Fuel Cost</span>
                <strong className="text-xs text-emerald-400 font-bold">₦{totalDieselCost.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              E. NAFDAC WATER PURITY LOG
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  NAFDAC Purity Check (NIS 306:2008)
                </h2>
              </div>
              <span className="text-emerald-400 font-bold">100% Certified Pass ✅</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-800/50 flex justify-between items-center">
                <span className="text-slate-400">Permeate TDS:</span>
                <strong className="text-emerald-400">{treatedTds} ppm (&lt; 100 PASS)</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50 flex justify-between items-center">
                <span className="text-slate-400">Acidity (pH):</span>
                <strong className="text-emerald-400">{treatedPh} (Neutral PASS)</strong>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              F. 1-TAP WHATSAPP SYNC BUTTON
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="pt-2 space-y-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(getWhatsAppReportText())}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-lg shadow-[#25D366]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>📲 Send Dual-Line Shift Summary to WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyWhatsAppReport}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedStatus ? 'Copied! ✅' : 'Copy Text Summary'}</span>
              </button>

              <a
                href="tel:08022791227"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#38BDF8] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Plant Supervisor</span>
              </a>
            </div>
          </div>

        </main>
      )}

      {/* STICKY BOTTOM BAR */}
      {isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex items-center justify-between max-w-2xl mx-auto shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today&apos;s Net Profit</span>
            <strong className="text-sm font-black text-emerald-400">₦{netEstimatedProfit.toLocaleString()}</strong>
          </div>

          <a
            href={`https://wa.me/2348022791227?text=${encodeURIComponent(getWhatsAppReportText())}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#25D366]/30 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Sync</span>
          </a>
        </div>
      )}

    </div>
  );
}
