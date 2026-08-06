/**
 * @file src/app/home/page.tsx
 * Public Homepage — bethelmindanalytics.com
 * The flagship public-facing page for Bethelmind Analytics & Strategy.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, CheckCircle, Zap, Star, Crown, Rocket,
  Target, Brain, MessageSquare, Phone, Globe, Users, BarChart3,
  Shield, TrendingUp, ChevronDown, ChevronUp, Play, ExternalLink,
  MapPin, Clock, Cpu, Lock, RefreshCw
} from 'lucide-react';

// ─── Types & Data ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '#tools', label: 'Tools' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '/marketplace', label: 'Buy Now' },
];

const HERO_STATS = [
  { value: '17,000+', label: 'Lagos Leads Harvested', color: '#06b6d4' },
  { value: '38+', label: 'Businesses Served', color: '#8b5cf6' },
  { value: '94,000+', label: 'Outreach Messages Sent', color: '#10b981' },
  { value: '99.9%', label: 'System Uptime', color: '#f59e0b' },
];

const TOOLS = [
  {
    icon: Target,
    name: '10K Lagos Lead Harvester',
    desc: 'Automatically scrapes and verifies 10,000+ business contacts across all 27 Lagos districts — with phone numbers and WhatsApp IDs.',
    color: '#06b6d4',
    tiers: ['pro', 'vip', 'luxury'],
  },
  {
    icon: Brain,
    name: '24/7 Customer AI Agent',
    desc: 'A human-level AI trained on your business, products, and prices. Handles enquiries, sends quotes, and closes deals around the clock.',
    color: '#8b5cf6',
    tiers: ['starter', 'pro', 'vip', 'luxury'],
  },
  {
    icon: MessageSquare,
    name: 'WhatsApp Voice Note Generator',
    desc: 'Nigerian accent (en-NG Abeo/Ezinne) voice notes sent automatically — warmer than text, more likely to get replied to.',
    color: '#10b981',
    tiers: ['pro', 'vip', 'luxury'],
  },
  {
    icon: Phone,
    name: 'AI Voice Caller (Outbound)',
    desc: 'Your AI auto-dials your lead list 24/7 with personalized pitches. Converts cold leads to warm conversations without lifting a finger.',
    color: '#f59e0b',
    tiers: ['vip', 'luxury'],
  },
  {
    icon: Zap,
    name: 'Multi-Channel Outreach Engine',
    desc: 'Email, WhatsApp, SMS, and Instagram DMs — all automated and sent in sequence based on lead behaviour triggers.',
    color: '#f97316',
    tiers: ['pro', 'vip', 'luxury'],
  },
  {
    icon: Globe,
    name: 'AI Website Builder',
    desc: 'Industry-specific websites (Solar, Medical, Legal, Real Estate) generated and deployed in under 60 seconds with full WhatsApp checkout.',
    color: '#06b6d4',
    tiers: ['starter', 'pro', 'vip', 'luxury'],
  },
  {
    icon: BarChart3,
    name: 'Revenue Analytics Dashboard',
    desc: 'Real-time revenue attribution, lead journey heatmaps, and conversion tracking — know exactly which outreach is making money.',
    color: '#8b5cf6',
    tiers: ['pro', 'vip', 'luxury'],
  },
  {
    icon: Users,
    name: 'Recruitment Engine',
    desc: 'Post vacancies, auto-screen CVs using AI, and WhatsApp shortlisted candidates with personalised offer messages — hands-free hiring.',
    color: '#ec4899',
    tiers: ['luxury'],
  },
];

const INDUSTRIES = [
  { emoji: '☀️', name: 'Solar Installers', desc: 'Automated BOQ quotes + solar lead harvesting' },
  { emoji: '🏥', name: 'Clinics & Hospitals', desc: 'Patient intake, appointment booking, AI triage' },
  { emoji: '🚗', name: 'Car Dealers', desc: 'Tokunbo import duty calculator + lead follow-up' },
  { emoji: '⚖️', name: 'Law Firms', desc: 'Case intake, document collection, consultation booking' },
  { emoji: '🏠', name: 'Real Estate', desc: 'Property listings, virtual tours, automated follow-ups' },
  { emoji: '🛍️', name: 'Boutiques & Retailers', desc: 'WhatsApp catalog, inventory AI, order management' },
  { emoji: '🏗️', name: 'Construction & Engineering', desc: 'Project quoting, contractor recruitment, client portals' },
  { emoji: '📚', name: 'Schools & Training', desc: 'Student intake, fee reminders, parent communication' },
];

const PRICING = [
  { id: 'starter', name: 'Starter', monthlyNGN: 15000, oneTimeNGN: 75000, color: '#0ea5e9', icon: Zap, tagline: 'WhatsApp Catalog + AI Autoresponder', features: ['AI Customer Widget', 'WhatsApp Catalog', '500 B2B Contacts', 'Free Subdomain'] },
  { id: 'pro', name: 'Pro', monthlyNGN: 35000, oneTimeNGN: 185000, color: '#8b5cf6', icon: Star, tagline: 'Lead Harvester + AI Agent + Voice Notes', features: ['10K Lagos Lead Harvester', '24/7 AI Agent', 'Voice Notes', 'Custom Domain', 'Admin Panel'], popular: true },
  { id: 'vip', name: 'VIP', monthlyNGN: 75000, oneTimeNGN: 480000, color: '#f59e0b', icon: Crown, tagline: 'AI Voice Caller + Full Automation Suite', features: ['Everything in Pro', 'AI Voice Caller', 'Solar Pipeline', 'Revenue Analytics', 'API Access'] },
  { id: 'luxury', name: 'Luxury', monthlyNGN: 150000, oneTimeNGN: 1200000, color: '#ec4899', icon: Rocket, tagline: 'Complete AI Business Empire', features: ['Everything in VIP', 'Recruitment Engine', 'White-Label Option', 'Priority Support', 'Dedicated Manager'] },
];

const FAQS = [
  { q: 'How quickly can I get started?', a: 'Your platform is live within 30 minutes of payment confirmation. You\'ll receive login credentials via email and WhatsApp immediately after provisioning.' },
  { q: 'Do I need any technical skills?', a: 'Zero technical skills required. Our AI does all the heavy lifting. You just configure your business name, products, and prices through a simple admin panel.' },
  { q: 'Is my clients\' data safe?', a: 'Yes. Each business gets a completely isolated data partition. Your leads, AI agent settings, and chat history are private and accessible only by you.' },
  { q: 'What payment methods do you accept?', a: 'We accept OPay bank transfer, Moniepoint, and Paystack (card & direct debit). All payments are receipted with instant reactivation.' },
  { q: 'Can I cancel or upgrade anytime?', a: 'Yes. Upgrade anytime and we\'ll prorate the difference. Monthly subscribers can cancel before their next billing date with no penalty.' },
  { q: 'Do you cover cities outside Lagos?', a: 'Yes — while our live lead database specialises in Lagos (27 districts), all AI tools work for any Nigerian city. We are actively expanding to Abuja and Port Harcourt.' },
];

// ─── Animated Counter Hook ──────────────────────────────────────────────────

function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Components ──────────────────────────────────────────────────────────────

function AnimatedStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 900, color, margin: 0, fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>{value}</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '6px 0 0', lineHeight: 1.3 }}>{label}</p>
    </div>
  );
}

function ToolCard({ icon: Icon, name, desc, color, tiers }: typeof TOOLS[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}08` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? color + '30' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 18,
        padding: 24,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <Icon style={{ width: 26, height: 26, color }} />
      </div>
      <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 10px', fontSize: '1rem', lineHeight: 1.3 }}>{name}</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 14px' }}>{desc}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tiers.map(t => (
          <span key={t} style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [planType, setPlanType] = useState<'subscription' | 'standalone'>('subscription');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 clamp(20px, 5vw, 60px)',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,9,14,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>
              Bethelmind
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Analytics & Strategy</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
          {['tools', 'pricing', 'industries', 'about'].map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
              {id}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, padding: '8px 14px' }}
            className="desktop-nav">Login</Link>
          <Link href="/marketplace" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 0 24px rgba(6,182,212,0.2)' }}>
            <Rocket style={{ width: 15, height: 15 }} /> Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(100px, 15vh, 160px) clamp(20px, 5vw, 60px) 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, position: 'relative', zIndex: 1 }}>
          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100, padding: '7px 18px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700 }}>Nigeria's Most Powerful AI Business Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', fontFamily: "'Outfit', sans-serif' " }}>
            Stop Chasing Leads.<br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Let AI Find & Close Them.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8', maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Bethelmind Analytics arms your business with <strong style={{ color: '#f8fafc' }}>10,000+ verified Lagos B2B leads</strong>, a 24/7 AI Customer Agent, automated WhatsApp outreach, and a full revenue dashboard — all from one platform, ready in 30 minutes.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link href="/marketplace" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 14, padding: '16px 36px', fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 60px rgba(6,182,212,0.25)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              <Rocket style={{ width: 20, height: 20 }} /> Start Free Setup
              <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <a href="https://wa.me/+2348000000000?text=Hi%2C%20I%20want%20to%20see%20a%20live%20demo%20of%20Bethelmind%20Analytics" target="_blank" rel="noreferrer"
              style={{ background: 'rgba(37,211,102,0.08)', color: '#25d366', border: '1px solid rgba(37,211,102,0.25)', textDecoration: 'none', borderRadius: 14, padding: '16px 36px', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare style={{ width: 20, height: 20 }} /> Book a Live Demo
            </a>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 24, maxWidth: 700, margin: '0 auto', padding: '28px 32px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            {HERO_STATS.map(s => <AnimatedStat key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px clamp(20px, 5vw, 60px)', display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center', flexWrap: 'wrap', background: 'rgba(255,255,255,0.01)' }}>
        {[
          { icon: Shield, text: 'NDPR Compliant' },
          { icon: Lock, text: 'End-to-End Encrypted' },
          { icon: Clock, text: '30-Min Setup' },
          { icon: MapPin, text: 'Lagos, Nigeria' },
          { icon: RefreshCw, text: '99.9% Uptime SLA' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: '0.82rem' }}>
            <Icon style={{ width: 14, height: 14 }} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ── Tools Grid ───────────────────────────────────────────────────── */}
      <section id="tools" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Outfit', sans-serif" }}>
            8 AI Tools. One Subscription.
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto' }}>
            Every tool your business needs to generate, follow up, and convert Lagos B2B leads — all connected and talking to each other.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {TOOLS.map(tool => <ToolCard key={tool.name} {...tool} />)}
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <section id="industries" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Outfit', sans-serif" }}>
              Built for Every Nigerian Business
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
              From solo artisans to multi-branch enterprises — Bethelmind adapts to your industry.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {INDUSTRIES.map(({ emoji, name, desc }) => (
              <div key={name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 18px', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(6,182,212,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(6,182,212,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}>{emoji}</span>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 6px', fontSize: '0.95rem' }}>{name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Outfit', sans-serif" }}>
            Transparent, Nigerian-Market Pricing
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 28 }}>No hidden fees. Cancel anytime. Instant provisioning.</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 5 }}>
            {(['subscription', 'standalone'] as const).map(t => (
              <button key={t} onClick={() => setPlanType(t)}
                style={{ padding: '10px 28px', borderRadius: 11, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s',
                  background: planType === t ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent',
                  color: planType === t ? '#fff' : '#64748b' }}>
                {t === 'subscription' ? '🔄 Monthly Plan' : '♾️ One-Time License'}
              </button>
            ))}
          </div>
          <p style={{ color: planType === 'subscription' ? '#64748b' : '#10b981', fontSize: '0.8rem', marginTop: 10 }}>
            {planType === 'subscription' ? 'Lower upfront cost — AI updates, lead database sync & hosting included monthly' : '♾️ One-time fee — platform runs forever, no recurring charges'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {PRICING.map(tier => {
            const Icon = tier.icon;
            const price = planType === 'subscription' ? tier.monthlyNGN : tier.oneTimeNGN;
            return (
              <div key={tier.id} style={{ background: tier.popular ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${tier.popular ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: 28, position: 'relative', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 60px ${tier.color}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>

                {tier.popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '5px 18px', borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tier.color}15`, border: `1px solid ${tier.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 24, height: 24, color: tier.color }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#f8fafc', margin: 0, fontWeight: 800, fontSize: '1.05rem', fontFamily: "'Outfit', sans-serif" }}>{tier.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{tier.tagline}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <p style={{ color: tier.color, fontSize: '2.2rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                    ₦{price.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>{planType === 'subscription' ? '/mo' : ' once'}</span>
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <CheckCircle style={{ width: 14, height: 14, color: tier.color, flexShrink: 0 }} />
                      <span style={{ color: '#94a3b8', fontSize: '0.83rem' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/marketplace/checkout?tier=${tier.id}&plan=${planType}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 12, background: tier.popular ? `linear-gradient(135deg, ${tier.color}, #7c3aed)` : 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${tier.popular ? 'transparent' : tier.color + '30'}`, fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!tier.popular) { (e.currentTarget as HTMLAnchorElement).style.background = `linear-gradient(135deg, ${tier.color}, #7c3aed)`; } }}
                  onMouseLeave={e => { if (!tier.popular) { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; } }}>
                  Get {tier.name} Plan <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Shield style={{ width: 14, height: 14 }} />
          All plans include 30-day money-back guarantee · Nigerian-based 24/7 support · Instant reactivation
        </p>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: '0 0 18px', fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>
              Built in Lagos.<br />
              <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Built for Lagos.</span>
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 20, fontSize: '0.95rem' }}>
              Bethelmind Analytics & Strategy was founded with one mission: give Nigerian SMEs the same AI-powered sales automation that Fortune 500 companies use — at prices that make sense for our market.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 28, fontSize: '0.95rem' }}>
              We've built lead harvesting engines tuned to Lagos's unique B2B landscape, AI agents trained on Nigerian business communication patterns, and voice technology using authentic Nigerian accents — because generic tools built for Western markets don't work here.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/marketplace" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                View Plans <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
              <a href="https://wa.me/+2348000000000" target="_blank" rel="noreferrer" style={{ color: '#25d366', border: '1px solid rgba(37,211,102,0.3)', textDecoration: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(37,211,102,0.05)' }}>
                <MessageSquare style={{ width: 15, height: 15 }} /> WhatsApp Us
              </a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: Cpu, label: 'AI-Native Architecture', desc: 'Every tool is AI-first, not AI-bolted-on', color: '#06b6d4' },
              { icon: MapPin, label: 'Lagos Specialised', desc: '27 districts, 17K+ verified contacts', color: '#8b5cf6' },
              { icon: Shield, label: 'Data Privacy First', desc: 'NDPR compliant, isolated per client', color: '#10b981' },
              { icon: TrendingUp, label: 'Revenue Focused', desc: 'Every feature is tied to conversion', color: '#f59e0b' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 14, padding: 18 }}>
                <Icon style={{ width: 22, height: 22, color, marginBottom: 10 }} />
                <h4 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 6px', fontSize: '0.85rem' }}>{label}</h4>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, marginBottom: 40, fontFamily: "'Outfit', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', textAlign: 'left', padding: '18px 22px', background: 'none', border: 'none', color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                {q}
                {openFaq === i ? <ChevronUp style={{ width: 16, height: 16, color: '#06b6d4', flexShrink: 0 }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 22px 20px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', background: 'linear-gradient(135deg, rgba(6,182,212,0.07), rgba(139,92,246,0.07))', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 28, padding: 'clamp(48px, 8vw, 72px) clamp(32px, 6vw, 60px)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Sparkles style={{ width: 30, height: 30, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
            Your Competition Is Already Automating.<br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Are You?</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Join 38+ Lagos businesses already using Bethelmind Analytics to grow faster, serve better, and sell more — on autopilot.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/marketplace" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 14, padding: '16px 36px', fontWeight: 800, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 0 50px rgba(6,182,212,0.2)' }}>
              <Rocket style={{ width: 20, height: 20 }} /> View All Plans
            </Link>
            <a href="https://wa.me/+2348000000000?text=Hi%2C%20I%20want%20to%20see%20a%20demo%20of%20Bethelmind%20Analytics" target="_blank" rel="noreferrer"
              style={{ background: 'rgba(37,211,102,0.08)', color: '#25d366', border: '1px solid rgba(37,211,102,0.25)', textDecoration: 'none', borderRadius: 14, padding: '16px 36px', fontWeight: 700, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare style={{ width: 20, height: 20 }} /> WhatsApp Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: 'clamp(40px, 5vw, 60px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
            {/* Brand col */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
                </div>
                <span style={{ fontWeight: 800, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>Bethelmind Analytics</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 14px' }}>Nigeria's most powerful AI lead generation and business automation platform.</p>
              <p style={{ color: '#334155', fontSize: '0.8rem' }}><MapPin style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Lagos, Nigeria</p>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 14, fontSize: '0.9rem' }}>Platform</h4>
              {[['Marketplace', '/marketplace'], ['Pricing', '#pricing'], ['All Tools', '#tools'], ['Industries', '#industries']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={href} style={{ color: '#475569', fontSize: '0.85rem', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{label}</a>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 14, fontSize: '0.9rem' }}>Account</h4>
              {[['Admin Login', '/admin'], ['Client Portal', '/portal'], ['My Subscription', '/admin/subscription'], ['Support', 'https://wa.me/+2348000000000']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={href} style={{ color: '#475569', fontSize: '0.85rem', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{label}</a>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 14, fontSize: '0.9rem' }}>Contact</h4>
              <a href="https://wa.me/+2348000000000" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#25d366', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 10 }}>
                <MessageSquare style={{ width: 14, height: 14 }} /> WhatsApp
              </a>
              <a href="mailto:hello@bethelmindanalytics.com" style={{ color: '#475569', fontSize: '0.85rem', textDecoration: 'none', display: 'block' }}>hello@bethelmindanalytics.com</a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#334155', fontSize: '0.8rem', margin: 0 }}>© 2026 Bethelmind Analytics & Strategy. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ color: '#334155', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield style={{ width: 12, height: 12 }} /> NDPR Compliant
              </span>
              <span style={{ color: '#334155', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lock style={{ width: 12, height: 12 }} /> End-to-End Encrypted
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .desktop-nav { display: flex; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #about .grid-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
