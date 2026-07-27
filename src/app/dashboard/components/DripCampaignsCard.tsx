'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, CAMPAIGN_TEMPLATES } from '@/lib/dripCampaignEngine';

export default function DripCampaignsCard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('solar_nurture');

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns').then(r => r.json());
      if (res.success) setCampaigns(res.campaigns);
    } catch (e) {
      console.error('Failed to load campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleLaunchTemplate = async () => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_from_template',
          templateKey: selectedTemplate,
        }),
      }).then(r => r.json());

      if (res.success) {
        loadCampaigns();
      }
    } catch (e) {
      console.error('Failed to create campaign from template:', e);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      loadCampaigns();
    } catch (e) {
      console.error('Failed to toggle campaign status:', e);
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🚀</span> Drip Nurture Campaigns
          </h2>
          <p className="text-sm text-slate-400">Automated multi-touch follow-up sequences across WhatsApp, Email & SMS</p>
        </div>

        {/* Template Launcher */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none"
          >
            {Object.entries(CAMPAIGN_TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>{t.name} ({t.sector})</option>
            ))}
          </select>

          <button
            onClick={handleLaunchTemplate}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold rounded-lg shadow transition"
          >
            + Create from Template
          </button>
        </div>
      </div>

      {/* Active Campaigns List */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
          No campaigns created yet. Launch one from a template above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => {
            const steps = JSON.parse(c.steps || '[]');

            return (
              <div key={c.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{c.name}</h3>
                    <span className="text-[11px] text-slate-400 capitalize">{c.sector} Sector • {steps.length} Steps</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    c.status === 'paused' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Steps Preview */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {steps.map((s: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 whitespace-nowrap">
                        {s.channel === 'whatsapp' ? '💬' : s.channel === 'email' ? '📧' : '📱'} {s.channel} (+{s.delay_hours}h)
                      </span>
                      {idx < steps.length - 1 && <span className="text-slate-600 text-xs">→</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Enrolled</span>
                    <span className="font-bold text-indigo-400">{c.total_enrolled}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Completed</span>
                    <span className="font-bold text-emerald-400">{c.total_completed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Replied</span>
                    <span className="font-bold text-amber-400">{c.total_replied}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleToggleStatus(c.id, c.status)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded"
                  >
                    {c.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
