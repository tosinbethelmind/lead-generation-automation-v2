'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Globe,
  Bot,
  MapPin,
  Users,
  BarChart3,
  Briefcase,
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import BusinessSolutionsEnquiryForm from '@/components/commerce/BusinessSolutionsEnquiryForm';
import ServiceCheckoutBox from '@/components/commerce/ServiceCheckoutBox';
import {
  BRAND_IDENTITY,
  inferServiceKey,
  type CommercialProduct,
  type ServiceCategoryKey,
} from '@/lib/commerce/brandIdentity';
import { SERVICE_DEFINITIONS } from '@/lib/commerce/servicesCatalog';
import type { PortfolioEntry } from '@/lib/commerce/enquiries';
import { trackConversionEvent } from '@/lib/commerce/googleTracking';

const SERVICE_ICONS: Record<ServiceCategoryKey, React.ReactNode> = {
  website: <Globe className="w-5 h-5 text-[#d4af37]" />,
  whatsapp: <Bot className="w-5 h-5 text-emerald-400" />,
  gbp: <MapPin className="w-5 h-5 text-sky-400" />,
  lead_gen: <Users className="w-5 h-5 text-amber-400" />,
  bi_analytics: <BarChart3 className="w-5 h-5 text-indigo-400" />,
  strategy: <Briefcase className="w-5 h-5 text-rose-300" />,
};

function formatServiceStartingPrice(products: CommercialProduct[]): string {
  const active = products.filter((p) => p.active);
  if (active.length === 0) return 'Request a Custom Quote';
  const priced = active.filter((p) => p.pricingMode !== 'custom_quote' && p.priceNgn > 0);
  if (priced.length === 0) return 'Request a Custom Quote';
  const minPrice = Math.min(
    ...priced.map((p) =>
      p.promoPriceNgn && p.promoPriceNgn > 0 && p.promoPriceNgn < p.priceNgn
        ? p.promoPriceNgn
        : p.priceNgn
    )
  );
  return `From ₦${minPrice.toLocaleString()}`;
}

