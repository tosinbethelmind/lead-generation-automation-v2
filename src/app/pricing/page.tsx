'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import {
  BRAND_IDENTITY,
  DEFAULT_COMMERCIAL_CATALOG,
  type CommercialDivision,
  type CommercialProduct,
} from '@/lib/commerce/catalog';

const DIVISION_TABS: { id: CommercialDivision; label: string; subtitle: string; href: string }[] = [
  {
    id: 'digital_business_solutions',
    label: '1. Digital Business Solutions',
    subtitle: 'Primary Cashflow • 60% Initial Deposit / 40% Before Handover',
    href: '/business-solutions',
  },
  {
    id: 'business_automation',
    label: '2. Business Automation',
    subtitle: 'Recurring Revenue • Setup + ₦20,000–₦50,000 Monthly Maintenance',
    href: '/business-automation',
  },
  {
    id: 'business_intelligence',
    label: '3. Business Intelligence',
    subtitle: 'Specialised Data & Research • PDF + Excel Deliverables',
    href: '/business-intelligence',
  },
];

export default function PricingPage() {
  const [activeDivision, setActiveDivision] = useState<CommercialDivision>('digital_business_solutions');
  const [products, setProducts] = useState<CommercialProduct[]>(DEFAULT_COMMERCIAL_CATALOG);

  useEffect(() => {
    fetch('/api/commerce/products')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const visibleProducts = products.filter((p) => p.division === activeDivision && p.active);
  const activeTabMeta = DIVISION_TABS.find((t) => t.id === activeDivision)!;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{BRAND_IDENTITY.companyName} • {BRAND_IDENTITY.cacReg}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Transparent Commercial Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Three focused commercial divisions. Standardised deliverables, Paystack checkout, and verified Moniepoint corporate settlement ({BRAND_IDENTITY.settlementAccountNumber}).
          </p>
        </div>

        {/* Division Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {DIVISION_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDivision(tab.id)}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition border ${
                activeDivision === tab.id
                  ? 'bg-[#d4af37] text-[#070b14] border-[#d4af37]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-center text-xs sm:text-sm text-[#d4af37] font-semibold">
          {activeTabMeta.subtitle}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((product) => {
            const depositNgn = Math.round((product.priceNgn * product.depositPercent) / 100);
            return (
              <div
                key={product.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-400">
                    Turnaround: {product.turnaroundTime}
                  </div>
                  <h2 className="text-xl font-bold text-white">{product.name}</h2>
                  <div>
                    <div className="text-2xl font-black text-[#d4af37]">
                      ₦{product.priceNgn.toLocaleString()}
                      {product.priceMaxNgn ? ` – ₦${product.priceMaxNgn.toLocaleString()}` : ''}
                    </div>
                    {product.monthlyMaintenanceNgn > 0 && (
                      <div className="text-xs text-emerald-400 font-semibold mt-1">
                        Monthly maintenance: ₦{product.monthlyMaintenanceNgn.toLocaleString()}/mo
                      </div>
                    )}
                    {product.depositPercent < 100 && (
                      <div className="text-xs text-slate-400 mt-1">
                        {product.depositPercent}% deposit: ₦{depositNgn.toLocaleString()} &bull; Balance before handover
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">{product.description}</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {product.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Link
                    href={activeTabMeta.href}
                    className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <span>Select &amp; Start Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
                      `Hello Bethelmind! I would like a quote for ${product.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Quote ({BRAND_IDENTITY.whatsappDisplay})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
