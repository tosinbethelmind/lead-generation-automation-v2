'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface LineData {
  lineId: number;
  label: string;
  phone: string;
  phoneRaw: string;
  role: string;
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeUrl?: string;
  pairingCode?: string;
}

const DEFAULT_7_LINES: LineData[] = [
  { lineId: 1, label: 'Line 1: Admin / Closer Desk', phone: '+234 802 279 1227', phoneRaw: '2348022791227', role: 'Dedicated Inbound Closing & Approvals', status: 'disconnected' },
  { lineId: 2, label: 'Line 2: Outreach Desk 1', phone: '+234 702 626 6946', phoneRaw: '2347026266946', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' },
  { lineId: 3, label: 'Line 3: Outreach Desk 2', phone: '+234 904 605 0469', phoneRaw: '2349046050469', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' },
  { lineId: 4, label: 'Line 4: Outreach Desk 3', phone: '+234 913 512 9625', phoneRaw: '2349135129625', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' },
  { lineId: 5, label: 'Line 5: Outreach Desk 4', phone: '+234 703 055 6877', phoneRaw: '2347030556877', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' },
  { lineId: 6, label: 'Line 6: Outreach Desk 5', phone: '+234 811 934 6518', phoneRaw: '2348119346518', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' },
  { lineId: 7, label: 'Line 7: Outreach Desk 6', phone: '+234 814 160 9564', phoneRaw: '2348141609564', role: 'Autonomous Lagos SME Outreach', status: 'disconnected' }
];

export default function WhatsAppMultiConnectPage() {
  const [lines, setLines] = useState<LineData[]>(DEFAULT_7_LINES);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [generatingCodeFor, setGeneratingCodeFor] = useState<number | null>(null);
  const [generatingQrFor, setGeneratingQrFor] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      // 1. Fetch multi-connect status from Next.js API
      const apiRes = await fetch('/api/whatsapp/multi-connect', { cache: 'no-store' }).catch(() => null);
      if (apiRes?.ok) {
        const apiData = await apiRes.json();
        if (apiData.lines && Array.isArray(apiData.lines)) {
          setLines(prev => prev.map(l => {
            const match = apiData.lines.find((al: any) => al.lineId === l.lineId);
            if (match) {
              return {
                ...l,
                phone: match.phone || l.phone,
                status: match.status || l.status,
                qrCodeUrl: match.qrCodeBase64 || l.qrCodeUrl
              };
            }
            return l;
          }));
        }
      }

      // 2. Fetch directly from Evolution API on port 8080 if accessible
      const evoRes = await fetch('http://localhost:8080/status', {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      }).catch(() => null);

      if (evoRes?.ok) {
        const evoData = await evoRes.json();
        if (evoData.instances && Array.isArray(evoData.instances)) {
          setLines(prev => prev.map(l => {
            const match = evoData.instances.find((ei: any) => ei.id === l.lineId);
            if (match) {
              return {
                ...l,
                phone: match.phone ? `+${match.phone}` : l.phone,
                status: match.state === 'open' ? 'connected' : (match.state === 'connecting' ? 'connecting' : l.status)
              };
            }
            return l;
          }));
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchStatus();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestPairingCode = async (lineId: number, phoneRaw: string) => {
    setGeneratingCodeFor(lineId);
    setMessage('');
    try {
      // Call Evolution API directly or via proxy
      let data: any = null;
      try {
        const directRes = await fetch(`http://localhost:8080/instance/pairingCode/bethelmind_instance_${lineId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phoneRaw })
        });
        if (directRes.ok) data = await directRes.json();
      } catch (_) {}

      if (!data) {
        const proxyRes = await fetch('/api/whatsapp/multi-connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId, action: 'pairing_code', phone: phoneRaw })
        });
        data = await proxyRes.json();
      }

      if (data?.pairingCode) {
        setLines(prev => prev.map(l => l.lineId === lineId ? { ...l, pairingCode: data.pairingCode } : l));
        setMessage(`🔑 Pairing Code generated for Line ${lineId}: ${data.pairingCode}`);
      } else {
        setMessage(`❌ Error: ${data?.message || data?.error || 'Failed to generate pairing code'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Network Error: Make sure local WhatsApp server on port 8080 is active.`);
    } finally {
      setGeneratingCodeFor(null);
    }
  };

  const handleRequestQrCode = async (lineId: number) => {
    setGeneratingQrFor(lineId);
    setMessage('');
    try {
      let data: any = null;
      try {
        const directRes = await fetch(`http://localhost:8080/instance/request-qr/bethelmind_instance_${lineId}`, {
          method: 'POST'
        });
        if (directRes.ok) data = await directRes.json();
      } catch (_) {}

      if (!data) {
        const proxyRes = await fetch('/api/whatsapp/multi-connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineId, action: 'request_qr' })
        });
        data = await proxyRes.json();
      }

      if (data?.qr || data?.qrCodeBase64) {
        const qr = data.qr || data.qrCodeBase64;
        setLines(prev => prev.map(l => l.lineId === lineId ? { ...l, qrCodeUrl: qr, status: 'qr' } : l));
        setMessage(`📸 Fresh QR Code generated for Line ${lineId}. Point WhatsApp camera to scan.`);
      }
    } catch (err: any) {
      setMessage(`❌ Error requesting QR code: ${err.message}`);
    } finally {
      setGeneratingQrFor(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const connectedCount = lines.filter(l => l.status === 'connected').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px 20px 80px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={fetchStatus}
              disabled={loading}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Status
            </button>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ExternalLink size={14} /> Port 8080 Command Center
            </a>
          </div>
        </div>

        {/* Hero Title */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.3)',
            padding: '4px 14px',
            borderRadius: '20px',
            color: '#25d366',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '12px'
          }}>
            <Smartphone size={14} /> 7-LINE WHATSAPP PAIRING HUB (PORT 8080)
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Connect Your 7 WhatsApp Lines
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 16px' }}>
            Instant QR Scan or 8-Digit Phone Pairing Code. All sessions are permanently locked across 5 redundant vaults.
          </p>
          <div style={{
            display: 'inline-flex',
            gap: '16px',
            background: '#0f172a',
            padding: '8px 20px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: '#94a3b8' }}>Total Lines: <strong style={{ color: '#f8fafc' }}>7</strong></span>
            <span style={{ color: connectedCount > 0 ? '#34d399' : '#f59e0b' }}>Active Online: <strong>{connectedCount} / 7</strong></span>
            <span style={{ color: '#38bdf8' }}>Architecture: <strong>1 Admin + 6 Outreach</strong></span>
          </div>
        </div>

        {/* Notification message */}
        {message && (
          <div style={{
            background: message.startsWith('❌') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${message.startsWith('❌') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: message.startsWith('❌') ? '#f87171' : '#34d399',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* ── 7 LINE CARDS GRID ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {lines.map((line) => {
            const isConnected = line.status === 'connected';

            return (
              <div
                key={line.lineId}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: `1.5px solid ${isConnected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '18px',
                  padding: '22px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Line Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#1e293b', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px' }}>
                      LINE {line.lineId}
                    </span>
                    <h3 style={{ margin: '6px 0 2px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                      {line.label}
                    </h3>
                    <span style={{ fontSize: '0.86rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                      {line.phone}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: isConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    color: isConnected ? '#34d399' : '#fbbf24',
                    border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`
                  }}>
                    {isConnected ? '● ONLINE' : '● UNLINKED'}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '14px' }}>
                  {line.role}
                </div>

                {/* Direct Link to Dedicated Pairing Room */}
                <a
                  href={`http://localhost:8080/pair/${line.lineId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    background: isConnected ? '#065f46' : '#0284c7',
                    color: '#ffffff',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    marginBottom: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isConnected ? `⚡ View Live Line ${line.lineId} Room` : `🚀 Open Line ${line.lineId} Pairing Room (QR / Code)`}
                </a>

                {/* QR Display Area */}
                {line.qrCodeUrl && !isConnected && (
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', margin: '0 auto 14px', textAlign: 'center' }}>
                    <img src={line.qrCodeUrl} alt="Scan QR" style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }} />
                    <span style={{ color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, marginTop: '6px', display: 'block' }}>
                      Scan with WhatsApp camera
                    </span>
                  </div>
                )}

                {/* 8-Digit Pairing Code Display */}
                {line.pairingCode && !isConnected && (
                  <div style={{
                    background: '#022c22',
                    border: '1.5px solid #10b981',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '14px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 800 }}>8-DIGIT PAIRING CODE:</span>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '4px', margin: '4px 0' }}>
                      {line.pairingCode}
                    </div>
                    <button
                      onClick={() => copyToClipboard(line.pairingCode!)}
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {copiedCode === line.pairingCode ? '✅ Copied!' : '📋 Copy Code'}
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {!isConnected && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                    <button
                      onClick={() => handleRequestQrCode(line.lineId)}
                      disabled={generatingQrFor === line.lineId}
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {generatingQrFor === line.lineId ? 'Generating...' : '📸 Live QR'}
                    </button>
                    <button
                      onClick={() => handleRequestPairingCode(line.lineId, line.phoneRaw)}
                      disabled={generatingCodeFor === line.lineId}
                      style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {generatingCodeFor === line.lineId ? 'Requesting...' : '🔢 8-Digit Code'}
                    </button>
                  </div>
                )}

                {isConnected && (
                  <div style={{ marginTop: 'auto', textAlign: 'center', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                    <span style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Active &amp; Ready for Outreach
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Vault Lock Banner */}
        <div style={{
          marginTop: '36px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, fontSize: '0.92rem' }}>
              <ShieldCheck size={18} /> 5-Vault Redundant Session Solidification
            </div>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>
              Connected sessions are automatically backed up to master and solidified vaults to prevent session invalidation on reboot.
            </p>
          </div>
          <a
            href="http://localhost:8080/lock-all"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#047857',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            🔒 Lock All 7 Lines Now
          </a>
        </div>

      </div>
    </div>
  );
}
