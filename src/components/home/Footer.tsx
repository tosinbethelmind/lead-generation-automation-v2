'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND_IDENTITY } from '@/lib/commerce/brandIdentity';

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Delivery & Milestone SLA', href: '/legal/delivery' },
  { label: 'Refund & Cancellation', href: '/legal/refund' },
  { label: 'Responsible Outreach', href: '/legal/responsible-outreach' },
];

const DIVISION_LINKS = [
  { label: 'Digital Business Solutions', href: '/business-solutions' },
  { label: 'Business Automation', href: '/business-automation' },
  { label: 'Business Intelligence', href: '/business-intelligence' },
  { label: 'Portfolio & Live Demos', href: '/portfolio' },
  { label: 'Commercial Pricing', href: '/pricing' },
  { label: 'Contact & Consultation', href: '/contact' },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.06] bg-[#070b14] text-[#c9c4bc] pt-14 pb-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#d4af37]" aria-hidden="true" />
              </div>
              <span className="font-serif text-lg font-normal text-[#f5f3ef] tracking-tight">
                {BRAND_IDENTITY.companyName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8e887e] font-light leading-relaxed max-w-md">
              Nigerian business growth, digital automation, and intelligence solutions provider — operating across Digital Business Solutions, Business Automation, and Business Intelligence.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#c5a880]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{BRAND_IDENTITY.cacReg}</span>
              </span>
              <span>•</span>
              <span>
                {BRAND_IDENTITY.settlementBank}: {BRAND_IDENTITY.settlementAccountNumber}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Divisions &amp; Pages</h3>
            <ul className="space-y-2 text-xs">
              {DIVISION_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#d4af37] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Governance &amp; Legal</h3>
            <ul className="space-y-2 text-xs">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#d4af37] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} {BRAND_IDENTITY.companyName}. All rights reserved.
          </span>
          <span>
            WhatsApp: {BRAND_IDENTITY.whatsappDisplay} &bull; Email: {BRAND_IDENTITY.email}
          </span>
        </div>
      </div>
    </footer>
  );
}
