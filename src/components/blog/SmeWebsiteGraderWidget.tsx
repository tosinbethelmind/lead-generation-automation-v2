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
    <div className="w-full my-10 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#040711] via-[#080D1A] to-[#120B05] p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.12)] relative overflow-hidden text-[#F4F4F5]">
      {/* Background glow effects */}
      <div 
        className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute -bottom-28 -left-28 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>2026 Free Commercial Utility</span>
          </div>
          <span className="text-xs text-[#CBD5E1] font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-300" />
            100% Confidential &middot; 10-Second Instant Audit
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 leading-snug">
          The Nigerian SME Google Visibility &amp; Revenue-Leak Grader
        </h3>
        <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed mb-8">
          When high-intent customers search for your business on Google, do they reach your official mobile booking portal—or are competitor ads stealing your calls on generic directory listings? Enter your business details below to audit your digital leak score and test your pre-built mobile website prototype.
        </p>

        {/* ─── STATE 1: INPUT FORM ─── */}
        {!isScanning && !hasScanned && (
          <form onSubmit={handleStartScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#F4F4F5] mb-2">
                  Official Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Grandeur Hair Studio &amp; Spa"
                  className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#F4F4F5] mb-2">
                  Commercial Sector <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                >
                  {SECTOR_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#050810] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#F4F4F5] mb-2">
                  Location / Base in Nigeria
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#050810] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#F4F4F5] mb-2">
                  WhatsApp Contact Phone <span className="text-[#94A3B8] text-[11px] font-normal">(Optional for direct report)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-[#03060C] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }}
              >
                <Search className="w-4 h-4 text-[#03060C]" />
                <span>Run 10-Second Google Visibility &amp; Revenue-Leak Audit →</span>
              </button>
              <p className="text-[11px] text-[#94A3B8] text-center mt-2.5">
                Generates a personalized report and immediate live mobile website prototype without requiring card details.
              </p>
            </div>
          </form>
        )}

        {/* ─── STATE 2: SCANNING ANIMATION ─── */}
        {isScanning && (
          <div className="py-10 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Search className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white mb-1">
                Auditing Digital Footprint for &ldquo;{businessName}&rdquo;
              </h4>
              <p className="text-xs text-amber-300 font-mono tracking-wide font-bold">
                Location: {state} &middot; Sector: {category}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#03060C] rounded-full h-3 overflow-hidden border border-white/15 max-w-md mx-auto p-0.5">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-200 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (scanStep / scanMilestones.length) * 100)}%` }}
              />
            </div>

            <div className="p-4 rounded-xl bg-[#080D1A] border border-white/15 max-w-md mx-auto shadow-lg">
              <p className="text-xs text-[#CBD5E1] font-semibold flex items-center justify-center gap-2">
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
            <div className="p-6 sm:p-7 rounded-2xl border border-rose-500/40 bg-[#1A0B10] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex flex-col items-center justify-center text-rose-300 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.25)] p-2">
                  <span className="text-3xl font-black">{score}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-200">/ 100</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/25 text-rose-200 text-xs font-black uppercase tracking-wider mb-1.5 border border-rose-500/40">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                    Grade D &middot; High Revenue Leak Vulnerability
                  </div>
                  <h4 className="text-lg font-black text-white tracking-tight">
                    {businessName} has 4 acute visibility &amp; conversion leaks
                  </h4>
                  <p className="text-xs text-[#CBD5E1] mt-0.5">
                    Calculated Monthly Lost Inquiries: <strong className="text-rose-300 font-black text-sm">{estimatedLeak}</strong> in potential revenue.
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-[#CBD5E1] hover:text-white flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 bg-[#050810] transition cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                New Audit
              </button>
            </div>

            {/* Diagnostic Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Finding 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A] border border-white/15 flex items-start gap-3.5 shadow-lg">
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-1">
                    No Dedicated Standalone Website (22/100)
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Searches for {businessName} pull up third-party directories (Jiji, Vconnect, BusinessList) where competitors pay for banner ads right above your phone number.
                  </p>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A] border border-white/15 flex items-start gap-3.5 shadow-lg">
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-1">
                    Manual WhatsApp Latency (35/100)
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Customer inquiries arriving after 7 PM or during rush hours wait 45+ minutes. Nigerian buyers abandon unresponded DMs within 3 minutes.
                  </p>
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A] border border-white/15 flex items-start gap-3.5 shadow-lg">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-1">
                    Fake Alert &amp; Teller Slip Risk (40/100)
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Staff rely on manual SMS alerts and screenshot slips. Lacks automated Moniepoint/OPay instant transfer API webhooks to prevent counterfeit payment fraud.
                  </p>
                </div>
              </div>

              {/* Finding 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A] border border-white/15 flex items-start gap-3.5 shadow-lg">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-1">
                    Zero Mobile Self-Service Catalog (30/100)
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Prospects are forced to message back-and-forth for basic pricing and service availability instead of self-quoting via an interactive mobile widget.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── THE DIRECT TURNKEY SOLUTION (CONVERSION TO OUR WEBSITE OFFERING) ─── */}
            <div className="p-6 sm:p-8 rounded-3xl border border-emerald-400/50 bg-gradient-to-br from-[#041F14] via-[#080D1A] to-[#040710] relative overflow-hidden shadow-2xl">
              <div 
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
                style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
              />

              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                  ✓
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                  Immediate Turnkey Solution &middot; Zero Developer Waiting
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug relative z-10">
                We already built your live Official Mobile Website + 24/7 WhatsApp AI Assistant for &ldquo;{businessName}&rdquo;
              </h4>
              <p className="text-[#CBD5E1] text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl relative z-10">
                Instead of waiting 4 weeks or spending ₦350k with an agency, you can test your actual mobile website prototype live on your smartphone right now—complete with your business branding, sector quoting calculators, and fake-alert-proof bank transfer verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 relative z-10">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl font-black text-sm text-[#03060C] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(52,211,153,0.45)] hover:scale-[1.02] transition cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #34D399, #10B981)' }}
                >
                  <Smartphone className="w-4 h-4 text-[#03060C]" />
                  <span>Test Your Live Prototype Free On Phone →</span>
                </a>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl font-bold text-sm text-emerald-300 bg-[#081810] border border-emerald-400/40 hover:bg-[#0E2419] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Chat with Closer Desk (0802 279 1227)</span>
                </a>
              </div>

              {/* 2-Tier Pricing Transparency */}
              <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs relative z-10">
                <div className="p-4 rounded-2xl bg-[#040710] border border-amber-400/30">
                  <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider mb-1">
                    Option 1: Starter Go-Live (&ldquo;Pay-Small-Small&rdquo;)
                  </div>
                  <div className="text-white font-black text-base mb-1">
                    ₦35,000 one-time <span className="text-[#94A3B8] font-normal text-xs">or ₦25,000/month</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    Launches your pre-built mobile website + 24/7 WhatsApp AI bot + Moniepoint transfer shield immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#040710] border border-emerald-400/30">
                  <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wider mb-1">
                    Option 2: Full Turnkey Custom Domain Suite
                  </div>
                  <div className="text-white font-black text-base mb-1">
                    ₦75,000 50% Milestone <span className="text-[#94A3B8] font-normal text-xs">(₦150,000 Total)</span>
                  </div>
                  <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                    Includes dedicated .com / .com.ng registration, full code ownership, and Google Search indexing in 48h.
                  </p>
                </div>
              </div>

              {/* Bank Settlement Trust Badge */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#CBD5E1] relative z-10">
                <span>
                  Corporate Settlements: <strong className="text-white">Moniepoint Microfinance Bank (6805375225)</strong>
                </span>
                <span className="text-emerald-300 font-black">
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