'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LandingPage from '@/components/LandingPage';

// Lazy load non-critical floating AI concierge to accelerate primary landing page load
const CustomerAiAgentWidget = dynamic(() => import('@/components/CustomerAiAgentWidget'), { ssr: false });

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
        moniepointAccountNumber: '7034297995',
        moniepointAccountName: 'Oyelakin Tosin Matthew',
        opayBankName: 'OPay Digital Services',
        opayAccountNumber: '7034297995',
        opayAccountName: 'Oyelakin Tosin Matthew'
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
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(runTracking);
      } else {
        setTimeout(runTracking, 600);
      }
    }
  };

  useEffect(() => {
    loadPreview();

    // Listen for custom interactive micro-events dispatched by child widgets
    const handleJourneyCustomEvent = (e: any) => {
      const { eventType, metadata } = e.detail || {};
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
  }, [leadId]);

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

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', position: 'relative' }}>
      {/* Main Interactive Landing Page with Single Clean Sticky Header */}
      <LandingPage data={data} leadId={leadId} isPreview={true} />

      {/* Floating 24/7 AI Concierge Widget — Receives full scraped lead profile for hyper-personalized suggestions */}
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
          services: data.copy?.services?.map((s: any) => s.title).join(', '),
          social_links: data.lead.social_links,
        }}
      />
    </div>
  );
}
