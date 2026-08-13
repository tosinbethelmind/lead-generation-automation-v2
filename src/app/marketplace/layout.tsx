import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Lead Marketplace & AI Sales Engines Nigeria | Bethelmind Analytics',
  description: 'Deploy verified Lagos B2B lead packages, 24/7 WhatsApp AI sales agents, Nigerian voice note generators, and Solar Quote Pro tools. Instant setup, transparent NGN pricing.',
  openGraph: {
    title: 'B2B Lead Marketplace & AI Sales Engines Nigeria — Bethelmind Analytics',
    description: 'Explore instant B2B lead database access, WhatsApp CRM automation, and sector-specific tools for Nigerian businesses.',
    url: 'https://www.bethelmindanalytics.com/marketplace',
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
