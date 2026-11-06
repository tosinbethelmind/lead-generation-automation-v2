const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('step', 'PILLAR2_TICKET')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  console.log(`Found ${data.length} tickets in Supabase logs:`);
  data.forEach((r, i) => {
    try {
      const p = JSON.parse(r.message);
      console.log(`[${i}] ${p.ticketId} | Broker: ${p.targetBusinessName || p.actionPayload?.recipientName} | Phone: ${p.targetContactPhone || p.actionPayload?.recipientPhone} | Status: ${p.status} | Created/Approved: ${p.approvedAt || p.createdAt}`);
    } catch(e) {
      console.log(`[${i}] Raw message:`, r.message.substring(0, 100));
    }
  });
}

run().catch(console.error);
