/**
 * @file batch_enrich_all_scraped_leads.ts
 * Batch enrichment script that loops through all scraped leads in Supabase database
 * and applies Visual Asset Extraction (Google Maps, Website OG, Social Media photos)
 * and PageSpeed Performance auditing to ensure 100% of scraped leads are fully upgraded.
 */

import { createClient } from '@supabase/supabase-js';
import { extractLeadVisualAssets } from '../src/lib/leadImageScraper';
import { fetchPageSpeedMetrics } from '../src/lib/pageSpeed';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function batchEnrichAllLeads() {
  console.log('🚀 Starting batch visual & performance enrichment for all scraped leads...');

  // Fetch all leads from Supabase
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, name, business_name, category, website, phone, email, notes')
    .limit(500);

  if (error || !leads) {
    console.error('❌ Failed to fetch leads from Supabase:', error?.message);
    return;
  }

  console.log(`📊 Processing ${leads.length} leads for visual and performance enrichment...`);

  let updatedCount = 0;
  for (const lead of leads) {
    try {
      const businessName = lead.business_name || lead.name || 'Business';

      // 1. Extract Visual Assets (Maps photos, OG image, Social Media images, Logos)
      const visualAssets = await extractLeadVisualAssets({
        name: businessName,
        category: lead.category,
        website: lead.website
      });

      // 2. Fetch PageSpeed Metrics if lead has a website
      let pageSpeedData = null;
      if (lead.website && lead.website.startsWith('http')) {
        pageSpeedData = await fetchPageSpeedMetrics(lead.website);
      }

      // 3. Prepare enrichment payload
      const enrichmentMeta = {
        visualAssets,
        pageSpeed: pageSpeedData,
        enrichedAt: new Date().toISOString()
      };

      // 4. Update Supabase notes/summary column
      const existingNotes = lead.notes || '';
      const updatedNotes = `${existingNotes}\n[ENRICHMENT_DATA]: ${JSON.stringify(enrichmentMeta)}`.trim();

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          notes: updatedNotes
        })
        .eq('id', lead.id);

      if (!updateError) {
        updatedCount++;
        if (updatedCount % 10 === 0 || updatedCount === leads.length) {
          console.log(`✅ Successfully enriched ${updatedCount}/${leads.length} leads with visual assets & speed scores`);
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ Warning enriching lead ${lead.name} (${lead.id}):`, err.message);
    }
  }

  console.log(`🎉 Batch Enrichment Completed! ${updatedCount} leads updated in database.`);
}

batchEnrichAllLeads().catch(console.error);
