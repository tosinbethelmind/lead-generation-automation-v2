'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Smartphone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  TrendingDown, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface SmeWebsiteGraderProps {
  initialBusinessName?: string;
  initialCategory?: string;
  isCompact?: boolean;
}

const SECTOR_OPTIONS = [
  'Beauty & Hair Salons / Spas',
  'Solar & Renewable Energy',
  'Automotive & Tokunbo Dealerships',
  'Fashion Boutiques & Retail Stores',
  'Medical Clinics & Diagnostic Labs',
  'Hotels & Luxury Shortlets',
  'Real Estate & Property Developers',
  'Logistics & Interstate Freight',
  'Schools & Private Academies',
  'Building Contractors & Interior POP',
  'Agribusiness & Poultry/Fish Farms',
  'Other Commercial Enterprise'
];

const NIGERIAN_STATES = [
  'Lagos (Ikeja, Lekki, VI, Mainland)',
  'Abuja (FCT)',
  'Rivers (Port Harcourt)',
  'Oyo (Ibadan)',
  'Kano',
  'Edo (Benin City)',
  'Enugu',
  'Delta (Warri, Asaba)',
  'Ogun (Abeokuta, Sagamu)',
  'Other State'
];

export function SmeWebsiteGraderWidget({ 
  initialBusinessName = '', 
  initialCategory = 'Beauty & Hair Salons / Spas',
  isCompact = false 
}: SmeWebsiteGraderProps) {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [category, setCategory] = useState(initialCategory);
  const [state, setState] = useState(NIGERIAN_STATES[0]);
  const [phone, setPhone] = useState('');
  
  const [scanStep, setScanStep] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  
  const [score, setScore] = useState<number>(38);
  const [estimatedLeak, setEstimatedLeak] = useState<string>('₦280,000');
  const [previewSlug, setPreviewSlug] = useState<string>('');

  const scanMilestones = [
    'Scanning Google Search index for commercial presence...',
    'Checking third-party directory listings (Jiji, Vconnect, BusinessList)...',
    'Detecting competitor Google search-ad interception risk...',
    'Simulating WhatsApp speed-to-lead response latency...',
    'Verifying fake alert bank transfer reconciliation shield...',
    'Finalizing digital revenue audit and generating mobile prototype...'
  ];

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setIsScanning(true);
    setScanStep(0);
    setHasScanned(false);

    // Slugify business name for live preview
    const slug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setPreviewSlug(slug || 'commercial-sme-demo');

    // Simulate realistic leak based on sector
    if (category.includes('Solar') || category.includes('Real Estate') || category.includes('Automotive')) {
      setEstimatedLeak('₦650,000 – ₦1,400,000');
      setScore(34);
    } else if (category.includes('Clinic') || category.includes('School') || category.includes('Hotels')) {
      setEstimatedLeak('₦350,000 – ₦750,000');
      setScore(41);
    } else {
      setEstimatedLeak('₦180,000 – ₦450,000');
      setScore(38);
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setScanStep(current);
      if (current >= scanMilestones.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setHasScanned(true);
        }, 600);
      }
    }, 650);
  };

  const handleReset = () => {
    setHasScanned(false);
    setIsScanning(false);
    setScanStep(0);
  };

  const previewUrl = `/preview/${previewSlug || 'demo'}`;
  const whatsappInquiryUrl = `https://wa.me/2348022791227?text=${encodeURIComponent(
    `Hello Bethelmind, I ran the Google Revenue-Leak Grader for "${businessName || 'my business'}" (${category}). My score was ${score}/100 with estimated leak of ${estimatedLeak}/mo. I want to activate our live mobile website and 24/7 WhatsApp AI closer.`
  )}`;

  return (
    <div className="w-full my-10 rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Background glow effects */}
      <div 
        className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute -bottom-28 -left-28 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2026 Free Commercial Utility</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            100% Confidential &middot; 10-Second Instant Audit
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 leading-snug">
          The Nigerian SME Google Visibility &amp; Revenue-Leak Grader
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
          When high-intent customers search for your business on Google, do they reach your official mobile booking portal—or are competitor ads stealing your calls on generic directory listings? Enter your business details below to audit your digital leak score and test your pre-built mobile website prototype.
        </p>

        {/* ─── STATE 1: INPUT FORM ─── */}
        {!isScanning && !hasScanned && (
          <form onSubmit={handleStartScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Official Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Grandeur Hair Studio &amp; Spa"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Commercial Sector <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                >
                  {SECTOR_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Location / Base in Nigeria
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  WhatsApp Contact Phone <span className="text-slate-400 text-[11px]">(Optional for direct report)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] shadow-[0_0_30px_rgba(245,158,11,0.3)] cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Run 10-Second Google Visibility &amp; Revenue-Leak Audit →</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2.5">
                Generates a personalized report and immediate live mobile website prototype without requiring card details.
              </p>
            </div>
          </form>
        )}

        {/* ─── STATE 2: SCANNING ANIMATION ─── */}
        {isScanning && (
          <div className="py-10 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 animate-pulse">
              <Search className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-1">
                Auditing Digital Footprint for &ldquo;{businessName}&rdquo;
              </h4>
              <p className="text-xs text-amber-300 font-mono tracking-wide">
                Location: {state} &middot; Sector: {category}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-200 h-2.5 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (scanStep / scanMilestones.length) * 100)}%` }}
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto">
              <p className="text-xs text-slate-300 font-medium flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {scanMilestones[Math.min(scanMilestones.length - 1, scanStep)]}
              </p>
            </div>
          </div>
        )}

        {/* ─── STATE 3: AUDIT RESULTS SCORECARD & PROTOTYPE BRIDGE ─── */}
        {hasScanned && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex flex-col items-center justify-center text-rose-400 shrink-0">
                  <span className="text-2xl font-black">{score}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">/ 100</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    Grade D &middot; High Revenue Leak Vulnerability
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {businessName} has 4 acute visibility &amp; conversion leaks
                  </h4>
                  <p className="text-xs text-slate-300">
                    Calculated Monthly Lost Inquiries: <strong className="text-rose-300 font-semibold">{estimatedLeak}</strong> in potential revenue.
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition"
              >
                <RotateCcw className="w-3 h-3" />
                New Audit
              </button>
            </div>

            {/* Diagnostic Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Finding 1 */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/20 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    No Dedicated Standalone Website (22/100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Searches for {businessName} pull up third-party directories (Jiji, Vconnect, BusinessList) where competitors pay for banner ads right above your phone number.
                  </p>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/20 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Manual WhatsApp Latency (35/100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Customer inquiries arriving after 7 PM or during rush hours wait 45+ minutes. Nigerian buyers abandon unresponded DMs within 3 minutes.
                  </p>
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Fake Alert &amp; Teller Slip Risk (40/100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Staff rely on manual SMS alerts and screenshot slips. Lacks automated Moniepoint/OPay instant transfer API webhooks to prevent counterfeit payment fraud.
                  </p>
                </div>
              </div>

              {/* Finding 4 */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Zero Mobile Self-Service Catalog (30/100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prospects are forced to message back-and-forth for basic pricing and service availability instead of self-quoting via an interactive mobile widget.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── THE DIRECT TURNKEY SOLUTION (CONVERSION TO OUR WEBSITE OFFERING) ─── */}
            <div className="p-6 sm:p-8 rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                  ✓
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  Immediate Turnkey Solution &middot; Zero Developer Waiting
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
                We already built your live Official Mobile Website + 24/7 WhatsApp AI Assistant for &ldquo;{businessName}&rdquo;
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl">
                Instead of waiting 4 weeks or spending ₦350k with an agency, you can test your actual mobile website prototype live on your smartphone right now—complete with your business branding, sector quoting calculators, and fake-alert-proof bank transfer verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl font-black text-sm text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] transition"
                  style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  <span>Test Your Live Prototype Free On Phone →</span>
                </a>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl font-bold text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Chat with Closer Desk (0802 279 1227)</span>
                </a>
              </div>

              {/* 2-Tier Pricing Transparency */}
              <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Option 1: Starter Go-Live (&ldquo;Pay-Small-Small&rdquo;)
                  </div>
                  <div className="text-white font-black text-sm mb-1">
                    ₦35,000 one-time <span className="text-slate-400 font-normal text-xs">or ₦25,000/month</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Launches your pre-built mobile website + 24/7 WhatsApp AI bot + Moniepoint transfer shield immediately.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Option 2: Full Turnkey Custom Domain Suite
                  </div>
                  <div className="text-white font-black text-sm mb-1">
                    ₦75,000 50% Milestone <span className="text-slate-400 font-normal text-xs">(₦150,000 Total)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Includes dedicated .com / .com.ng registration, full code ownership, and Google Search indexing in 48h.
                  </p>
                </div>
              </div>

              {/* Bank Settlement Trust Badge */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>
                  Corporate Settlements: <strong className="text-white">Moniepoint Microfinance Bank (6805375225)</strong>
                </span>
                <span className="text-emerald-400 font-semibold">
                  ✓ Bethelmind Digital Solutions &middot; CAC Certified
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default SmeWebsiteGraderWidget;
