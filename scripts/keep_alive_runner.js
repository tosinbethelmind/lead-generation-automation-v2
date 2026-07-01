const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'local_job_runner.ts');
const projectDir = path.resolve(__dirname, '..');

function startRunner() {
  console.log(`[KeepAlive] Starting local_job_runner.ts...`);
  
  const child = spawn('node', ['-r', 'ts-node/register', scriptPath], {
    stdio: 'inherit',
    cwd: projectDir
  });

  child.on('close', (code) => {
    console.log(`[KeepAlive] local_job_runner.ts exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(startRunner, 5000);
  });

  child.on('error', (err) => {
    console.error(`[KeepAlive] Error running child process:`, err);
  });
}

startRunner();
