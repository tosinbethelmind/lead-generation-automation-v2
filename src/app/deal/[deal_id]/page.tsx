'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface DealData {
  deal_id: string;
  category: string;
  source: string;
  title: string;
  description: string;
  location: {
    state: string;
    city: string;
    area: string;
  };
  budget_amount_ngn: number;
  formatted_budget: string;
  estimated_commission_pool_ngn: number;
  bethelmind_origination_fee_ngn: number;
  buyer_concierge_fee_ngn: number;
  qualification_status: string;
  is_claimed: boolean;
  exclusive_partner_assigned?: {
    agency_name: string;
    contact_person: string;
  } | null;
  sla_tracking?: {
    sla_expires_at: string;
    sla_status: string;
    inspection_date?: string;
  } | null;
  buyer_contact: {
    name: string;
    phone: string;
    carrier: string;
    is_carrier_valid: boolean;
  };
  digital_mandate: {
    mandate_ref: string;
    cac_registration: string;
    settlement_bank: string;
    settlement_account: string;
    settlement_account_name: string;
    mandate_text: string;
    legal_shield?: {
      lasrera_clause: string;
      liquidated_damages_ngn: number;
      section_84_evidence_hash: string;
      governing_law: string;
    };
  };
  timestamps: {
    harvested_at: string;
  };
}

