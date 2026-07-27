import { harvestLiveSolarLeads, harvestLiveLagosLeads } from '../src/lib/liveLeadHarvester';
import { getSupabaseClient } from '../src/lib/supabaseClient';

async function testHarvestProgress() {
  console.log('====================================================');
  console.log('🧪 LIVE HARVEST & PROGRESSION TEST');
  console.log('====================================================\n');

  const supabase = getSupabaseClient();

  // 1. Initial Counts
  const { count: initialSolar } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('category.ilike.*solar*,source_query_or_seed.ilike.*solar*,notes.ilike.*solar*,business_summary.ilike.*solar*,name.ilike.*solar*');

  const { count: initialLagos } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('source_query_or_seed.ilike.*lagos*,city.ilike.*lagos*,city.ilike.*ikeja*,city.ilike.*lekki*,city.ilike.*yaba*,city.ilike.*surulere*,city.ilike.*apapa*,city.ilike.*ikorodu*,area.ilike.*lagos*,area.ilike.*ikeja*,area.ilike.*lekki*,address.ilike.*lagos*');

  console.log(`[Before Harvest] Solar Engine Leads: ${initialSolar}`);
  console.log(`[Before Harvest] Lagos 10K Engine Leads: ${initialLagos}`);
  console.log(`[Before Harvest] Combined Total: ${(initialSolar || 0) + (initialLagos || 0)}\n`);

  // 2. Trigger Solar Live Harvest
  console.log('⚡ Triggering live Solar Engine harvester...');
  const solarRes = await harvestLiveSolarLeads();
  console.log(`  ✓ Solar Harvest Finished: Added +${solarRes.added} new leads! (Engine Total: ${solarRes.totalSolar})\n`);

  // 3. Trigger Lagos 10K Live Harvest
  console.log('🏢 Triggering live Lagos 10K B2B Engine harvester...');
  const lagosRes = await harvestLiveLagosLeads();
  console.log(`  ✓ Lagos Harvest Finished: Added +${lagosRes.added} new leads! (Engine Total: ${lagosRes.totalLagos})\n`);

  // 4. Final Counts after Harvest
  const { count: finalSolar } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('category.ilike.*solar*,source_query_or_seed.ilike.*solar*,notes.ilike.*solar*,business_summary.ilike.*solar*,name.ilike.*solar*');

  const { count: finalLagos } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .or('source_query_or_seed.ilike.*lagos*,city.ilike.*lagos*,city.ilike.*ikeja*,city.ilike.*lekki*,city.ilike.*yaba*,city.ilike.*surulere*,city.ilike.*apapa*,city.ilike.*ikorodu*,area.ilike.*lagos*,area.ilike.*ikeja*,area.ilike.*lekki*,address.ilike.*lagos*');

  console.log('====================================================');
  console.log('📊 HARVEST PROGRESSION SUMMARY');
  console.log('====================================================');
  console.log(`Solar Engine Leads : ${initialSolar} → ${finalSolar} (+${(finalSolar || 0) - (initialSolar || 0)})`);
  console.log(`Lagos 10K Leads    : ${initialLagos} → ${finalLagos} (+${(finalLagos || 0) - (initialLagos || 0)})`);
  console.log(`Combined Total     : ${(initialSolar || 0) + (initialLagos || 0)} → ${(finalSolar || 0) + (finalLagos || 0)} (+${((finalSolar || 0) + (finalLagos || 0)) - ((initialSolar || 0) + (initialLagos || 0))})`);
  console.log('====================================================\n');
}

testHarvestProgress().catch(console.error);
