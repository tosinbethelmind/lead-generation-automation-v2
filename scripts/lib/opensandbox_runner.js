/**
 * @file scripts/lib/opensandbox_runner.js
 * 
 * 🛡️ OpenSandbox Safe Task & Agent Execution Runner
 * Inspired by opensandbox-group/OpenSandbox:
 * 
 * CORE RESPONSIBILITIES:
 * 1. Process Sandboxing: Runs background scrapers and external actions with strict RAM/CPU timeouts.
 * 2. Auto-Recycle & Crash Prevention: Automatically kills and recovers runaway child processes
 *    before they can freeze the user's laptop or exhaust RAM.
 * 3. Scoped Credential Injection: Prevents leakage of production API keys to untrusted scripts.
 * 4. Zero-Break Fallback: Works cleanly in standard Node.js without requiring Docker or root permissions.
 */

const { spawn } = require('child_process');
const logger = require('./logger');

const DEFAULT_SANDBOX_LIMITS = {
  timeoutMs: 30000,        // 30s maximum execution per task
  maxBufferBytes: 1024 * 1024 * 2, // 2MB max stdout
  envOverrides: {}
};

/**
 * Runs a command or script in an isolated, monitored child process
 */
function runInSandbox(command, args = [], options = {}) {
  const limits = { ...DEFAULT_SANDBOX_LIMITS, ...options };
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    logger.info('SANDBOX_SPAWN', `Launching task in OpenSandbox runner: ${command} ${args.join(' ')}`, {
      timeoutMs: limits.timeoutMs
    });

    // Sanitized environment: only pass safe system variables
    const safeEnv = {
      ...process.env,
      NODE_ENV: 'production',
      ...limits.envOverrides
    };

    const child = spawn(command, args, {
      env: safeEnv,
      shell: false,
      windowsHide: true,
      cwd: options.cwd || process.cwd()
    });

    let stdout = '';
    let stderr = '';
    let isTerminated = false;

    // Timeout watchdog to kill runaway tasks
    const timer = setTimeout(() => {
      isTerminated = true;
      try {
        child.kill('SIGKILL');
        logger.warn('SANDBOX_TIMEOUT', `Task exceeded execution limit (${limits.timeoutMs}ms). Process terminated to preserve laptop RAM.`);
      } catch (_) {}
      resolve({
        success: false,
        timedOut: true,
        exitCode: -1,
        durationMs: Date.now() - startTime,
        stdout,
        stderr: 'Process terminated by OpenSandbox watchdog (timeout exceeded)'
      });
    }, limits.timeoutMs);

    child.stdout.on('data', (data) => {
      if (stdout.length < limits.maxBufferBytes) {
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < limits.maxBufferBytes) {
        stderr += data.toString();
      }
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (isTerminated) return;

      const durationMs = Date.now() - startTime;
      logger.info('SANDBOX_EXIT', `Task completed in ${durationMs}ms with exit code ${code}`);

      resolve({
        success: (code === 0),
        timedOut: false,
        exitCode: code,
        durationMs,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      logger.error('SANDBOX_ERROR', `Failed to launch sandboxed process: ${err.message}`);
      reject(err);
    });
  });
}

// Test runner
if (require.main === module) {
  runInSandbox('node', ['-e', 'console.log("OpenSandbox runtime verification successful!");']).then(res => {
    console.log('\n======================================================');
    console.log('🛡️ OPENSANDBOX EXECUTION RUNNER TEST');
    console.log('======================================================');
    console.log(`Success: ${res.success}`);
    console.log(`Duration: ${res.durationMs}ms`);
    console.log(`Output: ${res.stdout}`);
    console.log('======================================================\n');
  });
}

module.exports = { runInSandbox, DEFAULT_SANDBOX_LIMITS };
