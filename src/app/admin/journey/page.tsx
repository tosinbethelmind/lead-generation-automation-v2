'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Flame,
  Zap,
  TrendingUp,
  Users,
  Eye,
  Calculator,
  Video,
  ShoppingCart,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Phone,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Edit3,
  Check,
  Play,
  Share2,
  BarChart3,
  Calendar,
  MapPin,
  Building,
  Mail
} from 'lucide-react';

interface FunnelStats {
  totalTracked: number;
  outreachDispatched: number;
  previewOpened: number;
  calculatorUsed: number;
  videoWatched: number;
  checkoutInitiated: number;
  convertedWon: number;
  hotLeadsCount: number;
  criticalLeadsCount: number;
  activeTodayCount: number;
}

interface JourneyEventItem {
  id: string;
  stage: string;
  title: string;
  description: string;
  channelUsed?: string;
  timestampWat: string;
  metadata?: Record<string, any>;
}

interface LeadRecord {
  leadId: string;
  leadName: string;
  category: string;
  phone?: string;
  email?: string;
  area?: string;
  heatScore: number;
  intentLevel: 'COLD' | 'WARM' | 'HOT' | 'CRITICAL';
  previewUrl: string;
  currentStage: string;
  lastActiveIso: string;
  lastUpdatedWat: string;
  metrics: {
    pageViews: number;
    calculatorInteractions: number;
    videoWatchSec: number;
    chatMessages: number;
    checkoutAttempts: number;
    totalTimeSec: number;
    lastCalculationSummary?: string;
  };
  events?: JourneyEventItem[];
}

interface RetargetingDecision {
  id: string;
  leadId: string;
  leadName: string;
  category: string;
  phone?: string;
  email?: string;
  area?: string;
  ruleType: string;
  title: string;
  reason: string;
  recommendedChannel: 'whatsapp' | 'sms' | 'email';
  recommendedMessage: string;
  heatScore: number;
  intentLevel: string;
  previewUrl: string;
  status: 'PENDING' | 'DISPATCHED' | 'DISMISSED' | 'FAILED';
  createdAt: string;
  dispatchedAt?: string;
  error?: string;
}

interface LiveFeedEvent {
  id: string;
  leadId: string;
  leadName: string;
  category: string;
  stage: string;
  title: string;
  description: string;
  channelUsed?: string;
  timestampWat: string;
  heatScore?: number;
  intentLevel?: string;
  area?: string;
}

