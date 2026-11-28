import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bethelmind Business Solutions | Websites, WhatsApp Automation, BI & B2B Leads Nigeria',
  description:
    'Grow your business with smarter digital solutions. Business websites, WhatsApp sales automation, Google Business Profile, B2B lead generation, analytics, and strategy consulting for Nigerian SMEs and corporates.',
  alternates: {
    canonical: 'https://www.bethelmindanalytics.com/business-solutions',
  },
  openGraph: {
    title: 'Grow Your Business with Smarter Digital Solutions | Bethelmind',
    description:
      'From websites and WhatsApp automation to business analytics and lead generation, Bethelmind helps Nigerian businesses attract customers, improve operations and increase sales.',
    url: 'https://www.bethelmindanalytics.com/business-solutions',
    siteName: 'Bethelmind Analytics & Digital Solutions',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function BusinessSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
