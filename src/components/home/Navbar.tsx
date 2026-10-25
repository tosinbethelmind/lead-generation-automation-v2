'use client';

/**
 * @file src/components/home/Navbar.tsx
 * Ultra-Luxury, Responsive Glassmorphism Navigation Bar for Bethelmind Digital Solutions.
 *
 * Visual Standard:
 * - Restrained Obsidian (#070b14) & Champagne Gold (#d4af37)
 * - Zero visual crowding, zero duplicate buttons, zero crypto references
 * - Smooth mobile drawer and desktop dropdown with pristine typography
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Menu, X, ChevronDown, Sparkles, Sun, 
  ShieldCheck, ArrowRight, Car, Building2, ShoppingBag
} from 'lucide-react';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';
import ShaderGradientLiquidLogo from '@/components/three/ShaderGradientLiquidLogo';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setDropdownOpen(false);

    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
        window.location.href = `/home#${id}`;
        return;
      }

      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = id;
      }
    }
  };

  const waLink = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    'Hello Bethelmind Lagos Advisory Desk! I would like to schedule a private consultation regarding your bespoke mobile website & 24/7 AI sales assistant.',
  );

  const flagshipSolutions = [
    {
      title: 'Solar & Inverter BOQ Engine',
      desc: 'Interactive load sizer, DisCo Band A vs diesel savings & WhatsApp proposals',
      href: '/solar',
      icon: Sun,
    },
    {
      title: 'Tokunbo VIN & Customs Sizer',
      desc: 'NHTSA foreign history, Copart salvage checks & Nigeria Customs import duty',
      href: '/vin',
      icon: Car,
    },
    {
      title: '10 High-Conversion Sector Engines',
      desc: 'Specialized automation suites for salons, schools, logistics & retail',
      href: '/solutions',
      icon: Sparkles,
    },
    {
      title: 'Real Estate & Mortgage Portal',
      desc: 'Plot survey levies, deed fees, and developer mortgage amortization schedules',
      href: '/tools/real-estate-manager',
      icon: Building2,
    },
    {
      title: 'GMB Local Search Ranking Shield',
      desc: 'Google Maps #1 ranking optimization and automated 5-star review collector',
      href: '/gmb/sample-audit',
      icon: ShieldCheck,
    },
  ];

  return (
    <header
      role="banner"
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-6xl h-16 px-4 sm:px-6 flex items-center justify-between rounded-2xl border transition-all duration-300 ${
        scrolled
          ? 'bg-[#070b14]/95 border-white/[0.12] shadow-2xl shadow-black/80 backdrop-blur-xl'
          : 'bg-[#090d16]/85 border-white/[0.08] shadow-xl backdrop-blur-lg'
      }`}
    >
      {/* Brand Logo */}
      <Link
        href="/home"
        aria-label="Bethelmind Digital Solutions Home"
        className="flex items-center gap-3 text-decoration-none shrink-0"
      >
        <ShaderGradientLiquidLogo size={36} initials="BM" palette="bethelmind" />
        <div className="flex flex-col">
          <span className="font-serif text-sm sm:text-base font-normal text-[#f5f3ef] tracking-tight leading-tight">
            Bethelmind Digital Solutions
          </span>
          <span className="text-[10px] text-[#c9c4bc]/70 font-light flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            Lagos Advisory Desk &bull; CAC RC 7034297
          </span>
        </div>
      </Link>

      {/* Desktop Main Navigation */}
      <nav
        aria-label="Primary navigation"
        className="hidden lg:flex items-center gap-1 text-xs font-light text-[#c9c4bc]"
      >
        <Link
          href="/tools"
          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors"
        >
          Sector Tools
        </Link>

        <Link
          href="/how-it-works"
          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors"
        >
          How It Works
        </Link>

        <Link
          href="/pricing"
          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors"
        >
          Pricing
        </Link>

        <Link
          href="/results"
          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors"
        >
          Results
        </Link>

        <button
          onClick={(e) => handleScrollTo(e, 'faq')}
          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors font-sans cursor-pointer bg-transparent border-0"
        >
          FAQ
        </button>

        {/* Solutions Dropdown */}
        <div
          ref={dropdownRef}
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors inline-flex items-center gap-1.5 font-sans cursor-pointer bg-transparent border-0"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span>Solutions</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#d4af37]' : 'text-[#c9c4bc]'
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[390px] bg-[#090d16]/98 border border-[#d4af37]/25 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold border-b border-white/[0.06] mb-1">
                Specialized Enterprise Architectures
              </div>
              {flagshipSolutions.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#d4af37]/50 transition-colors">
                      <IconComponent className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-xs font-medium text-[#f5f3ef] block group-hover:text-[#d4af37] transition-colors">
                        {tool.title}
                      </span>
                      <p className="text-[11px] text-[#c9c4bc]/70 font-light leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Right Action CTAs (Uncluttered, Single Primary & Single Secondary) */}
      <div className="flex items-center gap-3">
        <a
          id="nav-whatsapp-cta"
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="hidden sm:inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#d4af37]/30 text-xs font-medium text-[#c9c4bc] hover:text-[#f5f3ef] transition-all"
          aria-label="Contact Bethelmind Lagos Desk on WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" aria-hidden="true" />
          <span>WhatsApp Concierge</span>
        </a>

        <Link
          id="nav-demo-cta"
          href="/contact"
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] hover:from-[#dfbc46] hover:to-[#b89329] text-[#070b14] font-semibold text-xs inline-flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <span>Book Private Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#f5f3ef] hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation menu"
          className="absolute top-20 left-0 right-0 bg-[#090d16]/98 border border-white/[0.1] rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-xs text-[#c9c4bc] max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block px-2 mb-2">
              Navigation
            </span>
            <Link
              href="/tools"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"
            >
              <span>Sector Tools &amp; Calculators</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"
            >
              <span>How It Works (48h SLA)</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"
            >
              <span>Pricing &amp; 50% Milestone Deposit</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
            <Link
              href="/results"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"
            >
              <span>Results &amp; Case Studies</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
            <Link
              href="/solutions"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"
            >
              <span>10 Sector Acquisition Engines</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
          </div>

          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block px-2">
              Specialized Portals
            </span>
            <Link
              href="/solar"
              onClick={() => setMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-white/[0.04] flex items-center gap-3 text-[#f5f3ef]"
            >
              <Sun className="w-4 h-4 text-[#d4af37]" />
              <span>SolarQuotePro Sizing Suite</span>
            </Link>
            <Link
              href="/vin"
              onClick={() => setMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-white/[0.04] flex items-center gap-3 text-[#f5f3ef]"
            >
              <Car className="w-4 h-4 text-[#d4af37]" />
              <span>Tokunbo VIN Customs Duty Checker</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#f5f3ef] font-semibold text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#d4af37]" />
              <span>WhatsApp Concierge Desk</span>
            </a>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8620] text-[#070b14] font-bold text-center block"
            >
              Book Private Demo &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
