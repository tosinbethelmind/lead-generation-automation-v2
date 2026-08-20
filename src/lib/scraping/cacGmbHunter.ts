/**
 * @file src/lib/scraping/cacGmbHunter.ts
 * 
 * High-Intent Corporate Registry (CAC) & Unclaimed Google Business (GMB) Infiltration Harvester.
 * 
 * Extracts high-propensity corporate leads in their "Golden 72-Hour Window":
 * 1. Newly incorporated Nigerian businesses needing SCUML, domain, website, and WhatsApp close bot.
 * 2. Unclaimed or low-rating GMB profiles in Lagos high-density commercial corridors (Lekki, VI, Ikeja).
 */

import { getSupabaseClient } from '../supabaseClient';

export interface HighIntentLead {
  companyName: string;
  category: string;
  area: string;
  phone: string;
  email?: string;
  source: 'CAC_REGISTRATION' | 'UNCLAIMED_GMB' | 'COMMERCIAL_CORRIDOR';
  priorityScore: number;
  painPoint: string;
  recommendedProduct: string;
}

export const LAGOS_COMMERCIAL_CORRIDORS = [
  'Lekki Phase 1, Admiralty Way',
  'Victoria Island, Adeola Odeku',
  'Ikeja GRA, Allen Avenue',
  'Ikoyi, Awolowo Road',
  'Surulere, Adeniran Ogunsanya',
  'Yaba, Herbert Macaulay Way',
  'Magodo Phase 2, Shangisha',
  'Ajah, Badore Road'
];

export const PRIORITY_SECTORS = [
  { id: 'clinic', name: 'Dental & Aesthetics Clinics', product: 'luxury-health', pitch: 'MDCN Safety & Online Veneer Booking' },
  { id: 'solar', name: 'Solar & Renewable Energy Firms', product: 'solar-buster', pitch: 'Anti-Fake Lithium & Sizing Sizer' },
  { id: 'legal', name: 'Startups & SMEs', product: 'sme-legal', pitch: 'SCUML Bank Compliance & Contract Vault' },
  { id: 'realestate', name: 'Shortlet & Real Estate Operators', product: 'shortlet-os', pitch: 'Caution Deposit & Sublease Defense OS' },
  { id: 'auto', name: 'Auto Detailing & Dealerships', product: 'auto-customs', pitch: 'VIN Customs Duty Verification' }
];

/**
 * Filter and validate phone number to strictly enforce Section 5 zero-synthetic policy.
 */
export function validateGenuinePhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return false;
  if (/0000|1111|2222|3333|4444|5555|6666|7777|8888|9999/.test(digits)) return false;
  if (/123456|654321/.test(digits)) return false;
  return true;
}

/**
 * Stage verified high-intent leads into Supabase Cloud.
 */
export async function stageHighIntentLeads(leads: HighIntentLead[]): Promise<{ inserted: number; skipped: number }> {
  const supabase = getSupabaseClient();
  let inserted = 0;
  let skipped = 0;

  for (const lead of leads) {
    if (!validateGenuinePhone(lead.phone)) {
      skipped++;
      continue;
    }

    try {
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('phone', lead.phone)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      await supabase.from('leads').insert({
        company: lead.companyName,
        phone: lead.phone,
        email: lead.email || null,
        sector: lead.category,
        location: lead.area,
        status: 'STAGED_FOR_DISPATCH',
        score: lead.priorityScore,
        metadata: {
          source: lead.source,
          painPoint: lead.painPoint,
          recommendedProduct: lead.recommendedProduct,
          harvestedAt: new Date().toISOString()
        }
      });
      inserted++;
    } catch (_) {
      skipped++;
    }
  }

  return { inserted, skipped };
}
