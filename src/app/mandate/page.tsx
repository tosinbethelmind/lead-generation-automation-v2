'use client';

import React from 'react';
import Link from 'next/link';

export default function MandatePortalPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#f8fafc', padding: '24px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '999px', fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
            <span>🏛️ LASRERA COMPLIANT CO-BROKERAGE DESK</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
            Joint Inspection Memorandum (JIM)
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Bethelmind Digital Solutions (CAC Certified: Reg 9912717)<br/>
            Corporate & Diaspora Property Allocation Desk
          </p>
        </div>

        {/* Legal Invariants Card */}
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginTop: 0, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Official Desk Representation Terms
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>1.</span>
              <span><b>80/20 Commission Split:</b> Mandated brokerage firm retains 80% of total agency commission. Bethelmind retains 20% origination fee.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>2.</span>
              <span><b>Liquid Diaspora Buyers:</b> All investor syndicates possess verified liquid Tier-1 bank settlement clearing (Zero mortgage delays).</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>3.</span>
              <span><b>Accompanied Walkthrough:</b> Conducted by accredited legal counsel & desk inspection liaison upon schedule confirmation and gate clearance.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>4.</span>
              <span><b>Statutory Authority:</b> Section 84 Evidence Act 2011 Verified & Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022.</span>
            </div>
          </div>
        </div>

        {/* Corporate Settlement Account */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Official Settlement Bank & Registry
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Moniepoint Microfinance Bank</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', margin: '4px 0', letterSpacing: '0.08em' }}>6805375225</div>
          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Bethelmind Digital Solutions (CAC Reg: 9912717)</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Principal Partner: Tosin Oyelakin (+234 802 279 1227)</div>
        </div>

        {/* Active Deal Teasers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Luxury Mandate Books
          </div>
          <Link href="/deal/DEAL-AMEN-500M/mandate" style={{ display: 'block', padding: '14px 16px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', textDecoration: 'none', color: '#f8fafc' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>7-Bed Sovereign Mansion (Amen Estate)</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>₦ 500,000,000 · View Full Electronic JIM & Evidence Act Schedule &rarr;</div>
          </Link>
          <Link href="/deal/DEAL-LEKKI1-480M/mandate" style={{ display: 'block', padding: '14px 16px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', textDecoration: 'none', color: '#f8fafc' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>5-Bed Contemporary Duplex (Lekki Phase 1)</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>₦ 480,000,000 · View Full Electronic JIM & Evidence Act Schedule &rarr;</div>
          </Link>
          <Link href="/deal/DEAL-BANANA-1500M/mandate" style={{ display: 'block', padding: '14px 16px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', textDecoration: 'none', color: '#f8fafc' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Waterfront 6-Bed Villa (Banana Island, Ikoyi)</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>₦ 1,500,000,000 · View Full Electronic JIM & Evidence Act Schedule &rarr;</div>
          </Link>
        </div>

        {/* 1-Tap WhatsApp Closer Desk */}
        <a 
          href="https://wa.me/2348022791227?text=Good%20day%20Tosin,%20we%20have%20reviewed%20the%20Bethelmind%20Joint%20Inspection%20Memorandum%20(JIM)%20and%20wish%20to%20confirm%20our%20inspection%20schedule."
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          💬 Chat Principal Partner on WhatsApp (+234 802 279 1227)
        </a>

      </div>
    </div>
  );
}
