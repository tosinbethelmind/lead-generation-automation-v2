'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Send, 
  CreditCard, 
  Cpu, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Save, 
  Smartphone, 
  Mail, 
  Globe,
  Radio,
  Zap,
  Building
} from 'lucide-react';

export default function AdminSettingsIntegrationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Tab: 'outreach' | 'payment' | 'ai' | 'api_keys'
  const [activeTab, setActiveTab] = useState<'outreach' | 'payment' | 'ai' | 'api_keys'>('outreach');

  // Form State
  const [config, setConfig] = useState<any>({
    businessSignature: 'Bethelmind Analytics & Strategy',
    dryRun: true,
    outreachChannel: 'multichannel',
    emailProvider: 'smtp',
    whatsappProvider: 'baileys',
    smsProvider: 'termii',
    
    // SMTP & Email
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    resendApiKey: '',
    brevoApiKey: '',

    // WhatsApp & Mobile
    whatsappBaileysUrl: 'http://localhost:3007',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioFromNumber: '',
    termiiApiKey: '',
    termiiSenderId: 'Bethelmind',

    // Bank & Payments
    moniepointBankName: 'Moniepoint Microfinance Bank',
    moniepointAccountNumber: '7034297995',
    moniepointAccountName: 'Oyelakin Tosin Matthew',
    opayBankName: 'OPay Digital Services',
    opayAccountNumber: '7034297995',
    opayAccountName: 'Oyelakin Tosin Matthew',
    paystackPublicKey: '',
    paystackSecretKey: '',

    // AI & Scraping Models
    geminiApiKey: '',
    antigravityApiKey: '',
    googlePlacesApiKey: '',
    cloudflareToken: '',
    vercelToken: '',
    useTorProxy: true,
    torProxyUrl: 'socks5://127.0.0.1:9050'
  });

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setConfig((prev: any) => ({ ...prev, ...data.config }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load configuration:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'All settings and integrations saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration settings.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error saving configuration.' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw className="spin-anim" size={32} />
        <p style={{ marginTop: 12 }}>Loading Settings & Integrations...</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Settings size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>System Settings & Enterprise Integrations</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4, margin: 0 }}>
                Configure multi-channel outreach gateways, bank payment bindings, AI model API keys, and deployment credentials.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {saving ? <RefreshCw className="spin-anim" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`status-banner ${message.type}`} style={{ marginBottom: 24, padding: '12px 16px', borderRadius: '10px', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: message.type === 'success' ? '#34d399' : '#f87171' }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('outreach')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: activeTab === 'outreach' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
            color: activeTab === 'outreach' ? '#38bdf8' : '#94a3b8',
            border: activeTab === 'outreach' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Send size={18} /> Outreach Gateways
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: activeTab === 'payment' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: activeTab === 'payment' ? '#34d399' : '#94a3b8',
            border: activeTab === 'payment' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <CreditCard size={18} /> Bank & Payments
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: activeTab === 'ai' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            color: activeTab === 'ai' ? '#c084fc' : '#94a3b8',
            border: activeTab === 'ai' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Bot size={18} /> AI & Scraper Models
        </button>
        <button
          onClick={() => setActiveTab('api_keys')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: activeTab === 'api_keys' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
            color: activeTab === 'api_keys' ? '#fbbf24' : '#94a3b8',
            border: activeTab === 'api_keys' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Key size={18} /> Cloud & API Keys
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: Outreach Gateways */}
        {activeTab === 'outreach' && (
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={20} style={{ color: '#38bdf8' }} /> Outbound Communication Channels
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Business Signature</label>
                <input
                  type="text"
                  value={config.businessSignature}
                  onChange={(e) => updateField('businessSignature', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Outreach Dry-Run Mode</label>
                <select
                  value={config.dryRun ? 'true' : 'false'}
                  onChange={(e) => updateField('dryRun', e.target.value === 'true')}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="true">ENABLE DRY RUN (Simulate without sending live SMS/Calls)</option>
                  <option value="false">LIVE OUTREACH (Dispatch real WhatsApp, SMS & Email)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Local WhatsApp Baileys Gateway URL</label>
                <input
                  type="text"
                  value={config.whatsappBaileysUrl}
                  onChange={(e) => updateField('whatsappBaileysUrl', e.target.value)}
                  placeholder="http://localhost:3007"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Twilio Account SID (Cold Call & Voice)</label>
                <input
                  type="text"
                  value={config.twilioAccountSid}
                  onChange={(e) => updateField('twilioAccountSid', e.target.value)}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Termii API Key (Nigeria SMS Gateway)</label>
                <input
                  type="text"
                  value={config.termiiApiKey}
                  onChange={(e) => updateField('termiiApiKey', e.target.value)}
                  placeholder="TLxxxxxxxxxxxx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>SMTP Host (Email Server)</label>
                <input
                  type="text"
                  value={config.smtpHost}
                  onChange={(e) => updateField('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bank & Payments */}
        {activeTab === 'payment' && (
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={20} style={{ color: '#34d399' }} /> Moniepoint & OPay Bank Account Bindings
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div style={{ background: 'rgba(16,185,129,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                <h4 style={{ color: '#34d399', margin: '0 0 12px 0' }}>Moniepoint Direct Virtual Account</h4>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Bank Name</label>
                  <input type="text" value={config.moniepointBankName} onChange={(e) => updateField('moniepointBankName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Account Number</label>
                  <input type="text" value={config.moniepointAccountNumber} onChange={(e) => updateField('moniepointAccountNumber', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Account Beneficiary</label>
                  <input type="text" value={config.moniepointAccountName} onChange={(e) => updateField('moniepointAccountName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(56,189,248,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(56,189,248,0.2)' }}>
                <h4 style={{ color: '#38bdf8', margin: '0 0 12px 0' }}>OPay Merchant Virtual Account</h4>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Bank Name</label>
                  <input type="text" value={config.opayBankName} onChange={(e) => updateField('opayBankName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Account Number</label>
                  <input type="text" value={config.opayAccountNumber} onChange={(e) => updateField('opayAccountNumber', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem' }}>Account Beneficiary</label>
                  <input type="text" value={config.opayAccountName} onChange={(e) => updateField('opayAccountName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI & Scraper Models */}
        {activeTab === 'ai' && (
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={20} style={{ color: '#c084fc' }} /> AI Concierge & Scraper Engine Controls
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Gemini / Google AI Key</label>
                <input
                  type="password"
                  value={config.geminiApiKey}
                  onChange={(e) => updateField('geminiApiKey', e.target.value)}
                  placeholder="AIzaSyxxxxxxxxxxxx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Google Places API Key (Scraper)</label>
                <input
                  type="password"
                  value={config.googlePlacesApiKey}
                  onChange={(e) => updateField('googlePlacesApiKey', e.target.value)}
                  placeholder="AIzaSyxxxxxxxxxxxx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Tor SOCKS5 Anonymizer Proxy</label>
                <input
                  type="text"
                  value={config.torProxyUrl}
                  onChange={(e) => updateField('torProxyUrl', e.target.value)}
                  placeholder="socks5://127.0.0.1:9050"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cloud & API Keys */}
        {activeTab === 'api_keys' && (
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Key size={20} style={{ color: '#fbbf24' }} /> Cloudflare & Deployment Tokens
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Cloudflare API Token</label>
                <input
                  type="password"
                  value={config.cloudflareToken}
                  onChange={(e) => updateField('cloudflareToken', e.target.value)}
                  placeholder="Cloudflare Token..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: 6 }}>Vercel Deployment API Token</label>
                <input
                  type="password"
                  value={config.vercelToken}
                  onChange={(e) => updateField('vercelToken', e.target.value)}
                  placeholder="vcp_xxxxxxxxxxxx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{
              padding: '12px 32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {saving ? 'Saving Updates...' : 'Save All Settings & Integrations'}
          </button>
        </div>
      </form>
    </div>
  );
}
