'use client';

/**
 * @file src/components/home/HowItWorksSection.tsx
 * Six-step workflow visual for the homepage.
 */

import React from 'react';
import {
  MessageSquare,
  Zap,
  ClipboardCheck,
  FileText,
  CreditCard,
  BarChart3,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Lead Source',
    desc: 'Enquiries arrive via WhatsApp, your website widget, social media, or referrals.',
    color: '#06b6d4',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Instant First Response',
    desc: 'Automated first responses acknowledge the enquiry and capture key details — available around the clock.',
    color: '#8b5cf6',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Lead Qualification',
    desc: 'Structured questions help qualify interest and gather requirements before your team steps in.',
    color: '#ec4899',
  },
  {
    number: '04',
    icon: FileText,
    title: 'Quote or Booking',
    desc: 'Sector tools generate structured quote information or booking requests for your team to review and send.',
    color: '#f59e0b',
  },
  {
    number: '05',
    icon: CreditCard,
    title: 'Payment Handoff',
    desc: 'Payment details and instructions are shared via WhatsApp. Confirmation is handled by your team.',
    color: '#10b981',
  },
  {
    number: '06',
    icon: BarChart3,
    title: 'CRM Follow-Up',
    desc: 'Leads are tracked in a simple pipeline so your team always knows the next step for each prospect.',
    color: '#0ea5e9',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 700 }}>How It Works</span>
        </div>
        <h2
          id="how-it-works-heading"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
        >
          From First Enquiry to Organised Follow-Up
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto 8px' }}>
          A guided workflow that helps your team respond faster, follow up consistently, and keep every lead organised.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: 600, margin: '0 auto' }}>
          Your team can review conversations and take over whenever needed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {STEPS.map(({ number, icon: Icon, title, desc, color }, index) => (
          <div
            key={number}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${color}20`,
              borderRadius: 18,
              padding: 24,
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Step connector line (decorative, hidden on mobile) */}
            {index < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 32,
                  right: -10,
                  width: 20,
                  height: 2,
                  background: `linear-gradient(90deg, ${color}40, transparent)`,
                  display: 'none',
                }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
                {number}
              </span>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 18, height: 18, color }} aria-hidden="true" />
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: '#f8fafc' }}>{title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Human handoff note */}
      <div style={{ marginTop: 36, textAlign: 'center', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: '16px 24px', maxWidth: 700, margin: '36px auto 0' }}>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#10b981' }}>Human handoff built in.</strong>{' '}
          Your team can review any conversation and take over at any point. AI handles first responses and capture — your team handles relationships and decisions.
        </p>
      </div>
    </section>
  );
}
