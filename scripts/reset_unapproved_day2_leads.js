const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const url = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (url && key) ? createClient(url, key) : null;

async function resetDay2Leads() {
  console.log('===============================================================');
  console.log('🧹 RESETTING DAY 2 UNAPPROVED LEADS (ONLY DAY 1 WAS SENT)');
  console.log('===============================================================\n');

  const leadsPath = path.join(__dirname, '../local_db/leads_db.json');
  const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));

  let resetCount = 0;
  let day1Count = 0;

  leads.forEach(l => {
    const d = (l.last_contacted_at || l.lastContactedAt || '').split('T')[0];
    if (l.status === 'CONTACTED') {
      if (d === '2026-08-17') {
        day1Count++;
      } else {
        l.status = 'NEW';
        l.last_contacted_at = null;
        l.notes = 'Verified Lagos Lead (Pending Outreach Dispatch)';
        resetCount++;
      }
    }
  });

  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), 'utf8');
  console.log(`✅ Day 1 (Aug 17) Contacted Leads Preserved: ${day1Count}`);
  console.log(`✅ Day 2 (Aug 18) Unsent Leads Reset to NEW: ${resetCount}`);

  // Sync with Supabase
  if (supabase) {
    console.log('\n🔄 Syncing with Supabase...');
    const { data: contactedInSupabase } = await supabase.from('leads').select('lead_id, last_contacted_at, status').eq('status', 'CONTACTED');
    if (contactedInSupabase) {
      for (const row of contactedInSupabase) {
        const d = (row.last_contacted_at || '').split('T')[0];
        if (d !== '2026-08-17') {
          await supabase.from('leads').update({ status: 'NEW', last_contacted_at: null }).eq('lead_id', row.lead_id);
        }
      }
    }
    console.log('✔ Supabase synchronized: Only Day 1 leads are marked CONTACTED.');
  }

  console.log('\n===============================================================');
  console.log('🎉 CLEANUP COMPLETE! DAY 2 OUTREACH IS WAITING FOR YOUR ORDER.');
  console.log('===============================================================');
}

resetDay2Leads().catch(console.error);
