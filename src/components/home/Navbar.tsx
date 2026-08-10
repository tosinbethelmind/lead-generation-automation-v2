'use client';

/**
 * @file src/components/home/Navbar.tsx
 * Sticky navigation bar for the Bethelmind Analytics homepage.
 * Mobile-responsive with an accessible hamburger menu.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, Menu, X } from 'lucide-react';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Sector Tools', href: '#sector-tools' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const waLink = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    'Hi Bethelmind Analytics, I would like to learn more about your services.',
  );

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 66,
        padding: '0 clamp(16px, 4vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,9,14,0.97)' : 'rgba(7,9,14,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.3s',
      }}
    >
      {/* Logo */}
      <Link href="/home" aria-label="Bethelmind Analytics Home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles style={{ width: 20, height: 20, color: '#fff' }} aria-hidden="true" />
        </div>
        <div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Outfit', sans-serif", display: 'block' }}>
            Bethelmind Analytics
          </span>
          <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', marginTop: -2 }}>Lagos, Nigeria</span>
        </div>
      </Link>

      {/* Desktop nav */}
      <nav aria-label="Primary navigation" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link desktop-only"
            style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, padding: '6px 8px', borderRadius: 8, transition: 'color 0.2s' }}
          >
            {link.label}
          </a>
        ))}

        <Link
          href="/admin"
          className="desktop-only"
          style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}
        >
          Login
        </Link>

        {/* Secondary CTA */}
        <a
          id="nav-whatsapp-cta"
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="desktop-only"
          style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6, transition: 'border-color 0.2s' }}
          aria-label="Chat with us on WhatsApp"
        >
          <MessageSquare style={{ width: 14, height: 14 }} aria-hidden="true" /> WhatsApp Us
        </a>

        {/* Primary CTA */}
        <a
          id="nav-demo-cta"
          href="#how-it-works"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
        >
          See a Live Demo
        </a>

        {/* Hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="mobile-only"
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 8px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 8 }}
        >
          {menuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation menu"
          style={{ position: 'absolute', top: 66, left: 0, right: 0, background: 'rgba(7,9,14,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '10px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'block' }}
            >
              {link.label}
            </a>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ color: '#64748b', textDecoration: 'none', fontSize: '1rem', padding: '10px 4px', display: 'block' }}>
            Login
          </Link>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noreferrer noopener" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              WhatsApp Us
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              See Pricing
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
        .nav-link:hover { color: #e2e8f0 !important; }
      `}</style>
    </header>
  );
}
