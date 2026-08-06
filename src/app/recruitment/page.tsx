import React from 'react';
import { RecruitmentEngineWidget } from '@/components/RecruitmentEngineWidget';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';
import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';

export const metadata = {
  title: 'AI Recruitment & Talent Engine | Bethelmind Analytics',
  description: 'Position advertising, evergreen talent pool bank, automated AI CV grading, Google X-Ray candidate sourcing, and interview scheduling.',
};

export default function RecruitmentPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#070a12',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        padding: '24px clamp(12px, 4vw, 32px)',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 10% 5%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 90% 90%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), linear-gradient(160deg, #050812 0%, #070a14 40%, #060910 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Global Action Bar */}
        <WebappToolActionBar currentTool="Recruitment Engine" />

        {/* Header Navigation Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            background: 'rgba(13, 19, 33, 0.85)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '16px 24px',
            borderRadius: 18,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link
              href="/"
              style={{
                padding: '8px 12px',
                background: 'rgba(30, 41, 59, 0.8)',
                borderRadius: 12,
                color: '#94a3b8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    padding: '2px 10px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 100,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Enterprise HR & Talent Suite
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '2px 10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 100,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }}></span>
                  AI Engine Active
                </span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <Briefcase style={{ width: 22, height: 22, color: '#06b6d4' }} />
                <span>AI Recruitment & Talent Hiring Engine</span>
              </h1>
            </div>
          </div>

          <Link
            href="/admin"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.25)',
            }}
          >
            Go to Master Dashboard &rarr;
          </Link>
        </div>

        {/* Feature Highlights Cards Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 18px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              📢
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>Job Ads & Criteria</div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>Pre-screening filters</div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 18px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              🌐
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>Talent Pool Bank</div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>1-tap WhatsApp availability</div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 18px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              🔎
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>Google X-Ray Sourcing</div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>100% Free LinkedIn search</div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 18px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>AI CV Grader (0-100%)</div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>Instant suitability match</div>
            </div>
          </div>
        </div>

        {/* Recruitment Engine Main Widget */}
        <RecruitmentEngineWidget />
      </div>
    </main>
  );
}
