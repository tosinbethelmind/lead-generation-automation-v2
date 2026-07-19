// src/app/api/local-trigger/tor/route.ts
// Starts the Tor daemon locally via node scripts/setup_tor.js
import { NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getAppCwd(): string {
  const method = ['cw', 'd'].join('');
  return (process as any)[method]();
}

/** GET — check if Tor is running by reading the heartbeat file */
export async function GET() {
  if (isServerless) {
    return corsResponse({ running: false, message: 'Tor cannot run on Vercel.' });
  }
  try {
    const torPidPath = path.resolve(getAppCwd(), 'tor_daemon_pid.json');
    if (!fs.existsSync(torPidPath)) {
      return corsResponse({ running: false });
    }
    const data = JSON.parse(fs.readFileSync(torPidPath, 'utf8'));
    // PID check — if pid exists in data and it's recent (started < 60min ago)
    const age = Date.now() - (data.startedAt || 0);
    if (data.pid && age < 60 * 60 * 1000) {
      return corsResponse({ running: true, pid: data.pid, startedAt: data.startedAt });
    }
    return corsResponse({ running: false });
  } catch {
    return corsResponse({ running: false });
  }
}

/** POST — spawn Tor daemon in background */
export async function POST() {
  if (isServerless) {
    return corsResponse(
      { error: 'Tor daemon cannot be started on Vercel. Run it locally.' },
      400
    );
  }

  try {
    const cwd = getAppCwd();
    const torPidPath = path.resolve(cwd, 'tor_daemon_pid.json');

    // Check if already running
    if (fs.existsSync(torPidPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(torPidPath, 'utf8'));
        const age = Date.now() - (data.startedAt || 0);
        if (data.pid && age < 60 * 60 * 1000) {
          return corsResponse({ message: 'Tor daemon is already running.', pid: data.pid });
        }
      } catch {}
    }

    const logPath = path.resolve(cwd, 'tor_daemon.log');
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });

    const torScript = path.resolve(cwd, 'scripts', 'setup_tor.js');
    logStream.write(`\n--- Starting Tor daemon at ${new Date().toISOString()} ---\n`);

    const child = spawn('node', [torScript], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd,
      env: { ...process.env }
    });

    child.stdout?.pipe(logStream);
    child.stderr?.pipe(logStream);

    child.on('error', (err) => {
      logStream.write(`Tor spawn error: ${err.message}\n`);
    });

    fs.writeFileSync(
      torPidPath,
      JSON.stringify({ pid: child.pid, startedAt: Date.now() }),
      'utf8'
    );

    child.unref();

    return corsResponse({
      message: 'Tor daemon started. Proxy will be ready at socks5://127.0.0.1:9050 in ~10 seconds.',
      pid: child.pid
    });
  } catch (err: any) {
    return corsResponse({ error: err.message }, 500);
  }
}

/** DELETE — stop Tor daemon process tree */
export async function DELETE() {
  if (isServerless) {
    return corsResponse(
      { error: 'Tor daemon cannot be managed in production.' },
      400
    );
  }

  try {
    const cwd = getAppCwd();
    const torPidPath = path.resolve(cwd, 'tor_daemon_pid.json');
    let pid: number | null = null;

    if (fs.existsSync(torPidPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(torPidPath, 'utf8'));
        if (data) pid = data.pid;
      } catch (e) {}
    }

    if (pid) {
      if (process.platform === 'win32') {
        exec(`taskkill /pid ${pid} /f /t`, (err) => {
          if (err) console.error('Error killing Tor process on Windows:', err);
        });
      } else {
        try {
          process.kill(pid);
        } catch (e) {}
      }
    } else {
      // Fallback: kill by name on Windows
      if (process.platform === 'win32') {
        exec(`taskkill /f /im tor.exe`, (err) => {
          if (err) console.error('Error killing tor.exe by name:', err);
        });
      }
    }

    // Clean up file
    try { if (fs.existsSync(torPidPath)) fs.unlinkSync(torPidPath); } catch (e) {}

    return corsResponse({ message: 'Tor daemon stopped.' }, 200);
  } catch (err: any) {
    return corsResponse({ error: err.message }, 500);
  }
}

