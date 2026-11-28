import type { Metadata } from 'next';
import AcademicResearchClient from '../AcademicResearchClient';

export const metadata: Metadata = {
  title: 'SPSS, STATA & NVivo Statistical Analysis Support | Bethelmind Analytics',
  description:
    'Expert postgraduate statistical analysis in SPSS, STATA, R & NVivo with diagnostic testing, APA tables, and plain-English Chapter 4 interpretation.',
};

export default function StatisticalAnalysisPage() {
  return <AcademicResearchClient initialTrack="spss" />;
}
