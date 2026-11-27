'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  CreditCard,
  Building2,
  X,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import {
  BRAND_IDENTITY,
  DEFAULT_COMMERCIAL_CATALOG,
  type CommercialDivision,
  type CommercialProduct,
} from '@/lib/commerce/catalog';

export interface DivisionConfig {
  division: CommercialDivision;
  badge: string;
  headline: string;
  subheadline: string;
  problemTitle: string;
  problems: string[];
  solutionTitle: string;
  solutions: string[];
  demoTitle: string;
  demoDescription: string;
  demoPoints: string[];
  demoCtaLabel: string;
  demoCtaHref: string;
  faqs: { q: string; a: string }[];
}

export default function DivisionFunnelPage({ config }: { config: DivisionConfig }) {
  const [products, setProducts] = useState<CommercialProduct[]>(() =>
    DEFAULT_COMMERCIAL_CATALOG.filter((p) => p.division === config.division && p.active)
  );
  const [selectedProduct, setSelectedProduct] = useState<CommercialProduct | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'paystack' | 'moniepoint'>('paystack');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/commerce/products?division=${encodeURIComponent(config.division)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, [config.division]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);
    setCheckoutError(null);
    setCheckoutResult(null);

    try {
      const res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          customerName,
          customerEmail,
          customerWhatsapp,
          companyName,
          paymentProvider,
          paymentStage: selectedProduct.depositPercent === 100 ? 'full' : 'deposit',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Checkout could not be initialized');
      }

      if (data.provider === 'paystack' && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      setCheckoutResult(data);
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to start checkout');
    } finally {
      setSubmitting(false);
    }
  };

  const waHref = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I am interested in ${config.badge}. Please share next steps.`
  )}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{config.badge} • {BRAND_IDENTITY.cacReg}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {config.headline}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{config.subheadline}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#packages"
              className="px-6 py-3 rounded-xl bg-[#d4af37] text-[#070b14] font-bold text-sm hover:bg-[#e5c158] transition inline-flex items-center gap-2"
            >
              <span>View Packages & Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({BRAND_IDENTITY.whatsappDisplay})</span>
            </a>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-rose-500/20 space-y-4">
            <h2 className="text-lg font-bold text-rose-300">{config.problemTitle}</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {config.problems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-4">
            <h2 className="text-lg font-bold text-emerald-300">{config.solutionTitle}</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {config.solutions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Packages & Pricing */}
        <section id="packages" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Packages, Deliverables & Pricing</h2>
            <p className="text-sm text-slate-400">
              Paystack instant checkout or verified Moniepoint corporate transfer ({BRAND_IDENTITY.settlementAccountNumber}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const depositNgn = Math.round((product.priceNgn * product.depositPercent) / 100);
              return (
                <div
                  key={product.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-[#d4af37]/50 transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1 text-[#d4af37] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {product.turnaroundTime}
                      </span>
                      <span>{product.depositPercent}% Deposit</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <div className="space-y-1">
                      <div className="text-2xl font-black text-[#d4af37]">
                        ₦{product.priceNgn.toLocaleString()}
                        {product.priceMaxNgn ? ` – ₦${product.priceMaxNgn.toLocaleString()}` : ''}
                      </div>
                      {product.monthlyMaintenanceNgn > 0 && (
                        <div className="text-xs text-emerald-400 font-semibold">
                          + ₦{product.monthlyMaintenanceNgn.toLocaleString()}/month maintenance
                        </div>
                      )}
                      {product.depositPercent < 100 && (
                        <div className="text-xs text-slate-400">
                          Start with ₦{depositNgn.toLocaleString()} ({product.depositPercent}% deposit), pay{' '}
                          {100 - product.depositPercent}% before handover.
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      {product.deliverables.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    {product.dataSources && (
                      <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div>
                          <strong className="text-slate-300">Data Sources:</strong> {product.dataSources}
                        </div>
                        {product.limitations && (
                          <div>
                            <strong className="text-slate-300">Limitations:</strong> {product.limitations}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setCheckoutResult(null);
                        setCheckoutError(null);
                      }}
                      className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-sm transition"
                    >
                      Start Order (₦{depositNgn.toLocaleString()})
                    </button>
                    <a
                      href={`https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
                        `Hello Bethelmind! I want to request a quote for "${product.name}" (₦${product.priceNgn.toLocaleString()}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Request Custom Quote on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Demonstration / Example */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-[#d4af37]/30 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{config.demoTitle}</h2>
          <p className="text-sm text-slate-300 max-w-3xl">{config.demoDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {config.demoPoints.map((pt, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                {pt}
              </div>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href={config.demoCtaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition"
            >
              <span>{config.demoCtaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-start gap-2 text-sm font-bold text-white">
                  <HelpCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{f.q}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                {BRAND_IDENTITY.companyName}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedProduct.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Due now: ₦
                {Math.round((selectedProduct.priceNgn * selectedProduct.depositPercent) / 100).toLocaleString()} (
                {selectedProduct.depositPercent}%{' '}
                {selectedProduct.depositPercent === 100 ? 'full payment' : 'initial deposit'})
              </p>
            </div>

            {checkoutResult ? (
              <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-sm">
                <div className="font-bold text-emerald-400">Order Reference: {checkoutResult.orderReference}</div>
                <p className="text-xs text-slate-300">{checkoutResult.message}</p>
                {checkoutResult.bankDetails && (
                  <div className="text-xs space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>Bank: <strong>{checkoutResult.bankDetails.bankName}</strong></div>
                    <div>Account Number: <strong>{checkoutResult.bankDetails.accountNumber}</strong></div>
                    <div>Account Name: <strong>{checkoutResult.bankDetails.accountName}</strong></div>
                    <div>Amount: <strong>₦{checkoutResult.amountDueNgn?.toLocaleString()}</strong></div>
                  </div>
                )}
                <a
                  href={`https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Bethelmind! I transferred ₦${checkoutResult.amountDueNgn?.toLocaleString()} for Order ${checkoutResult.orderReference}. Here is my receipt for verification.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Transfer Receipt on WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Business Email Address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Number (e.g. 0803...)"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Business / Company Name (Optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('paystack')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentProvider === 'paystack'
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Paystack</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('moniepoint')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentProvider === 'moniepoint'
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Moniepoint Transfer</span>
                  </button>
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    {checkoutError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {paymentProvider === 'paystack' ? 'Proceed to Paystack Checkout' : 'Generate Moniepoint Order Reference'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
