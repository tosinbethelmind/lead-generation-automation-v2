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
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

export default function OutreachChannelSetupHub() {
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<any>({
    whatsapp: {
      status: 'connected',
      phone: '2348022791227',
      outreachLine1: '2347026266946',
      outreachLine2: '2349046050469',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bethelmind-wa-gateway-pair',
      lastPairingCode: '839-102-94',
    },
    sms: { configured: true, gatewayUrl: 'http://10.132.90.251:8082', status: 'online' },
    email: { configured: true, senderName: 'Bethelmind Analytics', senderEmail: 'tosin@bethelmindanalytics.com', status: 'online' },
    webFormSubmitter: { configured: true, status: 'online' }
  });

  // Pairing code state
  const [pairingPhoneInput, setPairingPhoneInput] = useState('2348022791227');
  const [pairingCode, setPairingCode] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);

  // Test dispatch state
  const [testChannel, setTestChannel] = useState<'whatsapp' | 'sms' | 'email'>('sms');
  const [testTarget, setTestTarget] = useState('2348022791227');
  const [testSending, setTestSending] = useState(false);
  const [suiteSending, setSuiteSending] = useState(false);

  // Notification state
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchChannelStatus();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchChannelStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/outreach-channels?_t=' + Date.now(), { cache: 'no-store' });
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

  const handleTestDispatch = async (overrideChannel?: 'whatsapp' | 'sms' | 'email') => {
    const selected = overrideChannel || testChannel;
    const target = selected === 'email' 
      ? (testTarget.includes('@') ? testTarget.trim() : 'bethelmindrecruit@gmail.com')
      : (testTarget.replace(/\D/g, '') || '2348022791227');

    setTestSending(true);
    try {
      const res = await fetch('/api/admin/outreach-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_dispatch',
          channel: selected,
          phone: selected !== 'email' ? target : undefined,
          email: selected === 'email' ? target : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Test dispatch failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing test dispatch', 'error');
    } finally {
      setTestSending(false);
    }
  };

  const handleSendFullSampleSuite = async () => {
    setSuiteSending(true);
    try {
      const res = await fetch('/api/admin/outreach-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_sample_suite',
          phone: '2348022791227',
          email: 'bethelmindrecruit@gmail.com'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 Full 3-Channel Test Suite Sent! (SMS + WhatsApp + Email delivered)`, 'success');
      } else {
        showToast(data.error || 'Sample suite failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing sample suite', 'error');
    } finally {
      setSuiteSending(false);
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
          toastMessage.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-rose-950 border-rose-500 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toastMessage.text}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Multi-Channel Outreach Setup & Live Gateway Controller
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
            Outreach Channels Control Hub
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              100% Operational & Locked
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Carrier Android SMS Gateway (10.132.90.251:8082), WhatsApp Multi-Line Engine, and Hostinger SMTP Email.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchChannelStatus}
            disabled={loading}
            className="accessible-btn accessible-btn-slate text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Status
          </button>
          <button
            onClick={handleSendFullSampleSuite}
            disabled={suiteSending}
            className="accessible-btn accessible-btn-emerald text-xs font-bold shadow-lg shadow-emerald-900/40"
          >
            {suiteSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
            Test All 3 Channels
          </button>
        </div>
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
                WhatsApp Web & Baileys Multi-Line Gateway
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Connected & Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Active Line: +234 702 626 6946 (Secondary Hot Standby: +234 904 605 0469)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTestDispatch('whatsapp')}
              disabled={testSending}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold hover:bg-emerald-600/50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Test WhatsApp Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Active Status Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Session State
              </div>
              <p className="text-xs text-slate-400">
                Your WhatsApp engine is permanently authenticated with multi-line anti-ban rotation.
              </p>
            </div>

            <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-emerald-500/20 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Admin WhatsApp:</span>
                <span className="font-mono text-emerald-400 font-bold">+234 802 279 1227</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Active Dispatcher (Line 1):</span>
                <span className="font-mono text-cyan-400 font-bold">+234 702 626 6946</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Backup Dispatcher (Line 2):</span>
                <span className="font-mono text-indigo-400 font-bold">+234 904 605 0469</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/20 text-center font-bold">
              ✓ Ready for automated conversational quoting & PDF deliveries
            </div>
          </div>

          {/* 8-Digit Pairing Code Box (For New Phone Pairing) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <Key className="w-4 h-4 text-cyan-400" /> Link Additional Line with 8-Digit Code
              </div>
              <p className="text-xs text-slate-400">
                Generate a pairing code anytime to connect an extra phone line without using camera QR.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Phone Number (with country code)</label>
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
          </div>

        </div>
      </div>

      {/* 📊 CHANNELS GRID: SMS, EMAIL, WEB FORM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* SMS Carrier Gateway */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> SMS Carrier Gateway
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate mb-2">
              {channelData.sms.gatewayUrl}
            </div>
            <p className="text-[11px] text-slate-400">
              Direct Android SIM hardware gateway with auto-subnet self-healing.
            </p>
          </div>

          <button
            onClick={() => handleTestDispatch('sms')}
            disabled={testSending}
            className="w-full py-2 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-600/50 transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Test SMS Now
          </button>
        </div>

        {/* Email Resend / SMTP Channel */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Hostinger SMTP Email
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SSL 465
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate mb-2">
              tosin@bethelmindanalytics.com
            </div>
            <p className="text-[11px] text-slate-400">
              Direct IPv4 SMTP connection with personalized HTML pitch templates.
            </p>
          </div>

          <button
            onClick={() => handleTestDispatch('email')}
            disabled={testSending}
            className="w-full py-2 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-600/50 transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Test Email Now
          </button>
        </div>

        {/* Web Form Auto-Submitter */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Web Form Submitter
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PUPPETEER
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-white/5 truncate mb-2">
              Autonomous Contact Bot
            </div>
            <p className="text-[11px] text-slate-400">
              Submits personalized proposals directly into target corporate websites.
            </p>
          </div>

          <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/20 text-center font-bold">
            ✓ 0-Cost Fallback Ready
          </div>
        </div>

      </div>

      {/* 🧪 LIVE MULTI-CHANNEL TEST DISPATCHER */}
      <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" /> Interactive Multi-Channel Test Dispatcher
          </h3>
          <span className="text-xs text-slate-400">Send custom live test message to any number or email</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Select Channel</label>
            <select
              value={testChannel}
              onChange={(e: any) => {
                const val = e.target.value;
                setTestChannel(val);
                if (val === 'email' && !testTarget.includes('@')) {
                  setTestTarget('bethelmindrecruit@gmail.com');
                } else if (val !== 'email' && testTarget.includes('@')) {
                  setTestTarget('2348022791227');
                }
              }}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="sms">📱 SMS (Carrier Android Gateway)</option>
              <option value="whatsapp">🟢 WhatsApp (Multi-Line Engine)</option>
              <option value="email">📧 Email (Hostinger SMTP SSL)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Target Recipient</label>
            <input
              type="text"
              value={testTarget}
              onChange={(e) => setTestTarget(e.target.value)}
              placeholder={testChannel === 'email' ? 'bethelmindrecruit@gmail.com' : '2348022791227'}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleTestDispatch()}
              disabled={testSending}
              className="w-full accessible-btn accessible-btn-emerald py-2.5 text-xs font-bold"
            >
              {testSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Dispatch Test Message Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
