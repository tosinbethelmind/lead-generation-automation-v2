'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Phone, Smartphone, CheckCircle, RefreshCw, AlertTriangle, ShieldCheck, Power, Wifi, Copy, Check } from 'lucide-react';

interface LineStatus {
  lineId: number;
  label: string;
  phone: string;
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeBase64?: string;
  lastActiveWat?: string;
}

export default function MultiWhatsAppConnectionCard() {
  const [lines, setLines] = useState<LineStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeQrModalLine, setActiveQrModalLine] = useState<number | null>(null);

  const fetchMultiStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/multi-connect');
      if (res.ok) {
        const data = await res.json();
        if (data.lines) {
          setLines(data.lines);
        }
      }
    } catch (e) {
      console.error('Failed to fetch multi-WhatsApp status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMultiStatus();
    const interval = setInterval(fetchMultiStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectLine = async (lineId: number) => {
    setActionMessage(`Generating QR Code for Line ${lineId}...`);
    try {
      const res = await fetch('/api/whatsapp/multi-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, action: 'connect' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`📲 Line ${lineId} ready for pairing! Scan QR Code below.`);
        setActiveQrModalLine(lineId);
        fetchMultiStatus();
      }
    } catch (e: any) {
      setActionMessage(`❌ Error connecting line ${lineId}: ${e.message}`);
    }
  };

  const handleDisconnectLine = async (lineId: number) => {
    if (!confirm(`Are you sure you want to disconnect WhatsApp Line ${lineId}?`)) return;
    setActionMessage(`Disconnecting Line ${lineId}...`);
    try {
      const res = await fetch('/api/whatsapp/multi-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, action: 'disconnect' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`⏹️ Line ${lineId} disconnected and session cleared.`);
        fetchMultiStatus();
      }
    } catch (e: any) {
      setActionMessage(`❌ Disconnect error: ${e.message}`);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
      marginBottom: '24px'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Smartphone size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                3-Line WhatsApp Automated Setup & QR Pairing
              </h2>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                ● AUTOMATED UI CONNECTION
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Connect 3 Nigerian WhatsApp numbers directly from UI without touching terminal commands
            </p>
          </div>
        </div>

        <button
          onClick={fetchMultiStatus}
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
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Refresh Lines
        </button>
      </div>

      {actionMessage && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontSize: '0.82rem', color: '#6ee7b7' }}>
          {actionMessage}
        </div>
      )}

      {/* 3 WhatsApp Number Line Connection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {lines.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Initializing 3-Line WhatsApp connection slots...
          </div>
        ) : (
          lines.map(line => {
            const isConnected = line.status === 'connected';
            const isQrWaiting = line.status === 'qr' || activeQrModalLine === line.lineId;

            return (
              <div
                key={line.lineId}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : isQrWaiting ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                {/* Slot Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>
                      {line.label}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isConnected ? 'rgba(16, 185, 129, 0.2)' : isQrWaiting ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                      color: isConnected ? '#34d399' : isQrWaiting ? '#fbbf24' : '#f87171',
                      border: `1px solid ${isConnected ? '#10b981' : isQrWaiting ? '#f59e0b' : '#ef4444'}`
                    }}>
                      {isConnected ? '● CONNECTED' : isQrWaiting ? '⚡ SCAN QR CODE' : '○ DISCONNECTED'}
                    </span>
                  </div>

                  {line.phone && (
                    <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {line.phone}
                    </span>
                  )}
                </div>

                {/* QR Code Display Box (When pairing) */}
                {isQrWaiting && line.qrCodeBase64 ? (
                  <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <img
                      src={line.qrCodeBase64}
                      alt={`WhatsApp Line ${line.lineId} QR Code`}
                      style={{ width: '160px', height: '160px', margin: '0 auto', display: 'block' }}
                    />
                    <p style={{ color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, margin: '8px 0 0 0' }}>
                      Open WhatsApp ➔ Settings ➔ Linked Devices ➔ Scan this QR Code
                    </p>
                  </div>
                ) : isConnected ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                    <CheckCircle size={28} color="#34d399" style={{ margin: '0 auto 4px auto' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', display: 'block' }}>
                      WhatsApp Line {line.lineId} Active & Auto-Responding!
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                      Auto-spintax & load balancing active.
                    </span>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <QrCode size={28} color="#94a3b8" style={{ margin: '0 auto 6px auto' }} />
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block' }}>
                      Ready to pair WhatsApp Line {line.lineId}
                    </span>
                  </div>
                )}

                {/* Slot Action Controls */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnectLine(line.lineId)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        color: '#f87171',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Power size={12} /> Reset Line {line.lineId}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectLine(line.lineId)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <QrCode size={12} /> Connect Line {line.lineId} (Scan QR)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
