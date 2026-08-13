import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Sales Partner & Commission Agent Network Nigeria | Bethelmind Analytics',
  description: 'Join Nigeria’s high-growth AI sales agency network. Earn weekly commissions onboarding Lagos, Abuja, and Port Harcourt businesses to Bethelmind AI lead automation.',
  openGraph: {
    title: 'Join Bethelmind AI Sales Partner Network — High Weekly Commissions',
    description: 'Empower Nigerian businesses with AI automation and earn lucrative recurring commission payouts.',
    url: 'https://www.bethelmindanalytics.com/recruitment',
  },
};

export default function RecruitmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
