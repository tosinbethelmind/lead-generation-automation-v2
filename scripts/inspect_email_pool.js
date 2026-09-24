const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcaamfaqkxvgbjlfuhki.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYWFtZmFxa3h2Z2JqbGZ1aGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUyNDI0OCwiZXhwIjoyMTAzMTAwMjQ4fQ.9KKQ52VdE8b-jxy2QmOAAxuBMKpGyncwDDEyMGfe9fw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isGenuineLead(l) {
  if (!l) return false;
  const name = (l.name || l.business_name || '').trim();
  const phone = (l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
  const email = (l.email || l.email_address || '').trim().toLowerCase();

  if (!name || name.length < 3) return false;
  if (/mock_|synthetic|template|#\d{3,}|\[area\]|^lead_\d+/i.test(name)) return false;

  if (phone) {
    if (/0000|0001|1111|2222|3333|4444|5555|6666|7777|8888|9999|123456/.test(phone)) return false;
  }

  if (!email || !email.includes('@')) return false;
  if (/example\.com|test\.com|testlead\.com|placeholder|\.png|\.jpg/i.test(email)) return false;

  return true;
}

async function inspectEmailPool() {
  console.log('=== INSPECTING VERIFIED EMAIL LEADS POOL ===\n');

  const leadMap = new Map();

  const add = (l, src) => {
    if (!isGenuineLead(l)) return;
    const em = (l.email || l.email_address || '').trim().toLowerCase();
    if (!leadMap.has(em)) {
      leadMap.set(em, { ...l, email: em, _source: src });
    }
  };

  // 1. leads_db.json
  const p1 = path.join(LOCAL_DB, 'leads_db.json');
  if (fs.existsSync(p1)) {
    try {
      const arr = JSON.parse(fs.readFileSync(p1, 'utf8'));
      arr.forEach(l => add(l, 'leads_db.json'));
    } catch (_) {}
  }

  // 2. lead_journeys.json
  const p2 = path.join(LOCAL_DB, 'lead_journeys.json');
  if (fs.existsSync(p2)) {
    try {
      const arr = JSON.parse(fs.readFileSync(p2, 'utf8'));
      (Array.isArray(arr) ? arr : Object.values(arr)).forEach(l => add(l, 'lead_journeys.json'));
    } catch (_) {}
  }

  // 3. Supabase leads
  try {
    const { data: sLeads } = await supabase.from('leads').select('*').not('email', 'is', null).limit(2000);
    if (sLeads) sLeads.forEach(l => add(l, 'supabase_leads'));
  } catch (e) {
    console.log('Supabase leads error:', e.message);
  }

  console.log(`Total Unique Genuine Email Leads Found: ${leadMap.size}`);

  const list = Array.from(leadMap.values());
  const unsent = list.filter(l => !l.email_sent && !l.emailSent);
  console.log(`Unsent Genuine Email Leads: ${unsent.length}`);
  console.log(`Already Sent Email Leads: ${list.length - unsent.length}`);

  if (unsent.length > 0) {
    console.log('\nSample Unsent Leads:');
    unsent.slice(0, 5).forEach((l, i) => {
      console.log(`  ${i+1}. ${l.name || l.business_name} | ${l.email} | ${l.category} | ${l.area || l.city}`);
    });
  }
}

inspectEmailPool();
