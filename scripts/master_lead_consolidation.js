/**
 * master_lead_consolidation.js
 * 
 * Merges all fragmented lead databases, backup temp files, CSVs, and Excel sheets
 * into ONE single master database (`local_db/leads_db.json`), deduplicates them,
 * uploads to Supabase, and cleans up temporary files.
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const rootDir = process.cwd();
const localDbDir = path.join(rootDir, 'local_db');

const masterLeadsMap = new Map();

function getLeadKey(lead) {
  if (!lead || typeof lead !== 'object') return null;
  const phone = lead.phone || lead.phone_e164 || lead.phone_raw;
  if (phone && typeof phone === 'string' && phone.trim().length > 6) {
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length >= 7) return `phone:${cleanDigits.slice(-10)}`;
  }
  const id = lead.id || lead.lead_id;
  if (id && typeof id === 'string' && id.trim().length > 0 && !id.startsWith('temp_')) {
    return `id:${id.trim().toLowerCase()}`;
  }
  const name = lead.name || lead.title || lead.business_name;
  if (name && typeof name === 'string' && name.trim().length > 2) {
    return `name:${name.trim().toLowerCase()}`;
  }
  return null;
}

function mergeLead(existing, incoming) {
  return {
    id: incoming.id || existing.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: incoming.name || incoming.title || incoming.business_name || existing.name || 'Commercial Business',
    title: incoming.title || incoming.name || existing.title || '',
    phone: incoming.phone || incoming.phone_e164 || incoming.phone_raw || existing.phone || '',
    phone_e164: incoming.phone_e164 || existing.phone_e164 || '',
    email: incoming.email || existing.email || '',
    website: incoming.website || incoming.url || incoming.link || existing.website || '',
    address: incoming.address || incoming.location || existing.address || '',
    category: incoming.category || incoming.industry || existing.category || 'General',
    rating: incoming.rating || existing.rating || null,
    reviews: incoming.reviews || existing.reviews || null,
    status: existing.status === 'CONTACTED' ? 'CONTACTED' : (incoming.status || existing.status || 'NEW'),
    source: incoming.source || existing.source || 'Scraped',
    created_at: existing.created_at || incoming.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function processLead(lead) {
  if (!lead || typeof lead !== 'object') return;
  const key = getLeadKey(lead);
  if (!key) return;

  if (masterLeadsMap.has(key)) {
    const existing = masterLeadsMap.get(key);
    masterLeadsMap.set(key, mergeLead(existing, lead));
  } else {
    masterLeadsMap.set(key, {
      id: lead.id || lead.lead_id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: lead.name || lead.title || lead.business_name || 'Commercial Business',
      title: lead.title || lead.name || '',
      phone: lead.phone || lead.phone_e164 || lead.phone_raw || '',
      phone_e164: lead.phone_e164 || '',
      email: lead.email || '',
      website: lead.website || lead.url || lead.link || '',
      address: lead.address || lead.location || '',
      category: lead.category || lead.industry || 'General',
      rating: lead.rating || null,
      reviews: lead.reviews || null,
      status: lead.status || 'NEW',
      source: lead.source || 'Scraped',
      created_at: lead.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
}

async function runMasterConsolidation() {
  console.log('====================================================');
  console.log('🚀 APEXREACH MASTER LEAD CONSOLIDATION & SYNC');
  console.log('====================================================\n');

  // 1. Process files in local_db
  if (fs.existsSync(localDbDir)) {
    const files = fs.readdirSync(localDbDir);
    for (const f of files) {
      const full = path.join(localDbDir, f);
      if (!fs.existsSync(full)) continue;
      try {
        if (!fs.statSync(full).isFile()) continue;
      } catch (_) {
        continue;
      }

      if (f.startsWith('leads_db.json') || f.startsWith('solar_leads') || f.includes('lagos')) {
        try {
          if (f.endsWith('.json') || f.includes('.json')) {
            const raw = fs.readFileSync(full, 'utf8');
            try {
              const data = JSON.parse(raw);
              const list = Array.isArray(data) ? data : Object.values(data);
              list.forEach(processLead);
              console.log(`✅ Loaded ${list.length} leads from local_db/${f}`);
            } catch (e) {
              console.warn(`⚠️ Partial/broken JSON in ${f}, skipping damaged file.`);
            }
          } else if (f.endsWith('.xlsx')) {
            const wb = xlsx.readFile(full);
            let sheetCount = 0;
            for (const s of wb.SheetNames) {
              const rows = xlsx.utils.sheet_to_json(wb.Sheets[s]);
              rows.forEach(processLead);
              sheetCount += rows.length;
            }
            console.log(`✅ Loaded ${sheetCount} leads from local_db/${f}`);
          } else if (f.endsWith('.csv')) {
            const content = fs.readFileSync(full, 'utf8');
            const lines = content.split('\n').filter(l => l.trim());
            if (lines.length > 1) {
              const headers = lines[0].split(',').map(h => h.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
              for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim().replace(/^['"]|['"]$/g, ''));
                const obj = {};
                headers.forEach((h, idx) => obj[h] = cols[idx] || '');
                processLead(obj);
              }
              console.log(`✅ Loaded ${lines.length - 1} leads from local_db/${f}`);
            }
          }
        } catch (err) {
          console.error(`❌ Error reading ${f}:`, err.message);
        }
      }
    }
  }

  // 2. Process root Excel files
  const rootFiles = ['leads.xlsx', 'ApexReach_Leads_Template.xlsx'];
  for (const f of rootFiles) {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) {
      try {
        const wb = xlsx.readFile(full);
        let count = 0;
        for (const s of wb.SheetNames) {
          const rows = xlsx.utils.sheet_to_json(wb.Sheets[s]);
          rows.forEach(processLead);
          count += rows.length;
        }
        console.log(`✅ Loaded ${count} leads from root file ${f}`);
      } catch (_) {}
    }
  }

  const consolidatedLeads = Array.from(masterLeadsMap.values());
  console.log(`\n====================================================`);
  console.log(`🏆 CONSOLIDATION COMPLETE: ${consolidatedLeads.length} UNIQUE LEADS COMBINED!`);
  console.log(`====================================================\n`);

  // 3. Write Master local_db/leads_db.json file
  const masterPath = path.join(localDbDir, 'leads_db.json');
  fs.writeFileSync(masterPath, JSON.stringify(consolidatedLeads, null, 2), 'utf8');
  console.log(`💾 Saved single master database: ${masterPath} (${(fs.statSync(masterPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  // 4. Clean up fragmented .tmp files
  if (fs.existsSync(localDbDir)) {
    const files = fs.readdirSync(localDbDir);
    let cleaned = 0;
    for (const f of files) {
      if (f.startsWith('leads_db.json.tmp-') || f.startsWith('leads_db.json.bak_')) {
        try {
          fs.unlinkSync(path.join(localDbDir, f));
          cleaned++;
        } catch (_) {}
      }
    }
    console.log(`🧹 Cleaned up ${cleaned} fragmented temporary backup files.`);
  }

  // 5. Upload / Upsert to Supabase
  try {
    const envFile = path.join(rootDir, '.env.local');
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      const env = {};
      content.split('\n').forEach(l => {
        const idx = l.indexOf('=');
        if (idx > 0) {
          env[l.substring(0, idx).trim()] = l.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        }
      });

      const url = env.NEXT_PUBLIC_SUPABASE_URL || 'https://szyuterncawfxwzhvwcf.supabase.co';
      const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (url && key) {
        console.log(`\n🌐 Syncing ${consolidatedLeads.length} leads to Supabase database (${url})...`);
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(url, key);

        // Upload in smaller batches of 50 with rate-limiting delay
        const BATCH_SIZE = 50;
        let syncedCount = 0;
        for (let i = 0; i < consolidatedLeads.length; i += BATCH_SIZE) {
          const batch = consolidatedLeads.slice(i, i + BATCH_SIZE).map(l => ({
            id: l.id,
            name: l.name || 'Commercial Business',
            phone: l.phone || null,
            phone_e164: l.phone_e164 || null,
            email: l.email || null,
            website: l.website || null,
            address: l.address || null,
            category: l.category || 'General',
            status: l.status || 'NEW',
            source: l.source || 'Scraped',
            created_at: l.created_at || new Date().toISOString(),
            updated_at: l.updated_at || new Date().toISOString()
          }));

          try {
            const { error } = await supabase.from('leads').upsert(batch, { onConflict: 'id' });
            if (error) {
              console.error(`⚠️ Supabase batch upload error (${i}-${i + batch.length}):`, error.message);
            } else {
              syncedCount += batch.length;
              if ((i / BATCH_SIZE) % 10 === 0) {
                console.log(`   Uploaded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(consolidatedLeads.length / BATCH_SIZE)} (${syncedCount} / ${consolidatedLeads.length} synced)...`);
              }
            }
          } catch (batchErr) {
            console.error(`⚠️ Exception in batch upload (${i}):`, batchErr.message);
          }
          await new Promise(r => setTimeout(r, 150));
        }
        console.log(`🟢 Supabase sync complete! Total cloud synced leads: ${syncedCount}`);
      }
    }
  } catch (err) {
    console.error('⚠️ Supabase cloud sync warning:', err.message);
  }

  console.log('\n====================================================');
  console.log('✅ ALL LEADS SUCCESSFULLY CONSOLIDATED INTO ONE MASTER UPDATE!');
  console.log('====================================================');
}

runMasterConsolidation();
