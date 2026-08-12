'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, RefreshCw, Send, AlertTriangle, MessageSquare, Play, Sparkles, Smartphone, Mail, Globe, Bot } from 'lucide-react';
import OutreachChannelSetupHub from '@/components/OutreachChannelSetupHub';

export default function AdminApprovalsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any>({
    baileys: { online: false, status: 'checking' },
    commandCenter: { online: false, pendingCount: 0 },
    telegramBot: { configured: false }
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('PENDING_HUMAN_APPROVAL');

  // Decision Action Modal State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [testCreating, setTestCreating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/admin/approvals' : `/api/admin/approvals?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets || []);
        if (json.gateways) setGateways(json.gateways);
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

  const handleCreateTestTicket = async (channel: 'WHATSAPP' | 'EMAIL' | 'CAMPAIGN') => {
    setTestCreating(true);
    try {
      let payload: any = {};
      if (channel === 'WHATSAPP') {
        payload = {
          action: 'create',
          actionType: 'WHATSAPP_REPLY',
          title: 'WhatsApp Inquiry: B2B Website & Portal Development',
          summary: 'Lead asked: "How much is a custom business website with online payment integration?" AI proposed draft: "Our B2B Growth Portals start at ₦185,000 including Paystack & virtual bank transfer setup, ready in 24 hours. Would you like a live preview link?"',
          proposedData: { channel: 'WHATSAPP', senderPhone: '2348030001122', replyText: 'Our B2B Growth Portals start at ₦185,000 including Paystack & virtual bank transfer setup, ready in 24 hours. Would you like a live preview link?' }
        };
      } else if (channel === 'EMAIL') {
        payload = {
          action: 'create',
          actionType: 'OTHER',
          title: 'Email Inquiry: Custom Software & SaaS Handover',
          summary: 'Client asked: "Can I accept automated bank transfers on my custom web application?" AI proposed draft: "Yes! Moniepoint virtual account transfer and automated webhook reconciliation are built right into your portal."',
          proposedData: { channel: 'EMAIL', senderEmail: 'client@company.com', replyText: 'Yes! Moniepoint virtual account transfer and automated webhook reconciliation are built right into your portal.' }
        };
      } else {
        payload = {
          action: 'create',
          actionType: 'LAUNCH_CAMPAIGN',
          title: 'Launch Campaign: Business Website Outreach (250 Leads)',
          summary: 'AI Engine proposed executing batch WhatsApp + Email outreach offering custom web portals to 250 verified business leads in Lagos.',
          proposedData: { channel: 'CAMPAIGN', leadsCount: 250, targetRegion: 'Lagos' }
        };
      }

      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create test ticket');
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTestCreating(false);
    }
  };

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Human-in-the-Loop AI Governance & Multi-Channel Control
            </div>
            <h1 className="text-3xl font-bold text-white">Central AI Approval Tool</h1>
            <p className="text-sm text-slate-400">Review high-stakes AI decisions, modify prompts on the fly, or authorize message dispatches across WhatsApp, Email, Web Forms & Telegram.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTickets}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#06b6d4] ${loading ? 'animate-spin' : ''}`} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* 🟢 MULTI-CHANNEL OUTREACH & WHATSAPP QR CODE SETUP HUB */}
        <div className="mb-8">
          <OutreachChannelSetupHub />
        </div>

        {/* Live Gateways Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">WhatsApp Baileys Gateway</h4>
                <p className="text-[11px] text-slate-400">Port 3007 (Local Web Socket API)</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              gateways.baileys?.online ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {gateways.baileys?.online ? (gateways.baileys?.status || 'CONNECTED') : 'STANDBY'}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Unified Command Center</h4>
                <p className="text-[11px] text-slate-400">Port 3008 (Email/Web Form Bridge)</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              gateways.commandCenter?.online ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {gateways.commandCenter?.online ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Telegram Approval Bot</h4>
                <p className="text-[11px] text-slate-400">Interactive Push Notifications</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              gateways.telegramBot?.configured ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {gateways.telegramBot?.configured ? 'READY' : 'SIMULATED'}
            </span>
          </div>
        </div>

        {/* Action Controls & Quick Test Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
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

          {/* Quick Demo Test Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Test Flow:</span>
            <button
              disabled={testCreating}
              onClick={() => handleCreateTestTicket('WHATSAPP')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" /> + WhatsApp Ticket
            </button>
            <button
              disabled={testCreating}
              onClick={() => handleCreateTestTicket('EMAIL')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> + Email Ticket
            </button>
            <button
              disabled={testCreating}
              onClick={() => handleCreateTestTicket('CAMPAIGN')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Campaign Ticket
            </button>
          </div>
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#06b6d4] animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Central Approval Queue...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 p-12 rounded-2xl text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-[#10b981]" />
            <h3 className="text-lg font-bold text-white">No Pending Decisions</h3>
            <p className="text-xs text-slate-400 max-w-sm">All AI decisions are currently reviewed and approved. No actions are awaiting human authorization.</p>
            <button
              onClick={() => handleCreateTestTicket('WHATSAPP')}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#06b6d4] text-slate-950 hover:opacity-90 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Test Approval Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30 uppercase">
                      {t.actionType}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'APPROVED'
                          ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                          : t.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
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
                      <span className="text-[#06b6d4] font-bold block mb-1">💬 Admin Custom Prompt / Modifier:</span>
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
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#10b981] text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#10b981]/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve / Modify Prompt
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
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-[#06b6d4]" /> Authorize Decision: {selectedTicket.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{selectedTicket.summary}</p>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Optional Custom Prompt / Instruction Modifier
                  </label>
                  <textarea
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Approve action, but ensure response mentions 'Free On-Site Assessment' and sign off with 'Solar Team'."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Rejection Reason (if rejecting)</label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejecting this action..."
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
                    Authorize Execution
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
