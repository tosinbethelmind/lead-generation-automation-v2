'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LandingPage from '@/components/LandingPage';

// Lazy load non-critical floating AI concierge to accelerate primary landing page load
const CustomerAiAgentWidget = dynamic(() => import('@/components/CustomerAiAgentWidget'), { ssr: false });
const StickyMobileConversionBar = dynamic(() => import('@/components/StickyMobileConversionBar'), { ssr: false });
const TypebotLeadConverter = dynamic(() => import('@/components/interactive/TypebotLeadConverter'), { ssr: false });
const NigerianSmeHeroExplainer = dynamic(() => import('@/components/NigerianSmeHeroExplainer'), { ssr: false });
const SectorToolsWidget = dynamic(() => import('@/components/SectorToolsWidget').then(m => m.SectorToolsWidget), { ssr: false });
const ExitIntentAndIdleModal = dynamic(() => import('@/components/ExitIntentAndIdleModal'), { ssr: false });
const LiveSocialProofTicker = dynamic(() => import('@/components/LiveSocialProofTicker').then(m => m.LiveSocialProofTicker), { ssr: false });
const SectorCaseStudyCallout = dynamic(() => import('@/components/blog/SectorCaseStudyCallout'), { ssr: false });
const ScrollWorld = dynamic(() => import('@/components/three/ScrollWorld'), { ssr: false });
const ShaderGradientLiquidLogo = dynamic(() => import('@/components/three/ShaderGradientLiquidLogo'), { ssr: false });

function resolveSectorPalette(cat: string = ''): 'solar' | 'luxury' | 'healthcare' | 'automotive' | 'bethelmind' {
  const lower = cat.toLowerCase();
  if (/solar|inverter|energy|battery|power/.test(lower)) return 'solar';
  if (/medical|clinic|doctor|health|hospital|pharmacy|dental|optician/.test(lower)) return 'healthcare';
  if (/car|auto|motor|vehicle|dealership|tokunbo/.test(lower)) return 'automotive';
  if (/estate|property|home|realty|developer|hotel|shortlet|luxury/.test(lower)) return 'luxury';
  return 'bethelmind';
}

interface PreviewData {
  lead: {
    name: string;
    category: string;
    address: string;
    area: string;
    city: string;
    phone_raw: string;
    phone_e164: string;
    rating: number;
    reviews_count: number;
    business_summary: string;
    business_hours?: string;
    reviews_data?: string;
    photos_data?: string;
    social_links?: string;
    services_data?: string;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    heroImage: string;
    gradient: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: { title: string; description: string; icon: string }[];
    aboutText: string;
    testimonials: { name: string; text: string; rating: number }[];
    ctaText: string;
  };
  paymentConfig?: {
    paystackPublicKey: string;
    claimFeeNGN: number;
    moniepointBankName: string;
    moniepointAccountNumber: string;
    moniepointAccountName: string;
    opayBankName?: string;
    opayAccountNumber?: string;
    opayAccountName?: string;
    opayPublicKey?: string;
    opayMerchantId?: string;
  };
}

import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';
import { sanitizeDisplayName, sanitizeCopyText } from '@/lib/leadSanitizers';


// High-performance client-side in-memory cache for instant 0ms transitions
const previewCache = new Map<string, PreviewData>();

