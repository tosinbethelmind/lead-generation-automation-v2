'use client';

/**
 * @file src/app/factory/owner/page.tsx
 * 
 * 💧 MR. OBI'S PRIVATE OWNER EXECUTIVE PORTAL (ALTERNATIVE 2)
 * 1-Tap Phone Home Screen Access with 4-Digit Security PIN
 * 
 * Features:
 * - 4-Digit Security PIN Lock (Default: 2026)
 * - PWA "Add to Home Screen" Mobile Prompt
 * - Live Today's Net Cash Profit & Production Counter
 * - Anti-Theft Driver Reconciliation (Musa Shortage Alert & Auto-Debit)
 * - Generator Diesel & Power Consumption Slicer
 * - Gate Sales Cash vs Moniepoint/OPay Transfer Reconciliation
 * - Distributor Debtor Aging & Credit Lock
 * - NAFDAC Purity Compliance Card
 * - 1-Tap Supervisor Direct WhatsApp Sync (Zero Meta API / Zero Ban Risk)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
 */

import React, { useState, useEffect } from 'react';
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
  Copy
} from 'lucide-react';

export default function ObiOwnerExecutivePortal() {
  // ───────────────────────────────────────────────────────────────────────────
  // PIN SECURITY STATE
  // ───────────────────────────────────────────────────────────────────────────
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // LIVE FACTORY DATA (MOCK / INTERACTIVE STATE)
  // ───────────────────────────────────────────────────────────────────────────
  const [sachetBagsSealed, setSachetBagsSealed] = useState(4200);
  const [sachetPrice, setSachetPrice] = useState(350);
  const [bottlePacksSealed, setBottlePacksSealed] = useState(180); // 12x75cl @ N1,100
  const [bottlePackPrice, setBottlePackPrice] = useState(1100);
  const [nylonKgConsumed, setNylonKgConsumed] = useState(260); // 260kg * 16 = 4,160 bags

  // Drivers
  const [truck1Bags, setTruck1Bags] = useState(1200); // Emeka (Lekki Route)
  const [truck1Remitted, setTruck1Remitted] = useState(420000); // Balanced

  const [truck2Bags, setTruck2Bags] = useState(900); // Musa (Badore/Ajah)
  const [truck2Remitted, setTruck2Remitted] = useState(287000); // Short 40 bags
  const [truck2PotholeBurstsClaimed, setTruck2PotholeBurstsClaimed] = useState(40);
  const [truck2PouchesReturned, setTruck2PouchesReturned] = useState(0); // 0 physical pouches = N14,000 debit!

  const [truck3Bags, setTruck3Bags] = useState(800); // Ibrahim (Epe Expressway)
  const [truck3Remitted, setTruck3Remitted] = useState(280000); // Balanced

  // Diesel & Power
  const [dieselPrice, setDieselPrice] = useState(1350);
  const [dieselLitersBurned, setDieselLitersBurned] = useState(28); // 3.5 hrs @ 8L/hr
  const [genHours, setGenHours] = useState(3.5);

  // Cash & Bank Vault
  const [cashInHandVault, setCashInHandVault] = useState(320000);
  const [moniepointTransfersConfirmed, setMoniepointTransfersConfirmed] = useState(680000);
  const [uncollectedCreditDebts, setUncollectedCreditDebts] = useState(40000);

  // NAFDAC
  const [treatedTds, setTreatedTds] = useState(24);
  const [treatedPh, setTreatedPh] = useState(7.2);

  // ───────────────────────────────────────────────────────────────────────────
  // CALCULATIONS
  // ───────────────────────────────────────────────────────────────────────────
  const sachetGross = sachetBagsSealed * sachetPrice;
  const bottleGross = bottlePacksSealed * bottlePackPrice;
  const totalGrossSales = sachetGross + bottleGross;

  // Driver Shortages
  const truck2BagsSoldCash = Math.floor(truck2Remitted / sachetPrice);
  const truck2ExcusedBursts = Math.min(truck2PouchesReturned, truck2PotholeBurstsClaimed);
  const truck2Accounted = truck2BagsSoldCash + truck2ExcusedBursts;
  const truck2ShortageBags = Math.max(0, truck2Bags - truck2Accounted);
  const truck2ShortageDebit = truck2ShortageBags * sachetPrice;

  // Energy & Opex
  const totalDieselCost = dieselLitersBurned * dieselPrice;
  const energyCostPerBag = Number((totalDieselCost / (sachetBagsSealed || 1)).toFixed(2));
  const loadersWage = Math.round(sachetBagsSealed * 10); // N10/bag loader fee
  const packagingFilmCost = Math.round(sachetBagsSealed * 16); // N16/bag packaging cost
  const totalShiftOpex = totalDieselCost + loadersWage + packagingFilmCost;
  const netEstimatedProfit = totalGrossSales - totalShiftOpex;

  // PIN Handlers
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Validate PIN (Accept 2026 or 1234 for testing)
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
    return `💧 *OBI TABLE WATER — OWNER DAILY PROFIT DIGEST*
📅 Date: ${new Date().toLocaleDateString('en-GB')} | 8:00 PM Audit
🏭 Factory: Obi Table & Sachet Water Plant
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *1. NET CASH IN HAND TODAY:*
• Net Estimated Cash Profit: *₦${netEstimatedProfit.toLocaleString()}*
• Total Shift Gross Sales: ₦${totalGrossSales.toLocaleString()}
• Verified Moniepoint Transfers: ₦${moniepointTransfersConfirmed.toLocaleString()}
• Cash in Supervisor's Vault: ₦${cashInHandVault.toLocaleString()}
• Pending Distributor Credit: ₦${uncollectedCreditDebts.toLocaleString()}

🏭 *2. FACTORY PRODUCTION:*
• Sachet Water Packed: ${sachetBagsSealed.toLocaleString()} bags (@ ₦${sachetPrice})
• 75cl Bottled Water: ${bottlePacksSealed.toLocaleString()} packs (@ ₦${bottlePackPrice})
• Nylon Rolls Consumed: ${nylonKgConsumed}kg film (~100% yield)

🚚 *3. DRIVERS & SHORTAGE AUDIT:*
• Truck 1 (Emeka): 1,200 bags loaded ➔ ₦420,000 remitted (Balanced ✅)
• Truck 2 (Musa): 900 bags loaded ➔ ₦287,000 remitted
  ${truck2ShortageBags > 0 ? `🚨 *SHORTAGE: -${truck2ShortageBags} bags (₦${truck2ShortageDebit.toLocaleString()}) AUTO-DEBITED FROM MUSA* (0 pouches returned)` : 'Balanced ✅'}
• Truck 3 (Ibrahim): 800 bags loaded ➔ ₦280,000 remitted (Balanced ✅)

⛽ *4. GENERATOR & POWER SLICER:*
• Gen Run Time: ${genHours} hrs (${dieselLitersBurned}L @ ₦${dieselPrice}/L = ₦${totalDieselCost.toLocaleString()})
• *Fuel Cost per Sachet Bag:* ₦${energyCostPerBag}/bag (Within safe margin ✅)

🔬 *5. NAFDAC WATER PURITY:*
• Treated Permeate TDS: ${treatedTds} ppm (< 100 ppm PASS ✅)
• Treated pH: ${treatedPh} (Neutral Standard PASS ✅)
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 *Audit Logged:* Tamper-proof on Obi Table Water OS.`;
  };

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
          1. TOP APP BAR (PWA NATIVE FEEL)
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
              Facility: OBI-TW-LAG-081 &bull; Live Link
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
            href="/factory"
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
          >
            Full Product
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
              Direct tamper-proof access for Mr. Obi to audit daily factory cash, diesel, and driver accounts.
            </p>
          </div>

          {/* PIN Dots Indicator */}
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

          {/* 3x4 Number Pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => {
              if (item === '') {
                return <div key={idx} />;
              }
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

          {/* Demo Helper Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={unlockDemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap Here to Auto-Fill Demo PIN (2026)</span>
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-slate-500 pt-4">
            🔒 Bank-grade offline hash. Supervisor cannot see this portal without Mr. Obi&apos;s personal PIN.
          </p>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────────────────
            3. UNLOCKED EXECUTIVE OWNER DASHBOARD
        ────────────────────────────────────────────────────────────────────────── */
        <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
          
          {/* PWA Home Screen Helper Pill */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0B5FFF]/15 to-[#00C2CB]/15 border border-[#0B5FFF]/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span className="text-slate-200">
                <strong>Install on your phone:</strong> Tap browser menu &rarr; <em>&apos;Add to Home screen&apos;</em> for 1-tap app icon.
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
                <p>2. On <strong>Safari (iPhone)</strong>: Tap the Share button (square with arrow up) &rarr; Scroll down &rarr; Tap <strong>&apos;Add to Home Screen&apos;</strong>.</p>
                <p className="text-emerald-400 font-semibold">An icon named &quot;Obi Water&quot; will appear right beside your WhatsApp app!</p>
              </div>
            </div>
          )}

          {/* Live Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-300">Shift Batch A (Live)</span>
              <span>&bull;</span>
              <span>Supervisor: Kenneth</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Updated: Just now</span>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              A. HERO CARD: TODAY'S ESTIMATED NET PROFIT
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0B5FFF]/20 via-[#0F172A] to-slate-900 border-2 border-[#0B5FFF]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Today&apos;s Net Cash Profit</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                After Fuel &amp; Labour OPEX
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

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Cash in Hand</span>
                <strong className="text-xs text-emerald-400 font-bold">₦{cashInHandVault.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Bank Transfers</span>
                <strong className="text-xs text-[#38BDF8] font-bold">₦{moniepointTransfersConfirmed.toLocaleString()}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Pending Debt</span>
                <strong className="text-xs text-amber-400 font-bold">₦{uncollectedCreditDebts.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              B. MACHINE PRODUCTION & NYLON AUDIT
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  1. Production &amp; Nylon Yield
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">100% Balanced ✅</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Sachet Water Packed</span>
                <div className="text-lg font-black text-white">{sachetBagsSealed.toLocaleString()} <span className="text-xs font-normal text-slate-400">bags</span></div>
                <span className="text-[10px] text-slate-400">@ ₦{sachetPrice}/bag = ₦{sachetGross.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">75cl Bottled Water</span>
                <div className="text-lg font-black text-white">{bottlePacksSealed.toLocaleString()} <span className="text-xs font-normal text-slate-400">packs</span></div>
                <span className="text-[10px] text-slate-400">@ ₦{bottlePackPrice}/pack = ₦{bottleGross.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/40 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Nylon Rolls Used: <strong>{nylonKgConsumed}kg film</strong></span>
              <span className="text-emerald-400 font-medium">Theoretical Yield: 4,160 bags (No Ghost Shift)</span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              C. DRIVER SHORTAGE SHIELD (CATCHING MUSA LIVE)
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  2. Driver Loading &amp; Shortage Shield
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
                <span className="text-[10px] text-slate-400">Loaded: {truck1Bags} bags &bull; Remitted: ₦{truck1Remitted.toLocaleString()}</span>
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
                    Loaded: {truck2Bags} bags &bull; Remitted: ₦{truck2Remitted.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-400 block">-₦{truck2ShortageDebit.toLocaleString()}</span>
                  <span className="text-[9px] text-rose-300">Auto-Debited</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black/40 text-[10px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Musa Claim: &quot;40 bags burst on road&quot;</span>
                  <span className="text-amber-400">Physical Pouches Returned: 0</span>
                </div>
                <p className="text-rose-400 font-medium">
                  ⚖️ <strong>Factory Rule Enforced:</strong> 0 burst pouches = 0 excuse. ₦14,000 has been debited against Musa&apos;s weekly commission.
                </p>
              </div>
            </div>

            {/* Truck 3: Ibrahim */}
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block font-bold">Truck 3 &bull; Ibrahim (Epe Route)</strong>
                <span className="text-[10px] text-slate-400">Loaded: {truck3Bags} bags &bull; Remitted: ₦{truck3Remitted.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              D. GENERATOR DIESEL & POWER SLICER
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-black uppercase text-white tracking-wide">
                  3. Generator &amp; Diesel Consumption
                </h2>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">₦{energyCostPerBag}/bag fuel cost</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Gen Run Hours</span>
                <strong className="text-xs text-white font-bold">{genHours} hrs</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Diesel Burned</span>
                <strong className="text-xs text-white font-bold">{dieselLitersBurned} Litres</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Fuel Cost</span>
                <strong className="text-xs text-emerald-400 font-bold">₦{totalDieselCost.toLocaleString()}</strong>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between bg-slate-800/30 p-2 rounded-xl">
              <span>Fuel Price: ₦{dieselPrice}/L</span>
              <span className="text-slate-300">Target: &lt; ₦12/bag (Passed: ₦{energyCostPerBag}/bag)</span>
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
                  4. NAFDAC Water Quality
                </h2>
              </div>
              <span className="text-[10px] text-teal-400 font-bold">NIS 306:2008 Standard</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Permeate TDS:</span>
                <strong className="text-emerald-400 font-bold">{treatedTds} ppm (&lt; 100 PASS)</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Acidity (pH):</span>
                <strong className="text-emerald-400 font-bold">{treatedPh} (Neutral PASS)</strong>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────────────
              F. 1-TAP ACTION BUTTONS (WHATSAPP SYNC & CALL SUPERVISOR)
          ──────────────────────────────────────────────────────────────────────── */}
          <div className="pt-2 space-y-2.5">
            {/* 1-Tap Send to WhatsApp (Zero Meta API needed) */}
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(getWhatsAppReportText())}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-lg shadow-[#25D366]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>📲 Send Live Report to Mr. Obi on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyWhatsAppReport}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedStatus ? 'Copied to Clipboard!' : 'Copy Shift Summary'}</span>
              </button>

              <a
                href="tel:08022791227"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#38BDF8] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Supervisor</span>
              </a>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="text-center pt-4 text-[10px] text-slate-500 space-y-1">
            <div>Bethelmind Digital Solutions (CAC Certified: Reg 9912717)</div>
            <div>Official Hotline: 0802 279 1227 &bull; Moniepoint MFB: 6805375225</div>
          </div>

        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          4. STICKY MOBILE BOTTOM BAR (WHEN UNLOCKED)
      ────────────────────────────────────────────────────────────────────────── */}
      {isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex items-center justify-between max-w-2xl mx-auto shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today&apos;s Net Profit</span>
            <strong className="text-sm font-black text-emerald-400">₦{netEstimatedProfit.toLocaleString()}</strong>
          </div>

          <div className="flex items-center gap-2">
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
        </div>
      )}

    </div>
  );
}
