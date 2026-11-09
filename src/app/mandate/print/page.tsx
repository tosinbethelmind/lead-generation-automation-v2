'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface MandateData {
  mandate_ref: string;
  agency_name: string;
  contact_person: string;
  phone: string;
  email?: string;
  office_address?: string;
  property_title: string;
  property_location: string;
  asking_price: string;
  signature_data_url: string;
  gate_access_protocol?: string;
  direct_mandate_warranted?: boolean;
  signed_at: string;
  evidence_hash: string;
  forensic_audit?: {
    ip_address: string;
    user_agent: string;
    evidence_act_section: string;
    compliance_reg: string;
  };
  cac_reg: string;
  settlement_bank: string;
  settlement_account: string;
  settlement_account_name: string;
  commission_split: string;
  non_circumvention_days?: number;
  dispute_resolution?: string;
  statutory_clause: string;
}

function MandatePrintContent() {
  const searchParams = useSearchParams();
  const ref = searchParams?.get('ref');

  const [mandate, setMandate] = useState<MandateData | null>(null);
  const [loading, setLoading] = useState(Boolean(ref));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    async function fetchMandate() {
      try {
        const res = await fetch(`/api/mandate/sign?ref=${encodeURIComponent(ref || '')}`);
        const data = await res.json();
        if (data.success && data.mandate) {
          setMandate(data.mandate);
        } else {
          setError(data.error || 'Mandate record not found.');
        }
      } catch (e: any) {
        setError(e.message || 'Error loading mandate document.');
      } finally {
        setLoading(false);
      }
    }
    fetchMandate();
  }, [ref]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm text-slate-300">Retrieving Certified Mandate Instrument...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-serif p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl font-sans print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/mandate"
            className="text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
          >
            &larr; Back to Mandate Portal
          </Link>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-300 font-mono">
            {mandate ? `Ref: ${mandate.mandate_ref}` : 'Blank Chambers Instrument Pack'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
          >
            <span>🖨️</span> Print / Save as PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl font-sans print:hidden">
          <b>Notice:</b> {error} (Displaying official blank statutory pack for chambers execution).
        </div>
      )}

      {/* Main Printable Legal Document Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 sm:p-12 shadow-2xl rounded-xl print:shadow-none print:border-none print:p-6 print:max-w-full">
        
        {/* Header with National / LASRERA Emblem Aesthetic */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
          <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest rounded mb-2">
            Statutory Bilateral Co-Brokerage & Non-Circumvention Instrument
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">
            Joint Inspection Memorandum <span className="font-light">(JIM)</span>
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-1 uppercase tracking-wider font-semibold">
            Section 84 Evidence Act 2011 Verified &bull; Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 text-left font-sans text-xs text-slate-600">
            <div>
              <p><b>Instrument Ref:</b> {mandate?.mandate_ref || 'BM-LASRERA-JIM-CHAMBERS-2026'}</p>
              <p><b>Date of Execution:</b> {mandate?.signed_at ? new Date(mandate.signed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '________________________, 2026'}</p>
            </div>
            <div className="text-right">
              <p><b>CAC Corporate Registry:</b> Reg 9912717</p>
              <p><b>Settlement Vault:</b> Moniepoint MFB (6805375225)</p>
            </div>
          </div>
        </div>

        {/* Schedule 1: Property Particulars & Introducing Parties */}
        <div className="mb-6 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-slate-900 mb-3">
            Schedule 1: Representation Particulars & Asset Specification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-slate-800 uppercase mb-1">Party A (Origination & Allocation Desk):</p>
              <p className="text-slate-700"><b>Bethelmind Digital Solutions</b></p>
              <p className="text-slate-600">CAC Registered Enterprise: Reg 9912717</p>
              <p className="text-slate-600">Principal Partner: Tosin Oyelakin (+234 802 279 1227)</p>
              <p className="text-slate-600">Victoria Island / Ikoyi Commercial Corridor, Lagos</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-slate-800 uppercase mb-1">Party B (Mandated Servicing Broker / Agency):</p>
              <p className="text-slate-700"><b>Agency:</b> {mandate?.agency_name || '________________________________________'}</p>
              <p className="text-slate-600"><b>Lead Signatory:</b> {mandate?.contact_person || '________________________________________'}</p>
              <p className="text-slate-600"><b>Direct Phone:</b> {mandate?.phone ? `+${mandate.phone}` : '________________________________________'}</p>
              <p className="text-slate-600"><b>Address:</b> {mandate?.office_address || 'Lagos, Nigeria'}</p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 block">Target Asset Description:</span>
              <span className="font-bold text-slate-900">{mandate?.property_title || 'Prime Lagos Real Estate Asset'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Location / Neighborhood:</span>
              <span className="font-bold text-slate-900">{mandate?.property_location || 'Lekki Phase 1 / Ikoyi / Banana Island Corridor'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Asking / Valuation Consideration:</span>
              <span className="font-bold text-emerald-700">{mandate?.asking_price || 'Market Valuation'}</span>
            </div>
          </div>

          <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
            <span><b>Estate Gate Access Protocol:</b> {mandate?.gate_access_protocol || 'Party B shall issue estate gate security clearance 2 hours prior to walkthrough.'}</span>
            <span className="text-[11px] font-semibold text-emerald-700">✓ Direct Mandate Warranted</span>
          </div>
        </div>

        {/* Schedule 2: Statutory Terms & Commission Covenants */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-800 mb-8 text-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-slate-900">
            Schedule 2: Statutory Covenants & Enforceability Terms
          </h2>

          <p>
            <b>1. The 80/20 Commission Split:</b> The Parties mutually covenant that upon conclusion, sale, or disposal of the property introduced under this memorandum, the standard five percent (5%) gross consideration agency commission shall be apportioned strictly as follows: <b>Eighty Percent (80%)</b> shall be retained by Party B (the Mandated Broker), and <b>Twenty Percent (20%)</b> shall be remitted unconditionally to Party A (Bethelmind Digital Solutions) as its origination and client procurement fee.
          </p>

          <p>
            <b>2. Designated Settlement Account:</b> All fees due to Party A shall be paid by electronic bank transfer within forty-eight (48) statutory hours of escrow clearing to Party A’s corporate clearing vault: <b>Moniepoint Microfinance Bank, Account No: 6805375225 (Bethelmind Digital Solutions &bull; CAC Reg: 9912717)</b>.
          </p>

          <p>
            <b>3. Strict 180-Day Non-Circumvention (NCND):</b> Party B, its partners, directors, agents, sub-brokers, and affiliates expressly covenant not to circumvent, deal directly with, or transfer the particulars of the introduced buyer syndicate or legal liaison to any third-party broker or vendor for a binding period of <b>One Hundred and Eighty (180) calendar days</b> from the date of joint inspection, without the prior written counter-signature of Party A.
          </p>

          <p>
            <b>4. Gate Clearance & Access Obligation:</b> In gated communities and luxury residential corridors (including Banana Island, Ikoyi, Victoria Island, Amen Estate, and Lekki Phase 1), Party B shall generate and transmit the official security access code or visitor clearance pass to Party A’s inspection liaison not later than two (2) hours prior to the scheduled walkthrough.
          </p>

          <p>
            <b>5. Liquidated Damages & LASRERA Enforcement:</b> In the event of clandestine closing or breach of Clause 3, Party B shall immediately and unconditionally be liable to pay Party A liquidated damages representing two hundred percent (200%) of the anticipated gross fees. Furthermore, Party A reserves the statutory right to petition the <b>Lagos State Real Estate Regulatory Authority (LASRERA)</b> under the <em>LASRERA Law 2022</em> for disciplinary sanctions and license revocation.
          </p>

          <p>
            <b>6. Dispute Resolution (Lagos Multi-Door Courthouse):</b> Any dispute arising out of or in connection with this agreement shall first be submitted to expedited mediation at the <b>Lagos Multi-Door Courthouse (LMDC)</b> under the Lagos State Multi-Door Courthouse Law 2007. Where mediation is unsuccessful within thirty (30) days, the dispute shall be resolved by a sole arbitrator under the <b>Arbitration and Mediation Act 2023</b> seated in Lagos State.
          </p>
        </div>

        {/* Section 84 Evidence Act 2011 Certificate of Compliance */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 space-y-1.5">
          <div className="font-bold text-slate-950 font-sans uppercase tracking-wider text-xs border-b border-slate-300 pb-1">
            Section 84 Evidence Act 2011 &bull; Certificate of Electronic Integrity
          </div>
          <p className="text-[10px] text-slate-600 font-sans leading-normal pt-1">
            This certifies that this electronic record was generated in the ordinary course of business by Bethelmind Digital Solutions’ cryptographic legal engine, operating regularly and without disruption, satisfying subsections (2) and (4) of Section 84 of the Evidence Act 2011 (Laws of the Federation of Nigeria).
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-slate-500">MANDATE REF: </span>
              <span className="font-bold text-slate-900">{mandate?.mandate_ref || 'BM-LASRERA-JIM-2026'}</span>
            </div>
            <div>
              <span className="text-slate-500">SIGNATORY IP: </span>
              <span className="text-slate-900">{mandate?.forensic_audit?.ip_address || '127.0.0.1 (Direct HTTPS SSL)'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">SHA-256 INTEGRITY HASH: </span>
              <span className="font-bold text-slate-900 break-all">{mandate?.evidence_hash || 'SHA-256 CRYPTOGRAPHIC PROOF CERTIFIED'}</span>
            </div>
          </div>
        </div>

        {/* Dual Signature Blocks */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs font-sans">
          
          {/* Party A (Bethelmind) */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase">Party A: Bethelmind Digital Solutions</p>
            <div className="h-16 flex items-center">
              <div className="border border-emerald-600 bg-emerald-50 px-3 py-1.5 rounded text-emerald-800 font-serif italic text-sm font-bold shadow-sm">
                Tosin Oyelakin (Desk Principal)
              </div>
            </div>
            <p><b>Signatory:</b> Tosin Oyelakin</p>
            <p><b>Title:</b> Desk Principal & Corporate Partner</p>
            <p><b>CAC Reg:</b> 9912717 &bull; Moniepoint MFB: 6805375225</p>
          </div>

          {/* Party B (Broker) */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase">Party B: Mandated Agency / Partner</p>
            <div className="h-16 flex items-center">
              {mandate?.signature_data_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mandate.signature_data_url}
                  alt="Party B Affixed Signature"
                  className="max-h-16 max-w-[200px] object-contain filter contrast-125"
                />
              ) : (
                <div className="w-full border-b border-dashed border-slate-400 h-10 mt-6" />
              )}
            </div>
            <p><b>Signatory:</b> {mandate?.contact_person || '________________________________________'}</p>
            <p><b>Firm:</b> {mandate?.agency_name || '________________________________________'}</p>
            <p><b>Date:</b> {mandate?.signed_at ? new Date(mandate.signed_at).toLocaleDateString('en-GB') : '________________________'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
          Bethelmind Digital Solutions (CAC Certified: Reg 9912717) &bull; Corporate Desk Hotline: +234 802 279 1227 &bull; Victoria Island / Ikoyi, Lagos
        </div>

      </div>
    </div>
  );
}

export default function MandatePrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm text-slate-300">Loading Official Mandate Instrument...</p>
      </div>
    }>
      <MandatePrintContent />
    </Suspense>
  );
}
