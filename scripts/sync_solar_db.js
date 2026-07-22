/**
 * @file scripts/sync_solar_db.js
 * Synchronize all solar leads from Main Supabase DB to SolarQuotePro DB with clean schema mapping.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

const localEnvPath = path.resolve(process.cwd(), '.env.local');
parseEnvFile(localEnvPath);

const MAIN_SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://szyuterncawfxwzhvwcf.supabase.co';
const MAIN_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY';

const SOLARQUOTEPRO_URL = process.env.SOLARQUOTEPRO_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const SOLARQUOTEPRO_KEY = process.env.SOLARQUOTEPRO_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabaseMain = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_KEY, { auth: { persistSession: false } });
const supabaseSolar = createClient(SOLARQUOTEPRO_URL, SOLARQUOTEPRO_KEY, { auth: { persistSession: false } });

async function syncSolarLeads() {
  console.log('==================================================');
  console.log('⚡ SOLAR DB SYNCHRONIZATION PIPELINE');
  console.log('==================================================\n');

  let page = 0;
  const pageSize = 500;
  let totalFetched = 0;
  let totalSynced = 0;

  while (true) {
    const { data: leads, error } = await supabaseMain
      .from('leads')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads from Main DB:', error.message);
      break;
    }

    if (!leads || leads.length === 0) break;
    totalFetched += leads.length;

    // Filter solar leads
    const solarLeads = leads.filter(l => {
      const txt = `${l.category || ''} ${l.source_query_or_seed || ''} ${l.notes || ''} ${l.name || ''}`.toLowerCase();
      return txt.includes('solar') || txt.includes('inverter') || txt.includes('clean energy');
    });

    if (solarLeads.length > 0) {
      const cleanSolarLeads = solarLeads.map(l => ({
        lead_id: l.lead_id,
        source: l.source || 'GOOGLE',
        name: l.name || 'Solar Business',
        business_name: l.business_name || l.name || 'Solar Business',
        category: l.category || 'solar_installer',
        address: l.address || '',
        city: l.city || '',
        phone: l.phone || l.phone_e164 || '',
        phone_e164: l.phone_e164 || l.phone || '',
        email: l.email || '',
        website: l.website || '',
        rating: l.rating || 4.5,
        reviews_count: l.reviews_count || 10,
        verified: l.verified !== false,
        source_query_or_seed: l.source_query_or_seed || 'solar_nigeria_5k',
        status: l.status || 'NEW',
        notes: l.notes || ''
      }));

      // Upsert into SolarQuotePro DB leads table
      const { error: syncErr } = await supabaseSolar
        .from('leads')
        .upsert(cleanSolarLeads, { onConflict: 'lead_id', ignoreDuplicates: false });

      if (syncErr) {
        console.error('Error upserting to SolarQuotePro DB:', syncErr.message);
      } else {
        totalSynced += cleanSolarLeads.length;
        console.log(`✓ Synced batch of ${cleanSolarLeads.length} solar leads to SolarQuotePro DB.`);
      }
    }

    if (leads.length < pageSize) break;
    page++;
  }

  console.log('\n--------------------------------------------------');
  console.log(`✅ Synchronization Complete!`);
  console.log(`Total Leads Processed: ${totalFetched}`);
  console.log(`Total Solar Leads Synced: ${totalSynced}`);
  console.log('--------------------------------------------------\n');
}

syncSolarLeads().catch(console.error);
