/**
 * @file scripts/vibe_prospect.ts
 * 
 * 🎯 Bethelmind Analytics - Interactive Local Vibe Prospecting CLI
 * Zero-Sign-Up Natural Language Lead Discovery across Nigeria
 * 
 * Usage:
 *   npx tsx scripts/vibe_prospect.ts "Find 15 solar inverter installers in Ikeja"
 *   npx tsx scripts/vibe_prospect.ts "Find 20 dental clinics in Lekki" --stage
 */

import fs from 'fs';
import path from 'path';
import { localVibeProspector, VibeProspectLead } from '../src/lib/scraping/localVibeProspectorEngine';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) {
  fs.mkdirSync(LOCAL_DB, { recursive: true });
}
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const CRM_LEADS_PATH = path.join(LOCAL_DB, 'crm_leads.json');

async function main() {
  const args = process.argv.slice(2);
  const shouldStage = args.includes('--stage');
  const cleanArgs = args.filter(a => a !== '--stage');
  
  const query = cleanArgs.join(' ') || 'Find 10 solar inverter companies in Ikeja Lagos';

  console.log('================================================================');
  console.log('🚀 BETHELMIND ANALYTICS: LOCAL VIBE PROSPECTING SYSTEM (2026)');
  console.log('⚡ 100% Free, Zero Third-Party Sign-up, Real Nigerian Businesses');
  console.log('================================================================\n');

  console.log(`💬 User Vibe Prompt: "${query}"`);

  const startTime = Date.now();
  const leads = await localVibeProspector.prospect(query, 15);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Completed in ${duration}s! Discovered ${leads.length} verified Nigerian commercial leads:\n`);

  if (leads.length === 0) {
    console.log('⚠️ No leads matched this exact footprint. Try widening location or sector terms.');
    return;
  }

  // Display clean formatted results table
  console.table(leads.map((l, index) => ({
    '#': index + 1,
    'Business Name': l.name.length > 25 ? l.name.substring(0, 23) + '..' : l.name,
    'Phone': l.phone,
    'Carrier': l.carrier,
    'Sector': l.category,
    'Area': l.area,
    'Sector Tool': l.sectorTool,
    'Website': l.hasWebsite ? 'YES' : 'NO'
  })));

  console.log('\n🔗 Sample Prototype Preview URLs Generated:');
  leads.slice(0, 3).forEach((l, i) => {
    console.log(`   [${i + 1}] ${l.name}: ${l.previewUrl}`);
  });

  // Stage leads to local database if requested or default
  if (shouldStage || true) {
    let existingLeads: any[] = [];
    if (fs.existsSync(LEADS_DB_PATH)) {
      try {
        existingLeads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
      } catch (_) {
        existingLeads = [];
      }
    }

    const existingPhones = new Set(existingLeads.map((e: any) => e.phone || e.phoneE164));
    let newStagedCount = 0;

    for (const lead of leads) {
      if (!existingPhones.has(lead.phone) && !existingPhones.has(lead.phoneE164)) {
        existingLeads.unshift({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          phoneE164: lead.phoneE164,
          carrier: lead.carrier,
          email: lead.email,
          category: lead.category,
          sector: lead.category,
          sectorTool: lead.sectorTool,
          area: lead.area,
          state: lead.state,
          address: lead.address,
          hasWebsite: lead.hasWebsite,
          website: lead.websiteUrl,
          preview_url: lead.previewUrl,
          source: lead.source,
          status: 'UNTOUCHED',
          created_at: lead.discoveredAt
        });
        existingPhones.add(lead.phone);
        newStagedCount++;
      }
    }

    fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(existingLeads, null, 2), 'utf8');
    console.log(`\n💾 Auto-Staged ${newStagedCount} new unique leads directly to local_db/leads_db.json!`);
    console.log(`📊 Total Leads in Master Database: ${existingLeads.length}`);
  }

  console.log('\n================================================================');
  console.log('🎯 Ready for Master Outreach Engine (Emails / SMS / WhatsApp Bubbles)');
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('❌ CLI Error:', err);
  process.exit(1);
});
