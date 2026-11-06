const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

async function auditEmailDeliveries() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Fetch all dispatched logs in Supabase
  const { data: dispatchedLogs } = await supabase
    .from('logs')
    .select('*')
    .eq('step', 'PILLAR2_DISPATCHED')
    .order('created_at', { ascending: false })
    .limit(50);

  console.log('--- RECENT PILLAR 2 DISPATCH LOGS IN SUPABASE ---');
  const emailsSent = [];
  if (dispatchedLogs) {
    dispatchedLogs.forEach(d => {
      try {
        const msg = JSON.parse(d.message);
        if (msg.channels?.email?.status === 'DISPATCHED_SMTP' || msg.gateway?.includes('Hostinger') || msg.gateway?.includes('SMTP')) {
          emailsSent.push({
            ticketId: msg.ticketId,
            recipientEmail: msg.recipientEmail,
            time: d.created_at,
            gateway: msg.channels?.email?.gateway || msg.gateway
          });
        }
      } catch (_) {}
    });
  }

  console.log(`Found ${emailsSent.length} confirmed SMTP email dispatch(es) recorded in Supabase:`);
  emailsSent.forEach((e, idx) => {
    console.log(`  [#${idx + 1}] Ticket: ${e.ticketId} -> ${e.recipientEmail} (${e.time}) via ${e.gateway}`);
  });

  // 2. Load all unique approved tickets
  const { getPillar2Telemetry } = require('../src/lib/pillar2/pillar2Engine');
  const telemetry = await getPillar2Telemetry();
  const approvedTickets = telemetry.allTickets.filter(t => t.status === 'APPROVED');

  console.log(`\n--- ALL APPROVED MANDATES IN TELEMETRY (${approvedTickets.length}) ---`);
  approvedTickets.forEach((t, idx) => {
    console.log(`  [#${idx + 1}] ID: ${t.ticketId} | Broker: ${t.targetBusinessName} | Email: ${t.targetContactEmail || t.recipientEmail}`);
  });
}

auditEmailDeliveries().catch(console.error);
