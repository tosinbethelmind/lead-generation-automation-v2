import React, { Suspense } from 'react';
import { Metadata } from 'next';
import EmbedCalculatorClient from './EmbedCalculatorClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  props: { params: Promise<{ toolId: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const toolName = params.toolId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${toolName} | 2026 Instant Sector Calculator Widget`,
    description: `Embeddable 2026 Nigerian business calculator for ${toolName}. Ready to embed on WordPress, Shopify, Wix, and custom websites.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EmbedToolPage(
  props: { params: Promise<{ toolId: string }> }
) {
  const params = await props.params;
  const toolId = params.toolId;

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Calculator Widget…</div>}>
      <EmbedCalculatorClient toolId={toolId} />
    </Suspense>
  );
}
