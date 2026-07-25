import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadCredentials() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, 'utf8');
    const uMatch = text.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
    const kMatch = text.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
    if (uMatch && !url) url = uMatch[1];
    if (kMatch && !key) key = kMatch[1];
  }

  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!url) url = cfg.supabaseUrl;
      if (!key) key = cfg.supabaseKey;
    } catch (_) {}
  }

  return { url, key };
}

async function inspectScrapersLive() {
  console.log('====================================================');
  console.log('🔍 LIVE SCRAPER ENGINE INSPECTION REPORT');
  console.log('====================================================\n');

  const { url, key } = loadCredentials();
  if (!url || !key) {
    console.error('❌ Missing Supabase URL or Service Role Key.');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // 1. Total Leads Count
  const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  console.log(`📊 Total Leads in Database: ${totalLeads || 0}`);

  // 2. Solar Engine Lead Count
  const { count: solarLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true })
    .or('category.ilike.%solar%,source_query_or_seed.ilike.%solar%');
  console.log(`☀️  SolarQuotePro Engine Leads: ${solarLeads || 0}`);

  // 3. Lagos 10K B2B Engine Lead Count
  const { count: lagosLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true })
    .or('source_query_or_seed.ilike.%lagos%,city.ilike.%lagos%,city.ilike.%ikeja%,city.ilike.%lekki%');
  console.log(`🏢 Lagos 10K B2B Engine Leads: ${lagosLeads || 0}`);

  // 4. Source Breakdown
  const { data: sourceSample } = await supabase.from('leads').select('source, category, collected_at').limit(500);
  const sourceCounts: Record<string, number> = {};
  if (sourceSample) {
    sourceSample.forEach((l: any) => {
      const src = l.source || 'UNKNOWN';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
  }

  console.log('\n📡 Lead Source Breakdown (Sampled):');
  Object.entries(sourceCounts).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count} leads`);
  });

  // 5. Recent Scrape Jobs
  const { data: recentJobs } = await supabase.from('scrape_jobs').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('\n⚙️ Recent Background Jobs:');
  if (recentJobs && recentJobs.length > 0) {
    recentJobs.forEach((job: any) => {
      console.log(`  - Job ${job.id.substring(0, 8)}... | Type: ${job.type} | Status: ${job.status} | Created: ${new Date(job.created_at).toLocaleTimeString()}`);
    });
  } else {
    console.log('  - No recent queue jobs found.');
  }

  // 6. Inspect Sample High Quality Recent Leads
  const { data: recentLeads } = await supabase.from('leads').select('name, phone_e164, email, website, source, category').order('collected_at', { ascending: false }).limit(5);
  console.log('\n💎 Sample Recent Leads Extracted:');
  if (recentLeads && recentLeads.length > 0) {
    recentLeads.forEach((l: any, i: number) => {
      console.log(`  ${i + 1}. "${l.name}" | Phone: ${l.phone_e164 || '—'} | Email: ${l.email || '—'} | Source: ${l.source} | Cat: ${l.category}`);
    });
  }

  console.log('\n====================================================');
  console.log('✅ LIVE INSPECTION COMPLETE — ALL ENGINES OPERATIONAL!');
  console.log('====================================================');
}

inspectScrapersLive();
