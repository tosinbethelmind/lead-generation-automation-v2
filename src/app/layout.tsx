import type { Metadata } from "next";
import "../styles/tokens.css";
import "../styles/glass.css";
import "./globals.css";
import DbHealthCheck from "@/components/DbHealthCheck";
import { ThemeProvider } from "./ThemeContext";

export const metadata: Metadata = {
  title: "Bethelmind Analytics | AI Lead Generation Platform for Nigerian Businesses",
  description: "Nigeria's #1 AI-powered B2B lead generation platform. Harvest 10,000+ verified Lagos leads, automate outreach, and let your 24/7 AI Agent close deals. Serving 38+ businesses across Lagos.",
  metadataBase: new URL('https://www.bethelmindanalytics.com'),
  openGraph: {
    title: 'Bethelmind Analytics — AI Lead Generation for Nigerian Businesses',
    description: 'Harvest 10K+ Lagos leads, AI customer agent, WhatsApp voice notes & outreach automation. Start in 30 minutes.',
    url: 'https://www.bethelmindanalytics.com',
    siteName: 'Bethelmind Analytics',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bethelmind Analytics — AI Lead Generation for Nigerian Businesses',
    description: 'Nigeria\'s most powerful AI lead generation and business automation platform.',
  },
  keywords: ['lead generation Nigeria', 'Lagos B2B leads', 'AI customer agent Nigeria', 'WhatsApp automation Lagos', 'business automation Nigeria'],
  robots: { index: true, follow: true },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <DbHealthCheck />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

