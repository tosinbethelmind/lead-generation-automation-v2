'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Send, CheckCircle, RefreshCw, Layers, ShieldCheck, MapPin, Globe, Users, Mail, Play, Square } from 'lucide-react';

export default function Lagos10KOutreachCard() {
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  const [pipelineStatus, setPipelineStatus] = useState<{ isRunning: boolean; pid: number | null; latestLogs: string[] }>({
    isRunning: false,
    pid: null,
    latestLogs: []
  });

  const [stats, setStats] = useState({
    totalLagosLeads: 2015,
    totalContactedOutreach: 0,
    commercialHotelsCount: 200,
    targetMarket: 'Lagos State (Ikeja, Lekki, VI, Yaba, Surulere, Oshodi, Ikorodu)',
    outreachChannel: 'Web Contact Form Auto-Submitter & B2B Email'
  });

  const [dryRun, setDryRun] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(2000);
  const [message, setMessage] = useState<string | null>(null);

  const fetchLagosStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/outreach/lagos10k');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
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
    }
  };

  useEffect(() => {
    fetchLagosStatus();
    const interval = setInterval(fetchLagosStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartLagosOutreach = async () => {
    setExecuting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/outreach/lagos10k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, count: dailyQuota })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`🚀 High-Speed Lagos 10K Engine Launched! (PID: ${data.pid || 'Active'})`);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                10K Lagos B2B Engine
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
                {pipelineStatus.isRunning ? `● RUNNING (PID ${pipelineStatus.pid})` : '○ STOPPED (ISOLATED)'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Dedicated B2B Lead Harvester & Web Contact Form Outreach Arm
            </p>
          </div>
        </div>

        <button
          onClick={fetchLagosStatus}
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
            {loading ? '...' : stats.totalLagosLeads.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', marginTop: '2px' }}>✓ 2,000+ Target Achieved</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Contact Form Outreach</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
            {loading ? '...' : stats.totalContactedOutreach.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Direct Web Submissions</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lagos Coverage</span>
          <span style={{ fontSize: '1.0rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <MapPin size={16} color="#60a5fa" /> Lagos State
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>Ikeja, Lekki, VI, Yaba, Surulere</span>
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
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              {executing ? <RefreshCw size={16} className="spin-anim" /> : <Play size={16} />}
              Launch Lagos 10K Web Form Outreach
            </button>
          )}
        </div>

        {message && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: message.includes('Launched') || message.includes('Stopped') ? '#93c5fd' : '#f87171' }}>
            {message}
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
          {pipelineStatus.latestLogs.slice(0, 4).map((logLine, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{logLine}</div>
          ))}
        </div>
      )}
    </div>
  );
}
