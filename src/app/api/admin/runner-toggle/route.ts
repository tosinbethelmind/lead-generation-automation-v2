import { NextRequest, NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getAppCwd } from '@/lib/getCwd';

export const dynamic = 'force-dynamic';

function isLocalRunnerActive(): boolean {
  try {
    const heartbeatPath = path.join(process.cwd(), 'local_runner_heartbeat.json');
    if (fs.existsSync(heartbeatPath)) {
      const data = JSON.parse(fs.readFileSync(heartbeatPath, 'utf8'));
      if (data && data.last_seen) {
        const diffMs = Date.now() - Number(data.last_seen);
        return diffMs < 60000; // Active within last 60s
      }
    }
  } catch (_) {}
  return false;
}

export async function GET() {
  try {
    const active = isLocalRunnerActive();
    return NextResponse.json({
      success: true,
      active,
      status: active ? 'ONLINE' : 'OFFLINE',
      message: active
        ? '🟢 Local Stealth Runner is active & processing jobs silently.'
        : '🔴 Local Runner is OFF (Laptop CPU & RAM protected).',
      isVercel: !!process.env.VERCEL,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enable = body.enable === true;

    if (enable) {
      if (process.env.VERCEL) {
        return NextResponse.json({
          success: false,
          error: 'Vercel is serverless. To run local jobs, execute START_RUNNER_MANUAL.bat or START_SILENT_RUNNER.bat on your laptop.',
        }, { status: 400 });
      }

      const projectDir = getAppCwd();
      const runnerScript = path.join(projectDir, 'scripts', 'keep_alive_runner.js');
      
      const child = spawn('node', [runnerScript], {
        cwd: projectDir,
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });
      child.unref();

      return NextResponse.json({
        success: true,
        active: true,
        message: '🚀 Silent Stealth Runner turned ON! (Running in background without popups)',
      });
    } else {
      // Turn OFF: Kill runner processes
      if (!process.env.VERCEL) {
        const killCmd = `powershell -Command "Stop-Process -Name comet, tor -Force -ErrorAction SilentlyContinue; Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*keep_alive*' -or $_.CommandLine -like '*local_job_runner*' } | Stop-Process -Force -ErrorAction SilentlyContinue"`;
        exec(killCmd, () => {});
      }

      // Remove heartbeat file
      try {
        const heartbeatPath = path.join(process.cwd(), 'local_runner_heartbeat.json');
        if (fs.existsSync(heartbeatPath)) fs.unlinkSync(heartbeatPath);
      } catch (_) {}

      return NextResponse.json({
        success: true,
        active: false,
        message: '🛑 Local Runner turned OFF! Laptop CPU & RAM protected.',
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
