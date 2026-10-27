'use client';

/**
 * @file src/app/how-it-works/page.tsx
 * Ultra-Luxurious, Editorial 4-Step Commercial Onboarding Architecture.
 * Obsidian near-black base (#070b14), warm ivory/slate typography,
 * and champagne gold accents (#d4af37). All existing links preserved.
 */

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Sector Tool or Request a Custom Scope',
    tag: 'Step 1 &bull; Initial Consultation',
    desc: 'Select your industry (Solar, Auto, Salon, Real Estate, Logistics, School, Clinic, or Retail). Share your business name, primary Lagos service corridors, and current price list or catalog.',
    deliverable: 'Tailored Scope of Work & Fixed-Price Pro-Forma Invoice',
  },
  {
    step: '02',
    title: 'We Engineer Your Live Mobile Prototype in 48 Hours',
    tag: 'Step 2 &bull; 48-Hour SLA',
    desc: 'With a 50% milestone commitment deposit, our Lagos engineering desk builds your dedicated mobile website, calibrates your sector calculation formulas (e.g. Band A solar BOQs or customs tariffs), and configures your 24/7 WhatsApp AI Sales Closer.',
    deliverable: 'Private Live Staging Link (bethelmindanalytics.com/preview/[slug])',
  },
  {
    step: '03',
    title: 'Test Everything Live on Your Own Mobile Device',
    tag: 'Step 3 &bull; Inspection & Approval',
    desc: 'We send the live interactive prototype straight to your WhatsApp. Test customer price quoting, send test inquiries, review the generated PDF proposals, and verify your Moniepoint or Paystack bank transfer webhook alerts.',
    deliverable: '100% Verified Production Prototype & Unlimited Milestone Refinements',
  },
  {
    step: '04',
    title: 'Approve, Settle the 50% Balance & Launch to Google',
    tag: 'Step 4 &bull; Production Handover',
    desc: 'Once you are 100% satisfied with the test results, settle the remaining 50% balance. We bind your official .com or .com.ng custom domain, index your business #1 on Google Search and Google Maps, and deliver your Welcome Dashboard Pack.',
    deliverable: 'Live Production Domain, SSL Certificate, Admin Dashboard & Source Handover',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-[#c9c4bc] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        
        {/* Executive Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0e17] border border-[#d4af37]/30 text-[#d4af37] text-xs font-medium uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Nigerian SME Onboarding &bull; 48-Hour Delivery SLA</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-snug sm:leading-tight">
            How Bethelmind Works. <br className="hidden sm:inline" />{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#f5f3ef] via-[#d4af37] to-[#aa8620] inline-block pb-0.5">
              From Scope to Live Handover in 48 Hours.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
            No complex developer jargon. No months of waiting. Here is our battle-tested 4-step deployment process engineered for Nigerian commercial operators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#8e887e] font-light">
            <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              CAC RC: 7034297 Certified
            </span>
            <span>&bull;</span>
            <span>50% Milestone Escrow Protection</span>
            <span>&bull;</span>
            <span>100% Code &amp; Domain Ownership</span>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {STEPS.map((s) => (
            <div 
              key={s.step}
              className="bg-[#0a0e17] border border-white/[0.06] hover:border-[#d4af37]/35 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 transition-all shadow-xl shadow-black/50"
            >
              <div className="w-14 h-14 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center font-serif text-2xl text-[#d4af37] shrink-0">
                {s.step}
              </div>

              <div className="space-y-2.5 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]">
                  {s.tag}
                </span>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef]">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#c9c4bc] font-light leading-relaxed">
                  {s.desc}
                </p>

                <div className="pt-3 border-t border-white/[0.05] flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#8e887e] font-medium">Deliverable:</span>
                  <span className="text-[#f5f3ef] font-mono text-xs">{s.deliverable}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SLA & Handover Comparison Table (Spacious, Scrollable, Zero Column Collision) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">
              Commercial Certainty
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f3ef]">
              Traditional Freelancers vs. Bethelmind Engineering
            </h3>
            <p className="text-xs text-[#8e887e] font-light">Why Nigerian business owners choose Bethelmind milestone guarantees.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0a0e17] shadow-xl">
            <table className="w-full min-w-[680px] text-left text-xs sm:text-sm">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[#8e887e] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Evaluation Standard</th>
                  <th className="py-4 px-6 text-rose-400/90 font-semibold">Traditional Freelancers</th>
                  <th className="py-4 px-6 text-[#d4af37] font-semibold">Bethelmind Digital Solutions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#c9c4bc] font-light">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">Delivery SLA</td>
                  <td className="py-4 px-6 text-rose-300/80">4 to 8 Weeks (frequent delays)</td>
                  <td className="py-4 px-6 text-[#d4af37] font-medium">48 Hours Guaranteed</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">Payment Terms</td>
                  <td className="py-4 px-6 text-rose-300/80">100% upfront or unverified wire</td>
                  <td className="py-4 px-6 text-emerald-400 font-medium">50% Deposit &bull; Balance ONLY after approval</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">WhatsApp Sales Assistant</td>
                  <td className="py-4 px-6 text-rose-300/80">Static link button only</td>
                  <td className="py-4 px-6 text-[#d4af37] font-medium">24/7 AI Autoresponder + Voice Notes</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">Sector BOQ Calculators</td>
                  <td className="py-4 px-6 text-rose-300/80">Extra ₦150k+ custom coding fee</td>
                  <td className="py-4 px-6 text-[#d4af37] font-medium">Included (Solar, Auto, Real Estate, etc.)</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">Fake Alert Protection</td>
                  <td className="py-4 px-6 text-rose-300/80">None (manual screenshot checks)</td>
                  <td className="py-4 px-6 text-emerald-400 font-medium">Cryptographic Moniepoint NIP Webhooks</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-[#f5f3ef]">Mobile-First Touch UX</td>
                  <td className="py-4 px-6 text-rose-300/80">Often cramped on mobile devices</td>
                  <td className="py-4 px-6 text-[#d4af37] font-medium">100% Mobile-First Touch Experience</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Trust Strip */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101a] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-[#d4af37] shrink-0" />
            <div>
              <h4 className="font-serif text-base font-normal text-[#f5f3ef]">CAC Certified Nigerian Enterprise (RC: 7034297)</h4>
              <p className="text-xs text-[#8e887e] font-light mt-0.5">
                Corporate Settlements via Moniepoint Microfinance Bank (6805375225 &bull; Bethelmind Digital Solutions).
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-bold text-xs whitespace-nowrap shadow-md shadow-[#d4af37]/20 transition-all shrink-0"
          >
            View Bespoke Packages →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
