'use client';

/**
 * @file src/app/solar/page.tsx
 * ⚡ STANDALONE SOLAR & INVERTER ENGINE PORTAL (SolarQuotePro)
 * 
 * Separated Sovereign Application:
 * Linked directly to the dedicated Solar ROI Proposal Builder workspace
 * (C:\Users\HomePC\Desktop\website Projects\Solar ROI Proposal Builder)
 * Live Vercel App: https://solar-roi-proposal-builder.vercel.app
 */

import React from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowRight, ExternalLink, ShieldCheck, Calculator, 
  Layers, CheckCircle2, PhoneCall, Sparkles, Server, Laptop
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function SolarPortalPage() {
  const SOLAR_WEBAPP_URL = 'https://solar-roi-proposal-builder.vercel.app';
  const WA_HOTLINE = 'https://wa.me/2348022791227?text=Hello%20Bethelmind%20Lagos%20Desk%2C%20I%20am%20a%20solar%20installer%20and%20want%20to%20access%20the%20SolarQuotePro%20Installer%20Suite.';

  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        {/* HERO */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 20 }}>
            <Zap style={{ width: 15, height: 15, color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Dedicated Sovereign Engineering Application
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 auto 20px', maxWidth: 880, fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}>
            SolarQuotePro: Standalone <span style={{ color: '#f59e0b' }}>Solar BOQ & ROI</span> Engine
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 740, margin: '0 auto 36px', lineHeight: 1.7 }}>
            The specialized Solar & Inverter Proposal Suite operates in its own dedicated, full-scale workspace. Designed specifically for Nigerian solar installers, EPC contractors, and commercial facility managers.
          </p>

          {/* PRIMARY LAUNCH CARD */}
          <div style={{ maxWidth: 850, margin: '0 auto 56px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 24, padding: '36px 32px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, background: '#f59e0b', filter: 'blur(70px)', opacity: 0.2, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Sovereign Web Application
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', margin: '4px 0 10px', fontFamily: "'Outfit', sans-serif" }}>
                  Solar ROI Proposal Builder (Vercel Production)
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 540 }}>
                  Includes 3-layer progressive disclosure: 1-Click Appliance Load Sizer, Bankable PDF Proposal Generator, Dynamic BOM Pricing Tables, and Disco Band A vs Diesel Fuel ROI payback calculator.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <span>Pure Sine Wave & Hybrid kVA Sizer</span>
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <span>Lithium vs Gel Battery Calculations</span>
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <span>Instant WhatsApp BOQ Sharing</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 260, flexShrink: 0 }}>
                <a
                  href={SOLAR_WEBAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '14px 22px',
                    borderRadius: 14,
                    background: '#f59e0b',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
                    transition: 'transform 0.15s'
                  }}
                >
                  <span>Open Solar Engine</span>
                  <ExternalLink style={{ width: 16, height: 16 }} />
                </a>

                <a
                  href={WA_HOTLINE}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '11px 18px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <PhoneCall style={{ width: 14, height: 14 }} />
                  <span>Installer Onboarding Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* LOCAL WORKSPACE SYNC INFO */}
          <div style={{ maxWidth: 850, margin: '0 auto', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 28px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Server style={{ width: 22, height: 22, color: '#60a5fa' }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
                Local Workspace Architecture
              </h4>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Local Project Path: <code style={{ color: '#f59e0b', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: 4 }}>C:\Users\HomePC\Desktop\website Projects\Solar ROI Proposal Builder</code>.
                Any deep modifications to solar formulas, inverter specs, or component databases are developed inside this sovereign repository without impacting other SME solutions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
