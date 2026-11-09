'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ActiveBrief {
  id: string;
  title: string;
  location: string;
  budget: string;
  commission: string;
  type: string;
  description: string;
}

const ACTIVE_BRIEFS: ActiveBrief[] = [
  {
    id: 'DEAL-BANANA-1500M',
    title: 'Waterfront 6-Bedroom Ultra-Luxury Smart Villa',
    location: 'Banana Island, Ikoyi, Lagos',
    budget: '₦ 1,500,000,000',
    commission: '₦ 75,000,000 (80/20 Partner Split)',
    type: 'Offshore UK Diaspora Investor Fund',
    description: 'Verified cash buyer mandate with proof of liquid clearing. Ready for immediate statutory joint inspection.'
  },
  {
    id: 'DEAL-AMEN-500M',
    title: '7-Bedroom Sovereign Custom-Built Mansion',
    location: 'Amen Estate Phase 2, Eleko / Ibeju-Lekki Corridor',
    budget: '₦ 500,000,000',
    commission: '₦ 25,000,000 (80/20 Partner Split)',
    type: 'Oil & Gas Corporate Treasury Allocation',
    description: 'Direct institutional mandate. Completed titling (Governor’s Consent) verified. Inspection slot active.'
  },
  {
    id: 'DEAL-LEKKI1-480M',
    title: '5-Bedroom Contemporary Fully-Detached Duplex + BQ',
    location: 'Off Admiralty Way, Lekki Phase 1, Lagos',
    budget: '₦ 480,000,000',
    commission: '₦ 24,000,000 (80/20 Partner Split)',
    type: 'US-Based Tech Diaspora Family Mandate',
    description: 'Prime Lekki 1 residential portfolio. Seeking clean title ready for 48-hour closure upon inspection.'
  }
];

