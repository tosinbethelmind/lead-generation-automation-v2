'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Sparkles, ShieldCheck } from 'lucide-react';

export function WebappToolActionBar({ currentTool }: { currentTool?: string }) {
  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 13, 26, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: '16px 22px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            fontWeight: 900,
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)',
          }}
        >
          ⚡
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
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
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
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#38bdf8',
            fontWeight: 800,
            borderRadius: 12,
            fontSize: '0.8rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}
        >
          <Sparkles style={{ width: 14, height: 14, color: '#38bdf8' }} />
          <span>Recruitment Engine</span>
        </Link>
      </div>
    </div>
  );
}