export default function BusinessSolutionsPage() {
  const enquiryRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<CommercialProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CommercialProduct | null>(null);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string>(
    SERVICE_DEFINITIONS[0].title
  );
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    trackConversionEvent('view_service', {
      service_division: 'business_solutions',
      currency: 'NGN',
    });

    Promise.all([
      fetch('/api/commerce/products').then((r) => r.json()).catch(() => ({})),
      fetch('/api/commerce/portfolio').then((r) => r.json()).catch(() => ({})),
    ]).then(([prodData, portData]) => {
      if (prodData?.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
        const firstPriced =
          prodData.products.find(
            (p: CommercialProduct) => p.pricingMode !== 'custom_quote' && p.priceNgn > 0
          ) || prodData.products[0];
        setSelectedProduct(firstPriced || null);
      }
      if (portData?.success && Array.isArray(portData.items)) {
        setPortfolio(portData.items);
      }
      setLoadingProducts(false);
    });
  }, []);

  const productsByService = (key: ServiceCategoryKey) =>
    products.filter((p) => inferServiceKey(p) === key);

  const handleSelectServiceForEnquiry = (serviceTitle: string, pkg?: CommercialProduct) => {
    setSelectedServiceTitle(serviceTitle);
    if (pkg) {
      setSelectedProduct(pkg);
    }
    trackConversionEvent('cta_click', {
      cta: 'service_select',
      service: serviceTitle,
      package_id: pkg?.id,
    });
    enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const directWaUrl = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I would like to discuss a business solution for my company.`
  )}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24 sm:pb-0 relative overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_65%)]"
      />
      <Navbar />

      <main className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
        {/* SECTION 1: HERO & REPOSITIONED B2B VALUE PROPOSITION */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              Built for Nigerian SMEs, Distributors, Wholesalers, Private Schools &amp; Real Estate Agencies
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
            Capture More Sales.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f6e6a5]">
              Control Your Operations. Manage Your Money Better.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Bethelmind Business Solutions delivers practical, productised operations, payment reconciliation, inventory control, and WhatsApp lead-recovery systems — helping Nigerian businesses stop revenue leaks, track stock &amp; balances, and convert more enquiries.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
            <a
              href="#flagship-products"
              onClick={() => trackConversionEvent('cta_click', { cta: 'hero_explore_flagship' })}
              className="px-6 py-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm shadow-lg shadow-[#d4af37]/20 transition inline-flex items-center justify-center gap-2"
            >
              <span>EXPLORE OUR 3 FLAGSHIP SYSTEMS</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#enquiry-form"
              onClick={() => trackConversionEvent('cta_click', { cta: 'hero_request_demo' })}
              className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition inline-flex items-center justify-center gap-2"
            >
              <span>REQUEST A DEMO &amp; ASSESSMENT</span>
            </a>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackConversionEvent('click_whatsapp', { cta: 'hero_talk_to_consultant' })
              }
              className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP CONSULTANT</span>
            </a>
          </div>

          {/* Quick Trust Bar (Verified Facts Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-300">
            {[
              `${BRAND_IDENTITY.companyName} (${BRAND_IDENTITY.cacReg})`,
              'Admin-Configured Transparent Naira Pricing',
              'Server-Verified Paystack & Moniepoint Settlements',
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1B: THREE FLAGSHIP PRODUCTISED PLATFORMS */}
        <section id="flagship-products" className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Core Business Platforms
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Three Flagship Products Built for Operational Control
            </h2>
            <p className="text-sm text-slate-300">
              Each system has clear deliverables, documented exclusions, admin-editable pricing, staff training, and structured onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'bs-revenue-management',
                href: '/business-solutions/revenue-management',
                tag: 'Product A • Finance & Billing',
                title: 'SME Revenue & Payment Management',
                summary:
                  'Connect customer records, quotations, invoices, Paystack payments, verified bank transfers, receipts, outstanding balances, and daily/monthly sales reports.',
                bullets: [
                  'Quotation → Order → Invoice conversion',
                  'Paystack + verified transfer & receipt workflow',
                  'Outstanding balance & payment reminders',
                ],
                defaultSetup: 150000,
                defaultMonthly: 25000,
              },
              {
                id: 'bs-operations-inventory',
                href: '/business-solutions/operations-inventory',
                tag: 'Product B • Distributors & Wholesalers',
                title: 'Business Operations & Inventory Control',
                summary:
                  'Configurable SKU catalogue, multi-branch stock records, purchases, suppliers, stock movements, low-stock alerts, cost tracking, and estimated gross profit.',
                bullets: [
                  'Configurable units (cartons, bags, litres, packs)',
                  'Purchase, sale & transfer movement ledger',
                  'Low-stock alerts & daily gross-profit reports',
                ],
                defaultSetup: 220000,
                defaultMonthly: 35000,
              },
              {
                id: 'bs-sales-recovery',
                href: '/business-solutions/sales-recovery',
                tag: 'Product C • Lead & Sales Recovery',
                title: 'Customer Acquisition & Sales Recovery',
                summary:
                  'Connect website forms, authorised WhatsApp enquiries, lead qualification, sales-agent assignment, follow-up reminders, quotations, and lost-lead reporting.',
                bullets: [
                  'Opt-in / opt-out WhatsApp compliance logs',
                  'Agent assignment & follow-up reminders',
                  'Conversion & lost-lead reason reporting',
                ],
                defaultSetup: 140000,
                defaultMonthly: 25000,
              },
            ].map((fp) => {
              const live = products.find((p) => p.id === fp.id);
              const setupPrice = live?.priceNgn || fp.defaultSetup;
              const monthlyPrice = live?.monthlyMaintenanceNgn ?? fp.defaultMonthly;
              return (
                <article
                  key={fp.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-[#d4af37]/30 hover:border-[#d4af37] transition flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[11px] font-bold uppercase">
                      {fp.tag}
                    </span>
                    <h3 className="text-xl font-black text-white">{fp.title}</h3>
                    <div className="text-xs text-slate-300 font-semibold">
                      Setup from <strong className="text-[#d4af37]">₦{setupPrice.toLocaleString()}</strong> &bull; Maint.{' '}
                      <strong className="text-white">₦{monthlyPrice.toLocaleString()}/mo</strong>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{fp.summary}</p>
                    <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                      {fp.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href={fp.href}
                      className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-xs text-center inline-flex items-center justify-center gap-1.5"
                    >
                      <span>View Full Scope &amp; Live Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Specialised Vertical Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            {[
              {
                title: 'Distribution & Wholesale',
                desc: 'Multi-branch stock control, supplier purchases, and daily gross-profit tracking via Product B.',
              },
              {
                title: 'Real Estate Sales & Mandates',
                desc: 'Client enquiry capture, agent assignment, inspection bookings, and milestone invoicing via Products A + C.',
              },
              {
                title: 'Private School Enquiries & Fees',
                desc: 'Admissions lead follow-up, term fee invoicing, Paystack/transfer verification, and balance reminders via Products A + C.',
              },
            ].map((v) => (
              <div key={v.title} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-bold text-[#d4af37]">{v.title}</div>
                <p className="text-slate-300 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: SUPPORTING REVENUE SERVICES (SECONDARY OFFERINGS) */}
        <section id="services" className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Supporting Revenue Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Supporting Digital &amp; Intelligence Services
            </h2>
            <p className="text-sm text-slate-300">
              Website development, managed email infrastructure, competitor intelligence, and B2B prospect research supporting your core operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_DEFINITIONS.map((svc) => {
              const svcProducts = productsByService(svc.serviceKey);
              const priceDisplay = loadingProducts
                ? 'Loading pricing...'
                : formatServiceStartingPrice(svcProducts);
              const primaryPkg = svcProducts[0];

              return (
                <article
                  key={svc.slug}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 transition flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {SERVICE_ICONS[svc.serviceKey]}
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold">
                        {priceDisplay}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white">{svc.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {svc.summary}
                    </p>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      {svc.features.slice(0, 4).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {svc.complianceNote && (
                      <p className="text-[11px] text-slate-400 bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 leading-relaxed">
                        {svc.complianceNote}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectServiceForEnquiry(svc.title, primaryPkg)}
                      className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-xs uppercase tracking-wider transition"
                    >
                      {svc.ctaLabel}
                    </button>
                    <Link
                      href={`/business-solutions/${svc.slug}`}
                      className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>View Full Service &amp; Pricing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: SERVICE COMPARISON TABLE */}
        <section id="comparison" className="space-y-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Compare Our Business Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear pricing models, turnaround expectations, and recurring cost disclosures.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Service</th>
                  <th className="p-4 font-bold">Best For</th>
                  <th className="p-4 font-bold">Pricing</th>
                  <th className="p-4 font-bold">Recurring Charges</th>
                  <th className="p-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {SERVICE_DEFINITIONS.map((svc) => {
                  const svcProducts = productsByService(svc.serviceKey);
                  const hasMonthly = svcProducts.some((p) => p.monthlyMaintenanceNgn > 0);
                  return (
                    <tr key={svc.slug} className="hover:bg-slate-900/60">
                      <td className="p-4 font-bold text-white">{svc.title}</td>
                      <td className="p-4 text-slate-300 max-w-xs">{svc.shortTitle} &amp; growth</td>
                      <td className="p-4 font-bold text-[#d4af37]">
                        {loadingProducts ? '...' : formatServiceStartingPrice(svcProducts)}
                      </td>
                      <td className="p-4 text-slate-300">
                        {svc.serviceKey === 'whatsapp'
                          ? 'Monthly maintenance + API/AI usage'
                          : hasMonthly
                            ? 'Optional maintenance'
                            : '₦0 required'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/business-solutions/${svc.slug}`}
                          className="text-[#d4af37] font-bold hover:underline whitespace-nowrap"
                        >
                          Open &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: DYNAMIC ORDER & DEPOSIT CHECKOUT */}
        <section ref={checkoutRef} id="packages" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Select a Package, Review Scope &amp; Pay Deposit or Full Amount
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              All deliverables, turnaround timelines, exclusions, and recurring charges are shown
              clearly before payment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {products.map((pkg) => {
                const isSelected = selectedProduct?.id === pkg.id;
                const isCustom = pkg.pricingMode === 'custom_quote' || pkg.priceNgn <= 0;
                const hasPromo =
                  Boolean(pkg.promoPriceNgn) &&
                  Number(pkg.promoPriceNgn) > 0 &&
                  Number(pkg.promoPriceNgn) < pkg.priceNgn;
                const displayPrice = hasPromo ? Number(pkg.promoPriceNgn) : pkg.priceNgn;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(pkg);
                      trackConversionEvent('view_package', {
                        package_id: pkg.id,
                        package_name: pkg.name,
                      });
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition space-y-1 ${
                      isSelected
                        ? 'bg-slate-900 border-[#d4af37]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-white">{pkg.name}</span>
                      <span className="font-black text-xs text-[#d4af37] whitespace-nowrap">
                        {isCustom
                          ? 'Custom Quote'
                          : `${pkg.pricingMode === 'starting_from' ? 'From ' : ''}₦${displayPrice.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Turnaround: {pkg.turnaroundTime}
                      {pkg.monthlyMaintenanceNgn > 0
                        ? ` • Recurring: ₦${pkg.monthlyMaintenanceNgn.toLocaleString()}/mo`
                        : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              {selectedProduct ? (
                <ServiceCheckoutBox
                  product={selectedProduct}
                  onRequestCustomQuote={() =>
                    handleSelectServiceForEnquiry(selectedProduct.name, selectedProduct)
                  }
                />
              ) : (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
                  Loading available service packages...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: SHORT ENQUIRY & CONSULTATION FORM */}
        <section
          ref={enquiryRef}
          id="enquiry-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
              Consultation &amp; Quotation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Request a Tailored Business Solution or Consultation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Share your business need in under a minute. You will receive a unique enquiry
              reference and can connect directly with our consultant on WhatsApp.
            </p>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-bold text-white">Verified Corporate Settlement Account</div>
              <div>
                Bank: <strong className="text-white">{BRAND_IDENTITY.settlementBank}</strong>
              </div>
              <div>
                Account Number:{' '}
                <strong className="text-white">{BRAND_IDENTITY.settlementAccountNumber}</strong>
              </div>
              <div>
                Account Name:{' '}
                <strong className="text-white">{BRAND_IDENTITY.settlementAccountName}</strong> (
                {BRAND_IDENTITY.cacReg})
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-slate-900/95 border border-slate-700/80 border-t-2 border-t-[#d4af37] shadow-2xl">
            <BusinessSolutionsEnquiryForm
              defaultServiceTitle={selectedServiceTitle}
              defaultPackageName={selectedProduct?.name}
              sourceTag="business_solutions_main"
            />
          </div>
        </section>

        {/* SECTION 6: GENUINE PORTFOLIO & DEMONSTRATIONS */}
        {portfolio.length > 0 && (
          <section id="demos" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Live Demonstrations &amp; Portfolio
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Inspect working demonstrations and completed builds before committing.
                </p>
              </div>
              <Link href="/portfolio" className="text-xs font-bold text-[#d4af37] hover:underline">
                View All Showcases &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#d4af37]/40 transition space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#d4af37] uppercase">{item.category}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.projectType === 'completed_client'
                        ? 'Completed Client Project'
                        : 'Demonstration Project'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  <Link
                    href={item.liveUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Live Demonstration</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 7: FAQ SECTION */}
        <section id="faq" className="space-y-6">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear, honest answers on pricing, timelines, and deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'How are prices and deposits structured?',
                a: 'Clearly scoped packages display their exact or starting Naira price, deposit percentage, and any recurring charges upfront. Services requiring custom assessment display "Request a Custom Quote".',
              },
              {
                q: 'Are there hidden monthly fees?',
                a: 'No. Any recurring monthly maintenance, hosting, WhatsApp API, or AI usage fees are stated separately from one-time setup charges before payment.',
              },
              {
                q: 'How do you verify bank transfers and online payments?',
                a: 'Paystack payments are verified server-side via Paystack API and webhook signatures. Moniepoint transfers are verified by our corporate desk against actual bank credits before onboarding begins.',
              },
              {
                q: 'Do you guarantee #1 Google rankings or investor funding?',
                a: 'No. We apply proven technical, analytics, and advisory standards without making unrealistic guarantees about third-party rankings, funding approvals, or fixed sales percentages.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-[#d4af37]">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Mobile Bottom Bar for Nigerian Android Users */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 border-t border-slate-800 px-4 py-3 flex items-center gap-2 backdrop-blur-lg">
        <a
          href="#enquiry-form"
          className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-[#070b14] font-black text-xs text-center"
        >
          GET A SOLUTION
        </a>
        <a
          href={directWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversionEvent('click_whatsapp', { cta: 'sticky_mobile_bar' })}
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WHATSAPP</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}
