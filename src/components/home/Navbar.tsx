'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Menu, X } from 'lucide-react';
import { BRAND_IDENTITY } from '@/lib/commerce/brandIdentity';

const NAV_ITEMS = [
  { label: 'Home', href: '/home' },
  { label: 'Digital Business Solutions', href: '/business-solutions' },
  { label: 'Business Automation', href: '/business-automation' },
  { label: 'Business Intelligence', href: '/business-intelligence' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waLink = `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${BRAND_IDENTITY.companyName}! I would like to discuss a website, automation, or research project.`
  )}`;

  return (
    <header
      role="banner"
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-7xl h-16 px-4 sm:px-6 flex items-center justify-between rounded-2xl border transition-all duration-200 ${
        scrolled
          ? 'bg-[#070b14]/95 border-white/15 shadow-2xl backdrop-blur-xl'
          : 'bg-[#090d16]/90 border-white/10 shadow-xl backdrop-blur-lg'
      }`}
    >
      <Link
        href="/home"
        aria-label={`${BRAND_IDENTITY.companyName} Home`}
        className="flex items-center gap-2.5 shrink-0 min-w-0"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37]/25 to-[#d4af37]/5 border border-[#d4af37]/40 flex items-center justify-center font-bold text-xs text-[#d4af37] shrink-0">
          BM
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[#f5f3ef] tracking-tight leading-tight truncate">
            Bethelmind Analytics &amp; Digital Solutions
          </span>
          <span className="text-[10px] text-[#c9c4bc]/75 hidden sm:flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            {BRAND_IDENTITY.cacReg}
          </span>
        </div>
      </Link>

      <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-1 text-xs text-[#c9c4bc]">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/[0.05] transition-colors whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-bold text-xs transition shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Desk</span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="xl:hidden p-2 rounded-xl bg-white/[0.05] text-slate-200 hover:bg-white/10"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="xl:hidden fixed top-20 left-3 right-3 bg-[#090d16]/98 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/[0.06] font-medium"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-3 rounded-xl bg-[#d4af37] text-[#070b14] font-bold text-sm text-center"
          >
            Chat on WhatsApp ({BRAND_IDENTITY.whatsappDisplay})
          </a>
        </div>
      )}
    </header>
  );
}
