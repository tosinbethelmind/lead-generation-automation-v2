import { getSupabaseClient } from '../src/lib/supabaseClient';

async function countLeads() {
  const supabase = getSupabaseClient();
  
  // Fetch source and count
  const { data: leads, error } = await supabase
    .from('leads')
    .select('source, lead_id');

  if (error) {
    console.error('Error fetching leads from Supabase:', error.message);
    process.exit(1);
  }

  const counts: Record<string, number> = {};
  let total = 0;

  for (const lead of leads || []) {
    const src = (lead.source || 'UNKNOWN').toUpperCase();
    counts[src] = (counts[src] || 0) + 1;
    total++;
  }

  console.log('JSON_RESULT_START');
  console.log(JSON.stringify({ counts, total }, null, 2));
  console.log('JSON_RESULT_END');
}

countLeads().catch(err => {
  console.error(err);
  process.exit(1);
});
