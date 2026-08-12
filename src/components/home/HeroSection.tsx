'use client';

/**
 * @file src/components/home/HeroSection.tsx
 * Hero section with intelligent business profiler for the homepage.
 * Corrected copy — no false claims, no guaranteed outcomes.
 */

import React, { useMemo, useState } from 'react';
import { Sparkles, Zap, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { ORDERED_SECTORS, LAGOS_DISTRICTS, getSectorById } from '@/config/sectors';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';
import LeadCaptureModal from '@/components/LeadCaptureModal';

interface HeroSectionProps {
  businessName: string;
  setBusinessName: (v: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (v: string) => void;
  targetDistrict: string;
  setTargetDistrict: (v: string) => void;
}

export default function HeroSection({
  businessName,
  setBusinessName,
  selectedIndustry,
  setSelectedIndustry,
  targetDistrict,
  setTargetDistrict,
}: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = useMemo(() => getSectorById(selectedIndustry), [selectedIndustry]);

  const demoWaLink = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    `Hi Bethelmind Analytics,\n\nI would like to request a live demo.\n\nBusiness Name: ${businessName || 'My Business'}\nIndustry: ${profile.name}\nLagos District: ${targetDistrict}\n\nPlease let me know when we can connect.`,
  );

  return (
    <section
      aria-labelledby="hero-heading"
      style={{ paddingTop: 110, paddingBottom: 60, paddingLeft: 'clamp(16px, 4vw, 40px)', paddingRight: 'clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBusinessName={businessName}
        initialIndustry={selectedIndustry}
        initialDistrict={targetDistrict}
      />

      {/* Eyebrow & Social Proof Strip */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 100, padding: '6px 16px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700 }}>Built Specifically for Nigerian SMEs & Enterprises</span>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
            <Star size={12} fill="#f59e0b" />
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1
        id="hero-heading"
        style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
      >
        Turn Inbound Enquiries Into<br />
        <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 60%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Paying Customers on WhatsApp.
        </span>
      </h1>

      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: 720, margin: '0 auto 14px', lineHeight: 1.65 }}>
        Automate customer intake, transcribe WhatsApp Voice Notes, auto-verify bank transfers via dedicated virtual accounts, and deliver sector quotes instantly.
      </p>

      {/* Trust Subbar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap', color: '#64748b', fontSize: '0.8rem', marginBottom: 36 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} /> Bank Transfer Auto-Reconciliation
        </span>
        <span>•</span>
        <span>WhatsApp Voice Note AI Ready</span>
        <span>•</span>
        <span>FIRS VAT/WHT Invoice Generator</span>
      </div>

      {/* Primary CTAs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
        <a
          id="hero-demo-cta"
          href={demoWaLink}
          target="_blank"
          rel="noreferrer noopener"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 12, padding: '13px 28px', fontWeight: 800, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 28px rgba(6,182,212,0.25)' }}
        >
          See a Live Demo on WhatsApp <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" />
        </a>
        <button
          id="hero-setup-cta"
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'transparent', color: '#cbd5e1', cursor: 'pointer', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Get 60-Sec Recommended Setup
        </button>
      </div>

      {/* Business Profiler */}
      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 24, padding: 'clamp(20px, 4vw, 30px)', boxShadow: '0 20px 60px rgba(6,182,212,0.06)', marginBottom: 0 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sparkles style={{ width: 18, height: 18, color: '#06b6d4', flexShrink: 0 }} aria-hidden="true" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            Tell us about your business to preview a recommended workflow.
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 20, paddingLeft: 28 }}>
          Takes 5 seconds. No sign-up required.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>

          {/* Business Name */}
          <div>
            <label htmlFor="profiler-business-name" style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
              Business Name
            </label>
            <input
              id="profiler-business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Apex Solar Solutions"
              maxLength={80}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="profiler-industry" style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
              Industry / Sector
            </label>
            <select
              id="profiler-industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              {ORDERED_SECTORS.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#07090e', color: '#fff' }}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label htmlFor="profiler-district" style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
              Lagos District
            </label>
            <select
              id="profiler-district"
              value={targetDistrict}
              onChange={(e) => setTargetDistrict(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              {LAGOS_DISTRICTS.map((d) => (
                <option key={d} value={d} style={{ background: '#07090e', color: '#fff' }}>📍 {d}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Recommendation pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.05)', padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(6,182,212,0.12)', flexWrap: 'wrap' }}>
          <Zap style={{ width: 14, height: 14, color: '#06b6d4', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
            Recommended workflow for{' '}
            <strong style={{ color: '#06b6d4' }}>{profile.name}</strong>{' '}
            businesses in{' '}
            <strong style={{ color: '#06b6d4' }}>{targetDistrict}</strong>
          </span>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginLeft: 'auto' }}>
            ✓ Workflow tools available below
          </span>
        </div>

      </div>
    </section>
  );
}