export default function PreviewPage() {
  const params = useParams();
  const rawLeadId = params?.lead_id;
  const leadId = Array.isArray(rawLeadId) ? rawLeadId[0] : (rawLeadId as string || '');

  // Pre-populate instant preview shell with luxury sector visual theme
  const [data, setData] = useState<PreviewData | null>(() => {
    if (previewCache.has(leadId)) {
      return previewCache.get(leadId)!;
    }

    let category = 'Professional Services';
    const lowerId = leadId.toLowerCase();
    if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge|dining|lounge|restaurant|bar|cafe/.test(lowerId)) {
      category = 'Hotels & Shortlet Apartments';
    } else if (/estate|property|home|realty|housing|developer|land|mansion/.test(lowerId)) {
      category = 'Real Estate & Luxury Homes';
    } else if (/medical|clinic|doctor|health|hospital|pharmacy|dental|dentist|eye|optician|lab|surgery/.test(lowerId)) {
      category = 'Medical & Healthcare Clinics';
    } else if (/car|auto|motor|vehicle|tokunbo|dealership|mechanic|garage|tyre|spare/.test(lowerId)) {
      category = 'Automotive & Tokunbo Importers';
    } else if (/school|academy|education|college|creche|tutor|university|institute/.test(lowerId)) {
      category = 'Schools & Academies';
    } else if (/law|legal|attorney|solicitor|advocate|barrister|cac|chamber/.test(lowerId)) {
      category = 'Law Firms & Legal Practitioners';
    } else if (/boutique|fashion|style|beauty|salon|spa|hair|cloth|tailor|apparel/.test(lowerId)) {
      category = 'Boutiques & Luxury Fashion';
    } else if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck|transport/.test(lowerId)) {
      category = 'Logistics & Haulage Fleet';
    } else if (/event|hall|banquet|decor|cater|party|wedding|marquee|plaza/.test(lowerId)) {
      category = 'Event Centers & Banquet Halls';
    } else if (/solar|inverter|energy|battery|power|lifepo4|clean energy/.test(lowerId)) {
      category = 'Solar & Renewable Energy';
    }

    const fallbackName = sanitizeDisplayName(leadId, category);
    const luxuryTheme = getDesignTheme(category, leadId);
    const tailoredCopy = buildFallbackCopy({
      name: fallbackName,
      category,
      area: 'Lekki Phase 1',
      city: 'Lagos'
    });

    const initialPayload: PreviewData = {
      lead: {
        name: fallbackName,
        category,
        address: 'Commercial Hub, Lagos',
        area: 'Lekki Phase 1',
        city: 'Lagos',
        phone_raw: '+234 802 279 1227',
        phone_e164: '+2348022791227',
        rating: 4.9,
        reviews_count: 38,
        business_summary: `Verified ${category} Enterprise in Lagos`
      },
      theme: luxuryTheme,
      copy: tailoredCopy,
      paymentConfig: {
        paystackPublicKey: '',
        claimFeeNGN: 150000,
        moniepointBankName: 'Moniepoint Microfinance Bank',
        moniepointAccountNumber: '6805375225',
        moniepointAccountName: 'Bethelmind Digital Solutions',
        opayBankName: 'Moniepoint Microfinance Bank',
        opayAccountNumber: '6805375225',
        opayAccountName: 'Bethelmind Digital Solutions'
      }
    };

    previewCache.set(leadId, initialPayload);
    return initialPayload;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = () => {
    if (!leadId) return;

    // Fetch full enriched lead preview data immediately with cached response fallback
    fetch(`/api/preview/generate?leadId=${encodeURIComponent(leadId)}`, { cache: 'default' })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((fullData) => {
        if (fullData) {
          if (fullData.lead?.name) {
            fullData.lead.name = sanitizeDisplayName(fullData.lead.name, fullData.lead.category || '');
          }
          if (fullData.copy) {
            const safe = fullData.lead?.name || 'Premier Lagos Enterprise';
            if (fullData.copy.heroTitle) fullData.copy.heroTitle = sanitizeCopyText(fullData.copy.heroTitle, safe);
            if (fullData.copy.heroSubtitle) fullData.copy.heroSubtitle = sanitizeCopyText(fullData.copy.heroSubtitle, safe);
            if (fullData.copy.aboutText) fullData.copy.aboutText = sanitizeCopyText(fullData.copy.aboutText, safe);
          }
          previewCache.set(leadId, fullData);
          setData(fullData);
        }
      })
      .catch((err: unknown) => {
        console.warn('Background preview hydration notice:', err);
      });


    // Defer non-critical journey tracking to idle time (0ms blocking)
    const runTracking = () => {
      // 1. Dub.co High-Precision Click Attribution
      fetch('/api/preview/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          businessName: data?.lead?.name || leadId,
          category: data?.lead?.category || 'General',
          area: data?.lead?.area || data?.lead?.city || 'Lagos',
          phone: data?.lead?.phone_e164 || ''
        })
      }).catch(() => {});

      fetch('/api/tracking/journey-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          leadName: data?.lead?.name || leadId,
          category: data?.lead?.category || 'General',
          phone: data?.lead?.phone_e164 || '',
          area: data?.lead?.area || 'Lagos',
          eventType: 'page_view',
          metadata: { path: `/preview/${leadId}`, userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '' }
        })
      }).catch(() => {});

      fetch('/api/preview/drip-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '' }),
      }).catch(() => {});
    };

    if (typeof window !== 'undefined') {
      const winWithIdle = window as Window & { requestIdleCallback?: (cb: () => void) => void };
      if (typeof winWithIdle.requestIdleCallback === 'function') {
        winWithIdle.requestIdleCallback(runTracking);
      } else {
        setTimeout(runTracking, 600);
      }
    }
  };

  useEffect(() => {
    loadPreview();

    // Listen for custom interactive micro-events dispatched by child widgets
    const handleJourneyCustomEvent = (e: Event) => {
      const customEv = e as CustomEvent<{ eventType?: string; metadata?: Record<string, unknown> }>;
      const { eventType, metadata } = customEv.detail || {};
      if (!eventType || !leadId) return;
      fetch('/api/tracking/journey-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          leadName: data?.lead?.name || leadId,
          category: data?.lead?.category || 'General',
          phone: data?.lead?.phone_e164 || '',
          area: data?.lead?.area || 'Lagos',
          eventType,
          metadata: metadata || {}
        })
      }).catch(() => {});
    };

    window.addEventListener('customer_journey_event', handleJourneyCustomEvent);
    return () => window.removeEventListener('customer_journey_event', handleJourneyCustomEvent);
  }, [leadId, data]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090d16', color: '#fff', fontFamily: 'system-ui' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <p style={{ color: '#94a3b8' }}>Generating custom design theme & Vertex AI copywriting...</p>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090d16', color: '#fff', fontFamily: 'system-ui', padding: '20px', textAlign: 'center' }}>
        <ShieldCheck size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>Preview Load Error</h2>
        <p style={{ color: '#94a3b8', maxWidth: '400px' }}>{error || 'Unable to build preview website content. Ensure the lead exists in your database.'}</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={loadPreview} style={{ padding: '10px 20px', background: '#0284c7', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
            Retry Loading
          </button>
          <Link href="/" style={{ padding: '10px 20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>
            Return to Console
          </Link>
        </div>
      </div>
    );
  }

  const sectorPalette = resolveSectorPalette(data?.lead?.category);

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#070b14', color: '#ffffff', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D WebGL Ambient Scroll World Engine - Desktop Only to prevent mobile GPU throttling & high cellular data drain */}
      <div className="hidden md:block">
        <ScrollWorld theme={sectorPalette} />
      </div>

      {/* Top High-Conversion VIP Proof & 1-Tap WhatsApp Bar */}
      <header 
        style={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7, 11, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '10px 16px',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <ShaderGradientLiquidLogo 
              size={32} 
              initials={data.lead.name ? data.lead.name.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'VIP'} 
              palette={sectorPalette} 
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              👑 VIP DEMO: <span style={{ color: '#ffffff', fontWeight: 800 }}>{data.lead.name}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Analytics Lagos Desk! I am reviewing the live 24/7 AI quoting prototype for *${data.lead.name}* (${data.lead.category}) in ${data.lead.area || data.lead.city || 'Lagos'}.\n\nDemo Link: https://www.bethelmindanalytics.com/preview/${leadId}\n\nPlease show me how the 2-second WhatsApp quoter works with our services and pricing (₦0 Upfront Preview).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              🟢 Test WhatsApp Demo →
            </a>
            
            <a
              href="tel:+2348022791227"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              📞 0802 279 1227
            </a>
          </div>
        </div>
      </header>

      {/* ── SECTION 1: EXECUTIVE VALUE & HERO SIMULATOR ── */}
      <section style={{ width: '100%', position: 'relative' }}>
        <NigerianSmeHeroExplainer
          businessName={data.lead.name}
          category={data.lead.category}
          area={data.lead.area || data.lead.city || 'Lagos'}
          phone={data.lead.phone_raw}
          previewUrl={`https://www.bethelmindanalytics.com/preview/${leadId}`}
          adminPhone="2348022791227"
        />
      </section>

      {/* ── SECTION 2: EXECUTIVE DECISION MATRIX (DIRECT & INSTANT) ── */}
      <section 
        style={{ 
          maxWidth: '1080px', 
          margin: '24px auto', 
          padding: '0 16px', 
          boxSizing: 'border-box' 
        }}
      >
        <div 
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #090e1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            <span>⚡ Clear Commercial Choice</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Choose How You Want to Activate for <span style={{ color: '#38bdf8' }}>{data.lead.name}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Zero unnecessary technical jargon. Select the exact plan that fits your current operational setup:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px', textAlign: 'left' }}>
            {/* OPTION 1: COMPLETE DIGITAL LAUNCH (FOR BUSINESSES WITHOUT A WEBSITE) */}
            <div 
              style={{
                background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '2px solid #10b981',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#10b981', color: '#022c22', fontSize: '0.72rem', fontWeight: 900, padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recommended for Non-Website Businesses
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    Option 1 · Fast Online Launch
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Live in 48 Hours</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                  Complete Web Presence + 24/7 AI Bot
                </h3>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '12px 0 16px 0' }}>
                  ₦45,000 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>one-time setup</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> <strong>Official Mobile-Optimized Website</strong> (No technical setup needed)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> <strong>24/7 WhatsApp AI Closer</strong> (&lt; 3s instant quotes &amp; product info)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> <strong>Instant Moniepoint/Bank Alert Shield</strong> (Eliminates fake alert fraud)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> <strong>₦0 Upfront Demo Review</strong> — Inspect on your phone before paying
                  </li>
                </ul>
              </div>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Digital Solutions! I want to launch the Complete Web Presence + 24/7 Bot (₦45,000) for *${data.lead.name}*. Please send activation details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  textAlign: 'center'
                }}
              >
                <span>Launch for {data.lead.name} (₦45,000) →</span>
              </a>
            </div>

            {/* OPTION 2: ENTERPRISE AUTOMATION SUITE */}
            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    Option 2 · Full Growth Suite
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Includes Custom Domain (.com.ng)</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                  Custom Domain + Priority Automation
                </h3>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '12px 0 16px 0' }}>
                  ₦85,000 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>(₦40k milestone deposit)</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> Dedicated custom domain (e.g. yourbusiness.com.ng)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> Automated WhatsApp customer appointment / order ledger
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> Google Business Profile SEO ranking optimization
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> Full 60-Day maintenance & concierge support
                  </li>
                </ul>
              </div>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Digital Solutions! I want to request the Custom Domain + Priority Automation (₦85,000) for *${data.lead.name}*. Please send the invoice card.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <span>Select Custom Domain Suite →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: INTERACTIVE SECTOR CALCULATOR & TROJAN HORSE TOOLS ── */}
      <section 
        style={{ 
          maxWidth: '1080px', 
          margin: '28px auto', 
          padding: '0 16px', 
          boxSizing: 'border-box' 
        }}
      >
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
            🛠️ Interactive Commercial Tool Suite
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Test Drive the Quoting Tool Engineered for Your Industry
          </h2>
        </div>
        <SectorToolsWidget
          businessCategory={data.lead.category}
          businessName={data.lead.name}
          merchantPhone="2348022791227"
          hasWebsite={Boolean(data.lead.business_summary?.includes('http') || (data.lead as Record<string, unknown>)?.website || (data as Record<string, unknown>)?.hasWebsite)}
        />
      </section>

      {/* ── SECTION 4: FULL WEBSITE PREVIEW SHELL (CLEAN PROGRESSIVE DISCLOSURE) ── */}
      <section 
        style={{ 
          maxWidth: '1140px', 
          margin: '36px auto', 
          padding: '0 16px', 
          boxSizing: 'border-box' 
        }}
      >
        <div 
          style={{ 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            background: '#040711',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' 
          }}
        >
          <div 
            style={{ 
              background: '#0f172a', 
              padding: '14px 20px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginLeft: '8px', fontFamily: 'monospace' }}>
                https://www.{data.lead.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.ng (Live Staging)
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '8px' }}>
              ● 100% Mobile Ready Prototype
            </span>
          </div>

          <LandingPage data={data} leadId={leadId} isPreview={true} />
        </div>
      </section>

      {/* ── SECTION 5: OPERATIONAL BLUEPRINT & VERIFIED CASE STUDY ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 my-6">
        <SectorCaseStudyCallout
          category={data.lead.category}
          businessName={data.lead.name}
        />
      </div>

      {/* Floating Concierge (Desktop only) */}
      <div className="hidden md:block">
        <CustomerAiAgentWidget
          businessName={data.lead.name}
          sector={data.lead.category}
          leadData={{
            name: data.lead.name,
            category: data.lead.category,
            address: data.lead.address,
            area: data.lead.area,
            city: data.lead.city,
            rating: data.lead.rating,
            reviews_count: data.lead.reviews_count,
            business_summary: data.lead.business_summary,
            phone: data.lead.phone_raw,
            services: data.copy?.services?.map((s: { title: string }) => s.title).join(', '),
            social_links: data.lead.social_links,
          }}
        />
      </div>

      {/* Mobile Sticky 1-Tap Closer */}
      <StickyMobileConversionBar
        businessName={data.lead.name}
        area={data.lead.area || data.lead.city || 'Lagos'}
        category={data.lead.category}
        hasWebsite={Boolean(data.lead.business_summary?.includes('http') || (data.lead as Record<string, unknown>)?.website || (data as Record<string, unknown>)?.hasWebsite)}
        website={(data.lead as Record<string, unknown>)?.website as string | undefined}
        adminPhone="2348022791227"
      />

      {/* Real-Time Social Proof */}
      <LiveSocialProofTicker />

      {/* Exit Intent Recovery Modal */}
      <ExitIntentAndIdleModal
        businessName={data.lead.name}
        category={data.lead.category}
        area={data.lead.area || data.lead.city || 'Lagos'}
        adminPhone="2348022791227"
        leadId={leadId}
      />
    </div>
  );
}

