'use client';

/**
 * @file src/app/solutions/page.tsx
 * Bethelmind Digital Solutions CUSTOMER ACQUISITION & REVENUE SUITE
 * 
 * Direct-Response Client Acquisition, Speed-to-Lead, and Cash Recovery for Nigerian SMEs.
 * Note: Solar & Inverter Proposal Suite is cleanly separated into its own sovereign engine (/solar).
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Users, Star, Repeat, Globe, Calendar, 
  GraduationCap, Zap, ArrowRight, CheckCircle2, Code2, 
  Sparkles, ExternalLink, PhoneCall, Copy, Check, 
  TrendingUp, ShieldCheck, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

interface CustomerAcquisitionEngine {
  id: string;
  number: string;
  title: string;
  tagline: string;
  targetNiche: string;
  customerGrowthMetric: string;
  icon: React.ElementType;
  setupFeeNGN: string;
  retainerNGN: string;
  turnkeyFeeNGN: string;
  embedFeeNGN: string;
  theCustomerLeak: string;
  howItGetsYouCustomers: string[];
  sampleWhatsAppProof: string;
  demoUrl: string;
}

const CUSTOMER_ACQUISITION_ENGINES: CustomerAcquisitionEngine[] = [
  {
    id: 'speed-to-lead',
    number: '01',
    title: '24/7 WhatsApp AI Speed-to-Lead & Catalog Closer',
    tagline: 'Sub-2s DM Replies in Nigerian Voice Notes That Close Buyers While You Sleep',
    targetNiche: 'Instagram Vendors, Boutiques, Wholesale, Retail & Car Dealerships',
    customerGrowthMetric: '+35% to +60% Higher Sales Conversion from Existing Inquiries',
    icon: MessageSquare,
    setupFeeNGN: '₦35,000',
    retainerNGN: '₦15,000 – ₦30,000/mo',
    turnkeyFeeNGN: '₦65,000 Total (₦35k Deposit)',
    embedFeeNGN: '₦35,000 Setup',
    theCustomerLeak: '70% of Nigerian Instagram and WhatsApp leads buy from the first vendor who replies. If you take 2 hours to answer "How much?", they have already paid your competitor.',
    howItGetsYouCustomers: [
      'Instant sub-2s responses in natural Nigerian accent voice notes that build human rapport',
      'Automated product lookup, stock verification, and size recommendations',
      'Sends instant checkout buttons and automated Moniepoint/Paystack/OPay payment links',
      'Automatically follows up with abandoned inquiries after 30 minutes with a courtesy nudge'
    ],
    sampleWhatsAppProof: '“Good day. Yes, our Premium Slim-Fit Suit is available in sizes 42, 44 & 46 at ₦48,500. We can dispatch to Lekki/Ikeja within 2 hours. May I lock in your delivery slot now?”',
    demoUrl: '/home#sector-tools'
  },
  {
    id: 'local-lead-stream',
    number: '02',
    title: 'Verified Local B2B Lead Stream & Direct Outreach Engine',
    tagline: 'Direct Access to 1,000+ Verified WhatsApp Decision-Makers in Your Exact Local Area',
    targetNiche: 'Corporate Services, Cleaning, Logistics, B2B Wholesalers & IT Firms',
    customerGrowthMetric: '15 to 40 New Qualified B2B Sales Conversations Every Month',
    icon: Users,
    setupFeeNGN: '₦50,000',
    retainerNGN: '₦30,000 – ₦60,000/mo',
    turnkeyFeeNGN: '₦175,000 (₦85k Deposit)',
    embedFeeNGN: '₦45,000',
    theCustomerLeak: 'Most B2B businesses post on Instagram and wait for miracles instead of directly contacting verified managing directors and facility heads in Ikeja, Lekki, or Abuja.',
    howItGetsYouCustomers: [
      'Hand-delivers 500 to 2,000 verified Nigerian company owners with real phone numbers',
      'Pre-written respectful 2-step permission icebreakers that get 28%+ reply rates',
      'Personalized audio voice note attachments addressing the owner by their business name',
      'Automated follow-up reminders that book meetings without awkward manual chasing'
    ],
    sampleWhatsAppProof: '“Good day Alhaji Kabir. We noticed your VI branch manages high dispatch volume. We built an automated dispatch comparer that cuts courier costs by 22%. May I share a 1-minute demo?”',
    demoUrl: '/home#pricing'
  },
  {
    id: 'google-maps-magnet',
    number: '03',
    title: 'Google Maps Ranking & 5-Star Review Magnet',
    tagline: 'Turn Nearby High-Intent Google Searchers into Daily Inbound Phone Calls',
    targetNiche: 'Clinics, Dental, Salons, Hotels, Auto Mechanics, Restaurants & Spas',
    customerGrowthMetric: 'Top 3 Google Maps Ranking & 5x More Inbound Local Calls',
    icon: Star,
    setupFeeNGN: '₦40,000',
    retainerNGN: '₦20,000/mo',
    turnkeyFeeNGN: '₦65,000 Total (₦35k Deposit)',
    embedFeeNGN: '₦35,000 Setup',
    theCustomerLeak: 'When wealthy customers search "Best dentist in Lekki" or "Car AC repair in Ikeja", they only call the businesses with 100+ 5-star Google reviews at the top of the map.',
    howItGetsYouCustomers: [
      'Optimizes your Google Business profile with local high-intent keywords and geotags',
      'Automated WhatsApp post-service thank you message with a 1-tap 5-star Google review link',
      'Collects 30 to 80 genuine local Google reviews within your first 45 days',
      'Propels your business to the #1 local pack, generating daily inbound calls for free'
    ],
    sampleWhatsAppProof: '“Hello Chief Emeka! Thank you for visiting Apex Dental today. If you loved our care, could you take 10 seconds to tap this link and leave us a quick 5-star rating on Google? We would be honored!”',
    demoUrl: '/gmb/sample-audit'
  },
  {
    id: 'reengagement-broadcast',
    number: '04',
    title: 'Flash-Sale Broadcast & Customer Re-Engagement Engine',
    tagline: 'Reactivate Hundreds of Cold Past Customers for Instant 24-Hour Cashflow Drops',
    targetNiche: 'Boutiques, Supermarkets, Restaurants, Gyms & Spas',
    customerGrowthMetric: '₦350,000 to ₦1,200,000 in Direct Sales Within 48 Hours of Launch',
    icon: Repeat,
    setupFeeNGN: '₦45,000',
    retainerNGN: '₦25,000 – ₦45,000/mo',
    turnkeyFeeNGN: '₦65,000 Total (₦35k Deposit)',
    embedFeeNGN: '₦35,000 Setup',
    theCustomerLeak: 'SMEs sit on 2,000+ past customer contacts and never re-contact them, wasting money constantly running expensive new ads instead of selling to people who already trust them.',
    howItGetsYouCustomers: [
      'Segments past buyers by product interest and purchase recency',
      'Delivers compliant, non-spam VIP WhatsApp flash sale drops with time-sensitive discounts',
      'Automated birthday and anniversary greeting cards with personalized discount vouchers',
      'Brings in an immediate flood of repeat orders at zero ad spend'
    ],
    sampleWhatsAppProof: '“VIP Weekend Drop: Hello Mrs. Adebayo! For our top 50 clients only, our Italian handbag collection has a 48-hour 20% privilege code [VIP20]. View 8 exclusive pieces: store.ng/vip”',
    demoUrl: '/home#sector-tools'
  },
  {
    id: 'turnkey-authority-site',
    number: '05',
    title: 'Turnkey Luxury Sales Website (High-Trust Engine)',
    tagline: 'A High-Prestige Digital Storefront That Convinces High-Value Clients to Commit',
    targetNiche: 'Consultants, Luxury Realtors, Contractors, Importers & Law Firms',
    customerGrowthMetric: 'Close ₦1M–₦10M High-Ticket Contracts That Demand Corporate Proof',
    icon: Globe,
    setupFeeNGN: '₦75,000 (50% Deposit)',
    retainerNGN: '₦20,000/mo (Hosting + Updates)',
    turnkeyFeeNGN: '₦150,000 Total (48h Delivery)',
    embedFeeNGN: 'N/A',
    theCustomerLeak: 'High-net-worth clients and corporate directors will rarely wire ₦2,000,000+ to a vendor who only has an Instagram handle and a personal bank account.',
    howItGetsYouCustomers: [
      'Complete custom luxury website on your branded .com or .ng domain within 24–48 hours',
      'Showcases verified customer testimonials, portfolio galleries, and corporate credentials',
      'Built-in 1-tap WhatsApp consultation popups and automated PDF quote generators',
      'Establishes instant authority so you can charge premium prices with zero price haggling'
    ],
    sampleWhatsAppProof: '“Hello Engr. Funsho, our complete portfolio, CAC credentials, and corporate references are available on our official website at www.firmbrand.com.ng. We look forward to executing your project.”',
    demoUrl: '/preview/sample-lead'
  },
  {
    id: 'commitment-deposit-locker',
    number: '06',
    title: 'Automated Service Booking & Commitment Deposit Locker',
    tagline: 'Lock Appointment Slots with Non-Refundable Upfront Deposits (Zero No-Shows)',
    targetNiche: 'Clinics, Spas, Makeup Studios, Event Photographers & Barbershops',
    customerGrowthMetric: 'Reduces No-Show Rates from 40% Down to Under 4%',
    icon: Calendar,
    setupFeeNGN: '₦35,000',
    retainerNGN: '₦15,000 – ₦35,000/mo',
    turnkeyFeeNGN: '₦65,000 Total (₦35k Deposit)',
    embedFeeNGN: '₦35,000 Setup',
    theCustomerLeak: 'Service businesses lose 30% to 50% of booked appointments to no-shows who cancel last-minute, leaving staff idle while serious paying clients were turned away.',
    howItGetsYouCustomers: [
      '24/7 calendar showing real-time open time slots for your team',
      'Requires a ₦5,000–₦20,000 upfront non-refundable commitment deposit before confirming',
      'Automated WhatsApp reminder 3 hours before appointment with Google Map directions',
      'Turns uncommitted leads into guaranteed, punctual, paying clients'
    ],
    sampleWhatsAppProof: '“Booking Confirmed: Bridal Consultation with Lead Stylist on Saturday 11:00 AM. ₦15,000 commitment deposit verified. Balance of ₦35,000 due at session completion.”',
    demoUrl: '/home#sector-tools'
  },
  {
    id: 'school-fee-admissions',
    number: '07',
    title: 'Private School Admissions Portal & Fee Collection Gate',
    tagline: 'Attract New Student Enrollments & Ensure 100% Tuition Is Paid Before Results Unlock',
    targetNiche: 'Private Schools, Academies, Creches & Colleges',
    customerGrowthMetric: '100% Fee Recovery Rate & 30+ New Student Enquiries per Term',
    icon: GraduationCap,
    setupFeeNGN: '₦65,000',
    retainerNGN: '₦50,000 – ₦100,000/term',
    turnkeyFeeNGN: '₦175,000 (₦85k Deposit)',
    embedFeeNGN: '₦45,000',
    theCustomerLeak: 'Private school proprietors lose millions each term to defaulting parents who collect physical report cards and leave, while manual admissions handling loses prospective students.',
    howItGetsYouCustomers: [
      'Online admissions fee estimator and virtual tour that attracts prospective parents',
      'Automated WhatsApp tuition clearance reminders ahead of exam periods',
      'Digital Result Gating: Student terminal report cards only unlock once outstanding fees = ₦0',
      'Proprietors recover 100% of school fees without disrupting children in classrooms'
    ],
    sampleWhatsAppProof: '“Result Portal: Master Chinedu (JSS 3) examination broadsheet is ready. Term balance: ₦0.00. Result card successfully unlocked: schoolportal.ng/result/CN-2026”',
    demoUrl: '/home#sector-tools'
  }
];

export default function SolutionsPage() {
  const [deliveryMode, setDeliveryMode] = useState<'turnkey' | 'embed'>('turnkey');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmbedSnippet = (toolId: string) => {
    const snippet = `<!-- Bethelmind Customer Growth Embed -->\n<script src="https://www.bethelmindanalytics.com/embed.js?engine=${toolId}" async></script>\n<div id="bethelmind-${toolId}-engine"></div>`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(toolId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f3ef] font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* STANDALONE SOLAR ENGINE PORTAL BANNER */}
        <div className="max-w-6xl mx-auto rounded-2xl bg-[#090d16]/80 border border-[#d4af37]/25 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-[#f5f3ef] block">
                Are you a Solar Installer or EPC Contractor?
              </span>
              <span className="text-xs text-[#c9c4bc]/70 font-light block">
                Our dedicated Solar &amp; Inverter Proposal Suite (SolarQuotePro) runs in its own sovereign engineering engine.
              </span>
            </div>
          </div>

          <Link
            href="/solar"
            className="py-2 px-4 rounded-xl bg-[#d4af37] hover:bg-[#dfbc46] text-[#070b14] font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Launch Solar Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Customer Acquisition &amp; Commercial Cashflow</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight">
            Solutions That Bring Your Enterprise <br />
            <span className="italic font-light text-[#d4af37]">
              More High-Value Clients.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
            Nigerian businesses require practical systems that prevent buyers from abandoning WhatsApp inquiries, establish search authority, and convert prospective clients into verified bank transfer deposits.
          </p>

          {/* DUAL DELIVERY MODE TOGGLE */}
          <div className="inline-flex bg-[#090d16] border border-white/[0.08] rounded-2xl p-1 gap-1 pt-1 mt-4">
            <button
              onClick={() => setDeliveryMode('turnkey')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                deliveryMode === 'turnkey'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-[#070b14] shadow-md shadow-[#d4af37]/20 font-bold'
                  : 'text-[#c9c4bc] hover:text-[#f5f3ef]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Option A: Full Mobile Website + Tool (₦35k Deposit / ₦65k Total)</span>
            </button>
            <button
              onClick={() => setDeliveryMode('embed')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                deliveryMode === 'embed'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-[#070b14] shadow-md shadow-[#d4af37]/20 font-bold'
                  : 'text-[#c9c4bc] hover:text-[#f5f3ef]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Option B: 1-Line Embed on Existing Site (₦35k One-Time)</span>
            </button>
          </div>
        </div>

        {/* CUSTOMER ENGINES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {CUSTOMER_ACQUISITION_ENGINES.map((engine) => {
            const IconComponent = engine.icon;
            const waText = encodeURIComponent(
              `Hello Bethelmind Lagos Desk,\n\nI want to deploy Engine #${engine.number}: *${engine.title}* (${engine.targetNiche}).\n\nDelivery preference: ${
                deliveryMode === 'turnkey'
                  ? 'Full Mobile Website + Tool (₦35k Deposit / ₦65k Total)'
                  : '1-Line Embed Upgrade (₦35k Direct Setup)'
              }`
            );
            const waUrl = `https://wa.me/2348022791227?text=${waText}`;

            return (
              <div
                key={engine.id}
                className="bg-[#090d16]/90 border border-white/[0.08] hover:border-[#d4af37]/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all shadow-xl backdrop-blur-md relative overflow-hidden"
              >
                <div className="space-y-5">
                  {/* Top Row */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-widest block">
                        Engine #{engine.number} &bull; {engine.targetNiche}
                      </span>
                      <h3 className="font-serif text-lg font-normal text-[#f5f3ef] mt-0.5">
                        {engine.title}
                      </h3>
                    </div>
                  </div>

                  {/* Customer Result Highlight */}
                  <div className="bg-[#d4af37]/[0.04] border border-[#d4af37]/20 rounded-xl p-3 flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#c9c4bc]/70 block uppercase tracking-wider font-medium">Outcome:</span>
                      <span className="text-xs font-semibold text-[#d4af37]">{engine.customerGrowthMetric}</span>
                    </div>
                  </div>

                  {/* The Money Leak */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-medium text-[#c9c4bc] uppercase tracking-wider block">Commercial Leak:</span>
                    <p className="text-xs text-[#c9c4bc]/80 font-light leading-relaxed">
                      {engine.theCustomerLeak}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-[#c5a880] uppercase tracking-widest block">
                      Deliverables:
                    </span>
                    <ul className="space-y-2">
                      {engine.howItGetsYouCustomers.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#c9c4bc] font-light leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample WhatsApp Proof */}
                  <div className="bg-[#0a0e17] border border-white/[0.06] rounded-xl p-3">
                    <span className="text-[10px] font-medium text-[#c9c4bc]/70 block mb-1">
                      Live Customer Interaction:
                    </span>
                    <p className="text-xs text-[#c9c4bc] italic font-serif font-light leading-relaxed">
                      {engine.sampleWhatsAppProof}
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  {/* Pricing Display */}
                  <div className="flex justify-between items-baseline p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-[#c9c4bc]/70 block">
                        {deliveryMode === 'turnkey' ? 'Turnkey Activation:' : '1-Line Embed:'}
                      </span>
                      <span className="text-sm font-semibold text-[#f5f3ef] font-mono">
                        {deliveryMode === 'turnkey' ? engine.turnkeyFeeNGN : engine.embedFeeNGN}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#c9c4bc]/70 block">Retainer:</span>
                      <span className="text-xs font-semibold text-[#c5a880] font-mono">
                        {engine.retainerNGN}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Deploy Engine for Your Business</span>
                    </a>

                    <div className="flex gap-2">
                      <Link
                        href={engine.demoUrl}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.08] text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3 h-3 text-[#d4af37]" />
                        <span>View Demo</span>
                      </Link>

                      <button
                        onClick={() => copyEmbedSnippet(engine.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c9c4bc] hover:text-[#f5f3ef] border border-white/[0.08] text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        {copiedId === engine.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Code2 className="w-3 h-3 text-[#d4af37]" />
                        )}
                        <span>{copiedId === engine.id ? 'Copied' : '1-Line Embed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SETTLEMENT ASSURANCE */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090d16]/90 border border-white/[0.08] p-6 sm:p-10 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>50% Milestone Deposit &bull; 48-Hour SLA</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f5f3ef]">
              Commercial Settlement &amp; Verification Guarantee
            </h3>
            <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
              Test your bespoke system on your own phone and laptop before settling the remaining milestone balance. Direct Nigerian bank settlement routed to Moniepoint Microfinance Bank (Account: <code className="text-[#d4af37] font-mono">6805375225</code> &ndash; Bethelmind Digital Solutions, CAC RC 7034297).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Digital%20Solutions%2C%20I%20want%20to%20deploy%20a%20customer%20acquisition%20system%20for%20my%20business."
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>WhatsApp Advisory Desk</span>
            </a>

            <a
              href="tel:+2348022791227"
              className="py-3 px-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#f5f3ef] border border-white/[0.08] text-xs font-medium flex items-center justify-center gap-2 transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Call (0802 279 1227)</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
