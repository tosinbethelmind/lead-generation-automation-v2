'use client';

/**
 * @file src/components/home/TrustSection.tsx
 * Transparent trust and operational standards section.
 * Grounded in real deployment guarantees, CAC certification, and local support.
 */

import React from 'react';
import { UserCheck, Settings, Users, CalendarClock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WHAT_TO_EXPECT = [
  {
    icon: UserCheck,
    title: 'Guided Onboarding & Workflow Architecture',
    desc: 'We map your exact commercial workflow, configure automated pricing rules, and thoroughly review every touchpoint with your team prior to activation.',
  },
  {
    icon: Settings,
    title: 'Bespoke Integration for Your Sector',
    desc: 'Tailored for solar contractors, real estate brokers, logistics providers, and merchants. Never forced into an off-the-shelf, generic template.',
  },
  {
    icon: Users,
    title: 'Seamless Human Handoff Controls',
    desc: 'Your sales team maintains final discretion. AI qualifies prospects and calculates accurate BOQs; your executives close the relationship.',
  },
  {
    icon: CalendarClock,
    title: 'Transparent Milestone-Based Terms',
    desc: 'Clear 50% milestone activation with the balance payable only upon your verified sign-off. Zero hidden lock-ins or recurring price escalations.',
  },
];

export default function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-white/[0.05] bg-[#070b14]"
    >
      <div className="max-w-6xl mx-auto space-y-16">

        <div className="text-center max-w-2xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-full px-3.5 py-1 mb-2">
            <span className="text-[11px] font-medium text-[#d4af37] uppercase tracking-widest">
              Institutional Delivery Standard
            </span>
          </div>
          <h2
            id="trust-heading"
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug md:leading-tight"
          >
            Engineering Rigor & Dedicated Lagos Executive Support
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#c9c4bc] font-light leading-relaxed">
            Every deployment is engineered with verified Moniepoint NIP settlement, guaranteed high-availability uptime, and 1-on-1 operational handover.
          </p>
        </div>

        {/* Expectation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_TO_EXPECT.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-[#0a0e17] border border-white/[0.06] hover:border-[#d4af37]/30 transition-colors space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-normal text-[#f5f3ef]">{title}</h3>
              <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Commercial Integrity Bar */}
        <div className="rounded-2xl bg-[#0c101a] border border-[#d4af37]/25 p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
            Commercial Integrity & Legal Certainty
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef]">
            CAC Certified Corporate Technology Provider
          </h3>
          <p className="text-xs sm:text-sm text-[#c9c4bc] font-light max-w-2xl mx-auto leading-relaxed">
            Bethelmind Digital Solutions operates as a legally registered Nigerian enterprise (CAC BN/RC: 7034297). All official engagements, invoices, and service level agreements route through verified corporate bank accounts at Moniepoint Microfinance Bank.
          </p>
          <div className="pt-2 flex flex-wrap justify-center items-center gap-6 text-xs text-[#d4af37]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              RC 7034297 Verified
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              Moniepoint NIP Settlement
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              48-Hour Delivery SLA
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              NDPA 2023 Compliant
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}