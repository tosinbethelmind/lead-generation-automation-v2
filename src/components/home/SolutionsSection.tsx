'use client';

/**
 * @file src/components/home/SolutionsSection.tsx
 * Four clear solution cards for the homepage.
 */

import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Zap, ShieldCheck, Truck, Database, 
  Calendar, Home, HardHat, GraduationCap, Wheat, 
  ArrowRight, Sparkles, Layers, Code2
} from 'lucide-react';

const FLAGSHIP_SOLUTIONS = [
  {
    id: 'whatsapp-closer',
    number: '01',
    icon: MessageSquare,
    color: '#10b981',
    title: 'Instant WhatsApp Speed-to-Lead & Catalog Closer',
    sector: 'Retail & E-Commerce',
    desc: 'Sub-3s WhatsApp DM replies with natural Nigerian voice notes, instant catalog pricing, and automated Paystack/OPay payment links.',
    pricing: '₦15k–₦30k/mo (₦35k Setup)',
    href: '/solutions',
  },
  {
    id: 'solar-boq',
    number: '02',
    icon: Zap,
    color: '#f59e0b',
    title: 'Solar & Inverter Instant Quotation Engine',
    sector: 'Solar & Energy',
    desc: 'Interactive appliance load picker generating instant WhatsApp BOQ proposals and diesel replacement fuel savings analysis.',
    pricing: '₦25k–₦50k/mo (₦100k Setup)',
    href: '/tools/solar-quote-pro',
  },
  {
    id: 'fake-alert-proof',
    number: '03',
    icon: ShieldCheck,
    color: '#3b82f6',
    title: '"Fake Alert Proof" Bank Transfer Reconciliation',
    sector: 'Supermarkets & Wholesale',
    desc: 'Validates payments strictly via Direct NIBSS/OPay/Moniepoint webhooks with green tablet cashier notifications. Zero fake alert fraud.',
    pricing: '₦10k/mo + 0.5% cap',
    href: '/solutions',
  },
  {
    id: 'dispatch-aggregator',
    number: '04',
    icon: Truck,
    color: '#06b6d4',
    title: 'Hyperlocal Dispatch & Waybill Tracker',
    sector: 'Logistics & Haulage',
    desc: 'Island-to-Mainland distance fee comparer, automated customer SMS/WhatsApp waybill tracking, and Pay-on-Delivery cash ledger.',
    pricing: '₦20k–₦45k/mo',
    href: '/solutions',
  },
  {
    id: 'tenant-escrow',
    number: '05',
    icon: Home,
    color: '#8b5cf6',
    title: 'Tenant Service Charge & Rent Escrow Manager',
    sector: 'Real Estate & Landlords',
    desc: 'Automated 60/30/7-day rent countdowns, digital stamped receipts, and facility diesel maintenance breakdown per tenant unit.',
    pricing: '₦50k–₦150k/mo',
    href: '/solutions',
  },
  {
    id: 'booking-lock',
    number: '06',
    icon: Calendar,
    color: '#ec4899',
    title: 'Automated Service Booking & Deposit Lock',
    sector: 'Clinics, Spas & Salons',
    desc: '24/7 appointment calendar locking client slots with upfront OPay/card commitments to eliminate 40% no-show losses.',
    pricing: '₦15k–₦35k/mo',
    href: '/solutions',
  },
];

export default function SolutionsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      style={{ 
        padding: '80px clamp(16px, 4vw, 40px)', 
        background: 'rgba(255,255,255,0.01)', 
        borderTop: '1px solid rgba(255,255,255,0.04)', 
        borderBottom: '1px solid rgba(255,255,255,0.04)' 
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 100, padding: '5px 16px', marginBottom: 14 }}>
            <Sparkles style={{ width: 14, height: 14, color: '#10b981' }} />
            <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 700 }}>The 10 High-Conversion Sector Monetization Tools</span>
          </div>
          <h2
            id="solutions-heading"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
          >
            Ready-to-Pitch B2B Business Revenue Suite
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.96rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
            Eliminate operational leaks and after-hours customer drop-offs. Deploy as a <strong>24-Hour Done-For-You Turnkey Prototype</strong> (₦75k deposit) or a <strong>1-Line Embed Script</strong> on your current website.
          </p>
        </div>

        {/* SOLUTIONS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 36 }}>
          {FLAGSHIP_SOLUTIONS.map(({ id, number, icon: Icon, color, title, sector, desc, pricing, href }) => (
            <div
              key={id}
              style={{
                background: 'rgba(7,10,18,0.7)',
                border: `1px solid ${color}22`,
                borderRadius: 20,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.25s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${color}60`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${color}22`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 22, height: 22, color }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color, background: `${color}10`, padding: '3px 10px', borderRadius: 100, border: `1px solid ${color}20` }}>
                  {sector}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif" }}>
                {number}. {title}
              </h3>

              <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                {desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Typical Pricing:</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>{pricing}</span>
                </div>

                <Link
                  href={href}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: color,
                    background: `${color}12`,
                    border: `1px solid ${color}30`,
                    padding: '7px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Explore Demo</span>
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FULL SUITE EXPLORATION CALLOUT */}
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '24px 28px', display: 'flex', flexDirection: 'column', md: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Complete 10-Sector Architecture Available
            </span>
            <h4 style={{ margin: '4px 0 6px', fontSize: '1.18rem', fontWeight: 800, color: '#f8fafc' }}>
              Construction, Private Schools, Agribusiness, CAC Law & HMO Portals
            </h4>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
              Explore the full interactive catalog of all 10 specialized monetization engines with instant ROI calculations and 1-click WhatsApp quote links.
            </p>
          </div>

          <Link
            href="/solutions"
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: '#10b981',
              color: '#022c22',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
            }}
          >
            <span>View All 10 Solutions</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
