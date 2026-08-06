'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Star, Crown, Rocket, CheckCircle, ArrowRight, Shield, Globe,
  Users, TrendingUp, Brain, Phone, MessageSquare, Target, BarChart3,
  ChevronDown, ChevronUp, Sparkles, Play, ExternalLink, Clock
} from 'lucide-react';

// ─── Pricing Data ──────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'starter',
    name: 'Express Starter',
    badge: 'Starter',
    icon: Zap,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    oneTimeNGN: 75000,
    monthlyNGN: 15000,
    originalOneTimeNGN: 150000,
    tagline: 'WhatsApp Catalog + AI Autoresponder',
    description: 'Perfect for small businesses, vendors, and artisans ready to automate customer replies.',
    highlights: [
      '⚡ Instant Launch (0 technical setup)',
      '📲 WhatsApp Catalog & Checkout Builder',
      '500 Verified Lagos B2B Contacts Export',
      '🤖 AI Customer Assistant Widget',
      '🌐 Free Subdomain (yourname.apexreach.site)',
    ],
    features: {
      lead_harvester: false,
      ai_customer_agent: true,
      whatsapp_voice_notes: false,
      ai_voice_caller: false,
      solar_pipeline: false,
      recruitment_engine: false,
    },
    popular: false,
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Business Growth Pro',
    badge: 'Most Popular (70% Choice)',
    icon: Star,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    oneTimeNGN: 185000,
    monthlyNGN: 35000,
    originalOneTimeNGN: 370000,
    tagline: 'Lead Harvester + AI Agent + Voice Notes',
    description: 'The complete AI-powered lead generation and outreach stack for serious Lagos businesses.',
    highlights: [
      '🎯 10K Lagos B2B Lead Harvester (27 Districts)',
      '🤖 24/7 Customer AI Agent (Human-level)',
      '🎙️ Nigerian Accent WhatsApp Voice Notes (en-NG)',
      '⚙️ Admin Control Panel + Approval Center',
      '🏦 Moniepoint Virtual Account Transfer Box',
      '🌐 Custom .com.ng Domain (Year 1)',
    ],
    features: {
      lead_harvester: true,
      ai_customer_agent: true,
      whatsapp_voice_notes: true,
      ai_voice_caller: false,
      solar_pipeline: true,
      recruitment_engine: false,
    },
    popular: true,
    cta: 'Start Growing',
  },
  {
    id: 'vip',
    name: 'VIP AI Sales Suite',
    badge: '100% Hands-Free AI',
    icon: Crown,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    oneTimeNGN: 480000,
    monthlyNGN: 75000,
    originalOneTimeNGN: 950000,
    tagline: 'AI Voice Caller + Full Outreach Automation',
    description: 'Fully automated AI sales engine — calls leads, sends WhatsApp, and converts at scale.',
    highlights: [
      '📞 AI Voice Caller (Auto-dials leads)',
      '🎯 Unlimited Lead Harvesting',
      '🤖 Advanced AI Agent + Human Escalation',
      '📊 Revenue Analytics Dashboard',
      '⚙️ Full API Access & Webhooks',
      '☀️ Solar Quote Pro + Sector Calculators',
    ],
    features: {
      lead_harvester: true,
      ai_customer_agent: true,
      whatsapp_voice_notes: true,
      ai_voice_caller: true,
      solar_pipeline: true,
      recruitment_engine: false,
    },
    popular: false,
    cta: 'Go VIP',
  },
  {
    id: 'luxury',
    name: 'Luxury Enterprise',
    badge: 'Complete AI Empire',
    icon: Rocket,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    oneTimeNGN: 1200000,
    monthlyNGN: 150000,
    originalOneTimeNGN: 2400000,
    tagline: 'Everything + Recruitment Engine + White Label',
    description: 'The full empire — every tool, white-label branding, recruitment automation, and priority support.',
    highlights: [
      '👥 Full Recruitment Engine (Auto CV screening)',
      '♾️ Unlimited Everything',
      '🏷️ White-Label Branding Option',
      '🛡️ Priority 24/7 Support',
      '📱 Multi-WhatsApp Rotation (Up to 5 Lines)',
      '🎯 Dedicated Account Manager',
    ],
    features: {
      lead_harvester: true,
      ai_customer_agent: true,
      whatsapp_voice_notes: true,
      ai_voice_caller: true,
      solar_pipeline: true,
      recruitment_engine: true,
    },
    popular: false,
    cta: 'Go Enterprise',
  },
];

