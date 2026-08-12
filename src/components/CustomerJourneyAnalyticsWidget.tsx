'use client';

import React, { useState } from 'react';
import { Eye, MousePointer, Flame, AlertCircle, Play, CheckCircle } from 'lucide-react';

interface JourneyStats {
  totalVisitors: number;
  avgTimeSec: number;
  scroll75DepthPercent: number;
  rageClicksCount: number;
  funnelSteps: { label: string; count: number; percentage: number }[];
}

export default function CustomerJourneyAnalyticsWidget() {
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);

  const sampleStats: JourneyStats = {
    totalVisitors: 1240,
    avgTimeSec: 142,
    scroll75DepthPercent: 68,
    rageClicksCount: 3,
    funnelSteps: [
      { label: 'Landing Page Visit', count: 1240, percentage: 100 },
      { label: 'View Product/Services', count: 868, percentage: 70 },
      { label: 'Click Price Quote Form', count: 434, percentage: 35 },
      { label: 'Submitted Lead / Order', count: 223, percentage: 18 },
    ],
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              👁️ Visitor Screen Replay & Heatmap
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">LIVE TRACKING</span>
            </h3>
            <p className="text-xs text-slate-400">Plain-English view of visitor behavior, drop-off spots, and screen recordings.</p>
          </div>
        </div>

        <button
          onClick={() => setIsPlayingReplay(!isPlayingReplay)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          {isPlayingReplay ? 'Pause Session Replay' : 'Watch 15s Replay Demo'}
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Web Visitors</p>
          <p className="text-xl font-bold text-white">{sampleStats.totalVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Avg Time On Site</p>
          <p className="text-xl font-bold text-emerald-400">{Math.floor(sampleStats.avgTimeSec / 60)}m {sampleStats.avgTimeSec % 60}s</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Scroll 75%+ Deep</p>
          <p className="text-xl font-bold text-blue-400">{sampleStats.scroll75DepthPercent}%</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Confused Clicks (Rage)</p>
          <p className="text-xl font-bold text-amber-400 flex items-center gap-1">
            {sampleStats.rageClicksCount}
            <AlertCircle className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Simulated Session Replay Screen */}
      {isPlayingReplay && (
        <div className="mb-6 p-4 bg-slate-950 border border-indigo-500/40 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Simulating Visitor #912 (Lagos, NG - Chrome Mobile)
            </span>
            <span>00:12 / 00:45</span>
          </div>
          <div className="h-24 bg-slate-900 border border-slate-800 rounded-lg p-3 relative flex items-center justify-center">
            <p className="text-xs text-slate-300 text-center">
              Visitor scrolled to <strong>Pricing Table</strong> and tapped <span className="text-indigo-400 font-bold">'Claim Website'</span> button.
            </p>
            <div className="absolute top-4 right-10 p-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full animate-bounce">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Conversion Funnel */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">Customer Conversion Funnel</h4>
        <div className="space-y-2">
          {sampleStats.funnelSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-1/3">
                <span className="text-xs font-bold text-slate-500">0{idx + 1}</span>
                <span className="text-xs font-medium text-slate-200">{step.label}</span>
              </div>
              <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
              <div className="text-right w-24">
                <span className="text-xs font-bold text-white">{step.count}</span>
                <span className="text-[10px] text-slate-400 ml-1">({step.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
