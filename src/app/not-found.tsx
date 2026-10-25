'use client';

/**
 * @file src/app/not-found.tsx
 * Custom 404 handler with obsidian & champagne gold luxury visual system,
 * direct links back to core pages, and instant WhatsApp concierge support.
 */

import React from 'react';
import Link from 'next/link';
import { Home, Calculator, CreditCard, MessageCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] text-[#c9c4bc] font-sans flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28">
        <div className="max-w-xl w-full text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>404 &bull; Resource Relocated</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight">
            Page Relocated or Unavailable
          </h1>

          <p className="text-xs sm:text-sm text-[#8e887e] font-light leading-relaxed max-w-md mx-auto">
            The page, calculator, or business prototype you requested has moved or been updated to our 2026 production architecture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs font-medium">
            <Link
              href="/home"
              className="p-3.5 rounded-xl bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/tools"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#f5f3ef] border border-white/[0.08] flex items-center justify-center gap-2 transition-all"
            >
              <Calculator className="w-4 h-4 text-[#d4af37]" />
              <span>Explore 13 Sector Tools</span>
            </Link>

            <Link
              href="/pricing"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#f5f3ef] border border-white/[0.08] flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-[#10b981]" />
              <span>View Pricing Packages</span>
            </Link>

            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Support%20Desk%2C%20I%20hit%20a%20404%20error%20on%20your%20website%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}