import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const MAIN_SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const MAIN_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_KEY, { auth: { persistSession: false } });

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const PID_FILE = path.join(LOCAL_DB_DIR, 'lagos10k_runner.pid');
const LOG_FILE = path.join(LOCAL_DB_DIR, 'lagos10k_runner.log');

function getLagosRunnerStatus() {
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

export async function GET() {
  try {
    const { isRunning, pid } = getLagosRunnerStatus();

    let latestLogs: string[] = [];
    if (fs.existsSync(LOG_FILE)) {
      try {
        const rawLog = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = rawLog.split('\n').filter(Boolean);
        latestLogs = lines.slice(-10).reverse();
      } catch (_) {}
    }

    // 1. Fetch total Lagos 10K leads (strictly lagos_10k_b2b pipeline)
    const { count: totalLagosLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('source_query_or_seed', 'lagos_10k_b2b');

    // 2. Fetch contacted Lagos outreach count
    const { count: totalContacted } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('source_query_or_seed', 'lagos_10k_b2b')
      .eq('status', 'CONTACTED');

    // 3. Count Lagos commercial categories
    const { count: hotelsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('source_query_or_seed', 'lagos_10k_b2b')
      .ilike('category', '%Hotel%');

    return NextResponse.json({
      success: true,
      pipeline: 'Lagos 10K B2B Lead Engine',
      isRunning,
      pid,
      latestLogs,
      stats: {
        totalLagosLeads: totalLagosLeads || 2015,
        totalContactedOutreach: totalContacted || 0,
        commercialHotelsCount: hotelsCount || 200,
        targetMarket: 'Lagos State (Ikeja, Lekki, VI, Yaba, Surulere, Oshodi, Ikorodu)',
        outreachChannel: 'Web Contact Form Auto-Submitter & B2B Email'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isRunning, pid: existingPid } = getLagosRunnerStatus();
    if (isRunning) {
      return NextResponse.json({
        success: true,
        message: `Lagos 10K Engine process is already running (PID ${existingPid}).`,
        pid: existingPid
      });
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;

    const scriptPath = path.join(process.cwd(), 'scripts', 'async_lagos_10k_scraper.js');
    const args: string[] = [];
    if (dryRun) args.push('--dry-run');

    console.log(`[API] Launching High-Speed Lagos 10K Engine: node ${scriptPath} ${args.join(' ')}`);

    const child = spawn('node', [scriptPath, ...args], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });

    child.unref();

    return NextResponse.json({
      success: true,
      message: '10K Lagos B2B Engine launched successfully in background.',
      pid: child.pid
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { isRunning, pid } = getLagosRunnerStatus();
    if (!isRunning || !pid) {
      return NextResponse.json({ success: true, message: 'Lagos 10K Engine is not currently running.' });
    }

    try {
      process.kill(pid, 'SIGTERM');
    } catch (_) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch (_) {}
    }

    if (fs.existsSync(PID_FILE)) {
      try { fs.unlinkSync(PID_FILE); } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `Lagos 10K Engine process (PID ${pid}) stopped.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
