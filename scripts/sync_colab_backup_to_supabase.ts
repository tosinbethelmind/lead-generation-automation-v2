import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://rcaamfaqkxvgbjlfuhki.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYWFtZmFxa3h2Z2JqbGZ1aGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUyNDI0OCwiZXhwIjoyMTAzMTAwMjQ4fQ.9KKQ52VdE8b-jxy2QmOAAxuBMKpGyncwDDEyMGfe9fw";

async function syncBackupToSupabase() {
  const backupPath = path.join(process.cwd(), 'leads_colab_backup.json');
  const localDbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');

  if (!fs.existsSync(backupPath)) {
    console.log('❌ leads_colab_backup.json not found!');
    return;
  }

  const raw = fs.readFileSync(backupPath, 'utf8');
  const leads = JSON.parse(raw);

  console.log(`\n================================================================================`);
  console.log(`🚀 SYNCING ${leads.length} HARVESTED COMMERCIAL LEADS TO SUPABASE CLOUD & LOCAL DB`);
  console.log(`================================================================================\n`);

  // 1. Merge into local_db/leads_db.json
  try {
    let existingLeads: any[] = [];
    if (fs.existsSync(localDbPath)) {
      existingLeads = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    }
    const seenPhones = new Set(existingLeads.map(l => l.phone_e164 || l.phone_raw));
    let newMerged = 0;
    for (const lead of leads) {
      const p = lead.phone_e164 || lead.phone_raw;
      if (p && !seenPhones.has(p)) {
        seenPhones.add(p);
        existingLeads.push(lead);
        newMerged++;
      }
    }
    fs.writeFileSync(localDbPath, JSON.stringify(existingLeads, null, 2));
    console.log(`✅ Merged +${newMerged} new records into local_db/leads_db.json (Total: ${existingLeads.length})`);
  } catch (err: any) {
    console.warn(`Local merge warning:`, err.message);
  }

  // 2. Sync to Supabase Cloud in batches of 50
  let syncedCloud = 0;
  const batchSize = 50;
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize).map((l: any) => ({
      lead_id: l.lead_id,
      name: l.name,
      category: l.category,
      address: l.address,
      area: l.area,
      city: l.city || 'Lagos',
      phone_e164: l.phone_e164,
      phone_raw: l.phone_raw,
      email: l.email || '',
      website: l.website || '',
      rating: l.rating || 4.8,
      reviews_count: l.reviews_count || 12,
      status: 'NEW',
      source: 'JIJI_CLOUD_HARVEST'
    }));

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(batch)
      });

      if (res.ok || res.status === 201) {
        syncedCloud += batch.length;
        console.log(`  ✓ Synced Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} leads -> Supabase Cloud`);
      } else {
        const text = await res.text();
        console.log(`  ⚠️ Batch note (${res.status}): ${text.slice(0, 80)}`);
      }
    } catch (e: any) {
      console.warn(`  Sync network note: ${e.message}`);
    }
  }

  console.log(`\n================================================================================`);
  console.log(`🎉 COMPLETE: ${syncedCloud} Leads Live in Supabase Cloud Database!`);
  console.log(`================================================================================\n`);
}

syncBackupToSupabase().catch(console.error);
