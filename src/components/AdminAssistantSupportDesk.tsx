'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Send,
  Globe,
  DollarSign,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  X,
  Phone,
  Mail,
  UserCheck,
  FileText
} from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface PendingAlertLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  notes?: string;
  created_at: string;
  engine?: string;
}

export default function AdminAssistantSupportDesk() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 21078,
    pendingClaimsCount: 0,
    manualTransfersCount: 0,
    redesignRequestsCount: 0
  });
  const [alerts, setAlerts] = useState<PendingAlertLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<PendingAlertLead | null>(null);

  // Duty Drawer / Modal state
  const [dutyModalOpen, setDutyModalOpen] = useState(false);
  const [dutyActionType, setDutyActionType] = useState<'verify' | 'domain' | 'whatsapp' | 'link'>('verify');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [customFeeInput, setCustomFeeInput] = useState('98000');
  const [generatedAssistLink, setGeneratedAssistLink] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAssistantTasks();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAssistantTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setAlerts(data.alerts);
        if (data.alerts.length > 0 && !selectedLead) {
          setSelectedLead(data.alerts[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching assistant tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsAppPhone = (phone: string) => {
    if (!phone) return '';
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 11) {
      return '234' + digits.slice(1);
    }
    if (digits.length === 10) {
      return '234' + digits;
    }
    return digits;
  };

  const handleVerifyClaim = async (leadId: string) => {
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_claim', leadId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setDutyModalOpen(false);
        fetchAssistantTasks();
      } else {
        showToast(data.error || 'Failed to verify claim', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing verification', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  const handleBindDomain = async (leadId: string) => {
    if (!customDomainInput.trim()) {
      showToast('Please enter a custom domain (e.g. clientbusiness.com)', 'error');
      return;
    }
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bind_domain',
          leadId,
          customDomain: customDomainInput.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setCustomDomainInput('');
        setDutyModalOpen(false);
        fetchAssistantTasks();
      } else {
        showToast(data.error || 'Failed to bind domain', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error binding domain', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  const handleGenerateAssistLink = async (leadId: string) => {
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_assist_link',
          leadId,
          claimFeeNGN: parseInt(customFeeInput) || 98000
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedAssistLink(data.assistLink);
        showToast('Personalized assist claim link generated!');
      } else {
        showToast(data.error || 'Failed to generate link', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error generating link', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  const handleCopyText = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 text-slate-100 shadow-2xl space-y-4 relative overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-bounce ${
          toastMessage.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-rose-950 border-rose-500 text-rose-400'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toastMessage.text}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-cyan-400 animate-pulse" /> Admin Assistant Real-Time Claim Alert & Duty Support Center
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
            Lead Website Claim & Executive Duty Command Desk
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Active Duty Mode
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Receive live alerts on lead views, claim requests, manual bank transfers, and perform 1-click administrative actions to deploy sites.
          </p>
        </div>

        <button
          onClick={fetchAssistantTasks}
          disabled={loading}
          className="accessible-btn accessible-btn-cyan text-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Assistant Alerts
        </button>
      </div>

      {/* 📊 REAL-TIME ALERT METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-cyan-500/30">
          <div className="text-[11px] font-bold text-cyan-400 uppercase">🚨 Pending Website Claims</div>
          <div className="text-2xl font-black text-white mt-1">{stats.pendingClaimsCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting Admin Verification</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
          <div className="text-[11px] font-bold text-emerald-400 uppercase">💳 Manual Bank Transfers</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.manualTransfersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">OPay / Moniepoint Transfers</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-amber-500/30">
          <div className="text-[11px] font-bold text-amber-400 uppercase">🎨 AI Redesign Tasks</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.redesignRequestsCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Custom Prompt Requests</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-indigo-500/30">
          <div className="text-[11px] font-bold text-indigo-400 uppercase">🌐 Domain Mappings</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{alerts.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ready for Custom Domain</div>
        </div>
      </div>

      {/* 🚨 LIVE ALERT DUTY TABLE FOR ADMIN ASSISTANT */}
      <div className="bg-slate-900/90 rounded-xl border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span className="flex items-center gap-2 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Incoming Lead Claims & Administrative Action Queue
          </span>
          <span className="text-[11px] text-slate-400">
            {alerts.length} Leads Requiring Administrative Support
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
            ✅ No pending website claim alerts. All administrative duties are up to date!
          </div>
        ) : (
          <div className="divide-y divide-white/5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Lead / Business</th>
                  <th className="py-2.5 px-3">Phone / Contact</th>
                  <th className="py-2.5 px-3">Claim Status / Notes</th>
                  <th className="py-2.5 px-3 text-right">Administrative Duty Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {alerts.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{lead.name}</div>
                      <div className="text-[10px] text-slate-400">ID: {lead.id}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {lead.phone ? (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                      ) : (
                        <span className="text-slate-500">No phone</span>
                      )}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="line-clamp-2 text-[11px] text-slate-300 bg-slate-950 p-1.5 rounded border border-white/5 font-mono">
                        {lead.notes || 'Lead initiated claim workflow'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* 1-Click Verify Claim & Activate Site */}
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setDutyActionType('verify');
                            setDutyModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                          title="Verify Claim & Activate Site"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Verify & Activate
                        </button>

                        {/* WhatsApp Assistant Support */}
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${formatWhatsAppPhone(lead.phone)}?text=${encodeURIComponent(`Hello ${lead.name}, I am your assigned Admin Support Assistant at Bethelmind Analytics! I saw your request to claim your website (${lead.name}). I am here to help you finalize setup, verify payment, and launch your domain live!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                            title="WhatsApp Admin Support Guidance"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Bind Custom Domain */}
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setDutyActionType('domain');
                            setDutyModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
                          title="Bind Custom Domain"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </button>

                        {/* Generate Assist Claim Link */}
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setDutyActionType('link');
                            handleGenerateAssistLink(lead.id);
                            setDutyModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                          title="Generate Personalized Claim Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔮 ADMIN ASSISTANT ACTION MODAL */}
      {dutyModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Admin Assistant Duty Desk: {selectedLead.name}
              </h3>
              <button onClick={() => setDutyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {dutyActionType === 'verify' && (
              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300">
                  ⚡ <strong>1-Click Claim Verification</strong>: Click below to confirm that payment has been received/verified. This will automatically update the CRM status to <strong>CLOSED WON</strong>, activate the website, and log the administrative completion.
                </div>
                <button
                  onClick={() => handleVerifyClaim(selectedLead.id)}
                  disabled={actionProcessing}
                  className="w-full accessible-btn accessible-btn-emerald py-2.5 text-xs font-bold"
                >
                  {actionProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirm Claim & Activate Website
                </button>
              </div>
            )}

            {dutyActionType === 'domain' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Bind a custom domain registered by or requested by {selectedLead.name}.
                </p>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Custom Domain Name</label>
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="e.g. lekki-solar.com"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <button
                  onClick={() => handleBindDomain(selectedLead.id)}
                  disabled={actionProcessing}
                  className="w-full accessible-btn accessible-btn-indigo py-2.5 text-xs font-bold"
                >
                  {actionProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  Bind Custom Domain & Update Records
                </button>
              </div>
            )}

            {dutyActionType === 'link' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Generate a tailored zero-friction claim link for {selectedLead.name} with custom pricing.
                </p>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Custom Claim Fee (₦ NGN)</label>
                  <input
                    type="number"
                    value={customFeeInput}
                    onChange={(e) => setCustomFeeInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  onClick={() => handleGenerateAssistLink(selectedLead.id)}
                  disabled={actionProcessing}
                  className="w-full accessible-btn accessible-btn-cyan py-2.5 text-xs font-bold"
                >
                  Generate Link
                </button>

                {generatedAssistLink && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[11px] font-mono text-cyan-300 break-all bg-black/50 p-2 rounded">
                      {generatedAssistLink}
                    </div>
                    <button
                      onClick={() => handleCopyText(generatedAssistLink)}
                      className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 flex items-center justify-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Assist Link to Clipboard
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button onClick={() => setDutyModalOpen(false)} className="accessible-btn accessible-btn-ghost text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
