#!/usr/bin/env node
/**
 * cloud_runner_entrypoint.js
 * 
 * Cloud entrypoint for the ApexReach job runner on Fly.io / Render / Railway.
 * 
 * 1. Starts a minimal HTTP server on PORT so the cloud host's health check passes.
 * 2. Spawns + auto-restarts keep_alive_runner.js (which runs local_job_runner.ts).
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '8080', 10);
const projectDir = path.resolve(__dirname, '..');

// ── 1. Minimal health check HTTP server ─────────────────────────────────────
const server = http.createServer((req, res) => {
  let status = 'ok';
  let isRunning = false;
  try {
    const hbPath = path.join(projectDir, 'local_runner_heartbeat.json');
    if (fs.existsSync(hbPath)) {
      const hb = JSON.parse(fs.readFileSync(hbPath, 'utf8'));
      isRunning = Date.now() - hb.last_seen < 15000;
    }
  } catch (_) {}

  const code = isRunning ? 200 : 503;
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status, isRunning, ts: Date.now() }));
});

server.listen(PORT, () => {
  console.log(`[CloudEntrypoint] Health check server listening on port ${PORT}`);
});

// ── 2. Keep-alive runner ─────────────────────────────────────────────────────
function startRunner() {
  console.log(`[CloudEntrypoint] Starting keep_alive_runner.js…`);
  const child = spawn('node', ['scripts/keep_alive_runner.js'], {
    stdio: 'inherit',
    cwd: projectDir,
    shell: false,
  });

  child.on('close', (code) => {
    console.log(`[CloudEntrypoint] Runner exited (${code}). Restarting in 5s…`);
    setTimeout(startRunner, 5000);
  });

  child.on('error', (err) => {
    console.error('[CloudEntrypoint] Spawn error:', err);
  });
}

startRunner();