export default function CustomerJourneyAnalyticsPage() {
  const [funnelStats, setFunnelStats] = useState<FunnelStats | null>(null);
  const [hotLeads, setHotLeads] = useState<LeadRecord[]>([]);
  const [decisions, setDecisions] = useState<RetargetingDecision[]>([]);
  const [liveFeed, setLiveFeed] = useState<LiveFeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED' | 'DISMISSED'>('ALL');
  const [ruleFilter, setRuleFilter] = useState<string>('ALL');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [editingDecision, setEditingDecision] = useState<RetargetingDecision | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [selectedLine, setSelectedLine] = useState<'LINE_1' | 'LINE_2' | 'LINE_3'>('LINE_2');
  const [batchExecuting, setBatchExecuting] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/journey-analytics');
      const data = await res.json();
      if (data.success) {
        setFunnelStats(data.funnelStats);
        setHotLeads(data.hotLeads || []);
        setDecisions(data.retargetingDecisions || []);
        setLiveFeed(data.liveFeed || []);
      }
    } catch (err) {
      console.warn('Failed to load journey analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunAudit = async () => {
    setAuditing(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/admin/journey-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_audit' })
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(`✅ ${data.message}`);
        fetchAnalytics();
      }
    } catch (err: any) {
      setActionFeedback(`❌ Error running audit: ${err.message}`);
    } finally {
      setAuditing(false);
    }
  };

  const handleExecuteDecision = async (decisionId: string) => {
    setExecutingId(decisionId);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/admin/journey-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute_decision',
          decisionId
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(`🚀 Retargeting dispatched successfully via ${decisions.find(d => d.id === decisionId)?.recommendedChannel.toUpperCase() || 'channel'}!`);
        if (editingDecision?.id === decisionId) setEditingDecision(null);
        fetchAnalytics();
      } else {
        setActionFeedback(`❌ Dispatch failed: ${data.error}`);
      }
    } catch (err: any) {
      setActionFeedback(`❌ Dispatch error: ${err.message}`);
    } finally {
      setExecutingId(null);
    }
  };

  const handleBatchExecuteAll = async () => {
    const pending = decisions.filter(d => d.status === 'PENDING');
    if (pending.length === 0) return;
    setBatchExecuting(true);
    let sent = 0;
    for (const d of pending) {
      try {
        await fetch('/api/admin/journey-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'execute_decision', decisionId: d.id })
        });
        sent++;
      } catch (_) {}
    }
    setBatchExecuting(false);
    setActionFeedback(`🎉 Batch execution completed: ${sent} decisions dispatched!`);
    fetchAnalytics();
  };

  const handleDismissDecision = async (decisionId: string) => {
    try {
      await fetch('/api/admin/journey-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss_decision', decisionId })
      });
      if (editingDecision?.id === decisionId) setEditingDecision(null);
      fetchAnalytics();
    } catch (_) {}
  };

  // Filtered decisions list
  const filteredDecisions = useMemo(() => {
    return decisions.filter(d => {
      const matchesSearch =
        d.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.phone && d.phone.includes(searchQuery)) ||
        (d.area && d.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
      const matchesRule = ruleFilter === 'ALL' || d.ruleType === ruleFilter;
      const matchesIntent = intentFilter === 'ALL' || d.intentLevel === intentFilter;

      return matchesSearch && matchesStatus && matchesRule && matchesIntent;
    });
  }, [decisions, searchQuery, statusFilter, ruleFilter, intentFilter]);

  // Filtered hot leads list
  const filteredHotLeads = useMemo(() => {
    return hotLeads.filter(lead => {
      return (
        lead.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchQuery)) ||
        (lead.area && lead.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [hotLeads, searchQuery]);

  const getHeatBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (score >= 35) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    return 'bg-slate-700/40 text-slate-400 border-slate-600/40';
  };

  const getRuleBadge = (ruleType: string) => {
    switch (ruleType) {
      case 'CALCULATOR_ABANDON':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1"><Calculator className="w-3 h-3" /> Calculator Abandoner</span>;
      case 'VIDEO_ENGAGED_DROP':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1"><Video className="w-3 h-3" /> Video Watcher</span>;
      case 'UNOPENED_48H_NUDGE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1"><Clock className="w-3 h-3" /> 24h Nudge</span>;
      case 'STALLED_DAY5_OFFER':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Zap className="w-3 h-3" /> 5-Day Pilot Offer</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">{ruleType}</span>;
    }
  };

  const pendingCount = decisions.filter(d => d.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* ── TOP HEADER & CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-950">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Customer Journey Intelligence & AI Retargeting
                </h1>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE (5s Sync)
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Real-time micro-interaction heatmaps, calculator sizing drop-off detection & automated decision execution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {pendingCount > 0 && (
            <button
              onClick={handleBatchExecuteAll}
              disabled={batchExecuting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-950 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${batchExecuting ? 'animate-spin' : ''}`} />
              {batchExecuting ? 'Dispatching...' : `⚡ Execute All (${pendingCount} Pending)`}
            </button>
          )}

          <button
            onClick={handleRunAudit}
            disabled={auditing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${auditing ? 'animate-spin' : ''}`} />
            {auditing ? 'Evaluating Decisions...' : 'Run AI Decision Audit'}
          </button>
        </div>
      </div>

      {/* ── ACTION FEEDBACK NOTIFICATION ── */}
      {actionFeedback && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-sm font-medium flex items-center justify-between text-emerald-300 animate-fadeIn">
          <span>{actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-slate-400 hover:text-white text-xs p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Total In Journey</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{funnelStats?.totalTracked || 0}</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            🟢 {funnelStats?.activeTodayCount || 0} active in last 24h
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Prototype Clicks</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">{funnelStats?.previewOpened || 0}</div>
          <div className="text-xs text-slate-400 mt-1">
            {funnelStats?.totalTracked ? Math.round(((funnelStats.previewOpened || 0) / funnelStats.totalTracked) * 100) : 0}% click-through rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Calculator Sizers</span>
            <Calculator className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-400">{funnelStats?.calculatorUsed || 0}</div>
          <div className="text-xs text-indigo-300 font-medium mt-1">High-intent quote testers</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Hot & Critical</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">
            {(funnelStats?.hotLeadsCount || 0) + (funnelStats?.criticalLeadsCount || 0)}
          </div>
          <div className="text-xs text-rose-300 font-medium mt-1">Ready for phone close</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>AI Retarget Actions</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{decisions.length}</div>
          <div className="text-xs text-amber-300 font-medium mt-1">
            {pendingCount} pending decision{pendingCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* ── CONVERSION FUNNEL BAR TRACKER ── */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Live Customer Journey Micro-Conversion Stages
          </h2>
          <span className="text-xs text-slate-400 font-mono">Nigerian Enterprise B2B Funnel</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Outreach Sent', count: funnelStats?.outreachDispatched || 0, color: 'from-blue-500 to-blue-600', icon: Send },
            { label: 'Preview Opened', count: funnelStats?.previewOpened || 0, color: 'from-cyan-500 to-cyan-600', icon: Eye },
            { label: 'Calculator Sizing', count: funnelStats?.calculatorUsed || 0, color: 'from-indigo-500 to-indigo-600', icon: Calculator },
            { label: 'Video Watched', count: funnelStats?.videoWatched || 0, color: 'from-purple-500 to-purple-600', icon: Video },
            { label: 'Checkout Started', count: funnelStats?.checkoutInitiated || 0, color: 'from-amber-500 to-amber-600', icon: ShoppingCart },
            { label: 'Deals Won / Pilot', count: funnelStats?.convertedWon || 0, color: 'from-emerald-500 to-emerald-600', icon: CheckCircle2 },
          ].map((stage, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 relative">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <stage.icon className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Stage 0{idx + 1}</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{stage.count}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{stage.label}</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stage.color}`}
                  style={{
                    width: `${funnelStats?.totalTracked ? Math.max(10, Math.round((stage.count / funnelStats.totalTracked) * 100)) : 10}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR ── */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lead name, phone (+234), sector, area (Lekki, Ikeja)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['ALL', 'PENDING', 'DISPATCHED', 'DISMISSED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Decisions' : tab === 'PENDING' ? `Pending (${pendingCount})` : tab}
              </button>
            ))}
          </div>

          {/* Rule Filter */}
          <select
            value={ruleFilter}
            onChange={(e) => setRuleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Rule Triggers</option>
            <option value="CALCULATOR_ABANDON">Calculator Abandoners</option>
            <option value="VIDEO_ENGAGED_DROP">Video Watchers</option>
            <option value="UNOPENED_48H_NUDGE">24h Unopened Nudges</option>
            <option value="STALLED_DAY5_OFFER">5-Day Stalled Offers</option>
          </select>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN DECISION & LEADERBOARD SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── LEFT COLUMN: AI RETARGETING DECISION CENTER ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  AI Retargeting Decision Center
                </h2>
                <p className="text-xs text-slate-400">
                  Tailored multi-channel follow-ups generated from prospect drop-off behaviors.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">{filteredDecisions.length} decision{filteredDecisions.length === 1 ? '' : 's'}</span>
            </div>

            {filteredDecisions.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600" />
                <p className="font-medium text-slate-400">No retargeting decisions matching current filters.</p>
                <p className="text-xs text-slate-500">Click &quot;Run AI Decision Audit&quot; above to scan all leads for new activity.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
                {filteredDecisions.map(decision => (
                  <div
                    key={decision.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-white text-sm">{decision.leadName}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{decision.category}</span>
                          {decision.area && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {decision.area}</span>}
                          {getRuleBadge(decision.ruleType)}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{decision.reason}</p>
                      </div>

                      <div className="text-right flex flex-col items-end shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getHeatBadgeColor(decision.heatScore)}`}>
                          🔥 {decision.heatScore} Heat
                        </span>
                        <span className={`text-[10px] font-mono mt-1 uppercase font-bold ${decision.status === 'DISPATCHED' ? 'text-emerald-400' : decision.status === 'PENDING' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {decision.status}
                        </span>
                      </div>
                    </div>

                    {/* Channel & Message Box Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> Channel: {decision.recommendedChannel.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            setEditingDecision(decision);
                            setEditedMessage(decision.recommendedMessage);
                          }}
                          className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px] font-sans underline"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Message
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        &ldquo;{decision.recommendedMessage}&rdquo;
                      </p>
                    </div>

                    {/* Actions & Contact */}
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {decision.phone && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {decision.phone}
                          </span>
                        )}
                        <a
                          href={decision.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          View Prototype <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {decision.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleDismissDecision(decision.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleExecuteDecision(decision.id)}
                              disabled={executingId === decision.id}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {executingId === decision.id ? 'Sending...' : 'Dispatch Retarget Now'}
                            </button>
                          </>
                        ) : decision.status === 'DISPATCHED' ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Dispatched Successfully
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-bold uppercase">{decision.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: HOT LEADS BEHAVIORAL LEADERBOARD ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  Hot Leads Leaderboard
                </h2>
                <p className="text-xs text-slate-400">Prospects ranked by real-time behavioral interaction score.</p>
              </div>
              <span className="text-xs font-mono text-slate-500">{filteredHotLeads.length} lead{filteredHotLeads.length === 1 ? '' : 's'}</span>
            </div>

            {filteredHotLeads.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No hot leads recorded yet. As leads interact with preview prototypes, they will appear here.
              </div>
            ) : (
              <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                {filteredHotLeads.map((lead, idx) => (
                  <div
                    key={lead.leadId}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span className="group-hover:text-emerald-400 transition-colors">{lead.leadName}</span>
                          <span className={`px-2 py-0.2 text-[10px] font-extrabold rounded-full border ${getHeatBadgeColor(lead.heatScore)}`}>
                            {lead.heatScore}★
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{lead.category}</span>
                          {lead.area && <span>• {lead.area}</span>}
                        </div>
                        {/* Micro-interaction icons */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-cyan-400" /> {lead.metrics?.pageViews || 0}</span>
                          <span className="flex items-center gap-1"><Calculator className="w-3 h-3 text-indigo-400" /> {lead.metrics?.calculatorInteractions || 0}</span>
                          <span className="flex items-center gap-1"><Video className="w-3 h-3 text-purple-400" /> {lead.metrics?.videoWatchSec || 0}s</span>
                          {lead.metrics?.checkoutAttempts > 0 && (
                            <span className="flex items-center gap-1 text-rose-400 font-bold"><ShoppingCart className="w-3 h-3" /> Checkout</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Good day ${lead.leadName}, checking in regarding your interactive portal preview!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <MessageSquare className="w-3 h-3" /> Chat
                        </a>
                      )}
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-300 flex items-center gap-0.5">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: REAL-TIME CUSTOMER JOURNEY LIVE STREAM ── */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Real-Time Customer Journey Live Stream Feed
            </h2>
            <p className="text-xs text-slate-400">Live incoming stream of prospect page views, calculator sizing, and video progression.</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Stream: Last 40 Events</span>
        </div>

        {liveFeed.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No live events recorded yet. Prospect actions on preview portals will stream here automatically.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {liveFeed.map(evt => (
              <div key={evt.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 text-xs space-y-2 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-white truncate max-w-[130px]">{evt.leadName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{evt.timestampWat.split('WAT')[0]}</span>
                </div>
                <div className="text-slate-200 font-semibold">{evt.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{evt.description}</div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-900 text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">{evt.category}</span>
                  <span className="text-emerald-400 font-mono font-semibold">{evt.channelUsed}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL: LEAD JOURNEY INSPECTOR / TIMELINE DRAWER ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{selectedLead.leadName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getHeatBadgeColor(selectedLead.heatScore)}`}>
                    🔥 {selectedLead.heatScore}★ Heat
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{selectedLead.category}</span>
                  {selectedLead.area && <span>• {selectedLead.area}</span>}
                  <span>• Stage: <strong className="text-emerald-400">{selectedLead.currentStage}</strong></span>
                </p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Page Views</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">{selectedLead.metrics.pageViews || 0}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Calculator Sizing</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">{selectedLead.metrics.calculatorInteractions || 0}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Video Watched</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{selectedLead.metrics.videoWatchSec || 0}s</div>
              </div>
            </div>

            {/* Last Calculation Summary */}
            {selectedLead.metrics.lastCalculationSummary && (
              <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs space-y-1">
                <div className="text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Latest Sizing Calculation:
                </div>
                <div className="text-slate-200 font-mono">{selectedLead.metrics.lastCalculationSummary}</div>
              </div>
            )}

            {/* Event Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Complete Journey Event Timeline</h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {(selectedLead.events || []).map((evt, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-200">{evt.title}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{evt.description}</div>
                    </div>
                    <div className="text-right shrink-0 text-[10px] text-slate-500 font-mono">
                      {evt.timestampWat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <a
                href={selectedLead.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                Open Live Prototype <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Good day ${selectedLead.leadName}, following up on your interactive quote portal preview!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Direct WhatsApp Chat
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT & DISPATCH RETARGETING DECISION ── */}
      {editingDecision && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  Edit & Customize Retargeting Message
                </h3>
                <p className="text-xs text-slate-400">Recipient: <strong className="text-white">{editingDecision.leadName}</strong> ({editingDecision.phone || editingDecision.email})</p>
              </div>
              <button onClick={() => setEditingDecision(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Dispatch Channel</label>
                <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 uppercase font-bold">
                  {editingDecision.recommendedChannel}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Message Copy (Spintax Supported)</label>
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                🔒 Mandatory STOP opt-out footer will be appended automatically if omitted.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingDecision(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  editingDecision.recommendedMessage = editedMessage;
                  handleExecuteDecision(editingDecision.id);
                }}
                disabled={executingId === editingDecision.id}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {executingId === editingDecision.id ? 'Sending...' : 'Confirm & Dispatch Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
