import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const supabase = getSupabaseClient();

export function getLagosTimeString(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const headers = { 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0' };

    const withTimeout = (promise: Promise<any>, timeoutMs = 1000) => 
      Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
      ]);

    // 1. Fetch total solar leads
    let totalSolarLeadsCount = 0;
    try {
      const res: any = await withTimeout((supabase as any)
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .or('category.ilike.%solar%,category.ilike.%inverter%,category.ilike.%renewable%,name.ilike.%solar%,name.ilike.%inverter%,query.ilike.%solar%,query.ilike.%inverter%,source_query_or_seed.ilike.%solar%,source_query_or_seed.ilike.%inverter%,business_summary.ilike.%solar%'));
      if (typeof res?.count === 'number') totalSolarLeadsCount = res.count;
    } catch (_) {}

    // Read local_db/leads_db.json as fallback
    let localSolarCount = 0;
    try {
      const localDbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
      const tmpDbPath = path.join('/tmp', 'leads_db.json');
      const targetPath = fs.existsSync(localDbPath) ? localDbPath : (fs.existsSync(tmpDbPath) ? tmpDbPath : null);
      if (targetPath) {
        const raw = fs.readFileSync(targetPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localSolarCount = parsed.filter((l: any) => {
            const blob = `${l.category || ''} ${l.name || ''} ${l.source_query_or_seed || ''} ${l.business_summary || ''}`.toLowerCase();
            return blob.includes('solar') || blob.includes('inverter') || blob.includes('renewable');
          }).length;
        }
      }
    } catch (_) {}

    const resolvedSolarCount = Math.max(totalSolarLeadsCount, localSolarCount);

    // 2. Fetch contacted solar installer outreach count
    let totalContacted = 0;
    try {
      const res: any = await withTimeout((supabase as any)
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .or('source_query_or_seed.ilike.%solar%,category.ilike.%solar%,business_summary.ilike.%solar%,notes.ilike.%solar%')
        .eq('status', 'CONTACTED'));
      if (typeof res?.count === 'number') totalContacted = res.count;
    } catch (_) {}

    // 3. Count scraped public installer group links
    let groupLinksCount = 0;
    const groupLinksPath = path.join(process.cwd(), 'local_db', 'scraped_group_links.json');
    if (fs.existsSync(groupLinksPath)) {
      try {
        const groups = JSON.parse(fs.readFileSync(groupLinksPath, 'utf8'));
        groupLinksCount = Array.isArray(groups) ? groups.length : 0;
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      pipeline: 'SolarQuotePro Solar Engine',
      stats: {
        totalScrapedInstallers: resolvedSolarCount,
        totalContactedOutreach: totalContacted || 0,
        groupLinksDiscovered: groupLinksCount,
        dualSyncStatus: 'online',
        targetMarket: 'Nigeria (36 States + FCT)',
        targetDomain: 'www.solarquotepro.ng',
        lastUpdatedTime: getLagosTimeString() + ' WAT'
      }
    }, { headers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;
    const count = body.count || 2500;
    const channels = body.channels || ['groups', 'web_forms', 'email', 'jiji'];

    const scriptPath = path.join(process.cwd(), 'scripts', 'solarquotepro_multi_channel_outreach.js');
    const args = ['--count', String(count), '--channels', channels.join(',')];
    if (dryRun) args.push('--dry-run');

    console.log(`[API] Launching SolarQuotePro Outreach Arm: node ${scriptPath} ${args.join(' ')}`);

    const child = spawn('node', [scriptPath, ...args], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });

    child.unref();

    return NextResponse.json({
      success: true,
      message: 'SolarQuotePro Multi-Channel Outreach Pipeline launched successfully in background.',
      config: {
        targetCount: count,
        dryRun: dryRun,
        channels: channels
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
