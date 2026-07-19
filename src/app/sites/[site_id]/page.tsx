import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';

// Revalidate every 60 seconds so updated configs propagate quickly without full rebuild
export const revalidate = 60;
// Always render dynamically so middleware subdomain rewriting works correctly
export const dynamic = 'force-dynamic';


interface PreviewData {
  lead: {
    name: string;
    category: string;
    address: string;
    area: string;
    city: string;
    phone_raw: string;
    phone_e164: string;
    rating: number;
    reviews_count: number;
    business_summary: string;
    website?: string;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    heroImage: string;
    gradient: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: { title: string; description: string; icon: string }[];
    aboutText: string;
    testimonials: { name: string; text: string; rating: number }[];
    ctaText: string;
  };
}

export default async function DeployedSitePage({ params }: { params: Promise<{ site_id: string }> }) {
  const resolvedParams = await params;
  const siteId = resolvedParams.site_id;

  let siteData: PreviewData | null = null;

  // 1. Try to load from the committed Git-backed config file
  try {
    const configPath = path.join(process.cwd(), 'src', 'data', 'sites', `${siteId}.json`);
    if (fs.existsSync(configPath)) {
      const fileContent = fs.readFileSync(configPath, 'utf-8');
      siteData = JSON.parse(fileContent);
      console.log(`Loaded site data from Git-backed config file for ${siteId}`);
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error reading site config from file system:', error.message);
  }

  // 2. Fallback to loading dynamically from CRM/Database if the Vercel rebuild is still queueing
  if (!siteData) {
    try {
      const repo = getActiveLeadRepository();
      const lead = await repo.getLeadById(siteId);
      
      if (lead) {
        const theme = getDesignTheme(lead.category);
        const copy = buildFallbackCopy(lead);
        
        siteData = {
          lead,
          theme,
          copy
        };
        console.log(`Loaded fallback dynamic site data for ${siteId} from CRM/Database`);
      }
    } catch (dbErr: unknown) {
      const error = dbErr as Error;
      console.error('Error reading fallback lead from database:', error.message);
    }
  }

  // 3. 404 if not found in either system
  if (!siteData) {
    notFound();
  }

  return <LandingPage data={siteData} leadId={siteId} isPreview={false} />;
}
