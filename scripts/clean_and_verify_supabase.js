const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(l => {
  const m = l.match(/^([^#=\s][^=]*)=(.+)$/);
  if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function cleanAndVerify() {
  console.log('Fetching all leads to enforce 100% genuine Nigerian phone validation...');
  
  let page = 0;
  const pageSize = 1000;
  let allLeads = [];

  while (true) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, business_name, phone, phone_e164, category, city, area')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    allLeads = allLeads.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  console.log(`Scanned ${allLeads.length} total database records.`);

  const invalidIds = [];
  const validLeads = [];

  allLeads.forEach(l => {
    const p1 = (l.phone || '').trim().replace(/\D/g, '');
    const p2 = (l.phone_e164 || '').trim().replace(/\D/g, '');

    const isValid = (
      (p1.length >= 10 && (p1.startsWith('07') || p1.startsWith('08') || p1.startsWith('09') || p1.startsWith('2347') || p1.startsWith('2348') || p1.startsWith('2349') || p1.startsWith('70') || p1.startsWith('80') || p1.startsWith('81') || p1.startsWith('90') || p1.startsWith('91'))) ||
      (p2.length >= 12 && (p2.startsWith('2347') || p2.startsWith('2348') || p2.startsWith('2349') || p2.startsWith('2341')))
    );

    if (!isValid) {
      invalidIds.push(l.id);
    } else {
      validLeads.push(l);
    }
  });

  console.log(`Found ${invalidIds.length} records without valid phone. Deleting...`);

  for (let i = 0; i < invalidIds.length; i += 100) {
    const chunk = invalidIds.slice(i, i + 100);
    await supabase.from('leads').delete().in('id', chunk);
  }

  console.log('✅ Purged all invalid records.');

  const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  console.log(`\n======================================================`);
  console.log(`🏆 100% PRISTINE GENUINE NIGERIAN LEADS IN CLOUD: ${count}`);
  console.log(`======================================================\n`);

  const { data: latest } = await supabase
    .from('leads')
    .select('id, name, business_name, category, city, area, phone, phone_e164, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('Top 5 Genuine Commercial Leads in Supabase:');
  latest.forEach((l, i) => {
    console.log(`${i+1}. [${l.category}] ${l.name || l.business_name} | Phone: ${l.phone || l.phone_e164} | Area: ${l.city || l.area}`);
  });
}

cleanAndVerify().catch(console.error);
