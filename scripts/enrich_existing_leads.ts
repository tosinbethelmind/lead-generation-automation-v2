/**
 * @file enrich_existing_leads.ts
 * Retroactively sweeps through all leads currently in the database
 * and processes any missing contact emails/phones or outreach channels.
 */

import { getLeads, updateLeadFields, addLog, Lead } from '../src/lib/googleSheets';
import { enrichLeadContacts } from '../src/lib/leadEnricher';

async function retroEnrich() {
  console.log('🔄 Starting Retroactive enrichment for all scraped leads...\n');
  await addLog('Retro-Enrichment', 'START', 'Starting retrograde analysis of already scraped leads');

  try {
    const leads = await getLeads();
    console.log(`Fetched ${leads.length} leads from database.`);

    // Find leads missing phone or email, or those needing outreach channels populated
    const targets = leads.filter(lead => {
      const hasDirectInfo = !!(lead.phone_e164 || lead.email);
      const isMissingNotesChannels = !(lead.notes || '').includes('[Outreach Channels');
      return !hasDirectInfo || isMissingNotesChannels;
    });

    console.log(`Found ${targets.length} leads that can be retroactively enriched/updated.\n`);

    if (targets.length === 0) {
      console.log('✅ All leads already possess outreach channels & contact details. Exiting.');
      return;
    }

    let updatedCount = 0;
    for (let i = 0; i < targets.length; i++) {
      const lead = targets[i];
      console.log(`[${i + 1}/${targets.length}] Processing: "${lead.name}" (${lead.lead_id})`);

      try {
        const enriched = await enrichLeadContacts(lead);
        
        const updates: Partial<Lead> = {};
        let needsUpdate = false;

        // Apply newly found email/phones
        if (enriched.email && lead.email !== enriched.email) {
          updates.email = enriched.email;
          needsUpdate = true;
        }
        if (enriched.phone && lead.phone_e164 !== enriched.phone) {
          updates.phone_e164 = enriched.phone;
          updates.phone_raw = enriched.phone;
          needsUpdate = true;
        }

        // Apply generated socials
        if (enriched.socials && Object.keys(enriched.socials).length > 0) {
          const currentSocials = lead.social_links ? JSON.parse(lead.social_links) : {};
          const mergedSocials = { ...currentSocials, ...enriched.socials };
          updates.social_links = JSON.stringify(mergedSocials);
          needsUpdate = true;
        }

        // Apply notes (Outreach links / ratings)
        if (lead.notes !== lead.notes) {
          updates.notes = lead.notes;
          needsUpdate = true;
        }

        if (needsUpdate) {
          console.log(`   └─ Updating fields. Phone: ${updates.phone_e164 || 'no change'}, Email: ${updates.email || 'no change'}`);
          await updateLeadFields(lead.lead_id, updates);
          updatedCount++;
        }
      } catch (err: any) {
        console.warn(`   └─ Failed to enrich details for "${lead.name}":`, err.message);
      }

      // Respect API rate limits on browserless/DuckDuckGo searches
      await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n🎉 Retro-enrichment complete. Successfully updated ${updatedCount} leads.`);
    await addLog('Retro-Enrichment', 'SUCCESS', `Updated ${updatedCount} leads successfully.`);
  } catch (error: any) {
    console.error('Fatal retro check failed:', error);
    await addLog('Retro-Enrichment', 'ERROR', `Fatal: ${error.message}`);
  }
}

retroEnrich();
