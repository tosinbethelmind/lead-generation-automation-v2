import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<{ workerIndex?: string }>();

/**
 * Safely resolves the current test worker index.
 * It first checks request context, then falls back to non-Promise headers access
 * to prevent Next.js 15 runtime exceptions, and finally defaults to the environment variable.
 */
export function getWorkerIndex(): string {
  try {
    const storeVal = requestContext.getStore()?.workerIndex;
    if (storeVal) return storeVal;
  } catch (e) {}

  try {
    const { headers } = require('next/headers');
    const headersList = headers();
    // Only access get() if headersList is NOT a Promise.
    // In Next.js 15+, headers() returns a Promise.
    if (headersList && typeof headersList.then !== 'function' && typeof headersList.get === 'function') {
      return headersList.get('x-test-worker-index') || '';
    }
  } catch (e) {}

  // Fallback to process.env
  try {
    return process.env.TEST_WORKER_INDEX || '';
  } catch (e) {}

  return '';
}

/**
 * Wraps a callback function inside the request context with a specific worker index.
 */
export function setWorkerIndex<T>(workerIndex: string, callback: () => T): T {
  return requestContext.run({ workerIndex }, callback);
}
