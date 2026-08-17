'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  QrCode,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface LineData {
  lineId: number;
  label: string;
  phone: string;
  phoneRaw: string;
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeUrl?: string;
  pairingCode?: string;
}

export default function WhatsAppMultiConnectPage() {
  const [lines, setLines] = useState<LineData[]>([
    {
      lineId: 1,
      label: 'Line 1 (Primary Outreach Line)',
      phone: '+234 702 626 6946',
      phoneRaw: '2347026266946',
      status: 'qr',
      qrCodeUrl: '',
      pairingCode: ''
    },
    {
      lineId: 2,
      label: 'Line 2 (Secondary Outreach Line)',
      phone: '+234 904 605 0469',
      phoneRaw: '2349046050469',
      status: 'disconnected',
      qrCodeUrl: '',
      pairingCode: ''
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [generatingCodeFor, setGeneratingCodeFor] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const fetchStatus = async () => {
    try {
      // 1. Fetch from local Baileys status on port 3007
      const localRes = await fetch('http://localhost:3007/status', {
        headers: { Accept: 'application/json' }
      }).catch(() => null);

      if (localRes?.ok) {
        const localData = await localRes.json();
        setLines(prev => prev.map(l => {
          if (l.lineId === 1) {
            return {
              ...l,
              status: localData.status === 'connected' ? 'connected' : (localData.qrCodeUrl ? 'qr' : 'connecting'),
              qrCodeUrl: localData.qrCodeUrl || l.qrCodeUrl,
              pairingCode: localData.lastPairingCode || l.pairingCode
            };
          }
          return l;
        }));
      }

      // 2. Fetch multi-connect status from Next.js API
      const apiRes = await fetch('/api/whatsapp/multi-connect').catch(() => null);
      if (apiRes?.ok) {
        const apiData = await apiRes.json();
        if (apiData.lines && Array.isArray(apiData.lines)) {
          setLines(prev => prev.map((l, i) => {
            const match = apiData.lines.find((al: any) => al.lineId === l.lineId);
            if (match) {
              return {
                ...l,
                status: match.status || l.status,
                qrCodeUrl: match.qrCodeBase64 || l.qrCodeUrl
              };
            }
            return l;
          }));
        }
      }
    } catch (_) {
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestPairingCode = async (lineId: number, phoneRaw: string) => {
    setGeneratingCodeFor(lineId);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:3007/request-pairing-code?phone=${phoneRaw}`);
      const data = await res.json();
      if (data.success && data.pairingCode) {
        setLines(prev => prev.map(l => l.lineId === lineId ? { ...l, pairingCode: data.pairingCode } : l));
        setMessage(`🔑 Pairing Code generated for Line ${lineId}: ${data.pairingCode}`);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to generate pairing code'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Network Error: Make sure local server on port 3007 is active.`);
    } finally {
      setGeneratingCodeFor(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px 20px 80px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
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
              <RefreshCw size={14} /> Refresh QR Codes
            </button>
            <a
              href="http://localhost:3007"
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
              <ExternalLink size={14} /> Port 3007 Gateway
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
            <Smartphone size={14} /> DUAL-LINE ROTATOR PAIRING HUB
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Connect Your Two WhatsApp Outreach Numbers
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
            Scan the QR code with WhatsApp or generate an instant 8-digit Pairing Code to link both outreach lines.
          </p>
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

        {/* ── TWO DUAL CARDS ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {lines.map((line) => {
            const isConnected = line.status === 'connected';

            return (
              <div
                key={line.lineId}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: `1.5px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Line Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
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
                    {isConnected ? '● CONNECTED & ACTIVE' : '● READY TO PAIR'}
                  </span>
                </div>

                {/* QR Code Section */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                  marginBottom: '20px'
                }}>
                  {isConnected ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <CheckCircle2 size={64} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        WhatsApp Connected!
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                        This line is active and ready for automatic 10K Lagos outreach dispatches.
                      </p>
                    </div>
                  ) : line.qrCodeUrl ? (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={line.qrCodeUrl}
                        alt="WhatsApp QR Code"
                        style={{ width: '220px', height: '220px', display: 'block', margin: '0 auto' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block', fontWeight: 600 }}>
                        Point your WhatsApp camera at this code
                      </span>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <QrCode size={54} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                        Generating Fresh QR Code...
                      </p>
                      <span style={{ fontSize: '0.74rem' }}>
                        Open port 3007 or click button below for pairing code.
                      </span>
                    </div>
                  )}
                </div>

                {/* 8-Digit Pairing Code Display */}
                {line.pairingCode && !isConnected && (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      8-Digit Phone Pairing Code:
                    </span>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: '#34d399',
                      letterSpacing: '0.15em',
                      fontFamily: 'monospace',
                      margin: '6px 0 10px'
                    }}>
                      {line.pairingCode}
                    </div>
                    <button
                      onClick={() => copyToClipboard(line.pairingCode!)}
                      style={{
                        background: copiedCode === line.pairingCode ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copiedCode === line.pairingCode ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode === line.pairingCode ? 'Copied Code!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleRequestPairingCode(line.lineId, line.phoneRaw)}
                    disabled={generatingCodeFor === line.lineId || isConnected}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: isConnected ? 'default' : 'pointer',
                      opacity: isConnected ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <KeyRound size={16} />
                    <span>{generatingCodeFor === line.lineId ? 'Requesting Code...' : `Generate 8-Digit Pairing Code`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{
          marginTop: '36px',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
            📖 How to Link with Pairing Code (Recommended):
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.8 }}>
            <li>Click <strong>"Generate 8-Digit Pairing Code"</strong> on the line you want to connect.</li>
            <li>Open WhatsApp on the corresponding phone.</li>
            <li>Tap <strong>Settings / 3 Dots (Top Right)</strong> $\rightarrow$ <strong>Linked Devices</strong>.</li>
            <li>Tap the green <strong>"Link a Device"</strong> button.</li>
            <li>At the bottom of your phone screen, tap <strong>"Link with phone number instead"</strong>.</li>
            <li>Type in the 8-character pairing code shown above. Connection completes instantly!</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
