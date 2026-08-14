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
    title: 'Lead Capture On Autopilot',
    desc: 'Capture every prospect from WhatsApp, Lagos B2B harvesters, website forms, or Instagram ads before competitors reply.',
    color: '#06b6d4',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Instant 2-Second AI Reply',
    desc: 'Human-like 24/7 AI autoresponder answers customer inquiries instantly in English & Pidgin, even while your team sleeps.',
    color: '#8b5cf6',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Smart Qualification & Audio',
    desc: 'Qualify lead budget, location (Ikeja, Lekki, Abuja), and send natural Nigerian accent WhatsApp voice notes to build fast trust.',
    color: '#ec4899',
  },
  {
    number: '04',
    icon: FileText,
    title: 'Instant PDF Quote Generation',
    desc: 'Generate accurate branded PDF quotes (Solar Quote Pro, Service Audit) with VAT/WHT calculations in under 2 minutes.',
    color: '#f59e0b',
  },
  {
    number: '05',
    icon: CreditCard,
    title: 'Automated Bank Reconciliation',
    desc: 'Share Paystack payment links or Moniepoint virtual account numbers via WhatsApp with zero manual bank confirmation delay.',
    color: '#10b981',
  },
  {
    number: '06',
    icon: BarChart3,
    title: 'Automated CRM & Follow-Up',
    desc: 'Track prospect stages, schedule smart WhatsApp follow-up reminders, and maximize customer lifetime value effortlessly.',
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
          <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 700 }}>6-Step Sales Workflow</span>
        </div>
        <h2
          id="how-it-works-heading"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
        >
          How We Turn Cold Enquiries Into Paid Customers in 6 Steps
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem', maxWidth: 680, margin: '0 auto 8px', lineHeight: 1.5 }}>
          Stop losing buyers to slow WhatsApp replies. Here is how our automated system captures, qualifies, quotes, and verifies payments for your business 24/7.
        </p>
        <p style={{ color: '#10b981', fontSize: '0.84rem', fontWeight: 600, maxWidth: 600, margin: '0 auto' }}>
          ✓ Your human team can review conversations and take over anytime in 1 click.
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
