'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Search, ArrowRight, Lock, CheckCircle2, AlertTriangle, PhoneCall } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function GmbScannerIndexPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setIsScanning(true);
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setTimeout(() => {
      router.push(`/gmb/${slug}?name=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location)}&rating=4.8&reviews=42`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-4 h-4" />
            Google Business Profile Vulnerability Scanner
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Is Your Google Maps Profile <span className="text-rose-400">Exposed to Competitor Hijacks?</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            Over 68% of commercial business listings in Lagos have unverified primary ownership—leaving their phone numbers and 5-star reviews vulnerable to unauthorized public edits.
          </p>
        </div>

        {/* Interactive Search / Audit Generator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your Registered Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Macmed Integrated, Supreme Auto Parts, Lagos Dental"
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Commercial Location / Corridor in Lagos
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lekki Phase 1, ASPAMDA Trade Fair, Ikeja GRA, Victoria Island"
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <span>Generating Security Teardown...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Run Live GMB Vulnerability Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3 Core Protections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 font-black">
              1
            </div>
            <h3 className="font-bold text-white text-base mb-2">Instant Ownership Authentication</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bypasses the 3-month NIPOST postcard delay using instant carrier SMS OTP verification rails.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-black">
              2
            </div>
            <h3 className="font-bold text-white text-base mb-2">1-Tap WhatsApp Button</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Embeds your direct WhatsApp line as the primary contact action on Google Maps for instant inbound leads.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-black">
              3
            </div>
            <h3 className="font-bold text-white text-base mb-2">Anti-Hijack Edit Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locks your profile so unauthorized third parties cannot alter your phone number or mark your shop closed.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
