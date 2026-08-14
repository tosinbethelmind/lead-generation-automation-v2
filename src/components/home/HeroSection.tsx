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
        paddingTop: 'clamp(100px, 14vw, 135px)',
        paddingBottom: 70,
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        maxWidth: 1280,
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Radiant Spotlight Beam & Multi-Layered Aurora Horizon */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Top Centered Conic Spotlight */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at top, rgba(6,182,212,0.22) 0%, rgba(99,102,241,0.12) 40%, rgba(3,7,18,0) 70%)',
          filter: 'blur(75px)',
          animation: 'glowPulse 9s ease-in-out infinite',
        }} />

        {/* Ambient Secondary Purple Glow */}
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, rgba(139,92,246,0.08) 50%, rgba(3,7,18,0) 70%)',
          filter: 'blur(90px)',
          animation: 'auroraFlow 20s ease-in-out infinite alternate',
        }} />

        {/* Subtle Horizon Line Glow */}
        <div style={{
          position: 'absolute',
          top: '280px',
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.4) 50%, transparent 100%)',
          filter: 'blur(0.5px)',
          opacity: 0.6
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

        {/* Floating Top Pill Badge */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: 100,
            padding: '6px 18px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
            animation: 'floatSlow 6s ease-in-out infinite'
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22d3ee',
              boxShadow: '0 0 10px #22d3ee',
              flexShrink: 0
            }} aria-hidden="true" />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              background: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ⚡ 24/7 AI Sales Closer & Lead Automation
            </span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.78rem', fontWeight: 800 }}>
              <Star size={13} fill="#fbbf24" />
              <span>4.9/5 Rating (1,200+ Businesses)</span>
            </div>
          </div>
        </div>

        {/* Refined Luxury Headline */}
        <h1
          id="hero-heading"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2.1rem, 4.8vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 auto 18px',
            maxWidth: 960,
            fontFamily: "'Outfit', sans-serif",
            color: '#ffffff',
            letterSpacing: '-0.035em',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)'
          }}
        >
          Never Lose Another Customer To Slow Replies.<br />
          <span className="luxury-gradient-text">
            Turn Every WhatsApp Inquiry & Click Into Cash 24/7.
          </span>
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 'clamp(0.98rem, 1.8vw, 1.14rem)',
          maxWidth: 760,
          margin: '0 auto 24px',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Capture verified B2B leads across Lagos, Abuja, and Port Harcourt. Qualify prospects instantly with human-like Nigerian accent voice notes, calculate automated PDF quotes in 2 minutes, and verify bank payments on autopilot.
        </p>

        {/* Trust Badges Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          color: '#94a3b8',
          fontSize: '0.82rem',
          marginBottom: 32
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f1f5f9', fontWeight: 600 }}>
            <ShieldCheck size={15} style={{ color: '#10b981' }} /> Moniepoint & Paystack Payment Auto-Verification
          </span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Nigerian Accent WhatsApp Voice Note AI</span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>10,000+ Verified B2B Lagos Leads</span>
        </div>

        {/* High-Ticket CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
          <a
            id="hero-demo-cta"
            href={demoWaLink}
            target="_blank"
            rel="noreferrer noopener"
            className="luxury-btn-primary"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 14,
              padding: '14px 32px',
              fontWeight: 900,
              fontSize: '0.96rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              letterSpacing: '0.01em',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            See a Live Demo on WhatsApp <ArrowRight style={{ width: 18, height: 18 }} aria-hidden="true" />
          </a>
          <button
            id="hero-setup-cta"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              cursor: 'pointer',
              borderRadius: 14,
              padding: '14px 28px',
              fontWeight: 700,
              fontSize: '0.96rem',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(6,182,212,0.5)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Get 60-Sec Recommended Setup
          </button>
        </div>

        {/* Centerpiece Interactive 3D Glass Command Console & Live Simulator */}
        <div className="luxury-glass-panel" style={{
          borderRadius: 24,
          padding: 'clamp(20px, 3.5vw, 32px)',
          maxWidth: 1180,
          margin: '0 auto',
          boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>

          {/* Console Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                LIVE AI COMMAND CENTER & LEAD AUTOMATION SIMULATOR
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                ⚡ Auto-Response: &lt; 2.4s
              </span>
              <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)' }}>
                ● 100% Turnkey Handover
              </span>
            </div>
          </div>

          {/* Two-Column Interactive Simulation Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>

            {/* Left: WhatsApp Voice Closer Simulation Card */}
            <div style={{
              background: 'rgba(7, 11, 22, 0.85)',
              borderRadius: 18,
              padding: 18,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bot size={14} /> WhatsApp AI Voice Closer
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Active Nigerian Accent</span>
              </div>

              {/* Simulated Customer WhatsApp Bubble */}
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', marginBottom: 10, maxWidth: '85%' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0' }}>
                  "Hello! How much is 5kVA Solar for my duplex in Lekki with 2 ACs?"
                </p>
                <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', textAlign: 'right', marginTop: 2 }}>11:42 AM</span>
              </div>

              {/* Simulated AI Voice Note Response */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.12) 100%)',
                border: '1px solid rgba(6,182,212,0.3)',
                padding: '12px 14px',
                borderRadius: '14px 14px 4px 14px',
                marginLeft: 'auto',
                maxWidth: '92%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712', flexShrink: 0 }}>
                    <Play size={13} fill="#030712" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ width: 3, height: 12, background: '#22d3ee', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 18, background: '#22d3ee', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 8, background: '#818cf8', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 22, background: '#22d3ee', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 14, background: '#818cf8', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 20, background: '#22d3ee', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 10, background: '#818cf8', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 16, background: '#22d3ee', borderRadius: 2 }} />
                      <span style={{ width: 3, height: 7, background: '#818cf8', borderRadius: 2 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#22d3ee', fontWeight: 700 }}>0:18</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.4 }}>
                  🎙️ <em>"Good day Chief! For your Lekki duplex with 2 Inverter ACs, you need our 5kVA Hybrid + 48V 100Ah Lithium. I've prepared your PDF quote..."</em>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 6 }}>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>📄 Solar_Quote_Lekki_5kVA.pdf (Ready)</span>
                </div>
              </div>
            </div>

            {/* Right: Business Profiler & Instant Setup */}
            <div style={{
              background: 'rgba(7, 11, 22, 0.85)',
              borderRadius: 18,
              padding: 18,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Sparkles size={14} /> Instant Business Profiler
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600, marginBottom: 4 }}>Industry Sector</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.84rem', outline: 'none' }}
                    >
                      {ORDERED_SECTORS.map((s) => (
                        <option key={s.id} value={s.id} style={{ background: '#07090e', color: '#fff' }}>
                          {s.emoji} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600, marginBottom: 4 }}>Target Location</label>
                    <select
                      value={targetDistrict}
                      onChange={(e) => setTargetDistrict(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.84rem', outline: 'none' }}
                    >
                      {LAGOS_DISTRICTS.map((d) => (
                        <option key={d} value={d} style={{ background: '#07090e', color: '#fff' }}>📍 {d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Business Name input */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600, marginBottom: 4 }}>Your Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Global Solutions"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Live Simulated Conversion Metric */}
              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', padding: '10px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
                  Tool: <strong style={{ color: '#22d3ee' }}>{profile.topToolName}</strong>
                </span>
                <span style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, background: 'rgba(16,185,129,0.12)', padding: '3px 8px', borderRadius: 6 }}>
                  +4.2x Faster Conversion
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Live Verification Stream Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(0,0,0,0.4)',
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Real-time Moniepoint/Paystack Settlement Verified • 1-Minute WhatsApp Webhook Handover
            </span>
            <a href="#solutions" style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>
              Explore All 8 Sector Workflows →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
