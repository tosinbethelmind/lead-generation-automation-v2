'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const PREVIEW_CASES = [
  {
    client: 'PowerMax Renewable Solutions',
    industry: 'Solar EPC & Inverter Integrator',
    location: 'Ikeja, Lagos',
    challenge: 'Band A tariff surge led to 70+ daily WhatsApp queries. Engineers spent 5 hours on manual quotes; 60% of prospective clients left.',
    solution: 'Automated Solar BOQ sizer generated 5kVA–15kVA quotes with LiFePO4 batteries on WhatsApp in < 3s.',
    outcome: '14 closed deals in first 30 days &bull; ₦18.4M in new installations &bull; 0% lost leads.',
    author: 'Engr. Babatunde Alabi, Managing Director'
  },
  {
    client: 'Velvet Touch Luxury Salon & Spa',
    industry: 'Beauty & Wellness Clinic',
    location: 'Lekki Phase 1, Lagos',
    challenge: 'Suffered 8 to 12 weekend appointment no-shows and fraudulent bank transfer screenshots weekly.',
    solution: '24/7 WhatsApp scheduler locking stylist slots with 25% Moniepoint automated transfer deposit.',
    outcome: '0% no-show rate &bull; 100% fake alert elimination &bull; ₦1.4M recovered monthly revenue.',
    author: 'Mrs. Chidinma Okafor, Founder'
  },
  {
    client: 'Interstate Haulage & Waybill Hub',
    industry: 'Logistics & Commercial Freight',
    location: 'Alaba International, Lagos',
    challenge: 'Dispatchers spent 4 hours every morning answering merchant "where is my waybill" calls; driver diesel theft was unchecked.',
    solution: 'Automated WhatsApp parcel tracking links and standard interstate diesel mileage audits.',
    outcome: '85% call reduction &bull; ₦420,000/mo diesel savings recovered &bull; sub-30s waybill processing.',
    author: 'Chief Emeka Nnamdi, Director of Operations'
  }
];

export default function ResultsPreviewSection() {
  return (
    <section 
      aria-labelledby="results-preview-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3.5">
        <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
          Client Results & Outcomes
        </span>
        <h2 
          id="results-preview-heading"
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight"
        >
          Proven execution across <br className="hidden sm:inline" />
          <span className="italic font-light text-[#d4af37]">commercial corridors.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
          Verifiable outcomes from commercial enterprises in Ikeja, Lekki, and Alaba operating with Bethelmind automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREVIEW_CASES.map((item, idx) => (
          <div 
            key={idx}
            className="p-7 rounded-2xl bg-[#0a0d14] border border-white/[0.06] hover:border-[#d4af37]/30 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8e887e] font-semibold block">
                  {item.industry} &bull; {item.location}
                </span>
                <h3 className="font-serif text-lg font-normal text-[#f5f3ef] mt-1">
                  {item.client}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#c9c4bc] font-light leading-relaxed">
                <p>
                  <strong className="text-[#8e887e] block font-semibold text-[10px] uppercase tracking-wider">The Challenge:</strong>
                  {item.challenge}
                </p>
                <p>
                  <strong className="text-[#d4af37] block font-semibold text-[10px] uppercase tracking-wider">The Solution:</strong>
                  {item.solution}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1017] border border-white/[0.04] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8e887e] font-semibold block">
                  Measured Outcome:
                </span>
                <p className="text-xs font-mono font-medium text-[#d4af37]">
                  {item.outcome}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#8e887e]">
              <span className="font-light">{item.author}</span>
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#d4af37] hover:underline transition-colors"
        >
          <span>Read Comprehensive Case Study Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
