'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export function WebappToolActionBar({ currentTool }: { currentTool?: string }) {
  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 13, 25, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: 20,
        padding: '16px 22px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37',
            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.15)',
          }}
        >
          <Sliders style={{ width: 18, height: 18, color: '#d4af37' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif" }}>
              Enterprise Engine Controller
            </span>
            {currentTool && (
              <span
                style={{
                  padding: '3px 12px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  color: '#d4af37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 100,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'capitalize',
                  letterSpacing: '0.02em',
                }}
              >
                {currentTool}
              </span>
            )}
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.76rem', display: 'block', marginTop: 2 }}>
            Autonomous Commercial Engine · Production Deployments & Multi-User Governance
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href="/admin/handover"
          style={{
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            color: '#ffffff',
            fontWeight: 800,
            borderRadius: 12,
            fontSize: '0.8rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid rgba(52, 211, 153, 0.35)',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
          }}
        >
          <Briefcase style={{ width: 14, height: 14 }} />
          <span>Handover Engine</span>
        </Link>

        <Link
          href="/admin/team"
          style={{
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            color: '#ffffff',
            fontWeight: 800,
            borderRadius: 12,
            fontSize: '0.8rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid rgba(96, 165, 250, 0.35)',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Users style={{ width: 14, height: 14 }} />
          <span>Team Multi-User</span>
        </Link>

        <Link
          href="/recruitment"
          style={{
            padding: '9px 16px',
            background: 'rgba(212, 175, 55, 0.08)',
            color: '#d4af37',
            fontWeight: 800,
            borderRadius: 12,
            fontSize: '0.8rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          <Sparkles style={{ width: 14, height: 14, color: '#d4af37' }} />
          <span>Recruitment Engine</span>
        </Link>
      </div>
    </div>
  );
}
