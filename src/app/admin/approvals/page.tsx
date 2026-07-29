'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, RefreshCw, Send, AlertTriangle, MessageSquare, Play, Sparkles } from 'lucide-react';

export default function AdminApprovalsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('PENDING_HUMAN_APPROVAL');

  // Decision Action Modal State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/admin/approvals' : `/api/admin/approvals?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch approval tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleApprove = async () => {
    if (!selectedTicket) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          ticketId: selectedTicket.id,
          adminPromptModifier: customPrompt.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to approve decision');
      setSelectedTicket(null);
      setCustomPrompt('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTicket) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          ticketId: selectedTicket.id,
          reason: rejectReason.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to reject decision');
      setSelectedTicket(null);
      setRejectReason('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Human-in-the-Loop AI Governance
            </div>
            <h1 className="text-3xl font-bold text-white">AI Decision & Approval Queue</h1>
            <p className="text-sm text-slate-400">Review high-stakes AI decisions, approve with custom prompts, or reject actions before execution.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTickets}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#06b6d4] ${loading ? 'animate-spin' : ''}`} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 mb-8">
          {['PENDING_HUMAN_APPROVAL', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === status
                  ? 'bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#06b6d4] animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Approval Queue...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 p-12 rounded-2xl text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-[#10b981]" />
            <h3 className="text-lg font-bold text-white">No Pending Decisions</h3>
            <p className="text-xs text-slate-400 max-w-sm">All AI decisions are currently reviewed and approved. No actions are awaiting human authorization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30 uppercase">
                      {t.actionType}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'APPROVED'
                          ? 'bg-[#10b981]/20 text-[#10b981]'
                          : t.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{t.title}</h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">{t.summary}</p>

                  {t.adminPromptModifier && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-[#06b6d4]/30 text-xs text-slate-300 mb-4">
                      <span className="text-[#06b6d4] font-bold block mb-1">💬 Admin Custom Prompt Modifier:</span>
                      "{t.adminPromptModifier}"
                    </div>
                  )}

                  {t.adminDecisionNotes && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-red-500/30 text-xs text-slate-300 mb-4">
                      <span className="text-red-400 font-bold block mb-1">❌ Rejection Reason:</span>
                      "{t.adminDecisionNotes}"
                    </div>
                  )}
                </div>

                {t.status === 'PENDING_HUMAN_APPROVAL' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <button
                      onClick={() => { setSelectedTicket(t); setCustomPrompt(''); }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#10b981] text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve / Prompt
                    </button>
                    <button
                      onClick={() => { setSelectedTicket(t); setRejectReason(''); }}
                      className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DECISION APPROVAL / PROMPT MODAL */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 text-slate-100">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#06b6d4]" /> Review Decision: {selectedTicket.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{selectedTicket.summary}</p>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Optional Custom Prompt / Modification (Reply with Prompt)
                  </label>
                  <textarea
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Approve action, but ensure headline emphasizes 'Zero-Cost Setup' and primary color is Navy Blue."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Rejection Reason (if rejecting)</label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejecting this decision..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Action
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#10b981] text-slate-950 hover:opacity-90 flex items-center gap-1.5 shadow-lg shadow-[#10b981]/20"
                  >
                    {processing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Approve Decision
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
