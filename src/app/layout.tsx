import type { Metadata, Viewport } from "next";
import "../styles/tokens.css";
import "../styles/glass.css";
import "./globals.css";
import DbHealthCheck from "@/components/DbHealthCheck";
import { ThemeProvider } from "./ThemeContext";

export const viewport: Viewport = {
  themeColor: "#070a12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Bethelmind Analytics | AI Lead Generation & Business Automation Platform for Nigerian Enterprises",
  description: "Nigeria's #1 AI-powered B2B lead generation & sales automation platform. Extract verified Lagos business contacts, deploy 24/7 AI Customer Care Agents, automate WhatsApp voice notes, and scale revenue effortlessly.",
  metadataBase: new URL('https://www.bethelmindanalytics.com'),
  alternates: {
    canonical: 'https://www.bethelmindanalytics.com',
  },
  keywords: [
    'AI lead generation Nigeria',
    'Lagos B2B lead database',
    'WhatsApp automation Lagos',
    'AI customer care agent Nigeria',
    'Solar Quote Pro calculator',
    'Nigerian business automation',
    'WhatsApp voice note generator',
    'Lagos enterprise lead harvester',
    'Automated B2B outreach Nigeria',
    'AI sales agent Lagos'
  ],
  authors: [{ name: 'Bethelmind Analytics & Strategy', url: 'https://www.bethelmindanalytics.com' }],
  creator: 'Bethelmind Analytics & Strategy',
  publisher: 'Bethelmind Analytics',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Bethelmind Analytics — Premier AI Lead Generation & Business Automation Nigeria',
    description: 'Harvest verified Lagos B2B leads, automate WhatsApp outreach with native voice notes, and let a 24/7 AI Sales Agent close deals for your business.',
    url: 'https://www.bethelmindanalytics.com',
    siteName: 'Bethelmind Analytics',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: 'https://www.bethelmindanalytics.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bethelmind Analytics AI Lead Generation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bethelmind Analytics — AI Lead Generation & Business Automation',
    description: "Nigeria's most advanced AI lead generation and revenue automation platform.",
    images: ['https://www.bethelmindanalytics.com/og-image.png'],
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.bethelmindanalytics.com/#organization',
      name: 'Bethelmind Analytics & Strategy',
      url: 'https://www.bethelmindanalytics.com',
      logo: 'https://www.bethelmindanalytics.com/favicon.ico',
      description: "Nigeria's premier AI-powered B2B lead generation, WhatsApp automation, and sales AI agent platform.",
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+2348022791227',
        email: 'tosin@bethelmindanalytics.com',
        availableLanguage: ['en', 'en-NG'],
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.bethelmindanalytics.com/#software',
      name: 'Bethelmind Analytics AI Business Suite',
      operatingSystem: 'All',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'NGN',
        lowPrice: '15000',
        highPrice: '150000',
        offerCount: '4',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '38',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.bethelmindanalytics.com/#website',
      url: 'https://www.bethelmindanalytics.com',
      name: 'Bethelmind Analytics',
      publisher: {
        '@id': 'https://www.bethelmindanalytics.com/#organization',
      },
      inLanguage: 'en-NG',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <DbHealthCheck />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
