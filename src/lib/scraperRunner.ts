import { spawn } from 'child_process';
import path from 'path';
import { updateScrapeJobStatus } from '@/app/api/scrape/queue';


/**
 * Simple token‑bucket rate limiter.
 * Concurrency limit is controlled via the env var SCRAPER_CONCURRENCY_LIMIT (default 3).
 * Per‑minute start limit via SCRAPER_RATE_PER_MIN (default 30).
 */
class ScraperRateLimiter {
  private maxConcurrent: number;
  private maxPerMinute: number;
  private currentRunning = 0;
  private startsThisMinute = 0;
  private minuteReset: NodeJS.Timeout;

  constructor() {
    this.maxConcurrent = Number(process.env.SCRAPER_CONCURRENCY_LIMIT) || 3;
    this.maxPerMinute = Number(process.env.SCRAPER_RATE_PER_MIN) || 30;
    // reset counter every minute
    this.minuteReset = setInterval(() => {
      this.startsThisMinute = 0;
    }, 60_000);
  }

  canStart(): boolean {
    return (
      this.currentRunning < this.maxConcurrent &&
      this.startsThisMinute < this.maxPerMinute
    );
  }

  start() {
    this.currentRunning++;
    this.startsThisMinute++;
  }

  finish() {
    this.currentRunning--;
  }
}

const limiter = new ScraperRateLimiter();

export interface SpawnOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

/**
 * Spawn a scraper script and wire its lifecycle to a Supabase job.
 * @param scriptPath Relative path from project root to the script file.
 * @param args Array of string arguments passed to the script.
 * @param jobId The Supabase job ID to update status/result.
 */
export async function runScraper(
  scriptPath: string,
  args: string[],
  jobId: string,
  options?: SpawnOptions
): Promise<void> {
  // Rate‑limit check
  while (!limiter.canStart()) {
    // simple back‑off – wait 500 ms then re‑check
    await new Promise((r) => setTimeout(r, 500));
  }
  limiter.start();

  const absolutePath = path.resolve(process.cwd(), scriptPath);
  const child = spawn('node', [absolutePath, ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: options?.cwd,
    env: { ...process.env, ...options?.env },
  });

  // Update status to running
  await updateScrapeJobStatus(jobId, 'running');

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (data) => (stdout += data.toString()));
  child.stderr.on('data', (data) => (stderr += data.toString()));

  const exitPromise = new Promise<void>((resolve, reject) => {
    child.on('close', async (code) => {
      try {
        if (code === 0) {
          await updateScrapeJobStatus(jobId, 'completed', { result: JSON.parse(stdout) });
          resolve();
        } else {
          await updateScrapeJobStatus(jobId, 'failed', { error_message: stderr || `Exit code ${code}` });
          reject(new Error(`Scraper exited with code ${code}`));
        }
      } finally {
        limiter.finish();
      }
    });
    child.on('error', async (err) => {
      await updateScrapeJobStatus(jobId, 'failed', { error_message: err.message });
      limiter.finish();
      reject(err);
    });
  });

  try {
    await exitPromise;
  } catch (e) {
    console.error('Scraper run error', e);
    // re‑throw so callers can handle if needed
    throw e;
  }
}
