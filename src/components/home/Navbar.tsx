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
            className="nav-btn-chip desktop-only"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '6px 13px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {link.label}
          </a>
        ))}

        <Link
          href="/admin"
          className="desktop-only"
          style={{
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 8,
            transition: 'color 0.2s ease',
          }}
        >
          Login
        </Link>

        {/* Secondary CTA Button */}
        <a
          id="nav-whatsapp-cta"
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="desktop-only"
          style={{
            color: '#25d366',
            textDecoration: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            padding: '7px 15px',
            borderRadius: 11,
            background: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
          }}
          aria-label="Chat with us on WhatsApp"
        >
          <MessageSquare style={{ width: 14, height: 14 }} aria-hidden="true" /> WhatsApp Us
        </a>

        {/* Primary CTA Button */}
        <a
          id="nav-demo-cta"
          href="#how-it-works"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 11,
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
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
          style={{ position: 'absolute', top: 66, left: 0, right: 0, background: 'rgba(7,9,14,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '11px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'block',
              }}
            >
              {link.label}
            </a>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', padding: '8px 14px', display: 'block' }}>
            Login
          </Link>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noreferrer noopener" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 10, border: '1px solid rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.08)', color: '#25d366', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
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
        .nav-btn-chip:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(6, 182, 212, 0.4) !important;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
          transform: translateY(-1px);
        }
        #nav-whatsapp-cta:hover {
          background: rgba(37, 211, 102, 0.16) !important;
          border-color: rgba(37, 211, 102, 0.5) !important;
          box-shadow: 0 0 14px rgba(37, 211, 102, 0.2);
          transform: translateY(-1px);
        }
        #nav-demo-cta:hover {
          opacity: 0.95;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </header>
  );
}
