'use client';

/**
 * @file src/components/arbitrage/ArbitragePortalClient.tsx
 * 
 * Interactive Zero-Latency Deal Allocation Portal (Deal-Specific).
 */

import React, { useState, useEffect } from 'react';

interface Props {
  dealId: string;
}

export default function ArbitragePortalClient({ dealId }: Props) {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const sampleDeal = {
    dealId,
    importerName: 'Commercial Importer Trade Desk',
    orderVolumeUSD: 50000,
    rateLocked: 1375,
    wholesaleRate: 1350,
    spreadProfitUSD: 25,
    totalNairaDeposit: 68750000,
    merchantDesk: 'Verified Institutional Liquidity Desk',
    merchantHead: 'Lead Settlement Officer',
    merchantHotline: '+234 802 279 1227',
    merchantOffice: 'Commercial Corridor, Victoria Island, Lagos',
    bondedVault: 'Platform Bonded Vault'
  };

  const waText = encodeURIComponent(
    `🤝 [BETHELMIND INSTITUTIONAL ESCROW: ${dealId}]\n\n` +
    `• Order Volume: $${sampleDeal.orderVolumeUSD.toLocaleString()} USD (China Factory Settlement)\n` +
    `• Locked Commercial Rate: ₦${sampleDeal.rateLocked.toLocaleString()}/$ (Wholesale: ₦${sampleDeal.wholesaleRate}/$)\n` +
    `• Total Naira Deposit: ₦${sampleDeal.totalNairaDeposit.toLocaleString()} NGN\n\n` +
    `📋 INSTRUCTIONS:\n` +
    `1. Submit China Factory Proforma Invoice.\n` +
    `2. Desk issues verified Providus CBN-Regulated Merchant Escrow Account.\n` +
    `3. Wire executed to factory in < 15 mins with Swift MT103 confirmation receipt.`
  );

  const waUrl = `https://wa.me/2348022791227?text=${waText}`;

  return (
    <div className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Escrow Settlement Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Same-Day Trade Allocation
          </h1>
          <p className="text-xs text-slate-400">Allocation Ref: <span className="font-mono text-slate-300">{dealId}</span></p>
        </div>

        {/* 15-Min Rate Lock Badge */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl px-4 py-2 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">⏱️ Guaranteed Rate Lock</div>
          <div className="text-xl font-mono font-black text-emerald-400">{formattedTime}</div>
        </div>
      </div>

      {/* Smart AI Assistant Guidance Box */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-sm">
            AI
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-emerald-300">Smart AI Assistant Breakdown:</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hello Chief! Your commercial allocation for <strong className="text-white">${sampleDeal.orderVolumeUSD.toLocaleString()} USD</strong> is locked at <strong className="text-emerald-400">₦{sampleDeal.rateLocked}/$</strong> (Wholesale floor: ₦{sampleDeal.wholesaleRate}/$).
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Zero Capital Risk:</strong> Your deposit is held in a 100% CBN-regulated Merchant Escrow Vault (Providus Bank). The desk delivers the wire/USDT to your China supplier in &lt; 15 minutes and sends the official Swift MT103 confirmation receipt before funds are cleared.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 text-xs sm:text-sm">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 block text-[11px] uppercase font-mono">Live Wholesale Floor</span>
          <span className="text-white font-mono font-bold text-base">₦{sampleDeal.wholesaleRate.toLocaleString()} / USD</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 block text-[11px] uppercase font-mono">Locked Quoted Rate</span>
          <span className="text-emerald-400 font-mono font-bold text-base">₦{sampleDeal.rateLocked.toLocaleString()} / USD</span>
        </div>

        <div className="col-span-2 bg-slate-900/90 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-mono">Total Naira Deposit into Escrow</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">₦{sampleDeal.totalNairaDeposit.toLocaleString()} NGN</span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded border border-emerald-500/20">
            100% Escrow Bonded
          </span>
        </div>
      </div>

      {/* Verified Diamond Counterparty Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 text-xs">
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          🏢 Verified Counterparty: {sampleDeal.merchantDesk}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>• Desk Head: <strong className="text-white">{sampleDeal.merchantHead}</strong></div>
          <div>• Direct Hotline: <strong className="text-emerald-400">{sampleDeal.merchantHotline}</strong></div>
          <div>• Physical Office: <strong className="text-white">{sampleDeal.merchantOffice}</strong></div>
          <div>• Bonded Vault: <strong className="text-white">{sampleDeal.bondedVault}</strong></div>
        </div>
      </div>

      {/* 1-Tap Action CTA Button */}
      <div className="space-y-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-sm sm:text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01]"
        >
          <span>Submit China Invoice & Claim Escrow Account on WhatsApp</span>
          <span>➔</span>
        </a>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-[11px] text-slate-500 text-center mt-4">
        Bethelmind Institutional OTC Desk • Plot 12, Commercial Corridor, Victoria Island, Lagos.
      </p>
    </div>
  );
}
