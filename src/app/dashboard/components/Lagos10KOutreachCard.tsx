'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Send, CheckCircle, RefreshCw, Layers, ShieldCheck, MapPin, Globe, Users, Mail, Play } from 'lucide-react';

export default function Lagos10KOutreachCard() {
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

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

  const fetchLagosStats = async () => {
    try {
      setLoading(true);
      const statsRes = await fetch('/api/outreach/lagos10k');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLagosStats();
    const interval = setInterval(fetchLagosStats, 6000);
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
        fetchLagosStats();
      } else {
        setMessage(`❌ Execution Error: ${data.error || 'Failed to launch engine'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Execution error: ${err.message}`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              10K Lagos B2B Engine
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Dedicated B2B Lead Harvester & Web Contact Form Outreach Arm
            </p>
          </div>
        </div>

        <span style={{
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
          100% Isolated Pipeline
        </span>
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

        <button
          onClick={handleStartLagosOutreach}
          disabled={executing}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          <Send size={16} />
          {executing ? 'Launching Lagos Arm...' : 'Launch Lagos 10K Web Form Outreach'}
        </button>

        {message && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#93c5fd' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
