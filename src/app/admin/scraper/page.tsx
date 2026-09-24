'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import Nigeria10KScraperConsole from '@/app/dashboard/components/Nigeria10KScraperConsole';

export default function Admin10KScraperPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', padding: '24px 20px 80px' }}>
      {/* Top Header Navigation */}
      <div style={{ maxWidth: '1380px', margin: '0 auto 24px auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/admin"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} />
            <span>Admin Dashboard</span>
          </Link>

          <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="#38bdf8" />
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              10K Nigeria Scraper Suite
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} /> 9 Active Scraper Repositories
          </span>

          <Link
            href="/"
            target="_blank"
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} /> Live App
          </Link>
        </div>
      </div>

      {/* Main Console Container */}
      <main style={{ maxWidth: '1380px', margin: '0 auto' }}>
        <Nigeria10KScraperConsole />
      </main>
    </div>
  );
}
