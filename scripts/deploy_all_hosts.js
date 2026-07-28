/**
 * ApexReach Multi-Host Deployer & Adaptive Efficiency Rotator
 * 
 * Manages deployments and efficiency benchmarks for:
 * 1. Priority 1: Fly.io (High efficiency 24/7 Docker container)
 * 2. Priority 2: GitHub Actions (Batch workflow execution)
 * 3. Priority 3: Hugging Face Spaces (24/7 cloud worker)
 * 4. Priority 4: Render (Web service / worker)
 * 5. Priority 5: Local Machine (Background runner)
 * 
 * Usage:
 *   node scripts/deploy_all_hosts.js --check
 *   node scripts/deploy_all_hosts.js --benchmark
 *   node scripts/deploy_all_hosts.js --deploy-fly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');

const PRIORITY_HOSTS = [
  { priority: 1, name: 'GitHub Actions (Priority 1 — 100% Free)', url: 'https://api.github.com' },
  { priority: 2, name: 'Hugging Face (Priority 2 — 100% Free 24/7)', url: 'https://huggingface.co/spaces/bethelmind/lead-engine' },
  { priority: 3, name: 'Fly.io (Priority 3)', url: 'https://bethelmind-lead-engine.fly.dev' },
  { priority: 4, name: 'Render (Priority 4)', url: 'https://apexreach-247-worker.onrender.com' },
  { priority: 5, name: 'Local Machine (Priority 5)', url: 'http://localhost:3000' }
];

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'pipe' });
    return true;
  } catch (_) {
    return false;
  }
}

function checkConfigs() {
  console.log('🔍 Checking Multi-Platform Configurations...\n');

  console.log(`- Fly.io Config (fly.toml): ${fs.existsSync(path.join(ROOT_DIR, 'fly.toml')) ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Render Config (render.yaml): ${fs.existsSync(path.join(ROOT_DIR, 'render.yaml')) ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Hugging Face Dockerfile: ${fs.existsSync(path.join(ROOT_DIR, 'Dockerfile.huggingface')) ? '✅ Found' : '❌ Missing'}`);
  console.log(`- GitHub Actions Workflow: ${fs.existsSync(path.join(ROOT_DIR, '.github', 'workflows', 'lagos-10k-runner.yml')) ? '✅ Found' : '❌ Missing'}`);

  const flyInstalled = checkCommand('flyctl') || checkCommand('fly');
  console.log(`- Fly.io CLI (flyctl): ${flyInstalled ? '✅ Installed' : '⚠️ Not installed'}`);
  
  console.log('\n--- Priority Host Hierarchy ---');
  PRIORITY_HOSTS.forEach(h => console.log(`  Priority ${h.priority}: [${h.name}] → ${h.url}`));
}

async function testEndpointHealth(endpointUrl) {
  const start = Date.now();
  return new Promise((resolve) => {
    try {
      const client = endpointUrl.startsWith('https') ? https : http;
      const req = client.get(endpointUrl, { timeout: 4000 }, (res) => {
        const latencyMs = Date.now() - start;
        resolve({ url: endpointUrl, status: res.statusCode < 500 ? 'ONLINE' : 'DEGRADED', code: res.statusCode, latencyMs });
      });
      req.on('error', (err) => resolve({ url: endpointUrl, status: 'OFFLINE', error: err.message, latencyMs: Date.now() - start }));
      req.end();
    } catch (err) {
      resolve({ url: endpointUrl, status: 'OFFLINE', error: err.message, latencyMs: Date.now() - start });
    }
  });
}

async function runBenchmark() {
  console.log('📊 Benchmarking Host Efficiency & Dynamic Routing Scores...\n');
  const results = [];

  for (const host of PRIORITY_HOSTS) {
    const res = await testEndpointHealth(host.url);
    results.push({ ...host, ...res });
  }

  // Sort by Status then Priority then Latency
  results.sort((a, b) => {
    const statusScore = { ONLINE: 0, DEGRADED: 1, OFFLINE: 2 };
    if (statusScore[a.status] !== statusScore[b.status]) {
      return statusScore[a.status] - statusScore[b.status];
    }
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.latencyMs - b.latencyMs;
  });

  console.log('🏆 Ranked Efficiency Scoreboard:');
  results.forEach((r, idx) => {
    const badge = idx === 0 ? '🥇 ACTIVE PRIMARY' : `FALLBACK #${idx}`;
    console.log(`  ${idx + 1}. [${badge}] ${r.name}`);
    console.log(`     Status: ${r.status} (${r.code ? 'HTTP ' + r.code : r.error}) | Latency: ${r.latencyMs}ms`);
  });

  console.log(`\n✅ Adaptive Router Selected Target: [${results[0].name}] → ${results[0].url}`);
}

function deployFly() {
  console.log('🚀 Deploying to Fly.io...');
  try {
    execSync('fly deploy --dockerfile Dockerfile.runner', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('✅ Fly.io deployment completed!');
  } catch (err) {
    console.error('❌ Fly.io deployment error:', err.message);
  }
}

async function main() {
  const arg = process.argv[2] || '--benchmark';

  if (arg === '--check') {
    checkConfigs();
  } else if (arg === '--benchmark' || arg === '--test-rotation') {
    await runBenchmark();
  } else if (arg === '--deploy-fly') {
    deployFly();
  } else {
    console.log(`Usage:\n  node scripts/deploy_all_hosts.js [--check | --benchmark | --deploy-fly]`);
  }
}

main();
