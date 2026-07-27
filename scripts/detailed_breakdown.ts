import { getSupabaseClient } from '../src/lib/supabaseClient';

async function detailedBreakdown() {
  const supabase = getSupabaseClient();

  const [
    { count: totalLagosLeads },
    { count: totalSolarLeads },
    { count: realEstateCount },
    { count: schoolsCount },
    { count: clinicsCount },
    { count: hotelsCount },
    { count: retailCount },
    { count: autoCount }
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('source_query_or_seed.ilike.*lagos*,city.ilike.*lagos*,city.ilike.*ikeja*,city.ilike.*lekki*,city.ilike.*yaba*,city.ilike.*surulere*,city.ilike.*apapa*,city.ilike.*ikorodu*,area.ilike.*lagos*,area.ilike.*ikeja*,area.ilike.*lekki*,address.ilike.*lagos*'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.*solar*,source_query_or_seed.ilike.*solar*,notes.ilike.*solar*,business_summary.ilike.*solar*,name.ilike.*solar*'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%estate%,category.ilike.%property%'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%school%,category.ilike.%academy%,category.ilike.%college%'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%clinic%,category.ilike.%hospital%,category.ilike.%dental%'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%hotel%,category.ilike.%restaurant%,category.ilike.%lounge%'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%boutique%,category.ilike.%store%,category.ilike.%retail%'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).or('category.ilike.%car%,category.ilike.%auto%,category.ilike.%motor%')
  ]);

  console.log('JSON_BREAKDOWN_START');
  console.log(JSON.stringify({
    totalLagosLeads: totalLagosLeads || 0,
    totalSolarLeads: totalSolarLeads || 0,
    totalCombined: (totalLagosLeads || 0) + (totalSolarLeads || 0),
    lagosSectors: {
      realEstate: realEstateCount || 0,
      schools: schoolsCount || 0,
      clinics: clinicsCount || 0,
      hotelsAndDining: hotelsCount || 0,
      retailAndBoutiques: retailCount || 0,
      autoAndLogistics: autoCount || 0
    }
  }, null, 2));
  console.log('JSON_BREAKDOWN_END');
}

detailedBreakdown().catch(console.error);
