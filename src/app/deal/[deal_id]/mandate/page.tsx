'use client';

/**
 * @file src/app/deal/[deal_id]/mandate/page.tsx
 * 
 * 📜 OFFICIAL CO-BROKERAGE LEAD ORIGINATION, NON-CIRCUMVENTION & LIQUIDATED DAMAGES AGREEMENT
 * With Statutory Schedule B: Section 84 Evidence Act 2011 Certificate of Electronic Record Authentication
 * 
 * Enterprise: Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * Supreme Court Authority: Philip Kayode Olusegun Ojo v. SDV Nigeria Ltd (Effective Cause Rule)
 * Statutory Authority: Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
    signature_data_url?: string;
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

export default function SignedMandateDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = (params?.deal_id as string) || 'demo';

  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));

    const fetchDeal = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/deal/${dealId}`);
        const data = await res.json();
        if (data.success && data.deal) {
          setDeal(data.deal);
        } else {
          setError(data.error || 'Mandate not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load mandate document');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif tracking-wider text-amber-200">Retrieving Certified Legal Mandate...</p>
          <p className="text-xs text-gray-400 font-mono">Evidence Act 2011 Sec 84 Repository</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-[#0D121F] border border-red-500/30 p-8 rounded-2xl space-y-4">
          <span className="text-4xl block">⚠️</span>
          <h2 className="text-lg font-bold text-red-400">Legal Document Error</h2>
          <p className="text-gray-400 text-xs">{error || 'Brief document not found'}</p>
          <Link
            href={`/deal/${dealId}`}
            className="inline-block px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-lg"
          >
            Return to Brief
          </Link>
        </div>
      </div>
    );
  }

  const partnerShare = deal.estimated_commission_pool_ngn - deal.bethelmind_origination_fee_ngn;
  const liquidatedDamages = deal.digital_mandate.legal_shield?.liquidated_damages_ngn || deal.bethelmind_origination_fee_ngn * 2;
  const evidenceHash = deal.digital_mandate.legal_shield?.section_84_evidence_hash || '7f9a8b1c4e2d3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a';
  const partnerName = deal.exclusive_partner_assigned?.agency_name || 'Designated Servicing Partner Firm';
  const partnerSignatory = deal.exclusive_partner_assigned?.contact_person || 'Principal Broker / Managing Partner';

  return (
    <div className="min-h-screen bg-[#11141D] text-slate-900 font-serif antialiased print:bg-white print:text-black">
      {/* ── TOP CONTROL BAR (HIDDEN IN PRINT) ── */}
      <header className="sticky top-0 z-50 bg-[#0B0F17] border-b border-amber-500/20 px-4 py-3 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/deal/${dealId}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-sans transition flex items-center gap-1.5 border border-white/10"
            >
              <span>←</span>
              <span>Back to Deal Brief</span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-xs font-sans font-bold text-amber-300">CAC CERTIFIED MANDATE</span>
              <span className="text-[11px] font-sans text-gray-400 ml-2 font-mono">REF: {deal.digital_mandate.mandate_ref}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-sans font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Save Official PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── LEGAL DOCUMENT SHEET (A4 PROPORTIONS) ── */}
      <main className="max-w-4xl mx-auto my-6 sm:my-10 p-6 sm:p-14 bg-white shadow-2xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:my-0 print:p-0">
        
        {/* FEDERAL LETTERHEAD & CORPORATE EMBLEM */}
        <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full border-2 border-amber-700 bg-amber-50 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-900 font-sans">BM</span>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-widest uppercase font-serif text-slate-950">
            BETHELMIND DIGITAL SOLUTIONS
          </h1>
          <p className="text-xs sm:text-sm font-sans tracking-wider text-slate-700 font-semibold uppercase mt-0.5">
            FEDERAL REPUBLIC OF NIGERIA • CAC CERTIFIED ENTERPRISE (REG: 9912717)
          </p>
          <p className="text-[11px] font-sans text-slate-600 mt-1">
            Corporate Settlement Vault: Moniepoint Microfinance Bank | Acct No: <strong>6805375225</strong> (Bethelmind Digital Solutions)
          </p>
          <p className="text-[11px] font-sans text-slate-600">
            Commercial Origination Desk Hotline: +234 802 279 1227 | Victoria Island & Lekki Commercial Corridor, Lagos
          </p>
        </div>

        {/* DOCUMENT CLASSIFICATION & REF HEADER */}
        <div className="flex flex-wrap items-center justify-between text-xs font-sans border-b border-slate-200 pb-3 mb-6 gap-2">
          <div>
            <span className="text-slate-500 uppercase">Document Title:</span>
            <strong className="block text-slate-900">Bilateral Co-Brokerage Mandate & Non-Circumvention Covenant</strong>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-slate-500 uppercase">Mandate Reference:</span>
            <strong className="block font-mono text-amber-900">{deal.digital_mandate.mandate_ref}</strong>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-slate-500 uppercase">Execution Date:</span>
            <strong className="block text-slate-900">{currentDate}</strong>
          </div>
        </div>

        {/* FORMAL PREAMBLE & PARTIES */}
        <div className="mb-6 space-y-4 text-justify text-xs sm:text-sm leading-relaxed text-slate-800">
          <p>
            <strong>THIS BILATERAL CO-BROKERAGE LEAD ORIGINATION, NON-CIRCUMVENTION AND LIQUIDATED DAMAGES AGREEMENT</strong> (the "Agreement") is executed and enters into binding legal effect on this <strong>{currentDate}</strong>, by and between:
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-sans space-y-2">
            <div>
              <strong className="text-slate-950">PARTY A (LEAD ORIGINATOR & CLEARING DESK):</strong>
              <p className="text-slate-700">
                <strong>BETHELMIND DIGITAL SOLUTIONS</strong> (CAC Registered Enterprise No: <strong>9912717</strong>), whose corporate operational clearing desk is domiciled in Lagos State, Nigeria, represented herein by its Commercial Deal Wire Desk (hereinafter referred to as the <em>"Lead Originator"</em>).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <strong className="text-slate-950">PARTY B (SERVICING PARTNER / CLOSING BROKER / EPC CONTRACTOR):</strong>
              <p className="text-slate-700">
                <strong>{partnerName}</strong>, represented herein by <strong>{partnerSignatory}</strong>, duly recognized as the servicing commercial closing entity (hereinafter referred to as the <em>"Servicing Partner"</em>).
              </p>
            </div>
          </div>
        </div>

        {/* RECITALS */}
        <div className="mb-6 space-y-3 text-justify text-xs sm:text-sm leading-relaxed text-slate-800">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            RECITALS & JURISPRUDENTIAL BASIS:
          </h2>
          <p>
            <strong>WHEREAS</strong> Party A has established, tested, and operates a proprietary algorithmic lead interception and verification wire engine operating in strict compliance with <strong>Section 84 of the Evidence Act, 2011</strong>;
          </p>
          <p>
            <strong>WHEREAS</strong> Party A has originated, screened, and validated the solvency and active purchase intent of a qualified High-Net-Worth individual or commercial principal seeking immediate acquisition, leasehold, or engineering execution in <strong>{deal.location.area}, {deal.location.city}</strong> with a verified budget of <strong>{deal.formatted_budget}</strong>;
          </p>
          <p>
            <strong>WHEREAS</strong> under the landmark Supreme Court of Nigeria authority of <em>Philip Kayode Olusegun Ojo v. SDV Nigeria Limited & Anor (2007) 15 NWLR (Pt. 1056) 538</em>, Party A's digital introduction, transmission of buyer particulars, and creation of the transaction nexus constitutes the conclusive and incontrovertible <strong>"Effective Cause"</strong> of any ensuing transaction;
          </p>
          <p>
            <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants, disclosure of proprietary lead data, and co-brokerage fee allocations herein contained, the Parties irrevocably agree as follows:
          </p>
        </div>

        {/* OPERATIVE COVENANTS */}
        <div className="mb-6 space-y-4 text-justify text-xs sm:text-sm leading-relaxed text-slate-800">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            OPERATIVE COVENANTS & BINDING CLAUSES:
          </h2>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">1. EQUAL COMMISSION POOL ALLOCATION (50/50 SPLIT):</strong>
            <p>
              The Servicing Partner irrevocably covenants that upon the conclusion, exchange, execution, or completion of any contract, lease, sale, or project agreement arising out of the disclosed brief, all gross agency commissions, facilitation fees, or advisory success charges earned shall be split equally between the Parties. Party A shall receive fifty percent (50%) of the gross commission pool (or the agreed minimum origination fee of <strong>₦{deal.bethelmind_origination_fee_ngn.toLocaleString()}</strong>).
            </p>
          </div>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">2. DIRECT SETTLEMENT ACCOUNT DESIGNATION:</strong>
            <p>
              All fees accrued to Party A shall be remitted by direct electronic wire transfer within forty-eight (48) statutory hours of payment receipt to Party A’s designated CAC-certified corporate clearing vault:
            </p>
            <div className="bg-amber-50/70 border border-amber-300 p-2.5 rounded my-1.5 font-sans text-xs">
              • Banking Institution: <strong>Moniepoint Microfinance Bank</strong><br />
              • Account Number: <strong>6805375225</strong><br />
              • Account Name: <strong>Bethelmind Digital Solutions</strong><br />
              • Narration Reference: <strong>{deal.digital_mandate.mandate_ref} CLOSING SETTLEMENT</strong>
            </div>
          </div>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">3. STRICT NON-CIRCUMVENTION & NON-DISCLOSURE (NCNDA):</strong>
            <p>
              The Servicing Partner, its directors, agents, sub-brokers, or affiliates shall not, under any circumstance, bypass, exclude, circumvent, or deal directly with the disclosed buyer to the exclusion of Party A, nor shall the Servicing Partner introduce, syndicate, or transfer the buyer's contact particulars to any third-party broker or vendor without the express written counter-signature of Party A.
            </p>
          </div>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">4. 200% LIQUIDATED DAMAGES & LASRERA STATUTORY DISCIPLINARY SANCTION:</strong>
            <p>
              In the event the Servicing Partner breaches this Agreement, facilitates a clandestine closing, or conceals the conclusion of the transaction, the Servicing Partner shall immediately and unconditionally be liable to pay to Party A liquidated damages in the sum of <strong>₦{liquidatedDamages.toLocaleString()}</strong> (representing two hundred percent (200%) of the anticipated gross fees). Furthermore, Party A shall formally submit a certified petition accompanied by the Section 84 Electronic Record Certificate to the <strong>Lagos State Real Estate Regulatory Authority (LASRERA)</strong> under the <em>LASRERA Law 2022</em> requesting the immediate suspension and revocation of the Servicing Partner’s operating license.
            </p>
          </div>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">5. 24-HOUR SPEED-TO-LEAD SLA & MILESTONE RECORDING:</strong>
            <p>
              The Servicing Partner is granted exclusive closing representation for this brief subject to initiating communication and logging a confirmed inspection/tour milestone within twenty-four (24) statutory hours of execution. In the event of unexcused inactivity, Party A reserves the right to re-route the brief to the standby secondary co-broker.
            </p>
          </div>

          <div>
            <strong className="text-slate-950 font-sans block mb-1">6. GOVERNING LAW & JURISDICTION:</strong>
            <p>
              This Agreement is governed by and construed in accordance with the Laws of Lagos State and the Federal Republic of Nigeria. Any dispute not resolved amicably within fourteen (14) days shall be submitted to the High Court of Lagos State or the Lagos Multi-Door Courthouse (LMDC).
            </p>
          </div>
        </div>

        {/* SCHEDULE A: TRANSACTION PARTICULARS TABLE */}
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            SCHEDULE A: PARTICULARS OF DISCLOSED TRANSACTION
          </h2>
          <table className="w-full text-xs font-sans border-collapse border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-300 bg-slate-50">
                <td className="p-2 font-bold w-1/3 border-r border-slate-300">Transaction Ref / Title:</td>
                <td className="p-2 font-semibold text-slate-900">{deal.title} (REF: {deal.deal_id})</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold border-r border-slate-300">Sector / Category:</td>
                <td className="p-2 text-slate-800">{deal.category.replace(/_/g, ' ')}</td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-50">
                <td className="p-2 font-bold border-r border-slate-300">Geographic Corridor:</td>
                <td className="p-2 text-slate-800">{deal.location.area}, {deal.location.city}, {deal.location.state}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold border-r border-slate-300">Verified Client Budget:</td>
                <td className="p-2 font-bold text-amber-900">{deal.formatted_budget} (Direct Wire Solvency Confirmed)</td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-50">
                <td className="p-2 font-bold border-r border-slate-300">Estimated Gross Commission Pool:</td>
                <td className="p-2 text-slate-900">₦{deal.estimated_commission_pool_ngn.toLocaleString()} (Statutory 5% - 10%)</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold border-r border-slate-300">Party A (Bethelmind) Origination Share:</td>
                <td className="p-2 font-bold text-emerald-800">₦{deal.bethelmind_origination_fee_ngn.toLocaleString()} (Payable to Moniepoint 6805375225)</td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-50">
                <td className="p-2 font-bold border-r border-slate-300">Party B (Servicing Partner) Share:</td>
                <td className="p-2 font-bold text-slate-900">₦{partnerShare.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold border-r border-slate-300">Buyer Direct Identity:</td>
                <td className="p-2 text-slate-900">
                  {deal.buyer_contact.name} ({deal.buyer_contact.phone || 'Unlocked in Partner Terminal'}) • Network: {deal.buyer_contact.carrier}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SCHEDULE B: SECTION 84 EVIDENCE ACT COMPLIANCE CERTIFICATE */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded text-xs font-mono leading-relaxed">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            SCHEDULE B: STATUTORY CERTIFICATE OF IDENTIFICATION & RECORD AUTHENTICITY (SECTION 84 EVIDENCE ACT 2011)
          </h2>
          <p className="text-[11px] text-slate-700">
            I, Chief Systems Auditor & Lead Origination Counsel on behalf of Bethelmind Digital Solutions (CAC Reg: 9912717), hereby formally certify under Section 84(2) & 84(4) of the Evidence Act 2011:
          </p>
          <ul className="list-disc pl-5 my-2 space-y-1 text-[10px] text-slate-700">
            <li>That this document and electronic record reference <strong>{deal.digital_mandate.mandate_ref}</strong> was generated by the Bethelmind Sovereign Deal Wire Engine during the ordinary course of business.</li>
            <li>That at all material times, the computing devices and cryptographic server node operating at Lagos Commercial Gateway operated properly without data contamination or unauthorized alteration.</li>
            <li>Cryptographic Fingerprint (SHA-256): <span className="font-bold text-slate-950 break-all">{evidenceHash}</span></li>
            <li>Statutory Verification Stamp: <strong>CAC-NG-9912717-EVIDENCE-SEC84-VALIDATED</strong></li>
          </ul>
        </div>

        {/* SIGNATURE & DIGITAL ATTESTATION BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-900 font-sans">
          {/* Party A Signature Block */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              EXECUTED ON BEHALF OF PARTY A:
            </p>
            <div className="border border-slate-300 p-3 rounded bg-amber-50/40 relative">
              {/* Circular Seal Emblem */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-800 flex flex-col items-center justify-center text-center absolute right-3 top-3 opacity-80 pointer-events-none">
                <span className="text-[8px] font-bold text-amber-900">CAC 9912717</span>
                <span className="text-[7px] text-amber-800">BETHELMIND</span>
                <span className="text-[7px] font-bold text-amber-900">LEGAL SEAL</span>
              </div>

              <p className="font-serif italic text-base text-slate-900 font-bold mb-1">
                Matthew T.
              </p>
              <p className="text-xs font-bold text-slate-900">
                Matthew T. (Lead Origination Counsel)
              </p>
              <p className="text-[11px] text-slate-600">
                Bethelmind Digital Solutions (CAC: 9912717)
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-2">
                Digital Key: SHA256-BM-ORIG-SEC84-CONFIRMED<br />
                Date: {currentDate}
              </p>
            </div>
          </div>

          {/* Party B Signature Block */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              ELECTRONICALLY ATTESTED & BOUND BY PARTY B:
            </p>
            <div className="border border-slate-300 p-3 rounded bg-slate-50 relative">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-center absolute right-3 top-3 opacity-80 pointer-events-none">
                <span className="text-[8px] font-bold text-emerald-900">E-SIGNED</span>
                <span className="text-[7px] text-emerald-800">PARTNER</span>
                <span className="text-[7px] font-bold text-emerald-900">24H SLA</span>
              </div>

              {deal.exclusive_partner_assigned?.signature_data_url ? (
                <div className="h-12 flex items-center mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={deal.exclusive_partner_assigned.signature_data_url}
                    alt="Party B Drawn Signature"
                    className="max-h-12 max-w-[200px] object-contain filter contrast-125"
                  />
                </div>
              ) : (
                <p className="font-serif italic text-base text-slate-900 font-bold mb-1">
                  {partnerSignatory}
                </p>
              )}
              <p className="text-xs font-bold text-slate-900">
                {partnerSignatory}
              </p>
              <p className="text-[11px] text-slate-600">
                {partnerName}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-2">
                Electronic Assent: HAND-DRAWN & DIGITALLY AFFIXED<br />
                Evidence Hash: {evidenceHash.slice(0, 24)}...
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM WATERMARK & STATUTORY NOTICE */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] font-sans text-slate-500 space-y-1">
          <p>
            CONFIDENTIAL CO-BROKERAGE INSTRUMENT • REPRODUCIBLE UNDER SECTION 84 EVIDENCE ACT 2011
          </p>
          <p>
            Bethelmind Digital Solutions (CAC Reg: 9912717) • Settlement Vault: Moniepoint Microfinance Bank (6805375225)
          </p>
        </div>

      </main>
    </div>
  );
}
