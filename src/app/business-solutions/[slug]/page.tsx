'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BusinessSolutionsEnquiryForm from '@/components/commerce/BusinessSolutionsEnquiryForm';
import ServiceCheckoutBox from '@/components/commerce/ServiceCheckoutBox';
import { BRAND_IDENTITY } from '@/lib/commerce/brandIdentity';
import { getServiceDefinitionBySlug, SERVICE_DEFINITIONS } from '@/lib/commerce/servicesCatalog';
import type { CommercialProduct } from '@/lib/commerce/catalog';
import type { PortfolioEntry } from '@/lib/commerce/enquiries';
import { trackConversionEvent } from '@/lib/commerce/googleTracking';

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || '');
  const service = getServiceDefinitionBySlug(slug);
  const enquiryRef = useRef<HTMLDivElement>(null);

  const [packages, setPackages] = useState<CommercialProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CommercialProduct | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!service) return;
    trackConversionEvent('view_service', {
      service_key: service.serviceKey,
      service_title: service.title,
      currency: 'NGN',
    });

    setLoading(true);
    Promise.all([
      fetch(`/api/commerce/products?serviceKey=${encodeURIComponent(service.serviceKey)}`)
        .then((r) => r.json())
        .catch(() => ({})),
      fetch('/api/commerce/portfolio')
        .then((r) => r.json())
        .catch(() => ({})),
    ]).then(([prodData, portData]) => {
      if (prodData?.success && Array.isArray(prodData.products)) {
        setPackages(prodData.products);
        setSelectedProduct(prodData.products[0] || null);
      }
      if (portData?.success && Array.isArray(portData.items)) {
        setPortfolio(portData.items);
      }
      setLoading(false);
    });
  }, [service?.slug]);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100">
        <Navbar />
        <main className="pt-32 pb-24 px-4 max-w-3xl mx-auto text-center space-y-5">
          <h1 className="text-3xl font-black text-white">Service Not Found</h1>
          <p className="text-sm text-slate-400">
            Please choose one of our 6 core business solutions below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {SERVICE_DEFINITIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/business-solutions/${s.slug}`}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#d4af37]/50 text-sm font-bold text-white"
              >
                {s.title} &rarr;
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const waUrl = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I would like to discuss ${service.title} for my business.`
  )}`;

  const scrollToEnquiry = () => {
    enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-24 sm:pb-0">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        {/* Breadcrumb & Service Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/business-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Business Solutions</span>
          </Link>

          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {SERVICE_DEFINITIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/business-solutions/${s.slug}`}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  s.slug === service.slug
                    ? 'bg-[#d4af37] border-[#d4af37] text-[#070b14] font-black'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                {s.shortTitle}
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="space-y-5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{service.title} &bull; {BRAND_IDENTITY.cacReg}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
            {service.headline}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {service.summary}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                trackConversionEvent('cta_click', { cta: 'service_hero_enquire', service: service.title });
                scrollToEnquiry();
              }}
              className="px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm inline-flex items-center justify-center gap-2 transition"
            >
              <span>{service.ctaLabel.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackConversionEvent('click_whatsapp', { cta: 'service_hero_whatsapp', service: service.title })
              }
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>TALK TO A CONSULTANT ON WHATSAPP</span>
            </a>
          </div>
        </section>

        {/* Problem Solved & What You Receive */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              The Business Problem
            </div>
            <h2 className="text-xl font-black text-white">Why Businesses Need This</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{service.problemSolved}</p>
            {service.complianceNote && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{service.complianceNote}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              What You Receive
            </div>
            <h2 className="text-xl font-black text-white">Key Capabilities &amp; Deliverables</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
              {service.features.map((f, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.howItWorks.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-900 border border-[#d4af37]/30 space-y-2"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-black">
                  STEP {step.step}
                </span>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Packages & Checkout */}
        <section id="pricing" className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Packages &amp; Transparent Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              All prices, deliverables, timelines, and recurring charges are managed live and shown clearly before payment.
            </p>
          </div>

          {loading ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
              Loading current packages...
            </div>
          ) : packages.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-300">
              Pricing is tailored to your scope. Please request a custom quote below.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-4">
                {packages.map((pkg) => {
                  const isSelected = selectedProduct?.id === pkg.id;
                  const isCustom = pkg.pricingMode === 'custom_quote' || pkg.priceNgn <= 0;
                  const hasPromo =
                    Boolean(pkg.promoPriceNgn) &&
                    Number(pkg.promoPriceNgn) > 0 &&
                    Number(pkg.promoPriceNgn) < pkg.priceNgn;
                  const activePrice = hasPromo ? Number(pkg.promoPriceNgn) : pkg.priceNgn;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedProduct(pkg);
                        trackConversionEvent('view_package', { package_id: pkg.id, package_name: pkg.name });
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 ${
                        isSelected
                          ? 'bg-slate-900 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-black text-white">{pkg.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Turnaround: {pkg.turnaroundTime}</p>
                        </div>
                        <div className="text-right">
                          {isCustom ? (
                            <span className="inline-block px-3 py-1 rounded-lg bg-[#d4af37]/15 text-[#d4af37] text-xs font-bold">
                              Request a Custom Quote
                            </span>
                          ) : (
                            <>
                              {hasPromo && (
                                <div className="text-xs text-slate-400 line-through">
                                  ₦{pkg.priceNgn.toLocaleString()}
                                </div>
                              )}
                              <div className="text-xl font-black text-[#d4af37]">
                                {pkg.pricingMode === 'starting_from' ? 'From ' : ''}₦
                                {activePrice.toLocaleString()}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>
                      {pkg.monthlyMaintenanceNgn > 0 && (
                        <div className="text-[11px] text-amber-300 font-semibold">
                          Recurring Maintenance/Usage: ₦{pkg.monthlyMaintenanceNgn.toLocaleString()}/month
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-6">
                {selectedProduct && (
                  <ServiceCheckoutBox
                    product={selectedProduct}
                    onRequestCustomQuote={scrollToEnquiry}
                  />
                )}
              </div>
            </div>
          )}
        </section>

        {/* Genuine Samples / Portfolio */}
        {portfolio.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-black text-white">Live Demonstrations &amp; Samples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#d4af37] uppercase">{item.category}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.projectType === 'completed_client'
                        ? 'Completed Client Project'
                        : 'Demonstration Project'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300">{item.description}</p>
                  <Link
                    href={item.liveUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inspect Live Sample</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="space-y-5">
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-[#d4af37]">{f.q}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enquiry Form */}
        <section
          ref={enquiryRef}
          id="enquiry-form"
          className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 border-t-2 border-t-[#d4af37] space-y-5"
        >
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black text-white">
              Request {service.title} Consultation or Quote
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete this short form to receive a unique enquiry reference and speak with our team.
            </p>
          </div>
          <BusinessSolutionsEnquiryForm
            defaultServiceTitle={service.title}
            defaultPackageName={selectedProduct?.name}
            sourceTag={`service_page_${service.serviceKey}`}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
