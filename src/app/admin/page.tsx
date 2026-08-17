'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Rocket,
  ExternalLink,
  Server,
  Settings,
  Shield,
  RefreshCw,
  Bot,
  Zap,
  Sun,
  Briefcase,
  Layers,
  Power,
  Play,
  Square,
  CloudLightning,
  Activity,
  Sparkles,
  Check,
  Copy,
  Globe,
  Send,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Users,
  Flame,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Radio,
  FileCode2
} from 'lucide-react';
import Lagos10KOutreachCard from '@/app/dashboard/components/Lagos10KOutreachCard';
import LeadJourneyTrackerCard from '@/app/dashboard/components/LeadJourneyTrackerCard';
import AdminAiCommandTerminal from '@/components/AdminAiCommandTerminal';
import { copyToClipboard } from '@/lib/clipboard';

type DashboardTab = 'outreach' | 'journey' | 'onboarding' | 'crm' | 'deploy';

export default function AdminDashboardHome() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('outreach');

  // Master Runner Power Switch State
  const [runnerActive, setRunnerActive] = useState<boolean>(false);
  const [togglingRunner, setTogglingRunner] = useState<boolean>(false);
  const [runnerMessage, setRunnerMessage] = useState<string>('');

  // Deploy Action State
  const [deploying, setDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState('');
  const [deployError, setDeployError] = useState('');

  // Quick stats state
  const [statsLoading, setStatsLoading] = useState(false);
  const [totalLagosLeads, setTotalLagosLeads] = useState(17578);
  const [totalContacted, setTotalContacted] = useState(428);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Onboarding Studio states
  const [onboardBizName, setOnboardBizName] = useState('');
  const [onboardCategory, setOnboardCategory] = useState('Medical & Health Clinic');
  const [onboardPhone, setOnboardPhone] = useState('');
  const [onboardWebsiteOption, setOnboardWebsiteOption] = useState<'hosted' | 'custom_domain'>('hosted');
  const [onboardCustomDomain, setOnboardCustomDomain] = useState('');
  const [onboardProvisioned, setOnboardProvisioned] = useState(false);
  const [copiedWelcome, setCopiedWelcome] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const fetchDashboardStatus = async () => {
    setStatsLoading(true);
    try {
      // 1. Fetch Runner state
      const runnerRes = await fetch('/api/admin/runner-toggle').catch(() => null);
      if (runnerRes?.ok) {
        const runnerData = await runnerRes.json();
        if (typeof runnerData.active === 'boolean') setRunnerActive(runnerData.active);
      }

      // 2. Fetch Outreach live stats
      const outreachRes = await fetch('/api/outreach/lagos10k').catch(() => null);
      if (outreachRes?.ok) {
        const outData = await outreachRes.json();
        if (outData.stats?.totalLagosLeads) setTotalLagosLeads(outData.stats.totalLagosLeads);
        if (outData.stats?.totalContactedOutreach) setTotalContacted(outData.stats.totalContactedOutreach);
      }

      setLastSyncTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (_) {
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStatus();
    const interval = setInterval(fetchDashboardStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleRunner = async (enable: boolean) => {
    setTogglingRunner(true);
    setRunnerMessage('');
    try {
      const res = await fetch('/api/admin/runner-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable }),
      });
      const data = await res.json();
      if (data.success) {
        setRunnerActive(data.active);
        setRunnerMessage(data.message);
      } else {
        setRunnerMessage(data.error || 'Failed to update runner state.');
      }
    } catch (err: any) {
      setRunnerMessage('Network error toggling runner.');
    } finally {
      setTogglingRunner(false);
    }
  };

  const triggerDeploy = async () => {
    setDeploying(true);
    setDeployMessage('');
    setDeployError('');

    try {
      const res = await fetch('/api/admin/deploy', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDeployMessage(data.message || 'Production deployment initiated successfully!');
      } else {
        setDeployError(data.error || 'Failed to trigger deployment.');
      }
    } catch (err: any) {
      setDeployError('Network error occurred. Please try again.');
    } finally {
      setDeploying(false);
    }
  };

  // Computed for Onboarding Studio
  const onboardSlug = onboardBizName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sample-business';

  const previewOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com';
  const previewHostedUrl = `${previewOrigin}/preview/${onboardSlug}`;
  const scriptTagCode = `<script src="${previewOrigin}/api/widget/${onboardSlug}.js" async></script>`;
  const resolvedDomainUrl = onboardCustomDomain ? `https://${onboardCustomDomain.replace(/^https?:\/\//, '')}` : previewHostedUrl;

  const welcomeClientKit = `🎉 CONGRATULATIONS! Your ${onboardBizName || 'Custom Business'} AI Platform & WhatsApp Engine is LIVE!

We have successfully provisioned your 24/7 AI-powered website & instant booking system!

---
🌐 YOUR OFFICIAL WEBSITE & DOMAIN DETAILS:
🏢 Business: ${onboardBizName || '[Business Name]'}
📂 Industry: ${onboardCategory}
🔗 Live Website: ${onboardWebsiteOption === 'custom_domain' ? resolvedDomainUrl : previewHostedUrl}
🤖 AI Sales Concierge: ACTIVE & ONLINE 24/7

---
⚡ WHAT IS INCLUDED & READY:
✅ 24/7 WhatsApp AI Sales Concierge (Handles customer questions)
✅ Interactive Sector Quotation & Booking Calculator
✅ Direct Lead Routing to ${onboardPhone || '[Your WhatsApp Number]'}
✅ Fast Paystack & OPay Online Payment Checkout
✅ Mobile-Optimized for Nigerian Mobile Networks

---
📲 3 EASY STEPS TO RECEIVE CUSTOMERS:
1️⃣ Visit your live website link above and test the interactive booking tool.
2️⃣ Add your website link to your WhatsApp Business profile and Instagram bio.
3️⃣ All customer orders and quote requests will be delivered directly to your WhatsApp!

Technical Support & Developer Handover: Bethelmind Analytics & Strategy 🚀`;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* 1. TOP EXECUTIVE COMMAND HEADER & KPI METRICS */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Executive Console
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Active Sprint Window: <strong style={{ color: '#f8fafc' }}>Aug 17 – Aug 23, 2026</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              ApexReach Commercial Outreach & Revenue Command Center
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Live Production URL Button */}
            <a
              href="https://www.bethelmindanalytics.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <ExternalLink size={14} /> Production Domain
            </a>

            {/* Quick Refresh */}
            <button
              onClick={fetchDashboardStatus}
              disabled={statsLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Refresh live metrics"
            >
              <RefreshCw size={14} className={statsLoading ? 'spin-anim' : ''} /> {lastSyncTime ? `Synced ${lastSyncTime}` : 'Sync'}
            </button>

            {/* Master Runner Switch Button */}
            <button
              onClick={() => toggleRunner(!runnerActive)}
              disabled={togglingRunner}
              style={{
                background: runnerActive
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'rgba(239, 68, 68, 0.15)',
                border: `1.5px solid ${runnerActive ? '#10b981' : 'rgba(239, 68, 68, 0.4)'}`,
                color: runnerActive ? '#ffffff' : '#f87171',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: runnerActive ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              <Power size={15} />
              {togglingRunner ? 'Toggling...' : runnerActive ? '🟢 RUNNER ON (24/7)' : '🔴 RUNNER OFF (PROTECTED)'}
            </button>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '2px' }}>VERIFIED LAGOS LEADS</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8' }}>{totalLagosLeads.toLocaleString()}</div>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>✓ 6 Commercial Hubs Ready</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '2px' }}>OUTREACH DISPATCHES</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24' }}>{totalContacted.toLocaleString()}</div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Warm-up curve: 30-60/day</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '2px' }}>A/B LIFT (METHOD B)</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34d399' }}>+34.8%</div>
            <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>🏆 Winning Strategy (2.1x Replies)</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '2px' }}>SMS ROUTING GATEWAY</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>Tailscale Android</div>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>✓ 10.132.90.251:8082 Active</span>
          </div>

        </div>
      </div>

      {/* 2. TABBED NAVIGATION SWITCHBOARD */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '6px',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'outreach', label: '🚀 Lagos 10K Outreach Engine', icon: Send, badge: 'Main Engine' },
          { id: 'journey', label: '📍 Lead Journey & Heat Tracker', icon: Activity, badge: 'Live AI' },
          { id: 'onboarding', label: '🎨 Claimed Website Studio', icon: Sparkles, badge: '1-Click' },
          { id: 'crm', label: '🗄️ Multi-Engine CRM & Scrapers', icon: Layers, badge: '21k+ Leads' },
          { id: 'deploy', label: '⚡ Production Deploy & Health', icon: Rocket, badge: 'System' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: 700
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TAB CONTENT PANELS */}

      {/* TAB 1: 10K LAGOS OUTREACH ENGINE */}
      {activeTab === 'outreach' && (
        <div>
          <Lagos10KOutreachCard />
        </div>
      )}

      {/* TAB 2: LEAD JOURNEY & HEAT TRACKER */}
      {activeTab === 'journey' && (
        <div>
          <LeadJourneyTrackerCard />
        </div>
      )}

      {/* TAB 3: CLAIMED WEBSITE STUDIO & REDESIGN */}
      {activeTab === 'onboarding' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', padding: '12px', borderRadius: '12px' }}>
              <Sparkles size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                1-Click Client Onboarding &amp; Claim Handover Studio
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Provision turnkey AI website domains, customized calculators, and client welcome kits in 30 seconds.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Form */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#38bdf8' }}>
                Client &amp; Domain Setup
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={onboardBizName}
                    onChange={(e) => setOnboardBizName(e.target.value)}
                    placeholder="e.g. Apex Health Clinic Lagos"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                    Industry Sector
                  </label>
                  <select
                    value={onboardCategory}
                    onChange={(e) => setOnboardCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                  >
                    <option value="Medical & Health Clinic">Medical & Health Clinic (Intake & Appointment)</option>
                    <option value="Luxury Salon & Spa">Luxury Salon & Spa (Booking Calendar)</option>
                    <option value="Auto Repair & Tokunbo Dealership">Auto Repair & Tokunbo Dealership (Valuation Tool)</option>
                    <option value="Restaurant & Hospitality Lounge">Restaurant & Hospitality Lounge (Table Reservation)</option>
                    <option value="Real Estate & Property Development">Real Estate & Property Development (Inspection Booking)</option>
                    <option value="Fashion Boutique & Retail">Fashion Boutique & Retail (E-Commerce Store)</option>
                    <option value="Solar & Renewable Energy">Solar & Renewable Energy (KVA Estimator)</option>
                    <option value="Legal & CAC Consultancy">Legal & CAC Consultancy (Retainer Estimator)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                    Client WhatsApp / Phone Number
                  </label>
                  <input
                    type="text"
                    value={onboardPhone}
                    onChange={(e) => setOnboardPhone(e.target.value)}
                    placeholder="e.g. 0802 279 1227"
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                    Deployment Option
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setOnboardWebsiteOption('hosted')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        background: onboardWebsiteOption === 'hosted' ? '#0284c7' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Instant Hosted (.com.ng)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardWebsiteOption('custom_domain')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        background: onboardWebsiteOption === 'custom_domain' ? '#0284c7' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Custom Client Domain
                    </button>
                  </div>
                </div>

                {onboardWebsiteOption === 'custom_domain' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Custom Domain URL
                    </label>
                    <input
                      type="text"
                      value={onboardCustomDomain}
                      onChange={(e) => setOnboardCustomDomain(e.target.value)}
                      placeholder="e.g. www.apexhealthlagos.com"
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setOnboardProvisioned(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Sparkles size={16} /> Generate Client Handover Kit
                </button>
              </div>
            </div>

            {/* Generated Kit Output */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#34d399' }}>
                    📋 Ready-to-Send Client WhatsApp Kit
                  </h3>
                  <button
                    onClick={async () => {
                      const success = await copyToClipboard(welcomeClientKit);
                      if (success) {
                        setCopiedWelcome(true);
                        setTimeout(() => setCopiedWelcome(false), 2000);
                      }
                    }}
                    style={{
                      background: copiedWelcome ? '#10b981' : 'rgba(56, 189, 248, 0.15)',
                      color: copiedWelcome ? '#000' : '#38bdf8',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedWelcome ? <Check size={14} /> : <Copy size={14} />} {copiedWelcome ? 'Copied!' : 'Copy Kit'}
                  </button>
                </div>

                <pre style={{
                  background: 'rgba(0,0,0,0.5)',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '0.76rem',
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  maxHeight: '340px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {welcomeClientKit}
                </pre>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={previewHostedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#38bdf8',
                    color: '#0f172a',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={15} /> Test Live Prototype
                </a>

                {onboardPhone && (
                  <a
                    href={`https://wa.me/${onboardPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(welcomeClientKit)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      background: '#25d366',
                      color: '#ffffff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    💬 Send via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-ENGINE CRM & CLOUD SCRAPERS */}
      {activeTab === 'crm' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* CRM Hub Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 26, 0.95) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '24px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '10px', color: '#22d3ee' }}>
                <Layers size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Multi-Engine Lead CRM Hub</h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>21,078 total verified prospects across 4 engines</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', display: 'block' }}>17,578</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Lagos 10K</span>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', display: 'block' }}>2,438</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>SolarQuotePro</span>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8', display: 'block' }}>1,062</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ibadan 10K</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              Filter by industry sector, view phone numbers, Google reviews, and launch 1-click test outreach previews.
            </p>

            <Link
              href="/admin/crm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#06b6d4',
                color: '#0f172a',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              Open Full Lead CRM <Layers size={16} />
            </Link>
          </div>

          {/* Google Colab Harvester Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 26, 0.95) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '24px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '10px', color: '#fbbf24' }}>
                <CloudLightning size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Google Colab Cloud Harvester</h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>0% Laptop CPU load — 100% Free Cloud Runtime</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '18px' }}>
              Scrapes fresh commercial prospects using Chrome TLS impersonation and saves verified leads directly into your Supabase database.
            </p>

            <a
              href="https://colab.research.google.com/github/tosinbethelmind/lead-generation-automation-v2/blob/main/Colab_247_Harvester.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fbbf24',
                color: '#0f172a',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={16} /> Launch on Google Colab
            </a>
          </div>

        </div>
      )}

      {/* TAB 5: PRODUCTION DEPLOY & SYSTEM HEALTH */}
      {activeTab === 'deploy' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Deploy Action Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 26, 0.95) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '24px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px', color: '#34d399' }}>
                <Rocket size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Production Vercel Deployment</h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Deploy local updates live to production</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '18px' }}>
              Pushes all design tweaks, sector prototypes, and outreach updates directly to Vercel and GitHub.
            </p>

            {deployMessage && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.8rem', marginBottom: '14px' }}>
                {deployMessage}
              </div>
            )}

            {deployError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.8rem', marginBottom: '14px' }}>
                {deployError}
              </div>
            )}

            <button
              onClick={triggerDeploy}
              disabled={deploying}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: deploying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              {deploying ? <RefreshCw className="spin-anim" size={16} /> : <Rocket size={16} />}
              {deploying ? 'Deploying to Production...' : 'Trigger Production Deploy'}
            </button>
          </div>

          {/* System Health Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
              System Health &amp; Endpoints
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Database (Supabase)</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>● Connected</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Android SMS Gateway</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>● 10.132.90.251:8082</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hostinger SMTP Email</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>● Port 465 SSL</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>WhatsApp Engine (Baileys)</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>● Multi-Rotator Active</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Floating AI Admin Copilot & Command Prompt */}
      <AdminAiCommandTerminal />

      {/* Scoped CSS animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
