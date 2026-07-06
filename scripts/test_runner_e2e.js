const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
let originalEnv = '';
let envExisted = false;

// Pre-cleanup ports 3005 and 3006 to avoid "Another next dev server is already running" error
if (process.platform === 'win32') {
  const ports = ['3005', '3006'];
  for (const port of ports) {
    try {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            console.log(`🧹 Port ${port} is busy. Killing process PID ${pid}...`);
            execSync(`taskkill /pid ${pid} /F /T`, { stdio: 'ignore' });
          }
        }
      }
    } catch (e) {
      // Netstat or taskkill failed (port probably not in use)
    }
  }
}

// 1. Setup env.local
if (fs.existsSync(envPath)) {
  originalEnv = fs.readFileSync(envPath, 'utf8');
  envExisted = true;
  if (!originalEnv.includes('SCRAPER_EXECUTION_MODE')) {
    fs.appendFileSync(envPath, '\nSCRAPER_EXECUTION_MODE=local\n');
  } else {
    const updated = originalEnv.replace(/SCRAPER_EXECUTION_MODE\s*=\s*\w+/, 'SCRAPER_EXECUTION_MODE=local');
    fs.writeFileSync(envPath, updated, 'utf8');
  }
} else {
  fs.writeFileSync(envPath, 'SCRAPER_EXECUTION_MODE=local\n', 'utf8');
}

console.log('⚡ Starting Next.js Dev Server on port 3005...');
const devServer = spawn('npx', ['next', 'dev', '-p', '3005'], { 
  shell: true, 
  env: { ...process.env, SCRAPER_EXECUTION_MODE: 'local', PORT: '3005' } 
});

devServer.stdout.on('data', (data) => {
  const cleanLog = data.toString().trim();
  if (cleanLog) console.log(`[Next.js Dev]: ${cleanLog}`);
});

console.log('🏃 Starting Local Job Runner...');
const runner = spawn('npm', ['run', 'local-runner'], { 
  shell: true,
  env: { ...process.env, SCRAPER_EXECUTION_MODE: 'local', PORT: '3005' }
});

runner.stdout.on('data', (data) => {
  const cleanLog = data.toString().trim();
  if (cleanLog) console.log(`[Runner Log]: ${cleanLog}`);
});

async function main() {
  // Wait for dev server to boot up
  console.log('⏳ Waiting for dev server to initialize on port 3005...');
  let serverReady = false;
  for (let i = 0; i < 25; i++) {
    try {
      let res;
      try {
        res = await fetch('http://localhost:3005/');
      } catch (err) {
        res = await fetch('http://127.0.0.1:3005/');
      }
      console.log(`[Healthcheck] Server replied with status: ${res.status}`);
      if (res.status >= 200 && res.status < 400) {
        serverReady = true;
        break;
      }
    } catch (e) {
      console.log(`[Healthcheck] Attempt ${i + 1} failed: ${e.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (!serverReady) {
    console.error('❌ Dev server failed to start on port 3005.');
    cleanup(1);
    return;
  }
  console.log('⚡ Dev server is ready on port 3005!');

  // Run playwright tests
  console.log('🎭 Running Playwright End-to-End Tests...');
  const pw = spawn('npx', ['playwright', 'test'], { 
    shell: true,
    stdio: 'inherit'
  });

  pw.on('close', (code) => {
    console.log(`Playwright exited with code ${code}`);
    cleanup(code);
  });
}

function cleanup(exitCode) {
  console.log('🛑 Shutting down dev server and job runner...');
  if (process.platform === 'win32') {
    try {
      if (devServer.pid) execSync(`taskkill /pid ${devServer.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
    try {
      if (runner.pid) execSync(`taskkill /pid ${runner.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
  } else {
    devServer.kill();
    runner.kill();
  }

  // Restore .env.local
  try {
    if (envExisted) {
      fs.writeFileSync(envPath, originalEnv, 'utf8');
    } else if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
  } catch (e) {
    console.error('Failed to restore .env.local:', e);
  }

  process.exit(exitCode);
}

main().catch(err => {
  console.error('Error running main:', err);
  cleanup(1);
});
