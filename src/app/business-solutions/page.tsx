'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  ExternalLink,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { BRAND_IDENTITY } from '@/lib/commerce/brandIdentity';
import { getStoredAttribution, trackConversionEvent } from '@/lib/commerce/googleTracking';
import type { PortfolioEntry } from '@/lib/commerce/enquiries';

interface WebsitePackage {
  id: string;
  name: string;
  priceRangeLabel: string;
  startingPriceNgn: number;
  maxPriceNgn?: number;
  highlight?: boolean;
  summary: string;
  deliverables: string[];
  scopeNotes: string;
}

const WEBSITE_PACKAGES: WebsitePackage[] = [
  {
    id: 'dbs-business-launch',
    name: 'BUSINESS LAUNCH',
    priceRangeLabel: '₦80,000–₦120,000',
    startingPriceNgn: 80000,
    maxPriceNgn: 120000,
    summary:
      'Clean, mobile-friendly business landing page with WhatsApp integration, enquiry capture, and Google visibility setup.',
    deliverables: [
      'Mobile-responsive business website / landing page',
      'Direct WhatsApp click-to-chat & enquiry capture form',
      'Core service showcase & business contact details',
      'Google Search indexing & visibility setup',
      'Staging preview for your review before final handover',
    ],
    scopeNotes: 'Scope, domain/hosting terms, and revision rounds are documented before work starts.',
  },
  {
    id: 'dbs-professional-website',
    name: 'PROFESSIONAL BUSINESS WEBSITE',
    priceRangeLabel: '₦150,000–₦250,000',
    startingPriceNgn: 150000,
    maxPriceNgn: 250000,
    highlight: true,
    summary:
      'Multi-page corporate website with structured enquiry/booking workflows, custom domain setup, and WhatsApp integration.',
    deliverables: [
      'Multi-page mobile-first corporate website',
      'Structured booking & customer enquiry capture',
      'Website & WhatsApp Business integration',
      'Custom domain & SSL configuration',
      'Client staging review & agreed revision pass before handover',
    ],
    scopeNotes: 'Ideal for clinics, solar firms, realtors, logistics, schools, and growing SMEs.',
  },
  {
    id: 'dbs-advanced-website',
    name: 'ADVANCED BUSINESS WEBSITE',
    priceRangeLabel: '₦300,000+',
    startingPriceNgn: 300000,
    summary:
      'Custom business web platform with Paystack online checkout, interactive calculators, client portals, and documented support.',
    deliverables: [
      'Custom multi-section web application & client portal',
      'Paystack checkout & verified transfer workflow',
      'Interactive sector quotation or booking calculator',
      'Staff handover walkthrough & documentation',
      'Staging approval before final 40% balance & launch',
    ],
    scopeNotes: 'Final quote depends on custom integrations and agreed feature scope.',
  },
];

