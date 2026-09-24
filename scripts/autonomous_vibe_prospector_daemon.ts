/**
 * @file scripts/autonomous_vibe_prospector_daemon.ts
 * 
 * 🚀 Bethelmind Analytics - Autonomous 24/7 Vibe Prospecting Daemon
 * Continuously discovers and stages Nigerian commercial leads without human intervention.
 * 
 * Target Rotations:
 * 1. Solar & Inverter Contractors (Lagos, Abuja, PH, Ibadan, Onitsha)
 * 2. Healthcare, Dental & Eye Clinics (VI, Lekki, Ikeja, Wuse)
 * 3. Commercial Real Estate & Shortlets (Ikoyi, Lekki, Maitama)
 * 4. Auto Dealerships & Repair Centers (Berger, Ikeja, Garki)
 * 5. Private Schools & Academies (Lagos, Port Harcourt, Ibadan)
 * 6. Freight & Industrial Importers (Trade Fair, ASPAMDA, Onitsha)
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { localVibeProspector, VibeProspectLead } from '../src/lib/scraping/localVibeProspectorEngine';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) {
  fs.mkdirSync(LOCAL_DB, { recursive: true });
}
const LEADS_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');
const CRM_LEADS_PATH = path.join(LOCAL_DB, 'crm_leads.json');
const DAEMON_LOG_PATH = path.join(LOCAL_DB, 'vibe_daemon.log');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rcaamfaqkxvgbjlfuhki.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYWFtZmFxa3h2Z2JqbGZ1aGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUyNDI0OCwiZXhwIjoyMTAzMTAwMjQ4fQ.9KKQ52VdE8b-jxy2QmOAAxuBMKpGyncwDDEyMGfe9fw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [VIBE_DAEMON] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(DAEMON_LOG_PATH, line + '\n', 'utf8');
  } catch (_) {}
}

const AUTONOMOUS_VIBE_SECTORS = [
  'Find 15 solar inverter suppliers in Ikeja Lagos',
  'Find 15 private dental and specialist clinics in Victoria Island Lagos',
  'Find 15 commercial real estate agencies in Lekki Phase 1',
  'Find 15 solar and renewable energy companies in Abuja FCT',
  'Find 15 auto dealerships and luxury car dealers in Berger Lagos',
  'Find 15 private secondary schools and academies in Ikeja Lagos',
  'Find 15 boutique hotels and luxury shortlets in Ikoyi Lagos',
  'Find 15 solar inverter equipment distributors in Alaba International Market',
  'Find 15 logistics and haulage companies in Apapa Lagos',
  'Find 15 solar energy companies in Port Harcourt Rivers'
];

async function runVibeHarvestCycle(): Promise<{ harvested: number; staged: number }> {
  log('⚡ Starting Autonomous Vibe Prospecting Cycle across high-value Nigerian commercial sectors...');

  // Pick rotation target based on current hour
  const rotationIndex = Math.floor((Date.now() / (1000 * 60 * 30))) % AUTONOMOUS_VIBE_SECTORS.length;
  const currentPrompt = AUTONOMOUS_VIBE_SECTORS[rotationIndex];

  log(`🎯 Active Sector Prompt: "${currentPrompt}"`);

  const leads = await localVibeProspector.prospect(currentPrompt, 15);
  log(`📥 Harvested ${leads.length} leads from headless web footprints.`);

  if (leads.length === 0) {
    return { harvested: 0, staged: 0 };
  }

  // 1. Stage into local_db/leads_db.json
  let existingLeads: any[] = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try {
      existingLeads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
    } catch (_) {
      existingLeads = [];
    }
  }

  const existingPhones = new Set(existingLeads.map((e: any) => e.phone || e.phoneE164));
  const newLeadsToStage: any[] = [];

  for (const lead of leads) {
    if (!existingPhones.has(lead.phone) && !existingPhones.has(lead.phoneE164)) {
      const record = {
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
      };

      existingLeads.unshift(record);
      newLeadsToStage.push(record);
      existingPhones.add(lead.phone);
    }
  }

  if (newLeadsToStage.length > 0) {
    fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(existingLeads, null, 2), 'utf8');
    log(`💾 Staged ${newLeadsToStage.length} new unique leads into local_db/leads_db.json (Total DB: ${existingLeads.length})`);

    // 2. Sync to Supabase Cloud in background
    try {
      const supabaseRows = newLeadsToStage.map(l => ({
        id: l.id,
        business_name: l.name,
        phone: l.phone,
        email: l.email || null,
        category: l.category,
        city: l.area,
        address: l.address,
        has_website: l.hasWebsite,
        website_url: l.website || null,
        preview_url: l.preview_url,
        source: 'local_vibe_prospector'
      }));

      const { error } = await supabase.from('leads').upsert(supabaseRows, { onConflict: 'id' });
      if (error) {
        log(`⚠️ Supabase cloud sync notice: ${error.message}`);
      } else {
        log(`☁️ Successfully synced ${newLeadsToStage.length} leads to Supabase Cloud.`);
      }
    } catch (e: any) {
      log(`⚠️ Non-fatal Supabase sync error: ${e.message}`);
    }
  } else {
    log(`ℹ️ All harvested leads were already present in local_db/leads_db.json (Zero duplicate dispatch guaranteed).`);
  }

  return { harvested: leads.length, staged: newLeadsToStage.length };
}

async function main() {
  const isOnce = process.argv.includes('--once');

  console.log('================================================================');
  console.log('🚀 BETHELMIND ANALYTICS: AUTONOMOUS 24/7 VIBE PROSPECTOR DAEMON');
  console.log('================================================================\n');

  if (isOnce) {
    await runVibeHarvestCycle();
    process.exit(0);
  }

  // Continuous background runner (every 30 minutes)
  log('🔄 Starting continuous 30-minute autonomous prospecting loop...');
  while (true) {
    try {
      await runVibeHarvestCycle();
    } catch (err: any) {
      log(`❌ Cycle error: ${err.message}`);
    }
    log('⏳ Sleeping 30 minutes until next rotation...\n');
    await new Promise(r => setTimeout(r, 30 * 60 * 1000));
  }
}

main().catch(err => {
  log(`❌ Daemon fatal error: ${err.message}`);
  process.exit(1);
});
