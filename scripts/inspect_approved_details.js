const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

async function inspectApproved() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('step', 'PILLAR2_TICKET')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('--- RECENT APPROVED TICKETS IN SUPABASE ---');
  data.forEach(d => {
    const msg = JSON.parse(d.message);
    if (msg.status === 'APPROVED') {
      console.log(`\nTicket ID   : ${msg.ticketId}`);
      console.log(`Title       : ${msg.title}`);
      console.log(`Approved At : ${msg.approvedAt || d.created_at}`);
      console.log(`Target      : ${msg.targetBusinessName}`);
      console.log(`Phone       : ${msg.targetContactPhone}`);
      console.log(`Email       : ${msg.targetContactEmail}`);
      console.log(`Script      :\n${msg.preDraftedScript ? msg.preDraftedScript.slice(0, 150) + '...' : 'none'}`);
    }
  });
}

inspectApproved().catch(console.error);
