'use client';

/**
 * @file src/components/home/SolutionsSection.tsx
 * Specialized Industry Architectures for the homepage.
 */

import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Zap, ShieldCheck, Truck, 
  Calendar, Home, ArrowRight, Sparkles
} from 'lucide-react';

const FLAGSHIP_SOLUTIONS = [
  {
    id: 'whatsapp-closer',
    number: '01',
    icon: MessageSquare,
    title: 'Instant WhatsApp Speed-to-Lead & Catalog Closer',
    sector: 'Retail & E-Commerce',
    desc: 'Sub-3s WhatsApp DM replies with natural Nigerian voice notes, instant catalog pricing, and automated Moniepoint/Paystack payment links.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solutions',
  },
  {
    id: 'solar-boq',
    number: '02',
    icon: Zap,
    title: 'Solar & Inverter Instant Quotation Engine',
    sector: 'Solar & Renewable Energy',
    desc: 'Interactive appliance load picker generating instant WhatsApp BOQ proposals and diesel replacement fuel savings analysis.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solar',
  },
  {
    id: 'fake-alert-proof',
    number: '03',
    icon: ShieldCheck,
    title: '"Fake Alert Proof" Bank Transfer Reconciliation',
    sector: 'Supermarkets & Wholesale',
    desc: 'Validates payments strictly via Direct NIBSS/OPay/Moniepoint webhooks with cashier notifications. Zero fake alert fraud.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solutions',
  },
  {
    id: 'dispatch-aggregator',
    number: '04',
    icon: Truck,
    title: 'Hyperlocal Dispatch & Waybill Tracker',
    sector: 'Logistics & Haulage',
    desc: 'Distance fee comparer, automated customer SMS/WhatsApp waybill tracking, and Pay-on-Delivery cash ledger.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solutions',
  },
  {
    id: 'tenant-escrow',
    number: '05',
    icon: Home,
    title: 'Tenant Service Charge & Rent Escrow Manager',
    sector: 'Real Estate & Landlords',
    desc: 'Automated rent countdowns, digital stamped receipts, and facility diesel maintenance breakdown per tenant unit.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solutions',
  },
  {
    id: 'booking-lock',
    number: '06',
    icon: Calendar,
    title: 'Automated Service Booking & Deposit Lock',
    sector: 'Clinics, Spas & Salons',
    desc: '24/7 appointment calendar locking client slots with upfront bank transfer commitments to eliminate no-show losses.',
    pricing: '₦35,000 Starter Activation (₦65k Total)',
    href: '/solutions',
  },
];

export default function SolutionsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 border-t border-white/[0.04]"
    >
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Specialized Commercial Architectures</span>
        </div>
        
        <h2
          id="solutions-heading"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f3ef] tracking-tight leading-tight"
        >
          High-Conversion <span className="italic font-light text-[#d4af37]">Sector Engines</span>
        </h2>
        
        <p className="text-sm sm:text-base text-[#c9c4bc] font-light leading-relaxed max-w-2xl mx-auto">
          Eliminate operational leaks and after-hours customer drop-offs with purpose-built automation engines tailored to Nigerian commercial operations.
        </p>
      </div>

      {/* SOLUTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FLAGSHIP_SOLUTIONS.map(({ id, number, icon: Icon, title, sector, desc, pricing, href }) => (
          <div
            key={id}
            className="p-7 sm:p-8 rounded-3xl bg-[#090d16]/90 border border-white/[0.08] hover:border-[#d4af37]/35 flex flex-col justify-between space-y-6 transition-all shadow-xl backdrop-blur-md group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-medium text-[#c5a880] tracking-wider uppercase">
                  {sector}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#f5f3ef]">
                {number}. {title}
              </h3>

              <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
                {desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#c9c4bc]/70 block font-light">Structure:</span>
                <span className="text-xs font-medium text-[#f5f3ef] font-mono">{pricing}</span>
              </div>

              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] group-hover:text-[#dfbc46] transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SUITE EXPLORATION CALLOUT */}
      <div className="rounded-3xl bg-[#090d16]/80 border border-white/[0.08] p-6 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-widest block">
            Comprehensive Suite
          </span>
          <h4 className="font-serif text-xl sm:text-2xl text-[#f5f3ef] font-normal">
            Construction, Private Schools, Agribusiness &amp; Legal Portals
          </h4>
          <p className="text-xs text-[#c9c4bc] font-light leading-relaxed">
            Explore the complete directory of all specialized monetization engines with instant commercial calculations and direct WhatsApp integration.
          </p>
        </div>

        <Link
          href="/solutions"
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
        >
          <span>View All Solutions</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
