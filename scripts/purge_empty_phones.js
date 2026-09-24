const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(l => {
  const m = l.match(/^([^#=\s][^=]*)=(.+)$/);
  if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
  // Query all records without valid phone numbers
  const { data: invalid1 } = await supabase
    .from('leads')
    .select('id, name, phone, phone_e164')
    .is('phone', null);

  const { data: invalid2 } = await supabase
    .from('leads')
    .select('id, name, phone, phone_e164')
    .eq('phone', '');

  const invalid = [...(invalid1 || []), ...(invalid2 || [])];

  if (invalid.length > 0) {
    console.log(`Found ${invalid.length} records without valid phone. Purging...`);
    const ids = invalid.map(i => i.id);
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      await supabase.from('leads').delete().in('id', chunk);
    }
    console.log('✅ Purged all invalid records.');
  } else {
    console.log('✅ Zero invalid records found.');
  }

  const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  console.log(`📊 Pristine Verified Cloud Leads: ${count}`);
}

clean().catch(console.error);
