'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LandingPage from '@/components/LandingPage';
import { ZeroAgentSandboxingWidget } from '@/components/ZeroAgentSandboxingWidget';
import { LiveSocialProofTicker } from '@/components/LiveSocialProofTicker';
import CustomerAiAgentWidget from '@/components/CustomerAiAgentWidget';

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

import { InteractiveFeatureShowcaseModal } from '@/components/InteractiveFeatureShowcaseModal';

import { getDesignTheme } from '@/lib/designGenerator';

export default function PreviewPage() {
  const params = useParams();
  const rawLeadId = params?.lead_id;
  const leadId = Array.isArray(rawLeadId) ? rawLeadId[0] : (rawLeadId as string || '');

  // Pre-populate instant preview shell with luxury sector visual theme
  const [data, setData] = useState<PreviewData | null>(() => {
    const fallbackName = leadId ? leadId.replace(/[^a-zA-Z0-9]+/g, ' ').toUpperCase() : 'VALUED BUSINESS';
    
    let category = 'Professional Services';
    const lowerId = leadId.toLowerCase();
    if (/solar|inverter|energy|battery/.test(lowerId)) category = 'Solar Energy & Inverter Dealer';
    else if (/estate|property|home|realty|housing/.test(lowerId)) category = 'Real Estate & Luxury Property';
    else if (/car|auto|motor|vehicle|tokunbo/.test(lowerId)) category = 'Automotive & Tokunbo Importer';
    else if (/medical|clinic|doctor|health/.test(lowerId)) category = 'Medical & Clinics';
    else if (/school|academy|education/.test(lowerId)) category = 'Schools & Education';
    else if (/boutique|fashion|style|beauty/.test(lowerId)) category = 'Boutique & Fashion';

    const luxuryTheme = getDesignTheme(category, leadId);

    let heroTitle = `${fallbackName}`;
    if (category.includes('Solar')) heroTitle = `${fallbackName} — Solar & Energy Solutions`;
    else if (category.includes('Real Estate')) heroTitle = `${fallbackName} — Luxury Homes & Estates`;
    else if (category.includes('Automotive')) heroTitle = `${fallbackName} — Tokunbo Autos & Fleet Imports`;

    return {
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
      copy: {
        heroTitle,
        heroSubtitle: '24/7 AI Lead Automation, Instant PDF Quotes & Direct Booking Engine',
        services: [
          { title: '24/7 WhatsApp AI Customer Agent', description: 'Answers customer inquiries & voice notes automatically.', icon: '🤖' },
          { title: 'Instant Quote & Sizing Estimator', description: 'Generates branded PDF quotes sent to customer phone.', icon: '⚡' },
          { title: 'OPay Direct Bank Transfer Gateway', description: 'Collects customer payments straight to your bank.', icon: '💳' }
        ],
        aboutText: `${fallbackName} is a top-rated enterprise in Lagos committed to delivering excellence.`,
        testimonials: [
          { name: 'Engr. Femi A.', text: 'Outstanding service and 24/7 responsiveness.', rating: 5 }
        ],
        ctaText: 'Claim Your Site & AI System'
      },
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = () => {
    if (!leadId) return;

    // Trigger drip follow-up visit logger in background
    fetch('/api/preview/drip-trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '' }),
    }).catch(() => {});

    fetch(`/api/preview/generate?leadId=${encodeURIComponent(leadId)}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((fullData) => {
        if (fullData) setData(fullData);
      })
      .catch((err: unknown) => {
        console.warn('Background preview hydration notice:', err);
      });
  };

  useEffect(() => {
    loadPreview();
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

      {/* Interactive Feature Showcase Pop-Up Modal */}
      <InteractiveFeatureShowcaseModal
        businessName={data.lead.name}
        leadId={leadId}
      />

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
