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
  title: "Bethelmind Analytics | AI Lead Generation & Business Automation Nigeria",
  description: "Capture 3.5x more paying clients with AI-assisted WhatsApp enquiry handling, Lagos B2B lead harvesting, Solar Quote Pro, and automated Moniepoint/Paystack payment verification.",
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
    'AI sales agent Lagos',
    'Paystack payment autoresponder Nigeria',
    'Moniepoint automated business verification',
    'Abuja corporate email leads',
    'Port Harcourt business directory scraper'
  ],
  authors: [{ name: 'Bethelmind Analytics & Strategy', url: 'https://www.bethelmindanalytics.com' }],
  creator: 'Bethelmind Analytics & Strategy',
  publisher: 'Bethelmind Analytics',
  other: {
    'geo.region': 'NG-LA',
    'geo.placename': 'Lagos, Ikeja, Victoria Island, Abuja, Port Harcourt',
    'geo.position': '6.5244;3.3792',
    'ICBM': '6.5244, 3.3792',
  },
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
    title: 'Bethelmind Analytics — AI Lead Generation & Business Automation Nigeria',
    description: 'Never lose another paying client to slow replies. Automated WhatsApp AI agent, instant sector calculator quotes, Lagos B2B leads, and Moniepoint/Paystack payment verification.',
    url: 'https://www.bethelmindanalytics.com',
    siteName: 'Bethelmind Analytics',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: 'https://www.bethelmindanalytics.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bethelmind Analytics AI Lead Generation Platform Nigeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bethelmind Analytics — AI Lead Generation & Business Automation Nigeria',
    description: 'AI-assisted WhatsApp sales agent, lead harvesting, CRM, and solar quote calculators for Nigerian businesses.',
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
      description: 'Nigeria’s premier AI-powered lead generation and sales automation suite. Offering 24/7 WhatsApp AI customer care agents, Lagos B2B business lead harvesting, Solar Quote Pro calculators, and automated bank transfer verification.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressRegion: 'Lagos State',
        addressCountry: 'NG',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support & sales',
        telephone: '+2348022791227',
        email: 'contact@bethelmindanalytics.com',
        availableLanguage: ['en', 'en-NG'],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.bethelmindanalytics.com/#localbusiness',
      name: 'Bethelmind Analytics Nigeria',
      image: 'https://www.bethelmindanalytics.com/og-image.png',
      telephone: '+2348022791227',
      priceRange: '₦15,000 - ₦75,000 NGN',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ikeja, Lagos',
        addressRegion: 'Lagos',
        addressCountry: 'NG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 6.5244,
        longitude: 3.3792,
      },
      areaServed: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.bethelmindanalytics.com/#software',
      name: 'ApexReach AI Business Automation Suite',
      operatingSystem: 'All',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'NGN',
        lowPrice: '15000',
        highPrice: '75000',
        offerCount: '3',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.bethelmindanalytics.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does Bethelmind Analytics generate B2B leads in Nigeria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bethelmind Analytics utilizes automated Lagos & nationwide B2B scrapers to harvest verified business names, WhatsApp phone numbers, emails, and decision-maker contact details across 27+ Lagos districts, Abuja, and major commercial hubs in Nigeria.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does the WhatsApp AI Sales Agent work for Nigerian businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 24/7 AI Sales Agent connects to your WhatsApp business account to automatically qualify incoming customer inquiries, send instant pricing quotes, dispatch authentic Nigerian accent voice notes, and generate payment links via Moniepoint or Paystack.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is Solar Quote Pro Nigeria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Solar Quote Pro is an interactive standalone calculator that enables Nigerian solar installers to let clients calculate exact inverter and battery system requirements, generating accurate pricing PDF quotes in under 2 minutes.'
          }
        }
      ]
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
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
