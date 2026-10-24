'use client';

import React from 'react';
import { Clock, ShieldAlert, FileSpreadsheet, Globe, Zap, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function ProblemSolutionSection() {
  return (
    <section 
      aria-labelledby="problem-solution-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3.5">
        <span className="text-[11px] font-medium text-[#c5a880] uppercase tracking-widest block">
          Response Architecture
        </span>
        <h2 
          id="problem-solution-heading"
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight"
        >
          High-value enquiries demand <br className="hidden sm:inline" />
          <span className="italic font-light text-[#d4af37]">immediate, intelligent response.</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#c9c4bc] font-light leading-relaxed">
          In Nigeria’s commercial corridors, the vendor who quotes with clarity first secures the commitment. Traditional manual bottlenecks silently drain revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* The Problem: Traditional Sales Friction */}
        <div className="p-7 sm:p-9 rounded-2xl bg-[#0a0d14] border border-white/[0.06] space-y-6">
          <div className="space-y-1 border-b border-white/[0.06] pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#8e887e] font-semibold">
              The Reality of Manual Operations
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#f5f3ef]">
              Traditional Communication Bottlenecks
            </h3>
          </div>

          <ul className="space-y-5 text-xs sm:text-sm text-[#c9c4bc] font-light">
            <li className="flex items-start gap-3.5">
              <Clock className="w-4 h-4 text-[#8e887e] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Unattended Evening Enquiries</strong>
                Clients inquire during commutes or after hours. By the next morning, the buyer has already engaged and committed elsewhere.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <ShieldAlert className="w-4 h-4 text-[#8e887e] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Fraudulent Payment Screenshots</strong>
                Manual verification of payment slips creates friction, delays fulfillment, and leaves your staff exposed to unverified transfer alerts.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <FileSpreadsheet className="w-4 h-4 text-[#8e887e] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Manual Quoting & BOQ Fatigue</strong>
                Engineers, brokers, and sales teams waste valuable hours assembling routine cost estimates and calculating duties on spreadsheets.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <Globe className="w-4 h-4 text-[#8e887e] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Directory Dependency</strong>
                Lacking an official digital storefront, prospective high-ticket clients find third-party listings surrounded by competitor advertisements.
              </div>
            </li>
          </ul>
        </div>

        {/* The Solution: Bethelmind Bespoke Architecture */}
        <div className="p-7 sm:p-9 rounded-2xl bg-[#0c1017] border border-[#d4af37]/25 space-y-6 relative overflow-hidden shadow-2xl shadow-black/60">
          <div className="space-y-1 border-b border-white/[0.06] pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              The Bethelmind Standard
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#f5f3ef]">
              Bespoke Automated Growth Engine
            </h3>
          </div>

          <ul className="space-y-5 text-xs sm:text-sm text-[#c9c4bc] font-light">
            <li className="flex items-start gap-3.5">
              <Zap className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Sub-3 Second Natural Conversation</strong>
                Answers customer queries 24/7 with authentic Nigerian voice notes and accurate price lists in under 3 seconds.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Cryptographic Bank Verification</strong>
                Orders and appointment deposits are locked exclusively upon confirmed Moniepoint NIP webhooks. Zero fake alert risk.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <FileText className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Instant PDF Quotations & Invoices</strong>
                Interactive sector engines calculate BOQ sizing, customs clearance, or fee structures, producing branded client PDFs instantly.
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f5f3ef] font-medium block">Bespoke Digital Storefront</strong>
                A lightning-fast, mobile-first brand home (.com or .com.ng) that commands authority on Google Search and builds institutional trust.
              </div>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}
