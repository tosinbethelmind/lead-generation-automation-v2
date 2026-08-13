'use client';

/**
 * @file src/components/home/HeroSection.tsx
 * High-converting Hero section with ambient video background visual,
 * intelligent business profiler, and nationwide/global SEO positioning.
 */

import React, { useMemo, useState } from 'react';
import { Sparkles, Zap, ArrowRight, Star, ShieldCheck, Play, Bot, Video } from 'lucide-react';
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
    `Hi Bethelmind Analytics,\n\nI would like to request a live demo for my business.\n\nBusiness Name: ${businessName || 'My Business'}\nIndustry: ${profile.name}\nLocation/Region: ${targetDistrict}\n\nPlease let me know when we can connect.`,
  );

  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        position: 'relative',
        paddingTop: 120,
        paddingBottom: 70,
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        maxWidth: 1240,
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Visual Video Backdrop Overlay Container */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Futuristic Tech Visual Particle Mesh */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '80%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 45%, rgba(7,9,14,0) 75%)',
          filter: 'blur(60px)',
          opacity: 0.85
        }} />

        <div style={{
          position: 'absolute',
          top: '30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(7,9,14,0) 70%)',
          filter: 'blur(70px)',
        }} />

        {/* Ambient Overlay Grid Graphic */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
        }} />
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBusinessName={businessName}
        initialIndustry={selectedIndustry}
        initialDistrict={targetDistrict}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Eyebrow & SEO Positioning Strip */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.25)',
            borderRadius: 100,
            padding: '6px 18px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 10px #06b6d4', flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 800, letterSpacing: '0.01em' }}>
              ⚡ Powered by Relume UI Design System & Google PageSpeed AI Engine
            </span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: '0.78rem', fontWeight: 800 }}>
              <Star size={13} fill="#f59e0b" />
              <span>4.9/5 Enterprise Rating (1,200+ Businesses)</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2.1rem, 5.8vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.14,
            margin: '0 0 18px',
            fontFamily: "'Outfit', sans-serif",
            color: '#f8fafc',
            letterSpacing: '-0.02em'
          }}
        >
          Never Lose Another Customer To Slow Replies.<br />
          <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Turn Every WhatsApp Inquiry & Click Into Cash 24/7.
          </span>
        </h1>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(0.98rem, 2vw, 1.15rem)', maxWidth: 780, margin: '0 auto 16px', lineHeight: 1.65 }}>
          Capture verified B2B leads across Lagos, Abuja, and Port Harcourt. Qualify prospects instantly with human-like WhatsApp voice notes, calculate automated PDF quotes in 2 minutes, and verify bank payments on autopilot.
        </p>

        {/* Trust Subbar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap', color: '#64748b', fontSize: '0.82rem', marginBottom: 38 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2e8f0', fontWeight: 600 }}>
            <ShieldCheck size={15} style={{ color: '#10b981' }} /> Moniepoint & Paystack Payment Auto-Verification
          </span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Nigerian Accent WhatsApp Voice Note AI</span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>10,000+ Verified B2B Lagos Leads</span>
        </div>

        {/* Primary CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 54 }}>
          <a
            id="hero-demo-cta"
            href={demoWaLink}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 14,
              padding: '14px 30px',
              fontWeight: 800,
              fontSize: '0.98rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 30px rgba(6,182,212,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            See a Live Demo on WhatsApp <ArrowRight style={{ width: 17, height: 17 }} aria-hidden="true" />
          </a>
          <button
            id="hero-setup-cta"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: '#f8fafc',
              cursor: 'pointer',
              borderRadius: 14,
              padding: '14px 30px',
              fontWeight: 700,
              fontSize: '0.98rem',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backdropFilter: 'blur(8px)'
            }}
          >
            Get 60-Sec Recommended Setup
          </button>
        </div>

        {/* Business Profiler Widget */}
        <div style={{
          background: 'rgba(15,23,42,0.65)',
          border: '1px solid rgba(6,182,212,0.25)',
          borderRadius: 24,
          padding: 'clamp(20px, 4vw, 32px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)'
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Sparkles style={{ width: 20, height: 20, color: '#06b6d4', flexShrink: 0 }} aria-hidden="true" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
              Tailor a recommended lead automation workflow for your business:
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 22, paddingLeft: 30 }}>
            Instant setup simulation. Select your industry to test live tools.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 22 }}>

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
                placeholder="e.g. Apex Global Solutions"
                maxLength={80}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(7,9,14,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
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
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(7,9,14,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                {ORDERED_SECTORS.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: '#07090e', color: '#fff' }}>
                    {s.emoji} {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region / District */}
            <div>
              <label htmlFor="profiler-district" style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
                Primary Target Region
              </label>
              <select
                id="profiler-district"
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(7,9,14,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                {LAGOS_DISTRICTS.map((d) => (
                  <option key={d} value={d} style={{ background: '#07090e', color: '#fff' }}>📍 {d}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Recommendation Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(6,182,212,0.06)', padding: '12px 18px', borderRadius: 14, border: '1px solid rgba(6,182,212,0.15)', flexWrap: 'wrap' }}>
            <Zap style={{ width: 16, height: 16, color: '#06b6d4', flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
              Recommended AI workflow for{' '}
              <strong style={{ color: '#06b6d4' }}>{profile.name}</strong>{' '}
              operations in{' '}
              <strong style={{ color: '#06b6d4' }}>{targetDistrict}</strong>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              ✓ Sector Tools Active Below
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
