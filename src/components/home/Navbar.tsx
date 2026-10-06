'use client';

/**
 * @file src/components/home/Navbar.tsx
 * Ultra-Premium, Responsive Glassmorphism Navigation Bar for Bethelmind Analytics.
 *
 * Designed to prevent horizontal overflow, eliminate visual clutter, and ensure 
 * 100% functional navigation across desktop, tablet, and mobile viewports.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Menu, X, ChevronDown, Sparkles, Sun, ShieldCheck, Database, ShoppingBag, Layers, ArrowRight } from 'lucide-react';
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
  };

  const waLink = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    'Hi Bethelmind Digital Solutions Lagos Desk, I would like to learn more about the 24/7 AI WhatsApp Quoter & Business Website.',
  );

  const ecosystemTools = [
    {
      title: 'Solar Engine WebApp',
      desc: '3-tier proposals, load calculator & instant WhatsApp BOQ',
      href: '/solar',
      icon: Sun,
      color: '#f59e0b',
      badge: 'LIVE',
    },
    {
      title: 'Growth Solutions Suite',
      desc: 'The 10 High-Conversion Sector Monetization Tools',
      href: '/solutions',
      icon: Sparkles,
      color: '#06b6d4',
      badge: 'B2B',
    },
    {
      title: 'GMB Local Ranking Shield',
      desc: 'Local Google Maps ranking & instant reputation audit',
      href: '/gmb/sample-audit',
      icon: ShieldCheck,
      color: '#10b981',
      badge: 'AUDIT',
    },
    {
      title: 'Lead Marketplace',
      desc: 'Direct-dial verified Nigerian commercial business directory',
      href: '/marketplace',
      icon: ShoppingBag,
      color: '#8b5cf6',
      badge: 'STORE',
    },
    {
      title: 'Data Packs Store',
      desc: 'Instant nationwide verified phone & corporate email packs',
      href: '/store',
      icon: Database,
      color: '#ec4899',
      badge: 'VERIFIED',
    },
    {
      title: '5 Engines Hub',
      desc: 'Architecture overview of the autonomous commercial growth engine',
      href: '/monetization',
      icon: Layers,
      color: '#3b82f6',
      badge: 'CORE',
    },
  ];

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: scrolled ? 10 : 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 28px)',
        maxWidth: 1220,
        height: 64,
        padding: '0 16px 0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(7, 10, 20, 0.92)' : 'rgba(10, 15, 29, 0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: scrolled
          ? '0 20px 40px -10px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.18)'
          : '0 12px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Brand Logo */}
      <Link
        href="/home"
        aria-label="Bethelmind Analytics Home"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <ShaderGradientLiquidLogo size={38} initials="BM" palette="bethelmind" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontWeight: 900,
              fontSize: '1.02rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 40%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Bethelmind Digital Solutions
          </span>
          <span
            style={{
              fontSize: '0.64rem',
              color: '#94a3b8',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 2,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            Lagos, Nigeria • AI Engine
          </span>
        </div>
      </Link>

      {/* Desktop Main Navigation */}
      <nav
        aria-label="Primary navigation"
        className="nav-desktop-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <button
          onClick={(e) => handleScrollTo(e, 'sector-tools')}
          className="nav-link-btn"
        >
          Sector Tools
        </button>

        <button
          onClick={(e) => handleScrollTo(e, 'how-it-works')}
          className="nav-link-btn"
        >
          How It Works
        </button>

        <button
          onClick={(e) => handleScrollTo(e, 'pricing')}
          className="nav-link-btn"
        >
          Pricing
        </button>

        <button
          onClick={(e) => handleScrollTo(e, 'faq')}
          className="nav-link-btn"
        >
          FAQ
        </button>

        {/* Ecosystem Dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: 'relative' }}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="nav-link-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: dropdownOpen ? '#38bdf8' : '#cbd5e1',
            }}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span>Solutions</span>
            <ChevronDown
              size={13}
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="nav-dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 8,
                width: 320,
                background: 'rgba(7, 11, 22, 0.96)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                padding: '10px 8px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(6,182,212,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {ecosystemTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setDropdownOpen(false)}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: `${tool.color}18`,
                        border: `1px solid ${tool.color}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <IconComponent size={15} style={{ color: tool.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#f8fafc',
                          }}
                        >
                          {tool.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: `${tool.color}20`,
                            color: tool.color,
                            border: `1px solid ${tool.color}40`,
                          }}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          lineHeight: 1.3,
                        }}
                      >
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

      {/* Right Action CTAs */}
      <div
        className="nav-actions-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Link
          href="/admin"
          className="desktop-only nav-login-link"
          style={{
            color: '#94a3b8',
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

        {/* WhatsApp Button */}
        <a
          id="nav-whatsapp-cta"
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="desktop-only"
          style={{
            color: '#34d399',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '7px 12px',
            borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
          aria-label="Contact Bethelmind Lagos Desk on WhatsApp"
        >
          <MessageSquare style={{ width: 14, height: 14 }} aria-hidden="true" />
          <span>WhatsApp Us</span>
        </a>

        {/* Primary CTA: See a Live Demo */}
        <button
          id="nav-demo-cta"
          onClick={(e) => handleScrollTo(e, 'live-demo')}
          className="desktop-only"
          style={{
            color: '#ffffff',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 10,
            padding: '8px 16px',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(6, 182, 212, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>See a Live Demo</span>
          <ArrowRight size={13} />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="mobile-only"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '7px 9px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {menuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation menu"
          style={{
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            background: 'rgba(7, 10, 20, 0.98)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 18,
            padding: '16px 18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 6px 4px' }}>
              Quick Navigation
            </span>

            <button
              onClick={(e) => handleScrollTo(e, 'live-demo')}
              className="mobile-nav-link"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))',
                border: '1px solid rgba(6,182,212,0.3)',
                color: '#38bdf8',
                fontWeight: 800,
              }}
            >
              <span>⚡ Interactive Command Demo</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={(e) => handleScrollTo(e, 'sector-tools')}
              className="mobile-nav-link"
            >
              <span>Sector Tools & BOQ Calculators</span>
            </button>

            <button
              onClick={(e) => handleScrollTo(e, 'how-it-works')}
              className="mobile-nav-link"
            >
              <span>How It Works (6 Steps)</span>
            </button>

            <button
              onClick={(e) => handleScrollTo(e, 'pricing')}
              className="mobile-nav-link"
            >
              <span>Pricing & 50% Milestone Deposit</span>
            </button>

            <button
              onClick={(e) => handleScrollTo(e, 'faq')}
              className="mobile-nav-link"
            >
              <span>Frequently Asked Questions</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 6px 4px' }}>
              Specialized WebApps & Tools
            </span>

            {ecosystemTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <tool.icon size={15} style={{ color: tool.color }} />
                  <span style={{ color: '#f8fafc', fontSize: '0.86rem', fontWeight: 600 }}>{tool.title}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: `${tool.color}15`,
                    color: tool.color,
                    border: `1px solid ${tool.color}35`,
                  }}
                >
                  {tool.badge}
                </span>
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                textAlign: 'center',
                padding: '11px 0',
                borderRadius: 10,
                border: '1px solid rgba(16,185,129,0.4)',
                background: 'rgba(16,185,129,0.14)',
                color: '#34d399',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <MessageSquare size={14} /> WhatsApp Us
            </a>

            <button
              onClick={(e) => handleScrollTo(e, 'pricing')}
              style={{
                textAlign: 'center',
                padding: '11px 0',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              See Pricing
            </button>
          </div>

          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            style={{
              textAlign: 'center',
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '6px 0',
              marginTop: 4,
            }}
          >
            Client / Admin Portal Login
          </Link>
        </div>
      )}

      {/* Responsive Styles & Micro-Animations */}
      <style>{`
        .nav-link-btn {
          color: #cbd5e1;
          background: transparent;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-link-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-login-link:hover {
          color: #f8fafc !important;
        }

        #nav-whatsapp-cta:hover {
          background: rgba(16, 185, 129, 0.18) !important;
          border-color: rgba(16, 185, 129, 0.6) !important;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
          transform: translateY(-1px);
        }

        #nav-demo-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(6, 182, 212, 0.5);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .mobile-nav-link {
          width: 100%;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 10px 14px;
          color: #e2e8f0;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justifyContent: space-between;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .mobile-nav-link:hover, .mobile-nav-link:active {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        @media (max-width: 1024px) {
          .nav-desktop-container {
            display: none !important;
          }
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
