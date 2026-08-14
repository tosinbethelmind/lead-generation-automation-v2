'use client';

/**
 * @file src/components/home/SolutionsSection.tsx
 * Four clear solution cards for the homepage.
 */

import React from 'react';
import { MessageSquare, LayoutDashboard, Calculator, Workflow } from 'lucide-react';

const SOLUTIONS = [
  {
    id: 'whatsapp-assistant',
    icon: MessageSquare,
    color: '#25d366',
    title: 'WhatsApp AI Agent & Voice Note Engine',
    desc: 'Never miss a buyer. Automate 24/7 text and audio replies in natural Nigerian accent English & Pidgin, capturing lead details & sending instant quotes on autopilot.',
    action: 'See AI Assistant Demo',
    href: '#sector-tools',
  },
  {
    id: 'bank-reconciliation',
    icon: LayoutDashboard,
    color: '#06b6d4',
    title: 'Moniepoint & Paystack Transfer Verification',
    desc: 'Eliminate fake bank alert fraud. Automatically issue dedicated virtual accounts (NUBANs) per lead, verify transfers instantly, and dispatch official PDF receipts.',
    action: 'Explore Payment Engine',
    href: '#pricing',
  },
  {
    id: 'sector-tools',
    icon: Calculator,
    color: '#8b5cf6',
    title: 'Solar Quote Pro & Sector Calculators',
    desc: 'Convert complex pricing into 2-minute interactive PDF quotes. Features solar load sizing, vehicle import duty estimators, real estate spreads, and CAC filing fees.',
    action: 'Try Solar Calculator',
    href: '#sector-tools',
  },
  {
    id: 'relume-site-generator',
    icon: Workflow,
    color: '#ec4899',
    title: 'Relume UI Site Redesign & Google Speed Auditor',
    desc: 'Generate high-converting client website previews powered by Relume UI glassmorphism components, extracted Google Maps/Social Media photos, and verified Google PageSpeed audit scores.',
    action: 'Try Site Redesign Engine',
    href: '#site-generator',
  },
];

export default function SolutionsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
            <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 700 }}>Built For Maximum Sales</span>
          </div>
          <h2
            id="solutions-heading"
            style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
          >
            4 Core Engines Powering High-Growth Nigerian Enterprises
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 620, margin: '0 auto' }}>
            Custom-configured to your sales pipeline — helping your team close more deals in Lagos, Abuja, and Port Harcourt with 10x less manual effort.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
          {SOLUTIONS.map(({ id, icon: Icon, color, title, desc, action, href }) => (
            <div
              key={id}
              style={{
                background: 'rgba(7,9,14,0.6)',
                border: `1px solid ${color}20`,
                borderRadius: 20,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'border-color 0.25s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${color}50`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${color}20`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon style={{ width: 22, height: 22, color }} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px' }}>{title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65, margin: '0 0 20px', flex: 1 }}>{desc}</p>
              <div>
                <a
                  href={href}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    padding: '8px 16px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = `${color}30`;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}80`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = `${color}18`;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
                  }}
                  aria-label={`${action} for ${title}`}
                >
                  {action} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
