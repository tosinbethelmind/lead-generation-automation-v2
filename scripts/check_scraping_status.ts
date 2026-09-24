import { getSupabaseClient } from '../src/lib/supabaseClient';
import * as fs from 'fs';
import * as path from 'path';

async function checkStatus() {
  console.log('=== LEAD SCRAPING & HARVESTING SYSTEM STATUS ===\n');

  // 1. Check Supabase
  try {
    const supabase = getSupabaseClient();
    const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    console.log(`[Supabase Cloud] Total Leads: ${totalLeads ?? 0}`);

    // Breakdowns
    const { count: solarCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .or('category.ilike.*solar*,source_query_or_seed.ilike.*solar*,notes.ilike.*solar*,business_summary.ilike.*solar*,name.ilike.*solar*');

    const { count: lagosCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .or('source_query_or_seed.ilike.*lagos*,city.ilike.*lagos*,city.ilike.*ikeja*,city.ilike.*lekki*,city.ilike.*yaba*,city.ilike.*surulere*,city.ilike.*apapa*,city.ilike.*ikorodu*,area.ilike.*lagos*,area.ilike.*ikeja*,area.ilike.*lekki*,address.ilike.*lagos*');

    const { count: ibadanCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .or('source_query_or_seed.ilike.*ibadan*,city.ilike.*ibadan*,area.ilike.*bodija*,area.ilike.*dugbe*,area.ilike.*ring road*,area.ilike.*challenge*,area.ilike.*mokola*');

    console.log(`- Solar / Renewable Energy Prospects: ${solarCount ?? 0}`);
    console.log(`- Lagos Commercial Corridors (B2B): ${lagosCount ?? 0}`);
    console.log(`- Ibadan Commercial Hub: ${ibadanCount ?? 0}`);

    // Recent 5 leads
    const { data: latest } = await supabase
      .from('leads')
      .select('id, name, business_name, category, city, area, created_at, phone')
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('\n[Supabase Cloud] 5 Most Recently Discovered Leads:');
    latest?.forEach((l, i) => {
      console.log(`  ${i+1}. ${l.name || l.business_name || 'N/A'} | Sector: ${l.category || 'General'} | Location: ${l.city || l.area || 'Nigeria'} | Phone: ${l.phone || 'N/A'} | Date: ${l.created_at}`);
    });
  } catch (err: any) {
    console.error('Supabase query error:', err.message);
  }

  // 2. Local Database & Scrape Jobs
  const localDbDir = path.join(process.cwd(), 'local_db');
  if (fs.existsSync(localDbDir)) {
    const leadsDbPath = path.join(localDbDir, 'leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      try {
        const localLeads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
        console.log(`\n[Local DB] Total in-memory / cached leads: ${localLeads.length}`);
      } catch (_) {}
    }

    const scrapeJobsPath = path.join(localDbDir, 'scrape_jobs.json');
    if (fs.existsSync(scrapeJobsPath)) {
      try {
        const jobs = JSON.parse(fs.readFileSync(scrapeJobsPath, 'utf8'));
        const jobKeys = Object.keys(jobs);
        console.log(`[Scrape Jobs Queue] Total Tracked Scrape Jobs: ${jobKeys.length}`);
      } catch (_) {}
    }

    const hbPath = path.join(process.cwd(), 'local_runner_heartbeat.json');
    if (fs.existsSync(hbPath)) {
      try {
        const hb = JSON.parse(fs.readFileSync(hbPath, 'utf8'));
        const ageSec = Math.round((Date.now() - hb.last_seen) / 1000);
        console.log(`\n[Local Harvester / Runner Heartbeat] PID: ${hb.pid}, Port: ${hb.port}, Last Heartbeat: ${ageSec}s ago`);
      } catch (_) {}
    }
  }
}

checkStatus().catch(console.error);
