'use client';

/**
 * @file src/app/admin/mobile/page.tsx
 * 
 * 📱 BETHELMIND LAGOS DESK — COMPLETE MOBILE SMARTPHONE COMMAND CENTER
 * 
 * Synchronized Phone Capacity:
 * 1. Remote Outreach Radar (Emails, Webforms, Scraper & VPS Controls)
 * 2. Inbound WhatsApp Closer Desk (Live chats, AI responses, 1-tap WhatsApp takeover)
 * 3. 1-Tap Lead Claim & Instant Website Generator (Creates /preview/[slug] + pre-filled pitch)
 * 4. Client Onboarding & Custom Domain Binding (.com.ng / .com provisioning)
 * 5. Cognitive AI Sales Assistant Live Test Bench (Test Pidgin, objections & pricing)
 */

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
  Globe,
  PlusCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function MobileAdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<'radar' | 'closer' | 'claim' | 'onboard' | 'ai_tester' | 'hubs'>('radar');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [activeProspects, setActiveProspects] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [provisionedSites, setProvisionedSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Claim Lead Form States
  const [claimName, setClaimName] = useState('');
  const [claimPhone, setClaimPhone] = useState('');
  const [claimCategory, setClaimCategory] = useState('Commercial Business');
  const [claimArea, setClaimArea] = useState('Lagos');
  const [claimResult, setClaimResult] = useState<any>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  // Onboarding Form States
  const [onboardSlug, setOnboardSlug] = useState('');
  const [onboardDomain, setOnboardDomain] = useState('');
  const [onboardPkg, setOnboardPkg] = useState('Starter Official Website (.com.ng)');
  const [onboardLoading, setOnboardLoading] = useState(false);

  // AI Tester States
  const [testPrompt, setTestPrompt] = useState('I already have an Instagram page, why do I need a website?');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // 15s auto-sync

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
        setCrmLeads(data.crmLeads || []);
        setProvisionedSites(data.provisionedSites || []);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert('To install on iOS: Tap Share in Safari -> "Add to Home Screen".\nOn Android: Tap 3 dots in Chrome -> "Install app" or "Add to Home screen".');
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
        setFeedbackMsg(`❌ ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setFeedbackMsg(`❌ Network error: ${err.message}`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimName) return;
    setClaimLoading(true);
    setClaimResult(null);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim_lead_site',
          businessName: claimName,
          phone: claimPhone,
          category: claimCategory,
          area: claimArea
        })
      });
      const data = await res.json();
      if (data.success) {
        setClaimResult(data);
        setFeedbackMsg(`🎉 Generated official website for ${claimName}!`);
        fetchTelemetry();
      } else {
        alert(data.error || 'Error generating site');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardSlug || !onboardDomain) return;
    setOnboardLoading(true);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'onboard_client_domain',
          slug: onboardSlug,
          preferredDomain: onboardDomain,
          selectedPackage: onboardPkg,
          paymentStatus: 'DEPOSIT_CONFIRMED'
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`✅ Bound www.${data.preferredDomain} to ${data.slug}!`);
        setOnboardDomain('');
        fetchTelemetry();
      } else {
        alert(data.error || 'Error binding domain');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleTestAi = async (promptToUse?: string) => {
    const q = promptToUse || testPrompt;
    if (!q) return;
    setTestLoading(true);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_ai_query',
          message: q,
          businessName: 'Apex Commercial Solutions',
          category: 'Solar & Inverter Engineering',
          area: 'Ikeja, Lagos'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResponse(data);
      }
    } catch (err: any) {
      alert('Test error: ' + err.message);
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string = 'Copied') => {
    navigator.clipboard.writeText(text);
    setFeedbackMsg(`📋 ${label} copied to clipboard!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070a12',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '90px'
    }}>
      {/* Mobile Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7, 10, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px'
          }}>
            BM
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#ffffff' }}>Bethelmind Lagos Desk</div>
            <div style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>Line 1 Active · 0802 279 1227</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchTelemetry}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#38bdf8',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
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
            <span>Install Bethelmind App on your phone home screen</span>
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
            Install
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
          textAlign: 'center',
          fontWeight: 600
        }}>
          {feedbackMsg}
        </div>
      )}

      {/* Main Tab Navigation Header */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        background: '#0b1120',
        borderBottom: '1px solid #1e293b',
        padding: '6px 8px',
        gap: '4px'
      }}>
        {[
          { key: 'radar', label: '⚡ Radar', count: `${telemetry?.emails?.sentToday || 0}/600` },
          { key: 'closer', label: '💬 Inbound Closer', count: crmLeads.length },
          { key: 'claim', label: '🌐 Claim Site', count: activeProspects.length },
          { key: 'onboard', label: '🔑 Custom Domain', count: provisionedSites.length },
          { key: 'ai_tester', label: '🧠 AI Brain Test', count: 'Live' },
          { key: 'hubs', label: '🏛️ All Hubs', count: '8 Desks' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: '0 0 auto',
              background: activeTab === tab.key ? '#0284c7' : 'transparent',
              color: activeTab === tab.key ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#1e293b',
              padding: '1px 6px',
              borderRadius: '999px',
              fontSize: '10px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main style={{ padding: '16px' }}>

        {/* ── TAB 1: RADAR & OUTREACH ──────────────────────────────────────── */}
        {activeTab === 'radar' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Daily Quotas</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Live Autonomous Growth Engine</h2>
            </div>

            {/* Quota Progress Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>EMAILS TODAY</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
                  {telemetry?.emails?.sentToday || 0}
                  <span style={{ fontSize: '12px', color: '#64748b' }}>/600</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.emails?.percent || 0}%`, height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>WEBFORMS TODAY</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                  {telemetry?.webforms?.sentToday || 0}
                  <span style={{ fontSize: '12px', color: '#64748b' }}>/300</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.webforms?.percent || 0}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>
            </div>

            {/* Total Leads Pool */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e3a5f',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Verified Scraped Leads in Pool</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {telemetry?.leads?.totalGenuine?.toLocaleString() || '4,518'} Leads
                </div>
              </div>
              <div style={{ background: '#0284c7', color: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                100% Zero-Crypto
              </div>
            </div>

            {/* Remote Command Triggers */}
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚡ 1-Tap Phone Remote Actions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleTriggerAction('trigger_emails_webforms', '600 Emails & Webforms Dispatcher')}
                disabled={triggerLoading === 'trigger_emails_webforms'}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} />
                  <span>Execute Today&apos;s 600 Emails &amp; Webforms</span>
                </div>
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => handleTriggerAction('trigger_vps_scraper', 'Contabo Cloud Scraper Pass')}
                disabled={triggerLoading === 'trigger_vps_scraper'}
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #0369a1)',
                  border: '1px solid #38bdf8',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} color="#38bdf8" />
                  <span>Harvest Leads on Contabo VPS (Cloud Pass)</span>
                </div>
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => handleTriggerAction('trigger_admin_briefing', 'Executive Briefing to WhatsApp')}
                disabled={triggerLoading === 'trigger_admin_briefing'}
                style={{
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} />
                  <span>Send Daily Report to My WhatsApp (0802 279 1227)</span>
                </div>
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => handleTriggerAction('trigger_vps_restart', 'VPS WhatsApp Service Ping')}
                disabled={triggerLoading === 'trigger_vps_restart'}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={16} color="#10b981" />
                  <span>Ping &amp; Verify VPS WhatsApp Line 1</span>
                </div>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: INBOUND CLOSER & LIVE WHATSAPP CHATS ─────────────────── */}
        {activeTab === 'closer' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Synchronized Desk</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Live WhatsApp Inbound Conversations</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Real prospects messaging your WhatsApp lines. Jump in to close with 1 tap.
              </p>
            </div>

            {crmLeads.length === 0 ? (
              <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                No active inbound inquiries logged yet today. When prospects reply to your outreach, their questions and AI replies will appear here in real time!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {crmLeads.map((chat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                          {chat.businessName || `+${chat.sender}`}
                        </div>
                        <div style={{ fontSize: '10px', color: '#38bdf8' }}>
                          📞 +{chat.sender} · {chat.lineLabel || 'WhatsApp Desk'}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '9px',
                        background: chat.intent === 'READY_TO_PAY_INVOICE' ? '#065f46' : '#1e3a5f',
                        color: chat.intent === 'READY_TO_PAY_INVOICE' ? '#34d399' : '#38bdf8',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {chat.intent || 'INQUIRY'}
                      </span>
                    </div>

                    {/* Customer Said */}
                    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#f8fafc' }}>
                      <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>PROSPECT SAID:</div>
                      &quot;{chat.message}&quot;
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`https://wa.me/${chat.sender}?text=${encodeURIComponent(`Good day Boss! Following up from Bethelmind Digital Solutions regarding your official website.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          background: '#10b981',
                          color: '#ffffff',
                          textDecoration: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageSquare size={14} />
                        <span>Chat on WhatsApp</span>
                      </a>

                      {chat.previewUrl && (
                        <a
                          href={chat.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#1e293b',
                            color: '#38bdf8',
                            textDecoration: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Preview
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CLAIM & GENERATE WEBSITE ──────────────────────────────── */}
        {activeTab === 'claim' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Zero-Touch Builder</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Instant Website Generator &amp; Claim</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Enter any Nigerian business to generate their live preview link &amp; WhatsApp pitch in seconds.
              </p>
            </div>

            {/* Quick Generator Form */}
            <form onSubmit={handleClaimSubmit} style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>BUSINESS NAME *</label>
                <input
                  type="text"
                  value={claimName}
                  onChange={e => setClaimName(e.target.value)}
                  placeholder="e.g. Apex Solar Engineering"
                  required
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>WHATSAPP PHONE *</label>
                  <input
                    type="text"
                    value={claimPhone}
                    onChange={e => setClaimPhone(e.target.value)}
                    placeholder="e.g. 08022791227"
                    required
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#ffffff',
                      fontSize: '13px',
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>AREA / CITY</label>
                  <input
                    type="text"
                    value={claimArea}
                    onChange={e => setClaimArea(e.target.value)}
                    placeholder="e.g. Ikeja, Lagos"
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#ffffff',
                      fontSize: '13px',
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>INDUSTRY / SECTOR</label>
                <select
                  value={claimCategory}
                  onChange={e => setClaimCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Solar & Inverter Engineering">Solar &amp; Inverter Engineering</option>
                  <option value="Fashion, Boutique & Retail">Fashion, Boutique &amp; Retail</option>
                  <option value="Beauty, Hair & Spa Salon">Beauty, Hair &amp; Spa Salon</option>
                  <option value="Real Estate & Facility Management">Real Estate &amp; Facility Management</option>
                  <option value="Automotive, Spare Parts & Mechanics">Automotive, Spare Parts &amp; Mechanics</option>
                  <option value="Private School & Education">Private School &amp; Education</option>
                  <option value="Restaurant, Food & Bakery">Restaurant, Food &amp; Bakery</option>
                  <option value="Logistics & Dispatch Aggregator">Logistics &amp; Dispatch</option>
                  <option value="Commercial Business">General Commercial Business</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <PlusCircle size={16} />
                <span>{claimLoading ? 'Generating...' : '⚡ Generate Website & Preview Link'}</span>
              </button>
            </form>

            {/* Claim Result Card */}
            {claimResult && (
              <div style={{
                background: '#022c22',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ color: '#34d399', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                  🎉 WEBSITE GENERATED SUCCESSFULLY!
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '8px' }}>
                  <b>Live Preview URL:</b><br />
                  <a href={claimResult.previewUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                    {claimResult.previewUrl}
                  </a>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href={claimResult.waLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>Send Pre-Filled Pitch on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(claimResult.prefilledWhatsAppPitch, 'Pitch message')}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={13} />
                    <span>Copy Full WhatsApp Pitch Text</span>
                  </button>
                </div>
              </div>
            )}

            {/* Recent Leads Ready to Claim */}
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Recent Leads in Pool (Tap to Pitch)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeProspects.slice(0, 10).map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>{p.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{p.category} · {p.area}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`https://wa.me/${p.phone}?text=${encodeURIComponent(`Good day Boss at *${p.name}*! We already built an official mobile website + 24/7 WhatsApp assistant for *${p.name}* to test free on your phone: ${p.previewUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      Pitch
                    </a>
                    <a
                      href={p.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: CLIENT ONBOARDING & CUSTOM DOMAIN BINDING ─────────────── */}
        {activeTab === 'onboard' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase' }}>Client Handover</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Custom Domain Provisioning</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Bind official .com.ng or .com domain, remove preview banners, and hand over live site.
              </p>
            </div>

            {/* Domain Binding Form */}
            <form onSubmit={handleOnboardSubmit} style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>SELECT PROVISIONED CLIENT</label>
                <select
                  value={onboardSlug}
                  onChange={e => setOnboardSlug(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose client site slug --</option>
                  {provisionedSites.map(s => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} ({s.slug})
                    </option>
                  ))}
                  {activeProspects.map(p => (
                    <option key={p.slug} value={p.slug}>
                      [Prospect] {p.name} ({p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>OFFICIAL CUSTOM DOMAIN NAME *</label>
                <input
                  type="text"
                  value={onboardDomain}
                  onChange={e => setOnboardDomain(e.target.value)}
                  placeholder="e.g. apexsolar.com.ng"
                  required
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>SELECTED PACKAGE</label>
                <select
                  value={onboardPkg}
                  onChange={e => setOnboardPkg(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Starter Official Website (.com.ng)">Option 1: Starter Official .COM.NG (₦65,000 Total)</option>
                  <option value="Corporate Growth Suite (.com)">Option 2: Corporate .COM + Staff Emails (₦120,000 Total)</option>
                  <option value="Pay-Small-Small Monthly">Option 3: Pay-Small-Small Monthly (₦25,000/mo)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={onboardLoading}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Globe size={16} />
                <span>{onboardLoading ? 'Binding...' : '🔗 Bind Domain & Set Live'}</span>
              </button>
            </form>

            {/* List of Provisioned Sites */}
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Active Client Sites on Server ({provisionedSites.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {provisionedSites.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>{s.name}</div>
                      <div style={{ fontSize: '10px', color: '#38bdf8' }}>
                        {s.preferredDomain ? `www.${s.preferredDomain}` : `bethelmindanalytics.com/sites/${s.slug}`}
                      </div>
                    </div>
                    <span style={{ fontSize: '9px', background: '#064e3b', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      LIVE
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <a
                      href={s.liveSiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        background: '#1e293b',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        textAlign: 'center',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      Visit Live Site
                    </a>
                    <a
                      href={s.handoverUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        background: '#334155',
                        color: '#ffffff',
                        textDecoration: 'none',
                        textAlign: 'center',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      Handover Portal
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: AI COGNITIVE BRAIN & LIVE TEST BENCH ──────────────────── */}
        {activeTab === 'ai_tester' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Closer Brain</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Cognitive AI Sales Assistant Simulator</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Test any question (Nigerian Pidgin, Instagram objection, scam doubts, pricing) and see instant AI reasoning.
              </p>
            </div>

            {/* Quick Test Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
              {[
                'Why website if I have Instagram?',
                'Can I pay small small monthly?',
                'Na scam? How I go trust una?',
                'How long to go live?',
                'I sell solar and inverters',
                'Send account make I pay'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTestPrompt(chip);
                    handleTestAi(chip);
                  }}
                  style={{
                    flex: '0 0 auto',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#38bdf8',
                    borderRadius: '20px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Test Input Area */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                placeholder="Ask anything as a Nigerian business owner..."
                style={{
                  flex: 1,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={() => handleTestAi()}
                disabled={testLoading}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 16px',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {testLoading ? '...' : 'Ask'}
              </button>
            </div>

            {/* AI Test Response Box */}
            {testResponse && (
              <div style={{
                background: '#0f172a',
                border: '1px solid #10b981',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={16} color="#10b981" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#34d399' }}>AI COGNITIVE DECISION</span>
                  </div>
                  <span style={{ fontSize: '10px', background: '#065f46', color: '#6ee7b7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {testResponse.intent}
                  </span>
                </div>

                <div style={{
                  background: '#022c22',
                  border: '1px solid #065f46',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {testResponse.replyText}
                </div>
              </div>
            )}

            {/* Bank Info Card */}
            <div style={{
              marginTop: '16px',
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>🏛️ CAC Certified Settlement Account:</div>
              Moniepoint Microfinance Bank · <b>6805375225</b> · Bethelmind Digital Solutions
            </div>
          </div>
        )}

        {/* ── TAB 6: ALL ADMIN HUBS DIRECTORY ────────────────────────── */}
        {activeTab === 'hubs' && (
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
                🏛️ Complete Platform Admin Portals
              </h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                Every single management desk is accessible right here on your phone with full super-admin powers.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { title: 'Multi-Engine Lead CRM Hub', desc: 'Search, filter, view details & export all scraped Nigerian businesses', path: '/admin/crm', tag: 'Core CRM' },
                { title: 'Solar Scraper & Pipeline', desc: 'Manage solar installers, battery quotes, load sheets & BOQ requests', path: '/admin/solar-pipeline', tag: 'High-Ticket' },
                { title: 'AI Approvals & Outbox', desc: 'Review scheduled outreach dispatches, approve emails, webforms & SMS', path: '/admin/approvals', tag: 'Outreach' },
                { title: 'Customer AI Agent Studio', desc: 'Fine-tune 24/7 WhatsApp AI Closer prompts, responses & objection rules', path: '/admin/ai-agent', tag: 'AI Closer' },
                { title: 'Traffic & Viral Authority Portal', desc: 'Monitor organic search traffic, blog articles & diaspora tools', path: '/admin/authority-portal', tag: 'Traffic' },
                { title: 'Software & Site Handover Studio', desc: 'Generate official client credentials, login packs & handover PDFs', path: '/admin/handover', tag: 'Client Delivery' },
                { title: 'Settings & Cloud Integrations', desc: 'Check Hostinger SMTP, Brevo, Termii SMS, Moniepoint & Evolution API', path: '/admin/settings', tag: 'Config' },
                { title: 'Full Desktop Executive Console', desc: 'Switch to the wide-screen desktop view with comprehensive chart analytics', path: '/admin', tag: 'Master View' }
              ].map(portal => (
                <a
                  key={portal.path}
                  href={`/api/admin/login?token=bethelmind_admin_2026&redirect=${encodeURIComponent(portal.path)}`}
                  style={{
                    display: 'block',
                    background: '#0b1120',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '14px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>{portal.title}</span>
                    <span style={{ fontSize: '9px', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>{portal.tag}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px', lineHeight: '1.4' }}>{portal.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#10b981' }}>
                    <span>Open Portal</span>
                    <ArrowUpRight size={12} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(7, 10, 18, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        padding: '8px 2px 12px 2px',
        zIndex: 100
      }}>
        {[
          { key: 'radar', label: 'Radar', icon: Zap },
          { key: 'closer', label: 'Closer', icon: MessageSquare },
          { key: 'claim', label: 'Claim', icon: PlusCircle },
          { key: 'onboard', label: 'Domains', icon: Globe },
          { key: 'ai_tester', label: 'AI Test', icon: Bot },
          { key: 'hubs', label: 'All Hubs', icon: Layers }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#38bdf8' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 800 : 600 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
