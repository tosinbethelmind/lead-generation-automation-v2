'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LandingPage from '@/components/LandingPage';
import { ZeroAgentSandboxingWidget } from '@/components/ZeroAgentSandboxingWidget';
import { LiveSocialProofTicker } from '@/components/LiveSocialProofTicker';

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

export default function PreviewPage() {
  const params = useParams();
  const rawLeadId = params?.lead_id;
  const leadId = Array.isArray(rawLeadId) ? rawLeadId[0] : (rawLeadId as string || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PreviewData | null>(null);

  const loadPreview = () => {
    if (!leadId) {
      setError('Lead ID parameter missing from URL.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Trigger drip follow-up visit logger
    fetch('/api/preview/drip-trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '' }),
    }).catch(() => {});

    fetch(`/api/preview/generate?leadId=${encodeURIComponent(leadId)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load preview copy');
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const error = err as Error;
        console.error(error);
        setError(error.message || 'Error generating preview content');
        setLoading(false);
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
      {/* Top Floating Zero-Agent Sandboxing Banner */}
      <ZeroAgentSandboxingWidget
        businessName={data.lead.name}
        leadId={leadId}
        category={data.lead.category}
      />

      {/* Main Interactive Landing Page */}
      <LandingPage data={data} leadId={leadId} isPreview={true} />

      {/* Interactive Feature Showcase Pop-Up Modal */}
      <InteractiveFeatureShowcaseModal
        businessName={data.lead.name}
        leadId={leadId}
      />

      {/* Bottom Floating Social Proof Ticker & CAC Shield */}
      <LiveSocialProofTicker />
    </div>
  );
}
