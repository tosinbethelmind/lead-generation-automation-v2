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
    title: 'WhatsApp CRM & Voice Note AI',
    desc: 'Respond to text & audio voice notes in Nigerian Pidgin/English, capture enquiry details, and route conversations to team reps.',
    action: 'Explore Workflow',
    href: '#sector-tools',
  },
  {
    id: 'bank-reconciliation',
    icon: LayoutDashboard,
    color: '#06b6d4',
    title: 'Bank Transfer Auto-Verification',
    desc: 'Assign dedicated virtual accounts (NUBANs) per lead to auto-verify bank transfers and dispatch instant PDF receipts.',
    action: 'Explore Payment System',
    href: '#pricing',
  },
  {
    id: 'sector-tools',
    icon: Calculator,
    color: '#8b5cf6',
    title: 'Dynamic Sector Quote Calculators',
    desc: 'Generate live Solar BOQs, vehicle VIN import duty estimates, real estate installment spreads, and CAC filing fees.',
    action: 'Explore Sector Tools',
    href: '#sector-tools',
  },
  {
    id: 'omnichannel-funnels',
    icon: Workflow,
    color: '#f59e0b',
    title: 'IG Funnels & FIRS Tax Invoicing',
    desc: 'Transfer Instagram DMs directly into WhatsApp and instantly build FIRS-compliant pro-forma invoices (VAT + WHT).',
    action: 'Explore Integrations',
    href: '#addon-modules',
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
            <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 700 }}>Solutions</span>
          </div>
          <h2
            id="solutions-heading"
            style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
          >
            Four Ways We Help Your Business
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 580, margin: '0 auto' }}>
            Each solution is configured to your business process, sector, and team — not generic out-of-the-box software.
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
              <a
                href={href}
                style={{ fontSize: '0.82rem', fontWeight: 700, color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                aria-label={`${action} for ${title}`}
              >
                {action} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
