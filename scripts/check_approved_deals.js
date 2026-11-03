const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkApprovedDeals() {
  const { getPillar2Telemetry, processOutboundQueue } = require('../src/lib/pillar2/pillar2Engine');
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🏛️ Checking Pillar 2 Telemetry & Approved Deals...');
  const t = await getPillar2Telemetry();

  console.log('Pending Count  :', t.stats.pendingCount);
  console.log('Approved Count :', t.stats.approvedCount);
  console.log('Queued Outbound:', t.stats.queuedOutboundCount);
  console.log('Dispatched     :', t.stats.dispatchedCount);

  console.log('\n--- ALL TICKETS WITH STATUS APPROVED ---');
  const approved = t.allTickets.filter(x => x.status === 'APPROVED');
  console.log(`Found ${approved.length} approved ticket(s):`);
  approved.forEach((a, idx) => {
    console.log(`\n[#${idx + 1}] Ticket ID: ${a.ticketId}`);
    console.log(`    Title    : ${a.title}`);
    console.log(`    Target   : ${a.targetBusinessName}`);
    console.log(`    Phone    : ${a.targetContactPhone}`);
    console.log(`    Email    : ${a.targetContactEmail}`);
    console.log(`    Status   : ${a.status}`);
    console.log(`    Approved : ${a.approvedAt}`);
  });

  console.log('\n--- OUTBOUND QUEUE ITEMS ---');
  console.log(`Found ${t.outboundQueue.length} queue item(s):`);
  t.outboundQueue.forEach((q, idx) => {
    console.log(`\n[Queue #${idx + 1}] Ticket ID: ${q.ticketId}`);
    console.log(`    Opp Title: ${q.opportunityTitle}`);
    console.log(`    Recipient: ${q.recipientName} (${q.recipientPhone})`);
    console.log(`    Email    : ${q.recipientEmail}`);
    console.log(`    Status   : ${q.status}`);
    console.log(`    WhatsApp : ${JSON.stringify(q.channels?.whatsapp || {})}`);
    console.log(`    Gateway  : ${q.gateway}`);
  });

  // Also check Supabase Cloud directly if available
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .in('step', ['PILLAR2_TICKET', 'PILLAR2_MANDATE_OUTBOUND', 'PILLAR2_DISPATCHED'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        console.log(`\n--- RECENT SUPABASE CLOUD LOGS (${data.length}) ---`);
        data.forEach(d => {
          let msg = {};
          try { msg = JSON.parse(d.message); } catch (_) {}
          console.log(`[${d.created_at}] Step: ${d.step} | Ticket: ${msg.ticketId} | Status: ${msg.status} | Target: ${msg.targetBusinessName || msg.recipientName}`);
        });
      }
    } catch (e) {
      console.log('Supabase check error:', e.message);
    }
  }
}

checkApprovedDeals().catch(console.error);
