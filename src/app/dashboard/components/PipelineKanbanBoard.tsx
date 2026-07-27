'use client';

import React, { useState, useEffect } from 'react';
import { Deal, PipelineStage, PipelineStats } from '@/lib/pipelineManager';

export default function PipelineKanbanBoard() {
  const [sector, setSector] = useState<string>('general');
  const [sectors, setSectors] = useState<{ key: string; label: string }[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Deal Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newValue, setNewValue] = useState<number>(150000);

  // Fetch pipeline data
  const loadPipelineData = async () => {
    setLoading(true);
    try {
      const [resSectors, resDeals, resStats] = await Promise.all([
        fetch('/api/pipeline?action=sectors').then(r => r.json()),
        fetch(`/api/pipeline?sector=${sector}`).then(r => r.json()),
        fetch(`/api/pipeline?action=stats&sector=${sector}`).then(r => r.json()),
      ]);

      if (resSectors.success) setSectors(resSectors.sectors);
      if (resDeals.success) {
        setDeals(resDeals.deals);
        setStages(resDeals.stages);
      }
      if (resStats.success) setStats(resStats.stats);
    } catch (e) {
      console.error('Failed to load pipeline data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipelineData();
  }, [sector]);

  // Handle stage change
  const handleStageChange = async (dealId: string, newStageId: string) => {
    // Optimistic update
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage_id: newStageId } : d));

    try {
      await fetch(`/api/pipeline/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: newStageId }),
      });
      loadPipelineData();
    } catch (e) {
      console.error('Failed to move deal stage:', e);
    }
  };

  // Create new deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          contact_name: newContactName,
          contact_phone: newContactPhone,
          value: Number(newValue),
          sector,
        }),
      });

      setNewTitle('');
      setNewContactName('');
      setNewContactPhone('');
      setShowModal(false);
      loadPipelineData();
    } catch (e) {
      console.error('Failed to create deal:', e);
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-6">
      {/* Header Controls & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📊</span> Visual Deal Pipeline
          </h2>
          <p className="text-sm text-slate-400">Track and move deals through sector-customized pipeline stages</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sector Selector */}
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sectors.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
          >
            + New Deal
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/5 text-sm">
          <div>
            <span className="text-slate-400 block text-xs">Total Pipeline</span>
            <span className="text-lg font-bold text-indigo-400">₦{stats.totalValue.toLocaleString()}</span>
            <span className="text-xs text-slate-500 ml-1">({stats.totalDeals} deals)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">Won Revenue</span>
            <span className="text-lg font-bold text-emerald-400">₦{stats.wonValue.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">Avg Deal Size</span>
            <span className="text-lg font-bold text-amber-400">₦{Math.round(stats.avgDealValue).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">Conversion Rate</span>
            <span className="text-lg font-bold text-cyan-400">{stats.conversionRate.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading pipeline deals...</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage_id === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-72 bg-slate-900/80 rounded-xl p-3 border border-white/5 flex flex-col max-h-[600px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span>{stage.icon}</span>
                    <span className="font-semibold text-sm">{stage.label}</span>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono">
                    ₦{(stageValue / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-lg">
                      No deals in this stage
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-lg p-3 shadow-sm hover:shadow-indigo-500/10 transition group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-slate-200 line-clamp-1">{deal.title}</h4>
                        </div>

                        {deal.contact_name && (
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span>👤</span> {deal.contact_name}
                          </div>
                        )}

                        {deal.contact_phone && (
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <span>📞</span> {deal.contact_phone}
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">
                            ₦{Number(deal.value || 0).toLocaleString()}
                          </span>

                          {/* Stage Quick Switch dropdown */}
                          <select
                            value={deal.stage_id}
                            onChange={(e) => handleStageChange(deal.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-[11px] rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                          >
                            {stages.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating New Deal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold">Create New Deal</h3>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Solar System for Lekki Office"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Contact Name</label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Chief Adebayo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Contact Phone (+234...)</label>
                <input
                  type="text"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+2348012345678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Estimated Value (NGN ₦)</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium text-xs"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
