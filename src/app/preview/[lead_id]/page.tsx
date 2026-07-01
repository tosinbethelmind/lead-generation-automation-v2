'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LandingPage from '@/components/LandingPage';

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
  };
}

export default function PreviewPage() {
  const params = useParams();
  const leadId = params.lead_id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (!leadId) return;

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
        setError(error.message);
        setLoading(false);
      });
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
        <Link href="/" style={{ marginTop: '24px', padding: '10px 20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>
          Return to Console
        </Link>
      </div>
    );
  }

  return <LandingPage data={data} leadId={leadId} isPreview={true} />;
}
