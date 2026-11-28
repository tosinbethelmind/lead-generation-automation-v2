'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { BRAND_IDENTITY, DEFAULT_COMMERCIAL_CATALOG, type CommercialProduct } from '@/lib/commerce/brandIdentity';
import { getStoredAttribution, trackConversionEvent } from '@/lib/commerce/googleTracking';

export interface FlagshipProductSpec {
  productId: string;
  badge: string;
  headline: string;
  subheadline: string;
  targetCustomer: string[];
  problemsSolved: string[];
  benefits: string[];
  implementationScope: string[];
  exclusions: string[];
  onboardingSteps: string[];
  trainingAndSupport: string[];
  optionalAddOns: Array<{ name: string; note: string }>;
  demoTitle: string;
  demoRows: Array<{ label: string; metric: string; status: string }>;
}

export default function FlagshipProductPage({ spec }: { spec: FlagshipProductSpec }) {
  const fallbackProduct =
    DEFAULT_COMMERCIAL_CATALOG.find((p) => p.id === spec.productId) || DEFAULT_COMMERCIAL_CATALOG[0];

  const [product, setProduct] = useState<CommercialProduct>(fallbackProduct);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const [checkoutProvider, setCheckoutProvider] = useState<'moniepoint' | 'paystack'>('moniepoint');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState<string | null>(null);
  const [moniepointOrder, setMoniepointOrder] = useState<any>(null);

  useEffect(() => {
    trackConversionEvent('view_service', {
      service_division: product.division,
      product_id: spec.productId,
    });
    fetch('/api/commerce/products')
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.products)) {
          const live = d.products.find((p: CommercialProduct) => p.id === spec.productId);
          if (live) setProduct(live);
        }
      })
      .catch(() => {});
  }, [spec.productId]);

  const depositNgn = Math.round((product.priceNgn * (product.depositPercent || 60)) / 100);
  const balanceNgn = Math.max(0, product.priceNgn - depositNgn);

  const directWaUrl = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I would like a demonstration & assessment for ${product.name}.`
  )}`;

  const handleDemoSubmit = async (e: React.FormEvent) => {
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
          whatsapp,
          businessName,
          email,
          selectedService: product.name,
          selectedPackage: `${product.name} (Setup from ₦${product.priceNgn.toLocaleString()})`,
          agreedPriceNgn: product.priceNgn,
          message: notes,
          source: `flagship_${spec.productId}`,
          gclid: attr.gclid,
          utmCampaign: attr.utm_campaign,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not submit demonstration request.');
      }
      trackConversionEvent('generate_lead', {
        service_name: product.name,
        value: product.priceNgn,
        currency: 'NGN',
      });
      setSubmittedRef(data.enquiryId);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutErr(null);
    setCheckoutBusy(true);
    setMoniepointOrder(null);
    trackConversionEvent('begin_checkout', {
      package_id: product.id,
      value: depositNgn,
      currency: 'NGN',
    });
    try {
      const res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: fullName || 'SME Client',
          customerEmail: email,
          customerWhatsapp: whatsapp,
          companyName: businessName,
          paymentProvider: checkoutProvider,
          paymentStage: 'deposit',
        }),
      });
      const data = await res.json();
      if ((!res.ok || !data.success) && checkoutProvider === 'paystack') {
        const fbRes = await fetch('/api/commerce/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            customerName: fullName || 'SME Client',
            customerEmail: email,
            customerWhatsapp: whatsapp,
            companyName: businessName,
            paymentProvider: 'moniepoint',
            paymentStage: 'deposit',
          }),
        });
        const fbData = await fbRes.json();
        if (fbRes.ok && fbData.success) {
          setMoniepointOrder(fbData);
          return;
        }
      }
      if (!res.ok || !data.success) throw new Error(data.error || 'Checkout failed.');
      if (data.provider === 'paystack' && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      setMoniepointOrder(data);
    } catch (err: any) {
      setCheckoutErr(err.message);
    } finally {
      setCheckoutBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div>
          <Link
            href="/business-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Business Solutions Hub</span>
          </Link>
        </div>

        {/* Hero */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{spec.badge} &bull; {BRAND_IDENTITY.cacReg}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-[1.1]">
            {spec.headline}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {spec.subheadline}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-[#d4af37]/30">
              <div className="text-slate-400">Setup Fee (Admin-Editable)</div>
              <div className="text-xl font-black text-[#d4af37]">
                From ₦{product.priceNgn.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {product.depositPercent || 60}% deposit (₦{depositNgn.toLocaleString()}) / Balance ₦{balanceNgn.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Monthly Maintenance</div>
              <div className="text-xl font-black text-white">
                ₦{(product.monthlyMaintenanceNgn || 0).toLocaleString()}/mo
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Monitoring, updates &amp; support</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Implementation Timeline</div>
              <div className="text-xl font-black text-emerald-400">{product.turnaroundTime}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Structured onboarding &amp; training</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#demo-request"
              className="px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm inline-flex items-center gap-2"
            >
              <span>REQUEST A DEMONSTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversionEvent('click_whatsapp', { cta: `flagship_${spec.productId}` })}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP ASSESSMENT ({BRAND_IDENTITY.whatsappDisplay})</span>
            </a>
          </div>
        </section>

        {/* Demonstration Data Preview */}
        <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>{spec.demoTitle}</span>
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase">
              Demonstration Data Only
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spec.demoRows.map((row, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">{row.label}</div>
                <div className="text-lg font-black text-white">{row.metric}</div>
                <div className="text-[11px] font-semibold text-emerald-400">{row.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Productisation Matrix: Target Customer, Problems, Benefits, Deliverables, Scope, Exclusions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-lg font-black text-[#d4af37]">Who It Is Built For &amp; Problems Solved</h2>
            <div className="text-xs font-bold uppercase text-slate-400">Target Customers</div>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {spec.targetCustomer.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs font-bold uppercase text-slate-400 pt-2">Operational Problems Addressed</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {spec.problemsSolved.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-lg font-black text-white">Features, Scope &amp; Exclusions</h2>
            <div className="text-xs font-bold uppercase text-slate-400">Included Capabilities</div>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {product.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs font-bold uppercase text-slate-400 pt-2">Explicit Exclusions</div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {spec.exclusions.map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-lg font-black text-white">Onboarding, Training &amp; Support Policy</h2>
            <div className="text-xs font-bold uppercase text-slate-400">Onboarding Workflow</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {spec.onboardingSteps.map((s, i) => (
                <li key={i}>{i + 1}. {s}</li>
              ))}
            </ul>
            <div className="text-xs font-bold uppercase text-slate-400 pt-2">Training &amp; Support</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {spec.trainingAndSupport.map((t, i) => (
                <li key={i}>&bull; {t}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-lg font-black text-white">Optional Add-Ons &amp; Benefits</h2>
            <ul className="space-y-2 text-xs text-slate-200">
              {spec.optionalAddOns.map((ao, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-[#d4af37]">{ao.name}:</strong> {ao.note}
                </li>
              ))}
            </ul>
            <div className="text-xs font-bold uppercase text-slate-400 pt-2">Practical Business Benefits</div>
            <ul className="space-y-1 text-xs text-slate-300">
              {spec.benefits.map((b, i) => (
                <li key={i}>&bull; {b}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Demo Request & Onboarding Checkout */}
        <section id="demo-request" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-white">Request a Demonstration &amp; Assessment</h2>
            {submittedRef ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                <div className="font-bold text-emerald-400">Request Saved (Ref: {submittedRef})</div>
                <p className="text-slate-300">Our implementation team will review your requirements and contact you via WhatsApp.</p>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue on WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Number (e.g. 0803 123 4567) *"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Current workflow / branches / staff size..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                {formError && <div className="text-xs text-rose-300">{formError}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>REQUEST FREE DEMO &amp; QUOTATION</span>
                </button>
              </form>
            )}
          </div>

          <form onSubmit={handleDepositCheckout} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <Lock className="w-4 h-4 text-[#d4af37]" />
              <span>Start Onboarding ({product.depositPercent || 60}% Deposit: ₦{depositNgn.toLocaleString()})</span>
            </div>
            <p className="text-xs text-slate-400">
              Official Parent Account: {BRAND_IDENTITY.settlementBank} ({BRAND_IDENTITY.settlementAccountNumber} — {BRAND_IDENTITY.settlementAccountName} &bull; {BRAND_IDENTITY.cacReg}).
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCheckoutProvider('moniepoint')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  checkoutProvider === 'moniepoint'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Moniepoint</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutProvider('paystack')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  checkoutProvider === 'paystack'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Paystack</span>
              </button>
            </div>
            {moniepointOrder ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="font-bold text-emerald-400">Order Ref: {moniepointOrder.orderReference}</div>
                <div>Transfer <strong>₦{moniepointOrder.amountDueNgn?.toLocaleString()}</strong> to {BRAND_IDENTITY.settlementBank} — <strong>{BRAND_IDENTITY.settlementAccountNumber}</strong></div>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Work Email for Receipt & Invoice *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                {checkoutErr && <div className="text-xs text-rose-300">{checkoutErr}</div>}
                <button
                  type="submit"
                  disabled={checkoutBusy}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {checkoutBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{checkoutProvider === 'moniepoint' ? 'Generate Moniepoint Deposit Reference' : 'Pay Deposit via Paystack'}</span>
                </button>
              </>
            )}
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
