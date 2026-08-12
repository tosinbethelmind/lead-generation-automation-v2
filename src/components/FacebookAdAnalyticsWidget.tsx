'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function FacebookAdAnalyticsWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/facebook-ads')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" /> Loading Ad Spend & Profit Dashboard...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📊 Ad Spend & Profit Dashboard
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">ROAS {data.roasRatio}x</span>
            </h3>
            <p className="text-xs text-slate-400">Plain-English view of your ad spend vs net profit generated.</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Ad Spend</p>
          <p className="text-xl font-bold text-white">₦{data.totalSpend.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Leads Generated</p>
          <p className="text-xl font-bold text-emerald-400">{data.leadsGenerated} Leads</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Cost Per Lead (CPL)</p>
          <p className="text-xl font-bold text-blue-400">₦{data.costPerLead.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Return On Ad Spend</p>
          <p className="text-xl font-bold text-purple-400">{data.roasRatio}x ROAS</p>
        </div>
      </div>

      {/* Campaign Guardrail Rules & Recommendations */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Automated Campaign Profit Recommendations</h4>
        {data.guardrailAlerts.map((alert: any, idx: number) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              alert.status === 'WINNING'
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}
          >
            {alert.status === 'WINNING' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold text-white mb-0.5">{alert.campaign}</p>
              <p className="text-xs opacity-90">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
