'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  MessageSquare,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  Clock,
  Send,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { BRAND_IDENTITY } from '@/lib/commerce/catalog';

const DIVISIONS = [
  {
    id: 'websites',
    badge: 'Division 1 • Primary Cashflow',
    title: 'Digital Presence for SMEs',
    price: 'From ₦80,000 (60% Deposit)',
    description:
      'Mobile-first business websites, landing pages, and WhatsApp enquiry systems built so Nigerian customers can find, trust, and contact your business directly.',
    bullets: [
      'Business Launch (₦80k–₦120k) • Professional (₦150k–₦250k) • Advanced (₦300k+)',
      '60% initial deposit, 40% balance before final handover',
      'Direct WhatsApp & enquiry capture built for mobile networks',
    ],
    ctaLabel: 'Get a Website',
    href: '/business-solutions',
    icon: Globe,
  },
  {
    id: 'automation',
    badge: 'Division 2 • Recurring Revenue',
    title: 'WhatsApp Business Automation',
    price: 'From ₦100,000 + Maintenance',
    description:
      'Compliant WhatsApp Business workflows for FAQs, service bookings, product catalogues, order capture, Paystack payment links, and staff alerts.',
    bullets: [
      'Basic Setup (₦100k) • Business Automation (₦180k) • Advanced (₦300k–₦500k)',
      'Monthly maintenance & monitoring: ₦20,000–₦50,000/mo',
      'Built with customer opt-in, opt-out & message audit records',
    ],
    ctaLabel: 'Automate My Business',
    href: '/business-automation',
    icon: MessageSquare,
  },
  {
    id: 'intelligence',
    badge: 'Division 3 • Data & Research',
    title: 'Business Intelligence & Research',
    price: 'From ₦25,000 per Report',
    description:
      'Verified Nigerian market snapshots, competitor intelligence, price monitoring, location intelligence, and structured Excel + PDF analysis.',
    bullets: [
      'Market Snapshot (₦25k) • Opportunity Report (₦40k–₦60k) • Competitor Intel (₦75k–₦150k)',
      'Delivered as structured Excel (.xlsx) workbooks + executive PDF reports',
      'Transparent public sources, collection dates & limitations',
    ],
    ctaLabel: 'Request a Business Report',
    href: '/business-intelligence',
    icon: BarChart3,
  },
];

export default function HomePage() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [interest, setInterest] = useState('Get a Business Website (Division 1)');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          businessName,
          phone: whatsapp,
          service: interest,
          source: 'homepage_ad_landing',
        }),
      }).catch(() => {});
    } finally {
      setSubmitted(true);
    }

    const msg = `Hello ${BRAND_IDENTITY.companyName}! My name is ${name}${
      businessName ? ` (${businessName})` : ''
    }. I am interested in: ${interest}. My WhatsApp number is ${whatsapp}.`;
    window.open(
      `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const directWaLink = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I would like to get started with a website, WhatsApp automation, or business report.`
  )}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-20 sm:pb-0">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
        {/* Hero Section (Under 10-Second Clarity) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{BRAND_IDENTITY.companyName} • {BRAND_IDENTITY.cacReg}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Build a Stronger Business with Digital Solutions, Automation and Market Intelligence.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              We help Nigerian SMEs and growing companies launch credible websites, automate customer enquiries on WhatsApp, and make confident decisions with verified market research.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/business-solutions"
                className="px-5 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-sm transition inline-flex items-center gap-2"
              >
                <span>Get a Website</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/business-automation"
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition inline-flex items-center gap-2"
              >
                <span>Automate My Business</span>
              </Link>
              <Link
                href="/business-intelligence"
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition inline-flex items-center gap-2"
              >
                <span>Request a Business Report</span>
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>60% Deposit / 40% Before Handover</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>Paystack &amp; Moniepoint ({BRAND_IDENTITY.settlementAccountNumber})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Fast Nigerian Mobile Load Times</span>
              </span>
            </div>
          </div>

          {/* Ad-Ready Instant Enquiry Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-[#d4af37]/30 shadow-2xl space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Request a Fast Quote or Preview</h2>
                <p className="text-xs text-slate-400 mt-1">
                  No account registration required. Tell us what you need and connect directly with our desk on WhatsApp.
                </p>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-sm">
                  <div className="font-bold text-emerald-400">Enquiry Ready!</div>
                  <p className="text-xs text-slate-300">
                    If WhatsApp did not open automatically, tap below to send your request directly to {BRAND_IDENTITY.whatsappDisplay}.
                  </p>
                  <a
                    href={directWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleQuickEnquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Business Name (e.g. Zenith Solar Ikeja)"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Number (e.g. 0803...)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500"
                  />
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    aria-label="Service Needed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    <option>Get a Business Website (Division 1)</option>
                    <option>WhatsApp Business Automation (Division 2)</option>
                    <option>Market Research / Competitor Report (Division 3)</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Get Quote on WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Three Commercial Divisions */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Three Focused Commercial Divisions</h2>
            <p className="text-sm text-slate-400">
              Clear scope, transparent Naira pricing, verified payment handling, and reliable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIVISIONS.map((div) => {
              const Icon = div.icon;
              return (
                <div
                  key={div.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-[#d4af37]/50 transition"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      <Icon className="w-4 h-4" />
                      <span>{div.badge}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{div.title}</h3>
                    <div className="text-sm font-bold text-emerald-400">{div.price}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{div.description}</p>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      {div.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={div.href}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#d4af37] hover:text-[#070b14] text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <span>{div.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment & Governance Strip */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#d4af37]" />
              <span>Paystack Primary Checkout</span>
            </div>
            <p className="text-xs text-slate-400">
              All card and online payments are verified server-side with Paystack before any project onboarding begins.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Corporate Transfer</span>
            </div>
            <p className="text-xs text-slate-400">
              {BRAND_IDENTITY.settlementBank} ({BRAND_IDENTITY.settlementAccountNumber} — {BRAND_IDENTITY.settlementAccountName}), reconciled by our admin desk.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Client Approval Before Handover</span>
            </div>
            <p className="text-xs text-slate-400">
              Website and automation clients review their build on staging before settling the 40% handover balance.
            </p>
          </div>
        </section>
      </main>

      {/* Sticky Mobile WhatsApp Bar for Ad Traffic */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 border-t border-slate-800 px-4 py-3 flex items-center gap-2 backdrop-blur-lg">
        <Link
          href="/business-solutions"
          className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-[#070b14] font-bold text-xs text-center"
        >
          Get a Website
        </Link>
        <a
          href={directWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Us</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
