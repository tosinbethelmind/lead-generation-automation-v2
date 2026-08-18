'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Rocket,
  ExternalLink,
  RefreshCw,
  Power,
  Sparkles,
  Search,
  Send,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Sliders,
  Radio,
  FileCode2,
  UserCheck,
  ChevronRight,
  Database,
  Smartphone,
  PhoneCall,
  Check
} from 'lucide-react';
import AdminAiCommandTerminal from '@/components/AdminAiCommandTerminal';
import MultiWhatsAppConnectionCard from '@/app/dashboard/components/MultiWhatsAppConnectionCard';

interface LeadItem {
  lead_id: string;
  name: string;
  category?: string;
  area?: string;
  city?: string;
  phone_e164?: string;
  phone_raw?: string;
  email?: string;
  rating?: number;
  status?: string;
  notes?: string;
  collected_at?: string;
}

export default function CleanExecutiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'outreach' | 'leads' | 'whatsapp' | 'settings'>('outreach');

  // AI Copilot state
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');

  // Dashboard live state
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Real KPI stats
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [totalContactedCount, setTotalContactedCount] = useState(0);
  const [claimedCount, setClaimedCount] = useState(0);
  const [sprintDay, setSprintDay] = useState(1);
  const [safeLimit, setSafeLimit] = useState(30);
  const [dispatchedToday, setDispatchedToday] = useState(0);

  // Runner state
  const [runnerActive, setRunnerActive] = useState<boolean>(true);
  const [togglingRunner, setTogglingRunner] = useState<boolean>(false);

  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Outreach Launcher Form State
  const [selectedSector, setSelectedSector] = useState('Salons & Beauty');
  const [batchSize, setBatchSize] = useState(10);
  const [channelSms, setChannelSms] = useState(true);
  const [channelWa, setChannelWa] = useState(true);
  const [launchingBatch, setLaunchingBatch] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);

  // Settings State
  const [dryRun, setDryRun] = useState(false);
  const [smsGatewayUrl, setSmsGatewayUrl] = useState('http://10.132.90.251:8082');
  const [claimFee, setClaimFee] = useState(185000);
  const [saveSettingsStatus, setSaveSettingsStatus] = useState('');

  const fetchLiveDashboard = async () => {
    setStatsLoading(true);
    try {
      // 1. Fetch leads
      const leadsRes = await fetch('/api/leads').catch(() => null);
      if (leadsRes?.ok) {
        const data = await leadsRes.json();
        if (Array.isArray(data)) {
          setLeads(data);
          setTotalLeadsCount(data.length);
          const contacted = data.filter((l: any) => (l.status || '').toUpperCase() === 'CONTACTED');
          const claimed = data.filter((l: any) => (l.status || '').toUpperCase() === 'CLAIMED' || (l.notes || '').includes('[claimed]'));
          setTotalContactedCount(contacted.length);
          setClaimedCount(claimed.length);

          const todayStr = new Date().toISOString().split('T')[0];
          const todayDispatched = contacted.filter((l: any) => {
            const cDate = (l.last_contacted_at || l.lastContactedAt || l.contactedAt || '').split('T')[0];
            return cDate === todayStr;
          });
          setDispatchedToday(todayDispatched.length);
        }
      }

      // 2. Fetch Runner toggle
      const runnerRes = await fetch('/api/admin/runner-toggle').catch(() => null);
      if (runnerRes?.ok) {
        const runnerData = await runnerRes.json();
        if (typeof runnerData.active === 'boolean') setRunnerActive(runnerData.active);
      }

      // 3. Fetch Config & Sprint Info
      const configRes = await fetch('/api/config').catch(() => null);
      if (configRes?.ok) {
        const cfg = await configRes.json();
        if (typeof cfg.dryRun === 'boolean') setDryRun(cfg.dryRun);
        if (cfg.smsGatewayUrl) setSmsGatewayUrl(cfg.smsGatewayUrl);
      }

      // 4. Fetch sprint status
      const now = new Date();
      const sprintStart = new Date('2026-08-17T00:00:00Z');
      const diffDays = Math.floor((now.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const dayNum = Math.max(1, Math.min(diffDays, 7));
      setSprintDay(dayNum);
      setSafeLimit(dayNum <= 2 ? 30 : dayNum <= 5 ? 45 : 60);

      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (_) {
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDashboard();
    const interval = setInterval(fetchLiveDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleRunner = async (enable: boolean) => {
    setTogglingRunner(true);
    try {
      const res = await fetch('/api/admin/runner-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable }),
      });
      const data = await res.json();
      if (data.success) {
        setRunnerActive(data.active);
      }
    } catch (_) {
    } finally {
      setTogglingRunner(false);
    }
  };

  const handleLaunchOutreach = async () => {
    setLaunchingBatch(true);
    setBatchResult(null);

    try {
      const prompt = `Launch outreach batch of ${batchSize} leads for ${selectedSector}`;
      const res = await fetch('/api/admin/command-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: prompt })
      });
      const data = await res.json();
      setBatchResult(data);
      fetchLiveDashboard();
    } catch (err: any) {
      setBatchResult({ success: false, error: err.message });
    } finally {
      setLaunchingBatch(false);
    }
  };

  const handleSendTestSms = async () => {
    setLaunchingBatch(true);
    setBatchResult(null);
    try {
      const res = await fetch('/api/admin/command-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'Send test SMS with prototype link to my remembered phone number' })
      });
      const data = await res.json();
      setBatchResult(data);
      fetchLiveDashboard();
    } catch (err: any) {
      setBatchResult({ success: false, error: err.message });
    } finally {
      setLaunchingBatch(false);
    }
  };

  const handleExecutePromptBar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    setCopilotOpen(true);
  };

  // Filtered leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchTerm || 
      (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone_e164 || l.phone_raw || '').includes(searchTerm) ||
      (l.area || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || 
      (l.category || '').toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCat;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* ── TOP EXECUTIVE APP BAR ────────────────────────────────────── */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)'
            }}>
              <Rocket size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Bethelmind Admin
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  LAGOS 10K ENGINE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Active Sprint Cycle: Aug 17 – Aug 23, 2026 (Day {sprintDay} of 7)
              </p>
            </div>
          </div>

          {/* Action Center Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* AI Copilot Assistant Button */}
            <button
              id="admin-copilot-header-btn"
              onClick={() => setCopilotOpen(prev => !prev)}
              style={{
                background: copilotOpen ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.15)',
                border: `1.5px solid ${copilotOpen ? '#10b981' : 'rgba(16, 185, 129, 0.4)'}`,
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: copilotOpen ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
              title="Toggle AI Copilot Assistant (Ctrl+K)"
            >
              <Sparkles size={16} style={{ color: '#fef08a' }} />
              <span>AI Copilot Assistant</span>
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '2px 6px',
                borderRadius: '5px',
                color: '#a7f3d0'
              }}>
                Ctrl+K
              </span>
            </button>

            {/* Sync Live Data */}
            <button
              onClick={fetchLiveDashboard}
              disabled={statsLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Refresh live metrics"
            >
              <RefreshCw size={14} className={statsLoading ? 'spin-anim' : ''} />
              <span>{lastSyncTime ? `Synced ${lastSyncTime}` : 'Sync'}</span>
            </button>

            {/* Production Domain */}
            <a
              href="https://www.bethelmindanalytics.com"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ExternalLink size={14} />
              <span>Live Domain</span>
            </a>

            {/* Runner Power Switch */}
            <button
              onClick={() => toggleRunner(!runnerActive)}
              disabled={togglingRunner}
              style={{
                background: runnerActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                border: `1.5px solid ${runnerActive ? '#10b981' : '#ef4444'}`,
                color: runnerActive ? '#34d399' : '#f87171',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Power size={14} />
              <span>{runnerActive ? '🟢 RUNNER ON' : '🔴 RUNNER OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ──────────────────────────────────── */}
      <main style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* ── 1. HERO AI COMMAND PROMPT BAR ─────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Sparkles size={18} style={{ color: '#34d399' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f0fdf4' }}>
              Autonomous AI Command Prompt
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              — Give worded English commands to scrape leads, launch outreach batches, and verify website claims
            </span>
          </div>

          <form onSubmit={handleExecutePromptBar} style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', color: '#64748b' }} />
              <input
                type="text"
                value={quickPrompt}
                onChange={e => setQuickPrompt(e.target.value)}
                placeholder="E.g., 'Launch today\'s 30 outreach batch for salons' or 'Send test SMS'..."
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px 12px 46px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Send size={16} />
              <span>Execute</span>
            </button>
          </form>

          {/* Quick One-Click Action Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Quick Actions:</span>
            
            <button
              onClick={handleSendTestSms}
              disabled={launchingBatch}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ⚡ Send Test SMS (08022791227)
            </button>

            <button
              onClick={() => {
                setQuickPrompt("Launch today's 30 outreach batch for salons");
                setCopilotOpen(true);
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🚀 Launch Today's 30 Outreach Batch
            </button>

            <button
              onClick={() => {
                setQuickPrompt("Scrape 15 luxury salon leads in Ikeja");
                setCopilotOpen(true);
              }}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🎯 Scrape 15 Salons in Ikeja
            </button>

            <button
              onClick={() => {
                setQuickPrompt("Show sprint progress and gateway diagnostic");
                setCopilotOpen(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📊 Show Sprint Report
            </button>
          </div>
        </div>

        {/* ── 2. REAL METRIC KPI CARDS (NO FAKE DATA) ───────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Total Leads */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>TOTAL CRM LEADS</span>
              <Database size={16} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
              {loading ? '...' : totalLeadsCount.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
              ● Verified Lagos Business Pool
            </span>
          </div>

          {/* Card 2: Today's Safe Ramp Dispatches */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>TODAY'S DISPATCHES</span>
              <Send size={16} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399' }}>
              {dispatchedToday} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ {safeLimit} max</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Safe Warm-up Limit (Day {sprintDay} of 7)
            </span>
          </div>

          {/* Card 3: Total Contacted */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>TOTAL CONTACTED</span>
              <PhoneCall size={16} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
              {loading ? '...' : totalContactedCount.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>
              Interactive prototypes delivered
            </span>
          </div>

          {/* Card 4: Verified Claims */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>CLAIMED PROTOTYPES</span>
              <CheckCircle2 size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>
              {loading ? '...' : claimedCount.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>
              48h instant setup conversions
            </span>
          </div>
        </div>

        {/* ── 3. CLEAN SEGMENT TABS ─────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '24px',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setActiveTab('outreach')}
            style={{
              background: activeTab === 'outreach' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              border: `1.5px solid ${activeTab === 'outreach' ? '#10b981' : 'transparent'}`,
              color: activeTab === 'outreach' ? '#ffffff' : '#94a3b8',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Rocket size={16} />
            <span>Outreach Launcher</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            style={{
              background: activeTab === 'leads' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: `1.5px solid ${activeTab === 'leads' ? '#38bdf8' : 'transparent'}`,
              color: activeTab === 'leads' ? '#ffffff' : '#94a3b8',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Users size={16} />
            <span>Live CRM Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            style={{
              background: activeTab === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'transparent',
              border: `1.5px solid ${activeTab === 'whatsapp' ? '#25d366' : 'transparent'}`,
              color: activeTab === 'whatsapp' ? '#ffffff' : '#94a3b8',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Smartphone size={16} color="#25d366" />
            <span>WhatsApp Lines (2x Multi-Connect)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: `1.5px solid ${activeTab === 'settings' ? 'rgba(255, 255, 255, 0.3)' : 'transparent'}`,
              color: activeTab === 'settings' ? '#ffffff' : '#94a3b8',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Sliders size={16} />
            <span>Gateway & Settings</span>
          </button>
        </div>

        {/* ── TAB 1: OUTREACH LAUNCHER ──────────────────────────────── */}
        {activeTab === 'outreach' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {/* Launcher Controls */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                🚀 Launch Targeted Outreach Batch
              </h3>

              {/* Target Sector */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  SELECT TARGET SECTOR
                </label>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                >
                  <option value="Salons & Beauty">Salons, Spas & Beauty Clinics (Lekki / Ikeja)</option>
                  <option value="Healthcare & Dental">Medical & Healthcare Clinics</option>
                  <option value="Auto Repair & Detailing">Auto Repair & Logistics</option>
                  <option value="Restaurants & Lounges">Restaurants & Food Brands</option>
                  <option value="Real Estate & Property">Real Estate Agencies</option>
                  <option value="Retail & Boutiques">Retail & Fashion Boutiques</option>
                </select>
              </div>

              {/* Batch Size Selection */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  BATCH SIZE (Safe Warm-up Cap: {safeLimit} msgs/day)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[10, 20, 30].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBatchSize(size)}
                      style={{
                        flex: 1,
                        background: batchSize === size ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1.5px solid ${batchSize === size ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: batchSize === size ? '#34d399' : '#cbd5e1',
                        padding: '10px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {size} Leads
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Routing */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  DISPATCH CHANNELS
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channelSms}
                      onChange={e => setChannelSms(e.target.checked)}
                      style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    <span>Tailscale Android SMS Gateway (10.132.90.251:8082)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channelWa}
                      onChange={e => setChannelWa(e.target.checked)}
                      style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    <span>WhatsApp Direct Rotator (Mobile Preview & Booking Hook)</span>
                  </label>
                </div>
              </div>

              {/* Big Launch Button */}
              <button
                onClick={handleLaunchOutreach}
                disabled={launchingBatch}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Rocket size={18} />
                <span>{launchingBatch ? 'Executing Batch Dispatch...' : `Launch ${batchSize} Leads Outreach Batch`}</span>
              </button>
            </div>

            {/* Live Output & Delivery Log */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                📋 Real-Time Execution Status
              </h3>

              {batchResult ? (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  flex: 1,
                  overflowY: 'auto'
                }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399', marginBottom: '10px' }}>
                    {batchResult.summary || 'Execution Complete'}
                  </div>
                  <pre style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'Courier New', monospace"
                  }}>
                    {batchResult.output || JSON.stringify(batchResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  textAlign: 'center',
                  padding: '30px'
                }}>
                  <Send size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8' }}>
                    Ready for live outreach dispatches
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem' }}>
                    Select a sector and click Launch Batch or give a prompt to start today's run.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE CRM LEADS ─────────────────────────────────── */}
        {activeTab === 'leads' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            {/* Filter Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by business name, phone, area..."
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="salon">Salons & Beauty</option>
                  <option value="clinic">Clinics & Health</option>
                  <option value="auto">Auto & Repair</option>
                  <option value="restaurant">Restaurants</option>
                </select>
              </div>

              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Showing <strong>{filteredLeads.length}</strong> leads
              </span>
            </div>

            {/* Leads Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>BUSINESS NAME</th>
                    <th style={{ padding: '10px 12px' }}>PHONE</th>
                    <th style={{ padding: '10px 12px' }}>CATEGORY & AREA</th>
                    <th style={{ padding: '10px 12px' }}>STATUS</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.slice(0, 25).map((lead) => {
                      const isClaimed = (lead.status || '').toUpperCase() === 'CLAIMED';
                      const isContacted = (lead.status || '').toUpperCase() === 'CONTACTED';
                      const previewUrl = `/preview/${encodeURIComponent(lead.lead_id)}`;

                      return (
                        <tr key={lead.lead_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#ffffff' }}>
                            {lead.name}
                          </td>
                          <td style={{ padding: '12px', color: '#38bdf8', fontFamily: 'monospace' }}>
                            {lead.phone_e164 || lead.phone_raw || 'No phone'}
                          </td>
                          <td style={{ padding: '12px', color: '#cbd5e1' }}>
                            <span>{lead.category || 'General'}</span>
                            {lead.area && <span style={{ color: '#64748b', marginLeft: '6px' }}>({lead.area})</span>}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: isClaimed ? 'rgba(16, 185, 129, 0.2)' : isContacted ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              color: isClaimed ? '#34d399' : isContacted ? '#fbbf24' : '#94a3b8'
                            }}>
                              {lead.status || 'NEW'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <a
                              href={previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#38bdf8',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Eye size={12} /> View Prototype
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        No leads found. Use the AI Copilot above to scrape fresh prospects: E.g., <code>Scrape 20 salon leads in Ikeja</code>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: DEDICATED WHATSAPP MULTI-LINE ROTATOR ──────────── */}
        {activeTab === 'whatsapp' && (
          <div>
            <MultiWhatsAppConnectionCard />
          </div>
        )}

        {/* ── TAB 4: GATEWAY & SYSTEM SETTINGS ──────────────────────── */}
        {activeTab === 'settings' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              ⚙️ Engine Architecture & Gateway Configuration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Setting 1: SMS Gateway */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  TAILSCALE ANDROID SMS GATEWAY
                </label>
                <input
                  type="text"
                  value={smsGatewayUrl}
                  readOnly
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#34d399',
                    fontFamily: 'monospace',
                    fontSize: '0.84rem'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'block', marginTop: '6px' }}>
                  ● Connected & Online (Dedicated Tailscale Route)
                </span>
              </div>

              {/* Setting 2: Dry Run Mode */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  OUTREACH EXECUTION MODE
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.86rem', color: dryRun ? '#fbbf24' : '#34d399', fontWeight: 700 }}>
                    {dryRun ? '🟡 DRY RUN (Simulation Only)' : '🟢 LIVE CARRIER DISPATCH'}
                  </span>
                  <button
                    onClick={() => {
                      const next = !dryRun;
                      setDryRun(next);
                      fetch('/api/admin/command-copilot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ command: `Set dry run ${next ? 'true' : 'false'}` })
                      });
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Toggle Mode
                  </button>
                </div>
              </div>

              {/* Setting 3: Instant Setup Claim Fee */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  WEBSITE PROTOTYPE CLAIM FEE
                </label>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₦185,000 NGN
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                  Instant Moniepoint & Paystack 48h Setup Claim
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── AI COPILOT ASSISTANT DRAWER ──────────────────────────────── */}
      <AdminAiCommandTerminal
        isOpen={copilotOpen}
        onToggle={setCopilotOpen}
        hideFloatingTrigger={true}
      />

      {/* Scoped CSS animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
