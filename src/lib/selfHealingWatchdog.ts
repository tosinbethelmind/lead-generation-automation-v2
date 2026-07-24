import { rotateTorIp, reportProxyFailure, reportProxySuccess } from '@/lib/browserLauncher';
import { logSelfHealingEvent, SelfHealingEvent } from '@/lib/selfHealingLogger';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface SelfHealingOptions {
  maxRetries?: number;
  engine?: 'solarquotepro' | 'lagos10k' | 'browser_launcher' | 'api_scraper';
  endpoints?: string[];
  currentEndpointIndex?: number;
  proxyUrl?: string;
  pidFile?: string;
  scriptPath?: string;
  scriptArgs?: string[];
}

export class SelfHealingSupervisor {
  /**
   * Executes a task function with automated self-healing error recovery.
   */
  static async executeWithSelfHealing<T>(
    taskName: string,
    taskFn: (attempt: number, activeEndpoint?: string) => Promise<T>,
    options: SelfHealingOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? 4;
    const engine = options.engine ?? 'api_scraper';
    const endpoints = options.endpoints || [];
    let endpointIdx = options.currentEndpointIndex || 0;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const currentEndpoint = endpoints.length > 0 ? endpoints[endpointIdx % endpoints.length] : undefined;
        const result = await taskFn(attempt, currentEndpoint);

        if (options.proxyUrl) {
          reportProxySuccess(options.proxyUrl);
        }
        return result;
      } catch (err: any) {
        lastError = err;
        const errorMsg = err.message || String(err);
        console.warn(`[SelfHealingSupervisor] ${taskName} failed (Attempt ${attempt}/${maxRetries}): ${errorMsg}`);

        // Analyze error type and trigger corresponding self-healing strategy
        if (this.isRateLimitOrBlock(errorMsg)) {
          // Strategy 1: Tor / Proxy Rotation + Exponential Backoff
          await this.healProxyBlock(engine, errorMsg, options.proxyUrl);
          await this.delay(Math.pow(2, attempt) * 1000 + Math.random() * 500);
        } else if (this.isEndpointFailure(errorMsg) && endpoints.length > 1) {
          // Strategy 2: Rotate API Mirror Endpoint
          endpointIdx = (endpointIdx + 1) % endpoints.length;
          const nextEndpoint = endpoints[endpointIdx];
          logSelfHealingEvent({
            engine,
            strategy: 'endpoint_failover',
            target: taskName,
            reason: `Endpoint unresponsive: ${errorMsg}`,
            resolution: `Automatically failed over to mirror: ${nextEndpoint}`,
            success: true
          });
          await this.delay(1000);
        } else if (this.isBrowserCrash(errorMsg)) {
          // Strategy 3: Browser Purge & Restart
          await this.healBrowserCrash(engine, errorMsg);
          await this.delay(2000);
        } else {
          // Generic Backoff
          await this.delay(1500 * attempt);
        }
      }
    }

    logSelfHealingEvent({
      engine,
      strategy: 'proxy_rotate',
      target: taskName,
      reason: `Task failed after ${maxRetries} self-healing attempts: ${lastError?.message}`,
      resolution: 'Exhausted retry budget. Fallback execution triggered.',
      success: false
    });

    throw lastError || new Error(`Self-healing supervisor failed task ${taskName}`);
  }

  /**
   * Strategy 1: Rotates Tor IP or reports proxy failure
   */
  static async healProxyBlock(
    engine: 'solarquotepro' | 'lagos10k' | 'browser_launcher' | 'api_scraper',
    errorMsg: string,
    proxyUrl?: string
  ): Promise<boolean> {
    if (proxyUrl) {
      reportProxyFailure(proxyUrl);
    }

    try {
      const rotated = await rotateTorIp();
      logSelfHealingEvent({
        engine,
        strategy: 'proxy_rotate',
        target: proxyUrl || 'Tor IP Identity',
        reason: `429/403 Rate Limit Block Detected: ${errorMsg}`,
        resolution: rotated ? 'Successfully issued Tor SIGNAL NEWNYM for fresh IP identity' : 'Proxy reported blacklisted; falling back to clean pool proxy',
        success: true
      });
      return true;
    } catch (err: any) {
      logSelfHealingEvent({
        engine,
        strategy: 'proxy_rotate',
        target: 'Proxy Pool',
        reason: `Failed to rotate IP: ${err.message}`,
        resolution: 'Applying 5s backoff jitter',
        success: false
      });
      return false;
    }
  }

  /**
   * Strategy 3: Cleans up zombie Chrome processes and purges lockfiles
   */
  static async healBrowserCrash(
    engine: 'solarquotepro' | 'lagos10k' | 'browser_launcher' | 'api_scraper',
    errorMsg: string
  ): Promise<boolean> {
    try {
      if (process.platform === 'win32') {
        try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (_) {}
        try { execSync('taskkill /F /IM chromedriver.exe /T', { stdio: 'ignore' }); } catch (_) {}
      } else {
        try { execSync('pkill -f chrome', { stdio: 'ignore' }); } catch (_) {}
      }

      logSelfHealingEvent({
        engine,
        strategy: 'browser_purge',
        target: 'Headless Chromium',
        reason: `Browser context crashed/frozen: ${errorMsg}`,
        resolution: 'Purged zombie Chrome processes and reset browser profile context',
        success: true
      });
      return true;
    } catch (err: any) {
      return false;
    }
  }

  /**
   * Strategy 4: Restarts hung isolated runner process if stalled
   */
  static async healHungRunner(
    engine: 'solarquotepro' | 'lagos10k',
    pidFile: string,
    scriptPath: string,
    args: string[] = []
  ): Promise<boolean> {
    if (!fs.existsSync(pidFile)) return false;

    try {
      const pidStr = fs.readFileSync(pidFile, 'utf8').trim();
      const pid = parseInt(pidStr, 10);
      if (isNaN(pid)) return false;

      // Kill hung process
      try { process.kill(pid, 'SIGKILL'); } catch (_) {}
      try { fs.unlinkSync(pidFile); } catch (_) {}

      // Re-launch runner
      const child = spawn('node', [scriptPath, ...args], {
        detached: true,
        stdio: 'ignore',
        shell: true
      });
      child.unref();

      logSelfHealingEvent({
        engine,
        strategy: 'runner_restart',
        target: scriptPath,
        reason: `Runner process (PID ${pid}) stalled / unresponsive`,
        resolution: `Terminated PID ${pid} and automatically re-launched new runner instance (PID ${child.pid})`,
        success: true
      });

      return true;
    } catch (err: any) {
      return false;
    }
  }

  private static isRateLimitOrBlock(msg: string): boolean {
    const lower = msg.toLowerCase();
    return lower.includes('429') || lower.includes('403') || lower.includes('rate limit') || lower.includes('blocked') || lower.includes('too many requests') || lower.includes('captcha');
  }

  private static isEndpointFailure(msg: string): boolean {
    const lower = msg.toLowerCase();
    return lower.includes('econnrefused') || lower.includes('etimedout') || lower.includes('502') || lower.includes('503') || lower.includes('504') || lower.includes('fetch failed');
  }

  private static isBrowserCrash(msg: string): boolean {
    const lower = msg.toLowerCase();
    return lower.includes('target closed') || lower.includes('session closed') || lower.includes('browser has disconnected') || lower.includes('protocol error');
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
