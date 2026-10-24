'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageSquare, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Sector Tool or Request a Custom Demo',
    tag: 'Step 1 &bull; 5 Minutes',
    desc: 'Select your industry (Solar, Auto, Beauty, Real Estate, Logistics, School, Clinic, or Retail). Tell us your business name, primary service locations, and your current price list or catalog.',
    deliverable: 'Tailored Scope of Work & Fixed Price Proforma Invoice',
    color: '#06b6d4',
  },
  {
    step: '02',
    title: 'We Engineer Your Live Mobile Prototype in 48 Hours',
    tag: 'Step 2 &bull; 48-Hour SLA',
    desc: 'With a 50% commitment deposit, our Lagos engineering team builds your dedicated mobile website, customizes your sector calculations (e.g. Band A solar BOQs or customs duties), and configures your 24/7 WhatsApp AI Sales Closer with authentic Nigerian voice notes.',
    deliverable: 'Private Live Preview Link (bethelmindanalytics.com/preview/[your-business])',
    color: '#8b5cf6',
  },
  {
    step: '03',
    title: 'Test Everything Live on Your Own Phone',
    tag: 'Step 3 &bull; Risk-Free Inspection',
    desc: 'We send the live interactive prototype straight to your WhatsApp. Test customer price quoting, send test inquiries, review the generated PDF proposals, and verify your Moniepoint or Paystack bank transfer webhook alerts.',
    deliverable: '100% Verified Production Prototype & Unlimited Refinements',
    color: '#10b981',
  },
  {
    step: '04',
    title: 'Approve, Settle the 50% Balance & Launch to Google',
    tag: 'Step 4 &bull; Production Handover',
    desc: 'Once you are 100% satisfied with the test results, settle the remaining 50% balance. We bind your official .com or .com.ng custom domain, index your business #1 on Google Search and Google Maps, and deliver your Welcome Dashboard Pack.',
    deliverable: 'Live Production Domain, SSL Certificate, Admin Dashboard & Source Handover',
    color: '#f59e0b',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>4-Step Nigerian SME Onboarding &bull; 48-Hour Delivery SLA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
            How Bethelmind Works. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              From Inquiry to Live Sales in 48 Hours.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            No complex developer jargon. No months of waiting. Here is our exact, battle-tested 4-step deployment process designed for busy Nigerian business owners.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {STEPS.map((s, index) => (
            <div 
              key={s.step}
              className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-cyan-500/30 transition-all shadow-xl"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl font-mono shrink-0 shadow-lg"
                style={{ 
                  background: `${s.color}15`, 
                  border: `1px solid ${s.color}35`, 
                  color: s.color 
                }}
              >
                {s.step}
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span 
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {s.desc}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Key Deliverable:</span>
                  <span className="text-white font-mono font-bold">{s.deliverable}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SLA & Handover Comparison Table */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white font-['Outfit']">
              Traditional Web Agencies vs. Bethelmind 48h Engineering
            </h3>
            <p className="text-xs text-slate-400">Why Nigerian SMEs choose Bethelmind over traditional freelance developers.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase text-[10px] sm:text-xs">
                <tr>
                  <th className="py-4 px-5 font-bold">Evaluation Feature</th>
                  <th className="py-4 px-5 text-rose-400 font-bold">Traditional Web Agencies</th>
                  <th className="py-4 px-5 text-emerald-400 font-bold">Bethelmind Digital Solutions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Delivery SLA</td>
                  <td className="py-3.5 px-5 text-rose-300">4 to 8 Weeks (frequent delays)</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">48 Hours Guaranteed</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Payment Risk</td>
                  <td className="py-3.5 px-5 text-rose-300">100% upfront or 70% unverified</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">50% Deposit &bull; Balance ONLY after approval</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">WhatsApp Integration</td>
                  <td className="py-3.5 px-5 text-rose-300">Static link button only</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">24/7 AI Autoresponder + Voice Notes</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Sector Calculators</td>
                  <td className="py-3.5 px-5 text-rose-300">Extra ₦150k+ custom coding fee</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">Included (Solar, Auto, Real Estate, etc.)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Fake Alert Prevention</td>
                  <td className="py-3.5 px-5 text-rose-300">None (manual screenshot checks)</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">Direct Moniepoint/Paystack Webhooks</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Mobile Responsiveness</td>
                  <td className="py-3.5 px-5 text-rose-300">Often cramped on Android phones</td>
                  <td className="py-3.5 px-5 text-emerald-300 font-bold">100% Mobile-First Touch Experience</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Trust Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">CAC Certified Nigerian Enterprise (RC 7034297)</h4>
              <p className="text-xs text-slate-400">
                Corporate Settlements via Moniepoint Microfinance Bank (6805375225 &bull; Bethelmind Digital Solutions).
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs whitespace-nowrap shadow-md shadow-cyan-500/20"
          >
            Choose Your Plan →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
