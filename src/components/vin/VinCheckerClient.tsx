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
  ExternalLink, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign,
  FileText
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
    // Sanitize: Uppercase and remove I, O, Q (forbidden in standard VINs)
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
        throw new Error(json.error || 'Failed to decode VIN from NHTSA database.');
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
    `Hello Bethelmind, I want to verify VIN: ${previewData?.vin || vinInput} for ${previewData ? `${previewData.year} ${previewData.make} ${previewData.model}` : 'a Tokunbo vehicle'}. Please provide payment confirmation for the Full Audit (₦3,500) or Dealer Pass (₦25,000).`
  )}`;

  return (
    <div className="w-full text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* ─── HERO SEARCH SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/5">
        <div 
          className="pointer-events-none absolute -top-40 left-1/3 w-[650px] h-[650px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-6">
            <Car className="w-4 h-4 text-amber-400" />
            <span>Official Tokunbo VIN Intelligence &middot; 2026 Database</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Decode Any Car&rsquo;s VIN &amp; Uncover Its{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              True Foreign History
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect US hurricane flood corridors (Florida, Texas), Copart/IAAI salvage auction damage, open safety recalls, fair Lagos market valuations, and Nigerian Customs (NCS) duty estimates before wiring funds.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-3xl border border-amber-400/30 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
            <form onSubmit={(e) => { e.preventDefault(); executeDecode(vinInput); }} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={17}
                  value={vinInput}
                  onChange={handleVinChange}
                  placeholder="ENTER 17-CHARACTER CHASSIS / VIN"
                  className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-base sm:text-lg tracking-wider placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold ${vinInput.length === 17 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {vinInput.length} / 17
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold text-left">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] shadow-[0_0_35px_rgba(245,158,11,0.3)] disabled:opacity-50 cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
              >
                {isLoading ? (
                  <span>⏳ Querying NHTSA Federal Database...</span>
                ) : (
                  <>
                    <Car className="w-4 h-4 text-slate-950" />
                    <span>Verify VIN &amp; Run Risk Audit →</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Sample Chips */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-left">
              <span className="text-xs text-slate-400 font-semibold block mb-2.5">
                ⚡ Quick test with high-volume Nigerian Tokunbo models:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VINS.map((s) => (
                  <button
                    key={s.vin}
                    type="button"
                    onClick={() => handleSampleClick(s.vin)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 font-mono transition"
                  >
                    {s.label} ({s.vin.slice(0, 6)}...)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESULTS CONTAINER ─── */}
      {previewData && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
          
          {/* Identity & Risk Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  NHTSA Verified Vehicle Identity
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {previewData.year} {previewData.make} {previewData.model} {previewData.trim !== 'Standard' ? previewData.trim : ''}
                </h2>
                <span className="inline-block mt-2 font-mono text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  VIN: {previewData.vin}
                </span>
              </div>

              {/* Risk Badge */}
              <div className="shrink-0">
                <div className={`px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center gap-2 ${
                  previewData.riskTier === 'HIGH RISK'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : previewData.riskTier === 'MODERATE RISK'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  {previewData.riskTier === 'HIGH RISK' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <span>{previewData.riskTier} (Score: {previewData.riskScorePreview}/100)</span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Model Year</span>
                <strong className="text-white text-sm">{previewData.year || 'N/A'}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Engine &amp; Fuel</span>
                <strong className="text-white text-sm">{previewData.engine.displacementL} {previewData.engine.cylinders}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Body Class</span>
                <strong className="text-white text-sm">{previewData.bodyClass || 'Sedan / SUV'}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Assembly Plant</span>
                <strong className="text-white text-sm">{previewData.plantCountry} {previewData.plantState ? `(${previewData.plantState})` : ''}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Estimated Mileage</span>
                <strong className="text-white text-sm">~{previewData.estimatedMileageMiles.toLocaleString()} Miles</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Fair Lagos Valuation</span>
                <strong className="text-emerald-400 text-sm font-black">
                  ₦{(previewData.fairPriceNairaEstimate / 1000000).toFixed(1)}M
                </strong>
              </div>
            </div>

            {/* Paywall Banner (Shown before unlock) */}
            {!fullReport && (
              <div className="mt-8 p-6 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Unlock Full Executive Pre-Purchase Audit (₦3,500)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Access complete Copart/IAAI auction salvage history, Florida/Texas flood checks, open safety recalls, Nigerian Customs (NCS) duty breakdown, and the mechanic catalytic converter &amp; gearbox inspection checklist.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 transition hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                  >
                    <span>Unlock Full Report (₦3,500) →</span>
                  </button>
                  <button
                    onClick={() => executeLoadReport(previewData.vin, true)}
                    className="px-4 py-3.5 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 transition"
                  >
                    Instant Preview Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── FULL EXECUTIVE AUDIT REPORT (REVEALED) ─── */}
          {fullReport && (
            <div id="executive-report" className="space-y-6 animate-fadeIn">
              
              {/* Report Header & Print Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Official Bethelmind Automotive Intelligence Dossier
                  </span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF Report</span>
                </button>
              </div>

              {/* Nigerian Market Valuation Matrix */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Nigerian Market Valuation &amp; Customs Duty Assessment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Fair Wholesale Price</span>
                    <strong className="text-emerald-400 text-lg font-black block">
                      ₦{fullReport.assessment.fairPriceNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-slate-500">Average Lagos Benchmark</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Dealership Margin Range</span>
                    <strong className="text-white text-lg font-bold block">
                      ₦{(fullReport.assessment.dealerPriceRange.low / 1000000).toFixed(1)}M – ₦{(fullReport.assessment.dealerPriceRange.high / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-slate-500">Berger / Ikeja Retail Markup</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30">
                    <span className="text-rose-400 block mb-1 font-bold">⚠️ Red Flag Floor Price</span>
                    <strong className="text-rose-400 text-lg font-black block">
                      Below ₦{(fullReport.assessment.redFlagFloorPrice / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-rose-300/80">High Salvage or Flood Probability</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Est. Customs Duty (NCS)</span>
                    <strong className="text-amber-400 text-lg font-black block">
                      ₦{fullReport.assessment.estimatedCustomsDutyNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-slate-500">Tin Can / Apapa Clearing Tariff</span>
                  </div>
                </div>
              </div>

              {/* Safety Recalls & Salvage Origin */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">
                    US Salvage &amp; Hurricane Flood Risk Audit
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}>
                    {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-bold text-white mb-0.5">
                        {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? '🚨 Hurricane Flood Corridor Flagged' : '✓ No Hurricane Flood Corridor Flag'}
                      </strong>
                      {fullReport.salvageAndFloodAudit.floodDetails || 'Vehicle assembly and title records show origin outside Florida and Texas flood disaster zones.'}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}>
                    {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-bold text-white mb-0.5">
                        {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? '⚠️ Auction Salvage Title Notice' : '✓ Clean Title Provenance Verified'}
                      </strong>
                      {fullReport.salvageAndFloodAudit.salvageDetails || 'No uncorrected structural salvage or insurance total loss flags detected on federal registers.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nigerian Mechanic Pre-Purchase Inspection Checklist */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">
                    Nigerian Mechanic Pre-Purchase Inspection Checklist
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Hand this exact checklist to your mechanic at the car lot in Berger, Lekki, or Abuja before making payment:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {fullReport.mechanicChecklist?.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white">{c.item}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{c.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── PAYMENT & UNLOCK MODAL ─── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-3xl border border-amber-400/40 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Unlock Executive VIN Dossier</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Choose your access tier for instant access. Payments are verified instantly via Moniepoint &amp; Paystack:
            </p>

            <div className="space-y-3">
              {/* Option 1: Single Report */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Single Vehicle Pre-Purchase Audit
                  </span>
                  <div className="text-white font-black text-lg">₦3,500 <span className="text-xs text-slate-400 font-normal">one-time</span></div>
                  <span className="text-[11px] text-slate-400">Complete salvage, flood, customs tariff &amp; mechanic checklist</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shrink-0 transition"
                >
                  Pay ₦3,500 →
                </a>
              </div>

              {/* Option 2: Dealer Fleet Pass */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Dealer Fleet Pass (Berger / Car Marts)
                  </span>
                  <div className="text-white font-black text-lg">₦25,000 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <span className="text-[11px] text-slate-400">15 Full Audits + WhatsApp automated vehicle quoter</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 transition"
                >
                  Get Pass →
                </a>
              </div>
            </div>

            {/* Direct Bank Transfer Details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-xs space-y-1.5">
              <span className="text-slate-400 block font-bold text-[11px] uppercase tracking-wider">
                Direct Bank Transfer Settlement Desk:
              </span>
              <div className="text-white font-semibold flex justify-between">
                <span>Bank: <strong>Moniepoint MFB / OPay</strong></span>
                <span>Account: <strong className="text-amber-400 font-mono">7034297995</strong></span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Account Name: <strong>Oyelakin Tosin Matthew</strong>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                After transfer, send narration code to WhatsApp <strong>0802 279 1227</strong> for instant PDF dispatch.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
              <span>Bethelmind Digital Solutions</span>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  executeLoadReport(previewData?.vin || vinInput, true);
                }}
                className="text-amber-400 hover:underline"
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
