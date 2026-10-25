'use client';

/**
 * @file src/components/home/Footer.tsx
 * Site footer with full statutory transparency, CAC RC 7034297 accreditation,
 * NDPA 2023 compliance, Moniepoint settlement credentials, and luxury obsidian palette.
 */

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Sector Tools Disclaimers', href: '/legal/disclaimer' },
  { label: 'Delivery & Milestone SLA', href: '/legal/delivery' },
  { label: 'Refund & Cancellation', href: '/legal/refund' },
  { label: 'AI Output Transparency', href: '/legal/ai-disclaimer' },
  { label: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
  { label: 'Cookie & Storage Policy', href: '/legal/cookies' },
  { label: 'Responsible Outreach', href: '/legal/responsible-outreach' },
];

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Flagship Sector Tools', href: '/tools' },
  { label: 'Client Results & Case Studies', href: '/results' },
  { label: 'Bespoke Pricing & Packages', href: '/pricing' },
  { label: 'Commercial Settlement & Escrow', href: '/#payment' },
  { label: 'Frequently Asked Questions', href: '/#faq' },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.06] bg-[#070b14] text-[#c9c4bc] pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-0"
    >
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#d4af37]" aria-hidden="true" />
              </div>
              <span className="font-serif text-lg font-normal text-[#f5f3ef] tracking-tight">
                Bethelmind Digital Solutions
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8e887e] font-light leading-relaxed max-w-md">
              Bespoke digital storefronts, 24/7 AI WhatsApp quotation assistants, and programmatic sector calculation engines engineered specifically for verified Nigerian commercial enterprises.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#c5a880]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                CAC Certified: BN/RC 7034297
              </span>
              <span>&bull;</span>
              <span>Moniepoint MFB: 6805375225</span>
              <span>&bull;</span>
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#f5f3ef] uppercase tracking-widest">
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-xs font-light">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[#8e887e] hover:text-[#d4af37] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#f5f3ef] uppercase tracking-widest">
              Statutory Governance
            </h3>
            <nav aria-label="Legal pages">
              <ul className="space-y-2 text-xs font-light">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[#8e887e] hover:text-[#d4af37] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e887e] font-light">
          <p className="m-0">
            &copy; {new Date().getFullYear()} Bethelmind Digital Solutions (CAC BN/RC: 7034297). All rights reserved.
          </p>
          <p className="m-0 text-center sm:text-right">
            NDPA 2023 Compliant &bull; 50% Milestone Escrow Protected &bull; Built For Nigerian Enterprise Growth
          </p>
        </div>

      </div>
    </footer>
  );
}