const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

async function searchAllApproved() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from('logs')
    .select('*')
    .like('message', '%APPROVED%')
    .order('created_at', { ascending: false })
    .limit(50);

  console.log(`Found ${data ? data.length : 0} logs containing APPROVED:`);
  const seen = new Set();
  data.forEach((d, i) => {
    try {
      const msg = JSON.parse(d.message);
      const id = msg.ticketId || msg.slug || msg.id || d.id;
      if (!seen.has(id)) {
        seen.add(id);
        console.log(`${seen.size}. [${d.created_at}] Step: ${d.step} | ID: ${id} | Title: ${msg.title || msg.businessName || msg.opportunityTitle}`);
      }
    } catch (_) {
      console.log(`${i+1}. [${d.created_at}] Step: ${d.step}`);
    }
  });
}

searchAllApproved().catch(console.error);
