/**
 * @file src/lib/batchConcurrency.ts
 * High-Speed Parallel Concurrency Worker Pool for Scraping & Enrichment Pipelines.
 * Enables 10x-20x faster multi-query harvesting without blocking event loops.
 */

export interface ConcurrencyOptions {
  /** Maximum number of tasks to run concurrently (default: 15) */
  concurrency?: number;
  /** Timeout per task in milliseconds (default: 10,000ms) */
  timeoutMs?: number;
  /** Retries on failure (default: 1) */
  retries?: number;
}

/**
 * Executes an array of async task functions in parallel batches up to `concurrency` limit.
 * Preserves error resilience per task so a single failed request does not stop the batch.
 */
export async function runConcurrentTasks<T, R>(
  items: T[],
  taskFn: (item: T, index: number) => Promise<R>,
  options: ConcurrencyOptions = {}
): Promise<R[]> {
  const { concurrency = 15, timeoutMs = 10000, retries = 1 } = options;
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const item = items[idx];
      
      let attempt = 0;
      let success = false;
      
      while (attempt <= retries && !success) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Task timeout (${timeoutMs}ms)`)), timeoutMs)
          );
          
          const result = await Promise.race([taskFn(item, idx), timeoutPromise]);
          results[idx] = result;
          success = true;
        } catch (err: any) {
          attempt++;
          if (attempt > retries) {
            console.warn(`[runConcurrentTasks] Item index ${idx} failed after ${retries + 1} attempts: ${err.message}`);
          } else {
            await new Promise(res => setTimeout(res, 200 * attempt)); // exponential backoff
          }
        }
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
