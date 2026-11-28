import type { Metadata } from 'next';
import AcademicResearchClient from '../AcademicResearchClient';

export const metadata: Metadata = {
  title: 'PhD Research Methodology Consultation | Bethelmind Analytics',
  description:
    'Doctoral research methodology consultation covering philosophical design, econometric/mixed-methods frameworks, and viva readiness.',
};

export default function PhdMethodologyPage() {
  return <AcademicResearchClient initialTrack="phd" />;
}
