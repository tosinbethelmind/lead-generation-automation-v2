/**
 * @file scripts/social_multi_channel_scraper.js
 * Multi-Channel Zero-Cost Social Scraper CLI & GitHub Action Runner.
 * Supports Facebook, LinkedIn, TikTok, and Instagram.
 */

let ws;
try {
  ws = require('ws');
  globalThis.WebSocket = ws;
  global.WebSocket = ws;
} catch (_) {}

const fs = require('fs');
const path = require('path');

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

async function runSocialHarvestRunner() {
  console.log('==================================================');
  console.log('🚀 MULTI-CHANNEL ZERO-COST SOCIAL SCRAPER RUNNER');
  console.log('   (Instagram, Facebook, LinkedIn, TikTok)');
  console.log('==================================================\n');

  try {
    const { harvestLiveSolarLeads, harvestLiveLagosLeads } = require('../dist/lib/liveLeadHarvester.js');
    console.log('⚡ Running Solar & Lagos Multi-Channel Social Extraction...');
    const solarRes = await harvestLiveSolarLeads();
    console.log(`✓ Solar Engine Output:`, solarRes);
    const lagosRes = await harvestLiveLagosLeads();
    console.log(`✓ Lagos Engine Output:`, lagosRes);
  } catch (_) {
    // If TS build isn't in dist, invoke tsx
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const { stdout } = await execPromise('npx tsx -e "import { harvestLiveSolarLeads, harvestLiveLagosLeads } from \'./src/lib/liveLeadHarvester\'; (async () => { console.log(await harvestLiveSolarLeads()); console.log(await harvestLiveLagosLeads()); })();"');
    console.log(stdout);
  }
}

runSocialHarvestRunner().catch(err => {
  console.error('Fatal Error:', err.message);
});