const TOOLS = [
  { icon: Target, label: '10K Lagos B2B Lead Harvester', desc: 'Scrapes 27 Lagos districts with verified phone numbers & WhatsApp contacts', color: '#06b6d4' },
  { icon: Brain, label: '24/7 Customer AI Agent', desc: 'Human-level AI that handles enquiries, closes sales, and escalates critical deals', color: '#8b5cf6' },
  { icon: MessageSquare, label: 'WhatsApp Voice Note Generator', desc: 'Nigerian accent (en-NG) voice notes sent automatically for warmer outreach', color: '#10b981' },
  { icon: Phone, label: 'AI Voice Caller', desc: 'Auto-dials your lead list with personalized AI pitches, 24/7', color: '#f59e0b' },
  { icon: TrendingUp, label: 'Solar Quote Pro Pipeline', desc: 'Full solar BOQ calculator, automated quote delivery & follow-up system', color: '#f97316' },
  { icon: Users, label: 'Recruitment Engine', desc: 'Post jobs, auto-screen CVs, and WhatsApp shortlisted candidates instantly', color: '#ec4899' },
  { icon: BarChart3, label: 'Revenue Analytics', desc: 'Real-time revenue attribution, lead journey tracking, and conversion heatmaps', color: '#06b6d4' },
  { icon: Globe, label: 'AI Website Builder', desc: 'Industry-specific websites built and deployed in seconds with AI', color: '#8b5cf6' },
];

const FAQS = [
  { q: 'How fast is setup?', a: 'Your platform is live within 30 minutes of payment. We send your login credentials to your email and WhatsApp immediately.' },
  { q: 'Is my data safe?', a: 'Each client gets a completely isolated tenant with their own data partition. No other client can access your leads, AI agent settings, or chat history.' },
  { q: 'Can I try before buying?', a: 'Yes — we offer a free demo session where we show you the platform live with real Lagos leads. Book via WhatsApp.' },
  { q: 'What payment methods do you accept?', a: 'We accept Paystack (card & bank transfer), OPay bank transfer, and Moniepoint. All payments are secured and receipted.' },
  { q: 'What\'s the difference between Standalone and Subscription?', a: 'Standalone is a one-time setup fee with no monthly charge — your platform runs for life. Subscription is a lower upfront cost with a monthly renewal fee for continued access to live data syncs, AI model updates, and hosting.' },
  { q: 'Can I upgrade my plan later?', a: 'Yes, you can upgrade anytime. We prorate the difference and unlock new features instantly.' },
  { q: 'Do you work with businesses outside Lagos?', a: 'Yes — while our lead database specialises in Lagos, the AI agent, WhatsApp tools, and website builder work for any Nigerian business. We are expanding to Abuja and Port Harcourt.' },
];

// ─── Live stats counter ───────────────────────────────────────────────────────

