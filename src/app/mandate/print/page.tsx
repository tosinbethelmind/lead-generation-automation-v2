'use client';

import React, { useEffect, useState } from 'react';
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
  signed_at: string;
  evidence_hash: string;
  cac_reg: string;
  settlement_bank: string;
  settlement_account: string;
  settlement_account_name: string;
  commission_split: string;
  statutory_clause: string;
}

export default function MandatePrintPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

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
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm text-slate-300">Loading Official Mandate Instrument...</p>
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
            className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
          >
            &larr; Back to Mandate Portal
          </Link>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-300">
            {mandate ? `Ref: ${mandate.mandate_ref}` : 'Official Legal Instrument Pack'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
          >
            <span>🖨️</span> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Printable Legal Document Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 sm:p-12 shadow-2xl rounded-xl print:shadow-none print:border-none print:p-6 print:max-w-full">
        
        {/* Header with National / LASRERA Emblem Aesthetic */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
          <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest rounded mb-2">
            Statutory Bilateral Co-Brokerage Instrument
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">
            Joint Inspection Memorandum (JIM)
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-1 uppercase tracking-wider font-semibold">
            Governed by Section 84 Evidence Act 2011 &bull; Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 text-left font-sans text-xs text-slate-600">
            <div>
              <p><b>Instrument Ref:</b> {mandate?.mandate_ref || 'BM-LASRERA-JIM-MASTER'}</p>
              <p><b>Date of Execution:</b> {mandate?.signed_at ? new Date(mandate.signed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '________________________, 2026'}</p>
            </div>
            <div className="text-right">
              <p><b>CAC Corporate Registry:</b> Reg 9912717</p>
              <p><b>Settlement Vault:</b> Moniepoint MFB (6805375225)</p>
            </div>
          </div>
        </div>

        {/* Property Particulars Schedule */}
        <div className="mb-6 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-slate-900 mb-3">
            Schedule 1: Property Particulars & Introducing Parties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-slate-800">Party A (Origination & Allocation Desk):</p>
              <p className="text-slate-600">Bethelmind Digital Solutions (CAC Reg: 9912717)</p>
              <p className="text-slate-600">Principal Partner: Tosin Oyelakin (+234 802 279 1227)</p>
              <p className="text-slate-600">Victoria Island / Ikoyi Commercial Corridor, Lagos</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-slate-800">Party B (Mandated Servicing Broker / Agency):</p>
              <p className="text-slate-600"><b>Agency:</b> {mandate?.agency_name || '________________________________________'}</p>
              <p className="text-slate-600"><b>Lead Signatory:</b> {mandate?.contact_person || '________________________________________'}</p>
              <p className="text-slate-600"><b>Direct Phone:</b> {mandate?.phone ? `+${mandate.phone}` : '________________________________________'}</p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <p><b>Target Asset Description:</b> {mandate?.property_title || 'Prime Lagos Real Estate Asset'}</p>
            <p><b>Location / Corridor:</b> {mandate?.property_location || 'Lekki Phase 1 / Ikoyi / Victoria Island, Lagos'}</p>
            <p><b>Asking / Valuation Price:</b> {mandate?.asking_price || 'Market Valuation'}</p>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-800 mb-8 text-justify">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-slate-900">
            Schedule 2: Statutory Terms & Commission Covenants
          </h2>

          <p>
            <b>1. The 80/20 Commission Split:</b> The Parties mutually covenant that upon conclusion, sale, or disposal of the property introduced under this memorandum, the standard five percent (5%) agency commission shall be apportioned strictly as follows: <b>Eighty Percent (80%)</b> shall be retained by Party B (the Mandated Broker), and <b>Twenty Percent (20%)</b> shall be remitted unconditionally to Party A (Bethelmind Digital Solutions) as its origination and client procurement fee.
          </p>

          <p>
            <b>2. Designated Settlement Account:</b> All fees due to Party A shall be paid by electronic wire transfer within forty-eight (48) statutory hours of escrow clearing to Party A’s corporate clearing vault: <b>Moniepoint Microfinance Bank, Account No: 6805375225 (Bethelmind Digital Solutions)</b>.
          </p>

          <p>
            <b>3. Strict Non-Circumvention (NCND):</b> Party B, its partners, directors, agents, sub-brokers, and affiliates expressly agree not to circumvent, deal directly with, or transfer the particulars of the introduced buyer syndicate or legal liaison to any third-party broker or vendor without the prior written counter-signature of Party A.
          </p>

          <p>
            <b>4. Liquidated Damages & LASRERA Enforcement:</b> In the event of clandestine closing or breach of Clause 3, Party B shall immediately and unconditionally be liable to pay Party A liquidated damages representing two hundred percent (200%) of the anticipated gross fees. Furthermore, Party A reserves the statutory right to petition the <b>Lagos State Real Estate Regulatory Authority (LASRERA)</b> under the <em>LASRERA Law 2022</em> for disciplinary sanctions and license revocation.
          </p>

          <p>
            <b>5. Section 84 Evidence Act 2011 Electronic Admissibility:</b> The Parties affirm that this digital execution, hand-drawn digital assent, and associated cryptographic timestamp satisfy the full evidentiary requirements of Section 84 of the Evidence Act 2011 for judicial admission before the High Court of Lagos State or the Lagos Multi-Door Courthouse (LMDC).
          </p>
        </div>

        {/* Cryptographic Hash Bar */}
        {mandate?.evidence_hash && (
          <div className="mb-8 p-3 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
            <p><b>SEC 84 ELECTRONIC RECORD EVIDENCE HASH:</b></p>
            <p className="break-all text-slate-900 font-bold">{mandate.evidence_hash}</p>
          </div>
        )}

        {/* Dual Signature Blocks */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs font-sans">
          
          {/* Party A (Bethelmind) */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase">Party A: Bethelmind Digital Solutions</p>
            <div className="h-16 flex items-center">
              <div className="border border-emerald-600 bg-emerald-50 px-3 py-1 rounded text-emerald-800 font-serif italic text-sm font-bold">
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
            <p><b>Date:</b> {mandate?.signed_at ? new Date(mandate.signed_at).toLocaleDateString() : '________________________'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
          Bethelmind Digital Solutions (CAC Certified: Reg 9912717) &bull; Corporate Desk Hotline: +234 802 279 1227 &bull; Victoria Island, Lagos
        </div>

      </div>
    </div>
  );
}
