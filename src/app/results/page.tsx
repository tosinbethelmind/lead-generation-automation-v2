'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Building,
  Quote,
  Star
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface CaseStudy {
  id: string;
  clientName: string;
  industry: string;
  location: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string; change: string }[];
  quote: string;
  author: string;
  authorRole: string;
  timeframe: string;
  toolUsed: string;
  toolLink: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'powermax-solar',
    clientName: 'PowerMax Renewable Solutions',
    industry: 'Solar EPC & LiFePO4 Inverter Integrator',
    location: 'Ikeja Commercial Corridor, Lagos',
    summary: 'How an Ikeja solar contractor eliminated 6-hour quote delays and closed ₦18.4M in residential hybrid installations following the Band A electricity tariff spike.',
    challenge: 'When DisCo Band A tariffs jumped to ₦209.50/kWh, daily WhatsApp inquiries skyrocketed from 10 to over 70 per day. Sales engineers took 4 to 6 hours to manually calculate appliance wattages and prepare PDF proposals. Over 60% of prospects lost patience and purchased from faster competitors.',
    solution: 'Bethelmind deployed the SolarQuotePro BOQ Engine with instant WhatsApp auto-sizing. When prospects message, the AI collects their appliance list (ACs, pumps, freezers) and generates a structured 5kVA–15kVA Bill of Quantities with 51.2V LiFePO4 battery options and diesel payback timelines in under 3 seconds.',
    metrics: [
      { label: 'Speed to Quote', value: '< 3s', change: 'from 5 hours' },
      { label: 'Monthly Closed Deals', value: '14 Units', change: '+180% surge' },
      { label: 'Lost Inquiries', value: '0%', change: 'Down from 64%' },
      { label: 'Monthly Revenue', value: '₦18.4M', change: 'First 30 days' },
    ],
    quote: 'Before Bethelmind, our engineers spent all day punching calculators instead of doing installations. Now a customer gets their complete 5kVA solar BOQ on WhatsApp before they even put their phone down. It transformed our close rate.',
    author: 'Engr. Babatunde Alabi',
    authorRole: 'Managing Director, PowerMax Renewable Solutions',
    timeframe: '48-Hour Onboarding &bull; 30-Day Evaluation',
    toolUsed: 'Solar Load & BOQ Quotation Engine',
    toolLink: '/tools/solar-boq'
  },
  {
    id: 'velvet-touch-salon',
    clientName: 'Velvet Touch Luxury Salon & MedSpa',
    industry: 'Beauty, Hair Styling & Aesthetics Clinic',
    location: 'Lekki Phase 1, Lagos',
    summary: 'Eliminated weekend appointment no-shows and fraudulent transfer alerts with an automated 25% Moniepoint reservation deposit lock.',
    challenge: 'The salon suffered 8 to 12 weekend no-shows every week for premium bridal hair extensions and aesthetics appointments. Fraudulent payment screenshots ("fake alerts") cost over ₦350,000 in unrecoverable stylist hours and materials each month.',
    solution: 'Bethelmind launched a 24/7 WhatsApp appointment scheduler with direct Moniepoint virtual account webhook verification. Clients select their stylist and service slot, lock it with a 25% non-refundable reservation deposit, and receive an instant digital QR confirmation pass.',
    metrics: [
      { label: 'No-Show Rate', value: '0%', change: 'Down from 28%' },
      { label: 'Fake Alert Losses', value: '₦0', change: '100% eliminated' },
      { label: 'Weekend Slot Fill', value: '98%', change: 'Fully booked' },
      { label: 'Recovered Revenue', value: '₦1.4M/mo', change: 'Direct net gain' },
    ],
    quote: 'The fake alert menace was our biggest headache. Bethelmind’s deposit lock system changed everything. When clients pay the deposit, our bank confirms it instantly and the stylist is ready. Zero drama.',
    author: 'Mrs. Chidinma Okafor',
    authorRole: 'Founder & Principal Stylist, Velvet Touch Lekki',
    timeframe: '24-Hour Embed &bull; 60-Day Evaluation',
    toolUsed: 'Salon Booking & Anti-No-Show Deposit Lock',
    toolLink: '/tools/salon-booking'
  },
  {
    id: 'interstate-express-freight',
    clientName: 'Interstate Haulage & Waybill Hub',
    industry: 'Logistics, Interstate Cargo & Dispatch',
    location: 'Alaba International & Trade Fair, Lagos',
    summary: 'Cut driver phone call interruptions by 85% and recovered ₦420,000 monthly in diesel pilferage with automated WhatsApp waybill tracking.',
    challenge: 'Dispatch managers spent 4 hours every morning answering frantic merchant calls asking "Where is my goods?". Meanwhile, unmonitored interstate drivers claimed inflated diesel allowances on the Lagos-Abuja and Lagos-Kano corridors.',
    solution: 'Integrated the Hyperlocal Dispatch & Waybill Tracking Engine. Customers receive an automated WhatsApp link showing their live dispatch milestone, while driver mileage is cross-checked against standard diesel consumption matrices.',
    metrics: [
      { label: 'Inbound Call Spam', value: '-85%', change: 'Replaced by links' },
      { label: 'Diesel Leakage', value: '₦420k/mo', change: 'Direct recovery' },
      { label: 'Waybill Processing', value: '< 30s', change: 'Instant dispatch' },
      { label: 'Customer CSAT', value: '4.9/5', change: 'Merchant trust' },
    ],
    quote: 'Our clients in Alaba love getting the WhatsApp link with their tracking number. They stop calling our personal phones and our dispatchers can focus on loading trucks.',
    author: 'Chief Emeka Nnamdi',
    authorRole: 'Operations Director, Interstate Express Logistics',
    timeframe: '48-Hour Deployment &bull; 90-Day Evaluation',
    toolUsed: 'Hyperlocal Dispatch & Waybill Tracker',
    toolLink: '/tools/logistics-waybill'
  },
  {
    id: 'apex-heights-realty',
    clientName: 'Apex Heights Properties & Investment',
    industry: 'Real Estate & Land Banking Developer',
    location: 'Maitama & Guzape, Abuja FCT',
    summary: 'Generated ₦24.5M in diaspora off-plan land allocations with interactive half/full plot survey calculators and foreign exchange milestone tracking.',
    challenge: 'Diaspora Nigerian buyers in the UK, US, and Canada hesitated on off-plan land purchases due to confusing survey charges (Red Copy), legal documentation levies, and fluctuating forex rates.',
    solution: 'Bethelmind built an interactive Plot Layout & Ancillary Levy Calculator that clearly itemizes land cost, registered survey fees, deed of assignment levies, and 12-month installment spreads in both NGN and USD.',
    metrics: [
      { label: 'Diaspora Conversions', value: '11 Plots', change: 'Closed in 45 days' },
      { label: 'Milestone Deposits', value: '₦24.5M', change: 'Direct bank credits' },
      { label: 'Query Resolution', value: 'Instant', change: 'All levies itemized' },
      { label: 'Buyer Trust Score', value: '100%', change: 'Verified title specs' },
    ],
    quote: 'Foreign buyers are skeptical of hidden fees. When our Bethelmind calculator showed them every single survey fee and dollar equivalent with zero ambiguity, they wired their deposits without delay.',
    author: 'Barr. Aisha Bello',
    authorRole: 'Head of Sales & Legal, Apex Heights Abuja',
    timeframe: '48-Hour Turnkey Build &bull; 45-Day Evaluation',
    toolUsed: 'Plot Layout, Survey Levies & Mortgage Amortization Suite',
    toolLink: '/tools/real-estate-manager'
  }
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified Nigerian SME Case Studies & Outcomes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
            Real Nigerian Businesses. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Measurable Revenue Growth.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            See how solar contractors, luxury salons, haulage operators, and real estate developers across Lagos, Abuja, and Port Harcourt capture clients 24/7 with Bethelmind automation.
          </p>
        </div>

        {/* Aggregate Credibility Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: 'Average WhatsApp Speed', value: '< 3s', desc: 'Sub-second reply latency' },
            { label: 'Fake Alerts Eliminated', value: '100%', desc: 'Direct Moniepoint webhooks' },
            { label: 'Turnaround Guarantee', value: '48 Hours', desc: 'Working prototype SLA' },
            { label: 'Commitment Safety', value: '50% Balance', desc: 'Pay only on live approval' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block">{stat.value}</span>
              <p className="text-xs font-bold text-white">{stat.label}</p>
              <p className="text-[11px] text-slate-400">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Case Studies Cards */}
        <div className="space-y-12">
          {CASE_STUDIES.map((cs, idx) => (
            <div 
              key={cs.id}
              className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Case Study Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                      {cs.industry}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {cs.location}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                    {cs.clientName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={cs.toolLink}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
                  >
                    <span>Test {cs.toolUsed}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Problem vs Solution Story */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
                <div className="space-y-3 p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/15">
                  <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>The Challenge & Revenue Leak</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{cs.challenge}</p>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/15">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>The Bethelmind Automated Solution</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{cs.solution}</p>
                </div>
              </div>

              {/* Metric Impact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {cs.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <p className="text-[11px] text-slate-400 font-medium">{m.label}</p>
                    <p className="text-lg sm:text-xl font-black text-white font-mono">{m.value}</p>
                    <p className="text-[10px] font-bold text-emerald-400">{m.change}</p>
                  </div>
                ))}
              </div>

              {/* Verified Quote Block */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                <Quote className="w-6 h-6 text-cyan-400 shrink-0 mt-1 opacity-70" />
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    &ldquo;{cs.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-xs font-bold text-white">{cs.author}</p>
                    <p className="text-[11px] text-slate-400">{cs.authorRole}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Final Conversion Call to Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/30 text-center space-y-6 max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
            Ready to Automate Your Business in 48 Hours?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join forward-thinking Nigerian businesses turning cold WhatsApp inquiries into confirmed bank transfer deposits on autopilot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(
                'Hello Bethelmind Lagos Desk! I just read your verified Nigerian business case studies and want to schedule a live WhatsApp demo for our company.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book Free WhatsApp Consultation →</span>
            </a>
            <Link
              href="/pricing"
              className="py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs sm:text-sm font-bold transition-all"
            >
              View Transparent Pricing Packages
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
