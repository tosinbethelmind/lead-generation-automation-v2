'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Globe, 
  Share2, 
  MessageSquare, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Database,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ToolNode {
  id: string;
  name: string;
  category: 'Website' | 'Analytics' | 'Automation' | 'CRM' | 'Messaging' | 'Payments';
  icon: string;
  badge: string;
  description: string;
  setupTime: string;
}

const SUPPORTED_TOOLS: ToolNode[] = [
  {
    id: 'wordpress',
    name: 'WordPress / WooCommerce',
    category: 'Website',
    icon: '🌐',
    badge: '1-Click Plugin / Script',
    description: 'Auto-embeds tracking pixels, rage click detection, and live lead capture directly on any WP page or store.',
    setupTime: '< 60 Sec'
  },
  {
    id: 'shopify',
    name: 'Shopify & Webflow',
    category: 'Website',
    icon: '🛍️',
    badge: 'Theme App Extension',
    description: 'Seamless integration into checkout flows, landing pages, and product pages without slowing down load time.',
    setupTime: '< 60 Sec'
  },
  {
    id: 'meta_capi',
    name: 'Meta CAPI & Pixel',
    category: 'Analytics',
    icon: '♾️',
    badge: 'Dual Server-Side Proxy',
    description: 'Recovers 30%+ lost conversion data caused by iOS 14+ ad-blockers using SHA-256 deduplicated server events.',
    setupTime: 'Instant'
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    category: 'Analytics',
    icon: '📈',
    badge: 'Measurement Protocol',
    description: 'Server-to-server event dispatching for crystal-clear funnel tracking, scroll depth, and revenue attribution.',
    setupTime: 'Instant'
  },
  {
    id: 'zapier',
    name: 'Zapier & Make.com',
    category: 'Automation',
    icon: '⚡',
    badge: 'Bi-Directional Webhooks',
    description: 'Trigger 6,000+ app workflows automatically whenever a visitor fills out a form or requests a site claim.',
    setupTime: '< 2 Mins'
  },
  {
    id: 'hubspot',
    name: 'HubSpot & Salesforce',
    category: 'CRM',
    icon: '🎯',
    badge: 'Native CRM Sync',
    description: 'Auto-creates contacts, updates deal pipelines, and attaches full customer journey heatmaps directly to CRM records.',
    setupTime: 'Instant'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Automation',
    category: 'Messaging',
    icon: '💬',
    badge: 'Baileys / Twilio API',
    description: 'Fires instant personalized WhatsApp greetings and PDF website previews to leads the exact second they opt in.',
    setupTime: 'Automated'
  },
  {
    id: 'resend',
    name: 'Resend & Nodemailer',
    category: 'Messaging',
    icon: '📧',
    badge: 'Smart Email Drip Engine',
    description: 'Dispatches high-deliverability email sequences, interactive proposals, and invoice receipts with open/click tracking.',
    setupTime: 'Automated'
  },
  {
    id: 'paystack',
    name: 'Paystack, Stripe & OPay',
    category: 'Payments',
    icon: '💳',
    badge: 'Instant Checkout Modal',
    description: 'Accept credit card, bank transfer, and USSD payments instantly for site claim purchases and monthly retainers.',
    setupTime: 'Instant'
  }
];

export default function SalesIntegrationNarrative({ clientName = 'Your Business' }: { clientName?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolNode>(SUPPORTED_TOOLS[0]);

  const categories = ['All', 'Website', 'Analytics', 'Automation', 'CRM', 'Messaging', 'Payments'];

  const sampleEmbedScript = `<script src="https://apexreach-leads.vercel.app/sdk/apex-integration-sdk.js" data-site-id="client_${clientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}" async></script>`;

  const filteredTools = selectedCategory === 'All' 
    ? SUPPORTED_TOOLS 
    : SUPPORTED_TOOLS.filter(t => t.category === selectedCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleEmbedScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <section className="w-full bg-slate-950 text-white py-16 px-4 md:px-8 border-y border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Section Header with High-Converting Sales Narrative */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Universal Sales Narrative Guarantee
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            Seamless 1-Click Integration With Every Tool You Already Use
          </h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            No need to throw away your existing stack or spend $15,000+ on custom software developers. Our platform connects smoothly into your website, ad trackers, CRM, and communication tools in <span className="text-cyan-400 font-semibold underline underline-offset-4 decoration-cyan-500/50">under 60 seconds</span>.
          </p>
        </div>

        {/* Interactive Visual Integration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Category Filter & Tool Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTools.map((tool) => {
                const isSelected = activeTool.id === tool.id;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setActiveTool(tool)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-tight">{tool.name}</h4>
                          <span className="text-[10px] text-cyan-400 font-mono">{tool.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-mono">
                        {tool.setupTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-normal">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Tool Deep-Dive + Live Embed Snippet (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeTool.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeTool.name}</h3>
                  <span className="text-xs text-cyan-400 font-medium">{activeTool.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified 100% Compatible
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                How It Works For {clientName}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {activeTool.description}
              </p>
            </div>

            {/* Live 1-Line Embed Code Generator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Universal HTML / JS Snippet
                </span>
                <span className="text-cyan-400 text-[11px]">Copy & Paste into &lt;head&gt;</span>
              </div>
              <div className="relative group">
                <pre className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap break-all leading-relaxed">
                  {sampleEmbedScript}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sales Narrative Trust Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero website redesign required — works alongside existing themes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dual Server-Side CAPI tracking bypasses ad-blockers & Safari ITP</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ultra-fast 4KB asynchronous script (0ms impact on Google PageSpeed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI & Cost Savings Comparison Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              Why Clients Choose Our Seamless Integration Blueprint
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl">
              Traditional web agencies charge <span className="text-red-400 font-semibold">$10,000 - $25,000</span> and take 3 months to build custom tracking & CRM webhooks. With our platform, you gain instant multi-tool harmony on day one.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Custom Engineering</span>
              <span className="text-lg font-bold text-red-400 font-mono">$15,000+</span>
            </div>
            <span className="text-slate-500 font-bold">vs</span>
            <div className="text-center px-4 py-2 bg-cyan-950/90 rounded-xl border border-cyan-500/40">
              <span className="text-xs text-cyan-300 block">Our Platform</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">0 Friction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
