'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Sparkles, ShieldCheck, Play, Pause, Bot, Sun, Truck, RefreshCw } from 'lucide-react';
import { ORDERED_SECTORS, LAGOS_DISTRICTS, getSectorById } from '@/config/sectors';
import { paymentConfig, buildWhatsAppLink } from '@/config/payment';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import ShaderGradientLiquidLogo from '@/components/three/ShaderGradientLiquidLogo';
import { LiquidGlassCard } from '@/components/three/LiquidGlass';

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

  // Interactive Command Console State
  const [activeSimTab, setActiveSimTab] = useState<'whatsapp' | 'solar' | 'bank' | 'dispatch'>('whatsapp');

  // Real Audio Voice Note State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sample_voice_ng.mp3');
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 15;
          setAudioProgress((cur / dur) * 100);
          const mins = Math.floor(cur / 60);
          const secs = Math.floor(cur % 60);
          setAudioCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
        setAudioCurrentTime('0:00');
      };
      audioRef.current.onerror = () => {
        setIsPlayingAudio(false);
      };
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio playback notice:', err);
      });
    }
  };

  // Solar BOQ Calculator State
  const [solarTier, setSolarTier] = useState<'3.5kva' | '5kva' | '10kva'>('5kva');
  const [solarAppliances, setSolarAppliances] = useState<{ [key: string]: boolean }>({
    ac: true,
    fridge: true,
    pump: false,
    tv: true,
    lighting: true,
  });

  const toggleAppliance = (key: string) => {
    setSolarAppliances((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculatedSolar = useMemo(() => {
    let loadWatts = 150; // base idle
    if (solarAppliances.ac) loadWatts += 1200;
    if (solarAppliances.fridge) loadWatts += 350;
    if (solarAppliances.pump) loadWatts += 750;
    if (solarAppliances.tv) loadWatts += 180;
    if (solarAppliances.lighting) loadWatts += 120;

    let tierLabel = '5kVA Pure Sine Wave';
    let battery = '48V 100Ah (5.12kWh) LiFePO4';
    let panels = '6x 550W Tier-1 Mono PERC';
    let fuelSaved = '₦185,000 / month';

    if (solarTier === '3.5kva') {
      tierLabel = '3.5kVA Pure Sine Wave';
      battery = '24V 200Ah (4.8kWh) LiFePO4';
      panels = '4x 550W Tier-1 Mono PERC';
      fuelSaved = '₦125,000 / month';
    } else if (solarTier === '10kva') {
      tierLabel = '10kVA Commercial Hybrid';
      battery = '48V 300Ah (15.36kWh) LiFePO4';
      panels = '12x 550W Tier-1 Mono PERC';
      fuelSaved = '₦360,000 / month';
    }

    return { loadWatts, tierLabel, battery, panels, fuelSaved };
  }, [solarTier, solarAppliances]);

  // Bank Webhook Reconciliation Simulation State
  const [bankStep, setBankStep] = useState<'idle' | 'detecting' | 'verifying' | 'verified'>('idle');

  const runBankSim = () => {
    setBankStep('detecting');
    setTimeout(() => {
      setBankStep('verifying');
      setTimeout(() => {
        setBankStep('verified');
      }, 700);
    }, 600);
  };

  // Dispatch Aggregator State
  const [dispatchRoute, setDispatchRoute] = useState<'ikeja-lekki' | 'yaba-vi' | 'surulere-ikeja'>('ikeja-lekki');

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
            <ShaderGradientLiquidLogo size={24} initials="⚡" palette="bethelmind" />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              background: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ⚡ Luxury Business Websites & 24/7 AI WhatsApp Quoters
            </span>
            <span className="hidden sm:inline" style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 4, color: '#34d399', fontSize: '0.78rem', fontWeight: 800 }}>
              <span>₦0 Upfront Preview • 48h Handover</span>
            </div>
          </div>
        </div>

        {/* Refined Luxury Headline */}
        <h1
          id="hero-heading"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 4.2vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 auto 14px',
            maxWidth: 960,
            fontFamily: "'Outfit', sans-serif",
            color: '#ffffff',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)'
          }}
        >
          Never Lose Another Customer To Slow Replies.<br />
          <span className="luxury-gradient-text">
            24/7 WhatsApp AI Quoting Assistant & Luxury Business Website.
          </span>
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 'clamp(0.92rem, 1.6vw, 1.12rem)',
          maxWidth: 720,
          margin: '0 auto 20px',
          lineHeight: 1.5,
          fontWeight: 400
        }}>
          Convert customers on autopilot. We build your custom website + 24/7 WhatsApp assistant that replies in &lt; 2.4s with natural Nigerian voice notes, calculates prices, and takes verified orders while you sleep.
        </p>

        {/* Trust Badges Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          color: '#94a3b8',
          fontSize: '0.8rem',
          marginBottom: 28
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f1f5f9', fontWeight: 600 }}>
            <ShieldCheck size={15} style={{ color: '#10b981' }} /> 50% Milestone Deposit • 48-Hour Live Handover
          </span>
          <span className="hidden sm:inline" style={{ color: '#334155' }}>•</span>
          <span className="hidden sm:inline" style={{ color: '#f1f5f9', fontWeight: 600 }}>Lagos Closer Desk (0802 279 1227)</span>
        </div>

        {/* High-Ticket CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
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
              padding: '14px 28px',
              fontWeight: 900,
              fontSize: '0.96rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '0.01em',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 30px rgba(6, 182, 212, 0.35)',
              boxSizing: 'border-box',
              maxWidth: '100%',
              textAlign: 'center'
            }}
          >
            🟢 Test 2-Sec WhatsApp Demo →
          </a>
          <button
            id="hero-setup-cta"
            onClick={() => {
              const el = document.getElementById('sector-tools');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setIsModalOpen(true);
            }}
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
              justifyContent: 'center',
              gap: 8,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxSizing: 'border-box',
              maxWidth: '100%',
              textAlign: 'center'
            }}
          >
            Explore Specialized Sector Tools ↓
          </button>
        </div>

        {/* Centerpiece Interactive 3D Glass Command Console & Live Simulator */}
        <div id="live-demo" style={{ scrollMarginTop: 90 }}>
        <LiquidGlassCard
          glowColor="#06b6d4"
          borderRadius={24}
          padding="clamp(18px, 3vw, 28px)"
          style={{ maxWidth: 1180, margin: '0 auto' }}
        >

          {/* Console Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 14, marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                LIVE AI COMMAND CENTER & MULTI-SECTOR CONVERSION ENGINE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                ⚡ Speed-to-Lead: &lt; 2.4s
              </span>
              <span style={{ fontSize: '0.74rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>
                ● Lagos Desk Active
              </span>
            </div>
          </div>

          {/* 4 Interactive Feature Selector Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setActiveSimTab('whatsapp')}
              style={{
                background: activeSimTab === 'whatsapp' ? 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(99,102,241,0.25))' : 'rgba(15,23,42,0.6)',
                border: activeSimTab === 'whatsapp' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                color: activeSimTab === 'whatsapp' ? '#ffffff' : '#94a3b8',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={15} style={{ color: '#22d3ee' }} />
              <span>24/7 WhatsApp Voice Closer</span>
            </button>

            <button
              onClick={() => setActiveSimTab('solar')}
              style={{
                background: activeSimTab === 'solar' ? 'linear-gradient(135deg, rgba(234,179,8,0.25), rgba(249,115,22,0.25))' : 'rgba(15,23,42,0.6)',
                border: activeSimTab === 'solar' ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.08)',
                color: activeSimTab === 'solar' ? '#ffffff' : '#94a3b8',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Sun size={15} style={{ color: '#fbbf24' }} />
              <span>Solar & Inverter BOQ Sizer</span>
            </button>

            <button
              onClick={() => setActiveSimTab('bank')}
              style={{
                background: activeSimTab === 'bank' ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.25))' : 'rgba(15,23,42,0.6)',
                border: activeSimTab === 'bank' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                color: activeSimTab === 'bank' ? '#ffffff' : '#94a3b8',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={15} style={{ color: '#34d399' }} />
              <span>&quot;Fake Alert Proof&quot; Bank Webhook</span>
            </button>

            <button
              onClick={() => setActiveSimTab('dispatch')}
              style={{
                background: activeSimTab === 'dispatch' ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.25))' : 'rgba(15,23,42,0.6)',
                border: activeSimTab === 'dispatch' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                color: activeSimTab === 'dispatch' ? '#ffffff' : '#94a3b8',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Truck size={15} style={{ color: '#c084fc' }} />
              <span>Hyperlocal Dispatch Aggregator</span>
            </button>
          </div>

          {/* Tab 1: WhatsApp Voice Closer */}
          {activeSimTab === 'whatsapp' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 18 }}>
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
                    <Bot size={14} /> Interactive Audio Player
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>Active Voice Sample (NG)</span>
                </div>

                {/* Simulated Customer WhatsApp Bubble */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', marginBottom: 10, maxWidth: '85%' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0' }}>
                    &quot;Hello! How much is 5kVA Solar for my duplex in Lekki with 2 ACs?&quot;
                  </p>
                  <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', textAlign: 'right', marginTop: 2 }}>11:42 AM</span>
                </div>

                {/* Interactive AI Voice Note Player Response */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(99,102,241,0.14) 100%)',
                  border: isPlayingAudio ? '1px solid #22d3ee' : '1px solid rgba(6,182,212,0.3)',
                  padding: '12px 14px',
                  borderRadius: '14px 14px 4px 14px',
                  marginLeft: 'auto',
                  maxWidth: '92%',
                  boxShadow: isPlayingAudio ? '0 0 16px rgba(6,182,212,0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <button
                      onClick={toggleAudio}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: '#06b6d4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#030712',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(6,182,212,0.4)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      title={isPlayingAudio ? 'Pause Voice Note' : 'Play Nigerian Voice Note'}
                    >
                      {isPlayingAudio ? <Pause size={14} fill="#030712" /> : <Play size={14} fill="#030712" style={{ marginLeft: 2 }} />}
                    </button>

                    {/* Animated Audio Waveform EQ Bars */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {[14, 22, 10, 26, 18, 24, 12, 20, 8, 16, 22, 12, 18].map((h, idx) => (
                        <span
                          key={idx}
                          style={{
                            width: 3,
                            height: isPlayingAudio ? Math.max(6, (idx % 2 === 0 ? h : h * 0.75)) : h * 0.45,
                            background: idx % 2 === 0 ? '#22d3ee' : '#818cf8',
                            borderRadius: 2,
                            animation: isPlayingAudio ? `glowPulse ${0.5 + (idx % 4) * 0.2}s ease-in-out infinite alternate` : 'none',
                            transition: 'height 0.2s ease'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#22d3ee', fontWeight: 800 }}>
                      {isPlayingAudio ? audioCurrentTime : '0:15'}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${audioProgress}%`, height: '100%', background: '#22d3ee', transition: 'width 0.1s linear' }} />
                  </div>

                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.4 }}>
                    🎙️ <em>&quot;Good day Chief! For your Lekki duplex with 2 Inverter ACs, you need our 5kVA Hybrid + 48V 100Ah Lithium. I&apos;ve prepared your PDF quote...&quot;</em>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>📄 Solar_Quote_Lekki_5kVA.pdf (Ready to send)</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 10, marginBottom: 12 }}>
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
          )}

          {/* Tab 2: Solar & Inverter BOQ Sizer (Companion: Solar ROI Proposal Builder) */}
          {activeSimTab === 'solar' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 18 }}>
              {/* Left: Load & Appliance Configurator */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sun size={15} /> Select Inverter Capacity
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Real-time BOQ Engine</span>
                </div>

                {/* Tier Presets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                  {[
                    { id: '3.5kva', label: '3.5kVA', sub: 'Flat / SME' },
                    { id: '5kva', label: '5.0kVA', sub: 'Duplex Std' },
                    { id: '10kva', label: '10.0kVA', sub: 'Commercial' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSolarTier(t.id as '3.5kva' | '5kva' | '10kva')}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 10,
                        border: solarTier === t.id ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.08)',
                        background: solarTier === t.id ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.03)',
                        color: solarTier === t.id ? '#fbbf24' : '#94a3b8',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{t.label}</div>
                      <div style={{ fontSize: '0.66rem', opacity: 0.8 }}>{t.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Appliance Toggles */}
                <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: 8 }}>
                  Active Household / Office Appliances:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { key: 'ac', label: '1.5HP Inverter AC (+1,200W)' },
                    { key: 'fridge', label: 'Double-Door Fridge (+350W)' },
                    { key: 'pump', label: '1HP Water Pump (+750W)' },
                    { key: 'tv', label: '65" 4K Smart TV (+180W)' },
                    { key: 'lighting', label: 'LED Lighting & Wi-Fi (+120W)' },
                  ].map((app) => (
                    <button
                      key={app.key}
                      onClick={() => toggleAppliance(app.key)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 8,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: solarAppliances[app.key] ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        background: solarAppliances[app.key] ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                        color: solarAppliances[app.key] ? '#34d399' : '#64748b',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {solarAppliances[app.key] ? '✓ ' : '+ '}{app.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Live Sizing Output & Fuel Savings */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: '1px solid rgba(234,179,8,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                      ⚡ Instant Engineered BOQ
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      Continuous Load: {calculatedSolar.loadWatts}W
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
                      <span>Inverter System:</span>
                      <strong style={{ color: '#fff' }}>{calculatedSolar.tierLabel}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
                      <span>Lithium Storage:</span>
                      <strong style={{ color: '#22d3ee' }}>{calculatedSolar.battery}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
                      <span>Solar PV Array:</span>
                      <strong style={{ color: '#fbbf24' }}>{calculatedSolar.panels}</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', padding: '8px 12px', borderRadius: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Monthly Gen Fuel Savings (₦1,250/L petrol benchmark):</span>
                    <strong style={{ fontSize: '0.96rem', color: '#fbbf24' }}>{calculatedSolar.fuelSaved}</strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Analytics! I generated an instant Solar BOQ for a ${calculatedSolar.tierLabel} (${calculatedSolar.loadWatts}W peak load) with estimated monthly savings of ${calculatedSolar.fuelSaved}. Please provide delivery & installation timeline.`)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    padding: '10px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(234,179,8,0.3)'
                  }}
                >
                  🟢 Claim WhatsApp BOQ Spec Sheet →
                </a>
              </div>
            </div>
          )}

          {/* Tab 3: Fake Alert Proof Bank Webhook (Companion: bill-payment-app) */}
          {activeSimTab === 'bank' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 18 }}>
              {/* Left: Transaction Trigger */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} /> Automated Bank Ledger Reconciler
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Moniepoint & OPay Webhook</span>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, margin: '0 0 14px' }}>
                  Eliminates fake SMS alerts and fraudulent mobile banking screenshots entirely. When customers transfer funds, our server verifies the cryptographic SHA-512 webhook before dispensing product or service.
                </p>

                <div style={{ background: 'rgba(15,23,42,0.8)', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', marginBottom: 4 }}>
                    <span>Simulated Transaction:</span>
                    <strong style={{ color: '#fff' }}>₦75,000.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', marginBottom: 4 }}>
                    <span>Customer Sender:</span>
                    <strong style={{ color: '#cbd5e1' }}>GTBank Transfer</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8' }}>
                    <span>Beneficiary:</span>
                    <strong style={{ color: '#34d399' }}>Moniepoint (6805375225)</strong>
                  </div>
                </div>

                <button
                  onClick={runBankSim}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: bankStep === 'verifying' || bankStep === 'detecting' ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <RefreshCw size={14} className={bankStep === 'verifying' || bankStep === 'detecting' ? 'animate-spin' : ''} />
                  <span>{bankStep === 'idle' ? '▶ Simulate Live Customer Bank Transfer' : 'Re-test Webhook Verification'}</span>
                </button>
              </div>

              {/* Right: Live Security Ledger Verification Output */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: bankStep === 'verified' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                    Live Cryptographic Ledger Sequence
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.74rem' }}>
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: bankStep !== 'idle' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                      border: bankStep !== 'idle' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      color: bankStep !== 'idle' ? '#34d399' : '#64748b'
                    }}>
                      Step 1: Inbound NIP Bank Packet Received ({bankStep !== 'idle' ? '✅ Captured' : 'Waiting...'})
                    </div>

                    <div style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: bankStep === 'verifying' || bankStep === 'verified' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.02)',
                      border: bankStep === 'verifying' || bankStep === 'verified' ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      color: bankStep === 'verifying' || bankStep === 'verified' ? '#22d3ee' : '#64748b'
                    }}>
                      Step 2: HMAC SHA-512 Ledger Signature Validated in &lt; 780ms
                    </div>

                    <div style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: bankStep === 'verified' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.02)',
                      border: bankStep === 'verified' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                      color: bankStep === 'verified' ? '#ffffff' : '#64748b'
                    }}>
                      Step 3: {bankStep === 'verified' ? '🛡️ 100% Confirmed Settlement • Auto-Dispatched WhatsApp Receipt' : 'Step 3: Auto-Receipt Delivery'}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 10, marginTop: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    ● Zero Fake Alert Protection Active for All SME Clients
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Hyperlocal Dispatch Aggregator */}
          {activeSimTab === 'dispatch' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 18 }}>
              {/* Left: Route Selector */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={16} /> Lagos Delivery Route Selector
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Waybill Auto-Tracker</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {[
                    { id: 'ikeja-lekki', label: 'Ikeja GRA ➔ Lekki Phase 1', dist: '24.5 km' },
                    { id: 'yaba-vi', label: 'Yaba Tech Corridor ➔ Victoria Island', dist: '12.8 km' },
                    { id: 'surulere-ikeja', label: 'Surulere ➔ Ikeja City Mall', dist: '16.2 km' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setDispatchRoute(r.id as 'ikeja-lekki' | 'yaba-vi' | 'surulere-ikeja')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: dispatchRoute === r.id ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.08)',
                        background: dispatchRoute === r.id ? 'rgba(192,132,252,0.18)' : 'rgba(255,255,255,0.03)',
                        color: dispatchRoute === r.id ? '#ffffff' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{r.label}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{r.dist}</span>
                    </button>
                  ))}
                </div>

                <div style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.2)', padding: '10px', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#e2e8f0', lineHeight: 1.4, display: 'block' }}>
                    Automatically compares 3 courier APIs in real-time, selects the most affordable verified rider, and sends live SMS tracking link to buyer.
                  </span>
                </div>
              </div>

              {/* Right: Live Courier Comparison Matrix */}
              <div style={{
                background: 'rgba(7, 11, 22, 0.85)',
                borderRadius: 18,
                padding: 18,
                border: '1px solid rgba(192,132,252,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                    Live Price & ETA Matrix ({dispatchRoute})
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>GIG Logistics</span>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>~3h 15m</span>
                      <strong style={{ fontSize: '0.82rem', color: '#fff' }}>₦3,800</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Gokada Express</span>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>~52 mins</span>
                      <strong style={{ fontSize: '0.82rem', color: '#fff' }}>₦2,400</strong>
                    </div>

                    {/* Bethelmind Local Pool Highlight */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(16,185,129,0.18)', borderRadius: 8, border: '1px solid #10b981' }}>
                      <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>★ Bethelmind Local Pool</span>
                      <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>~34 mins (Fastest)</span>
                      <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>₦1,850</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Saved vs Standard:</span>
                  <span style={{ fontSize: '0.84rem', color: '#34d399', fontWeight: 800 }}>₦1,950 per parcel</span>
                </div>
              </div>
            </div>
          )}

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
              Real-time Moniepoint/OPay Webhook Verification • 100% Genuine Nigerian SME Workflows
            </span>
            <a href="#solutions" style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 700, textDecoration: 'none', marginLeft: 'auto' }}>
              Explore All 8 Sector Workflows →
            </a>
          </div>

        </LiquidGlassCard>
        </div>

      </div>
    </section>
  );
}