function useLiveStats() {
  const [stats, setStats] = useState({ leads: 17116, clients: 38, outreach: 94250 });
  useEffect(() => {
    fetch('/api/leads?count=true').then(r => r.json()).then(d => {
      if (d.count) setStats(s => ({ ...s, leads: d.count }));
    }).catch(() => {});
  }, []);
  return stats;
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [planType, setPlanType] = useState<'subscription' | 'standalone'>('subscription');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stats] = useState({ leads: 17116, clients: 38, outreach: 94250 });
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const formatNGN = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ApexReach</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: -2 }}>AI Lead Platform</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={scrollToPricing} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Pricing</button>
          <a href="#tools" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Tools</a>
          <a href="/admin" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Admin Login</a>
          <button onClick={scrollToPricing} style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', padding: '120px 40px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
          <Sparkles style={{ width: 14, height: 14, color: '#06b6d4' }} />
          <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600 }}>Nigeria's #1 AI Lead Generation Platform</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', fontFamily: "'Outfit', sans-serif" }}>
          Turn Lagos Businesses Into{' '}
          <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Paying Clients
          </span>{' '}
          — On Autopilot
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Harvest 10,000+ verified B2B leads across 27 Lagos districts, send AI-powered outreach, and let your 24/7 AI Agent close deals — all from one platform.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
          <button onClick={scrollToPricing} style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 32px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 40px rgba(6,182,212,0.3)' }}>
            <Rocket style={{ width: 18, height: 18 }} /> Start Free Setup →
          </button>
          <a href="https://wa.me/+2348022791227?text=Hi%2C%20I%20want%20to%20see%20ApexReach%20demo" target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.05)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 32px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Play style={{ width: 18, height: 18 }} /> Watch Live Demo
          </a>
        </div>

        {/* Live Stats */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { value: stats.leads.toLocaleString()+'+', label: 'Leads Harvested', color: '#06b6d4' },
            { value: stats.clients+'+ ', label: 'Active Clients', color: '#8b5cf6' },
            { value: stats.outreach.toLocaleString()+'+', label: 'Outreach Messages Sent', color: '#10b981' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{value}</p>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools Grid ─────────────────────────────────── */}
      <section id="tools" style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            8 AI-Powered Tools. One Platform.
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>Everything you need to generate, nurture, and close Lagos B2B leads at scale.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {TOOLS.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${color}30`; (e.currentTarget as HTMLDivElement).style.background = `${color}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon style={{ width: 24, height: 24, color }} />
              </div>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 8px', fontSize: '0.95rem' }}>{label}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────── */}
      <section ref={pricingRef} style={{ padding: '80px 40px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 28 }}>Choose your plan. Cancel anytime.</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4 }}>
            {(['subscription', 'standalone'] as const).map(type => (
              <button key={type} onClick={() => setPlanType(type)}
                style={{ padding: '10px 24px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s',
                  background: planType === type ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent',
                  color: planType === type ? '#fff' : '#64748b' }}>
                {type === 'subscription' ? '🔄 Monthly Subscription' : '♾️ One-Time (Standalone)'}
              </button>
            ))}
          </div>
          {planType === 'subscription' && (
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 10 }}>
              Lower upfront cost — monthly renewal keeps AI models, lead database & hosting updated
            </p>
          )}
          {planType === 'standalone' && (
            <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: 10 }}>
              ♾️ One-time setup fee — your platform runs forever with no monthly charge
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {TIERS.map(tier => {
            const Icon = tier.icon;
            const price = planType === 'subscription' ? tier.monthlyNGN : tier.oneTimeNGN;
            const originalPrice = planType === 'standalone' ? tier.originalOneTimeNGN : null;
            const discount = originalPrice ? Math.round((1 - tier.oneTimeNGN / originalPrice) * 100) : null;

            return (
              <div key={tier.id} onClick={() => setSelectedTier(tier.id)}
                style={{ background: tier.popular ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${tier.popular ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: 28, cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease', boxShadow: selectedTier === tier.id ? `0 0 0 2px ${tier.color}` : 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${tier.color}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = selectedTier === tier.id ? `0 0 0 2px ${tier.color}` : ''; }}>

                {tier.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}

                {discount && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                    -{discount}%
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tier.color}15`, border: `1px solid ${tier.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 24, height: 24, color: tier.color }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#f8fafc', margin: 0, fontWeight: 800, fontSize: '1rem', fontFamily: "'Outfit', sans-serif" }}>{tier.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: tier.color, fontWeight: 700 }}>{tier.badge}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  {originalPrice && (
                    <p style={{ color: '#475569', fontSize: '0.85rem', textDecoration: 'line-through', margin: '0 0 4px' }}>{formatNGN(originalPrice)}</p>
                  )}
                  <p style={{ color: tier.color, fontSize: '2rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                    {formatNGN(price)}
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
                      {planType === 'subscription' ? '/mo' : ' one-time'}
                    </span>
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '6px 0 0' }}>{tier.tagline}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 20 }}>
                  {tier.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <CheckCircle style={{ width: 14, height: 14, color: tier.color, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>{h}</span>
                    </div>
                  ))}
                </div>

                <a href={`/marketplace/checkout?tier=${tier.id}&plan=${planType}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 12, background: tier.popular ? tier.gradient : 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${tier.popular ? 'transparent' : tier.color + '40'}`, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', fontSize: '0.95rem', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onMouseEnter={e => { if (!tier.popular) { (e.currentTarget as HTMLAnchorElement).style.background = tier.gradient; } }}
                  onMouseLeave={e => { if (!tier.popular) { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; } }}>
                  {tier.cta} <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: 32 }}>
          <Shield style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          All plans include 30-day money-back guarantee · Instant provisioning · Nigerian-based support
        </p>
      </section>

      {/* ── Feature Comparison Table ─────────────────── */}
      <section style={{ padding: '60px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 32, fontFamily: "'Outfit', sans-serif" }}>
          Full Feature Comparison
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Feature</th>
                {TIERS.map(t => (
                  <th key={t.id} style={{ textAlign: 'center', padding: '12px 16px', color: t.color, fontSize: '0.85rem', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'capitalize' }}>
                    {t.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['10K Lagos Lead Harvester', false, true, true, true],
                ['AI Customer Agent', true, true, true, true],
                ['WhatsApp Voice Notes', false, true, true, true],
                ['AI Voice Caller (Outbound)', false, false, true, true],
                ['Solar Quote Pro Pipeline', false, true, true, true],
                ['Recruitment Engine', false, false, false, true],
                ['Revenue Analytics', false, true, true, true],
                ['Custom Domain (.com.ng)', false, true, true, true],
                ['White Label Branding', false, false, false, true],
                ['API & Webhooks', false, false, true, true],
                ['Priority Support', false, false, false, true],
              ].map(([feature, ...values]) => (
                <tr key={feature as string} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.85rem' }}>{feature as string}</td>
                  {(values as boolean[]).map((v, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '12px 16px' }}>
                      {v ? <CheckCircle style={{ width: 18, height: 18, color: TIERS[i].color, display: 'inline' }} /> : <span style={{ color: '#334155', fontSize: '1rem' }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section style={{ padding: '60px 40px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 32, fontFamily: "'Outfit', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: 'none', border: 'none', color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                {q}
                {openFaq === i ? <ChevronUp style={{ width: 16, height: 16, color: '#06b6d4', flexShrink: 0 }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section style={{ padding: '80px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 24, padding: '60px 40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
            Ready to Grow Your Business?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: '1rem', lineHeight: 1.6 }}>
            Join 38+ Lagos businesses already using ApexReach to generate leads and close deals on autopilot.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToPricing} style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 32px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Rocket style={{ width: 18, height: 18 }} /> View Pricing Plans
            </button>
            <a href="https://wa.me/+2348022791227" target="_blank" rel="noreferrer" style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 12, padding: '16px 32px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="/admin" style={{ color: '#475569', textDecoration: 'none' }}>Admin Portal</a>
          <a href="/marketplace" style={{ color: '#475569', textDecoration: 'none' }}>Pricing</a>
          <a href="https://wa.me/+2348022791227" style={{ color: '#475569', textDecoration: 'none' }}>Support</a>
        </div>
        <p style={{ margin: 0 }}>© 2026 ApexReach · Bethelmind Analytics & Strategy · Lagos, Nigeria</p>
        <p style={{ margin: '8px 0 0', fontSize: '0.75rem' }}>
          <Shield style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />
          All data is encrypted · NDPR compliant · Nigerian-hosted infrastructure
        </p>
      </footer>
    </div>
  );
}
