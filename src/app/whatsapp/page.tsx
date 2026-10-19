'use client';

import React from 'react';
import { Smartphone, QrCode, Key, CheckCircle, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

const VPS_HOST = 'http://169.58.182.92:8080';

const LINES = [
  { id: 1, name: 'Line 1: Admin Closer Desk', phone: '0802 279 1227', role: 'Inbound Inquiries & CEO Escalations', status: 'ONLINE', isOnline: true },
  { id: 2, name: 'Line 2: Outreach Desk 1', phone: '0702 626 6946', role: 'Commercial Cold Outreach & Speed-to-Lead Followup', status: 'READY TO LINK', isOnline: false },
  { id: 3, name: 'Line 3: Outreach Desk 2', phone: '0904 605 0469', role: 'Commercial Cold Outreach & Prototype Delivery', status: 'READY TO LINK', isOnline: false },
  { id: 4, name: 'Line 4: Outreach Desk 3', phone: '0913 512 9625', role: 'High-Conversion Sector Followup & Objection Handling', status: 'READY TO LINK', isOnline: false },
  { id: 5, name: 'Line 5: Outreach Desk 4', phone: '0703 055 6877', role: 'Lagos & Southwest Commercial Hub Dispatcher', status: 'READY TO LINK', isOnline: false },
  { id: 6, name: 'Line 6: Outreach Desk 5', phone: '0811 934 6518', role: 'Abuja, Kano & Northern Hub Outreach', status: 'READY TO LINK', isOnline: false },
  { id: 7, name: 'Line 7: Outreach Desk 6', phone: '0814 160 9564', role: 'Port Harcourt, Onitsha & Southern Hub Outreach', status: 'READY TO LINK', isOnline: false }
];

export default function WhatsAppPortalPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#070d1e', color: '#f8fafc', padding: '20px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', color: '#34d399', fontWeight: 800, marginBottom: '12px' }}>
            <ShieldCheck size={14} />
            <span>PERMANENT VPS SESSION LOCK ACTIVE</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px 0', color: '#ffffff' }}>
            📱 7-Line WhatsApp Pairing Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
            Link all 7 WhatsApp SIM lines directly from your phone. Zero camera needed — supports 8-digit phone pairing codes!
          </p>
        </div>

        {/* Master Action Banner */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', border: '1px solid #10b981', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#6ee7b7', marginBottom: '6px' }}>
            🌐 MASTER COMMAND DASHBOARD
          </div>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 16px 0' }}>
            Open the full live command center to see real-time QR codes, live online indicators, and auto-refreshing connection cards.
          </p>
          <a
            href={VPS_HOST}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              background: '#10b981',
              color: '#ffffff',
              padding: '14px 20px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
            }}
          >
            <span>Open Live 7-Line Dashboard</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Lines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LINES.map((line) => (
            <div
              key={line.id}
              style={{
                background: '#0f172a',
                border: line.isOnline ? '1px solid #10b981' : '1px solid #1e293b',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', background: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      LINE {line.id}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                      {line.phone}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    {line.name} · {line.role}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: line.isOnline ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: line.isOnline ? '#34d399' : '#fbbf24',
                    border: line.isOnline ? '1px solid #10b981' : '1px solid #f59e0b'
                  }}
                >
                  {line.isOnline ? '● ONLINE' : 'READY TO PAIR'}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a
                  href={`${VPS_HOST}/pair/${line.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <Key size={14} />
                  <span>Get 8-Digit Code</span>
                </a>
                <a
                  href={`${VPS_HOST}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#1e293b',
                    color: '#cbd5e1',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <QrCode size={14} />
                  <span>Scan QR</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 3-Step Phone Pairing Guide */}
        <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', marginTop: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
            💡 HOW TO LINK ON YOUR PHONE IN 10 SECONDS:
          </div>
          <ol style={{ fontSize: '12px', color: '#cbd5e1', paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
            <li>Open WhatsApp on the phone you want to link.</li>
            <li>Tap <b>Settings</b> (or the 3 dots) ➔ <b>Linked Devices</b> ➔ <b>Link a Device</b>.</li>
            <li>Tap <b>&quot;Link with phone number instead&quot;</b> at the bottom.</li>
            <li>Tap <b>&quot;Get 8-Digit Code&quot;</b> above for that line and enter the code into your WhatsApp.</li>
            <li>Done! The line will connect to the VPS permanently!</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
