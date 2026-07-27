'use client';

import React, { useState, useEffect } from 'react';
import { RevenueAttributionReport } from '@/lib/revenueAttribution';

export default function RevenueAnalyticsCard() {
  const [report, setReport] = useState<RevenueAttributionReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics').then(r => r.json());
      if (res.success) setReport(res.report);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📈</span> Revenue Attribution & Campaign ROI
          </h2>
          <p className="text-sm text-slate-400">Financial metrics, Cost-per-Lead (CPL), Customer Acquisition Cost (CAC) & ROI</p>
        </div>

        <button
          onClick={loadAnalytics}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg"
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Calculating financial metrics...</div>
      ) : !report ? (
        <div className="text-center py-8 text-slate-500 text-sm">Analytics unavailable</div>
      ) : (
        <div className="space-y-6">
          {/* Main KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Total Won Revenue</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">₦{report.totalRevenueNgn.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">{report.totalDealsWon} closed deals</span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Net Campaign ROI</span>
              <span className="text-xl font-bold text-indigo-400 font-mono">+{report.roiPercent}%</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Profit: ₦{report.netProfitNgn.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Cost Per Lead (CPL)</span>
              <span className="text-xl font-bold text-amber-400 font-mono">₦{report.costPerLeadNgn.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">{report.totalLeadsContacted} outreach events</span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Acquisition Cost (CAC)</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">₦{report.customerAcquisitionCostNgn.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Per paying customer</span>
            </div>
          </div>

          {/* Sector Revenue Breakdown */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Revenue Contribution per Industry Sector</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {report.sectorBreakdown.map((sb, idx) => (
                <div key={idx} className="bg-slate-800/80 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-white capitalize block">{sb.sector}</span>
                    <span className="text-[10px] text-slate-400">{sb.dealCount} active deals</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 font-mono block">₦{sb.wonValueNgn.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500">Pipeline: ₦{(sb.pipelineValueNgn / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
