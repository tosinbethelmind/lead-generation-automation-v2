/**
 * @file scripts/solarquotepro_isolated_harvester.js
 * Zero-Cost Daily Lead Harvester for SolarQuotePro.ng
 * Uses live Overpass real lead extraction via liveLeadHarvester.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

function loadEnv() {
  const localEnvPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(localEnvPath)) {
    parseEnvFile(localEnvPath);
  }
}

loadEnv();

function getCleanCredential(env1, env2, fallback) {
  const v1 = env1 ? env1.trim() : '';
  const v2 = env2 ? env2.trim() : '';
  return v1 || v2 || fallback;
}

const MAIN_SUPABASE_URL = getCleanCredential(process.env.SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://pnsrjsyiygxdcxkpgbzx.supabase.co');
const MAIN_SUPABASE_KEY = getCleanCredential(process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_KEY, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8');

const supabaseMain = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_KEY, { auth: { persistSession: false } });

async function runSolarQuoteProIsolatedHarvester(targetQuota = 2500, isDryRun = false) {
  console.log('\n===========================================================');
  console.log('☀️ SOLARQUOTEPRO ISOLATED REAL LEAD HARVESTER');
  console.log(`🎯 Target Quota: ${targetQuota.toLocaleString()} | Mode: ${isDryRun ? 'DRY RUN' : 'LIVE DB SYNC'}`);
  console.log('===========================================================\n');

  try {
    // Import live lead harvester from src/lib/liveLeadHarvester
    const { harvestLiveSolarLeads } = await import('../src/lib/liveLeadHarvester');
    const result = await harvestLiveSolarLeads();

    console.log(`📊 Harvest Completed — Added: ${result.added}, Total Solar Leads in DB: ${result.totalSolar}`);
    return result;
  } catch (err) {
    console.error('❌ Solar Harvester Error:', err.message);
    return { added: 0, totalSolar: 0 };
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const count = countIdx !== -1 && args[countIdx + 1] ? parseInt(args[countIdx + 1], 10) : 2500;

  runSolarQuoteProIsolatedHarvester(count, isDryRun).catch(console.error);
}

module.exports = { runSolarQuoteProIsolatedHarvester };
