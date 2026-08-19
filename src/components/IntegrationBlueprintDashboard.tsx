'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Code, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Activity, 
  RefreshCw, 
  Send, 
  ShieldAlert, 
  Sliders, 
  FileText,
  Sparkles,
  Layers,
  Globe,
  Radio
} from 'lucide-react';
import SalesIntegrationNarrative from '@/components/SalesIntegrationNarrative';

interface IntegrationHealth {
  name: string;
  category: string;
  status: 'active' | 'warning' | 'idle';
  latency: string;
  eventsCount: number;
}

export default function IntegrationBlueprintDashboard() {
  const [activeTab, setActiveTab] = useState<'embed' | 'health' | 'simulator' | 'narrative'>('embed');
  const [selectedPlatform, setSelectedPlatform] = useState<'wordpress' | 'shopify' | 'webflow' | 'nextjs' | 'html'>('wordpress');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatingEvent, setSimulatingEvent] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    'System ready. Select an event trigger below to run live integration diagnostics.'
  ]);

  const [healthMatrix, setHealthMatrix] = useState<IntegrationHealth[]>([
    { name: 'Meta CAPI (Graph API v19.0)', category: 'Ad Analytics', status: 'active', latency: '42ms', eventsCount: 1420 },
    { name: 'Google Analytics 4 Protocol', category: 'Web Analytics', status: 'active', latency: '38ms', eventsCount: 2850 },
    { name: 'WhatsApp Baileys Service', category: 'Outreach', status: 'active', latency: '120ms', eventsCount: 310 },
    { name: 'Resend Email Gateway', category: 'Nurture Drip', status: 'active', latency: '65ms', eventsCount: 890 },
    { name: 'Zapier / Make Webhooks', category: 'Automation', status: 'active', latency: '88ms', eventsCount: 540 },
    { name: 'Paystack / Stripe Webhook', category: 'Payments', status: 'active', latency: '95ms', eventsCount: 180 }
  ]);

  const platformSnippets = {
    wordpress: `<!-- Bethelmind Analytics WordPress & WooCommerce Embed Code -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
  j.src='https://www.bethelmindanalytics.com/sdk/bethel-integration-sdk.js';
  j.setAttribute('data-site-id','wp_site_master');
  f.parentNode.insertBefore(j,f);
  })(window,document,'script','BethelmindSDK');
</script>`,

    shopify: `<!-- Bethelmind Analytics Shopify Theme Liquid Snippet (paste inside theme.liquid before </head>) -->
<script src="https://www.bethelmindanalytics.com/sdk/bethel-integration-sdk.js"
        data-site-id="shopify_{{ shop.permanent_domain }}"
        data-enable-capi="true"
        async></script>`,

    webflow: `<!-- Bethelmind Analytics Webflow Custom Code (Paste into Project Settings -> Custom Code -> Header) -->
<script src="https://www.bethelmindanalytics.com/sdk/bethel-integration-sdk.js"
        data-site-id="webflow_site_id"
        data-enable-heatmaps="true"
        async></script>`,

    nextjs: `// Next.js App Router (src/app/layout.tsx)
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.bethelmindanalytics.com/sdk/bethel-integration-sdk.js"
          data-site-id="nextjs_client_app"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`,

    html: `<!-- Universal HTML & Static Site Script Tag -->
<script src="https://www.bethelmindanalytics.com/sdk/bethel-integration-sdk.js"
        data-site-id="html_site_client"
        data-api-key="pk_live_bethelmind_universal"
        async></script>`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(platformSnippets[selectedPlatform]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRunSimulation = async (eventType: string) => {
    setSimulatingEvent(true);
    const logTime = new Date().toLocaleTimeString();
    setSimulationLogs(prev => [`[${logTime}] ⏳ Dispatching test payload for "${eventType}"...`, ...prev]);

    try {
      if (eventType === 'sdk_collect') {
        const res = await fetch('/api/tracking/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: 'test_simulation_site',
            eventName: 'lead_form_submit',
            eventData: { email: 'test_prospect@bethelmindanalytics.com', phone: '+2348022791227' }
          })
        });
        const data = await res.json();
        setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ SDK Collector Success! Server Response: ${JSON.stringify(data)}`, ...prev]);
      } else if (eventType === 'meta_capi') {
        const res = await fetch('/api/tracking/capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: 'test_simulation_site',
            eventName: 'Lead',
            userData: { email: 'meta_lead@bethelmindanalytics.com', phone: '+2348022791227' }
          })
        });
        const data = await res.json();
        setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Meta CAPI SHA-256 Event Hashed & Dispatched! Event ID: ${data.eventId}`, ...prev]);
      } else if (eventType === 'webhook_full') {
        const res = await fetch('/api/webhooks/integrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'full_stack_connect',
            lead: { name: 'Bethelmind Simulation Lead', email: 'sim@bethelmindanalytics.com', phone: '+2348022791227' }
          })
        });
        const data = await res.json();
        setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Full-Stack App Connectors Executed (Zapier, HubSpot, WhatsApp, Resend)! Status: ${data.success}`, ...prev]);
      }
    } catch (err: any) {
      setSimulationLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Simulation Error: ${err.message}`, ...prev]);
    } finally {
      setSimulatingEvent(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            Seamless Integration Blueprint Command Center
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Universal Tool Connectors & Sales Narrative Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect platform lead engines, CAPI tracking, WhatsApp, and CRMs to any external website in 60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('narrative')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            View Sales Narrative
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-6xl mx-auto">
        <div className="flex border-b border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-5 py-3 text-xs md:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'embed'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            1-Click Embed Snippets
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-5 py-3 text-xs md:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'health'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            App Health Matrix ({healthMatrix.length})
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-5 py-3 text-xs md:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            Live Event Simulator
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`px-5 py-3 text-xs md:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'narrative'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Sales Narrative Showcase
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: EMBED CODE GENERATOR */}
      {activeTab === 'embed' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Select Client Website CMS / Framework
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose the website technology your prospect or client uses to generate their customized 1-line tracking & automation script.
              </p>
            </div>

            {/* Platform Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'wordpress', label: 'WordPress / Woo', icon: '🌐' },
                { id: 'shopify', label: 'Shopify Store', icon: '🛍️' },
                { id: 'webflow', label: 'Webflow', icon: '🎨' },
                { id: 'nextjs', label: 'Next.js App', icon: '⚡' },
                { id: 'html', label: 'Custom HTML', icon: '📄' }
              ].map((plat) => (
                <button
                  key={plat.id}
                  onClick={() => setSelectedPlatform(plat.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                    selectedPlatform === plat.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30 scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{plat.icon}</span>
                  <span>{plat.label}</span>
                </button>
              ))}
            </div>

            {/* Code Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  Generated {selectedPlatform.toUpperCase()} Script
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied Code!' : 'Copy Code Snippet'}
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-cyan-300 border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {platformSnippets[selectedPlatform]}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: HEALTH MATRIX */}
      {activeTab === 'health' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Live Connected App Status & Health Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time status monitor for Meta CAPI, GA4, WhatsApp, Resend Email, and Zapier Webhooks.
                </p>
              </div>
              <button 
                onClick={() => setHealthMatrix(prev => [...prev])}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Status
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthMatrix.map((app, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400">{app.category}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Operational
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{app.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900 font-mono">
                    <span>Latency: <strong className="text-slate-200">{app.latency}</strong></span>
                    <span>Processed: <strong className="text-slate-200">{app.eventsCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400" />
                Live Integration & Event Dispatch Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Trigger real API calls to test the SDK ingestion endpoint, Meta CAPI SHA-256 hashing, and WhatsApp/Zapier webhooks live.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={simulatingEvent}
                onClick={() => handleRunSimulation('sdk_collect')}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Test SDK Event Collection API
              </button>
              <button
                disabled={simulatingEvent}
                onClick={() => handleRunSimulation('meta_capi')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                Test Meta CAPI SHA-256 Hash
              </button>
              <button
                disabled={simulatingEvent}
                onClick={() => handleRunSimulation('webhook_full')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4" />
                Test Full-Stack Webhooks (Zapier + CRM + WhatsApp)
              </button>
            </div>

            {/* Diagnostics Terminal Output */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Diagnostics Terminal</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 max-h-72 overflow-y-auto">
                {simulationLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SALES NARRATIVE SHOWCASE */}
      {activeTab === 'narrative' && (
        <div className="max-w-6xl mx-auto">
          <SalesIntegrationNarrative clientName="Apex Client" />
        </div>
      )}
    </div>
  );
}
