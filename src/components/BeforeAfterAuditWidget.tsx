'use client';

import React from 'react';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface BeforeAfterAuditWidgetProps {
  businessName: string;
  categoryName?: string;
  existingWebsite?: string;
}

export default function BeforeAfterAuditWidget({
  businessName,
  categoryName = 'Business',
  existingWebsite,
}: BeforeAfterAuditWidgetProps) {
  const hasSite = !!(existingWebsite && existingWebsite.trim() && existingWebsite.toLowerCase() !== 'none');

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(7,9,14,0.98))',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 24,
        padding: 'clamp(20px, 4vw, 36px)',
        margin: '40px 0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        color: '#f8fafc',
      }}
    >
      {/* Header Badge & Title */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: 100,
            padding: '4px 16px',
            marginBottom: 12,
          }}
        >
          <Zap style={{ width: 14, height: 14, color: '#38bdf8' }} />
          <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Automation Audit & Upgrade Analysis
          </span>
        </div>

        <h3
          style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 900,
            margin: '0 0 8px',
            fontFamily: "'Outfit', sans-serif",
            color: '#ffffff',
          }}
        >
          {businessName} Performance Audit Gap
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          {hasSite
            ? `Comparing your current website setup at ${existingWebsite} against the upgraded Bethelmind automated engine.`
            : `Comparing traditional manual client handling against the upgraded Bethelmind automated lead engine.`}
        </p>
      </div>

      {/* Side by Side Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Legacy / Current Setup Box */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.04)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 18,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <XCircle style={{ color: '#ef4444', width: 20, height: 20, flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f87171' }}>
                {hasSite ? 'Current Legacy Website' : 'Manual Operations'}
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#fca5a5' }}>
                {hasSite ? existingWebsite : 'Phone calls & manual follow-ups'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Mobile Speed Index', val: '🐌 Slow (3.8s–5.2s load time)', detail: 'High bounce rate on slow Lagos mobile data.' },
              { title: 'WhatsApp Routing', val: '❌ Manual Copy-Paste Number', detail: 'No auto-routing or pre-filled inquiry text.' },
              { title: 'Price Quotes & Invoicing', val: '❌ Slow 24h–48h Manual Quotes', detail: 'Prospects request quote and wait hours for feedback.' },
              { title: 'Customer Lead Tracking', val: '❌ Disorganized WhatsApp Chats', detail: 'Inquiries lost in personal chat feeds.' },
              { title: 'Social Proof Integration', val: '❌ Static / No Live Reviews', detail: 'Google Maps ratings not showcased.' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 10 }}>
                <span style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700 }}>{item.title}</span>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#fecaca' }}>{item.val}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgraded Engine Box */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 18,
            padding: 20,
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckCircle2 style={{ color: '#10b981', width: 20, height: 20, flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>
                Upgraded Bethelmind Engine
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                Automated Next.js Platform & Interactive CRM
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Mobile Speed Index', val: '⚡ Ultra-Fast (<0.8s load time)', detail: 'Optimized static edge rendering for 99.9% uptime.' },
              { title: 'WhatsApp Lead Routing', val: '⚡ 1-Tap Qualified Pre-Filled Chat', detail: 'Instant WhatsApp lead routing with client details.' },
              { title: 'Price Quotes & Invoicing', val: '⚡ Instant PDF Quote Generator', detail: 'Interactive sliders output branded PDF quotes in seconds.' },
              { title: 'Customer Lead Tracking', val: '⚡ Google Sheets CRM Auto-Sync', detail: 'Every inquiry automatically logged to database & CRM.' },
              { title: 'Social Proof Integration', val: '⚡ Verified Google Reviews Sync', detail: 'Real Google ratings embedded for instant trust.' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(6,78,59,0.3)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 700 }}>{item.title}</span>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#ecfdf5' }}>{item.val}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#cbd5e1' }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Bottom Summary */}
      <div
        style={{
          background: 'rgba(56,189,248,0.06)',
          border: '1px dashed rgba(56,189,248,0.25)',
          borderRadius: 14,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck style={{ color: '#38bdf8', width: 18, height: 18 }} />
          <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
            Estimated Conversion Lift for <strong style={{ color: '#38bdf8' }}>{businessName}</strong>:
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399', fontFamily: "'Outfit', sans-serif" }}>
            +45% Qualified Inquiries
          </span>
        </div>
      </div>
    </div>
  );
}
