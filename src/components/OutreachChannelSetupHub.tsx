'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Smartphone,
  Mail,
  Globe,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Key,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

export default function OutreachChannelSetupHub() {
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<any>({
    whatsapp: {
      status: 'qr',
      phone: '2348022791227',
      outreachLine1: '2347026266946',
      outreachLine2: '2349046050469',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bethelmind-wa-gateway-pair',
      lastPairingCode: '839-102-94',
    },
    sms: { configured: true, gatewayUrl: 'http://10.50.220.22:8082', status: 'online' },
    email: { configured: true, senderName: 'Bethelmind Analytics', status: 'online' },
    webFormSubmitter: { configured: true, status: 'online' }
  });

  // Pairing code state
  const [pairingPhoneInput, setPairingPhoneInput] = useState('2348022791227');
  const [pairingCode, setPairingCode] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);

  // Test dispatch state
  const [testChannel, setTestChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [testTarget, setTestTarget] = useState('2348022791227');
  const [testSending, setTestSending] = useState(false);

  // Notification state
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchChannelStatus();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchChannelStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/outreach-channels');
      const data = await res.json();
      if (res.ok && data.success) {
        setChannelData(data.channels);
      }
    } catch (err) {
      console.error('Error fetching outreach channels status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPairingCode = async () => {
    if (!pairingPhoneInput.trim()) {
      showToast('Please enter your admin phone number', 'error');
      return;
    }
    setPairingLoading(true);
    try {
      const res = await fetch('/api/admin/outreach-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_pairing_code',
          phone: pairingPhoneInput.replace(/\D/g, '')
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPairingCode(data.pairingCode);
        showToast(data.message);
      } else {
        showToast(data.error || 'Failed to generate pairing code', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error generating pairing code', 'error');
    } finally {
      setPairingLoading(false);
    }
  };

  const handleTestDispatch = async () => {
    if (!testTarget.trim()) {
      showToast('Please enter target phone or email', 'error');
      return;
    }
    setTestSending(true);
    try {
      const res = await fetch('/api/admin/outreach-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_dispatch',
          channel: testChannel,
          phone: testChannel !== 'email' ? testTarget.trim() : undefined,
          email: testChannel === 'email' ? testTarget.trim() : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
      } else {
        showToast(data.error || 'Test dispatch failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing test dispatch', 'error');
    } finally {
      setTestSending(false);
    }
  };

  const handleCopyText = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-bounce ${
          toastMessage.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-rose-950 border-rose-500 text-rose-400'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toastMessage.text}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Multi-Channel Outreach Setup & Live WhatsApp Gateway
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
            Outreach Channels Control Hub
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              4 Channels Operational
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure WhatsApp QR Code pairing, pairing codes, Android SMS gateway, Resend SMTP email, and web contact form automation.
          </p>
        </div>

        <button
          onClick={fetchChannelStatus}
          disabled={loading}
          className="accessible-btn accessible-btn-emerald text-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Channel Status
        </button>
      </div>

      {/* 🟢 CHANNEL 1: WHATSAPP WEB & PAIRING CODE SCANNER */}
      <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                WhatsApp Web & Baileys Gateway Channel
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Mode A Dual-Line Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Scan QR Code or request 8-digit Pairing Code to link your admin WhatsApp phone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse"></span>
            WhatsApp Gateway Ready
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* QR Code Scanner Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" /> WhatsApp Web QR Code Scanner
            </div>

            <div className="bg-white p-2.5 rounded-xl shadow-xl border border-emerald-500/40">
              {/* eslint-disable-next-html-element-attributes */}
              <img
                src={channelData.whatsapp.qrCodeUrl}
                alt="WhatsApp QR Code Scanner"
                className="w-44 h-44 object-contain rounded"
              />
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs">
              Open WhatsApp on your phone → Settings / Menu → Linked Devices → Point camera at this QR Code.
            </p>
          </div>

          {/* 8-Digit Pairing Code Box (No QR needed) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <Key className="w-4 h-4 text-cyan-400" /> 8-Digit WhatsApp Pairing Code (No Camera Needed)
              </div>
              <p className="text-xs text-slate-400">
                Link your phone using a 8-digit code without needing to scan with camera.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Admin WhatsApp Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pairingPhoneInput}
                  onChange={(e) => setPairingPhoneInput(e.target.value)}
                  placeholder="2348022791227"
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                />
                <button
                  onClick={handleRequestPairingCode}
                  disabled={pairingLoading}
                  className="accessible-btn accessible-btn-cyan text-xs font-bold"
                >
                  {pairingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Get Code
                </button>
              </div>
            </div>

            {pairingCode && (
              <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/40 space-y-2">
                <div className="text-xs font-bold text-slate-300">Your WhatsApp Pairing Code:</div>
                <div className="text-2xl font-black text-cyan-300 font-mono tracking-widest text-center bg-black/60 py-2 rounded-lg border border-cyan-500/30">
                  {pairingCode}
                </div>
                <button
                  onClick={() => handleCopyText(pairingCode)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Pairing Code
                </button>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/5 space-y-1">
              <div className="font-bold text-slate-300">Active Phone Lines:</div>
              <div>Master Admin: <span className="text-emerald-400 font-mono">+{channelData.whatsapp.phone}</span></div>
              <div>Outreach Line 1: <span className="text-cyan-400 font-mono">+{channelData.whatsapp.outreachLine1}</span></div>
              <div>Outreach Line 2: <span className="text-indigo-400 font-mono">+{channelData.whatsapp.outreachLine2}</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* 📊 CHANNELS GRID: SMS, EMAIL, WEB FORM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* SMS Carrier Gateway */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> SMS Carrier Gateway
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              DUAL SIM
            </span>
          </div>
          <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate">
            {channelData.sms.gatewayUrl}
          </div>
          <p className="text-[11px] text-slate-400">
            Hardware Android carrier gateway configured for direct SMS delivery.
          </p>
        </div>

        {/* Email Resend / SMTP Channel */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email SMTP Channel
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              RESEND / SMTP
            </span>
          </div>
          <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate">
            {channelData.email.senderName}
          </div>
          <p className="text-[11px] text-slate-400">
            Batch outreach email templates with Bethelmind Analytics signature.
          </p>
        </div>

        {/* Web Form Auto-Submitter */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Web Form Submitter
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PUPPETEER
            </span>
          </div>
          <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate">
            Automatic Form Submitter
          </div>
          <p className="text-[11px] text-slate-400">
            Submits inquiries directly into target client website contact forms.
          </p>
        </div>

      </div>

      {/* 🧪 LIVE MULTI-CHANNEL TEST DISPATCHER */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" /> Live Multi-Channel Test Dispatcher
          </h3>
          <span className="text-xs text-slate-400">Dispatch test messages instantly to verify channel routing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Select Channel</label>
            <select
              value={testChannel}
              onChange={(e: any) => setTestChannel(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="whatsapp">🟢 WhatsApp Direct</option>
              <option value="sms">📱 SMS Carrier Gateway</option>
              <option value="email">📧 Email Notification</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Target Phone / Email</label>
            <input
              type="text"
              value={testTarget}
              onChange={(e) => setTestTarget(e.target.value)}
              placeholder={testChannel === 'email' ? 'admin@bethelmindanalytics.com' : '2348022791227'}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleTestDispatch}
              disabled={testSending}
              className="w-full accessible-btn accessible-btn-emerald py-2.5 text-xs font-bold"
            >
              {testSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Dispatch Test Message
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
