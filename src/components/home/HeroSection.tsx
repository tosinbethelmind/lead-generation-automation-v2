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
        paddingTop: 'clamp(120px, 16vw, 150px)',
        paddingBottom: 80,
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        maxWidth: 1240,
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Multi-Layered Ultra-Luxury Aurora Mesh & Ambient Lighting */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Glowing Aurora Spheres */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(99,102,241,0.15) 40%, rgba(7,10,20,0) 70%)',
          filter: 'blur(80px)',
          animation: 'auroraFlow 18s ease-in-out infinite alternate',
          opacity: 0.9
        }} />

        <div style={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(139,92,246,0.12) 45%, rgba(7,10,20,0) 70%)',
          filter: 'blur(90px)',
          animation: 'auroraFlow 22s ease-in-out infinite alternate-reverse',
        }} />

        <div style={{
          position: 'absolute',
          bottom: '5%',
          left: '-10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(7,10,20,0) 70%)',
          filter: 'blur(80px)',
          animation: 'glowPulse 8s ease-in-out infinite',
        }} />

        {/* Ambient Grid Overlay Graphic */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)'
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

        {/* Animated Eyebrow Badge */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(10, 15, 29, 0.85)',
            border: '1px solid rgba(6,182,212,0.35)',
            borderRadius: 100,
            padding: '7px 20px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 24px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
            animation: 'floatSlow 6s ease-in-out infinite'
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22d3ee',
              boxShadow: '0 0 12px #22d3ee, 0 0 4px #22d3ee',
              flexShrink: 0
            }} aria-hidden="true" />
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              background: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ⚡ Powered by Relume UI Engine & Google PageSpeed AI
            </span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}>
              <Star size={13} fill="#fbbf24" />
              <span>4.9/5 Rating (1,200+ Businesses)</span>
            </div>
          </div>
        </div>

        {/* Ultra-Luxury Headline */}
        <h1
          id="hero-heading"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2.3rem, 6.2vw, 4.1rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            margin: '0 auto 20px',
            maxWidth: 1020,
            fontFamily: "'Outfit', sans-serif",
            color: '#ffffff',
            letterSpacing: '-0.035em',
            textShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          Never Lose Another Customer To Slow Replies.<br />
          <span className="luxury-gradient-text" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Turn Every WhatsApp Inquiry & Click Into Cash 24/7.
          </span>
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#cbd5e1',
          fontSize: 'clamp(1.02rem, 2.1vw, 1.22rem)',
          maxWidth: 820,
          margin: '0 auto 22px',
          lineHeight: 1.65,
          fontWeight: 400
        }}>
          Capture verified B2B leads across Lagos, Abuja, and Port Harcourt. Qualify prospects instantly with human-like Nigerian accent voice notes, calculate automated PDF quotes in 2 minutes, and verify bank payments on autopilot.
        </p>

        {/* Trust Badges Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          color: '#94a3b8',
          fontSize: '0.86rem',
          marginBottom: 42
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f1f5f9', fontWeight: 600 }}>
            <ShieldCheck size={16} style={{ color: '#10b981' }} /> Moniepoint & Paystack Payment Auto-Verification
          </span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Nigerian Accent WhatsApp Voice Note AI</span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>10,000+ Verified B2B Lagos Leads</span>
        </div>

        {/* High-Ticket CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
          <a
            id="hero-demo-cta"
            href={demoWaLink}
            target="_blank"
            rel="noreferrer noopener"
            className="luxury-btn-primary"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 16,
              padding: '16px 36px',
              fontWeight: 900,
              fontSize: '1.02rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              letterSpacing: '0.01em',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            See a Live Demo on WhatsApp <ArrowRight style={{ width: 19, height: 19 }} aria-hidden="true" />
          </a>
          <button
            id="hero-setup-cta"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: '#ffffff',
              cursor: 'pointer',
              borderRadius: 16,
              padding: '16px 34px',
              fontWeight: 700,
              fontSize: '1.02rem',
              border: '1px solid rgba(255,255,255,0.16)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(6,182,212,0.5)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.16)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Get 60-Sec Recommended Setup
          </button>
        </div>

        {/* Business Profiler Command Console */}
        <div className="luxury-glass-panel" style={{
          background: 'rgba(15,23,42,0.65)',
          border: '1px solid rgba(6,182,212,0.25)',
          borderRadius: 28,
          padding: 'clamp(24px, 4vw, 38px)',
          maxWidth: 1140,
          margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)'
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles style={{ width: 18, height: 18, color: '#22d3ee' }} aria-hidden="true" />
            </div>
            <h2 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
              Tailor a recommended lead automation workflow for your business:
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 24, paddingLeft: 44 }}>
            Instant setup simulation. Select your industry to test live tools and active Nigerian workflows.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 24 }}>

            {/* Business Name */}
            <div>
              <label htmlFor="profiler-business-name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
                Business Name
              </label>
              <input
                id="profiler-business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Global Solutions"
                maxLength={80}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(7, 10, 20, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                }}
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="profiler-industry" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
                Industry / Sector
              </label>
              <select
                id="profiler-industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(7, 10, 20, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                }}
              >
                {ORDERED_SECTORS.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: '#07090e', color: '#ffffff' }}>
                    {s.emoji} {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Region */}
            <div>
              <label htmlFor="profiler-district" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
                Primary Target Region
              </label>
              <select
                id="profiler-district"
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(7, 10, 20, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                }}
              >
                {LAGOS_DISTRICTS.map((d) => (
                  <option key={d} value={d} style={{ background: '#07090e', color: '#ffffff' }}>
                    📍 {d}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Real-time Recommendation Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'linear-gradient(90deg, rgba(6,182,212,0.1) 0%, rgba(99,102,241,0.08) 100%)',
            padding: '14px 20px',
            borderRadius: 16,
            border: '1px solid rgba(6,182,212,0.25)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(6,182,212,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap style={{ width: 14, height: 14, color: '#22d3ee' }} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
              Recommended AI workflow for <strong style={{ color: '#22d3ee' }}>{profile.name}</strong> operations in <strong style={{ color: '#22d3ee' }}>{targetDistrict}</strong>
            </span>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)' }}>
              ✓ Sector Tools Active Below
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
