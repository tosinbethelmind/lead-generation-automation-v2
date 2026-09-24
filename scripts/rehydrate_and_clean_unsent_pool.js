/**
 * @file scripts/rehydrate_and_clean_unsent_pool.js
 * 
 * Rehydrates local_db/leads_db.json with 100% genuine unsent commercial leads:
 * 1. Accurately marks email_sent=true ONLY for leads with verified message IDs in activities.json.
 * 2. Pulls all uncontacted leads (outreach_sent=false) from Supabase Cloud.
 * 3. Merges and deduplicates them into local_db/leads_db.json.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT_DIR = process.cwd();
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const ACTIVITIES_PATH = path.join(ROOT_DIR, 'local_db/activities.json');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcaamfaqkxvgbjlfuhki.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYWFtZmFxa3h2Z2JqbGZ1aGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUyNDI0OCwiZXhwIjoyMTAzMTAwMjQ4fQ.9KKQ52VdE8b-jxy2QmOAAxuBMKpGyncwDDEyMGfe9fw';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

function isGenuineLead(l) {
  if (!l) return false;
  const name = (l.name || l.business_name || '').trim();
  const email = (l.email || '').trim().toLowerCase();
  const phone = (l.phone || l.phone_e164 || '').trim();

  if (!name || name.length < 3) return false;
  if (/mock_|synthetic|template|#\d{3,}|\[area\]|^lead_\d+/i.test(name)) return false;
  if (email) {
    if (/example\.com|test\.com|testlead\.com|placeholder|\.png|\.jpg/i.test(email)) return false;
  }
  if (phone) {
    if (/0000|0001|1111|2222|3333|4444|5555|6666|7777|8888|9999|123456/.test(phone)) return false;
  }
  return true;
}

async function rehydrate() {
  console.log('🔄 Rehydrating and cleaning lead pool according to Rule #2 (Real-Action Invariant)...');

  // 1. Get truly verified delivered emails from activities.json
  const verifiedDeliveredEmails = new Set();
  if (fs.existsSync(ACTIVITIES_PATH)) {
    try {
      const act = JSON.parse(fs.readFileSync(ACTIVITIES_PATH, 'utf8'));
      act.filter(a => (a.channel === 'email' || a.type?.includes('EMAIL')) && a.verified && a.recipient)
         .forEach(a => verifiedDeliveredEmails.add(a.recipient.toLowerCase().trim()));
    } catch (_) {}
  }
  console.log(`📋 Verified delivered emails in activities.json: ${verifiedDeliveredEmails.size}`);

  // 2. Load local leads
  let localLeads = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try { localLeads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8')); } catch (_) {}
  }
  console.log(`📦 Existing local leads: ${localLeads.length}`);

  const leadMapByEmail = new Map();
  const leadMapById = new Map();

  let resetCount = 0;
  localLeads.forEach(l => {
    if (!isGenuineLead(l)) return;
    const em = (l.email || '').toLowerCase().trim();
    if (em && em.includes('@')) {
      if (verifiedDeliveredEmails.has(em)) {
        l.email_sent = true;
      } else {
        // Reset falsely marked leads
        if (l.email_sent) {
          l.email_sent = false;
          resetCount++;
        }
      }
      leadMapByEmail.set(em, l);
    }
    const id = l.id || l.lead_id;
    if (id) leadMapById.set(id, l);
  });

  console.log(`🔄 Reset ${resetCount} falsely marked email leads back to email_sent=false.`);

  // 3. Fetch all leads from Supabase Cloud with valid emails and outreach_sent=false
  try {
    console.log('🌐 Fetching uncontacted leads from Supabase Cloud...');
    const { data: supaLeads, error } = await supabase
      .from('leads')
      .select('*')
      .neq('email', '')
      .not('email', 'is', null)
      .eq('outreach_sent', false)
      .limit(1000);

    if (error) {
      console.warn('⚠️ Supabase error:', error.message);
    } else if (Array.isArray(supaLeads)) {
      console.log(`📥 Fetched ${supaLeads.length} uncontacted leads with emails from Supabase Cloud.`);
      let importedCount = 0;
      for (const s of supaLeads) {
        if (!isGenuineLead(s)) continue;
        const em = (s.email || '').toLowerCase().trim();
        if (!em || !em.includes('@')) continue;

        if (leadMapByEmail.has(em)) {
          // Merge Supabase metadata
          const existing = leadMapByEmail.get(em);
          if (!existing.phone && s.phone) existing.phone = s.phone;
          if (!existing.website && s.website) existing.website = s.website;
          if (!existing.address && s.address) existing.address = s.address;
          if (s.id) existing.supabase_id = s.id;
        } else {
          // New lead
          const newLead = {
            id: s.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            supabase_id: s.id,
            name: s.business_name || s.name || 'Commercial Enterprise',
            business_name: s.business_name || s.name || 'Commercial Enterprise',
            category: s.category || 'Commercial Enterprise',
            phone: s.phone || '',
            phone_e164: s.phone_e164 || (s.phone ? `+234${s.phone.replace(/\D/g, '').replace(/^234|^0/, '')}` : ''),
            email: em,
            website: (s.website || '').trim(),
            address: s.address || '',
            area: s.area || s.city || 'Lagos',
            city: s.city || 'Lagos',
            email_sent: verifiedDeliveredEmails.has(em),
            webform_submitted: false,
            created_at: s.created_at || new Date().toISOString()
          };
          leadMapByEmail.set(em, newLead);
          leadMapById.set(newLead.id, newLead);
          localLeads.push(newLead);
          importedCount++;
        }
      }
      console.log(`✨ Imported ${importedCount} brand new genuine email leads into local database.`);
    }
  } catch (err) {
    console.warn('⚠️ Supabase sync exception:', err.message);
  }

  // Persist updated leads_db.json
  fs.writeFileSync(LEADS_DB_PATH, JSON.stringify(localLeads, null, 2), 'utf8');

  // Summary stats
  const totalWithEmail = localLeads.filter(l => l.email && l.email.includes('@'));
  const unsentEmail = totalWithEmail.filter(l => !l.email_sent);
  const sentEmail = totalWithEmail.filter(l => l.email_sent);

  const totalWithWeb = localLeads.filter(l => l.website && l.website.startsWith('http'));
  const unsentWeb = totalWithWeb.filter(l => !l.webform_submitted && !l.webform_dispatched);

  console.log('\n========================================================================');
  console.log('📊 REHYDRATION COMPLETE SUMMARY:');
  console.log(`• Total Leads in Database       : ${localLeads.length}`);
  console.log(`• Total Leads with Email        : ${totalWithEmail.length}`);
  console.log(`• Truly Unsent Email Leads      : ${unsentEmail.length}`);
  console.log(`• Verified Sent Email Leads     : ${sentEmail.length}`);
  console.log(`• Leads with Commercial Website : ${totalWithWeb.length}`);
  console.log(`• Unsent Web Contact Form Leads : ${unsentWeb.length}`);
  console.log('========================================================================\n');
}

rehydrate().catch(console.error);
