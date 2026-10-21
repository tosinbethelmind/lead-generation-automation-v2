'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Printer, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Sliders,
  DollarSign,
  Crown,
  FileCheck2,
  ChevronRight,
  Share2
} from 'lucide-react';

interface VehiclePreviewData {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  bodyClass: string;
  engine: {
    displacementL: string;
    cylinders: string;
    fuelType: string;
    horsepower?: string;
    turbo?: boolean;
  };
  plantCountry: string;
  plantState?: string;
  riskTier: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
  riskScorePreview: number;
  estimatedMileageMiles: number;
  fairPriceNairaEstimate: number;
  isUnlocked?: boolean;
}

interface FullReportData {
  vin: string;
  assessment: {
    fairPriceNaira: number;
    dealerPriceRange: { low: number; high: number };
    redFlagFloorPrice: number;
    estimatedCustomsDutyNaira: number;
    riskTier: string;
    riskScore: number;
  };
  salvageAndFloodAudit: {
    hasFloodCorridorOrigin: boolean;
    floodDetails?: string;
    copartSalvageAuctionRecord: boolean;
    salvageDetails?: string;
    openSafetyRecalls: number;
    recallList?: string[];
  };
  mechanicChecklist: {
    item: string;
    instruction: string;
    severity: 'CRITICAL' | 'WARNING' | 'STANDARD';
  }[];
}

const SAMPLE_VINS = [
  { label: '2017 Lexus RX350', vin: '2T2BZMCA8HC037890' },
  { label: '2015 Toyota Camry', vin: '4T1BF1FK7FU552011' },
  { label: '2016 Mercedes C300', vin: '55SWF4KB9GU152345' },
];

