import type { Metadata } from 'next';
import AcademicResearchClient from './AcademicResearchClient';

export const metadata: Metadata = {
  title: 'Postgraduate Academic Research Support (MSc, MBA & PhD) | Bethelmind Analytics & Strategy',
  description:
    'From research topic to final thesis: expert support with research methodology, SPSS/STATA/NVivo data analysis, systematic literature reviews, referencing, and journal publication.',
  alternates: {
    canonical: 'https://www.bethelmindanalytics.com/academic-research',
  },
  openGraph: {
    title: 'Struggling With Your MSc, MBA or PhD Thesis? | Bethelmind Analytics & Strategy',
    description:
      'Get expert postgraduate research support with methodology, dissertation chapters, SPSS/STATA/NVivo statistical analysis, and publication readiness.',
    url: 'https://www.bethelmindanalytics.com/academic-research',
    type: 'website',
  },
};

export default function AcademicResearchPage() {
  return <AcademicResearchClient />;
}
