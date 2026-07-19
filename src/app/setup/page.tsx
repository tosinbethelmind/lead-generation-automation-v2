// src/app/setup/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Key, Cpu, ToggleLeft, ToggleRight, ExternalLink, 
  CheckCircle, AlertCircle, Loader2, ShieldCheck, Sparkles, 
  Mail, Phone, MessageSquare
} from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ai' | 'browser' | 'outreach'>('ai');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string | null }>({ type: null, message: null });

  // Tab 1: AI & Core API Keys
  const [geminiKeys, setGeminiKeys] = useState('');
  const [antigravityKeys, setAntigravityKeys] = useState('');
  const [antigravityModels, setAntigravityModels] = useState('gemini-2.5-flash, claude-3-5-sonnet-latest, gemini-2.5-pro, claude-3-5-opus-latest');
  const [onGroundMode, setOnGroundMode] = useState(false);
  const [testingAi, setTestingAi] = useState(false);

  // Tab 2: Browser & Scrapers
  const [activeBrowserProvider, setActiveBrowserProvider] = useState('local');
  const [browserProviderRotation, setBrowserProviderRotation] = useState('round-robin');
  const [browserlessKeys, setBrowserlessKeys] = useState('');
  const [browserbaseKeys, setBrowserbaseKeys] = useState('');
  const [webshareProxies, setWebshareProxies] = useState('');
  const [useTorProxy, setUseTorProxy] = useState(false);
  const [torProxyUrl, setTorProxyUrl] = useState('socks5://127.0.0.1:9050');
  const [torControlUrl, setTorControlUrl] = useState('127.0.0.1:9051');
  const [testingBrowser, setTestingBrowser] = useState(false);

  // Tab 3: Outreach Integration (SMS, Email, WhatsApp)
  const [smsProvider, setSmsProvider] = useState('gateway');
  const [smsGatewayUrl, setSmsGatewayUrl] = useState('');
  const [termiiApiKey, setTermiiApiKey] = useState('');
  const [termiiSenderId, setTermiiSenderId] = useState('');
  const [africastalkingUsername, setAfricastalkingUsername] = useState('');
  const [africastalkingApiKey, setAfricastalkingApiKey] = useState('');
  const [africastalkingSenderId, setAfricastalkingSenderId] = useState('');
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');
  const [twilioFromNumber, setTwilioFromNumber] = useState('');
  const [testSmsPhone, setTestSmsPhone] = useState('');
  const [testingSms, setTestingSms] = useState(false);

  const [emailProvider, setEmailProvider] = useState('gmail');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpSenderName, setSmtpSenderName] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [resendFromEmail, setResendFromEmail] = useState('');
  const [brevoApiKey, setBrevoApiKey] = useState('');
  const [brevoSenderName, setBrevoSenderName] = useState('');
  const [brevoSenderEmail, setBrevoSenderEmail] = useState('');
  const [sendgridApiKey, setSendgridApiKey] = useState('');
  const [sendgridFromEmail, setSendgridFromEmail] = useState('');
  const [sendgridSenderName, setSendgridSenderName] = useState('');

  const [whatsappProvider, setWhatsappProvider] = useState('cloud');
  const [whatsappBaileysUrl, setWhatsappBaileysUrl] = useState('http://localhost:3007');
  const [evolutionApiUrl, setEvolutionApiUrl] = useState('');
  const [evolutionApiKey, setEvolutionApiKey] = useState('');
  const [evolutionInstanceName, setEvolutionInstanceName] = useState('');
  const [jijiConnected, setJijiConnected] = useState(false);

  // Cloud-persistence status
  const [cloudPersisted, setCloudPersisted] = useState<boolean | null>(null);

  const loadConfig = async () => {
    try {
      // Use /api/config/cloud which reads from Supabase for durable persistence
      const res = await fetch('/api/config/cloud');
      if (res.ok) {
        const config = await res.json();
        setCloudPersisted(config.source === 'supabase');
        
        // Tab 1 UI states
        if (Array.isArray(config.geminiApiKeys)) setGeminiKeys(config.geminiApiKeys.join(', '));
        else if (config.geminiApiKey) setGeminiKeys(config.geminiApiKey);

        if (Array.isArray(config.antigravityApiKeys)) setAntigravityKeys(config.antigravityApiKeys.join(', '));
        else if (config.antigravityApiKey) setAntigravityKeys(config.antigravityApiKey);

        if (Array.isArray(config.antigravityModels)) setAntigravityModels(config.antigravityModels.join(', '));
        setOnGroundMode(!!config.onGroundMode);

        // Tab 2 UI states
        setActiveBrowserProvider(config.activeBrowserProvider || 'local');
        setBrowserProviderRotation(config.browserProviderRotation || 'round-robin');
        if (Array.isArray(config.browserlessApiKeys)) setBrowserlessKeys(config.browserlessApiKeys.join(', '));
        if (Array.isArray(config.browserbaseApiKeys)) setBrowserbaseKeys(config.browserbaseApiKeys.join(', '));
        if (Array.isArray(config.webshareProxies)) setWebshareProxies(config.webshareProxies.join(', '));
        setUseTorProxy(!!config.useTorProxy);
        setTorProxyUrl(config.torProxyUrl || 'socks5://127.0.0.1:9050');
        setTorControlUrl(config.torControlUrl || '127.0.0.1:9051');

        // Tab 3 UI states
        setSmsProvider(config.smsProvider || 'gateway');
        setSmsGatewayUrl(config.smsGatewayUrl || '');
        setTermiiApiKey(config.termiiApiKey || '');
        setTermiiSenderId(config.termiiSenderId || '');
        setAfricastalkingUsername(config.africastalkingUsername || '');
        setAfricastalkingApiKey(config.africastalkingApiKey || '');
        setAfricastalkingSenderId(config.africastalkingSenderId || '');
        setTwilioAccountSid(config.twilioAccountSid || '');
        setTwilioAuthToken(config.twilioAuthToken || '');
        setTwilioFromNumber(config.twilioFromNumber || '');

        setEmailProvider(config.emailProvider || 'gmail');
        setSmtpHost(config.smtpHost || '');
        setSmtpPort(config.smtpPort || 587);
        setSmtpSecure(!!config.smtpSecure);
        setSmtpUser(config.smtpUser || '');
        setSmtpPass(config.smtpPass || '');
        setSmtpFrom(config.smtpFrom || '');
        setSmtpSenderName(config.smtpSenderName || '');
        setResendApiKey(config.resendApiKey || '');
        setResendFromEmail(config.resendFromEmail || '');
        setBrevoApiKey(config.brevoApiKey || '');
        setBrevoSenderName(config.brevoSenderName || '');
        setBrevoSenderEmail(config.brevoSenderEmail || '');
        setSendgridApiKey(config.sendgridApiKey || '');
        setSendgridFromEmail(config.sendgridFromEmail || '');
        setSendgridSenderName(config.sendgridSenderName || '');

        setWhatsappProvider(config.whatsappProvider || 'cloud');
        setWhatsappBaileysUrl(config.whatsappBaileysUrl || 'http://localhost:3007');
        setEvolutionApiUrl(config.evolutionApiUrl || '');
        setEvolutionApiKey(config.evolutionApiKey || '');
        setEvolutionInstanceName(config.evolutionInstanceName || '');
        setJijiConnected(!!config.jijiCookies);
      }
    } catch (err) {
      console.error('Failed to load configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: null });

    // Prompt if cloud API keys are not supplied
    if (activeBrowserProvider === 'browserless' && !browserlessKeys.trim()) {
      if (!confirm("You have selected Browserless.io Cloud as your active browser provider, but you haven't filled in any Browserless API Tokens.\n\nThe runner will automatically fall back to local Chromium browser launcher.\n\nDo you want to proceed and save settings anyway?")) {
        setSaving(false);
        return;
      }
    } else if (activeBrowserProvider === 'browserbase' && !browserbaseKeys.trim()) {
      if (!confirm("You have selected Browserbase API as your active browser provider, but you haven't filled in any Browserbase API Keys.\n\nThe runner will automatically fall back to local Chromium browser launcher.\n\nDo you want to proceed and save settings anyway?")) {
        setSaving(false);
        return;
      }
    } else if (activeBrowserProvider === 'rotation' && !browserlessKeys.trim() && !browserbaseKeys.trim()) {
      if (!confirm("You have selected Key Rotation provider, but both Browserless and Browserbase API keys are empty.\n\nThe runner will automatically fall back to local Chromium browser launcher.\n\nDo you want to proceed and save settings anyway?")) {
        setSaving(false);
        return;
      }
    }

    const updates: any = {
      // Tab 1 keys
      antigravityApiKeys: antigravityKeys.split(/[\n,]+/).map(k => k.trim()).filter(Boolean),
      antigravityModels: antigravityModels.split(/[\n,]+/).map(m => m.trim()).filter(Boolean),
      geminiApiKeys: geminiKeys.split(/[\n,]+/).map(k => k.trim()).filter(Boolean),
      onGroundMode,

      // Tab 2 keys
      activeBrowserProvider,
      browserProviderRotation,
      browserlessApiKeys: browserlessKeys.split(/[\n,]+/).map(k => k.trim()).filter(Boolean),
      browserbaseApiKeys: browserbaseKeys.split(/[\n,]+/).map(k => k.trim()).filter(Boolean),
      webshareProxies: webshareProxies.split(/[\n,]+/).map(p => p.trim()).filter(Boolean),
      useTorProxy,
      torProxyUrl,
      torControlUrl,

      // Tab 3 keys
      smsProvider,
      smsGatewayUrl,
      termiiApiKey,
      termiiSenderId,
      africastalkingUsername,
      africastalkingApiKey,
      africastalkingSenderId,
      twilioAccountSid,
      twilioAuthToken,
      twilioFromNumber,

      emailProvider,
      smtpHost,
      smtpPort: Number(smtpPort),
      smtpSecure,
      smtpUser,
      smtpPass,
      smtpFrom,
      smtpSenderName,
      resendApiKey,
      resendFromEmail,
      brevoApiKey,
      brevoSenderName,
      brevoSenderEmail,
      sendgridApiKey,
      sendgridFromEmail,
      sendgridSenderName,

      whatsappProvider,
      whatsappBaileysUrl,
      evolutionApiUrl,
      evolutionApiKey,
      evolutionInstanceName
    };

    try {
    const res = await fetch('/api/config/cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setCloudPersisted(data.persisted ?? false);
        setStatus({ type: 'success', message: data.message || 'Configuration saved successfully!' });
        router.refresh();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to save configuration.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const runAiTest = async () => {
    if (!geminiKeys.trim() && !antigravityKeys.trim()) {
      setStatus({ type: 'error', message: 'Please enter a Gemini or Antigravity API key first.' });
      return;
    }
    const key = geminiKeys ? geminiKeys.split(/[\n,]+/)[0].trim() : antigravityKeys.split(/[\n,]+/)[0].trim();
    setTestingAi(true);
    setStatus({ type: null, message: null });
    try {
      const res = await fetch('/api/config/test-antigravity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, model: 'gemini-1.5-flash' })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'AI Gateway check succeeded: ' + data.message });
      } else {
        setStatus({ type: 'error', message: 'AI Connection Failed: ' + data.error });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'AI Connection Error: ' + err.message });
    } finally {
      setTestingAi(false);
    }
  };

  const runBrowserTest = async () => {
    setTestingBrowser(true);
    setStatus({ type: null, message: null });
    try {
      const res = await fetch('/api/config/test-browser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeBrowserProvider,
          apiKey: activeBrowserProvider === 'browserless' ? browserlessKeys : browserbaseKeys,
          proxyUrl: webshareProxies,
          controlUrl: torControlUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Browser Engine validated successfully: ' + (data.message || 'Connected!') });
      } else {
        setStatus({ type: 'error', message: 'Browser Engine test failed: ' + (data.error || 'Connection Timeout') });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Browser test triggered error: ' + err.message });
    } finally {
      setTestingBrowser(false);
    }
  };

  const runSmsTest = async () => {
    if (!testSmsPhone.trim()) {
      setStatus({ type: 'error', message: 'Enter a valid test phone number in E.164 state (e.g. +234803...)' });
      return;
    }
    setTestingSms(true);
    setStatus({ type: null, message: null });
    try {
      const currentConfig = {
        smsProvider,
        smsGatewayUrl,
        termiiApiKey,
        termiiSenderId,
        africastalkingUsername,
        africastalkingApiKey,
        africastalkingSenderId,
        twilioAccountSid,
        twilioAuthToken,
        twilioFromNumber
      };
      const res = await fetch('/api/config/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testNumber: testSmsPhone, config: currentConfig })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'SMS Test verification succeeded: ' + data.message });
      } else {
        setStatus({ type: 'error', message: 'SMS Test failed: ' + data.error });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'SMS endpoint connection error: ' + err.message });
    } finally {
      setTestingSms(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#06b6d4', animation: 'spin 1.5s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Decrypting settings...</p>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    backgroundColor: '#0a0d16'
  };

  const textareaStyle = {
    ...inputStyle,
    fontFamily: 'monospace',
    resize: 'vertical' as const,
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.820rem',
    fontWeight: 600,
    color: '#cbd5e1',
  };

  const hintStyle = {
    display: 'block',
    fontSize: '0.72rem',
    color: '#64748b',
    marginTop: '3px',
    lineHeight: 1.3
  };

  const buttonTestStyle = {
    padding: '5px 10px',
    fontSize: '0.7rem',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    color: '#06b6d4',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600 as const,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const tabStyle = (active: boolean) => ({
    padding: '10px 16px',
    fontSize: '0.8rem',
    fontWeight: 600,
    background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #06b6d4' : '2px solid transparent',
    color: active ? '#fff' : '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#f8fafc', position: 'relative', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 12px' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182,212, 0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />

      <main style={{ width: '100%', maxWidth: '780px', position: 'relative', zIndex: 10 }}>
        
        {/* Back Link Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
          >
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '3px 10px', borderRadius: '20px' }}>
            <Sparkles style={{ width: '10px', height: '10px' }} />
            <span>Integrated Setup Wizard</span>
          </div>
        </div>

        {/* glass-panel from global.css */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings style={{ width: '22px', height: '22px', color: '#06b6d4' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>System Configurations</h1>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>One-stop configuration for AI agents, Puppeteer scrapers, and outreach routes.</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '24px', gap: '4px' }}>
            <button type="button" onClick={() => setActiveTab('ai')} style={tabStyle(activeTab === 'ai')}>
              <Cpu style={{ width: '14px', height: '14px' }} /> AI & Core Engines
            </button>
            <button type="button" onClick={() => setActiveTab('browser')} style={tabStyle(activeTab === 'browser')}>
              <ShieldCheck style={{ width: '14px', height: '14px' }} /> Scrapers & Proxies
            </button>
            <button type="button" onClick={() => setActiveTab('outreach')} style={tabStyle(activeTab === 'outreach')}>
              <Mail style={{ width: '14px', height: '14px' }} /> Outreach Gateways
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* ======= TAB 1: AI & CORE ======= */}
            {activeTab === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ── Gemini Key: prominent first-run card ────────────────── */}
                <div style={{
                  background: geminiKeys.trim() ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.07)',
                  border: `1px solid ${geminiKeys.trim() ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.3)'}`,
                  borderRadius: '14px',
                  padding: '18px 20px',
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>✨</span>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'block' }}>
                          Gemini AI Key — Required for Preview Generation
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          This is the key that generates your prospect website copy. Without it, all preview links will show an error.
                        </span>
                      </div>
                    </div>
                    {/* Status pill */}
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '20px',
                      background: geminiKeys.trim()
                        ? (cloudPersisted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)')
                        : 'rgba(239, 68, 68, 0.15)',
                      color: geminiKeys.trim()
                        ? (cloudPersisted ? '#10b981' : '#eab308')
                        : '#ef4444',
                      flexShrink: 0,
                      marginLeft: '8px',
                      whiteSpace: 'nowrap',
                    }}>
                      {geminiKeys.trim()
                        ? (cloudPersisted ? '✅ Saved to Cloud' : '⚠️ Saved Locally Only')
                        : '❌ Not Configured'}
                    </span>
                  </div>

                  {/* Key input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={labelStyle}>
                        <Key style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
                        <span>Gemini API Keys</span>
                      </span>
                      <button type="button" disabled={testingAi} onClick={runAiTest} style={buttonTestStyle}>
                        {testingAi ? <Loader2 style={{ width: '11px', height: '11px', animation: 'spin 1.5s linear infinite' }} /> : 'Test AI Keys'}
                      </button>
                    </div>
                    <textarea
                      value={geminiKeys}
                      onChange={e => setGeminiKeys(e.target.value)}
                      placeholder="Paste your Gemini API key here — e.g. AIzaSy..."
                      rows={2}
                      style={{
                        ...textareaStyle,
                        border: geminiKeys.trim() ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.4)',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={hintStyle}>Free keys from Google AI Studio. Separate multiple keys with commas for auto-rotation on quota.</span>
                      <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          color: '#06b6d4',
                          textDecoration: 'none',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        Get a free key from Google AI Studio <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </a>
                    </div>
                  </div>

                  {/* Cloud persistence notice if Supabase is not set up */}
                  {cloudPersisted === false && geminiKeys.trim() && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px 12px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      color: '#fbbf24',
                      lineHeight: 1.4,
                    }}>
                      ⚠️ <strong>Key saved locally only.</strong> On Vercel, this will be lost on the next server restart.
                      To make it permanent: enter your Supabase URL &amp; anon key in any settings section and save again, or set <code>GEMINI_API_KEY</code> as a Vercel environment variable.
                    </div>
                  )}
                </div>

                {/* Antigravity fallback keys */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={labelStyle}>
                    <Cpu style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
                    <span>Antigravity Fallback Keys</span>
                  </span>
                  <textarea value={antigravityKeys} onChange={e => setAntigravityKeys(e.target.value)} placeholder="key1, key2" rows={2} style={textareaStyle} />
                  <span style={hintStyle}>Optional backup keys for emergency model chains.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={labelStyle}>
                    <Sparkles style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                    <span>Models Rotation Chain</span>
                  </span>
                  <input type="text" value={antigravityModels} onChange={e => setAntigravityModels(e.target.value)} style={inputStyle} />
                  <span style={hintStyle}>Comma-separated model names parsed in priority order.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: '#e2e8f0' }}>On-Ground Copywriting mode</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>If enabled, bypass API models during outreach and utilize pre-loaded copywriting scripts.</span>
                  </div>
                  <button type="button" onClick={() => setOnGroundMode(!onGroundMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {onGroundMode ? <ToggleRight style={{ width: '28px', height: '28px', color: '#06b6d4' }} /> : <ToggleLeft style={{ width: '28px', height: '28px', color: '#475569' }} />}
                  </button>
                </div>
              </div>
            )}

            {/* ======= TAB 2: SCRAPERS & PROXIES ======= */}
            {activeTab === 'browser' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={labelStyle}>Active Web Browser Provider</span>
                    <select value={activeBrowserProvider} onChange={e => setActiveBrowserProvider(e.target.value)} style={selectStyle}>
                      <option value="local">Local Chromium (Installed Chrome)</option>
                      <option value="tor">Tor Proxy SOCKS5 (Highly Anonymous)</option>
                      <option value="browserless">Browserless.io Cloud (Serverless)</option>
                      <option value="browserbase">Browserbase API</option>
                      <option value="rotation">Key Rotation (Browserless + Browserbase)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={labelStyle}>Browser Pool Rotation Logic</span>
                    <select value={browserProviderRotation} onChange={e => setBrowserProviderRotation(e.target.value)} style={selectStyle}>
                      <option value="round-robin">Round-Robin (Strict Order)</option>
                      <option value="random">Randomize Distribution</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" disabled={testingBrowser} onClick={runBrowserTest} style={buttonTestStyle}>
                    {testingBrowser ? <Loader2 style={{ width: '11px', height: '11px', animation: 'spin 1.5s linear infinite' }} /> : 'Verify Scraper Connect'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={labelStyle}>Browserless.io API Tokens</span>
                  <textarea value={browserlessKeys} onChange={e => setBrowserlessKeys(e.target.value)} placeholder="token1, token2" rows={2} style={textareaStyle} />
                  <span style={hintStyle}>Copy from your Browserless.io console for hands-free scraping.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={labelStyle}>Browserbase API Keys</span>
                  <textarea value={browserbaseKeys} onChange={e => setBrowserbaseKeys(e.target.value)} placeholder="apiKey1, apiKey2" rows={2} style={textareaStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={labelStyle}>Webshare / Custom Proxy Rotation Pool</span>
                  <textarea value={webshareProxies} onChange={e => setWebshareProxies(e.target.value)} placeholder="http://user:pass@ip:port" rows={2} style={textareaStyle} />
                  <span style={hintStyle}>Separate multiple proxies with commas or newlines. Protocol prefix (http://, socks5://) is required.</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: '#e2e8f0' }}>Proxy Scrapes through Tor Route</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Forces HTTP requests to tunnel via SOCKS5 Tor network. Requires Tor running locally.</span>
                    </div>
                    <button type="button" onClick={() => setUseTorProxy(!useTorProxy)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {useTorProxy ? <ToggleRight style={{ width: '28px', height: '28px', color: '#06b6d4' }} /> : <ToggleLeft style={{ width: '28px', height: '28px', color: '#475569' }} />}
                    </button>
                  </div>
                  {useTorProxy && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={labelStyle}>Tor Proxy URL</span>
                        <input type="text" value={torProxyUrl} onChange={e => setTorProxyUrl(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <span style={labelStyle}>Tor Control IP/Port</span>
                        <input type="text" value={torControlUrl} onChange={e => setTorControlUrl(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======= TAB 3: OUTREACH & INTEGRATIONS ======= */}
            {activeTab === 'outreach' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. Email Gateway */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
                    <Mail style={{ width: '14px', height: '14px' }} /> Email Gateways
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={labelStyle}>Active Email Provider</span>
                      <select value={emailProvider} onChange={e => setEmailProvider(e.target.value)} style={selectStyle}>
                        <option value="gmail">Gmail OAuth (Primary Account)</option>
                        <option value="smtp">Custom SMTP Gateway (Hostinger, Mailgun, etc.)</option>
                        <option value="resend">Resend API</option>
                        <option value="brevo">Brevo API (Sendinblue)</option>
                        <option value="sendgrid">SendGrid API</option>
                      </select>
                    </div>

                    {emailProvider === 'smtp' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>SMTP Host</span>
                          <input type="text" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} placeholder="smtp.hostinger.com" style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>SMTP Port</span>
                          <input type="number" value={smtpPort} onChange={e => setSmtpPort(Number(e.target.value))} placeholder="587" style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <span style={labelStyle}>SSL/TLS</span>
                          <button type="button" onClick={() => setSmtpSecure(!smtpSecure)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                            {smtpSecure ? <ToggleRight style={{ width: '26px', height: '26px', color: '#06b6d4' }} /> : <ToggleLeft style={{ width: '26px', height: '26px', color: '#475569' }} />}
                          </button>
                        </div>
                        <div style={{ gridColumn: 'span 3' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <span style={labelStyle}>SMTP Username</span>
                              <input type="text" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                              <span style={labelStyle}>SMTP Password</span>
                              <input type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} style={inputStyle} />
                            </div>
                          </div>
                        </div>
                        <div style={{ gridColumn: 'span 3' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <span style={labelStyle}>Sender From Email</span>
                              <input type="text" value={smtpFrom} onChange={e => setSmtpFrom(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                              <span style={labelStyle}>Sender Display Name</span>
                              <input type="text" value={smtpSenderName} onChange={e => setSmtpSenderName(e.target.value)} style={inputStyle} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {emailProvider === 'resend' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Resend API Key</span>
                          <input type="password" value={resendApiKey} onChange={e => setResendApiKey(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Verified From Email</span>
                          <input type="text" value={resendFromEmail} onChange={e => setResendFromEmail(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {emailProvider === 'brevo' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Brevo API Key</span>
                          <input type="password" value={brevoApiKey} onChange={e => setBrevoApiKey(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Sender Name</span>
                          <input type="text" value={brevoSenderName} onChange={e => setBrevoSenderName(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Sender Email</span>
                          <input type="text" value={brevoSenderEmail} onChange={e => setBrevoSenderEmail(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {emailProvider === 'sendgrid' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>SendGrid API Key</span>
                          <input type="password" value={sendgridApiKey} onChange={e => setSendgridApiKey(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Verified From Email</span>
                          <input type="text" value={sendgridFromEmail} onChange={e => setSendgridFromEmail(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Sender Name</span>
                          <input type="text" value={sendgridSenderName} onChange={e => setSendgridSenderName(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SMS Gateway */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
                    <Phone style={{ width: '14px', height: '14px' }} /> SMS Gateways
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={labelStyle}>SMS Outreach Channel Provider</span>
                      <select value={smsProvider} onChange={e => setSmsProvider(e.target.value)} style={selectStyle}>
                        <option value="gateway">Android Carrier Gateway Link (Free)</option>
                        <option value="termii">Termii SMS API (West Africa/Nigeria)</option>
                        <option value="africastalking">Africa's Talking API</option>
                        <option value="twilio">Twilio Account</option>
                      </select>
                    </div>

                    {/* Android App Download Banner (Always Visible) */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(6, 182, 212, 0.05)',
                      border: '1px solid rgba(6, 182, 212, 0.15)',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                      color: '#e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '4px'
                    }}>
                      <div>
                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>📲 Android SMS Gateway App Download</strong>
                        <span>Need to send SMS? Download the gateway APK to send messages directly via your phone's carrier SIM for free.</span>
                      </div>
                      <a 
                        href="https://github.com/capcom124/SmsGateway/releases/download/v2.1.2/SmsGateway.apk"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#06b6d4',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        Download APK <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </a>
                    </div>

                    {smsProvider === 'gateway' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <span style={labelStyle}>Carrier SMS Gateway API URL</span>
                          <input type="text" value={smsGatewayUrl} onChange={e => setSmsGatewayUrl(e.target.value)} placeholder="http://192.168.1.100:8000/send" style={inputStyle} />
                          <span style={hintStyle}>Enter the endpoint exported by your local Android SMS Gateway software.</span>
                        </div>

                        <div style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px dashed rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          marginTop: '4px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>📲 Setting up Android SMS Gateway</h4>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                              1. Scan the QR code or click below to download the gateway APK to your Android phone.<br />
                              2. Install & open the app, keep it connected to the internet, and grant SMS permissions.<br />
                              3. Paste the endpoint URL exported by the app (e.g. <code>http://192.168.1.15:8080/send</code> or your <code>ngrok</code> URL) above.
                            </p>
                            <a 
                              href="https://github.com/capcom124/SmsGateway/releases" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.7rem',
                                color: '#06b6d4',
                                textDecoration: 'none',
                                fontWeight: 650
                              }}
                            >
                              Download APK from GitHub Releases <ExternalLink style={{ width: '10px', height: '10px' }} />
                            </a>
                          </div>
                          <div style={{
                            padding: '8px',
                            background: '#fff',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100px',
                            height: '100px',
                            color: '#000',
                            flexShrink: 0
                          }}>
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://github.com/capcom124/SmsGateway/releases/download/v2.1.2/SmsGateway.apk" 
                              alt="Scan to download APK"
                              style={{ width: '84px', height: '84px', border: 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {smsProvider === 'termii' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Termii API Key</span>
                          <input type="password" value={termiiApiKey} onChange={e => setTermiiApiKey(e.target.value)} placeholder="tl_secretKey..." style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Sender ID / Channel</span>
                          <input type="text" value={termiiSenderId} onChange={e => setTermiiSenderId(e.target.value)} placeholder="Sandbox" style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {smsProvider === 'africastalking' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Username</span>
                          <input type="text" value={africastalkingUsername} onChange={e => setAfricastalkingUsername(e.target.value)} placeholder="sandbox" style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>API Key</span>
                          <input type="password" value={africastalkingApiKey} onChange={e => setAfricastalkingApiKey(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Sender ID (Optional)</span>
                          <input type="text" value={africastalkingSenderId} onChange={e => setAfricastalkingSenderId(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {smsProvider === 'twilio' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Account SID</span>
                          <input type="text" value={twilioAccountSid} onChange={e => setTwilioAccountSid(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Auth Token</span>
                          <input type="password" value={twilioAuthToken} onChange={e => setTwilioAuthToken(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Twilio From Number</span>
                          <input type="text" value={twilioFromNumber} onChange={e => setTwilioFromNumber(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {/* SMS Verification Tester */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <span style={labelStyle}>Verify SMS Configuration</span>
                        <input type="text" value={testSmsPhone} onChange={e => setTestSmsPhone(e.target.value)} placeholder="Test Phone Number (+234...)" style={inputStyle} />
                      </div>
                      <button type="button" disabled={testingSms} onClick={runSmsTest} style={{ ...buttonTestStyle, padding: '9px 16px', height: '38px', borderRadius: '10px' }}>
                        {testingSms ? <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1.5s linear infinite' }} /> : 'Send Test SMS'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. WhatsApp & Socials */}
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 12px 0' }}>
                    <MessageSquare style={{ width: '14px', height: '14px' }} /> WhatsApp & Social Connectors
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={labelStyle}>WhatsApp API Server Gateway</span>
                      <select value={whatsappProvider} onChange={e => setWhatsappProvider(e.target.value)} style={selectStyle}>
                        <option value="cloud">Meta WhatsApp Cloud API (Legacy)</option>
                        <option value="baileys">Baileys Service (Local Web session)</option>
                        <option value="evolution">Evolution API Controller</option>
                        <option value="whapi">Whapi Gateway API</option>
                      </select>
                    </div>

                    {whatsappProvider === 'baileys' && (
                      <div>
                        <span style={labelStyle}>Baileys Local Instance URL</span>
                        <input type="text" value={whatsappBaileysUrl} onChange={e => setWhatsappBaileysUrl(e.target.value)} placeholder="http://localhost:3007" style={inputStyle} />
                        <span style={hintStyle}>Address of the local Baileys Node API process.</span>
                      </div>
                    )}

                    {whatsappProvider === 'evolution' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={labelStyle}>Evolution API Host URL</span>
                          <input type="text" value={evolutionApiUrl} onChange={e => setEvolutionApiUrl(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Global API Entry Key</span>
                          <input type="password" value={evolutionApiKey} onChange={e => setEvolutionApiKey(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <span style={labelStyle}>Instance Identifier</span>
                          <input type="text" value={evolutionInstanceName} onChange={e => setEvolutionInstanceName(e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                    )}

                    {/* Jiji session connector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginTop: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: '#e2e8f0' }}>Jiji Sync Status</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Connected via browser cookies storage integration.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '12px', backgroundColor: jijiConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: jijiConnected ? '#31f79a' : '#fbbf24' }}>
                          {jijiConnected ? 'Synced' : 'Not Connected'}
                        </span>
                        <button type="button" onClick={() => window.open('/api/auth/jiji/connect', '_blank')} style={buttonTestStyle}>
                          Connect Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Status Messages */}
            {status.message && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px',
                borderRadius: '12px',
                border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                color: status.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '0.78rem'
              }}>
                {status.type === 'success' ? <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} /> : <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />}
                <span style={{ lineHeight: 1.4 }}>{status.message}</span>
              </div>
            )}

            {/* Action control buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={() => router.push('/')} 
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', color: '#94a3b8', padding: '10px 20px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 20px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)' }}
              >
                {saving ? <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1.5s linear infinite' }} /> : 'Save Configurations'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
