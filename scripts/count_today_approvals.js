const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

async function countTodayApprovals() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const todayPrefix = new Date().toISOString().slice(0, 10); // 2026-11-03

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('step', 'PILLAR2_TICKET')
    .gte('created_at', todayPrefix + 'T00:00:00.000Z')
    .order('created_at', { ascending: false });

  console.log(`Found ${data ? data.length : 0} ticket log entries created today (${todayPrefix}):`);
  const approvedMap = new Map();

  if (data) {
    data.forEach(d => {
      try {
        const msg = JSON.parse(d.message);
        if (msg.status === 'APPROVED') {
          approvedMap.set(msg.ticketId, {
            ticketId: msg.ticketId,
            title: msg.title,
            target: msg.targetBusinessName,
            approvedAt: msg.approvedAt || d.created_at
          });
        }
      } catch (_) {}
    });
  }

  console.log(`\nTotal Unique Deals Approved Today: ${approvedMap.size}`);
  Array.from(approvedMap.values()).forEach((a, i) => {
    console.log(` ${i + 1}. [${a.ticketId}] ${a.title} (${a.target}) - ${a.approvedAt}`);
  });
}

countTodayApprovals().catch(console.error);
