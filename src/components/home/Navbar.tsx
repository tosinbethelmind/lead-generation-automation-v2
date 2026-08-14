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
        top: scrolled ? 12 : 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: 1200,
        height: 64,
        padding: '0 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(7, 10, 20, 0.88)' : 'rgba(10, 15, 29, 0.75)',
        backdropFilter: 'blur(24px) saturate(190%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%)',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: scrolled
          ? '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 12px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Logo */}
      <Link href="/home" aria-label="Bethelmind Analytics Home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.35)'
        }}>
          <Sparkles style={{ width: 20, height: 20, color: '#fff' }} aria-hidden="true" />
        </div>
        <div>
          <span style={{
            fontWeight: 900,
            fontSize: '1.08rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            display: 'block'
          }}>
            Bethelmind Analytics
          </span>
          <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: -2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
            Lagos, Nigeria • AI Engine
          </span>
        </div>
      </Link>

      {/* Desktop nav */}
      <nav aria-label="Primary navigation" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-btn-chip desktop-only"
            style={{
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
            fontWeight: 600,
            padding: '6px 10px',
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
            color: '#34d399',
            textDecoration: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            padding: '7px 14px',
            borderRadius: 11,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-label="Chat with us on WhatsApp"
        >
          <MessageSquare style={{ width: 14, height: 14 }} aria-hidden="true" /> WhatsApp Us
        </a>

        {/* Primary CTA Button */}
        <a
          id="nav-demo-cta"
          href="#how-it-works"
          className="luxury-btn-primary"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: 11,
            padding: '8px 18px',
            fontWeight: 800,
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.25)',
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
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '7px 9px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 6 }}
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
          style={{ position: 'absolute', top: 72, left: 0, right: 0, background: 'rgba(7,10,20,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#f1f5f9',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '11px 14px',
                borderRadius: 12,
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
            <a href={waLink} target="_blank" rel="noreferrer noopener" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12, border: '1px solid rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.12)', color: '#34d399', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              WhatsApp Us
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem' }}>
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
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(6, 182, 212, 0.45) !important;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
          transform: translateY(-1px);
        }
        #nav-whatsapp-cta:hover {
          background: rgba(16, 185, 129, 0.2) !important;
          border-color: rgba(16, 185, 129, 0.6) !important;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }
        #nav-demo-cta:hover {
          transform: translateY(-1px) scale(1.02);
        }
      `}</style>
    </header>
  );
}
