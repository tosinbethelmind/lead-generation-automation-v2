const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(l => {
  const m = l.match(/^([^#=\s][^=]*)=(.+)$/);
  if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  console.log('⚡ TOTAL LIVE VERIFIED SUPABASE LEADS:', count);

  const { data: latest } = await supabase
    .from('leads')
    .select('id, name, business_name, category, city, area, phone, created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  console.log('\n--- MOST RECENTLY HARVESTED & SYNCED LEADS ---');
  latest.forEach((l, i) => {
    console.log(`${i+1}. [${l.category || 'General'}] ${l.name || l.business_name} | Phone: ${l.phone || 'N/A'} | Area: ${l.city || l.area || 'Nigeria'} | Time: ${l.created_at}`);
  });
}

check().catch(console.error);
