import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const PID_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_runner.pid');
const HEARTBEAT_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_heartbeat.json');
const LOG_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_runner.log');

function getRunnerStatus() {
  let isRunning = false;
  let pid: number | null = null;
  let heartbeat: any = null;

  if (fs.existsSync(PID_FILE)) {
    try {
      const pidStr = fs.readFileSync(PID_FILE, 'utf8').trim();
      pid = parseInt(pidStr, 10);
      if (!isNaN(pid)) {
        try {
          // Check process existence via signal 0
          process.kill(pid, 0);
          isRunning = true;
        } catch (_) {
          isRunning = false;
        }
      }
    } catch (_) {}
  }

  if (fs.existsSync(HEARTBEAT_FILE)) {
    try {
      heartbeat = JSON.parse(fs.readFileSync(HEARTBEAT_FILE, 'utf8'));
    } catch (_) {}
  }

  return { isRunning, pid, heartbeat };
}

export async function GET() {
  try {
    const { isRunning, pid, heartbeat } = getRunnerStatus();

    let latestLogs: string[] = [];
    if (fs.existsSync(LOG_FILE)) {
      try {
        const rawLog = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = rawLog.split('\n').filter(Boolean);
        latestLogs = lines.slice(-10).reverse();
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      isRunning,
      pid,
      heartbeat,
      latestLogs,
      targetDomain: 'www.solarquotepro.ng',
      mode: '100% Isolated Pipeline'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isRunning, pid: existingPid } = getRunnerStatus();
    if (isRunning) {
      return NextResponse.json({
        success: true,
        message: `SolarQuotePro Isolated Pipeline is already running (PID ${existingPid}).`,
        pid: existingPid
      });
    }

    const body = await req.json().catch(() => ({}));
    const isOnce = body.once ?? false;
    const isDryRun = body.dryRun ?? false;

    const scriptPath = path.join(process.cwd(), 'scripts', 'solarquotepro_isolated_runner.js');
    const args: string[] = [];
    if (isOnce) args.push('--once');
    if (isDryRun) args.push('--dry-run');

    console.log(`[API] Spawning Isolated Pipeline Runner: node ${scriptPath} ${args.join(' ')}`);

    const child = spawn('node', [scriptPath, ...args], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });

    child.unref();

    return NextResponse.json({
      success: true,
      message: 'SolarQuotePro Isolated Pipeline launched successfully.',
      pid: child.pid,
      mode: isOnce ? 'Single Run' : 'Daemon Loop'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { isRunning, pid } = getRunnerStatus();
    if (!isRunning || !pid) {
      return NextResponse.json({ success: true, message: 'SolarQuotePro Isolated Pipeline is not running.' });
    }

    try {
      process.kill(pid, 'SIGTERM');
    } catch (_) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch (_) {}
    }

    if (fs.existsSync(PID_FILE)) {
      try {
        fs.unlinkSync(PID_FILE);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `SolarQuotePro Isolated Pipeline process (PID ${pid}) stopped.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
