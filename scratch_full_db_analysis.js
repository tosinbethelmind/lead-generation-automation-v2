const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function analyzeAllLeads() {
  console.log('Fetching all database leads in chunks of 5000...');
  
  let allLeads = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, business_name, phone_e164, phone, phone_raw, email, address, city, area, category, business_summary, status, notes, created_at, source_query_or_seed')
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) {
      console.error('Error fetching page', page, error.message);
      break;
    }
    
    if (!data || data.length === 0) break;
    allLeads = allLeads.concat(data);
    console.log(`Fetched ${allLeads.length} leads so far...`);
    if (data.length < pageSize) break;
    page++;
  }

  console.log(`\nTOTAL LEADS FETCHED FROM DB: ${allLeads.length}`);

  let solar = 0;
  let ibadan = 0;
  let lagos = 0;

  allLeads.forEach(l => {
    const id = (l.id || l.lead_id || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();
    const seed = (l.source_query_or_seed || '').toLowerCase();
    const scope = (l.business_summary || l.notes || '').toLowerCase();
    const name = (l.name || l.business_name || '').toLowerCase();
    const loc = `${l.city || ''} ${l.area || ''} ${l.district || ''} ${l.address || ''} ${seed}`.toLowerCase();

    const isSolar = (
      id.startsWith('solar_') ||
      l.type === 'homeowner' ||
      l.type === 'enterprise' ||
      cat.includes('solar') ||
      cat.includes('inverter') ||
      cat.includes('energy') ||
      cat.includes('power') ||
      seed.includes('solar') ||
      scope.includes('solar') ||
      name.includes('solar') ||
      name.includes('inverter')
    );

    const isIbadan = (
      id.startsWith('ibadan_') ||
      l.type === 'ibadan_10k' ||
      l.type === 'ibadan_b2b' ||
      seed.includes('ibadan') ||
      /ibadan|bodija|dugbe|ring road|challenge|mokola|agbowo|samonda|jericho|eleyele|oluyole|moniya|akobo|apata/i.test(loc)
    );

    if (isSolar) solar++;
    else if (isIbadan) ibadan++;
    else lagos++;
  });

  console.log('====================================================');
  console.log('⚡ ACCURATE FULL DATABASE ENGINE BREAKDOWN');
  console.log('====================================================');
  console.log(`📊 Total Database Leads:       ${allLeads.length}`);
  console.log(`☀️  SolarQuotePro Prospects:   ${solar}`);
  console.log(`🏛️  Ibadan 10K B2B Prospects:  ${ibadan}`);
  console.log(`🏢  Lagos 10K B2B Enterprises:  ${lagos}`);
  console.log('====================================================');
}

analyzeAllLeads();
