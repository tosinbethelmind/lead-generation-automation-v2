import type { Metadata } from 'next';
import AcademicResearchClient from '../AcademicResearchClient';

export const metadata: Metadata = {
  title: 'MSc & MBA Dissertation Consultation | Bethelmind Analytics',
  description:
    'Structured MSc and MBA dissertation consultation covering topic refinement, Chapter 3 methodology, data analysis, and supervisor corrections.',
};

export default function MscMbaDissertationPage() {
  return <AcademicResearchClient initialTrack="msc" />;
}
