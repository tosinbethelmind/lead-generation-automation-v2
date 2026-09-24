'use client';

/**
 * @file src/app/solutions/page.tsx
 * 🚀 BETHELMIND ANALYTICS CUSTOMER ACQUISITION & REVENUE SUITE
 * 
 * Redesigned for Maximum Client Customer Growth:
 * Direct-Response Customer Generation, Speed-to-Lead, and Cash Recovery for Nigerian SMEs.
 * 
 * Note: Solar & Inverter Proposal Suite is cleanly separated into its own sovereign engine (/solar).
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Users, Star, Repeat, Globe, Calendar, 
  GraduationCap, Zap, ArrowRight, CheckCircle2, Code2, 
  Sparkles, ExternalLink, PhoneCall, Copy, Check, 
  TrendingUp, ShieldCheck, Flame, ChevronRight
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
  accentColor: string;
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
    accentColor: '#10b981',
    setupFeeNGN: '₦35,000',
    retainerNGN: '₦15,000 – ₦30,000/mo',
    turnkeyFeeNGN: '₦150,000 (₦75k Deposit)',
    embedFeeNGN: '₦35,000',
    theCustomerLeak: '70% of Nigerian Instagram and WhatsApp leads buy from the first vendor who replies. If you take 2 hours to answer "How much?", they have already paid your competitor.',
    howItGetsYouCustomers: [
      'Instant sub-2s responses in natural Nigerian accent voice notes that build human rapport',
      'Automated product lookup, stock verification, and size recommendations',
      'Sends instant checkout buttons and automated Moniepoint/Paystack/OPay payment links',
      'Automatically follows up with abandoned inquiries after 30 minutes with a courtesy nudge'
    ],
    sampleWhatsAppProof: '“Good day! Yes, our Premium Slim-Fit Suit is available in sizes 42, 44 & 46 at ₦48,500. We can dispatch to Lekki/Ikeja within 2 hours. May I lock in your delivery slot now?”',
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
    accentColor: '#06b6d4',
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
    title: 'Google Maps #1 Ranking & 5-Star Review Magnet',
    tagline: 'Turn Nearby High-Intent Google Searchers into Daily Inbound Phone Calls',
    targetNiche: 'Clinics, Dental, Salons, Hotels, Auto Mechanics, Restaurants & Spas',
    customerGrowthMetric: 'Top 3 Google Maps Ranking & 5x More Inbound Local Calls',
    icon: Star,
    accentColor: '#f59e0b',
    setupFeeNGN: '₦40,000',
    retainerNGN: '₦20,000/mo',
    turnkeyFeeNGN: '₦150,000 (₦75k Deposit)',
    embedFeeNGN: '₦35,000',
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
    accentColor: '#ef4444',
    setupFeeNGN: '₦45,000',
    retainerNGN: '₦25,000 – ₦45,000/mo',
    turnkeyFeeNGN: '₦150,000 (₦75k Deposit)',
    embedFeeNGN: '₦35,000',
    theCustomerLeak: 'SMEs sit on 2,000+ past customer contacts and never re-contact them, wasting money constantly running expensive new ads instead of selling to people who already trust them.',
    howItGetsYouCustomers: [
      'Segments past buyers by product interest and purchase recency',
      'Delivers compliant, non-spam VIP WhatsApp flash sale drops with time-sensitive discounts',
      'Automated birthday and anniversary greeting cards with personalized discount vouchers',
      'Brings in an immediate flood of repeat orders at zero ad spend'
    ],
    sampleWhatsAppProof: '“🎉 VIP Weekend Drop: Hello Mrs. Adebayo! For our top 50 clients only, our Italian handbag collection has a 48-hour 20% privilege code [VIP20]. View 8 exclusive pieces: store.ng/vip”',
    demoUrl: '/home#sector-tools'
  },
  {
    id: 'turnkey-authority-site',
    number: '05',
    title: '24-Hour Turnkey Luxury Sales Website (High-Trust Engine)',
    tagline: 'A High-Prestige Digital Storefront That Convinces Wealthy Buyers to Pay Top Dollar',
    targetNiche: 'Consultants, Luxury Realtors, Contractors, Importers & Law Firms',
    customerGrowthMetric: 'Close ₦1M–₦10M High-Ticket Contracts That Demand Corporate Proof',
    icon: Globe,
    accentColor: '#8b5cf6',
    setupFeeNGN: '₦75,000 (50% Deposit)',
    retainerNGN: '₦20,000/mo (Hosting + Updates)',
    turnkeyFeeNGN: '₦150,000 Total (48h Delivery)',
    embedFeeNGN: 'N/A',
    theCustomerLeak: 'High-net-worth clients and corporate directors will never wire ₦2,000,000+ to a vendor who only has an Instagram handle and a Gmail address. You lose big deals to polished firms.',
    howItGetsYouCustomers: [
      'Complete custom luxury website on your branded .com or .ng domain within 24–48 hours',
      'Showcases verified customer testimonials, portfolio galleries, and corporate credentials',
      'Built-in 1-tap WhatsApp consultation popups and automated PDF quote generators',
      'Establishes instant authority so you can charge 2x higher prices with zero price haggling'
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
    accentColor: '#ec4899',
    setupFeeNGN: '₦35,000',
    retainerNGN: '₦15,000 – ₦35,000/mo',
    turnkeyFeeNGN: '₦150,000 (₦75k Deposit)',
    embedFeeNGN: '₦35,000',
    theCustomerLeak: 'Service businesses lose 30% to 50% of booked appointments to no-shows who casually cancel last-minute, leaving staff idle and chairs empty while serious paying clients were turned away.',
    howItGetsYouCustomers: [
      '24/7 calendar showing real-time open time slots for your team',
      'Requires a ₦5,000–₦20,000 upfront non-refundable commitment deposit before confirming',
      'Automated WhatsApp reminder 3 hours before appointment with Google Map directions',
      'Turns flaky time-wasters into guaranteed, punctual, paying clients'
    ],
    sampleWhatsAppProof: '“📅 Booking Confirmed: Bridal Consultation with Lead Stylist on Saturday 11:00 AM. ₦15,000 commitment deposit verified. Balance of ₦35,000 due at session completion.”',
    demoUrl: '/home#sector-tools'
  },
  {
    id: 'school-fee-admissions',
    number: '07',
    title: 'Private School Admissions Portal & 100% Fee Collection Gate',
    tagline: 'Attract New Student Enrollments & Ensure 100% Tuition Is Paid Before Results Unlock',
    targetNiche: 'Private Schools, Academies, Creches & Colleges',
    customerGrowthMetric: '100% Fee Recovery Rate & 30+ New Student Enquiries per Term',
    icon: GraduationCap,
    accentColor: '#14b8a6',
    setupFeeNGN: '₦65,000',
    retainerNGN: '₦50,000 – ₦100,000/term',
    turnkeyFeeNGN: '₦175,000 (₦85k Deposit)',
    embedFeeNGN: '₦45,000',
    theCustomerLeak: 'Private school proprietors lose millions each term to defaulting parents who collect physical report cards and flee, while manual admissions inquiry handling loses new prospective students.',
    howItGetsYouCustomers: [
      'Online admissions fee estimator and virtual tour that attracts prospective parents',
      'Automated WhatsApp tuition clearance reminders ahead of exam periods',
      'Digital Result Gating: Student terminal report cards only unlock once outstanding fees = ₦0',
      'Proprietors recover 100% of school fees without embarrassing children in classrooms'
    ],
    sampleWhatsAppProof: '“🎓 Result Portal: Master Chinedu (JSS 3) examination broadsheet is ready. Term balance: ₦0.00. Result card successfully unlocked: schoolportal.ng/result/CN-2026”',
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
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ paddingTop: 110, paddingBottom: 80 }}>
        {/* STANDALONE SOLAR ENGINE PORTAL BANNER */}
        <section style={{ maxWidth: 1200, margin: '0 auto 28px', padding: '0 20px' }}>
          <div style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.12) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 18, padding: '14px 22px', display: 'flex', flexDirection: 'column', md: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b20', border: '1px solid #f59e0b40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap style={{ width: 18, height: 18, color: '#f59e0b' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc' }}>
                  Are you a Solar Installer or EPC Contractor?
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>
                  Our dedicated Solar & Inverter Proposal Suite (SolarQuotePro) runs in its own specialized sovereign engineering engine.
                </span>
              </div>
            </div>

            <Link
              href="/solar"
              style={{
                padding: '8px 18px',
                borderRadius: 10,
                background: '#f59e0b',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(245,158,11,0.25)'
              }}
            >
              <span>Launch Solar Engine</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </section>

        {/* HERO SECTION */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '6px 18px', marginBottom: 18 }}>
            <Flame style={{ width: 15, height: 15, color: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Built Exclusively for Customer Acquisition & Cashflow
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.1rem, 5vw, 3.3rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 auto 18px', maxWidth: 900, fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}>
            Solutions That Bring Your Business <span style={{ color: '#10b981' }}>More Paying Customers</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 740, margin: '0 auto 32px', lineHeight: 1.65 }}>
            Nigerian businesses don't need complicated dashboards. You need tools that <strong>stop buyers from abandoning your DMs</strong>, <strong>rank you #1 on Google Maps</strong>, and <strong>hand you verified high-intent local clients</strong> ready to pay.
          </p>

          {/* DUAL DELIVERY MODE TOGGLE */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 4, gap: 4, marginBottom: 36 }}>
            <button
              onClick={() => setDeliveryMode('turnkey')}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                border: 'none',
                background: deliveryMode === 'turnkey' ? '#10b981' : 'transparent',
                color: deliveryMode === 'turnkey' ? '#000' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <Zap style={{ width: 16, height: 16 }} />
              <span>Option A: 24h Turnkey DFY Website (₦75k Deposit)</span>
            </button>
            <button
              onClick={() => setDeliveryMode('embed')}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                border: 'none',
                background: deliveryMode === 'embed' ? '#3b82f6' : 'transparent',
                color: deliveryMode === 'embed' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <Code2 style={{ width: 16, height: 16 }} />
              <span>Option B: 1-Line Embed Script Upgrade (₦35k Setup)</span>
            </button>
          </div>
        </section>

        {/* CUSTOMER ENGINES GRID */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {CUSTOMER_ACQUISITION_ENGINES.map(engine => {
              const IconComponent = engine.icon;
              const waText = encodeURIComponent(`Hello Bethelmind Lagos Desk,\n\nI want to deploy Engine #${engine.number}: *${engine.title}* to get more paying customers for my business (${engine.targetNiche}).\n\nDelivery preference: ${deliveryMode === 'turnkey' ? '24h Turnkey Website (₦75k deposit)' : '1-Line Embed Upgrade (₦35k setup)'}`);
              const waUrl = `https://wa.me/2348022791227?text=${waText}`;

              return (
                <div
                  key={engine.id}
                  style={{
                    background: 'rgba(11,15,26,0.75)',
                    border: `1px solid ${engine.accentColor}25`,
                    borderRadius: 22,
                    padding: 26,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 100, height: 100, background: engine.accentColor, filter: 'blur(50px)', opacity: 0.15, pointerEvents: 'none' }} />

                  {/* TOP ROW */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${engine.accentColor}18`, border: `1px solid ${engine.accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent style={{ width: 22, height: 22, color: engine.accentColor }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: engine.accentColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Engine #{engine.number} • {engine.targetNiche}
                      </span>
                      <h3 style={{ margin: '2px 0 0', fontSize: '1.12rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                        {engine.title}
                      </h3>
                    </div>
                  </div>

                  {/* CUSTOMER GROWTH METRIC (THE CORE VALUE PROPOSITION) */}
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TrendingUp style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Direct Customer Result:</span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#10b981' }}>{engine.customerGrowthMetric}</span>
                    </div>
                  </div>

                  {/* THE LEAK */}
                  <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>The Money Leak:</span>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#fca5a5', lineHeight: 1.45 }}>
                      {engine.theCustomerLeak}
                    </p>
                  </div>

                  {/* HOW IT GETS YOU CUSTOMERS */}
                  <div style={{ marginBottom: 20, flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
                      How It Brings You Paying Customers:
                    </span>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {engine.howItGetsYouCustomers.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                          <CheckCircle2 style={{ width: 14, height: 14, color: engine.accentColor, flexShrink: 0, marginTop: 2 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SAMPLE WHATSAPP PROOF */}
                  <div style={{ background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 18 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                      Live WhatsApp Customer Experience:
                    </span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.45 }}>
                      {engine.sampleWhatsAppProof}
                    </p>
                  </div>

                  {/* PRICING ROW */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>
                        {deliveryMode === 'turnkey' ? 'DFY Turnkey Setup:' : '1-Line Embed Setup:'}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc' }}>
                        {deliveryMode === 'turnkey' ? engine.turnkeyFeeNGN : engine.embedFeeNGN}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Monthly Retainer:</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: engine.accentColor }}>
                        {engine.retainerNGN}
                      </span>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '11px 16px',
                        borderRadius: 12,
                        background: '#10b981',
                        color: '#022c22',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                      }}
                    >
                      <PhoneCall style={{ width: 15, height: 15 }} />
                      <span>Deploy to Get More Customers</span>
                    </a>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        href={engine.demoUrl}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#cbd5e1',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <ExternalLink style={{ width: 13, height: 13 }} />
                        <span>View Interactive Demo</span>
                      </Link>

                      <button
                        onClick={() => copyEmbedSnippet(engine.id)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 10,
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.25)',
                          color: '#60a5fa',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        {copiedId === engine.id ? <Check style={{ width: 13, height: 13 }} /> : <Code2 style={{ width: 13, height: 13 }} />}
                        <span>{copiedId === engine.id ? 'Copied!' : '1-Line Embed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SETTLEMENT ASSURANCE */}
        <section style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', md: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ maxWidth: 680 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
                <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
                <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 700 }}>50% Milestone Deposit • 48h Delivery Guarantee</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 10px', fontFamily: "'Outfit', sans-serif" }}>
                Zero Risk Commercial Onboarding for Nigerian Business Owners
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                You test your custom customer-acquisition system on your own phone and laptop before paying the remaining balance. Direct Nigerian bank settlement processed straight via <strong>OPay Digital Services</strong> (Acc: <code>7034297995</code> — Oyelakin Tosin Matthew).
              </p>
            </div>

            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Lagos%20Desk%2C%20I%20want%20to%20deploy%20a%20customer%20acquisition%20system%20for%20my%20business."
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '14px 24px',
                borderRadius: 14,
                background: '#10b981',
                color: '#022c22',
                fontWeight: 900,
                fontSize: '0.95rem',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
                whiteSpace: 'nowrap'
              }}
            >
              <PhoneCall style={{ width: 16, height: 16 }} />
              <span>Talk to Lagos Closer Desk</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
