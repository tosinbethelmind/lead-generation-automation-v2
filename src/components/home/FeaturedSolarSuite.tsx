'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import SolarBoqCalculator from '@/components/solar/SolarBoqCalculator';

export default function FeaturedSolarSuite() {
  return (
    <section
      id="solar-suite"
      aria-labelledby="solar-suite-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 scroll-mt-24"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3.5">
        <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
          Featured Commercial Engineering Engine
        </span>
        <h2
          id="solar-suite-heading"
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight"
        >
          SolarQuotePro &bull; <span className="italic font-light text-[#d4af37]">Load & BOQ Sizer</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
          Engineered for Nigerian solar EPC integrators and renewable contractors. Automatically dimensions inverters, LiFePO4 batteries, and generates instant WhatsApp proposals.
        </p>
      </div>

      {/* Embedded Working Solar Calculator Component */}
      <div className="rounded-3xl bg-[#0a0d14] border border-[#d4af37]/25 p-4 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <SolarBoqCalculator businessName="Your Business" isEmbedded={true} />
      </div>

      <div className="text-center">
        <Link
          href="/tools/solar-boq"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#d4af37] hover:underline transition-colors"
        >
          <span>Open Fullscreen Dedicated Solar Calculator Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
