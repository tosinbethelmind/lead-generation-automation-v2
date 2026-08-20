/**
 * @file scripts/autonomous_traffic_daemon.js
 * 
 * 24/7 Autonomous Multi-Channel Traffic & Growth Daemon.
 * 
 * Functions:
 * 1. Generates ready-to-dispatch daily traffic packages for all 16 digital products.
 * 2. Automatically pings Google Indexing API for programmatic landing pages.
 * 3. Rotates daily focus products across high-intent niches.
 * 4. Logs generated packages to data/traffic-queue/ for immediate marketing operations.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=================================================================');
console.log('🚀 BETHELMIND AUTONOMOUS TRAFFIC & GROWTH DAEMON');
console.log('=================================================================\n');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3006';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makePostRequest(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const url = new URL(endpoint, BASE_URL);

    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (_) {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTrafficCycle() {
  const now = new Date().toISOString();
  console.log(`[${now}] 🔄 Initiating Traffic Generation & Google Indexing Cycle...`);

  try {
    // 1. Trigger Traffic Batch Generation
    const genRes = await makePostRequest('/api/traffic/automate', { action: 'generate_and_save' });
    if (genRes.success) {
      console.log(`  ✅ [Traffic Generator]: Generated ${genRes.packagesCount} multi-channel packages (Saved to ${genRes.batchFile})`);
    } else {
      console.warn(`  ⚠️ [Traffic Generator Warning]:`, genRes.error || genRes);
    }

    // 2. Trigger Google Search Indexing Ping
    const idxRes = await makePostRequest('/api/traffic/automate', { action: 'ping_google_indexing' });
    if (idxRes.success) {
      console.log(`  🚀 [Google Indexing]: Successfully submitted URLs to Google Indexing API.`);
    }

    console.log(`[${now}] ✨ Cycle completed successfully.\n`);
  } catch (err) {
    console.error(`[${now}] ❌ Error during traffic cycle:`, err.message);
  }
}

async function main() {
  // Run once immediately on launch
  await runTrafficCycle();

  // If running with --once flag, terminate immediately
  if (process.argv.includes('--once')) {
    console.log('🏁 Single-run execution complete.');
    process.exit(0);
  }

  // Schedule recurring execution every 6 hours
  console.log('⏰ Scheduled to run every 6 hours. Press Ctrl+C to terminate.');
  while (true) {
    await sleep(6 * 60 * 60 * 1000);
    await runTrafficCycle();
  }
}

main().catch(console.error);
