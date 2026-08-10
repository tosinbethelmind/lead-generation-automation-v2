'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { ORDERED_SECTORS } from '@/config/sectors';

export default function RoiCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(50);
  const [avgDealValue, setAvgDealValue] = useState<number>(450000);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('solar');

  // Calculation Logic:
  // With manual/legacy follow-up, ~40% of leads drop off due to slow replies (>30 mins).
  // With automated AI & instant WhatsApp routing, conversion improves by +25% to +35%.
  const lostLeadsMonthly = Math.round(monthlyLeads * 0.35);
  const lostRevenueMonthly = lostLeadsMonthly * avgDealValue * 0.15; // 15% baseline conversion rate
  const recoveredRevenueMonthly = Math.round(lostRevenueMonthly * 0.65); // Recover 65% of lost deals
  const annualRecovered = recoveredRevenueMonthly * 12;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(139,92,246,0.05) 100%)',
        border: '1px solid rgba(6,182,212,0.25)',
        borderRadius: 24,
        padding: 'clamp(20px, 4vw, 36px)',
        marginBottom: 52,
        boxShadow: '0 20px 50px rgba(6,182,212,0.05)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 100, padding: '4px 16px', marginBottom: 12 }}>
          <Calculator style={{ width: 14, height: 14, color: '#06b6d4' }} />
          <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Lagos SME ROI Estimator
          </span>
        </div>

        <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, margin: '0 0 8px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}>
          Calculate Your Lost Revenue Recovery
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          See how much revenue your business loses each month to delayed replies—and how much you recover with automated WhatsApp lead qualification.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'center' }}>
        {/* Left Sliders Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Industry Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: 8 }}>
              Select Industry Sector
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
            >
              {ORDERED_SECTORS.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#07090e', color: '#fff' }}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Leads Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Monthly Enquiries / Leads:
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'monospace' }}>
                {monthlyLeads} leads/mo
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={monthlyLeads}
              onChange={(e) => setMonthlyLeads(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
            />
          </div>

          {/* Average Deal Value Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Average Project / Sale Value (₦):
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#8b5cf6', fontFamily: 'monospace' }}>
                ₦{avgDealValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={avgDealValue}
              onChange={(e) => setAvgDealValue(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Right Dynamic Results Box */}
        <div style={{ background: 'rgba(7,9,14,0.85)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ color: '#10b981', width: 20, height: 20 }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              PROJECTED REVENUE RECOVERY
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Estimated Monthly Recovered Revenue</span>
            <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#10b981', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', marginTop: 2 }}>
              +₦{recoveredRevenueMonthly.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>/mo</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Estimated Lost Deals (Manual)</span>
              <p style={{ margin: '2px 0 0', fontWeight: 800, color: '#f87171', fontSize: '0.95rem' }}>
                ~{lostLeadsMonthly} leads/mo
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Projected Annual Lift</span>
              <p style={{ margin: '2px 0 0', fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>
                +₦{annualRecovered.toLocaleString()}/yr
              </p>
            </div>
          </div>

          <a
            href="#pricing"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            Claim This Workflow For Your Business <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
