import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { harvestLiveIbadanLeads } from '@/lib/liveLeadHarvester';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const supabase = getSupabaseClient();

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const PID_FILE = path.join(LOCAL_DB_DIR, 'ibadan10k_runner.pid');
const LOG_FILE = path.join(LOCAL_DB_DIR, 'ibadan10k_runner.log');

export function getIbadanTimeString(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true });
}

function getIbadanRunnerStatus() {
  let isRunning = false;
  let pid: number | null = null;

  if (fs.existsSync(PID_FILE)) {
    try {
      const pidStr = fs.readFileSync(PID_FILE, 'utf8').trim();
      pid = parseInt(pidStr, 10);
      if (!isNaN(pid)) {
        try {
          process.kill(pid, 0);
          isRunning = true;
        } catch (_) {
          isRunning = false;
        }
      }
    } catch (_) {}
  }

  return { isRunning, pid };
}

const withTimeout = (promise: Promise<any>, timeoutMs = 1000) => 
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
  ]);

export async function GET(req?: Request) {
  try {
    const urlObj = req?.url ? new URL(req.url) : null;
    const isCron = req ? (req.headers?.get('x-vercel-cron') === '1' || (urlObj ? urlObj.searchParams.get('cron') === 'true' : false)) : false;
    const shouldHarvest = isCron || (urlObj ? urlObj.searchParams.get('harvest') === 'true' || urlObj.searchParams.get('refresh') === 'true' : false);

    const local = getIbadanRunnerStatus();
    let isRunning = local.isRunning;
    let pid = local.pid || null;
    let latestLogs: string[] = [];

    // Local log file tail
    if (fs.existsSync(LOG_FILE)) {
      try {
        const rawLog = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = rawLog.split('\n').filter(Boolean);
        latestLogs = lines.slice(-10).reverse();
      } catch (_) {}
    }

    // 24/7 Cloud Automated Execution: Harvest live on Cron or Manual Refresh
    if (shouldHarvest) {
      harvestLiveIbadanLeads().catch((err) => console.warn('[IbadanAPI] Background harvest error:', err.message));
    }

    // Fetch latest Ibadan logs from Supabase logs table
    try {
      const resLogs: any = await withTimeout((supabase as any)
        .from('logs')
        .select('created_at, timestamp, step, message')
        .or('step.ilike.*ibadan*,message.ilike.*ibadan*')
        .order('created_at', { ascending: false })
        .limit(8));

      const dbLogs = resLogs?.data;
      if (dbLogs && dbLogs.length > 0) {
        const cloudLogLines = dbLogs.map((l: any) => {
          const logDate = l.created_at || l.timestamp ? new Date(l.created_at || l.timestamp) : new Date();
          let rawMsg = l.message || '';
          rawMsg = rawMsg.replace(/<[^>]*>?/gm, '').replace(/^\[.*?WAT\]\s*/i, '').trim();
          return `[${getIbadanTimeString(logDate)} WAT] ${rawMsg}`;
        });
        latestLogs = Array.from(new Set([...latestLogs, ...cloudLogLines]));
      }
    } catch (err: any) {
      console.warn('[IbadanAPI] Log fetch warn:', err.message);
    }

    let localIbadanCount = 0;
    try {
      const { getLeads } = await import('@/lib/googleSheets');
      const parsed = await getLeads();
      if (Array.isArray(parsed) && parsed.length > 0) {
        const ibadanLeads = parsed.filter((l: any) => /ibadan|bodija|dugbe|ring road|challenge|mokola/i.test(`${l.city || ''} ${l.area || ''} ${l.source_query_or_seed || ''}`));
        localIbadanCount = ibadanLeads.length;
      }
    } catch (_) {}

    let totalIbadanLeads = localIbadanCount;
    try {
      const { count } = await (supabase as any)
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .or('source_query_or_seed.ilike.*ibadan*,city.ilike.*ibadan*,city.ilike.*bodija*,city.ilike.*dugbe*,city.ilike.*ring road*,area.ilike.*ibadan*');

      if (count !== null && count >= 0) totalIbadanLeads = count;
    } catch (_) {}

    const resolvedIbadanCount = Math.max(totalIbadanLeads, localIbadanCount);
    const headers = { 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0' };

    return NextResponse.json({
      success: true,
      pipeline: 'Ibadan 10K Multi-Sector B2B Engine',
      isRunning,
      pid,
      latestLogs,
      lastUpdatedTime: getIbadanTimeString() + ' WAT',
      stats: {
        totalIbadanLeads: resolvedIbadanCount,
        targetMarket: 'Ibadan Commercial Hub (Bodija, Dugbe, Challenge, Ring Road, Jericho, UI, Oluyole, Mokola, Iwo Road)',
        lastUpdatedTime: getIbadanTimeString() + ' WAT'
      },
      mode: '24/7 Non-Stop Cloud Engine + Dedicated Scraper Runner'
    }, { headers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;

    // 1. Log launch event
    try {
      await (supabase as any)
        .from('logs')
        .insert([{
          run_id: `ibadan_run_${Date.now()}`,
          timestamp: new Date().toISOString(),
          step: 'IBADAN_10K_LAUNCH',
          status: 'SUCCESS',
          message: `🏛️ [IBADAN-10K] 🚀 Launched Ibadan 10K B2B Scraper Engine (${getIbadanTimeString()} WAT)`
        }]);
    } catch (_) {}

    // 2. Spawn local node process if local_db exists
    let spawnedPid: number | null = null;
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'async_ibadan_10k_scraper.js');
      if (fs.existsSync(scriptPath)) {
        const args: string[] = [];
        if (dryRun) args.push('--dry-run');

        const child = spawn('node', [scriptPath, ...args], {
          detached: true,
          stdio: 'ignore',
          shell: true
        });
        child.unref();
        if (child.pid) spawnedPid = child.pid;
      }
    } catch (_) {}

    // 3. Trigger immediate live harvest pass
    let addedCount = 0;
    try {
      const harvestRes = await harvestLiveIbadanLeads();
      addedCount = harvestRes.added;
    } catch (err: any) {
      console.error('[IbadanAPI] Harvest error during launch:', err.message);
    }

    return NextResponse.json({
      success: true,
      message: `🏛️ 10K Ibadan B2B Engine Active! Harvested +${addedCount} leads at ${getIbadanTimeString()} WAT.`,
      pid: spawnedPid
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const local = getIbadanRunnerStatus();
    if (local.pid) {
      try { process.kill(local.pid, 'SIGKILL'); } catch (_) {}
      if (fs.existsSync(PID_FILE)) { try { fs.unlinkSync(PID_FILE); } catch (_) {} }
    }

    try {
      await (supabase as any)
        .from('logs')
        .insert([{
          run_id: `ibadan_stop_${Date.now()}`,
          timestamp: new Date().toISOString(),
          step: 'IBADAN_10K_STOP',
          status: 'SUCCESS',
          message: `🏛️ [IBADAN-10K] ⏹️ 10K Ibadan B2B Engine Process Stopped at ${getIbadanTimeString()} WAT.`
        }]);
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `Ibadan 10K Engine process stopped at ${getIbadanTimeString()} WAT.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
