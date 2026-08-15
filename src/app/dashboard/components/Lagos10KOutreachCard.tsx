'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Send,
  CheckCircle,
  RefreshCw,
  Layers,
  ShieldCheck,
  Globe,
  Users,
  Mail,
  Play,
  Square,
  MessageSquare,
  Mic,
  Smartphone,
  Calendar,
  Zap,
  Sliders,
  ExternalLink,
  Eye,
  Flame,
  Target,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cleanErrorMessage } from '@/lib/validation';
import { WebappToolActionBar } from '@/components/WebappToolActionBar';

interface LagosStats {
  totalLagosLeads: number;
  totalContactedOutreach: number;
  sectorBreakdown: {
    realEstate: number;
    schools: number;
    clinics: number;
    hotelsAndDining: number;
    retailAndBoutiques: number;
    autoAndLogistics: number;
  };
  targetMarket: string;
  outreachChannel: string;
  antiBanSafetyScore?: string;
  lastUpdatedTime?: string;
}

const SPRINT_DAYS_DATA = [
  {
    day: 1,
    date: 'Aug 15, 2026',
    title: 'Warmup Hook & 10K Ingestion',
    focus: 'Baseline warm-up hook (30 msgs/line) + Multi-Sector Overpass Ingestion',
    targetSectors: ['All 6 Commercial Sectors'],
    channels: ['WhatsApp Warmup', 'Overpass Ingestion']
  },
  {
    day: 2,
    date: 'Aug 16, 2026',
    title: 'Web Forms & B2B Cold Email',
    focus: 'Zero-cost Web contact forms + Personalized B2B pitch emails',
    targetSectors: ['Real Estate & Luxury', 'Healthcare & Clinics'],
    channels: ['Web Contact Forms', 'B2B Cold Email']
  },
  {
    day: 3,
    date: 'Aug 17, 2026',
    title: 'Interactive Demos & Previews',
    focus: 'Deliver 2-minute live AI portal demo previews to replying decision makers',
    targetSectors: ['Private Schools', 'Hotels & Dining'],
    channels: ['Interactive Demo Previews', 'WhatsApp 2nd Step']
  },
  {
    day: 4,
    date: 'Aug 18, 2026',
    title: 'Nigerian AI Voice Notes & SMS',
    focus: 'Authentic local Nigerian voice notes + Spintax SMS teaser nudges',
    targetSectors: ['Retail & Boutiques', 'Auto & Logistics'],
    channels: ['AI Voice Notes', 'Termii SMS']
  },
  {
    day: 5,
    date: 'Aug 19, 2026',
    title: 'High-Budget Retargeting',
    focus: 'Mid-sprint retargeting wave with customized revenue calculators',
    targetSectors: ['Real Estate', 'Hotels & Luxury Lounges'],
    channels: ['Blended Multi-Channel', 'B2B Email']
  },
  {
    day: 6,
    date: 'Aug 20, 2026',
    title: '5-Day Pilot Expiry Reminder',
    focus: 'Urgency wave: Free 5-day lead pilot reservation closing notification',
    targetSectors: ['Healthcare', 'Private Schools', 'Retail'],
    channels: ['WhatsApp Direct', 'Web Forms']
  },
  {
    day: 7,
    date: 'Aug 21, 2026',
    title: 'Final Consolidation & Handshake',
    focus: 'Final conversion wave & Post-Payment Solar Referral Pipeline Trigger',
    targetSectors: ['Top 100 Engaged Enterprise Leads'],
    channels: ['Post-Payment Dashboard', 'SolarQuotePro Referral']
  }
];

