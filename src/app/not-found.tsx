'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Home, Calculator, CreditCard, MessageCircle } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24">
        <div className="max-w-xl w-full text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <span>Error 404 &bull; Resource Relocated</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-['Outfit'] tracking-tight">
            Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
            The page, calculator, or business preview you requested may have moved or been updated to our 2026 production architecture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs font-bold">
            <Link
              href="/home"
              className="p-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/tools"
              className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Explore 13 Sector Tools</span>
            </Link>

            <Link
              href="/pricing"
              className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>View Pricing Packages</span>
            </Link>

            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Support%20Desk%2C%20I%20hit%20a%20404%20error%20on%20your%20website%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
