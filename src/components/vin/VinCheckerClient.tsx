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
  Share2,
  Camera
} from 'lucide-react';
import { WhatsAppShareToUnlockModal } from '@/components/WhatsAppShareToUnlockModal';
import WhatsAppLeadCaptureGate from '@/components/WhatsAppLeadCaptureGate';

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
  const [showShareModal, setShowShareModal] = useState(false);
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
      const [reportRes, realHistoryRes] = await Promise.allSettled([
        fetch('/api/vin-proxy/vin/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin, bypassPayment: bypass }),
        }),
        fetch('/api/vin-lookup/real-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin }),
        }),
      ]);

      let baseReport: any = null;
      if (reportRes.status === 'fulfilled') {
        const json = await reportRes.value.json().catch(() => ({}));
        if (json.success && json.data) {
          baseReport = json.data;
        }
      }

      if (realHistoryRes.status === 'fulfilled') {
        const histJson = await realHistoryRes.value.json().catch(() => ({}));
        if (histJson.success && histJson.data) {
          const hist = histJson.data;
          if (baseReport) {
            baseReport.auctionPhotos = hist.auctionHistory?.photos?.map((p: any) => p.url) || [];
            baseReport.nmvtisTitleBrands = hist.nmvtisTitleBrands || [];
            baseReport.realHistorySource = hist.source;
          }
        }
      }

      if (baseReport) {
        setFullReport(baseReport);
        setShowPaymentModal(false);
      } else {
        throw new Error('Could not load executive report from server.');
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
    <div className="w-full text-[#c9c4bc] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      
      {/* ─── ULTRA-LUXURY HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
        
        {/* Subtle Ambient Champagne Glow */}
        <div 
          className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Pre-Header Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0e17] border border-[#d4af37]/30 text-[#d4af37] text-xs font-medium uppercase tracking-widest mb-6 backdrop-blur-xl">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Prestige Automotive Intelligence &middot; 2026 NHTSA Registry</span>
          </div>

          {/* High-Contrast Editorial Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#f5f3ef] leading-snug lg:leading-[1.18] tracking-tight mb-5">
            Decode Any Car&rsquo;s VIN &amp; Reveal Its{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#f5f3ef] via-[#d4af37] to-[#aa8620] inline-block pb-1">
              True Foreign History
            </span>
          </h1>

          <p className="text-[#c9c4bc] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Detect US hurricane flood corridors (Florida, Texas), Copart auction salvage totals, open safety recalls, Lagos market valuations, and Nigerian Customs (NCS) duty estimates before wiring payments.
          </p>

          {/* ─── SEARCH TERMINAL CARD ─── */}
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0a0e17] shadow-2xl shadow-black/80 backdrop-blur-2xl relative">
            
            {/* Subtle top edge crystalline highlight */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

            <form onSubmit={(e) => { e.preventDefault(); executeDecode(vinInput); }} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={17}
                  value={vinInput}
                  onChange={handleVinChange}
                  placeholder="ENTER 17-CHAR CHASSIS / VIN NUMBER"
                  className="w-full px-5 py-4 pl-12 rounded-xl bg-[#070b14] border border-white/[0.12] text-[#f5f3ef] font-mono font-medium text-base tracking-wider placeholder-[#8e887e] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition"
                />
                <Search className="w-5 h-5 text-[#d4af37] absolute left-4 top-1/2 -translate-y-1/2" />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-medium px-2 py-0.5 rounded-md ${
                  vinInput.length === 17 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.04] text-[#8e887e]'
                }`}>
                  {vinInput.length} / 17
                </span>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs font-medium text-left flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-[#070b14] flex items-center justify-center gap-2.5 transition-all hover:brightness-110 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 50%, #aa8620 100%)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#070b14] border-t-transparent rounded-full animate-spin" />
                    <span>Querying NHTSA Federal Database...</span>
                  </span>
                ) : (
                  <>
                    <Car className="w-4 h-4 text-[#070b14]" />
                    <span>Verify VIN &amp; Run Pre-Purchase Audit →</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Test Sample Chips */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] text-left">
              <span className="text-xs text-[#8e887e] font-medium block mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Test with high-volume Nigerian Tokunbo models:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VINS.map((s) => (
                  <button
                    key={s.vin}
                    type="button"
                    onClick={() => handleSampleClick(s.vin)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#d4af37]/40 text-xs text-[#c9c4bc] font-mono font-normal transition shadow-sm"
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
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
          
          {/* Main Identity & Risk Dossier Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0a0e17] shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[11px] font-medium uppercase tracking-widest text-[#d4af37]">
                  <CheckCircle2 className="w-3 h-3 text-[#d4af37]" />
                  NHTSA Official Verified Vehicle Identity
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f3ef] mt-2">
                  {previewData.year} {previewData.make} {previewData.model} {previewData.trim !== 'Standard' ? previewData.trim : ''}
                </h2>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c9c4bc] bg-[#070b14] px-3 py-1 rounded-lg border border-white/[0.08]">
                    CHASSIS VIN: <strong className="text-[#f5f3ef]">{previewData.vin}</strong>
                  </span>
                </div>
              </div>

              {/* Risk Badge */}
              <div className="shrink-0">
                <div className={`px-4 py-2.5 rounded-xl border text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg ${
                  previewData.riskTier === 'HIGH RISK'
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-200 shadow-rose-950/40'
                    : previewData.riskTier === 'MODERATE RISK'
                    ? 'bg-amber-950/60 border-[#d4af37]/40 text-amber-200 shadow-amber-950/40'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
                }`}>
                  {previewData.riskTier === 'HIGH RISK' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <span className="font-semibold">{previewData.riskTier} (Score: {previewData.riskScorePreview}/100)</span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 text-xs">
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                <span className="text-[#8e887e] font-light block mb-1">Model Year</span>
                <strong className="text-[#f5f3ef] text-base font-medium">{previewData.year || 'N/A'}</strong>
              </div>
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                <span className="text-[#8e887e] font-light block mb-1">Engine &amp; Specs</span>
                <strong className="text-[#f5f3ef] text-base font-medium">{previewData.engine.displacementL} {previewData.engine.cylinders}</strong>
              </div>
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                <span className="text-[#8e887e] font-light block mb-1">Drivetrain / Body</span>
                <strong className="text-[#f5f3ef] text-base font-medium">{previewData.bodyClass || 'Sedan / SUV'}</strong>
              </div>
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                <span className="text-[#8e887e] font-light block mb-1">Assembly Plant</span>
                <strong className="text-[#f5f3ef] text-sm font-medium">{previewData.plantCountry} {previewData.plantState ? `(${previewData.plantState})` : ''}</strong>
              </div>
              <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                <span className="text-[#8e887e] font-light block mb-1">Est. Mileage</span>
                <strong className="text-[#f5f3ef] text-base font-mono">~{previewData.estimatedMileageMiles.toLocaleString()} Mi</strong>
              </div>
              <div className="p-4 rounded-xl bg-[#070b14] border border-emerald-500/25">
                <span className="text-emerald-400 font-medium block mb-1">Fair Lagos Valuation</span>
                <strong className="text-emerald-300 text-lg font-mono">
                  ₦{(previewData.fairPriceNairaEstimate / 1000000).toFixed(1)}M
                </strong>
              </div>
            </div>

            {/* ─── 1. INTERACTIVE WHATSAPP LEAD CAPTURE & REPORT UNLOCK GATE ─── */}
            <WhatsAppLeadCaptureGate
              toolType="vin"
              toolTitle={`${previewData.year} ${previewData.make} ${previewData.model} (VIN: ${previewData.vin})`}
              calculationSummary={`VIN: ${previewData.vin} (${previewData.year} ${previewData.make} ${previewData.model} ${previewData.trim}). Risk: ${previewData.riskTier} (${previewData.riskScorePreview}/100). Lagos Fair Valuation: ₦${(previewData.fairPriceNairaEstimate / 1000000).toFixed(1)}M. Est Mileage: ~${previewData.estimatedMileageMiles.toLocaleString()} Mi.`}
              onSuccessCapture={(phone) => {
                executeLoadReport(previewData.vin, true);
              }}
              onDirectDownloadPdf={() => {
                window.print();
              }}
            />

            {/* ─── 2. PAYWALL / VIRAL SHARE UNLOCK BANNER ─── */}
            {!fullReport && (
              <div className="mt-4 p-6 sm:p-7 rounded-2xl border border-[#d4af37]/35 bg-gradient-to-r from-[#070b14] via-[#0f1422] to-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-black/60">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-base sm:text-lg font-normal text-[#f5f3ef]">
                      Unlock Full Executive Pre-Purchase Audit &amp; Stamped A4 PDF
                    </h3>
                  </div>
                  <p className="text-xs text-[#c9c4bc] max-w-xl leading-relaxed font-light">
                    Uncovers Copart auction salvage records, hurricane flood immersion, NCS statutory customs duty, and roadside catalytic converter (&quot;indomie&quot;) theft warning.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      const shareText = encodeURIComponent(`⚠️ Before buying any Tokunbo car in Lagos, check its VIN free on Bethelmind to detect stolen catalytic converters and exact 2026 customs duty: https://www.bethelmindanalytics.com/vin?vin=${previewData.vin}`);
                      window.open(`https://wa.me/?text=${shareText}`, '_blank');
                      executeLoadReport(previewData.vin, true);
                    }}
                    className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>📲 Share to WhatsApp (Unlock Free)</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#070b14] transition hover:brightness-110 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 50%, #aa8620 100%)' }}
                  >
                    <span>Instant Stamped PDF (₦3,500) →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── FULL EXECUTIVE AUDIT REPORT ─── */}
          {fullReport && (
            <div id="executive-report" className="space-y-6 animate-fadeIn">
              
              {/* Report Header Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0a0e17] border border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block">
                      Official Executive Automotive Dossier
                    </span>
                    <span className="text-[11px] text-[#8e887e] font-mono">Issued by Bethelmind Digital Solutions (CAC Certified Enterprise (Reg: 9912717))</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-[#e5c158] hover:to-amber-400 text-[#070b14] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#070b14]" />
                    <span>Download Stamped A4 PDF</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f3ef] text-xs font-medium flex items-center gap-1.5 border border-white/[0.1] transition cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Nigerian Market Valuation Matrix */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0e17] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">
                    Nigerian Market Valuation &amp; Customs Duty Assessment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
                  <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                    <span className="text-[#8e887e] font-light block mb-1">Fair Wholesale Price</span>
                    <strong className="text-emerald-300 text-xl font-medium block font-mono">
                      ₦{fullReport.assessment.fairPriceNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-[#8e887e]">Average Lagos Benchmark</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06]">
                    <span className="text-[#8e887e] font-light block mb-1">Dealership Margin Range</span>
                    <strong className="text-[#f5f3ef] text-lg font-medium block font-mono">
                      ₦{(fullReport.assessment.dealerPriceRange.low / 1000000).toFixed(1)}M – ₦{(fullReport.assessment.dealerPriceRange.high / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-[#8e887e]">Berger / Ikeja Retail Markup</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070b14] border border-rose-500/30 bg-rose-950/20">
                    <span className="text-rose-300 block mb-1 font-medium">Red Flag Floor Price</span>
                    <strong className="text-rose-200 text-xl font-medium block font-mono">
                      Below ₦{(fullReport.assessment.redFlagFloorPrice / 1000000).toFixed(1)}M
                    </strong>
                    <span className="text-[11px] text-rose-300/80">High Salvage or Flood Probability</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070b14] border border-[#d4af37]/30">
                    <span className="text-[#d4af37] font-medium block mb-1">Est. Customs Duty (NCS)</span>
                    <strong className="text-[#d4af37] text-xl font-medium block font-mono">
                      ₦{fullReport.assessment.estimatedCustomsDutyNaira.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-[#8e887e]">Tin Can / Apapa Clearing Tariff</span>
                  </div>
                </div>
              </div>

              {/* Safety Recalls & Salvage Origin */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0e17] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">
                    US Salvage &amp; Hurricane Flood Risk Audit
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                  }`}>
                    {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-medium text-[#f5f3ef] mb-0.5">
                        {fullReport.salvageAndFloodAudit.hasFloodCorridorOrigin ? 'Hurricane Flood Corridor Flagged' : 'Coastal Origin Query: Standard Zone'}
                      </strong>
                      <p className="text-[#c9c4bc] font-light">
                        {fullReport.salvageAndFloodAudit.floodDetails || 'Vehicle assembly and title records show origin outside Florida and Texas flood disaster zones.'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                  }`}>
                    {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <div className="text-xs leading-relaxed">
                      <strong className="block text-sm font-medium text-[#f5f3ef] mb-0.5">
                        {fullReport.salvageAndFloodAudit.copartSalvageAuctionRecord ? 'Auction Salvage Title Notice' : 'Public Registry Query: No Open Flags'}
                      </strong>
                      <p className="text-[#c9c4bc] font-light">
                        {fullReport.salvageAndFloodAudit.salvageDetails || 'No uncorrected structural salvage or insurance total loss flags detected on federal registers.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genuine US Salvage & Auction Photos Gallery (Copart / IAAI) */}
              {fullReport.auctionPhotos && fullReport.auctionPhotos.length > 0 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0e17] border border-[#d4af37]/35 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#d4af37]" />
                      <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">
                        US Auction Yard Photographic Evidence ({fullReport.auctionPhotos.length} Photos)
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/30">
                      Copart / IAAI Archive
                    </span>
                  </div>
                  <p className="text-xs text-[#c9c4bc] font-light">
                    Actual archival photographs of the vehicle at the US salvage auction facility before export to Lagos:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {fullReport.auctionPhotos.map((photoUrl: string, idx: number) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video bg-black/40">
                        <img src={photoUrl} alt={`Auction Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nigerian Mechanic Pre-Purchase Inspection Checklist */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0e17] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-serif text-lg font-normal text-[#f5f3ef]">
                    Nigerian Mechanic Pre-Purchase Physical Inspection Checklist
                  </h3>
                </div>
                <p className="text-xs text-[#8e887e] font-light">
                  Print or screenshot this exact list for your mechanic at the car lot in Berger, Lekki, or Abuja:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                  {fullReport.mechanicChecklist?.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#070b14] border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#f5f3ef] text-sm">{c.item}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          c.severity === 'CRITICAL' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-[#c9c4bc] text-xs leading-relaxed font-light">{c.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── STATUTORY LEGAL DISCLAIMER & LIMITATION OF LIABILITY (FCCPA 2018) ─── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-[11px] text-[#8e887e] leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Legal Disclaimer &amp; Liability Cap (FCCPA 2018)</span>
                </div>
                <p>
                  This report is an advisory technical specification compiled from U.S. NHTSA vPIC manufacturing databases and Nigerian Customs Service (NCS) statutory tariffs. It does <strong>not</strong> constitute an insurance policy, title guarantee, or mechanical warranty. Bethelmind Digital Solutions disclaims all liability for undisclosed private collision records, post-import modifications, or dockside component removal. Total liability is strictly limited to the fee paid for this report (₦3,500). Physical on-site mechanic verification of Section 4 is strictly required prior to releasing funds.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── PAYMENT & UNLOCK MODAL ─── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="max-w-lg w-full rounded-3xl border border-[#d4af37]/40 bg-[#0a0e17] p-6 sm:p-8 space-y-6 shadow-2xl shadow-black relative text-[#c9c4bc]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-serif text-xl font-normal text-[#f5f3ef]">Unlock Executive VIN Dossier</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-[#8e887e] hover:text-[#f5f3ef] p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#c9c4bc] leading-relaxed font-light">
              Select your access pass below. Settlements verified instantly via Moniepoint Microfinance Bank:
            </p>

            <div className="space-y-3.5">
              {/* Option 1: Single Report */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-[#d4af37]/35 flex items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider block">
                    Single Vehicle Pre-Purchase Audit
                  </span>
                  <div className="text-[#f5f3ef] font-serif text-xl">₦3,500 <span className="text-xs text-[#8e887e] font-sans font-normal">one-time</span></div>
                  <span className="text-[11px] text-[#8e887e] font-light">Complete salvage, flood, customs tariff &amp; mechanic checklist</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:brightness-110 text-[#070b14] text-xs font-bold shrink-0 transition shadow-lg cursor-pointer"
                >
                  Pay ₦3,500 →
                </a>
              </div>

              {/* Option 2: Dealer Fleet Pass */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-emerald-500/35 flex items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Dealer Fleet Pass (Berger / Car Marts)
                  </span>
                  <div className="text-[#f5f3ef] font-serif text-xl">₦25,000 <span className="text-xs text-[#8e887e] font-sans font-normal">/ month</span></div>
                  <span className="text-[11px] text-[#8e887e] font-light">15 Full Audits + WhatsApp automated vehicle quoter</span>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 text-[#070b14] text-xs font-bold shrink-0 transition shadow-lg cursor-pointer"
                >
                  Get Pass →
                </a>
              </div>
            </div>

            {/* Direct Bank Transfer Details */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#070b14] border border-white/[0.08] text-xs space-y-2">
              <span className="text-[#d4af37] block font-semibold text-xs uppercase tracking-wider">
                Direct Corporate Bank Transfer Desk:
              </span>
              <div className="text-[#f5f3ef] font-normal flex justify-between items-center text-sm">
                <span>Bank: <strong className="text-[#f5f3ef] font-medium">Moniepoint Microfinance Bank</strong></span>
                <span>Account: <strong className="text-[#d4af37] font-mono text-base font-bold">6805375225</strong></span>
              </div>
              <div className="text-[#8e887e] text-xs">
                Beneficiary Name: <strong className="text-[#f5f3ef] font-medium">Bethelmind Digital Solutions</strong>
              </div>
              <p className="text-[11px] text-[#8e887e] pt-1.5 border-t border-white/[0.06] font-light">
                After transfer, forward narration to WhatsApp <strong className="text-[#d4af37] font-medium">0802 279 1227</strong> for instant PDF report unlock.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-[#8e887e]">
              <span>Bethelmind Digital Solutions &middot; CAC Certified Enterprise (Reg: 9912717)</span>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  executeLoadReport(previewData?.vin || vinInput, true);
                }}
                className="text-[#d4af37] font-medium hover:underline cursor-pointer"
              >
                Simulate Demo Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1000x Viral WhatsApp Share-to-Unlock Modal */}
      {fullReport && (
        <WhatsAppShareToUnlockModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          toolTitle={`${fullReport.year} ${fullReport.make} ${fullReport.model} Tokunbo VIN Certificate`}
          toolSlug={`vin/${fullReport.vin}`}
          pdfDownloadUrl={`/reports/REP-${fullReport.vin}.pdf`}
          reportReferenceCode={`REP-${fullReport.vin}`}
          summaryHighlights={[
            `NCS Customs Duty Benchmark: ₦${((fullReport.dutyBreakdown?.totalClearingEstimateNgn || fullReport.fairPriceNairaEstimate * 0.35)).toLocaleString()}`,
            `Auction Water Damage: ${fullReport.riskTier === 'LOW RISK' ? 'Zero Flood/Saltwater Flags' : 'Precaution Recommended'}`,
            `Catalytic Converter Scrap Check: Factory OEM Standard`,
            `Authentic CAC Accreditation: Reg 9912717`
          ]}
        />
      )}
    </div>
  );
}

export default VinCheckerClient;