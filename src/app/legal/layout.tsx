/**
 * @file src/app/legal/layout.tsx
 * Shared layout for all legal pages.
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

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} aria-label="Back to Bethelmind Analytics Home">
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 16, height: 16, color: '#fff' }} aria-hidden="true" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Outfit', sans-serif" }}>
            Bethelmind Analytics
          </span>
        </Link>
        <nav aria-label="Legal pages navigation" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.78rem', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', transition: 'color 0.2s' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px, 6vw, 64px) clamp(16px, 4vw, 40px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px clamp(16px, 4vw, 40px)', textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: 40 }}>
        <p style={{ margin: '0 0 4px' }}>© {new Date().getFullYear()} Bethelmind Analytics & Strategy · Lagos, Nigeria</p>
        <p style={{ margin: 0 }}>Privacy-conscious workflows · Human support available · Built for Nigerian businesses</p>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .legal-content h2 { font-size: 1.25rem; font-weight: 800; color: #f8fafc; margin: 2rem 0 0.6rem; font-family: 'Outfit', sans-serif; }
        .legal-content h3 { font-size: 1rem; font-weight: 700; color: #e2e8f0; margin: 1.5rem 0 0.5rem; }
        .legal-content p { color: #94a3b8; font-size: 0.88rem; line-height: 1.75; margin: 0 0 1rem; }
        .legal-content ul, .legal-content ol { color: #94a3b8; font-size: 0.88rem; line-height: 1.75; margin: 0 0 1rem; padding-left: 1.4rem; }
        .legal-content li { margin-bottom: 0.4rem; }
        .legal-content a { color: #06b6d4; }
        :focus-visible { outline: 2px solid #06b6d4; outline-offset: 2px; border-radius: 4px; }
      `}</style>
    </div>
  );
}
