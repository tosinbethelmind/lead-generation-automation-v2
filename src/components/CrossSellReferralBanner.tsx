'use client';

/**
 * @file src/components/CrossSellReferralBanner.tsx
 * High-Converting Cross-Sell Referral Banner on Client Site Previews
 * Directs scraped leads from their site redesign preview straight into your B2B Lead Marketplace.
 */

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export interface CrossSellReferralBannerProps {
  businessName?: string;
  category?: string;
}

export default function CrossSellReferralBanner({
  businessName = 'Your Business',
  category = 'Commercial Business'
}: CrossSellReferralBannerProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #1e3a8a, #1d4ed8)',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        position: 'relative',
        zIndex: 1001
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ShoppingBag size={15} style={{ color: '#60a5fa' }} />
        <span>Need more paying clients for <strong>{businessName}</strong>?</span>
      </div>
      <a
        href="https://www.bethelmindanalytics.com/#marketplace"
        target="_blank"
        rel="noreferrer"
        style={{
          background: '#ffffff',
          color: '#1e3a8a',
          padding: '4px 14px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        Get 1,000 Verified B2B Leads in Lagos <ArrowRight size={13} />
      </a>
    </div>
  );
}
