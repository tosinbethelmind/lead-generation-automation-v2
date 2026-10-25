/**
 * @file src/app/legal/layout.tsx
 * Ultra-Premium Shared Layout for Bethelmind Legal & Policy Pages
 * Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise, RC 7034297)
 */
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Tools Disclaimers', href: '/legal/disclaimer' },
  { label: 'Delivery & SLA', href: '/legal/delivery' },
  { label: 'Refund Policy', href: '/legal/refund' },
  { label: 'AI Transparency', href: '/legal/ai-disclaimer' },
  { label: 'Acceptable Use', href: '/legal/acceptable-use' },
  { label: 'Cookies & Storage', href: '/legal/cookies' },
  { label: 'Responsible Outreach', href: '/legal/responsible-outreach' },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#070b14', color: '#f8fafc', fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      {/* Top Hairline Metallic Accent Glow */}
      <div style={{ height: 2, width: '100%', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)' }} />

      {/* Top Navigation Bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px clamp(16px, 4vw, 40px)', background: 'rgba(11, 18, 30, 0.85)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link 
              href="/home" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s' }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Back to Home</span>
            </Link>

            <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale style={{ width: 14, height: 14, color: '#d4af37' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', fontFamily: "var(--font-outfit), 'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
                Bethelmind <span style={{ color: '#d4af37' }}>Legal &amp; Compliance</span>
              </span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.72rem', fontWeight: 700 }}>
              <ShieldCheck style={{ width: 13, height: 13 }} />
              <span>CAC Certified Enterprise · RC 7034297</span>
            </span>
          </div>

        </div>

        {/* Policy Quick Tabs */}
        <div style={{ maxWidth: 1100, margin: '12px auto 0', overflowX: 'auto', paddingBottom: 4 }}>
          <nav aria-label="Legal pages navigation" style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
            {LEGAL_LINKS.map((l) => (
              <Link 
                key={l.href} 
                href={l.href} 
                style={{ 
                  color: '#94a3b8', 
                  textDecoration: 'none', 
                  fontSize: '0.74rem', 
                  fontWeight: 600, 
                  padding: '5px 11px', 
                  borderRadius: 8, 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'all 0.15s' 
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Page Content Container */}
      <main style={{ maxWidth: 840, margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) clamp(16px, 4vw, 32px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px clamp(16px, 4vw, 40px)', textAlign: 'center', color: '#64748b', fontSize: '0.78rem', background: '#05080f' }}>
        <p style={{ margin: '0 0 6px', color: '#94a3b8', fontWeight: 600 }}>
          © {new Date().getFullYear()} Bethelmind Digital Solutions · Plot 12, Commercial Corridor, Lagos, Nigeria
        </p>
        <p style={{ margin: '0 0 10px' }}>
          CAC Certified Enterprise RC 7034297 · Moniepoint Microfinance Bank Settlement (6805375225) · Built for Nigerian Commercial Operations
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', fontSize: '0.75rem', marginTop: 12 }}>
          <Link href="/legal/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <Link href="/legal/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <Link href="/legal/disclaimer" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 700 }}>Calculation Disclaimers</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <Link href="/legal/delivery" style={{ color: '#94a3b8', textDecoration: 'none' }}>Delivery SLA</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <Link href="/legal/refund" style={{ color: '#94a3b8', textDecoration: 'none' }}>Refund Policy</Link>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .legal-content h2 { 
          font-size: 1.35rem; 
          font-weight: 800; 
          color: #ffffff; 
          margin: 2.2rem 0 0.8rem; 
          font-family: var(--font-outfit), 'Outfit', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 6px;
        }
        .legal-content h3 { 
          font-size: 1.05rem; 
          font-weight: 700; 
          color: #e2e8f0; 
          margin: 1.6rem 0 0.6rem; 
        }
        .legal-content p { 
          color: #cbd5e1; 
          font-size: 0.9rem; 
          line-height: 1.8; 
          margin: 0 0 1.1rem; 
        }
        .legal-content ul, .legal-content ol { 
          color: #cbd5e1; 
          font-size: 0.9rem; 
          line-height: 1.8; 
          margin: 0 0 1.2rem; 
          padding-left: 1.5rem; 
        }
        .legal-content li { 
          margin-bottom: 0.5rem; 
        }
        .legal-content a { 
          color: #38bdf8; 
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .legal-content a:hover {
          color: #7dd3fc;
        }
        .legal-content code {
          background: rgba(255,255,255,0.07);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85em;
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        :focus-visible { 
          outline: 2px solid #d4af37; 
          outline-offset: 2px; 
          border-radius: 4px; 
        }
      `}</style>
    </div>
  );
}
