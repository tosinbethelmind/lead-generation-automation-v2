import React from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProductionStorefront from '@/components/ProductionStorefront';
import { Sparkles, ShieldCheck, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Automated Online Storefront with 36-State Delivery Fee & Paystack/WhatsApp Checkout | Bethelmind Digital Solutions',
  description: 'Turn your Jiji or Instagram shop into an automated mobile e-commerce store with live product catalog, 36-state delivery sizer, and instant Moniepoint/WhatsApp checkout.'
};

export default function StorefrontDemoPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      <Navbar />

      <main className="pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Option 1: Complete Production Storefront Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-snug sm:leading-tight">
            Automated Online Store for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
              Jiji &amp; Instagram Sellers
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Stop replying to 100 manual &quot;How much?&quot; messages every day. Your customers select their items, choose their delivery state with automatic shipping fee calculation, and complete payment directly into your Moniepoint bank account.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>36-State Delivery Fee Sizer</span>
            </span>
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Moniepoint / OPay Verified Transfer</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>1-Tap WhatsApp Order Dispatch</span>
            </span>
          </div>
        </div>

        {/* Live Interactive Storefront */}
        <section className="max-w-5xl mx-auto">
          <ProductionStorefront
            businessName="Royal Boutique & Accessories"
            merchantPhone="2348022791227"
          />
        </section>

        {/* Activation Guarantee Box */}
        <section className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              Deploy For Your Own Brand
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              Want This Storefront With Your Products &amp; Prices?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Option B: Complete Turnkey Setup for <strong>₦80,000 Flat</strong> (50% Milestone Deposit: ₦40,000). 
              Includes your own custom .com.ng domain, 1 full year free hosting, and ₦0 monthly fees.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
            <Link
              href="/onboard?service=ecommerce_store"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition"
            >
              <span>Launch Storefront (₦40k Deposit) →</span>
            </Link>
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent('Hello Bethelmind! I am testing the live Storefront with the 36-State delivery sizer. I want to deploy this exact online store for my brand with our products. How do we start with the ₦40,000 deposit?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Chat With Solutions Desk</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
