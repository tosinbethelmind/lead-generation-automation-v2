/**
 * @file scripts/async_lagos_10k_scraper.js
 * High-Speed Resilient Multi-Endpoint Scraper for 10K Lagos B2B Engine.
 * Uses live Overpass real lead extraction via liveLeadHarvester.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

try {
  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = require('ws');
  }
} catch (_) {}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

const localEnvPath = path.join(__dirname, '../.env.local');
parseEnvFile(localEnvPath);

function getCleanCredential(env1, env2, fallback) {
  const v1 = env1 ? env1.trim() : '';
  const v2 = env2 ? env2.trim() : '';
  return v1 || v2 || fallback;
}

const SUPABASE_URL = getCleanCredential(process.env.SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://pnsrjsyiygxdcxkpgbzx.supabase.co');
const SUPABASE_KEY = getCleanCredential(process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_KEY, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8');

const ws = require('ws');
try {
  if (typeof globalThis.WebSocket === 'undefined') globalThis.WebSocket = ws;
  if (typeof global.WebSocket === 'undefined') global.WebSocket = ws;
} catch (_) {}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false }, realtime: { transport: ws } });

const LOCAL_DB_DIR = path.join(__dirname, '../local_db');
if (!fs.existsSync(LOCAL_DB_DIR)) {
  try { fs.mkdirSync(LOCAL_DB_DIR, { recursive: true }); } catch (_) {}
}

const PID_FILE = path.join(LOCAL_DB_DIR, 'lagos10k_runner.pid');
const LOG_FILE = path.join(LOCAL_DB_DIR, 'lagos10k_runner.log');

try {
  fs.writeFileSync(PID_FILE, process.pid.toString());
} catch (_) {}

function logMessage(msg) {
  const time = new Date().toISOString();
  const formatted = `[${time}] ${msg}`;
  console.log(formatted);
  try {
    fs.appendFileSync(LOG_FILE, formatted + '\n');
  } catch (_) {}
}

async function runResilientLagosHarvester(dryRun = false) {
  logMessage('==================================================');
  logMessage('🚀 HIGH-EFFICIENCY RESILIENT LAGOS 10K HARVESTER');
  logMessage('==================================================');

  const startTime = Date.now();
  logMessage('⚡ Launching live Overpass Lagos B2B extraction...');

  try {
    const { harvestLiveLagosLeads } = await import('../src/lib/liveLeadHarvester');
    const result = await harvestLiveLagosLeads();
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

    logMessage(`Extracted & synced +${result.added} Verified Lagos Commercial Leads in ${durationSec} seconds!`);
    logMessage(`Total Lagos B2B Leads in Database: ${result.totalLagos}`);
  } catch (err) {
    logMessage(`❌ Lagos Harvester Error: ${err.message}`);
  }

  try { if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE); } catch (_) {}
}

const isDryRun = process.argv.includes('--dry-run');
runResilientLagosHarvester(isDryRun).catch(err => {
  logMessage(`FATAL ERROR: ${err.message}`);
  try { if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE); } catch (_) {}
});
