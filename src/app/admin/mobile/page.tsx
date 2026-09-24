'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Send, 
  Search, 
  Radio, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  ArrowUpRight, 
  Smartphone, 
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function MobileAdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<'radar' | 'antigravity' | 'closer' | 'engine'>('radar');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [activeProspects, setActiveProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Antigravity AI Prompt Studio States
  const [promptInput, setPromptInput] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'antigravity'; text: string; actions?: any[] }>>([
    {
      sender: 'antigravity',
      text: `### 🧠 Antigravity AI Copilot Ready
I am connected directly to your Lagos Desk Lead Engine.
What would you like to review or upgrade?
• **Review Landing Page:** Audit prototype conversions, hooks & mobile speed.
• **Review Outreach:** Audit 600 emails, webform honeypots, and spam filters.
• **Review Conversion:** Check closer response times, OPay deposits & invoice flow.
• **Upgrade WebApp:** Direct me to tune quotas, prompts, or sector tools.`
    }
  ]);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // 15s auto-refresh

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/admin/mobile-control');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry);
        setActiveProspects(data.activeProspects || []);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert('To install on iOS: Tap the Share button in Safari, then tap "Add to Home Screen".\nOn Android: Tap the 3 dots in Chrome, then tap "Install app" or "Add to Home screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  const handleTriggerAction = async (actionKey: string, label: string) => {
    setTriggerLoading(actionKey);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionKey })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`✅ ${label} triggered successfully!`);
        fetchTelemetry();
      } else {
        setFeedbackMsg(`⚠️ ${data.error || 'Action failed'}`);
      }
    } catch (e: any) {
      setFeedbackMsg(`⚠️ Error: ${e.message}`);
    } finally {
      setTriggerLoading(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleSendPrompt = async (customPrompt?: string) => {
    const text = (customPrompt || promptInput).trim();
    if (!text) return;

    const userMsg = { sender: 'user' as const, text };
    setChatHistory(prev => [...prev, userMsg]);
    if (!customPrompt) setPromptInput('');
    setPromptLoading(true);

    try {
      const res = await fetch('/api/admin/antigravity-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const result = await res.json();
      if (result.success) {
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'antigravity',
            text: result.data.response,
            actions: result.data.suggestedActions
          }
        ]);
      } else {
        setChatHistory(prev => [
          ...prev,
          { sender: 'antigravity', text: `⚠️ Antigravity note: ${result.error}` }
        ]);
      }
    } catch (e: any) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'antigravity', text: `⚠️ Error executing prompt: ${e.message}` }
      ]);
    } finally {
      setPromptLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070a12',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '90px'
    }}>
      {/* Top Header Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7, 10, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>Bethelmind Mobile</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>LAGOS DESK 24/7 AUTOPILOT</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchTelemetry}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#94a3b8',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={12} />
          <span>Sync</span>
        </button>
      </header>

      {/* PWA Install Banner */}
      {isInstallable && (
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={16} />
            <span>Install Bethelmind on your home screen for full app control</span>
          </div>
          <button
            onClick={handleInstallPwa}
            style={{
              background: '#ffffff',
              color: '#0284c7',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Install App
          </button>
        </div>
      )}

      {/* Action Feedback Banner */}
      {feedbackMsg && (
        <div style={{
          background: '#0f172a',
          borderBottom: '1px solid #0284c7',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#38bdf8',
          textAlign: 'center'
        }}>
          {feedbackMsg}
        </div>
      )}

      {/* Main Content Area Based on Active Tab */}
      <main style={{ padding: '16px' }}>

        {/* ── TAB 1: RADAR & OUTREACH DISPATCHES ───────────────────────────── */}
        {activeTab === 'radar' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Daily Growth Engine
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>Live Outreach Radar</h2>
            </div>

            {/* Quota Progress Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {/* 600 Email Card */}
              <div style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '14px',
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Emails Today</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
                  {telemetry?.emails?.sentToday || 0}
                  <span style={{ fontSize: '13px', color: '#64748b' }}>/600</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${telemetry?.emails?.percent || 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    borderRadius: '3px'
                  }} />
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>Hostinger Dual-Pool</div>
              </div>

              {/* 300 Webforms Card */}
              <div style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Webforms Today</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                  {telemetry?.webforms?.sentToday || 0}
                  <span style={{ fontSize: '13px', color: '#64748b' }}>/300</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${telemetry?.webforms?.percent || 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #059669, #10b981)',
                    borderRadius: '3px'
                  }} />
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>Honeypot-Protected</div>
              </div>
            </div>

            {/* Total Leads In Pool Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1px solid #1e3a5f',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Genuine Importers & SMEs</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {telemetry?.leads?.totalGenuine?.toLocaleString() || '2,939'} Verified Leads
                </div>
              </div>
              <div style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                Zero-Crypto
              </div>
            </div>

            {/* 1-Tap Mobile Dispatch Buttons */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                ⚡ 1-Tap Remote Dispatches
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => handleTriggerAction('trigger_emails_webforms', '600 Emails & Webforms Dispatcher')}
                  disabled={triggerLoading === 'trigger_emails_webforms'}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Send size={18} />
                    <span>Run Today&apos;s 600 Emails &amp; Webforms</span>
                  </div>
                  {triggerLoading === 'trigger_emails_webforms' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </button>

                <button
                  onClick={() => handleTriggerAction('trigger_admin_briefing', 'Executive Briefing to Admin WhatsApp')}
                  disabled={triggerLoading === 'trigger_admin_briefing'}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={18} />
                    <span>Send Daily Update to WhatsApp (0802 279 1227)</span>
                  </div>
                  {triggerLoading === 'trigger_admin_briefing' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </button>

                <button
                  onClick={() => handleTriggerAction('trigger_scraper', 'Nationwide B2B Harvester')}
                  disabled={triggerLoading === 'trigger_scraper'}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Search size={18} />
                    <span>Scrape Fresh Verified B2B Leads</span>
                  </div>
                  {triggerLoading === 'trigger_scraper' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ANTIGRAVITY AI PROMPT STUDIO ─────────────────────────── */}
        {activeTab === 'antigravity' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Antigravity Agentic Studio
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>Prompt-Driven Upgrades &amp; Reviews</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Instruct the AI to review landing pages, audit outreach, analyze conversion, or execute upgrades.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => handleSendPrompt('Review my landing page and prototype conversion hooks')}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#1e1b4b',
                  border: '1px solid #4338ca',
                  color: '#c7d2fe',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🚀 Review Landing Page
              </button>
              <button
                onClick={() => handleSendPrompt('Audit my 600 email outreach, subject lines and webform honeypot filters')}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#082f49',
                  border: '1px solid #0369a1',
                  color: '#bae6fd',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📧 Audit 600 Emails
              </button>
              <button
                onClick={() => handleSendPrompt('Review conversion funnel, after-hours WhatsApp closer, and OPay payout flow')}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#064e3b',
                  border: '1px solid #047857',
                  color: '#a7f3d0',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                💰 Review Conversion
              </button>
              <button
                onClick={() => handleSendPrompt('Upgrade webapp: verify 10 sector monetization tools and ensure direct OPay routing')}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#312e81',
                  border: '1px solid #4f46e5',
                  color: '#e0e7ff',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Upgrade WebApp
              </button>
            </div>

            {/* Chat Response Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '80px' }}>
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: item.sender === 'user' ? '85%' : '100%',
                    background: item.sender === 'user' ? '#0284c7' : '#0f172a',
                    border: item.sender === 'user' ? 'none' : '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#f8fafc'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>

                  {/* Action Buttons inside Antigravity response */}
                  {item.actions && item.actions.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (act.action === 'trigger_outreach') handleTriggerAction('trigger_emails_webforms', 'Outreach');
                            else if (act.action === 'open_whatsapp_desk') window.open('https://wa.me/2348022791227', '_blank');
                            else if (act.action === 'open_preview') window.open('https://www.bethelmindanalytics.com/preview/apex-solar-technologies-lagos', '_blank');
                            else handleSendPrompt(`Execute action: ${act.label}`);
                          }}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #38bdf8',
                            color: '#38bdf8',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          👉 {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {promptLoading && (
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#94a3b8' }}>
                  🧠 Antigravity analyzing live telemetry &amp; code...
                </div>
              )}
            </div>

            {/* Prompt Input Fixed Bar */}
            <div style={{
              position: 'fixed',
              bottom: '64px',
              left: 0,
              right: 0,
              padding: '10px 16px',
              background: 'rgba(7, 10, 18, 0.95)',
              borderTop: '1px solid #1e293b',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendPrompt(); }}
                placeholder="Give Antigravity prompt (e.g. review landing page)..."
                style={{
                  flex: 1,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSendPrompt()}
                disabled={promptLoading || !promptInput.trim()}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 16px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: INBOUND LEADS & CLOSER DESK ──────────────────────────── */}
        {activeTab === 'closer' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                WhatsApp Closer Desk
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>High-Intent Prospects</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Tap WhatsApp to close commercial leads directly on your phone.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeProspects.map((lead, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{lead.name}</h4>
                      <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>{lead.category} · {lead.area}</div>
                    </div>
                    {lead.outreach_sent && (
                      <span style={{ fontSize: '10px', background: '#064e3b', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        Sent
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    📞 {lead.phone} {lead.email && `· 📧 ${lead.email}`}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.name} team! I am reaching out from Bethelmind Analytics regarding your 24/7 quoting portal.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        background: '#10b981',
                        color: '#ffffff',
                        textDecoration: 'none',
                        textAlign: 'center',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <a
                      href={lead.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Preview
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: ENGINE & WHATSAPP LINES ──────────────────────────────── */}
        {activeTab === 'engine' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                System Architecture
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>Engine Health &amp; Settlement</h2>
            </div>

            {/* WhatsApp Lines Architecture */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '14px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="#10b981" />
                <span>WhatsApp Lines Architecture</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ color: '#94a3b8' }}>Admin Closer Desk:</span>
                  <strong style={{ color: '#10b981' }}>0802 279 1227 (Active)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ color: '#94a3b8' }}>Outbound SIM Lines:</span>
                  <span style={{ color: '#38bdf8' }}>3 Lines Connected (30/line/day)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#94a3b8' }}>Baileys Session Backup:</span>
                  <span style={{ color: '#38bdf8' }}>Encrypted &amp; Persistent</span>
                </div>
              </div>
            </div>

            {/* Direct-to-OPay Bank Settlement Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid #065f46',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '14px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} />
                <span>100% Direct-to-OPay Settlement</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Bank Name:</span>
                  <strong style={{ color: '#ffffff' }}>OPay Digital Services</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Account Number:</span>
                  <strong style={{ color: '#34d399', fontSize: '15px' }}>7034297995</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Beneficiary Name:</span>
                  <strong style={{ color: '#ffffff' }}>Oyelakin Tosin Matthew</strong>
                </div>
              </div>
            </div>

            {/* Hostinger SMTP Pool Status */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#ffffff' }}>
                Dual-Mailbox Hostinger Pool
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                <div>• Mailbox 1: <code>tosin@bethelmindanalytics.com</code> (300/day cap)</div>
                <div>• Mailbox 2: <code>matthew@bethelmindanalytics.com</code> (300/day cap)</div>
                <div>• Failover: Brevo API v3 (Reserve Tier)</div>
                <div>• Payload size: &lt; 5 KB HTML micro-payloads</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Sticky Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(7, 10, 18, 0.96)',
        borderTop: '1px solid #1e293b',
        backdropFilter: 'blur(16px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        zIndex: 50
      }}>
        <button
          onClick={() => setActiveTab('radar')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: activeTab === 'radar' ? '#38bdf8' : '#64748b',
            cursor: 'pointer'
          }}
        >
          <Radio size={18} />
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'radar' ? 700 : 500 }}>Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('antigravity')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: activeTab === 'antigravity' ? '#a855f7' : '#64748b',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={18} />
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'antigravity' ? 700 : 500 }}>Antigravity</span>
        </button>

        <button
          onClick={() => setActiveTab('closer')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: activeTab === 'closer' ? '#10b981' : '#64748b',
            cursor: 'pointer'
          }}
        >
          <MessageSquare size={18} />
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'closer' ? 700 : 500 }}>Closer</span>
        </button>

        <button
          onClick={() => setActiveTab('engine')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: activeTab === 'engine' ? '#0284c7' : '#64748b',
            cursor: 'pointer'
          }}
        >
          <Sliders size={18} />
          <span style={{ fontSize: '10px', fontWeight: activeTab === 'engine' ? 700 : 500 }}>Engine</span>
        </button>
      </nav>
    </div>
  );
}
