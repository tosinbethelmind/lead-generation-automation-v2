import React from 'react';
import Link from 'next/link';

/**
 * @file src/app/domains/[domain]/page.tsx
 * 
 * High-Converting Passive Parking & Domain Inquiry Portal.
 * 
 * When an owner realizes their domain/email is offline and types their old URL in the browser,
 * they land on this institutional escrow & buyout page without you sending them a cold message.
 */

interface DomainInquiryPageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainInquiryPage({ params }: DomainInquiryPageProps) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  const adminWaPhone = '2348022791227';
  const prefilledWaMessage = encodeURIComponent(
    `Hello Bethelmind Domain Registry Team. I am the previous management/owner of ${decodedDomain}. I noticed our domain expired and would like to verify ownership and process the direct reinstatement transfer.`
  );
  const waUrl = `https://wa.me/${adminWaPhone}?text=${prefilledWaMessage}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Banner */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm">
              B
            </div>
            <span className="font-bold text-slate-200 tracking-tight text-sm uppercase">
              Bethelmind Sovereign Domain Registry
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Asset Secured & Verified
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
          🔒 Official Asset Custody Notice
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl leading-tight">
          <span className="text-cyan-400 font-mono">{decodedDomain}</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
          This digital commercial domain was registered and secured into sovereign escrow custody following its expiration. 
          It is currently held for direct ownership transfer, corporate reinstatement, or institutional portfolio buyout.
        </p>

        {/* Action Card */}
        <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10 text-left">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Are you the business owner or interested acquirer?
          </h2>

          <ul className="space-y-3 text-sm text-slate-300 mb-6">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Instant Ownership Reinstatement:</strong> Fast-track transfer Authorization Code (EPP/Auth-Info) delivered in under 2 hours.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Email & DNS Protection:</strong> Retain all historic Google search rankings and business corporate email deliverability.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Secure Escrow Protocol:</strong> Direct verified transfer via Bethelmind Analytics Admin Desk.</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 text-center transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Inquire & Reclaim Domain (WhatsApp)</span>
            </a>
            <a
              href={`mailto:bethelmindrecruit@gmail.com?subject=Domain Reinstatement Request: ${decodedDomain}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-700 text-center transition-all"
            >
              Email Desk
            </a>
          </div>
        </div>

        {/* Alternative Route */}
        <div className="text-xs text-slate-500 max-w-lg">
          Looking for custom website prototype engineering or automated AI growth engines?{' '}
          <Link href="/" className="text-cyan-400 hover:underline">
            Explore Bethelmind Analytics
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-6 text-center text-xs text-slate-500">
        <p className="mb-1">
          Bethelmind Analytics Sovereign Domain Escrow • Lagos B2B Commercial Engine
        </p>
        <p>Executive Closer Desk: +234 802 279 1227 • bethelmindrecruit@gmail.com</p>
      </footer>
    </div>
  );
}