export default function MandatePortalPage() {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'briefs'>('online');

  // Form State
  const [formData, setFormData] = useState({
    mandate_type: 'DIRECT_LISTING',
    agency_name: '',
    contact_person: '',
    phone: '',
    email: '',
    office_address: '',
    property_title: '',
    property_location: '',
    asking_price: '',
    title_document: "Governor's Consent",
    inspection_timeframe: 'Next 24 to 48 Hours',
    deal_id: ''
  });

  // Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [signedResult, setSignedResult] = useState<{
    mandate_ref: string;
    evidence_hash: string;
    signed_at: string;
    phone: string;
    agency_name: string;
    property_title: string;
  } | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [activeTab]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Prefill brief into form
  const handleClaimBrief = (brief: ActiveBrief) => {
    setFormData(prev => ({
      ...prev,
      mandate_type: 'CLAIM_BRIEF',
      property_title: brief.title,
      property_location: brief.location,
      asking_price: brief.budget,
      deal_id: brief.id
    }));
    setActiveTab('online');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.agency_name.trim() || !formData.contact_person.trim() || !formData.phone.trim()) {
      setSubmitError('Please enter Agency Name, Signatory Name, and Direct WhatsApp Phone.');
      return;
    }

    if (!hasSignature || !canvasRef.current) {
      setSubmitError('A hand-drawn electronic signature is legally required under Section 84 Evidence Act 2011.');
      return;
    }

    const signatureDataUrl = canvasRef.current.toDataURL('image/png');

    try {
      setSubmitting(true);
      const res = await fetch('/api/mandate/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_name: formData.agency_name,
          contact_person: formData.contact_person,
          phone: formData.phone,
          email: formData.email,
          office_address: formData.office_address || 'Lagos, Nigeria',
          property_title: formData.property_title || 'Prime Lagos Luxury Mandate',
          property_location: formData.property_location || 'Lekki / Ikoyi Corridor, Lagos',
          asking_price: formData.asking_price || 'Market Commercial Valuation',
          signature_data_url: signatureDataUrl,
          mandate_type: formData.mandate_type,
          deal_id: formData.deal_id
        })
      });

      const data = await res.json();
      if (data.success && data.mandate) {
        setSignedResult({
          mandate_ref: data.mandate.mandate_ref,
          evidence_hash: data.mandate.evidence_hash,
          signed_at: data.mandate.signed_at,
          phone: formData.phone,
          agency_name: formData.agency_name,
          property_title: formData.property_title || 'Prime Lagos Luxury Mandate'
        });
      } else {
        setSubmitError(data.error || 'Failed to submit mandate.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error submitting mandate.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Navigation & CAC Certification Banner */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20">
              BM
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold">
                B2B Real Estate Desk
              </div>
              <div className="text-sm font-bold text-white">
                Bethelmind Digital Solutions
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CAC Reg: 9912717
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              LASRERA Standard 80/20
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mt-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 mb-4">
            <span>🏛️ Official Joint Inspection & Co-Brokerage Mandate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Joint Inspection Memorandum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">(JIM)</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Statutory bilateral agreement binding direct mandates, protecting your 80% agency commission, and expediting verified inspection clearance for liquid corporate and diaspora buyers.
          </p>
        </div>

        {/* 4 Core Protections Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-cyan-400 font-black text-sm mb-1">80% Commission Retention</div>
            <div className="text-xs text-slate-400 leading-normal">
              You retain 80% of total agency fees. Bethelmind retains a 20% origination fee.
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-emerald-400 font-black text-sm mb-1">Direct Liquid Buyers</div>
            <div className="text-xs text-slate-400 leading-normal">
              Pre-vetted offshore diaspora & treasury accounts with immediate settlement clearance.
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-amber-400 font-black text-sm mb-1">Sec. 84 Evidence Act</div>
            <div className="text-xs text-slate-400 leading-normal">
              Cryptographically hashed digital audit trail enforceable in High Court of Lagos State.
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-indigo-400 font-black text-sm mb-1">Zero Brief Hijacking</div>
            <div className="text-xs text-slate-400 leading-normal">
              Strict non-circumvention. Walkthroughs conducted only with mandated inspection counsel.
            </div>
          </div>
        </div>

        {/* Action Tabs Switcher */}
        <div className="flex items-center justify-center p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8 max-w-xl mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'online'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✍️</span> Online e-Sign
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'download'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🖨️</span> Download Blank
          </button>
          <button
            onClick={() => setActiveTab('briefs')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'briefs'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💎</span> Active Briefs
          </button>
        </div>

        {/* TAB 1: ONLINE E-SIGN MANDATE */}
        {activeTab === 'online' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            
            {/* Success Modal if signed */}
            {signedResult ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  STATUTORILY EXECUTED & SEALED
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-3 mb-2">
                  Joint Inspection Memorandum Confirmed
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Your mandate reference code is issued and registered on the Bethelmind statutory ledger. An automated notification has been dispatched to Principal Partner Tosin Oyelakin.
                </p>

                {/* Evidence Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-left text-xs max-w-lg mx-auto mb-6 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span>MANDATE REF:</span>
                    <span className="text-cyan-400 font-bold">{signedResult.mandate_ref}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span>AGENCY / BROKER:</span>
                    <span className="text-white font-bold">{signedResult.agency_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span>PROPERTY:</span>
                    <span className="text-slate-200">{signedResult.property_title}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span>TIMESTAMP:</span>
                    <span className="text-slate-300">{new Date(signedResult.signed_at).toLocaleString('en-GB')}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">SEC. 84 SHA-256 HASH:</span>
                    <span className="text-emerald-400 break-all text-[10px]">{signedResult.evidence_hash}</span>
                  </div>
                </div>

                {/* Next Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href={`/mandate/print?ref=${encodeURIComponent(signedResult.mandate_ref)}`}
                    target="_blank"
                    className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
                  >
                    <span>🖨️</span> View & Print Executed Agreement
                  </Link>
                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                      `Good day Tosin, we just digitally executed the Joint Inspection Memorandum on your portal.\n\nMandate Ref: ${signedResult.mandate_ref}\nAgency: ${signedResult.agency_name}\nProperty: ${signedResult.property_title}\n\nPlease confirm our joint walkthrough slot.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                  >
                    <span>💬</span> WhatsApp Admin Desk (+234 802 279 1227)
                  </a>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSignedResult(null);
                      clearSignature();
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Submit Another Mandate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Direct Mandate Execution Form
                  </h2>
                  <p className="text-xs text-slate-400">
                    Complete your agency representation details. Signing creates a binding digital instrument under Lagos State Real Estate Regulatory Authority (LASRERA) standards.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Mandate Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mandate_type: 'DIRECT_LISTING' })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.mandate_type === 'DIRECT_LISTING'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">Direct Listing Mandate</div>
                    <div className="text-[11px] text-slate-400">You hold the property brief and wish to present it to our investors.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mandate_type: 'CLAIM_BRIEF' })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.mandate_type === 'CLAIM_BRIEF'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">Claim Allocation Brief</div>
                    <div className="text-[11px] text-slate-400">You represent a buyer seeking to inspect one of our listed deals.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mandate_type: 'PRIVATE_COBROKERAGE' })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.mandate_type === 'PRIVATE_COBROKERAGE'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">Bilateral Co-Brokerage</div>
                    <div className="text-[11px] text-slate-400">Off-market institutional syndication & portfolio exchange.</div>
                  </button>
                </div>

                {/* Agency & Signatory Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Agency / Brokerage Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prestige Haven Realty Ltd"
                      value={formData.agency_name}
                      onChange={e => setFormData({ ...formData, agency_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Lead Broker / Signatory Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barr. Babatunde Alabi"
                      value={formData.contact_person}
                      onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Direct WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567 or +234..."
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Official Corporate Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. info@prestigehaven.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Property & Mandate Details */}
                <div className="border-t border-slate-800 pt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                    Property Brief Specification
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Property Listing Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5-Bed Fully Detached Duplex + Swimming Pool"
                        value={formData.property_title}
                        onChange={e => setFormData({ ...formData, property_title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Location / Neighborhood
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lekki Phase 1, Ikoyi, Banana Island, Victoria Island"
                        value={formData.property_location}
                        onChange={e => setFormData({ ...formData, property_location: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Asking Price / Budget (₦)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₦ 450,000,000"
                        value={formData.asking_price}
                        onChange={e => setFormData({ ...formData, asking_price: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Title Document
                      </label>
                      <select
                        value={formData.title_document}
                        onChange={e => setFormData({ ...formData, title_document: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Governor's Consent">Governor&apos;s Consent</option>
                        <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
                        <option value="Lagos State Gazette">Lagos State Gazette</option>
                        <option value="Deed of Assignment & Survey">Deed of Assignment & Survey</option>
                        <option value="Federal C of O (Ikoyi / VI)">Federal C of O (Ikoyi / VI)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Preferred Inspection Window
                      </label>
                      <select
                        value={formData.inspection_timeframe}
                        onChange={e => setFormData({ ...formData, inspection_timeframe: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Tomorrow (Morning 10:00 AM)">Tomorrow (Morning 10:00 AM)</option>
                        <option value="Tomorrow (Afternoon 02:00 PM)">Tomorrow (Afternoon 02:00 PM)</option>
                        <option value="This Saturday (11:00 AM)">This Saturday (11:00 AM)</option>
                        <option value="Next 48 Hours (On Call)">Next 48 Hours (On Call)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Pad (Sec. 84 Evidence Act 2011) */}
                <div className="border-t border-slate-800 pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-xs font-bold text-white">
                        Authorized Electronic Signature *
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Sign below using your finger, stylus, or mouse. Generates an encrypted Section 84 Evidence Act audit record.
                      </p>
                    </div>
                    {hasSignature && (
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                      >
                        Clear Signature
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl bg-slate-950 overflow-hidden relative transition">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-36 cursor-crosshair touch-none"
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs font-mono">
                        ✍️ Sign Here (Touch or Mouse)
                      </div>
                    )}
                  </div>
                </div>

                {/* Statutory Confirmation Checkbox */}
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>
                      <b>LASRERA Co-Brokerage Enforcement:</b> Both parties covenant to strictly honor the 80/20 agency commission split and refrain from direct client circumvention. All corporate allocations settle via Moniepoint MFB (Bethelmind Digital Solutions - 6805375225).
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl text-sm sm:text-base shadow-xl shadow-cyan-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Hashing & Executing Section 84 Instrument...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>Execute Joint Inspection Memorandum & Lock Inspection Slot</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

        {/* TAB 2: DOWNLOAD BLANK STATUTORY PACK */}
        {activeTab === 'download' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-3xl">
                🖨️
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Download & Physical Chambers Execution
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                For estate surveyor firms, legal practitioners, and corporate partners who require physical documents with company seals or principal partner endorsement.
              </p>

              {/* Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-mono font-bold text-amber-400 mb-1">STEP 1</div>
                  <div className="text-sm font-bold text-white mb-1">Print Document</div>
                  <div className="text-xs text-slate-400">
                    Open our official printable pack formatted for standard A4 paper.
                  </div>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-mono font-bold text-amber-400 mb-1">STEP 2</div>
                  <div className="text-sm font-bold text-white mb-1">Sign & Affix Seal</div>
                  <div className="text-xs text-slate-400">
                    Fill property schedule, sign with ink, and stamp your company seal.
                  </div>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-mono font-bold text-amber-400 mb-1">STEP 3</div>
                  <div className="text-sm font-bold text-white mb-1">WhatsApp to Desk</div>
                  <div className="text-xs text-slate-400">
                    Snap or scan the signed copy and send to +234 802 279 1227 for instant clearance.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/mandate/print"
                  target="_blank"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  <span>📄</span> Open Printable Legal Pack (PDF)
                </Link>
                <a
                  href="https://wa.me/2348022791227?text=Good%20day%20Tosin,%20I%20am%20reviewing%20the%20Bethelmind%20physical%20mandate%20pack%20and%20wish%20to%20send%20our%20stamped%20brief."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <span>💬</span> Contact Principal Partner on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE INVESTOR BRIEFS */}
        {activeTab === 'briefs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Active Verified Buyer Portfolios
                </h2>
                <p className="text-xs text-slate-400">
                  Pre-screened liquid investor syndicates with cleared escrow capacity ready for immediate joint inspection.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                3 Portfolios Available
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {ACTIVE_BRIEFS.map(brief => (
                <div
                  key={brief.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 sm:p-6 transition shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                        {brief.id} · {brief.type}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {brief.title}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <span>📍</span>
                        <span>{brief.location}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400">Allocation Budget</div>
                      <div className="text-lg font-black text-emerald-400">{brief.budget}</div>
                      <div className="text-[11px] font-mono text-slate-400">{brief.commission}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4 leading-relaxed">
                    {brief.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleClaimBrief(brief)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20"
                    >
                      <span>⚡</span> Claim & Sign Mandate
                    </button>
                    <Link
                      href={`/deal/${brief.id}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition"
                    >
                      View Full Teaser &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corporate Settlement Registry Notice */}
        <section className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                Official Settlement & Clearing Registry
              </div>
              <div className="text-base font-bold text-white">
                Bethelmind Digital Solutions
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Moniepoint Microfinance Bank · Account: <span className="font-mono text-emerald-400 font-bold text-sm">6805375225</span> · CAC Reg: 9912717
              </div>
            </div>

            <a
              href="https://wa.me/2348022791227?text=Good%20day%20Tosin,%20I%20am%20inquiring%20about%20the%20Bethelmind%20Co-Brokerage%20Mandate."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-2 whitespace-nowrap transition"
            >
              <span>💬</span> Hotline: +234 802 279 1227
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
