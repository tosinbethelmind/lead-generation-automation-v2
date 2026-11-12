'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface DealRoomItem {
  dealId: string;
  title: string;
  corridor: string;
  priceNgn: number;
  priceFormatted: string;
  titleDocument: string;
  developerName: string;
  developerPhone: string;
  developerEmail: string;
  gross5PercentPool: number;
  broker80PercentCut: number;
  bethelmind20PercentCut: number;
  lawyerCounsel20PercentCut: number;
  pipelineStage: 'DISCOVERED' | 'MATCHED' | 'MANDATE_LOCKED' | 'INSPECTION_LOGGED' | 'ALAUSA_VERIFIED' | 'ESCROW_CLOSED';
  section84Hash: string;
}

const STAGES: { key: DealRoomItem['pipelineStage']; label: string; badgeColor: string; description: string }[] = [
  { key: 'DISCOVERED', label: '1. Discovered', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40', description: 'Direct Root Mandate Identified' },
  { key: 'MATCHED', label: '2. Buyer Matched', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', description: 'Diaspora Buyer Qualified' },
  { key: 'MANDATE_LOCKED', label: '3. Mandate Signed', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40', description: '80/20 LASRERA Agreement Hashed' },
  { key: 'INSPECTION_LOGGED', label: '4. JIM Logged', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40', description: 'Joint Inspection Memorandum' },
  { key: 'ALAUSA_VERIFIED', label: '5. Alausa Certified', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', description: 'Lawyer Title Search Clear' },
  { key: 'ESCROW_CLOSED', label: '6. Escrow Closed', badgeColor: 'bg-green-500/20 text-green-300 border-green-500/40', description: 'Moniepoint Fee Settled' }
];

export default function Pillar2DealRoomView() {
  const [deals, setDeals] = useState<DealRoomItem[]>([
    {
      dealId: 'HARV-BANANA-1800M',
      title: 'Waterfront 6-Bedroom Sovereign Smart Villa with Jetty & Pool',
      corridor: 'Banana Island, Ikoyi, Lagos',
      priceNgn: 1800000000,
      priceFormatted: '₦ 1,800,000,000',
      titleDocument: "Federal C of O & Governor's Consent",
      developerName: 'Cadwell Prime Asset Partners',
      developerPhone: '08035678912',
      developerEmail: 'acquisitions@cadwellltd.com',
      gross5PercentPool: 90000000,
      broker80PercentCut: 72000000,
      bethelmind20PercentCut: 18000000,
      lawyerCounsel20PercentCut: 3600000,
      pipelineStage: 'MANDATE_LOCKED',
      section84Hash: 'c191e949e16f134ee20e7cde228fa489'
    },
    {
      dealId: 'HARV-LEKKI1-750M',
      title: 'Contemporary 5-Bedroom Fully-Detached Smart Residence',
      corridor: 'Off Admiralty Way, Lekki Phase 1',
      priceNgn: 750000000,
      priceFormatted: '₦ 750,000,000',
      titleDocument: "Lagos State Governor's Consent",
      developerName: 'Orange Island Development Company',
      developerPhone: '08038774238',
      developerEmail: 'mandates@orangeislandng.com',
      gross5PercentPool: 37500000,
      broker80PercentCut: 30000000,
      bethelmind20PercentCut: 7500000,
      lawyerCounsel20PercentCut: 1500000,
      pipelineStage: 'ALAUSA_VERIFIED',
      section84Hash: '305b3f4ef1ba8a2c03465062a71bf912'
    },
    {
      dealId: 'HARV-IKOYI-1200M',
      title: 'Ultra-Luxury 4-Bedroom Waterfront Sky Penthouse',
      corridor: 'Bourne Road, Old Ikoyi, Lagos',
      priceNgn: 1200000000,
      priceFormatted: '₦ 1,200,000,000',
      titleDocument: "Federal C of O with Registered Conveyance",
      developerName: 'Broll Property Services Nigeria',
      developerPhone: '08033214589',
      developerEmail: 'nigeria@broll.com',
      gross5PercentPool: 60000000,
      broker80PercentCut: 48000000,
      bethelmind20PercentCut: 12000000,
      lawyerCounsel20PercentCut: 2400000,
      pipelineStage: 'MATCHED',
      section84Hash: 'b1c2b91e33efc247a76d6a4fd123ee90'
    },
    {
      dealId: 'HARV-AMEN-450M',
      title: 'Sovereign 5-Bedroom Custom Brick Villa in Perimeter',
      corridor: 'Amen Estate Phase 2, Eleko Corridor',
      priceNgn: 450000000,
      priceFormatted: '₦ 450,000,000',
      titleDocument: "Lagos State Governor's Consent",
      developerName: 'Amen Estate Master Development',
      developerPhone: '08033008985',
      developerEmail: 'mandates@amenestate.com',
      gross5PercentPool: 22500000,
      broker80PercentCut: 18000000,
      bethelmind20PercentCut: 4500000,
      lawyerCounsel20PercentCut: 900000,
      pipelineStage: 'INSPECTION_LOGGED',
      section84Hash: '452ed15f2d99ec1d798ebf68fa189c45'
    },
    {
      dealId: 'HARV-EPE-280M',
      title: 'Prime 2,400 SQM Dry Commercial Acreage Expressway',
      corridor: 'Alaro City Corridor, Epe, Lagos',
      priceNgn: 280000000,
      priceFormatted: '₦ 280,000,000',
      titleDocument: "Lagos State Gazette & Registered Survey",
      developerName: 'Mixta Africa Master Communities',
      developerPhone: '09053964068',
      developerEmail: 'nigeria@mixtaafrica.com',
      gross5PercentPool: 14000000,
      broker80PercentCut: 11200000,
      bethelmind20PercentCut: 2800000,
      lawyerCounsel20PercentCut: 560000,
      pipelineStage: 'DISCOVERED',
      section84Hash: '13350a6eca20923c2384e6abc1278f99'
    }
  ]);

  const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');

  // Totals
  const totalAssetValue = deals.reduce((acc, d) => acc + d.priceNgn, 0);
  const totalBethelmindPool = deals.reduce((acc, d) => acc + d.bethelmind20PercentCut, 0);
  const totalLawyerPool = deals.reduce((acc, d) => acc + d.lawyerCounsel20PercentCut, 0);

  const advanceStage = (dealId: string) => {
    setDeals(prev =>
      prev.map(deal => {
        if (deal.dealId !== dealId) return deal;
        const currentIndex = STAGES.findIndex(s => s.key === deal.pipelineStage);
        if (currentIndex < STAGES.length - 1) {
          return { ...deal, pipelineStage: STAGES[currentIndex + 1].key };
        }
        return deal;
      })
    );
  };

  const filteredDeals = activeStageFilter === 'ALL'
    ? deals
    : deals.filter(d => d.pipelineStage === activeStageFilter);

  return (
    <div className="space-y-6">
      {/* Header Metrics Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              🏛️ Twenty CRM Deal Room &bull; LASRERA 80/20 Standard
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Luxury Real Estate Pipeline & Deal Room</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Bethelmind Digital Solutions (CAC BN: 9912717) &bull; Moniepoint MFB 6805375225 &bull; 20% Retained Legal Counsel Share
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/mandate"
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              ✍️ Sign Mandate Portal
            </Link>
            <a
              href="/print_lawyer_pack.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              📄 Master Legal Pack
            </a>
          </div>
        </div>

        {/* 3 Live Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
            <div className="text-slate-400 text-xs font-medium">Total Luxury Asset Pipeline</div>
            <div className="text-lg font-black text-white mt-1">₦ {totalAssetValue.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">5 Prime Verified Deals in Lekki, Ikoyi & Banana Island</div>
          </div>
          <div className="bg-slate-950/60 border border-amber-500/30 rounded-lg p-3">
            <div className="text-amber-400/90 text-xs font-medium">Bethelmind 20% Origination Pool</div>
            <div className="text-lg font-black text-amber-400 mt-1">₦ {totalBethelmindPool.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Clears to Moniepoint MFB 6805375225 upon closing</div>
          </div>
          <div className="bg-slate-950/60 border border-emerald-500/30 rounded-lg p-3">
            <div className="text-emerald-400/90 text-xs font-medium">Retained Lawyer 20% Counsel Share</div>
            <div className="text-lg font-black text-emerald-400 mt-1">₦ {totalLawyerPool.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Disbursed directly within 24h of settlement</div>
          </div>
        </div>
      </div>

      {/* Stage Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveStageFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeStageFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
          }`}
        >
          All Stages ({deals.length})
        </button>
        {STAGES.map(s => {
          const count = deals.filter(d => d.pipelineStage === s.key).length;
          return (
            <button
              key={s.key}
              onClick={() => setActiveStageFilter(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeStageFilter === s.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban / Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeals.map(deal => {
          const currentStageObj = STAGES.find(s => s.key === deal.pipelineStage);
          const isFinalStage = deal.pipelineStage === 'ESCROW_CLOSED';

          return (
            <div
              key={deal.dealId}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg flex flex-col justify-between transition group"
            >
              <div>
                {/* Stage Badge & Deal ID */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentStageObj?.badgeColor}`}>
                    {currentStageObj?.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {deal.dealId}
                  </span>
                </div>

                {/* Property Title & Location */}
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug">
                  {deal.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  📍 {deal.corridor}
                </div>

                {/* Price & Title Instrument */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Listing Ask:</span>
                    <span className="font-bold text-white font-mono">{deal.priceFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Title Instrument:</span>
                    <span className="text-slate-300 truncate max-w-[170px]" title={deal.titleDocument}>
                      {deal.titleDocument}
                    </span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-1.5 flex justify-between items-center text-[11px]">
                    <span className="text-amber-400 font-medium">Bethelmind 20% Cut:</span>
                    <span className="font-bold text-amber-400 font-mono">₦ {deal.bethelmind20PercentCut.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-emerald-400 font-medium">Lawyer 20% Cut:</span>
                    <span className="font-bold text-emerald-400 font-mono">₦ {deal.lawyerCounsel20PercentCut.toLocaleString()}</span>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="mt-2.5 text-xs text-slate-400 flex items-center justify-between">
                  <span className="truncate max-w-[180px]" title={deal.developerName}>
                    🏢 {deal.developerName}
                  </span>
                  <span className="font-mono text-slate-500">{deal.developerPhone}</span>
                </div>

                {/* Section 84 Hash */}
                <div className="mt-2 text-[10px] font-mono text-slate-500 truncate" title={`Sec 84 Hash: ${deal.section84Hash}`}>
                  🔒 Hash: {deal.section84Hash.substring(0, 20)}...
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href={`/mandate?ref=${deal.dealId}`}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  ✍️ Mandate
                </Link>
                <a
                  href={`https://wa.me/234${deal.developerPhone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                    `Good day, regarding "${deal.title}" listed at ${deal.priceFormatted}. Bethelmind Digital Solutions (CAC: 9912717) requests confirmation of 80/20 LASRERA co-brokerage mandate.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition"
                >
                  💬 WhatsApp
                </a>
                {!isFinalStage && (
                  <button
                    onClick={() => advanceStage(deal.dealId)}
                    className="px-2.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    title="Advance to next pipeline stage"
                  >
                    Next &rarr;
                  </button>
                )}
                {isFinalStage && (
                  <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                    ✓ Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
