import React from 'react';
import type { Metadata } from 'next';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';

interface Props {
  params: Promise<{ lead_id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lead_id } = await params;
  const leadId = lead_id || '';

  let lead: any = findBundledLead(leadId);
  if (!lead) {
    try {
      const repo = getActiveLeadRepository();
      lead = await repo.getLeadById(leadId);
    } catch (_) {}
  }

  let category = lead?.category || 'Business Automation & Lead Engine';
  const leadName = sanitizeDisplayName(lead?.name || leadId, category);
  let location = `${lead?.area || lead?.city || 'Lagos'}, Nigeria`;
  let hasWebsite = !!(lead?.website && lead.website.trim() && lead.website.toLowerCase() !== 'none');
  let rawWebsite = lead?.website || '';
  let cleanDomain = '';
  if (hasWebsite) {
    try {
      const urlObj = new URL(rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`);
      cleanDomain = urlObj.hostname.replace(/^www\./i, '');
    } catch (_) {
      cleanDomain = rawWebsite.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('?')[0];
    }
  }

  const title = hasWebsite
    ? `${leadName} — 24/7 AI Sales & Automation Upgrade Preview`
    : `${leadName} — Pre-Built Website & 24/7 AI Lead Engine Preview`;

  const description = hasWebsite
    ? `Private interactive upgrade preview for ${leadName} (${location}). Keep your live website at ${cleanDomain} and attach automated WhatsApp quoting, PDF BOQ generators, and Moniepoint/Paystack instant verification.`
    : `Exclusive pre-configured website & AI lead generation system reserved for ${leadName} in ${location}. Capture 3.5x more clients with instant WhatsApp autoresponder, interactive calculators, and automated payment receipts.`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
  const canonicalUrl = `${appUrl}/preview/${encodeURIComponent(leadId)}`;

  return {
    title,
    description,
    keywords: [
      `${leadName} Nigeria`,
      `${category} ${location}`,
      'WhatsApp AI Sales Agent Nigeria',
      'Instant Quote PDF Generator',
      'Moniepoint Transfer Verification',
      'Paystack Instant Checkout',
      'Lagos B2B Lead Automation',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Bethelmind Analytics — Client Preview Hub',
      locale: 'en_NG',
      type: 'website',
      images: [
        {
          url: `${appUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${leadName} Interactive Automation Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${appUrl}/og-image.png`],
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function PreviewLayout({ params, children }: Props) {
  const { lead_id } = await params;
  const leadId = lead_id || '';

  let lead: any = findBundledLead(leadId);
  if (!lead) {
    try {
      const repo = getActiveLeadRepository();
      lead = await repo.getLeadById(leadId);
    } catch (_) {}
  }

  let category = lead?.category || 'Commercial Enterprise';
  const leadName = sanitizeDisplayName(lead?.name || leadId, category);
  let address = `${lead?.address || ''}, ${lead?.area || ''}, ${lead?.city || 'Lagos'}`;
  let rating = lead?.rating || 4.9;
  let reviewsCount = lead?.reviews_count || 38;


  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: leadName,
    description: `Verified ${category} operations in ${address}. Features 24/7 AI WhatsApp customer quoting and automated invoice verification.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address,
      addressCountry: 'NG',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewsCount.toString(),
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.bethelmindanalytics.com/preview/${encodeURIComponent(leadId)}`,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
      },
      result: {
        '@type': 'Reservation',
        name: `Claim Automated Business System for ${leadName}`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      {children}
    </>
  );
}
