/**
 * @file src/app/arbitrage/[dealId]/page.tsx
 * 
 * 100% PRODUCTION ZERO-LATENCY SMART AI ARBITRAGE ASSISTANT & CASHOUT PORTAL.
 * 
 * Production URL: https://www.bethelmindanalytics.com/arbitrage/[dealId]
 * 
 * Features:
 * 1. ⚡ 0ms Zero-Latency In-Memory Instant Paint (No blocking preloaders).
 * 2. 🧠 Smart AI Assistant Step-by-Step Plain English Breakdown.
 * 3. ⏱️ Live 15-Minute Guaranteed Rate Lock Countdown Timer.
 * 4. 📲 1-Tap Pre-Filled WhatsApp 3-Way Handshake Launch Button.
 * 5. 🏦 Direct-to-OPay Liquidation Confirmation (7034297995 - Oyelakin Tosin Matthew).
 */

import React from 'react';
import ArbitragePortalClient from '@/components/arbitrage/ArbitragePortalClient';

export const metadata = {
  title: 'Executive Arbitrage & Escrow Settlement Portal | Bethelmind Analytics',
  description: 'Verified B2B Institutional Escrow & Arbitrage Settlement Desk.'
};

export default async function ArbitrageDealPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = await params;
  const dealId = resolvedParams.dealId || 'DEAL-OTC-ACTIVE';

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 antialiased">
      <ArbitragePortalClient dealId={dealId} />
    </main>
  );
}