export default function BusinessSolutionsPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const formStartedRef = useRef(false);

  // Enquiry Form State
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('dbs-business-launch');
  const [agreedPriceNgn, setAgreedPriceNgn] = useState(80000);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<{
    id: string;
    whatsappUrl: string;
    packageName: string;
  } | null>(null);

  // Portfolio & Checkout State
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState<string | null>(null);

  const activePackage = WEBSITE_PACKAGES.find((p) => p.id === selectedPackageId) || WEBSITE_PACKAGES[0];
  const calculatedDepositNgn = Math.round(agreedPriceNgn * 0.6);
  const calculatedBalanceNgn = Math.max(0, agreedPriceNgn - calculatedDepositNgn);

  useEffect(() => {
    trackConversionEvent('view_service', {
      service_division: 'digital_business_solutions',
      currency: 'NGN',
    });

    fetch('/api/commerce/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.items)) setPortfolio(d.items);
      })
      .catch(() => {});
  }, []);

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackConversionEvent('form_start', { form_name: 'business_website_consultation' });
    }
  };

  const handleChoosePackage = (pkg: WebsitePackage) => {
    setSelectedPackageId(pkg.id);
    setAgreedPriceNgn(pkg.startingPriceNgn);
    trackConversionEvent('view_package', {
      package_id: pkg.id,
      package_name: pkg.name,
      starting_price_ngn: pkg.startingPriceNgn,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const buildWhatsAppUrl = (pkgName: string) => {
    const msg = `Hello ${BRAND_IDENTITY.companyName}! My name is ${fullName}${
      businessName ? ` (${businessName})` : ''
    }. I am interested in ${pkgName} (Estimated budget: ₦${agreedPriceNgn.toLocaleString()}, 60% initial deposit: ₦${calculatedDepositNgn.toLocaleString()}). My WhatsApp number is ${whatsappNumber}.`;
    return `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const attr = getStoredAttribution();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          whatsapp: whatsappNumber,
          businessName,
          selectedService: 'Business Website Development',
          selectedPackage: `${activePackage.name} (${activePackage.priceRangeLabel})`,
          agreedPriceNgn,
          source: 'google_ads_business_solutions',
          gclid: attr.gclid,
          gbraid: attr.gbraid,
          wbraid: attr.wbraid,
          utmCampaign: attr.utm_campaign,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Please check your details and try again.');
      }

      // Only fire generate_lead after server confirms lead submission
      trackConversionEvent(
        'generate_lead',
        {
          lead_id: data.enquiryId,
          service: 'Business Website Development',
          package: activePackage.name,
          value: calculatedDepositNgn,
          currency: 'NGN',
        },
        {
          dedupeKey: `lead-${data.enquiryId}`,
          userData: { phone_number: whatsappNumber },
        }
      );

      const waUrl = buildWhatsAppUrl(activePackage.name);
      setSubmittedEnquiry({
        id: data.enquiryId,
        whatsappUrl: waUrl,
        packageName: activePackage.name,
      });

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setFormError(err.message || 'Unable to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaystackDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutErr(null);
    setCheckoutBusy(true);
    try {
      trackConversionEvent('begin_checkout', {
        package_id: activePackage.id,
        value: calculatedDepositNgn,
        currency: 'NGN',
      });

      const res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activePackage.id,
          customerName: fullName || 'Website Client',
          customerEmail: checkoutEmail,
          customerWhatsapp: whatsappNumber,
          companyName: businessName,
          paymentProvider: 'paystack',
          paymentStage: 'deposit',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.authorizationUrl) {
        throw new Error(data.error || 'Paystack checkout could not be initialized.');
      }
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      setCheckoutErr(err.message);
    } finally {
      setCheckoutBusy(false);
    }
  };

  const directWaUrl = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I want a professional website for my business.`
  )}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24 sm:pb-0 relative overflow-x-hidden">
      {/* Subtle CSS-only radial glow (zero JS overhead) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_65%)]"
      />
      <Navbar />

      <main className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
        {/* SECTION 3 & 4: HERO + ABOVE-THE-FOLD CONSULTATION CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] text-xs font-bold uppercase tracking-wider shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CAC Registered Business ({BRAND_IDENTITY.cacReg})</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Your Business Deserves a Professional Website That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f6e6a5]">
                Wins Customer Trust.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Get a modern, mobile-friendly business website with WhatsApp integration, customer enquiry capture and Google visibility setup.
            </p>
            <div className="p-3.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-sm text-[#f3e4b0] font-medium leading-relaxed">
              Transparent pricing from <strong className="text-white">₦80,000</strong>. Pay <strong className="text-white">60%</strong> to get started and the remaining <strong className="text-white">40%</strong> after reviewing and approving your website.
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
              <a
                href="#consultation-form"
                onClick={() => trackConversionEvent('click_whatsapp', { cta: 'hero_get_my_business_website' })}
                className="px-6 py-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm shadow-lg shadow-[#d4af37]/20 transition inline-flex items-center justify-center gap-2"
              >
                <span>GET MY BUSINESS WEBSITE</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#packages"
                className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition inline-flex items-center justify-center"
              >
                VIEW WEBSITE PACKAGES
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
              {[
                'CAC Registered Business (9912717)',
                'Transparent Project Pricing (From ₦80,000)',
                '60% Deposit / 40% Before Handover',
                'Secure Paystack Checkout',
                'Client Review Before Final Handover',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900/50 border border-slate-800/80 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Above-the-Fold Consultation Form */}
          <div ref={formRef} id="consultation-form" className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/95 border border-slate-700/80 border-t-2 border-t-[#d4af37] shadow-2xl shadow-black/60 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-800">
                <span className="text-[#d4af37]">Step 1: Quick Details</span>
                <span>&rarr;</span>
                <span>Step 2: Direct WhatsApp Review</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Request Your Website Consultation</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Starting from ₦80,000 &bull; Selected: <strong className="text-[#d4af37]">{activePackage.name}</strong>
                </p>
              </div>

              {submittedEnquiry ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-sm">
                  <div className="font-bold text-emerald-400">
                    Enquiry Recorded (Ref: {submittedEnquiry.id})
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Thank you, <strong>{fullName}</strong>. Your details for <strong>{submittedEnquiry.packageName}</strong> are saved. If WhatsApp did not open automatically, tap below to continue directly with our team.
                  </p>
                  <a
                    href={submittedEnquiry.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversionEvent('click_whatsapp', { cta: 'enquiry_fallback' })}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp ({BRAND_IDENTITY.whatsappDisplay})</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedEnquiry(null)}
                    className="w-full text-xs text-slate-400 hover:text-white underline"
                  >
                    Edit or submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} onFocus={handleFormFocus} className="space-y-3">
                  <div>
                    <label htmlFor="fullName" className="block text-xs text-slate-400 mb-1">Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Adebayo Ogunleye"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="waNumber" className="block text-xs text-slate-400 mb-1">WhatsApp Number *</label>
                    <input
                      id="waNumber"
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="bizName" className="block text-xs text-slate-400 mb-1">Business Name (Optional)</label>
                    <input
                      id="bizName"
                      type="text"
                      placeholder="e.g. Prime Solar Ikeja"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="pkgSelect" className="block text-xs text-slate-400 mb-1">Service / Package Required *</label>
                    <select
                      id="pkgSelect"
                      value={selectedPackageId}
                      onChange={(e) => {
                        const pkg = WEBSITE_PACKAGES.find((p) => p.id === e.target.value);
                        setSelectedPackageId(e.target.value);
                        if (pkg) setAgreedPriceNgn(pkg.startingPriceNgn);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    >
                      {WEBSITE_PACKAGES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.priceRangeLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>GET MY FREE CONSULTATION</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    No obligation. No registration. Speak directly with our team.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: WEBSITE PACKAGES & DYNAMIC 60/40 CALCULATOR */}
        <section id="packages" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Website Packages &amp; Transparent Pricing</h2>
            <p className="text-sm sm:text-base text-[#d4af37] font-semibold">
              Start with 60% deposit. Review your website before final payment. Pay the remaining 40% before final handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WEBSITE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition ${
                  pkg.highlight
                    ? 'bg-slate-900 border-[#d4af37] shadow-xl shadow-[#d4af37]/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  {pkg.highlight && (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                      Most Selected by Growing SMEs
                    </span>
                  )}
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <div className="text-2xl font-black text-[#d4af37]">{pkg.priceRangeLabel}</div>
                  <p className="text-xs text-slate-400">
                    60% initial deposit from ₦{Math.round(pkg.startingPriceNgn * 0.6).toLocaleString()} (calculated on your final agreed scope price).
                  </p>
                  <p className="text-sm text-slate-300">{pkg.summary}</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {pkg.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-400 italic">{pkg.scopeNotes}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleChoosePackage(pkg)}
                  className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-xs uppercase tracking-wider transition"
                >
                  CHOOSE THIS PACKAGE
                </button>
              </div>
            ))}
          </div>

          {/* Dynamic Deposit Calculator & Paystack Checkout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Dynamic 60% / 40% Deposit Calculator</h3>
              <p className="text-xs text-slate-400">
                Adjust to your agreed project price for <strong>{activePackage.name}</strong> to see the exact 60% initial deposit and 40% handover balance:
              </p>
              <div className="flex items-center gap-3">
                <label htmlFor="agreedPrice" className="text-xs text-slate-300 whitespace-nowrap">Agreed Price (₦):</label>
                <input
                  id="agreedPrice"
                  type="number"
                  min={80000}
                  step={5000}
                  value={agreedPriceNgn}
                  onChange={(e) => setAgreedPriceNgn(Math.max(80000, Number(e.target.value) || 80000))}
                  className="w-40 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">60% Initial Deposit</div>
                  <div className="text-lg font-black text-emerald-400">₦{calculatedDepositNgn.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">40% Before Handover</div>
                  <div className="text-lg font-black text-white">₦{calculatedBalanceNgn.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaystackDeposit} className="space-y-3 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Lock className="w-4 h-4 text-[#d4af37]" />
                <span>Ready to Start? Pay Deposit via Paystack</span>
              </div>
              <p className="text-xs text-slate-400">
                Server-side verified Paystack checkout for <strong>{activePackage.name}</strong>.
              </p>
              <input
                type="email"
                required
                placeholder="Your Email Address for Receipt"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
              {checkoutErr && (
                <div className="text-xs text-rose-300 bg-rose-500/10 p-2 rounded-lg">{checkoutErr}</div>
              )}
              <button
                type="submit"
                disabled={checkoutBusy}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                {checkoutBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>Pay 60% Deposit with Paystack</span>
              </button>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Or request an official Moniepoint corporate invoice via WhatsApp after consultation.</span>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 6: TRUST & OBJECTION-HANDLING */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              YOUR BUSINESS IS TOO IMPORTANT TO TAKE RISKS.
            </h2>
            <p className="text-sm text-slate-400">Clear answers before you commit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: 'HOW DO I KNOW BETHELMIND IS LEGITIMATE?',
                a: `Bethelmind Analytics & Digital Solutions is a CAC-registered Nigerian business (${BRAND_IDENTITY.cacReg}). Every project begins with documented scope, transparent Naira pricing, and direct communication with our team on ${BRAND_IDENTITY.whatsappDisplay}.`,
              },
              {
                q: 'DO I PAY EVERYTHING UPFRONT?',
                a: 'No. You start with a 60% initial deposit. The remaining 40% balance is paid only after you review and approve the completed website on staging, before final handover.',
              },
              {
                q: 'HOW LONG DOES WEBSITE DEVELOPMENT TAKE?',
                a: 'Delivery timelines depend on package complexity, agreed project requirements, and prompt receipt of your business materials (logo, service list, and photos). Exact target dates are confirmed in your project scope before deposit.',
              },
              {
                q: 'WHAT IF I NEED CHANGES?',
                a: 'Before final handover, you review your website on a staging link and submit revision feedback within the agreed scope so the final build meets your approval.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-[#d4af37]">{item.q}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          {/* 3-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { num: '01', title: 'Select & Discuss', text: 'Select your package and discuss your business requirements with our team.' },
              { num: '02', title: 'Scope & 60% Deposit', text: 'Approve the documented scope and pay the 60% initial deposit to start.' },
              { num: '03', title: 'Review & Handover', text: 'Review your website on staging, approve it, and complete the 40% balance before handover.' },
            ].map((step) => (
              <div key={step.num} className="p-5 rounded-2xl bg-slate-900 border border-[#d4af37]/30 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-black">
                  STEP {step.num}
                </span>
                <div className="text-sm font-bold text-white">{step.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: REAL PORTFOLIO & DEMONSTRATION PROJECTS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-white">Website Demonstrations &amp; Portfolio</h2>
              <p className="text-xs text-slate-400">
                Demonstration previews are clearly labelled separately from completed client projects.
              </p>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-[#d4af37] hover:underline">
              View All Showcases &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portfolio.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#d4af37] uppercase">{item.category}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.projectType === 'completed_client' ? 'Completed Client Project' : 'Demonstration Project'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300">{item.description}</p>
                <Link
                  href={item.liveUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Live Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Mobile Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 border-t border-slate-800 px-4 py-3 flex items-center gap-2 backdrop-blur-lg">
        <a
          href="#consultation-form"
          className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-[#070b14] font-black text-xs text-center"
        >
          GET A WEBSITE
        </a>
        <a
          href={directWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversionEvent('click_whatsapp', { cta: 'sticky_mobile_bar' })}
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WHATSAPP US</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