export default function DealTeaserPage() {
  const params = useParams();
  const dealId = params?.deal_id as string;

  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Claim form states
  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    unlocked_buyer_contact: { name: string; phone: string; carrier: string };
    wa_chat_url: string;
    mandate_ref: string;
    sla_expires_at?: string;
    liquidated_damages_ngn?: number;
    signature_data_url?: string;
  } | null>(null);

  // Digital Signature Pad States
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = React.useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Milestone logging states
  const [tourDateInput, setTourDateInput] = useState('');
  const [loggingMilestone, setLoggingMilestone] = useState(false);
  const [milestoneSuccess, setMilestoneSuccess] = useState<string | null>(null);

  // 45-minute countdown timer for initial claim
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#F59E0B'; // Amber gold pen stroke
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault(); // Prevent page scrolling during touch signature
    }

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  useEffect(() => {
    if (!dealId) return;

    fetch(`/api/deal/${dealId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.deal) {
          setDeal(data.deal);
          if (data.deal.is_claimed && data.deal.exclusive_partner_assigned) {
            setMilestoneSuccess(data.deal.sla_tracking?.inspection_date || null);
          }
        } else {
          setError(data.error || 'Deal brief not found.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dealId]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !contactPerson || !partnerPhone) {
      alert('Please fill out all fields to sign the mandate.');
      return;
    }

    if (!agreedToTerms) {
      alert('Please confirm that you agree to the 50/50 fee split and legal mandate covenants.');
      return;
    }

    // Capture drawn canvas signature or auto-render cursive script
    let signatureDataUrl = '';
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (!hasDrawn && contactPerson) {
          // Render elegant cursive script signature with their typed name
          ctx.font = 'italic 28px "Brush Script MT", "Caveat", "Segoe Script", cursive';
          ctx.fillStyle = '#F59E0B';
          ctx.fillText(contactPerson, 20, 65);
        }
        signatureDataUrl = canvas.toDataURL('image/png');
      }
    }

    setClaiming(true);
    try {
      const res = await fetch(`/api/deal/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_name: agencyName,
          contact_person: contactPerson,
          phone: partnerPhone,
          signature_data_url: signatureDataUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setClaimResult({
          unlocked_buyer_contact: data.unlocked_buyer_contact,
          wa_chat_url: data.wa_chat_url,
          mandate_ref: data.mandate_ref,
          sla_expires_at: data.sla_expires_at,
          liquidated_damages_ngn: data.liquidated_damages_ngn,
          signature_data_url: signatureDataUrl
        });
      } else {
        alert(data.error || 'Failed to claim brief.');
      }
    } catch (err: any) {
      alert(err.message || 'Network error claiming brief.');
    } finally {
      setClaiming(false);
    }
  };

  const handleLogMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourDateInput.trim()) return;

    setLoggingMilestone(true);
    try {
      const res = await fetch(`/api/deal/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_milestone',
          inspection_notes: tourDateInput.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setMilestoneSuccess(tourDateInput.trim());
        alert('✅ Tour confirmed! Your 24-hour follow-up SLA is fulfilled.');
      } else {
        alert(data.error || 'Failed to log milestone.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating milestone.');
    } finally {
      setLoggingMilestone(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4" />
        <p className="text-amber-200/80 font-mono text-sm tracking-wider uppercase">Loading Private Deal Teaser...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md">
          <span className="text-3xl mb-2 block">⚠️</span>
          <h2 className="text-xl font-bold text-red-400 mb-2">Deal Brief Unavailable</h2>
          <p className="text-gray-400 text-sm">{error || 'This brief may have expired or been fulfilled.'}</p>
        </div>
      </div>
    );
  }

  const partnerShare = deal.estimated_commission_pool_ngn - deal.bethelmind_origination_fee_ngn;
  const liquidatedDamages = deal.digital_mandate.legal_shield?.liquidated_damages_ngn || deal.bethelmind_origination_fee_ngn * 2;

  return (
    <div className="min-h-screen bg-[#07090E] text-white antialiased font-sans selection:bg-amber-400 selection:text-black">
      {/* Sovereign Top Bar */}
      <header className="border-b border-amber-500/20 bg-[#0B0F17]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-black text-xs">
              BM
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-amber-300">BETHELMIND DEAL-WIRE</p>
              <p className="text-[10px] text-gray-400">CAC Certified Enterprise: Reg 9912717</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Inbound Buyer
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Urgency Ribbon */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 border-amber-400 p-4 rounded-r-xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-amber-300 font-bold tracking-wide uppercase">⚡ Exclusive First-Look Window</p>
            <p className="text-xs text-gray-300 mt-0.5">
              Brief is reserved exclusively for your review. If unconfirmed within the window, it routes to the secondary partner.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-amber-400/30 self-start sm:self-auto">
            <span className="text-xs text-gray-400 font-mono">Time Left:</span>
            <span className="text-sm font-black font-mono text-amber-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Hero Deal Card */}
        <div className="bg-[#0D121F] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Deal Category & ID */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black">
              {deal.category.replace(/_/g, ' ')}
            </span>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              REF: {deal.deal_id}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
            {deal.title}
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-6 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
            {deal.description}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
              <p className="text-[11px] text-gray-400 mb-1">Target Location</p>
              <p className="text-sm font-bold text-white">{deal.location.area}</p>
              <p className="text-[10px] text-gray-500">{deal.location.city}, {deal.location.state}</p>
            </div>
            <div className="bg-black/40 border border-amber-500/20 p-3.5 rounded-2xl">
              <p className="text-[11px] text-amber-400 mb-1">Verified Budget</p>
              <p className="text-sm font-extrabold text-amber-300">{deal.formatted_budget}</p>
              <p className="text-[10px] text-emerald-400">Direct Wire Ready</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
              <p className="text-[11px] text-gray-400 mb-1">Est. Commission Pool</p>
              <p className="text-sm font-bold text-white">₦{deal.estimated_commission_pool_ngn.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">Gross 5% - 10% Fee</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl">
              <p className="text-[11px] text-emerald-400 mb-1">Your Partner Share</p>
              <p className="text-sm font-black text-emerald-300">₦{partnerShare.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-500 font-semibold">Your Firm Pockets This</p>
            </div>
          </div>

          {/* 5-Layer Lead Verification Badges */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              🛡️ Quality & Liquidity Safeguards Passed:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Carrier Verified ({deal.buyer_contact.carrier || 'Active Line'})
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Economic Viability Floor (&ge; ₦4M Threshold)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Zero Low-Budget / Student Noise
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Pre-Flight WhatsApp Liquidity Check Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel: Claim Brief or Unlocked Buyer View */}
        {claimResult ? (
          /* UNLOCKED VIEW AFTER CLAIM WITH 24H SLA */
          <div className="bg-gradient-to-b from-emerald-950/40 to-[#0D121F] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-300 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Co-Brokerage Mandate Legally Bound!</h3>
                <p className="text-xs text-emerald-400 font-mono">Mandate Ref: {claimResult.mandate_ref}</p>
              </div>
            </div>

            {/* 24-Hour SLA Follow-Up Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  ⏱️ 24-Hour Speed-to-Follow-up SLA Active
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  You have 24 hours to initiate contact with the buyer and confirm a private tour date to retain exclusive representation.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-black/60 border border-amber-400/30 text-amber-300 self-start sm:self-auto">
                24h Clock Running
              </span>
            </div>

            {/* Buyer Contact Card */}
            <div className="bg-black/60 border border-emerald-500/30 p-5 rounded-2xl">
              <p className="text-xs text-gray-400 mb-1">Direct Buyer Name</p>
              <p className="text-lg font-bold text-white mb-3">{claimResult.unlocked_buyer_contact.name}</p>

              <p className="text-xs text-gray-400 mb-1">Direct Phone / WhatsApp Number</p>
              <p className="text-2xl font-mono font-black text-amber-400 mb-1">
                {claimResult.unlocked_buyer_contact.phone}
              </p>
              <p className="text-xs text-gray-400">
                Network Carrier: <span className="text-emerald-400 font-semibold">{claimResult.unlocked_buyer_contact.carrier}</span>
              </p>
            </div>

            {/* Captured Signature Badge */}
            {claimResult.signature_data_url && (
              <div className="bg-black/50 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>✍️</span> Your Hand-Drawn Signature Affixed
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Permanently embedded into the Section 84 Certificate on Mandate Ref: <span className="font-mono text-amber-300">{claimResult.mandate_ref}</span>
                  </p>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 self-start sm:self-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={claimResult.signature_data_url}
                    alt="Affixed Signature"
                    className="max-h-10 max-w-[140px] object-contain filter contrast-125"
                  />
                </div>
              </div>
            )}

            <a
              href={claimResult.wa_chat_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span className="text-xl">💬</span>
              Open Direct WhatsApp Handshake with Buyer
            </a>

            {/* Fulfill 24h SLA Milestone Box */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Log Confirmed Tour Date (Fulfills Your 24h SLA)
              </h4>
              {milestoneSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 font-semibold">
                  ✅ Tour milestone confirmed: "{milestoneSuccess}". Your exclusive representation is locked.
                </div>
              ) : (
                <form onSubmit={handleLogMilestone} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={tourDateInput}
                    onChange={e => setTourDateInput(e.target.value)}
                    placeholder="e.g., Saturday 11:00 AM private inspection"
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={loggingMilestone}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-300 transition"
                  >
                    {loggingMilestone ? 'Saving...' : 'Confirm Milestone'}
                  </button>
                </form>
              )}
            </div>

            {/* Legal Documents Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
              <span className="text-gray-400">
                ⚖️ Liquidated Damages Clause: <span className="text-amber-400 font-semibold">₦{liquidatedDamages.toLocaleString()}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/deal/${dealId}/mandate`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 text-xs transition"
                >
                  <span>📜</span> View Signed Legal Agreement (PDF)
                </a>
                <a
                  href={`/api/deal/${dealId}?doc=section84`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>📜</span> Sec 84 Cert (.txt)
                </a>
              </div>
            </div>
          </div>
        ) : deal.is_claimed ? (
          /* ALREADY CLAIMED BY ANOTHER PARTNER */
          <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 text-center space-y-4">
            <span className="text-3xl mb-1 block">🔒</span>
            <h3 className="text-lg font-bold text-gray-300 mb-1">Brief Locked by Partner</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              This deal was already claimed exclusively by {deal.exclusive_partner_assigned?.agency_name || 'another licensed partner'} under 24-hour follow-up SLA. If their SLA expires without milestone confirmation, the brief automatically re-opens.
            </p>
            <div className="pt-2">
              <a
                href={`/deal/${dealId}/mandate`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
              >
                <span>📜</span> Inspect Active Signed Legal Mandate & Sec 84 Schedule
              </a>
            </div>
          </div>
        ) : (
          /* CLAIM FORM (FIRST DEAL PERFORMANCE HOOK) */
          <div className="bg-[#0D121F] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Claim Exclusive Representation & Unlock Direct Buyer
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We do not charge upfront marketing retainers for this initial brief. Confirm your firm’s details below to co-sign the digital co-brokerage mandate (50/50 split upon successful closing). You will have 24 hours to log a confirmed tour date.
              </p>
              <div className="mt-2.5">
                <a
                  href={`/deal/${dealId}/mandate`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  <span>📜</span> Review Full Printable Co-Brokerage Mandate & Non-Circumvention Terms (PDF)
                </a>
              </div>
            </div>

            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Registered Agency / EPC Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  placeholder="e.g., Crown Luxury Homes Ltd or GreenPower Solar EPC"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Principal Broker / Lead Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g., Arc. Babatunde Alabi"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Direct WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={partnerPhone}
                    onChange={e => setPartnerPhone(e.target.value)}
                    placeholder="0802 XXX XXXX"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Interactive Hand-Drawn Signature Pad */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-300">
                    ✍️ Draw Your Legal Signature (Finger or Mouse) *
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    ↺ Clear / Redraw
                  </button>
                </div>

                <div className="relative rounded-2xl border border-amber-500/40 bg-black/70 overflow-hidden shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={130}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ touchAction: 'none' }}
                    className="w-full h-[120px] cursor-crosshair"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-gray-500 font-serif italic select-none">
                      Sign here on glass with your finger
                    </div>
                  )}
                  <div className="absolute bottom-2 right-3 pointer-events-none">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                      {hasDrawn ? '✓ Signature Stroke Captured' : 'Evidence Act Sec 84 Pad'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">
                  Your drawn signature will be permanently stamped into the bilateral legal contract & Section 84 certificate.
                </p>
              </div>

              {/* Explicit Legal Affirmation Checkbox */}
              <div className="bg-black/40 border border-amber-500/20 p-3.5 rounded-xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-amber-500 focus:ring-amber-400 h-4 w-4 bg-black"
                  />
                  <span className="text-xs text-gray-300 leading-snug">
                    I, <strong className="text-white">{contactPerson || 'Authorized Broker'}</strong>, hereby affix my electronic signature to the{' '}
                    <span className="text-amber-300 font-semibold">Bethelmind Digital Solutions Co-Brokerage Mandate</span>. I irrevocably agree to the{' '}
                    <strong className="text-emerald-400">50/50 fee split (₦{deal.bethelmind_origination_fee_ngn.toLocaleString()})</strong> payable to{' '}
                    <span className="text-white">Moniepoint MFB (6805375225)</span> upon closing, and agree to the 200% liquidated damages clause (₦{liquidatedDamages.toLocaleString()}) under Nigerian law and LASRERA regulations.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={claiming}
                className="w-full py-4 rounded-2xl font-black text-sm tracking-wide uppercase bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {claiming ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Affixing Signature & Unlocking Buyer...
                  </>
                ) : (
                  <>
                    <span>✍️</span>
                    Affix Signature & Unlock Verified Buyer
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Corporate Trust Footer */}
        <footer className="mt-12 text-center text-[11px] text-gray-500 border-t border-white/5 pt-6 pb-12">
          <p className="font-semibold text-gray-400">
            Bethelmind Digital Solutions · CAC Certified Nigerian Enterprise (Reg: 9912717)
          </p>
          <p className="mt-1">
            Corporate Settlement Vault: Moniepoint Microfinance Bank · 6805375225
          </p>
          <p className="mt-1 text-gray-600">
            LASRERA Compliant Co-Brokerage · Section 84 Evidence Act 2011 Certified.
          </p>
        </footer>
      </main>
    </div>
  );
}
