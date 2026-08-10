'use client';

/**
 * @file src/components/home/CrmPreviewSection.tsx
 * Illustrative CRM pipeline preview.
 * All data is clearly labelled as demo/sample — no real client data.
 */

import React from 'react';

const DEMO_COLUMNS = [
  {
    stage: 'New Enquiry',
    color: '#64748b',
    demoCard: { name: 'Sample Solar Company', loc: 'Ikeja', note: 'Requested BOQ quote' },
  },
  {
    stage: 'Contacted',
    color: '#06b6d4',
    demoCard: { name: 'Example Property Firm', loc: 'Lekki Phase 1', note: 'Sent listing details' },
  },
  {
    stage: 'Qualified',
    color: '#8b5cf6',
    demoCard: { name: 'Demo Auto Dealer', loc: 'Victoria Island', note: 'Budget confirmed' },
  },
  {
    stage: 'Quote Sent',
    color: '#f59e0b',
    demoCard: { name: 'Sample Healthcare Provider', loc: 'Ikoyi', note: 'Awaiting approval' },
  },
  {
    stage: 'Payment Pending',
    color: '#ec4899',
    demoCard: { name: 'Example Law Firm', loc: 'Yaba', note: 'Invoice sent' },
  },
  {
    stage: 'Won',
    color: '#10b981',
    demoCard: { name: 'Sample Training Centre', loc: 'Surulere', note: 'Onboarding scheduled' },
  },
  {
    stage: 'Follow-Up',
    color: '#94a3b8',
    demoCard: { name: 'Demo Retail Boutique', loc: 'Gbagada', note: 'Checking in next week' },
  },
];

export default function CrmPreviewSection() {
  return (
    <section
      id="crm-preview"
      aria-labelledby="crm-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 700 }}>Simple Lead Pipeline Visibility</span>
        </div>
        <h2
          id="crm-heading"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
        >
          See Where Every Enquiry Stands
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 580, margin: '0 auto' }}>
          See where enquiries are in your workflow and decide the next step faster.
        </p>
      </div>

      {/* CRM Board */}
      <div style={{ background: '#0a0d14', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 24, padding: 'clamp(16px, 3vw, 26px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        {/* Board header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 14, marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: '0 0 2px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>Lead Pipeline Board</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>Sample workflow preview — illustrative data only</p>
          </div>
          {/* Demo Data Badge */}
          <div
            role="note"
            aria-label="This is demo data, not real client data"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 20, padding: '4px 12px' }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} aria-hidden="true" />
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800 }}>Demo Data / Illustrative Preview</span>
          </div>
        </div>

        {/* Kanban columns — horizontally scrollable on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(160px, 1fr))', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {DEMO_COLUMNS.map((col) => (
            <div key={col.stage} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${col.color}25`, borderRadius: 14, padding: 12, minWidth: 150 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${col.color}20` }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{col.stage}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: col.color, background: `${col.color}15`, padding: '1px 6px', borderRadius: 8 }}>Demo</span>
              </div>

              {/* Sample lead card */}
              <div style={{ background: 'rgba(7,9,14,0.75)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 10 }}>
                <p style={{ margin: '0 0 3px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {col.demoCard.name}
                </p>
                <p style={{ margin: '0 0 6px', fontSize: '0.7rem', color: '#64748b' }}>📍 {col.demoCard.loc}</p>
                <span style={{ fontSize: '0.65rem', color: col.color, fontWeight: 700 }}>{col.demoCard.note}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.76rem', textAlign: 'center', lineHeight: 1.6 }}>
            This preview illustrates a possible workflow. Actual results depend on your business process, data quality, integrations, and sales team.
            Lead stages do not update automatically from WhatsApp activity in the current configuration.
          </p>
        </div>

      </div>
    </section>
  );
}
