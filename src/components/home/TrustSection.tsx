'use client';

/**
 * @file src/components/home/TrustSection.tsx
 * Transparent trust and proof section.
 * No invented testimonials, logos, or client results.
 */

import React from 'react';
import { UserCheck, Settings, Users, CalendarClock } from 'lucide-react';

const WHAT_TO_EXPECT = [
  {
    icon: UserCheck,
    color: '#06b6d4',
    title: 'Guided Onboarding and Workflow Setup',
    desc: 'We collect your business details, configure your workflow step by step, and review it with you before going live.',
  },
  {
    icon: Settings,
    color: '#8b5cf6',
    title: 'Configurable Lead and Enquiry Processes',
    desc: 'Your workflow is set up to match your business — not forced into a generic template.',
  },
  {
    icon: Users,
    color: '#10b981',
    title: 'Human Handoff for Important Conversations',
    desc: 'Your team stays in control. AI handles first responses and capture; your people handle relationships and decisions.',
  },
  {
    icon: CalendarClock,
    color: '#f59e0b',
    title: 'Monthly Plans Designed for Growing Businesses',
    desc: 'No long-term contract. Start, adjust, or cancel on a monthly basis as your business needs evolve.',
  },
];

export default function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>What You Can Expect</span>
          </div>
          <h2
            id="trust-heading"
            style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
          >
            Clear, Honest, and Practical
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 560, margin: '0 auto' }}>
            We do not promise guaranteed results. We commit to a well-configured workflow, proper onboarding, and responsive support.
          </p>
        </div>

        {/* Expectation cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          {WHAT_TO_EXPECT.map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              style={{ background: 'rgba(7,9,14,0.6)', border: `1px solid ${color}18`, borderRadius: 18, padding: 24 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon style={{ width: 21, height: 21, color }} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '0.97rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px' }}>{title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Customer stories placeholder */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 'clamp(24px, 4vw, 36px)', textAlign: 'center', marginBottom: 32 }}>
          <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            Customer Stories
          </p>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#94a3b8', margin: '0 0 10px', fontFamily: "'Outfit', sans-serif" }}>
            Documented Customer Stories Coming Soon
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 480, margin: '0 auto' }}>
            We are working with early clients to document real workflow outcomes. We will share verified case studies here once available — not invented testimonials.
          </p>
        </div>

        {/* Company card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 20, padding: 'clamp(20px, 4vw, 30px)', display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '1.4rem' }} aria-hidden="true">🏢</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1.05rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              Bethelmind Analytics & Strategy
            </h3>
            <p style={{ margin: '0 0 2px', color: '#94a3b8', fontSize: '0.83rem' }}>📍 Lagos, Nigeria</p>
            <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Business automation and customer-acquisition workflows for Lagos SMEs. Guided onboarding, WhatsApp support, and practical sector tools.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>✓ WhatsApp support available</span>
              <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>✓ Guided onboarding process</span>
              <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>✓ Monthly, no long-term lock-in</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
