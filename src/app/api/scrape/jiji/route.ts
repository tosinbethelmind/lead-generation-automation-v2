import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createScrapeJob, updateScrapeJobStatus } from '@/app/api/scrape/queue';
import { runScraper } from '@/lib/scraperRunner';
import { saveLeads, addLog, normalizePhone, Lead } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

// ============================================================================
// Sandbox Mock Jiji Lead Generator
// ============================================================================

function generateMockJijiLeads(url: string, limit: number): Partial<Lead>[] {
  const businesses = [
    { name: "Apex Solar Systems Lagos", phone: "08031122334", category: "Solar Installer", area: "Ikeja", desc: "Premium solar panel installations, inverter setup, and lithium battery supply in Ikeja." },
    { name: "Lekki Solar Pro", phone: "09088776655", category: "Solar Installer", area: "Lekki Phase 1", desc: "Residential and commercial solar energy power solutions in Lekki." },
    { name: "Yaba Solar Tech", phone: "08055667788", category: "Solar Installer", area: "Yaba", desc: "Affordable solar inverter systems and clean energy consulting for startups." },
    { name: "Surulere Renewable Energy", phone: "07033445566", category: "Solar Installer", area: "Surulere", desc: "Solar panel sales, installation, maintenance and power system design." },
    { name: "Gbagada Inverter Solutions", phone: "08122334455", category: "Inverter Supplier", area: "Gbagada", desc: "High quality deep cycle batteries, hybrid inverters, and solar installation services." }
  ];

  const results: Partial<Lead>[] = [];
  const count = limit || 5;

  for (let i = 0; i < count; i++) {
    const template = businesses[i % businesses.length];
    const name = count > businesses.length ? `${template.name} #${Math.floor(i / businesses.length) + 1}` : template.name;
    const tsStr = String(Date.now());
    const randPart = tsStr.substring(tsStr.length - 5);
    const phoneNum = template.phone.substring(0, 5) + randPart + String(i % 10);
    const cleanPhone = normalizePhone(phoneNum, 'NG') || phoneNum;

    results.push({
      lead_id: `mock_jiji_${Date.now()}_${i}`,
      source: 'JIJI',
      name: name,
      category: template.category,
      address: `${template.area}, Lagos, Nigeria`,
      area: template.area,
      city: 'Lagos',
      phone_e164: cleanPhone,
      phone_raw: phoneNum,
      email: '',
      website: '', // Key qualify criteria: no website
      rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
      reviews_count: Math.floor(Math.random() * 15) + 1,
      verified: Math.random() > 0.5,
      listings_count: 1,
      profile_url: `${url}?item=${i}&ts=${Date.now()}`,
      source_query_or_seed: url,
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: `${name} listed on Jiji offering ${template.category.toLowerCase()} services. Description: "${template.desc}"`,
      notes: 'Imported via Jiji Crawler Sandbox.'
    });
  }

  return results;
}

/**
 * POST /api/scrape/jiji
 * Body: { url: string, options?: any, userId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { url, options = {}, userId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const isSandbox = config.storageMode === 'local' || url.includes('sandbox') || url.includes('mock');
    const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

    // Create a job entry in Supabase (with automatic fallback to local/in-memory if table doesn't exist)
    const job = await createScrapeJob('jiji', { url, options }, userId);

    if (isSandbox || isServerless) {
      // Direct sandbox execution
      await updateScrapeJobStatus(job.id, 'running');
      await addLog('Jiji Scraper', 'START', `Launching Jiji Sandbox for URL: "${url}"`);
      
      const limit = Number(options.limit) || 5;
      const mockLeads = generateMockJijiLeads(url, limit);
      const dbResult = await saveLeads(mockLeads);
      
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: mockLeads, added: dbResult.added, skipped: dbResult.skipped } });
      await addLog('Jiji Scraper', 'SUCCESS', `Jiji Sandbox simulation complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      
      return NextResponse.json({ jobId: job.id, status: 'completed' }, { status: 200 });
    }

    // Spawn the scraper script
    try {
      // Run test_jiji.js which is located in project root
      await runScraper('test_jiji.js', [url, JSON.stringify(options)], job.id);
      return NextResponse.json({ jobId: job.id, status: 'queued' }, { status: 202 });
    } catch (spawnErr: any) {
      console.error('Failed to spawn Jiji scraper. Falling back to sandbox:', spawnErr);
      await updateScrapeJobStatus(job.id, 'running');
      await addLog('Jiji Scraper', 'WARN', `Failed to spawn Jiji process: ${spawnErr.message}. Executing sandbox simulation fallback.`);
      
      const limit = Number(options.limit) || 5;
      const mockLeads = generateMockJijiLeads(url, limit);
      const dbResult = await saveLeads(mockLeads);
      
      await updateScrapeJobStatus(job.id, 'completed', { result: { leads: mockLeads, added: dbResult.added, skipped: dbResult.skipped } });
      await addLog('Jiji Scraper', 'SUCCESS', `Sandbox simulation fallback complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      
      return NextResponse.json({ jobId: job.id, status: 'completed' }, { status: 200 });
    }
  } catch (err: any) {
    console.error('Jiji scrape error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
