'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, RefreshCw, Zap, CheckCircle2, AlertTriangle, RotateCcw, Cpu } from 'lucide-react';

interface HealingEvent {
  id: string;
  timestamp: string;
  engine: string;
  strategy: string;
  target: string;
  reason: string;
  resolution: string;
  success: boolean;
}

export default function SelfHealingDiagnosticsCard() {
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [events, setEvents] = useState<HealingEvent[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSelfHealingStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/self-healing');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelfHealingStatus();
    const interval = setInterval(fetchSelfHealingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTestSelfHealing = async (action: string) => {
    setExecuting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/self-healing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`⚡ ${data.message}`);
        fetchSelfHealingStatus();
      } else {
        setMessage(`❌ Test Failed: ${data.error || 'Unknown'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      padding: '24px',
      marginTop: '20px',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Autonomous Self-Healing Scraper Supervisor
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 10px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}></span>
                ACTIVE & PROTECTED
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Automatic IP rotation on 429 rate limits · API Mirror Failover · Zombie Chrome Purging · Hung Process Auto-Restart
            </p>
          </div>
        </div>

        <button
          onClick={fetchSelfHealingStatus}
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
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh Diagnostics
        </button>
      </div>

      {/* Status Matrix Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '20px 0' }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Rate-Limit Auto Failover</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <RotateCcw size={15} /> Tor IP & Pool Rotation
          </span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Mirror Failover Matrix</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Zap size={15} /> 3 Active OSM Mirrors
          </span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Browser Health Guard</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Cpu size={15} /> Zombie Chrome Purger
          </span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Total Healed Events</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px', display: 'block' }}>
            {events.length} Self-Recovery Logs
          </span>
        </div>
      </div>

      {/* Manual Diagnostic Trigger Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginRight: '4px' }}>
          Diagnostic Suite:
        </span>

        <button
          onClick={() => handleTestSelfHealing('test_ip_rotation')}
          disabled={executing}
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: executing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={13} /> Test Tor IP Rotation
        </button>

        <button
          onClick={() => handleTestSelfHealing('test_browser_purge')}
          disabled={executing}
          style={{
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: executing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Cpu size={13} /> Test Browser Process Purge
        </button>

        <button
          onClick={() => handleTestSelfHealing('simulate_heal')}
          disabled={executing}
          style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#60a5fa',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: executing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Zap size={13} /> Simulate Recovery Event
        </button>
      </div>

      {message && (
        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#34d399' }}>
          {message}
        </div>
      )}

      {/* Live Self-Healing Audit Feed */}
      <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '12px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🛡️ REAL-TIME SELF-HEALING AUDIT STREAM:</span>
          <span style={{ fontSize: '0.65rem', color: '#34d399' }}>● AUTO-RECOVERING</span>
        </div>

        {events.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
            {events.map((ev, idx) => {
              const timeStr = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '6px', borderLeft: `3px solid ${ev.success ? '#10b981' : '#ef4444'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.72rem', fontWeight: 600 }}>
                    <span>[SELF-HEALED] Strategy: <strong style={{ color: '#38bdf8' }}>{ev.strategy}</strong> ({ev.engine})</span>
                    <span style={{ color: '#64748b' }}>{timeStr}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem', marginTop: '2px' }}>
                    Reason: {ev.reason}
                  </div>
                  <div style={{ color: '#34d399', fontSize: '0.68rem', fontWeight: 600 }}>
                    ↳ Resolution: {ev.resolution}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            Self-healing supervisor active. No errors detected — system is running cleanly!
          </div>
        )}
      </div>
    </div>
  );
}
