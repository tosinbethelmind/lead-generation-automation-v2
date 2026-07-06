// src/app/api/local-trigger/route.ts
import { NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

import { supabase } from '@/lib/supabaseClient';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Check if the local runner is currently running based on the heartbeat file.
 */
export async function GET() {
  try {
    let isRunning = false;
    let pid = null;
    let lastSeen = null;
    let currentJob = null;

    // 1. Try local filesystem heartbeat first (only if NOT on a serverless container like Vercel)
    const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
    if (!isServerless) {
      try {
        const heartbeatPath = path.resolve(process.cwd(), 'local_runner_heartbeat.json');
        if (fs.existsSync(heartbeatPath)) {
          const data = JSON.parse(fs.readFileSync(heartbeatPath, 'utf8'));
          isRunning = Date.now() - data.last_seen < 10000; // 10 seconds threshold
          pid = data.pid;
          lastSeen = data.last_seen;
          currentJob = data.currentJob || null;
        }
      } catch (e) {
        console.warn('Error reading local heartbeat file:', e);
      }
    }

    // 2. If not running locally (or running on Vercel), fall back to querying the Supabase log heartbeat
    if (!isRunning && supabase) {
      try {
        const { data: dbLogs } = await supabase
          .from('logs')
          .select('*')
          .eq('run_id', 'local_runner')
          .eq('step', 'heartbeat')
          .order('created_at', { ascending: false })
          .limit(1);

        if (dbLogs && dbLogs.length > 0) {
          const logEntry = dbLogs[0];
          const logTime = new Date(logEntry.created_at || logEntry.timestamp).getTime();
          // 12 seconds threshold to allow minor database latency
          if (Date.now() - logTime < 12000) {
            const parsed = JSON.parse(logEntry.message);
            isRunning = true;
            pid = parsed.pid;
            lastSeen = parsed.last_seen;
            currentJob = parsed.currentJob || null;
          }
        }
      } catch (dbErr) {
        console.warn('Database error while retrieving runner heartbeat:', dbErr);
      }
    }

    // Fetch active and completed scraper jobs
    let activeJobs: any[] = [];
    let completedJobs: any[] = [];

    if (supabase) {
      try {
        const { data: runningOrQueued } = await supabase
          .from('scrape_jobs')
          .select('*')
          .in('status', ['running', 'queued'])
          .order('created_at', { ascending: true })
          .limit(10);
        
        if (runningOrQueued) {
          activeJobs = runningOrQueued;
        }

        const { data: recentlyFinished } = await supabase
          .from('scrape_jobs')
          .select('*')
          .in('status', ['completed', 'failed'])
          .order('updated_at', { ascending: false })
          .limit(5);

        if (recentlyFinished) {
          completedJobs = recentlyFinished;
        }
      } catch (dbErr) {
        console.warn('Database error while retrieving active jobs:', dbErr);
      }
    } else {
      // Fallback local JSON database reading
      try {
        const FALLBACK_JOBS_FILE = isServerless
          ? path.join('/tmp', 'scrape_jobs.json')
          : path.join(process.cwd(), 'local_db', 'scrape_jobs.json');

        if (fs.existsSync(FALLBACK_JOBS_FILE)) {
          const content = fs.readFileSync(FALLBACK_JOBS_FILE, 'utf-8');
          const allJobsObj = JSON.parse(content) as Record<string, any>;
          const allJobs = Object.values(allJobsObj);
          
          activeJobs = allJobs
             .filter((j: any) => j.status === 'running' || j.status === 'queued')
            .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .slice(0, 10);

          completedJobs = allJobs
            .filter((j: any) => j.status === 'completed' || j.status === 'failed')
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5);
        }
      } catch (e) {}
    }

    return corsResponse({ 
      isRunning, 
      pid, 
      lastSeen,
      currentJob,
      activeJobs,
      completedJobs,
      isProduction: isServerless
    });
  } catch (err: any) {
    return corsResponse({ isRunning: false, error: err.message, activeJobs: [], completedJobs: [] }, 500);
  }
}

/**
 * Start the local job runner.
 */
export async function POST() {
  // Prevent execution on Vercel production builds.
  if (process.env.NODE_ENV === 'production') {
    return corsResponse(
      { error: 'Local runner cannot be started in production.' },
      400
    );
  }

  try {
    // First check if it's already running to prevent double spawning
    const heartbeatPath = path.resolve(process.cwd(), 'local_runner_heartbeat.json');
    if (fs.existsSync(heartbeatPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(heartbeatPath, 'utf8'));
        const isRunning = Date.now() - data.last_seen < 10000;
        if (isRunning) {
          return corsResponse({ message: 'Local runner is already running.', pid: data.pid }, 200);
        }
      } catch (e) {}
    }

    // Create a write stream for logging
    const logPath = path.resolve(process.cwd(), 'local_runner.log');
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });

    // Spawn the node script directly instead of via npm to avoid shell and path resolution issues
    const runnerScript = path.resolve(process.cwd(), 'scripts', 'keep_alive_runner.js');
    logStream.write(`\n--- Starting local runner at ${new Date().toISOString()} ---\n`);
    logStream.write(`Script: ${runnerScript}\n`);

    const child = spawn('node', [runnerScript], {
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
    
    // Write parent PID to a file so we can kill the tree later
    const parentPidPath = path.resolve(process.cwd(), 'local_runner_parent_pid.json');
    fs.writeFileSync(parentPidPath, JSON.stringify({ pid: child.pid, startedAt: Date.now() }), 'utf8');

    // Detach so the process continues after the request ends.
    child.unref();
    
    return corsResponse({ message: 'Local runner started.', parentPid: child.pid }, 200);
  } catch (err: any) {
    console.error('Failed to start local runner:', err);
    return corsResponse({ error: err.message }, 500);
  }
}

/**
 * Stop the local job runner process tree.
 */
export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return corsResponse(
      { error: 'Local runner cannot be managed in production.' },
      400
    );
  }

  try {
    const parentPidPath = path.resolve(process.cwd(), 'local_runner_parent_pid.json');
    const heartbeatPath = path.resolve(process.cwd(), 'local_runner_heartbeat.json');
    
    let parentPid: number | null = null;
    let childPid: number | null = null;

    if (fs.existsSync(parentPidPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(parentPidPath, 'utf8'));
        parentPid = data.pid;
      } catch (e) {}
    }

    if (fs.existsSync(heartbeatPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(heartbeatPath, 'utf8'));
        childPid = data.pid;
      } catch (e) {}
    }

    // Kill process tree
    const targetPid = parentPid || childPid;
    if (targetPid) {
      if (process.platform === 'win32') {
        // Kill the parent command shell and all its children recursively
        exec(`taskkill /pid ${targetPid} /f /t`, (err) => {
          if (err) console.error('Error killing process tree on Windows:', err);
        });
      } else {
        try {
          process.kill(-targetPid); // process group kill
        } catch (err) {
          try {
            process.kill(targetPid);
          } catch (e) {}
        }
      }
    }

    // Clean up files
    try { if (fs.existsSync(parentPidPath)) fs.unlinkSync(parentPidPath); } catch (e) {}
    try { if (fs.existsSync(heartbeatPath)) fs.unlinkSync(heartbeatPath); } catch (e) {}

    return corsResponse({ message: 'Local runner stopped.' }, 200);
  } catch (err: any) {
    console.error('Failed to stop local runner:', err);
    return corsResponse({ error: err.message }, 500);
  }
}
