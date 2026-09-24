'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe2, Search, ArrowRight, ShieldCheck, ExternalLink, PhoneCall } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const SAMPLE_DOMAINS = [
  { domain: 'lagos-solar-solutions.com.ng', sector: 'Solar Engineering', traffic: '2,850/mo', valuation: '₦350,000 NGN', status: 'IN_CUSTODY' },
  { domain: 'vi-commercial-logistics.com.ng', sector: 'Freight & Haulage', traffic: '1,650/mo', valuation: '₦220,000 NGN', status: 'IN_CUSTODY' },
  { domain: 'lekki-dental-specialists.com.ng', sector: 'Healthcare & Dental', traffic: '1,420/mo', valuation: '₦180,000 NGN', status: 'IN_CUSTODY' },
];

export default function DomainsIndexPage() {
  const router = useRouter();
  const [searchDomain, setSearchDomain] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain.trim()) return;
    const clean = searchDomain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .trim();
    router.push(`/domains/${clean}`);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe2 className="w-4 h-4" />
            Sovereign Escrow Domain Registry & Custody
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Expired Nigerian Domain <span className="text-cyan-400">Reinstatement & Custody</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            We preserve high-authority expired `.com.ng` business domains in secure sovereign custody—retaining their organic Google search traffic and providing 1-click ownership reinstatement.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Enter Expired Domain to Verify Custody & Reinstatement
              </label>
              <input
                type="text"
                required
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                placeholder="e.g. yourbusinessname.com.ng"
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Check Sovereign Escrow Custody</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Active Domains In Custody */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-12">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Sample High-Authority Commercial Assets In Custody
          </h2>
          <div className="divide-y divide-slate-800">
            {SAMPLE_DOMAINS.map((item, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-extrabold text-white text-base">{item.domain}</div>
                  <div className="text-xs text-slate-400">Sector: {item.sector} • Monthly Organic Google Visitors: {item.traffic}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-cyan-400">{item.valuation}</span>
                  <Link
                    href={`/domains/${item.domain}`}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    View Custody Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reinstatement Guarantee */}
        <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <strong className="text-white block mb-1">Previous Domain Owner?</strong>
            Verify your previous ownership to claim your EPP Auth Code for instant registrar transfer.
          </div>
          <a
            href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Domain%20Desk%2C%20I%20want%20to%20verify%20and%20reclaim%20our%20domain."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex-shrink-0"
          >
            💬 Contact Custody Desk (0802 279 1227)
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
