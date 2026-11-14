import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Building2, 
  Landmark, 
  PhoneCall, 
  Lock,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Lawyer & Legal Counsel Brief | Bethelmind Digital Solutions',
  description: 'Official Statutory Legal Retainership, Modus Operandi, and Transaction Due Diligence Brief for Retained Legal Counsel (CAC Certified: Reg 9912717).',
};

export default function LawyerBriefPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      {/* 🏛️ TOP STICKY STATUS BAR */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Scale className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">Bethelmind</span>
                <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Legal Brief
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                CAC Certified: Reg 9912717 • Moniepoint MFB: 6805375225
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/mandate"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Mandate Hub
            </Link>
            <Link
              href="/api/mandate/download-pack"
              target="_blank"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print A4 Pack</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 📜 MAIN DOCUMENT CONTAINER */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Title Header Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONFIDENTIAL STATUTORY INSTRUMENT • SECTION 84 EVIDENCE ACT 2011</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Comprehensive Legal Retainership & Transaction Counsel Brief
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Operational Protocol, Statutory Instruments, Evidence Act 2011 Standards & Commission Protection Framework for Retained Legal Counsel in Lagos State Property Transactions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Principal Entity</span>
              <span className="text-white font-semibold">Bethelmind Digital Solutions</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">CAC Registration</span>
              <span className="text-amber-400 font-semibold">Reg BN: 9912717</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Settlement Bank</span>
              <span className="text-emerald-400 font-semibold">Moniepoint MFB</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Corporate Account</span>
              <span className="text-white font-mono font-semibold">6805375225</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE MANDATE OVERVIEW */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Landmark className="w-4 h-4" />
            <span>1. PURPOSE & OPERATIONAL MODUS OPERANDI</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bethelmind Digital Solutions operates the <strong>Corporate & Diaspora Property Desk</strong>, matching pre-qualified offshore syndicates, institutional buyers, and high-net-worth diaspora executives with verified prime properties (₦400M – ₦3B+) across Ikoyi, Banana Island, Victoria Island, and Lekki Phase 1, Lagos.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To ensure complete institutional integrity, legal compliance, and prevention of fraudulent conveyance, Bethelmind appoints <strong>Retained Transaction Legal Counsel</strong> to conduct independent title investigations, administer the statutory <strong>Joint Inspection Memorandum (JIM)</strong>, enforce LASRERA 80/20 co-brokerage covenants, and supervise closing escrows.
          </p>
        </section>

        {/* SECTION 2: THE 4 CORE SCOPES OF WORK FOR COUNSEL */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <span>2. SCOPE OF PROFESSIONAL RETAINERSHIP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">A</span>
                <span>Title Search & Due Diligence (Alausa)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Conduct formal searches at the Lagos State Lands Bureau (Alausa), Surveyor-General’s Office, and Corporate Affairs Commission (where vendor is corporate). Verify Governor's Consent, C of O, Gazette, survey beacons, and confirm freedom from court injunctions or government acquisition.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">B</span>
                <span>Statutory 80/20 Co-Brokerage Enforcement</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Enforce bilateral co-brokerage agreements under Lagos State Real Estate Regulatory Authority (LASRERA) Law 2021. The lead broker/developer retains 80% of agency commission; Bethelmind retains 20% origination fee.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">C</span>
                <span>Joint Inspection Memorandum (JIM)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Oversee the execution of the electronic JIM prior to buyer walkthrough. This creates an unassailable legal record of introduction under Section 84 of the Evidence Act 2011, barring vendor/broker circumvention.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">D</span>
                <span>Closing Escrow & Conveyancing Deeds</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Draft and vet the Contract of Sale and Deed of Assignment. Supervise purchase consideration transfer via CBN-licensed banks and ensure Bethelmind's 20% origination commission is released directly into Moniepoint MFB (6805375225).
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: COUNSEL REMUNERATION TABLE */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>3. COUNSEL REMUNERATION (20% DIRECT REVENUE SHARE)</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Retained Counsel is entitled to <strong>20% of Bethelmind's Net Origination Commission</strong> on every transaction closed under this desk. Counsel fees are disbursed directly to Counsel within 24 banking hours of settlement. Transacting parties advance and reimburse 100% of official government search fees (Counsel pays ₦0 out of pocket).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 border-b border-slate-800">Sample Property</th>
                  <th className="p-3 border-b border-slate-800">Listing Value</th>
                  <th className="p-3 border-b border-slate-800">5% Agency Pool</th>
                  <th className="p-3 border-b border-slate-800">Bethelmind (20%)</th>
                  <th className="p-3 border-b border-slate-800 text-emerald-400">Counsel Share (20%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">5-Bed Smart Duplex, Lekki 1</td>
                  <td className="p-3">₦ 480,000,000</td>
                  <td className="p-3">₦ 24,000,000</td>
                  <td className="p-3">₦ 4,800,000</td>
                  <td className="p-3 font-bold text-emerald-400">₦ 960,000</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Waterfront Villa, Orange Island</td>
                  <td className="p-3">₦ 750,000,000</td>
                  <td className="p-3">₦ 37,500,000</td>
                  <td className="p-3">₦ 7,500,000</td>
                  <td className="p-3 font-bold text-emerald-400">₦ 1,500,000</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">Ultra-Luxury Mansion, Banana Island</td>
                  <td className="p-3">₦ 1,500,000,000</td>
                  <td className="p-3">₦ 75,000,000</td>
                  <td className="p-3">₦ 15,000,000</td>
                  <td className="p-3 font-bold text-emerald-400">₦ 3,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: EVIDENCE ACT SECTION 84 ADMISSIBILITY */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>4. SECTION 84 EVIDENCE ACT 2011 ADMISSIBILITY</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All digital records, e-signatures, inspection dispatches, and WhatsApp call briefs are automatically cryptographically hashed and logged pursuant to <strong>Section 84 of the Evidence Act 2011</strong>. Every instrument bears:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>SHA-256 Cryptographic Hash:</strong> Validates document integrity and zero post-execution modification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>Server & Client Telemetry:</strong> Verifiable IP address, User-Agent signature, and UTC/WAT execution timestamp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>Statutory Certificate:</strong> Standalone Certificate of Authenticity accompanying every executed legal instrument.</span>
            </li>
          </ul>
        </section>

        {/* SECTION 5: DOWNLOAD & EXECUTION CTA */}
        <section className="bg-gradient-to-r from-amber-600/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Execute Retainership & Access Active Mandate Books
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Legal Chambers wishing to review the full 4-Instrument Statutory Legal Pack, endorse the master retainership agreement, or verify active acquisition briefs may download the printable pack below or contact the Principal Desk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/api/mandate/download-pack"
              target="_blank"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Statutory Legal Pack (PDF)</span>
            </Link>

            <Link
              href="/mandate"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Online E-Sign Portal</span>
            </Link>

            <a
              href="https://wa.me/2348022791227?text=Good%20day%20Tosin,%20I%20am%20reviewing%20the%20Bethelmind%20Legal%20Counsel%20Brief%20and%20Retainership%20Agreement."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat Principal (0802 279 1227)</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
