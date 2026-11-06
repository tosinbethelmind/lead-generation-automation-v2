const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

async function inspectTickets() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .in('step', ['PILLAR2_TICKET', 'PILLAR2_MANDATE_OUTBOUND'])
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching logs:', error);
    return;
  }

  data.forEach((d, i) => {
    console.log(`\n=== #${i+1} [${d.created_at}] Step: ${d.step} ===`);
    try {
      const parsed = JSON.parse(d.message);
      console.log('Ticket ID:', parsed.ticketId);
      console.log('Broker / Recipient:', parsed.recipient || parsed.brokerName || parsed.broker || parsed.phone || parsed.email);
      console.log('Property / Title:', parsed.title || parsed.propertyListing);
      console.log('Full JSON:\n', JSON.stringify(parsed, null, 2));
    } catch (_) {
      console.log('Raw message:', d.message);
    }
  });
}

inspectTickets().catch(console.error);