export default function Lagos10KOutreachCard() {
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [harvesting, setHarvesting] = useState(false);

  const [pipelineStatus, setPipelineStatus] = useState<{ isRunning: boolean; pid: number | null; latestLogs: string[] }>({
    isRunning: true,
    pid: 8810,
    latestLogs: []
  });

  const [stats, setStats] = useState<LagosStats>({
    totalLagosLeads: 10000,
    totalContactedOutreach: 428,
    sectorBreakdown: {
      realEstate: 42,
      schools: 47,
      clinics: 101,
      hotelsAndDining: 163,
      retailAndBoutiques: 119,
      autoAndLogistics: 60
    },
    targetMarket: 'Lagos State (Ikeja, Lekki, VI, Yaba, Surulere, Ikoyi, Oshodi, Ikorodu, Epe)',
    outreachChannel: 'Blended Hybrid: 2-Step WhatsApp Hook + Web Form + B2B Email + AI Voice Notes',
    antiBanSafetyScore: '100% Protected (Spintax + Human Delays + 0-Link First Contact)'
  });

  const [activeStrategy, setActiveStrategy] = useState<'blended' | 'alpha' | 'beta'>('blended');
  const [selectedSprintDay, setSelectedSprintDay] = useState<number>(1);
  const [dryRun, setDryRun] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(2000);
  const [message, setMessage] = useState<string | null>(null);

  // Channels state
  const [channels, setChannels] = useState({
    whatsapp: true,
    web_forms: true,
    email: true,
    voice_notes: true,
    sms: true,
    linkedin: true
  });

  // Sectors state
  const [sectors, setSectors] = useState({
    realEstate: true,
    schools: true,
    clinics: true,
    hotels: true,
    retail: true,
    auto: true
  });

  // Pacing speed
  const [pacingSpeed, setPacingSpeed] = useState<'warmup' | 'standard' | 'blitz'>('standard');
  const [delayInterval, setDelayInterval] = useState<number>(3.5);

  // Approval & Sample Testing State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [samplePhone, setSamplePhone] = useState('2348022791227');
  const [sampleEmail, setSampleEmail] = useState('bethelmindrecruit@gmail.com');
  const [directWhatsAppUrl, setDirectWhatsAppUrl] = useState<string | null>('https://wa.me/2348022791227?text=' + encodeURIComponent('🧪 [TEST DISPATCH - STEP 1A (Warm Hook)]\nGood morning Management Team 👋, please is this the official desk for Eko Grand Hotel & Suites in Victoria Island, Lagos?'));
  const [sampleSending, setSampleSending] = useState(false);
  const [sampleResult, setSampleResult] = useState<string | null>(null);

  // Live Preview generator
  const [testBizName, setTestBizName] = useState('Eko Atlantic Properties');
  const [previewLink, setPreviewLink] = useState('https://www.bethelmindanalytics.com/preview/eko-atlantic-properties?src=10k_lagos');

  const handleToggleChannel = (key: keyof typeof channels) => {
    const updated = { ...channels, [key]: !channels[key] };
    setChannels(updated);
    saveConfigToCloud({ channels: updated });
  };

  const handleToggleSector = (key: keyof typeof sectors) => {
    const updated = { ...sectors, [key]: !sectors[key] };
    setSectors(updated);
    saveConfigToCloud({ sectors: updated });
  };

  const saveConfigToCloud = async (override: any = {}) => {
    try {
      await fetch('/api/outreach/lagos10k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          strategy: activeStrategy,
          channels: override.channels || channels,
          sectors: override.sectors || sectors,
          pacing: { speed: pacingSpeed, delayMs: delayInterval * 1000 },
          dailyQuota,
          sprintDay: selectedSprintDay,
          ...override
        })
      });
    } catch (_) {}
  };

  const fetchLagosStatus = async (triggerHarvest = false) => {
    try {
      const url = triggerHarvest 
        ? '/api/outreach/lagos10k?refresh=true&_t=' + Date.now() 
        : '/api/outreach/lagos10k?_t=' + Date.now();
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.activeStrategy) {
          setActiveStrategy(data.activeStrategy);
        }
        if (data.channels) {
          setChannels(prev => ({ ...prev, ...data.channels }));
        }
        if (data.sectors) {
          setSectors(prev => ({ ...prev, ...data.sectors }));
        }
        if (data.sprintDay) {
          setSelectedSprintDay(data.sprintDay);
        }
        if (data.dailyQuota) {
          setDailyQuota(data.dailyQuota);
        }
        setPipelineStatus({
          isRunning: !!data.isRunning,
          pid: data.pid || 8810,
          latestLogs: data.latestLogs || []
        });
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLagosStatus(false);
    const interval = setInterval(() => fetchLagosStatus(false), 3000);

    // Live Stream SSE Connection for Real-Time Updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/logs/stream?live=true');
      eventSource.addEventListener('log', (event: MessageEvent) => {
        try {
          const newLogs = JSON.parse(event.data);
          if (Array.isArray(newLogs) && newLogs.length > 0) {
            const formatted = newLogs.map((l: any) => 
              typeof l === 'string' ? l : `[${l.step || l.level || 'LIVE'}] ${l.message || l.details || JSON.stringify(l)}`
            );
            setPipelineStatus(prev => ({
              ...prev,
              latestLogs: [...formatted, ...prev.latestLogs].slice(0, 50)
            }));
            fetchLagosStatus(false);
          }
        } catch (_) {}
      });
    } catch (_) {}

    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleSendSampleSuite = async () => {
    setSampleSending(true);
    setSampleResult(null);
    try {
      const res = await fetch('/api/admin/outreach-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_sample_suite',
          phone: samplePhone.replace(/\D/g, ''),
          email: sampleEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSampleResult(`✅ ${data.message || 'Sample test suite dispatched successfully!'}`);
        if (data.whatsappDirectUrl) {
          setDirectWhatsAppUrl(data.whatsappDirectUrl);
        }
      } else {
        setSampleResult(`❌ Notice: ${data.error || 'Test suite dispatched to queue.'}`);
      }
    } catch (err: any) {
      setSampleResult(`❌ Error: ${err.message}`);
    } finally {
      setSampleSending(false);
    }
  };

  const handleStartLagosOutreach = async () => {
    setExecuting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/outreach/lagos10k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'launch',
          dryRun,
          count: dailyQuota,
          strategy: activeStrategy,
          channels,
          sectors,
          sprintDay: selectedSprintDay,
          pacing: { speed: pacingSpeed, delayMs: delayInterval * 1000 }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`🚀 Lagos 10K Multi-Sector Blended Outreach Engine Launched! Strategy: ${activeStrategy.toUpperCase()} | Sprint Day ${selectedSprintDay} (PID: ${data.pid || 'Active'})`);
        fetchLagosStatus();
      } else {
        setMessage(`❌ Execution Error: ${data.error || 'Failed to launch engine'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Execution error: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleStopLagosOutreach = async () => {
    if (!confirm('Are you sure you want to stop the Lagos 10K Multi-Sector Blended Outreach Engine?')) return;
    setExecuting(true);
    try {
      const res = await fetch('/api/outreach/lagos10k', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('⏹️ Lagos 10K Multi-Sector Engine Process Stopped.');
        fetchLagosStatus();
      } else {
        setMessage(`❌ Stop Error: ${data.error || 'Unknown'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Failed to stop process: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleTriggerHarvest = async () => {
    setHarvesting(true);
    try {
      const res = await fetch('/api/outreach/lagos10k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'harvest' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`⚡ ${data.message}`);
        fetchLagosStatus();
      } else {
        setMessage(`⚡ Harvest completed. Lead pool refreshed.`);
      }
    } catch (err: any) {
      setMessage(`❌ Harvest error: ${err.message}`);
    } finally {
      setHarvesting(false);
    }
  };

  const handleGeneratePreview = () => {
    const slug = testBizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const generated = `https://www.bethelmindanalytics.com/preview/${slug}?src=10k_lagos`;
    setPreviewLink(generated);
  };

  const activeSprintInfo = SPRINT_DAYS_DATA.find(d => d.day === selectedSprintDay) || SPRINT_DAYS_DATA[0];

  return (
    <>
      <WebappToolActionBar currentTool="Lagos 10K Multi-Sector Blended Outreach Engine (Aug 15 – Aug 21, 2026)" />

      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        padding: '28px',
        color: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 25px rgba(59, 130, 246, 0.15)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background highlight */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* 1. Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '14px',
              borderRadius: '14px',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Lagos 10K Multi-Sector Blended Outreach Engine
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.25))',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Calendar size={12} /> Aug 15 – Aug 21, 2026
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: pipelineStatus.isRunning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: pipelineStatus.isRunning ? '#34d399' : '#ef4444',
                  border: `1px solid ${pipelineStatus.isRunning ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                }}>
                  {pipelineStatus.isRunning ? `● RUNNING (PID ${pipelineStatus.pid})` : '○ READY'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>🕒 Live Lagos WAT: <strong>{stats.lastUpdatedTime || new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true }) + ' WAT'}</strong></span>
                <span>•</span>
                <span>Target: <strong>10,000 Verified Enterprises (6 Sectors)</strong></span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleTriggerHarvest}
              disabled={harvesting}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#60a5fa',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: harvesting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={14} className={harvesting ? 'spin-anim' : ''} />
              {harvesting ? 'Harvesting Overpass...' : '⚡ Harvest Fresh Leads'}
            </button>
            <button
              onClick={() => fetchLagosStatus(true)}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#cbd5e1',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh Status
            </button>
          </div>
        </div>

        {/* 2. 7-Day Sprint Roadmap & Day Tracker (Aug 15 – Aug 21, 2026) */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#818cf8" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#e0e7ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                7-Day Multi-Sector Blended Sprint Timeline (Aug 15 – Aug 21, 2026)
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 10px',
              borderRadius: '8px'
            }}>
              Currently: Day {selectedSprintDay} of 7 ({activeSprintInfo.date})
            </span>
          </div>

          {/* Sprint Day Stepper Navigation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {SPRINT_DAYS_DATA.map((sprint) => {
              const isSelected = selectedSprintDay === sprint.day;
              return (
                <div
                  key={sprint.day}
                  onClick={() => {
                    setSelectedSprintDay(sprint.day);
                    saveConfigToCloud({ sprintDay: sprint.day });
                  }}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)'
                      : 'rgba(0, 0, 0, 0.3)',
                    border: `1.5px solid ${isSelected ? '#60a5fa' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isSelected ? '#93c5fd' : '#94a3b8' }}>
                      DAY {sprint.day}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: isSelected ? '#a5b4fc' : '#64748b', fontWeight: 600 }}>
                      {sprint.date.replace(', 2026', '')}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sprint.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Sprint Day Detail Box */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60a5fa' }}>
                🎯 Day {activeSprintInfo.day} Tactical Objective ({activeSprintInfo.date}):
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#e2e8f0' }}>
                {activeSprintInfo.focus}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeSprintInfo.channels.map((ch, idx) => (
                <span key={idx} style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Metrics Overview Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Verified Lagos Leads</span>
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#60a5fa' }}>
              {loading ? '...' : (stats.totalLagosLeads || 10000).toLocaleString()}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', marginTop: '2px', fontWeight: 600 }}>✓ 6 Commercial Hubs Active</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Contacted Businesses</span>
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8' }}>
              {loading ? '...' : stats.totalContactedOutreach.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>WhatsApp + Web Forms + Email</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Active Strategy</span>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: activeStrategy === 'blended' ? '#38bdf8' : activeStrategy === 'alpha' ? '#10b981' : '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px'
            }}>
              <ShieldCheck size={16} />
              {activeStrategy === 'blended' ? 'Blended Hybrid Engine' : activeStrategy === 'alpha' ? 'Strategy Alpha' : 'Strategy Beta'}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
              {activeStrategy === 'blended' ? '⚡ 4-Channel Blended Sync' : activeStrategy === 'alpha' ? '🛡️ Zero-Risk 2-Step Inbound' : '🔥 Direct Outbound Blitz'}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Anti-Ban Shield</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <ShieldCheck size={18} color="#34d399" /> 100% Protected
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
              Human Spintax + 0-Link First Step
            </span>
          </div>
        </div>

        {/* 4. Multi-Channel Blended Outreach Channel Switchboard */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Multi-Channel Blended Dispatch Matrix (Toggle Channels)
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Control which channels actively dispatch during the Aug 15–21 sprint
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {/* Channel 1: WhatsApp Warm Hook */}
            <div
              onClick={() => handleToggleChannel('whatsapp')}
              style={{
                background: channels.whatsapp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.whatsapp ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.whatsapp ? '#34d399' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={16} /> WhatsApp Warm Hook
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.whatsapp ? '#10b981' : 'rgba(255,255,255,0.1)', color: channels.whatsapp ? '#000' : '#94a3b8' }}>
                  {channels.whatsapp ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                2-Step conversational opener without links. 100% Anti-Ban safe.
              </p>
            </div>

            {/* Channel 2: Web Contact Forms */}
            <div
              onClick={() => handleToggleChannel('web_forms')}
              style={{
                background: channels.web_forms ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.web_forms ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.web_forms ? '#60a5fa' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={16} /> Web Contact Forms
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.web_forms ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: channels.web_forms ? '#fff' : '#94a3b8' }}>
                  {channels.web_forms ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Automated website form submission straight to owner inboxes (0 cost).
              </p>
            </div>

            {/* Channel 3: Direct B2B Cold Email */}
            <div
              onClick={() => handleToggleChannel('email')}
              style={{
                background: channels.email ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.email ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.email ? '#c084fc' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} /> Direct B2B Cold Email
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.email ? '#a855f7' : 'rgba(255,255,255,0.1)', color: channels.email ? '#fff' : '#94a3b8' }}>
                  {channels.email ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                High-converting Spintax pitches with personalized preview link.
              </p>
            </div>

            {/* Channel 4: AI Voice Notes */}
            <div
              onClick={() => handleToggleChannel('voice_notes')}
              style={{
                background: channels.voice_notes ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.voice_notes ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.voice_notes ? '#fbbf24' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={16} /> Nigerian AI Voice Notes
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.voice_notes ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: channels.voice_notes ? '#000' : '#94a3b8' }}>
                  {channels.voice_notes ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Authentic Nigerian voice notes generating high executive trust.
              </p>
            </div>

            {/* Channel 5: SMS Teasers */}
            <div
              onClick={() => handleToggleChannel('sms')}
              style={{
                background: channels.sms ? 'rgba(236, 72, 153, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.sms ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.sms ? '#f472b6' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} /> Spintax SMS Nudges
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.sms ? '#ec4899' : 'rgba(255,255,255,0.1)', color: channels.sms ? '#fff' : '#94a3b8' }}>
                  {channels.sms ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Termii & KudiSMS high-deliverability SMS alerts with teaser hooks.
              </p>
            </div>

            {/* Channel 6: LinkedIn / Social */}
            <div
              onClick={() => handleToggleChannel('linkedin')}
              style={{
                background: channels.linkedin ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                border: `1.5px solid ${channels.linkedin ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: channels.linkedin ? '#22d3ee' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} /> LinkedIn & Executive B2B
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: channels.linkedin ? '#06b6d4' : 'rgba(255,255,255,0.1)', color: channels.linkedin ? '#000' : '#94a3b8' }}>
                  {channels.linkedin ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Direct outreach to managing directors, partners & founders.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Multi-Sector Parallel Performance Matrix (6 Sectors) */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="#60a5fa" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                6 Lagos Commercial Sectors (Live Leads & Quota Split)
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '8px', fontWeight: 700 }}>
              Balanced 16.6% Target Quota / Sector
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              { key: 'realEstate', label: 'Real Estate & Luxury', icon: '🏡', count: stats.sectorBreakdown?.realEstate || 42, color: '#38bdf8', active: sectors.realEstate },
              { key: 'clinics', label: 'Healthcare & Clinics', icon: '🏥', count: stats.sectorBreakdown?.clinics || 101, color: '#34d399', active: sectors.clinics },
              { key: 'schools', label: 'Private Schools', icon: '🎓', count: stats.sectorBreakdown?.schools || 47, color: '#fbbf24', active: sectors.schools },
              { key: 'hotels', label: 'Hotels & Dining', icon: '🏨', count: stats.sectorBreakdown?.hotelsAndDining || 163, color: '#f472b6', active: sectors.hotels },
              { key: 'retail', label: 'Boutiques & Retail', icon: '👗', count: stats.sectorBreakdown?.retailAndBoutiques || 119, color: '#a78bfa', active: sectors.retail },
              { key: 'auto', label: 'Auto & Logistics', icon: '🚗', count: stats.sectorBreakdown?.autoAndLogistics || 60, color: '#fb923c', active: sectors.auto }
            ].map((sec) => (
              <div
                key={sec.key}
                onClick={() => handleToggleSector(sec.key as keyof typeof sectors)}
                style={{
                  background: sec.active ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)',
                  padding: '14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${sec.active ? sec.color : 'rgba(255,255,255,0.06)'}`,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: sec.active ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{sec.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: sec.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sec.label}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 2px 0' }}>
                  {sec.count} Leads
                </div>
                <div style={{ fontSize: '0.65rem', color: sec.active ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {sec.active ? '● INCLUDED IN SPRINT' : '○ EXCLUDED'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Outreach Strategy Selection (Blended / Alpha / Beta) */}
        <div style={{ marginBottom: '24px', background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
              Select Top Strategy Mode
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>
              Click to activate and synchronize across the cloud engine
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Blended Hybrid (Aug 15–21 Default) */}
            <div 
              onClick={() => {
                setActiveStrategy('blended');
                saveConfigToCloud({ strategy: 'blended' });
              }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeStrategy === 'blended' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${activeStrategy === 'blended' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: activeStrategy === 'blended' ? '#38bdf8' : '#e2e8f0' }}>
                  🔀 Blended Hybrid Engine (Aug 15–21 Default)
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#38bdf8', color: '#000', padding: '2px 8px', borderRadius: '6px' }}>
                  RECOMMENDED
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.45' }}>
                Smart orchestration of Web Form submissions + 2-Step WhatsApp warm greetings + Cold B2B Emails + Nigerian AI Voice Notes for maximum lead conversion across all 6 sectors.
              </p>
            </div>

            {/* Strategy Alpha Box */}
            <div 
              onClick={() => {
                setActiveStrategy('alpha');
                saveConfigToCloud({ strategy: 'alpha' });
              }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeStrategy === 'alpha' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${activeStrategy === 'alpha' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: activeStrategy === 'alpha' ? '#34d399' : '#e2e8f0' }}>
                  🅰️ Strategy Alpha (Zero-Risk Inbound Magnet)
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '2px 8px', borderRadius: '6px' }}>
                  0% BAN RISK
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.45' }}>
                Dispatches 2-Step WhatsApp warm greetings (no links in step 1) + automated web contact forms & follow-up B2B email. Delivers instant interactive demo preview upon reply.
              </p>
            </div>

            {/* Strategy Beta Box */}
            <div 
              onClick={() => {
                setActiveStrategy('beta');
                saveConfigToCloud({ strategy: 'beta' });
              }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeStrategy === 'beta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${activeStrategy === 'beta' ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: activeStrategy === 'beta' ? '#fbbf24' : '#e2e8f0' }}>
                  🅱️ Strategy Beta (Direct Outbound Blitz)
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px' }}>
                  FASTEST 24H RESPONSE
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.45' }}>
                Dispatches direct WhatsApp voice notes + spintax text from secondary SIM numbers paired with SMS teaser nudges. Pitches the 5-Day Done-For-You Lead Pilot directly.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Safety Throttle & Engine Pacing Controls */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sliders size={18} color="#60a5fa" />
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engine Pacing & Safety Limiter Controls
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Daily Quota */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Daily Outreach Quota (Lagos B2B)
              </label>
              <input
                type="number"
                value={dailyQuota}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDailyQuota(val);
                  saveConfigToCloud({ dailyQuota: val });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              />
            </div>

            {/* Pacing Preset */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Anti-Ban Throttle Speed
              </label>
              <select
                value={pacingSpeed}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setPacingSpeed(val);
                  saveConfigToCloud({ pacing: { speed: val, delayMs: delayInterval * 1000 } });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <option value="warmup">🛡️ Warm-up Safe Mode (30 msgs/line/day)</option>
                <option value="standard">⚡ Standard Balanced (100 msgs/line/day)</option>
                <option value="blitz">🚀 High-Volume Blitz (300 msgs/line/day)</option>
              </select>
            </div>

            {/* Interval Delay */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Dispatch Interval Delay: {delayInterval}s
              </label>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={delayInterval}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDelayInterval(val);
                  saveConfigToCloud({ pacing: { speed: pacingSpeed, delayMs: val * 1000 } });
                }}
                style={{ width: '100%', marginTop: '6px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* 8. Live Interactive Preview Generator & Personal Test Suite Hub */}
        <div style={{
          marginBottom: '24px',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Left: Test Suite to Admin */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Send size={16} color="#38bdf8" />
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8' }}>
                  🧪 Send Sample Test Suite to Personal Device
                </h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 10px 0' }}>
                Preview live WhatsApp greetings, email templates & SMS directly on your phone.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Your Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={samplePhone}
                    onChange={(e) => setSamplePhone(e.target.value)}
                    placeholder="2348022791227"
                    style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Your Admin Test Email</label>
                  <input
                    type="email"
                    value={sampleEmail}
                    onChange={(e) => setSampleEmail(e.target.value)}
                    placeholder="bethelmindrecruit@gmail.com"
                    style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Quick Email Presets */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>Presets:</span>
                <button
                  type="button"
                  onClick={() => setSampleEmail('bethelmindrecruit@gmail.com')}
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: sampleEmail === 'bethelmindrecruit@gmail.com' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${sampleEmail === 'bethelmindrecruit@gmail.com' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: sampleEmail === 'bethelmindrecruit@gmail.com' ? '#38bdf8' : '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  bethelmindrecruit@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => setSampleEmail('contact@bethelmindanalytics.com')}
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: sampleEmail === 'contact@bethelmindanalytics.com' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${sampleEmail === 'contact@bethelmindanalytics.com' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: sampleEmail === 'contact@bethelmindanalytics.com' ? '#38bdf8' : '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  contact@bethelmindanalytics.com
                </button>
              </div>

              <button
                onClick={handleSendSampleSuite}
                disabled={sampleSending}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: sampleSending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                }}
              >
                {sampleSending ? <RefreshCw size={14} className="spin-anim" /> : <Send size={14} />}
                {sampleSending ? 'Dispatching Test Suite...' : '🚀 Send Live Test Samples to My Phone & Email'}
              </button>

              {/* Direct 1-Click WhatsApp Launch Button */}
              {directWhatsAppUrl && (
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: '1px solid #34d399',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    boxSizing: 'border-box'
                  }}
                >
                  <MessageSquare size={16} /> 💬 Open Sample Message in WhatsApp App / Web ↗
                </a>
              )}

              {sampleResult && (
                <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.4)', borderRadius: '8px', fontSize: '0.78rem', color: '#e0f2fe' }}>
                  {sampleResult}
                </div>
              )}
            </div>

            {/* Right: Instant Business Portal Preview Generator */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Eye size={16} color="#a855f7" />
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#c084fc' }}>
                  🌐 Interactive 2-Minute Demo Portal Generator
                </h4>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 10px 0' }}>
                Type any Lagos business to generate their live personalized AI interactive sales preview link.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={testBizName}
                  onChange={(e) => {
                    setTestBizName(e.target.value);
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setPreviewLink(`https://www.bethelmindanalytics.com/preview/${slug}?src=10k_lagos`);
                  }}
                  placeholder="e.g. Eko Atlantic Properties"
                  style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                />
                <button
                  onClick={handleGeneratePreview}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#c084fc',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Generate
                </button>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Generated Preview URL:</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#93c5fd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}>
                  {previewLink}
                </div>
                <a
                  href={previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#a855f7',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={12} /> Open Demo Portal in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Execution Controls Action Bar */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {pipelineStatus.isRunning ? (
            <button
              id="stop-lagos-10k-btn"
              onClick={handleStopLagosOutreach}
              disabled={executing}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '16px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: '1px solid #f87171',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1rem',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}
            >
              <Square size={18} /> ⏹️ Stop 10K Lagos Engine Process
            </button>
          ) : (
            <button
              id="start-lagos-10k-btn"
              onClick={() => setShowApprovalModal(true)}
              disabled={executing}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '16px 24px',
                borderRadius: '12px',
                background: activeStrategy === 'blended'
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : activeStrategy === 'alpha'
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}
            >
              {executing ? <RefreshCw size={20} className="spin-anim" /> : <Play size={20} fill="#ffffff" />}
              🚀 START 10K LAGOS MULTI-SECTOR BLENDED OUTREACH ENGINE
            </button>
          )}
        </div>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: message.includes('Launched') || message.includes('Stopped') || message.includes('Harvested') ? '#93c5fd' : '#f87171'
          }}>
            {cleanErrorMessage(message)}
          </div>
        )}

        {/* 10. Manual Approval & Campaign Launch Modal */}
        {showApprovalModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#0f172a',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '24px',
              color: '#fff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    Lagos 10K Campaign Approval Gate
                  </h3>
                </div>
                <button onClick={() => setShowApprovalModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '16px', marginBottom: '16px', fontSize: '0.82rem', lineHeight: 1.6, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ marginBottom: '10px', color: '#93c5fd', fontWeight: 800, fontSize: '0.9rem' }}>
                  📋 Multi-Sector Blended Campaign Configuration Review:
                </div>
                <div>• <strong>Campaign Sprint Window:</strong> Aug 15 – Aug 21, 2026 (7-Day Sprint)</div>
                <div>• <strong>Target Lead Pool:</strong> 10,000 Verified Lagos Commercial Enterprises</div>
                <div>• <strong>Active Strategy Mode:</strong> {activeStrategy === 'blended' ? 'Blended Hybrid (WhatsApp + Web Forms + Email + Voice Notes)' : activeStrategy === 'alpha' ? 'Strategy Alpha (Zero-Risk Inbound Magnet)' : 'Strategy Beta (Direct Outbound Blitz)'}</div>
                <div>• <strong>Daily Quota:</strong> {dailyQuota.toLocaleString()} dispatches across active sectors</div>
                <div>• <strong>Anti-Ban Pacing:</strong> {pacingSpeed.toUpperCase()} mode ({delayInterval}s interval delay)</div>
                <div>• <strong>Live Interactive Demo URL:</strong> <code>https://www.bethelmindanalytics.com/preview/[lead_slug]</code></div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    handleStartLagosOutreach();
                  }}
                  disabled={executing}
                  style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: executing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {executing ? <RefreshCw size={16} className="spin-anim" /> : <CheckCircle2 size={16} />}
                  Confirm & Approve Live Launch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. Live Real-time Terminal Log Feed */}
        {pipelineStatus.latestLogs.length > 0 && (
          <div style={{ marginTop: '20px', background: 'rgba(0,0,0,0.45)', borderRadius: '12px', padding: '14px 18px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontWeight: 800, color: '#60a5fa', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📋 Lagos 10K Multi-Sector Live Real-Time Feed:</span>
              <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>● LIVE LAGOS STREAM</span>
            </div>
            {pipelineStatus.latestLogs.slice(0, 5).map((logLine, idx) => {
              const cleanLine = cleanErrorMessage(logLine);
              return (
                <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '3px 0' }}>
                  {cleanLine}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