export function VinCheckerClient() {
  const [vinInput, setVinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [previewData, setPreviewData] = useState<VehiclePreviewData | null>(null);
  const [fullReport, setFullReport] = useState<FullReportData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    setVinInput(clean);
    setErrorMsg('');
  };

  const handleSampleClick = (sampleVin: string) => {
    setVinInput(sampleVin);
    setErrorMsg('');
    executeDecode(sampleVin);
  };

  const executeDecode = async (vinToDecode: string) => {
    if (vinToDecode.length !== 17) {
      setErrorMsg('Please enter a valid 17-character VIN number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setPreviewData(null);
    setFullReport(null);

    try {
      const res = await fetch('/api/vin-proxy/vin/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vinToDecode }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to decode VIN from NHTSA federal database.');
      }

      setPreviewData(json.data);

      if (json.data.isUnlocked) {
        await executeLoadReport(vinToDecode, true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with vehicle database.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeLoadReport = async (vin: string, bypass = false) => {
    setIsUnlocking(true);
    try {
      const res = await fetch('/api/vin-proxy/vin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, bypassPayment: bypass }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setFullReport(json.data);
        setShowPaymentModal(false);
      } else {
        throw new Error(json.error || 'Could not load executive report.');
      }
    } catch (err: any) {
      alert(`Report Notice: ${err.message}`);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappInquiryUrl = `https://wa.me/2348022791227?text=${encodeURIComponent(
    `Hello Bethelmind, I want to verify VIN: ${previewData?.vin || vinInput} for ${previewData ? `${previewData.year} ${previewData.make} ${previewData.model}` : 'a Tokunbo vehicle'}. Please confirm payment details for the Full Audit (₦3,500) or Dealer Pass (₦25,000).`
  )}`;

  return (
    <div className="w-full text-zinc-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* ─── ULTRA-LUXURY HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Deep Champagne & Emerald Ambient Glow Orbs */}
        <div 
          className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, #d97706 40%, transparent 75%)' }}
        />
        <div 
          className="pointer-events-none absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Pre-Header High-Contrast Glass Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-amber-300 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-xl">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Prestige Automotive Intelligence &middot; 2026 NHTSA Registry</span>
          </div>

          {/* High-Contrast Crisp Pure-White Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-5">
            Decode Any Car&rsquo;s VIN &amp; Reveal Its{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
              True Foreign History
            </span>
          </h1>

          <p className="text-zinc-200 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Detect US hurricane flood corridors (Florida, Texas), Copart auction salvage totals, open safety recalls, Lagos market valuations, and Nigerian Customs (NCS) duty estimates before wiring payments.
          </p>

          {/* ─── SEARCH TERMINAL CARD (LUXURY FROSTED OBSIDIAN) ─── */}
          <div className="max-w-2xl mx-auto p-5 sm:p-8 rounded-[2rem] border border-white/15 bg-black/75 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative">
            
            {/* Subtle top edge crystalline highlight */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

            <form onSubmit={(e) => { e.preventDefault(); executeDecode(vinInput); }} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={17}
                  value={vinInput}
                  onChange={handleVinChange}
                  placeholder="ENTER 17-CHAR CHASSIS / VIN NUMBER"
                  className="w-full px-5 py-4 pl-12 rounded-2xl bg-[#090d16] border-2 border-white/20 text-white font-mono font-bold text-base sm:text-lg tracking-wider placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 shadow-inner transition"
                />
                <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  vinInput.length === 17 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {vinInput.length} / 17
                </span>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-100 text-xs font-bold text-left flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-black flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] hover:brightness-110 shadow-[0_0_35px_rgba(245,158,11,0.4)] disabled:opacity-50 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Querying NHTSA Federal Database...</span>
                  </span>
                ) : (
                  <>
                    <Car className="w-4 h-4 text-black" />
                    <span>Verify VIN &amp; Run Pre-Purchase Audit →</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Test Sample Chips with high contrast */}
            <div className="mt-6 pt-5 border-t border-white/10 text-left">
              <span className="text-xs text-zinc-300 font-bold block mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test with high-volume Nigerian Tokunbo models:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VINS.map((s) => (
                  <button
                    key={s.vin}
                    type="button"
                    onClick={() => handleSampleClick(s.vin)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#111726] hover:bg-[#1a233a] border border-white/20 text-xs text-zinc-100 font-mono font-medium hover:border-amber-400/60 transition shadow-sm"
                  >
                    {s.label} ({s.vin.slice(0, 6)}...)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESULTS CONTAINER (HIGH-CONTRAST LUXURY CARDS) ─── */}
      {previewData && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
          
          {/* Main Identity & Risk Dossier Card */}
          <div className="p-6 sm:p-8 rounded-[2rem] border border-white/15 bg-black/85 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest text-amber-300">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  NHTSA Official Verified Vehicle Identity
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {previewData.year} {previewData.make} {previewData.model} {previewData.trim !== 'Standard' ? previewData.trim : ''}
                </h2>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-200 bg-[#141b2d] px-3 py-1 rounded-lg border border-white/15">
                    CHASSIS VIN: <strong>{previewData.vin}</strong>
                  </span>
                </div>
              </div>

              {/* Risk Badge with vibrant high contrast */}
              <div className="shrink-0">
                <div className={`px-4 py-2.5 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg ${
                  previewData.riskTier === 'HIGH RISK'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : previewData.riskTier === 'MODERATE RISK'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}>
                  {previewData.riskTier === 'HIGH RISK' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <span>{previewData.riskTier} (Score: {previewData.riskScorePreview}/100)</span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid - Crisp Pure White on Deep Slate */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 text-xs">
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-white/10">
                <span className="text-zinc-400 font-medium block mb-1">Model Year</span>
                <strong className="text-white text-base font-black">{previewData.year || 'N/A'}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-white/10">
                <span className="text-zinc-400 font-medium block mb-1">Engine &amp; Specs</span>
                <strong className="text-white text-base font-bold">{previewData.engine.displacementL} {previewData.engine.cylinders}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-white/10">
                <span className="text-zinc-400 font-medium block mb-1">Drivetrain / Body</span>
                <strong className="text-white text-base font-bold">{previewData.bodyClass || 'Sedan / SUV'}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-white/10">
                <span className="text-zinc-400 font-medium block mb-1">Assembly Plant</span>
                <strong className="text-white text-sm font-semibold">{previewData.plantCountry} {previewData.plantState ? `(${previewData.plantState})` : ''}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-white/10">
                <span className="text-zinc-400 font-medium block mb-1">Est. Mileage</span>
                <strong className="text-white text-base font-mono">~{previewData.estimatedMileageMiles.toLocaleString()} Mi</strong>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1220] border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-1">Fair Lagos Valuation</span>
                <strong className="text-emerald-300 text-lg font-black font-mono">
                  ₦{(previewData.fairPriceNairaEstimate / 1000000).toFixed(1)}M
                </strong>
              </div>
            </div>

            {/* ─── PAYWALL / UNLOCK BANNER (HIGH CONVERTING GOLD ACCENT) ─── */}
            {!fullReport && (
              <div className="mt-8 p-6 sm:p-7 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-black via-[#161204] to-black flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(245,158,11,0.18)]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Unlock Full Executive Pre-Purchase Audit (₦3,500)
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-200 max-w-xl leading-relaxed">
                    Uncovers Copart auction salvage totals, Texas/Florida hurricane flood records, safety recalls, NCS customs duty clearing tariffs, and the mechanic catalytic converter &amp; transmission inspection checklist.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-black transition hover:scale-105 shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                  >
                    <span>Unlock Full Report (₦3,500) →</span>
                  </button>
                  <button
                    onClick={() => executeLoadReport(previewData.vin, true)}
                    className="px-4 py-3.5 rounded-xl font-bold text-xs text-zinc-100 hover:text-white bg-[#111726] border border-white/20 hover:border-white/40 transition"
                  >
                    Instant Demo Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── FULL EXECUTIVE AUDIT REPORT (REVEALED IN ULTRA-CONTRAST) ─── */}
          {fullReport && (
            <div id="executive-report" className="space-y-6 animate-fadeIn">
              
              {/* Report Header Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-black/90 border border-white/15 backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block">
                      Official Executive Automotive Dossier
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">Issued by Bethelmind Digital Solutions</span>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-[#111726] hover:bg-[#1a233a] text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print / Save PDF</span>
                </button>
              </div>

              {/* Nigerian Market Valuation Matrix */}
              <div className="p-6 sm:p-7 rounded-[2rem] bg-black/85 border border-white/15 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white">
                    Nigerian Market Valuation &amp; Customs Duty Assessment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-[#090d16] border border-white/15">
                    <span className="text-zinc-300 font-medium block mb-1">Fair Wholesale Price</span>
                    <strong className="text-emerald-300 text-xl font-black block font-mono">
                      ₦{fullReport.assessment.fairPriceNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-zinc-400">Average Lagos Benchmark</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090d16] border border-white/15">
                    <span className="text-zinc-300 font-medium block mb-1">Dealership Margin Range</span>
                    <strong className="text-white text-lg font-bold block font-mono">
                      ₦{(fullReport.assessment.dealerPriceRange.low / 1000000).toFixed(1)}M – ₦{(fullReport.assessment.dealerPriceRange.high / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-zinc-400">Berger / Ikeja Retail Markup</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090d16] border-2 border-rose-500/50 bg-rose-950/20">
                    <span className="text-rose-300 block mb-1 font-black">⚠️ Red Flag Floor Price</span>
                    <strong className="text-rose-200 text-xl font-black block font-mono">
                      Below ₦{(fullReport.assessment.redFlagFloorPrice / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-rose-300">High Salvage or Flood Probability</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090d16] border border-amber-400/30">
                    <span className="text-amber-300 font-bold block mb-1">Est. Customs Duty (NCS)</span>
                    <strong className="text-amber-300 text-xl font-black block font-mono">
                      ₦{fullReport.assessment.estimatedCustomsDutyNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-zinc-400">Tin Can / Apapa Clearing Tariff</span>
                  </div>
                </div>
              </div>

              {/* Safety Recalls & Salvage Origin */}
              <div className="p-6 sm:p-7 rounded-[2rem] bg-black/85 border border-white/15 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-black text-white">
                    US Salvage &amp; Hurricane Flood Risk Audit
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
                    fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin
                      ? 'bg-rose-950/40 border-rose-500 text-rose-100'
                      : 'bg-emerald-950/30 border-emerald-500 text-emerald-100'
                  }`}>
                    {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-bold text-white mb-0.5">
                        {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? '🚨 Hurricane Flood Corridor Flagged' : '✓ No Hurricane Flood Corridor Flag'}
                      </strong>
                      <p className="text-zinc-200">
                        {fullReport.salvageAndFloodAudit.floodDetails || 'Vehicle assembly and title records show origin outside Florida and Texas flood disaster zones.'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
                    fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord
                      ? 'bg-amber-950/40 border-amber-400 text-amber-100'
                      : 'bg-emerald-950/30 border-emerald-500 text-emerald-100'
                  }`}>
                    {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-bold text-white mb-0.5">
                        {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? '⚠️ Auction Salvage Title Notice' : '✓ Clean Title Provenance Verified'}
                      </strong>
                      <p className="text-zinc-200">
                        {fullReport.salvageAndFloodAudit.salvageDetails || 'No uncorrected structural salvage or insurance total loss flags detected on federal registers.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nigerian Mechanic Pre-Purchase Inspection Checklist */}
              <div className="p-6 sm:p-7 rounded-[2rem] bg-black/85 border border-white/15 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white">
                    Nigerian Mechanic Pre-Purchase Physical Inspection Checklist
                  </h3>
                </div>
                <p className="text-xs text-zinc-300">
                  Print or screenshot this exact list for your mechanic at the car lot in Berger, Lekki, or Abuja:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                  {fullReport.mechanicChecklist?.map((c, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#090d16] border border-white/15 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-white text-sm">{c.item}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal">{c.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── PAYMENT & UNLOCK MODAL (HIGH CONTRAST & PRESTIGE) ─── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="max-w-lg w-full rounded-[2rem] border-2 border-amber-400/50 bg-[#080c14] p-6 sm:p-8 space-y-6 shadow-[0_24px_80px_rgba(0,0,0,0.9)] relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-black text-white">Unlock Executive VIN Dossier</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-zinc-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed font-medium">
              Select your access pass below. Settlements verified instantly via Moniepoint &amp; Paystack:
            </p>

            <div className="space-y-3.5">
              {/* Option 1: Single Report */}
              <div className="p-4 rounded-2xl bg-black border-2 border-amber-400/50 flex items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                    Single Vehicle Pre-Purchase Audit
                  </span>
                  <div className="text-white font-black text-xl">₦3,500 <span className="text-xs text-zinc-400 font-normal">one-time</span></div>
                  <span className="text-[11px] text-zinc-300">Complete salvage, flood, customs tariff &amp; mechanic checklist</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black text-xs font-black shrink-0 transition shadow-lg cursor-pointer"
                >
                  Pay ₦3,500 →
                </a>
              </div>

              {/* Option 2: Dealer Fleet Pass */}
              <div className="p-4 rounded-2xl bg-black border-2 border-emerald-500/50 flex items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider block">
                    Dealer Fleet Pass (Berger / Car Marts)
                  </span>
                  <div className="text-white font-black text-xl">₦25,000 <span className="text-xs text-zinc-400 font-normal">/ month</span></div>
                  <span className="text-[11px] text-zinc-300">15 Full Audits + WhatsApp automated vehicle quoter</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 text-black text-xs font-black shrink-0 transition shadow-lg cursor-pointer"
                >
                  Get Pass →
                </a>
              </div>
            </div>

            {/* Direct Bank Transfer Details - Ultra High Contrast */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1624] border border-white/20 text-xs space-y-2">
              <span className="text-amber-400 block font-black text-xs uppercase tracking-wider">
                Direct Bank Transfer Settlement Desk:
              </span>
              <div className="text-white font-semibold flex justify-between items-center text-sm">
                <span>Bank: <strong className="text-white font-black">Moniepoint MFB / OPay</strong></span>
                <span>Account: <strong className="text-amber-300 font-mono text-base font-black">7034297995</strong></span>
              </div>
              <div className="text-zinc-200 text-xs">
                Account Name: <strong className="text-white">Oyelakin Tosin Matthew</strong>
              </div>
              <p className="text-[11px] text-zinc-300 pt-1 border-t border-white/10">
                After transfer, forward narration code to WhatsApp <strong className="text-emerald-400">0802 279 1227</strong> for instant PDF report unlock.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-zinc-400">
              <span>Bethelmind Digital Solutions &middot; CAC Certified</span>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  executeLoadReport(previewData?.vin || vinInput, true);
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Simulate Demo Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VinCheckerClient;
