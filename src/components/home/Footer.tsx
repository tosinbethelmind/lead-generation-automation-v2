'use client';

/**
 * @file src/components/home/Footer.tsx
 * Site footer with legal links and corrected trust text.
 * Removes: "NDPR Compliant · Moniepoint & Paystack Verified"
 * Replaces with: "Privacy-conscious workflows · Human support available · Built for Nigerian businesses"
 */

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Acceptable Use', href: '/legal/acceptable-use' },
  { label: 'Refund Policy', href: '/legal/refund' },
  { label: 'Responsible Outreach', href: '/legal/responsible-outreach' },
];

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Sector Tools', href: '#sector-tools' },
  { label: 'Digital Assets Store', href: '/store' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(32px, 5vw, 56px) clamp(16px, 4vw, 40px) 32px', marginTop: 0 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles style={{ width: 17, height: 17, color: '#fff' }} aria-hidden="true" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.98rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Outfit', sans-serif" }}>
                Bethelmind Analytics
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 12px' }}>
              Business automation and customer-acquisition workflows for Lagos SMEs. Guided onboarding, practical sector tools, and WhatsApp support.
            </p>
            <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>📍 Lagos, Nigeria</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#cbd5e1')}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#64748b')}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Legal</h3>
            <nav aria-label="Legal pages">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#cbd5e1')}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#64748b')}
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
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Bethelmind Analytics & Strategy · Lagos, Nigeria
          </p>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.78rem', textAlign: 'right' }}>
            Privacy-conscious workflows · Human support available · Built for Nigerian businesses
          </p>
        </div>

      </div>
    </footer>
  );
}
