import { getSupabaseClient } from '../src/lib/supabaseClient';

async function checkCounts() {
  const supabase = getSupabaseClient();
  
  console.log('Querying Lagos 10K Scraper & Solar Engine lead counts...\n');

  // 1. Total Leads in DB
  const { count: totalLeads, error: errTotal } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // 2. Solar Leads Count
  const { count: totalSolar, error: errSolar } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('category.ilike.*solar*,source_query_or_seed.ilike.*solar*,notes.ilike.*solar*,business_summary.ilike.*solar*,name.ilike.*solar*');

  // 3. Lagos 10K B2B Leads Count
  const { count: totalLagos, error: errLagos } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('source_query_or_seed.ilike.*lagos*,city.ilike.*lagos*,city.ilike.*ikeja*,city.ilike.*lekki*,city.ilike.*yaba*,city.ilike.*surulere*,city.ilike.*apapa*,city.ilike.*ikorodu*,area.ilike.*lagos*,area.ilike.*ikeja*,area.ilike.*lekki*,address.ilike.*lagos*');

  // 4. Installers table count (if present)
  let installersCount: number | null = null;
  try {
    const { count: instCount } = await supabase
      .from('installers')
      .select('*', { count: 'exact', head: true });
    installersCount = instCount;
  } catch (_) {}

  console.log('JSON_COUNTS_START');
  console.log(JSON.stringify({
    totalLeads: totalLeads || 0,
    solarEngineLeads: totalSolar || 0,
    lagos10kLeads: totalLagos || 0,
    installersTableCount: installersCount ?? 0,
    errTotal: errTotal?.message,
    errSolar: errSolar?.message,
    errLagos: errLagos?.message
  }, null, 2));
  console.log('JSON_COUNTS_END');
}

checkCounts().catch(err => {
  console.error(err);
  process.exit(1);
});
