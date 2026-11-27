const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
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

console.log('Supabase URL:', url ? 'FOUND' : 'MISSING');

if (!url || !key) {
  console.log('Missing Supabase credentials in .env.local');
  process.exit(0);
}

const supabase = createClient(url, key);

async function checkDbLeads() {
  const { data, count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Supabase Error:', error.message);
    return;
  }

  console.log(`Total Leads in Supabase DB: ${count || (data ? data.length : 0)}`);

  if (data && data.length > 0) {
    const seeds = {};
    const types = {};
    const cities = {};
    data.forEach(l => {
      const s = l.source_query_or_seed || 'none';
      const t = l.type || 'none';
      const c = l.city || 'none';
      seeds[s] = (seeds[s] || 0) + 1;
      types[t] = (types[t] || 0) + 1;
      cities[c] = (cities[c] || 0) + 1;
    });

    console.log('DB Seed Breakdown:', seeds);
    console.log('DB Type Breakdown:', types);
    console.log('DB City Breakdown:', cities);
  }
}

checkDbLeads();
