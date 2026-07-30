'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Send, CheckCircle, RefreshCw, Layers, ShieldCheck, MapPin, Globe, Users, Mail, Play, Square } from 'lucide-react';
import { cleanErrorMessage } from '@/lib/validation';

export default function Lagos10KOutreachCard() {

  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  const [pipelineStatus, setPipelineStatus] = useState<{ isRunning: boolean; pid: number | null; latestLogs: string[] }>({
    isRunning: false,
    pid: null,
    latestLogs: []
  });

  const [stats, setStats] = useState({
    totalLagosLeads: 0,
    totalContactedOutreach: 0,
    commercialHotelsCount: 200,
    targetMarket: 'Lagos State (Ikeja, Lekki, VI, Yaba, Surulere, Oshodi, Ikorodu)',
    outreachChannel: 'Web Contact Form Auto-Submitter & B2B Email'
  });

  const [activeStrategy, setActiveStrategy] = useState<'alpha' | 'beta'>('alpha');
  const [dryRun, setDryRun] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(2000);
  const [message, setMessage] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(false);

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
        setPipelineStatus({
          isRunning: !!data.isRunning,
          pid: data.pid || null,
          latestLogs: data.latestLogs || []
        });
      }
    } catch (_) {
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchLagosStatus(false);
    const interval = setInterval(() => fetchLagosStatus(false), 2000);

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

  const handleStartLagosOutreach = async () => {
    setExecuting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/outreach/lagos10k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, count: dailyQuota, strategy: activeStrategy })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`🚀 High-Speed Lagos 10K Engine Launched using ${activeStrategy === 'alpha' ? 'STRATEGY ALPHA (Zero-Risk Inbound Magnet)' : 'STRATEGY BETA (Direct Outbound Blitz)'}! (PID: ${data.pid || 'Active'})`);
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
    if (!confirm('Are you sure you want to stop the Lagos 10K B2B Engine process?')) return;
    setExecuting(true);
    try {
      const res = await fetch('/api/outreach/lagos10k', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('⏹️ Lagos 10K Engine Process Stopped.');
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                10K Lagos B2B Outreach Engine
              </h2>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: pipelineStatus.isRunning ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                color: pipelineStatus.isRunning ? '#60a5fa' : '#ef4444',
                border: `1px solid ${pipelineStatus.isRunning ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {pipelineStatus.isRunning ? `● RUNNING (PID ${pipelineStatus.pid})` : '○ STOPPED (READY)'}
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.4)'
              }}>
                🕒 Live WAT: {(stats as any).lastUpdatedTime || new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true }) + ' WAT'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Optimized A/B Test Engine for 50%+ Lead-to-Paid Sales Conversion
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchLagosStatus(true)}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Verified Lagos Leads</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>
            {loading ? '...' : (stats.totalLagosLeads || 0).toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', marginTop: '2px' }}>✓ Commercial Hubs Active</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Contacted Businesses</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
            {loading ? '...' : stats.totalContactedOutreach.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Direct Web & Email Pits</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Active Strategy</span>
          <span style={{ fontSize: '1.0rem', fontWeight: 700, color: activeStrategy === 'alpha' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ShieldCheck size={16} color={activeStrategy === 'alpha' ? '#10b981' : '#f59e0b'} />
            {activeStrategy === 'alpha' ? 'Strategy Alpha (Inbound)' : 'Strategy Beta (Direct)'}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
            {activeStrategy === 'alpha' ? '🛡️ 0% WA Ban Risk (Form + Email)' : '⚡ Direct WhatsApp Blitz'}
          </span>
        </div>
      </div>

      {/* A/B Strategy Selection Tabs */}
      <div style={{ marginBottom: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select Top Outreach Strategy Mode
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {/* Strategy Alpha Box */}
          <div 
            onClick={() => setActiveStrategy('alpha')}
            style={{
              padding: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: activeStrategy === 'alpha' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${activeStrategy === 'alpha' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: activeStrategy === 'alpha' ? '#34d399' : '#e2e8f0' }}>
                🅰️ Strategy Alpha (Zero-Risk Inbound Magnet)
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '6px' }}>
                ACTIVE (0% BAN RISK)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              Submits dynamic landing page previews directly to target website contact forms & corporate B2B email. Prospects click to message your WhatsApp first. <strong>100% Ban-Free!</strong>
            </p>
          </div>

          {/* Strategy Beta Box */}
          <div 
            onClick={() => setActiveStrategy('beta')}
            style={{
              padding: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: activeStrategy === 'beta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${activeStrategy === 'beta' ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: activeStrategy === 'beta' ? '#fbbf24' : '#e2e8f0' }}>
                🅱️ Strategy Beta (Direct Outbound Blitz)
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '6px' }}>
                FASTEST 24H RESPONSE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              Dispatches direct WhatsApp voice notes + spintax text from secondary SIM numbers paired with SMS teaser nudges. Pitches the 5-Day Done-For-You Lead Pilot directly.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
            Daily Outreach Quota (Lagos B2B)
          </label>
          <input
            type="number"
            value={dailyQuota}
            onChange={(e) => setDailyQuota(Number(e.target.value))}
            style={{
              width: '100px',
              padding: '6px 10px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {pipelineStatus.isRunning ? (
            <button
              onClick={handleStopLagosOutreach}
              disabled={executing}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontWeight: 700,
                border: '1px solid #ef4444',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem'
              }}
            >
              <Square size={16} /> Stop Lagos 10K Engine Process
            </button>
          ) : (
            <button
              onClick={handleStartLagosOutreach}
              disabled={executing}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: activeStrategy === 'alpha' 
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                  : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {executing ? <RefreshCw size={16} className="spin-anim" /> : <Play size={16} />}
              {activeStrategy === 'alpha' ? 'Launch Strategy Alpha (Zero-Risk Form + Email)' : 'Launch Strategy Beta (Direct WhatsApp + SMS)'}
            </button>
          )}
        </div>

        {message && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: message.includes('Launched') || message.includes('Stopped') ? '#93c5fd' : '#f87171' }}>
            {cleanErrorMessage(message)}
          </div>
        )}
      </div>

      {/* Live Logs Tail for Lagos 10K */}
      {pipelineStatus.latestLogs.length > 0 && (
        <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📋 Lagos 10K Live Log Feed:</span>
            <span style={{ fontSize: '0.65rem', color: '#10b981' }}>● LIVE UPDATES</span>
          </div>
          {pipelineStatus.latestLogs.slice(0, 4).map((logLine, idx) => {
            const cleanLine = cleanErrorMessage(logLine);
            return (
              <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cleanLine}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
