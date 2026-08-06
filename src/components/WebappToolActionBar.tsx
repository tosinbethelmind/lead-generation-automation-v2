'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Sparkles } from 'lucide-react';

export function WebappToolActionBar({ currentTool }: { currentTool?: string }) {
  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(13, 19, 33, 0.85)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 16,
        padding: '14px 20px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
            fontWeight: 800,
            fontSize: '1rem',
          }}
        >
          ⚡
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
              Enterprise Engine Control
            </span>
            {currentTool && (
              <span
                style={{
                  padding: '2px 10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 100,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {currentTool}
              </span>
            )}
          </div>
          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginTop: 2 }}>
            Sell this engine copy or invite your team for multi-user access
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href="/admin/handover"
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: 10,
            fontSize: '0.78rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(52, 211, 153, 0.3)',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
          }}
        >
          <Briefcase style={{ width: 14, height: 14 }} />
          <span>1. Sell / Handover Engine</span>
        </Link>

        <Link
          href="/admin/team"
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: 10,
            fontSize: '0.78rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(96, 165, 250, 0.3)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Users style={{ width: 14, height: 14 }} />
          <span>2. Team Multi-User Access</span>
        </Link>

        <Link
          href="/recruitment"
          style={{
            padding: '8px 14px',
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#38bdf8',
            fontWeight: 700,
            borderRadius: 10,
            fontSize: '0.78rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
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
