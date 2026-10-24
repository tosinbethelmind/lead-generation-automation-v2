'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const SECTORS_SERVED = [
  'Solar & Renewable Energy',
  'Automotive & Dealerships',
  'Luxury Salons & MedSpas',
  'Real Estate & Land Banking',
  'Interstate Logistics & Haulage',
  'Private Schools & Academies',
  'Healthcare & Medical Clinics',
  'Commercial Boutiques & Retail'
];

const METRIC_INDICATORS = [
  { value: '< 3s', label: 'Response Latency', desc: 'Instant WhatsApp quotation & voice note' },
  { value: '100%', label: 'Settlement Verification', desc: 'Direct Moniepoint NIP webhook confirmation' },
  { value: '48h', label: 'Prototype Delivery SLA', desc: 'Fully functional mobile build on your phone' },
  { value: 'Zero', label: 'Customer Leakage', desc: 'Every inbound inquiry qualified & logged' },
];

export default function SocialProofSection() {
  return (
    <section 
      aria-label="Trust and Credibility"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-y border-white/[0.06]"
    >
      <div className="space-y-10 sm:space-y-12">
        
        {/* Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {METRIC_INDICATORS.map((m, i) => (
            <div 
              key={i} 
              className="text-center sm:text-left space-y-1.5"
            >
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#f5f3ef] tracking-tight block">
                <span className="text-[#d4af37]">{m.value}</span>
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#f5f3ef]">{m.label}</p>
              <p className="text-xs text-[#8e887e] font-light leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Sectors Served Quiet Strip */}
        <div className="pt-6 border-t border-white/[0.04] space-y-4 text-center">
          <p className="text-[11px] font-medium text-[#8e887e] uppercase tracking-widest">
            ENGINEERED FOR NIGERIAN COMMERCIAL ENTERPRISES ACROSS HIGH-VALUE SECTORS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {SECTORS_SERVED.map((sector, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs font-light text-[#c9c4bc] flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                <span>{sector}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
