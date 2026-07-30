/**
 * Lead Classification Engine
 * Categorizes leads scraped from Lagos 10k & nationwide sources into:
 * - SOLAR_COMPANY_HYBRID: Solar Installers & Renewable Energy Companies
 * - REGULAR_BUSINESS_WEBSITE: Commercial Businesses (Hotels, Hospitals, Law Firms, etc.)
 */

export type CampaignTrack = 'SOLAR_COMPANY_HYBRID' | 'REGULAR_BUSINESS_WEBSITE';

export interface LeadInput {
  id?: string;
  name?: string;
  company_name?: string;
  title?: string;
  category?: string;
  description?: string;
  website?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface ClassifiedLead extends LeadInput {
  campaign_track: CampaignTrack;
  classification_reason: string;
  classification_confidence: number; // 0.0 - 1.0
  tags: string[];
}

const SOLAR_KEYWORDS = [
  'solar',
  'inverter',
  'renewable',
  'photovoltaic',
  'clean energy',
  'green energy',
  'solar power',
  'solar panel',
  'solar energy',
  'lithium battery',
  'solar technology',
  'solar solution',
  'solar systems',
  'solar quote',
  'solar installer',
  'renewable energy'
];

/**
 * Classifies a single lead object into SOLAR_COMPANY_HYBRID or REGULAR_BUSINESS_WEBSITE.
 */
export function classifyLead(lead: LeadInput): ClassifiedLead {
  const nameText = `${lead.name || ''} ${lead.company_name || ''} ${lead.title || ''}`.toLowerCase();
  const categoryText = (lead.category || '').toLowerCase();
  const descText = (lead.description || '').toLowerCase();
  const webText = (lead.website || '').toLowerCase();
  const combinedText = `${nameText} ${categoryText} ${descText} ${webText}`;

  const matchedKeywords: string[] = [];

  for (const keyword of SOLAR_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  const isSolar = matchedKeywords.length > 0;
  const existingTags = Array.isArray(lead.metadata?.tags) ? (lead.metadata?.tags as string[]) : [];

  if (isSolar) {
    const confidence = Math.min(1.0, 0.7 + matchedKeywords.length * 0.1);
    return {
      ...lead,
      campaign_track: 'SOLAR_COMPANY_HYBRID',
      classification_reason: `Matched solar keywords: ${matchedKeywords.join(', ')}`,
      classification_confidence: Number(confidence.toFixed(2)),
      tags: Array.from(new Set([...existingTags, 'SOLAR_COMPANY_HYBRID', ...matchedKeywords]))
    };
  }

  return {
    ...lead,
    campaign_track: 'REGULAR_BUSINESS_WEBSITE',
    classification_reason: 'No solar/inverter keywords found. Categorized as general business website prospect.',
    classification_confidence: 0.95,
    tags: Array.from(new Set([...existingTags, 'REGULAR_BUSINESS_WEBSITE']))
  };
}

/**
 * Batch classifies an array of leads.
 */
export function classifyLeadBatch(leads: LeadInput[]): ClassifiedLead[] {
  return leads.map(classifyLead);
}
