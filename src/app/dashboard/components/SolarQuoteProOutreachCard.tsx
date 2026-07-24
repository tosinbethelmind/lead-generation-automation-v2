'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, CheckCircle, RefreshCw, Layers, ShieldCheck, Globe, Users, ShoppingBag, Mail, Play, Square } from 'lucide-react';

export default function SolarQuoteProOutreachCard() {
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<{ isRunning: boolean; pid: number | null; latestLogs: string[] }>({
    isRunning: false,
    pid: null,
    latestLogs: []
  });

  const [stats, setStats] = useState({
    totalScrapedInstallers: 0,
    totalContactedOutreach: 0,
    groupLinksDiscovered: 0,
    dualSyncStatus: 'online',
    targetMarket: 'Nigeria (36 States + FCT)',
    targetDomain: 'www.solarquotepro.ng'
  });

  const [channels, setChannels] = useState({
    facebook_groups: true,
    telegram: true,
    whatsapp: true,
    nairaland: true,
    linkedin: true,
    web_forms: true,
    jiji: true,
    email: true
  });

  const [dryRun, setDryRun] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(2500);
  const [message, setMessage] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);

  const fetchPipelineStatus = async () => {
    try {
      const res = await fetch('/api/solarquotepro-pipeline');
      if (res.ok) {
        const data = await res.json();
        setPipelineStatus({
          isRunning: !!data.isRunning,
          pid: data.pid || null,
          latestLogs: data.latestLogs || []
        });
      }

      const statsRes = await fetch('/api/outreach/solarquotepro');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelineStatus();
    const interval = setInterval(fetchPipelineStatus, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartPipeline = async () => {
    setExecuting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/solarquotepro-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: dryRun, count: dailyQuota })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`🚀 Isolated Pipeline Launched! PID: ${data.pid || 'Active'}`);
        fetchPipelineStatus();
      } else {
        setMessage(`❌ Launch Error: ${data.error || 'Unknown'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Execution failed: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleStopPipeline = async () => {
    if (!confirm('Are you sure you want to stop the isolated SolarQuotePro pipeline runner?')) return;
    setExecuting(true);
    try {
      const res = await fetch('/api/solarquotepro-pipeline', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('⏹️ Isolated Pipeline Process Stopped.');
        fetchPipelineStatus();
      } else {
        setMessage(`❌ Stop Error: ${data.error || 'Unknown'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Failed to stop process: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
      border: '1px solid rgba(13, 148, 136, 0.3)',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                SolarQuotePro.ng Dedicated Isolated Pipeline
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: pipelineStatus.isRunning ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: pipelineStatus.isRunning ? '#34d399' : '#ef4444',
                border: `1px solid ${pipelineStatus.isRunning ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {pipelineStatus.isRunning ? `● RUNNING (PID ${pipelineStatus.pid})` : '○ STOPPED (ISOLATED)'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              100% isolated non-interfering process harvesting 10K free leads & multi-platform social group outreach for <strong style={{ color: '#2dd4bf' }}>www.solarquotepro.ng</strong>
            </p>
          </div>
        </div>

        <button
          onClick={fetchPipelineStatus}
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#cbd5e1',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh Status
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '20px 0' }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Total Installers Scraped</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2dd4bf', marginTop: '4px' }}>
            {stats.totalScrapedInstallers.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Outreach Dispatches</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {stats.totalContactedOutreach.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Multi-Platform Group Links</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24', marginTop: '4px' }}>
            {stats.groupLinksDiscovered}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Pipeline Isolation Level</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> 100% Dedicated & Safe
          </div>
        </div>
      </div>

      {/* Multi-Platform Channel Toggles */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '12px' }}>
          Active Multi-Platform Social Groups & Mass Outreach Channels:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.facebook_groups} onChange={() => handleToggleChannel('facebook_groups')} style={{ accentColor: '#0d9488' }} />
            <Users size={15} color="#3b82f6" /> Facebook Groups
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.telegram} onChange={() => handleToggleChannel('telegram')} style={{ accentColor: '#0d9488' }} />
            <Users size={15} color="#38bdf8" /> Telegram Channels
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.whatsapp} onChange={() => handleToggleChannel('whatsapp')} style={{ accentColor: '#0d9488' }} />
            <Users size={15} color="#2dd4bf" /> WhatsApp Public Groups
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.nairaland} onChange={() => handleToggleChannel('nairaland')} style={{ accentColor: '#0d9488' }} />
            <Users size={15} color="#fbbf24" /> Nairaland Forum
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.linkedin} onChange={() => handleToggleChannel('linkedin')} style={{ accentColor: '#0d9488' }} />
            <Users size={15} color="#0284c7" /> LinkedIn Groups
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.web_forms} onChange={() => handleToggleChannel('web_forms')} style={{ accentColor: '#0d9488' }} />
            <Globe size={15} color="#a855f7" /> Web Contact Forms
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.jiji} onChange={() => handleToggleChannel('jiji')} style={{ accentColor: '#0d9488' }} />
            <ShoppingBag size={15} color="#34d399" /> Jiji Merchant Direct Inbox
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
            <input type="checkbox" checked={channels.email} onChange={() => handleToggleChannel('email')} style={{ accentColor: '#0d9488' }} />
            <Mail size={15} color="#f43f5e" /> B2B Phased Email
          </label>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Zero-Cost Quota:</span>
            <input
              type="number"
              value={dailyQuota}
              onChange={e => setDailyQuota(Number(e.target.value))}
              style={{ width: '90px', padding: '4px 8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fbbf24', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={dryRun}
              onChange={e => setDryRun(e.target.checked)}
              style={{ accentColor: '#f59e0b' }}
            />
            Dry Run Test Mode
          </label>
        </div>
      </div>

      {/* Action Buttons & Process Status */}
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {pipelineStatus.isRunning ? (
          <button
            onClick={handleStopPipeline}
            disabled={executing}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontWeight: 700,
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              cursor: executing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Square size={16} /> Stop Isolated Pipeline Process
          </button>
        ) : (
          <button
            onClick={handleStartPipeline}
            disabled={executing}
            style={{
              background: 'linear-gradient(90deg, #0d9488, #059669)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              cursor: executing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
            }}
          >
            {executing ? <RefreshCw size={16} className="spin-anim" /> : <Play size={16} />}
            Start Isolated SolarQuotePro Pipeline
          </button>
        )}

        {message && (
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: message.startsWith('🚀') || message.startsWith('⏹️') ? '#34d399' : '#f87171' }}>
            {message}
          </span>
        )}
      </div>

      {/* Live Logs Preview */}
      {pipelineStatus.latestLogs.length > 0 && (
        <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>📋 Isolated Process Log Tail:</div>
          {pipelineStatus.latestLogs.slice(0, 4).map((logLine, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{logLine}</div>
          ))}
        </div>
      )}
    </div>
  );
}
