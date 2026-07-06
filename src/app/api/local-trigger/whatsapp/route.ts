// src/app/api/local-trigger/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Check if the WhatsApp Baileys service is currently running.
 * It checks by sending a request to the status endpoint (localhost:3007/status)
 * and verifies if the parent PID JSON file exists.
 */
export async function GET() {
  try {
    let isRunning = false;
    let status = 'offline';
    let qrCodeUrl = '';
    let qrRaw = '';
    let pid = null;

    const parentPidPath = path.resolve(process.cwd(), 'whatsapp_baileys_parent_pid.json');
    if (fs.existsSync(parentPidPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(parentPidPath, 'utf8'));
        pid = data.pid;
      } catch (e) {
        console.warn('Error reading WhatsApp parent PID file:', e);
      }
    }

    // Ping the service port (3007 by default)
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
      
      const res = await fetch('http://localhost:3007/status', {
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(id);
      
      if (res.ok) {
        const data = await res.json();
        isRunning = true;
        status = data.status || 'disconnected';
        qrCodeUrl = data.qrCodeUrl || '';
        qrRaw = data.qrRaw || '';
      }
    } catch (err) {
      // If we couldn't connect, it is either not running or port is blocked
      isRunning = false;
      status = 'offline';
    }

    return NextResponse.json({
      isRunning,
      status,
      qrCodeUrl,
      qrRaw,
      pid
    });
  } catch (err: any) {
    return NextResponse.json({ isRunning: false, status: 'offline', error: err.message });
  }
}

/**
 * Start the WhatsApp Baileys background service.
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'WhatsApp service runner cannot be started in production.' },
      { status: 400 }
    );
  }

  try {
    // 1. Check if already running first
    try {
      const checkRes = await fetch('http://localhost:3007/status', { cache: 'no-store' });
      if (checkRes.ok) {
        return NextResponse.json({ message: 'WhatsApp service is already running.' }, { status: 200 });
      }
    } catch (e) {}

    // Create a write stream for logging
    const logPath = path.resolve(process.cwd(), 'whatsapp_baileys.log');
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });

    const scriptPath = path.resolve(process.cwd(), 'scripts', 'whatsapp_baileys.js');
    logStream.write(`\n--- Starting WhatsApp Baileys service at ${new Date().toISOString()} ---\n`);
    logStream.write(`Script: ${scriptPath}\n`);

    // Spawn the background node process
    const child = spawn('node', [scriptPath], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd(),
      env: { ...process.env }
    });

    child.stdout?.pipe(logStream);
    child.stderr?.pipe(logStream);

    child.on('error', (err) => {
      logStream.write(`Spawn error: ${err.message}\n`);
    });

    // Save the parent PID so we can stop it later
    const parentPidPath = path.resolve(process.cwd(), 'whatsapp_baileys_parent_pid.json');
    fs.writeFileSync(parentPidPath, JSON.stringify({ pid: child.pid, startedAt: Date.now() }), 'utf8');

    // Detach the child process
    child.unref();

    return NextResponse.json({ message: 'WhatsApp service started.', parentPid: child.pid }, { status: 200 });
  } catch (err: any) {
    console.error('Failed to start WhatsApp Baileys service:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * Stop the WhatsApp Baileys background service.
 */
export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'WhatsApp service runner cannot be managed in production.' },
      { status: 400 }
    );
  }

  try {
    const parentPidPath = path.resolve(process.cwd(), 'whatsapp_baileys_parent_pid.json');
    let parentPid: number | null = null;

    if (fs.existsSync(parentPidPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(parentPidPath, 'utf8'));
        parentPid = data.pid;
      } catch (e) {}
    }

    if (parentPid) {
      if (process.platform === 'win32') {
        // Kill the parent command shell and all its children recursively
        exec(`taskkill /pid ${parentPid} /f /t`, (err) => {
          if (err) console.error('Error killing process tree on Windows:', err);
        });
      } else {
        try {
          process.kill(-parentPid); // group kill
        } catch (err) {
          try {
            process.kill(parentPid);
          } catch (e) {}
        }
      }
    } else {
      // Fallback: If no PID is stored, kill whatever process is listening on Port 3007
      if (process.platform === 'win32') {
        // On Windows find and kill the process listening on port 3007
        exec(`netstat -ano | findstr :3007`, (err, stdout) => {
          if (!err && stdout) {
            const lines = stdout.split('\n');
            for (const line of lines) {
              const parts = line.trim().split(/\s+/);
              const pidPart = parts[parts.length - 1];
              if (pidPart && /^\d+$/.test(pidPart)) {
                exec(`taskkill /pid ${pidPart} /f /t`);
              }
            }
          }
        });
      } else {
        exec(`lsof -t -i:3007 | xargs kill -9`);
      }
    }

    // Clean up the PID file
    try {
      if (fs.existsSync(parentPidPath)) {
        fs.unlinkSync(parentPidPath);
      }
    } catch (e) {}

    return NextResponse.json({ message: 'WhatsApp service stopped.' }, { status: 200 });
  } catch (err: any) {
    console.error('Failed to stop WhatsApp Baileys service:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
