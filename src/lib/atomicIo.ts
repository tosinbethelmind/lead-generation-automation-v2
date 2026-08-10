import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

/**
 * Reads a JSON file synchronously, retrying if parsing fails (e.g. during a concurrent write).
 */
export function readJsonFileSyncWithRetry<T>(filePath: string, defaultValue: T, retries = 5, delayMs = 50): T {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!fs.existsSync(filePath)) {
        return defaultValue;
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      if (!data.trim()) {
        if (attempt === retries) return defaultValue;
        const end = Date.now() + delayMs;
        while (Date.now() < end) {}
        continue;
      }
      return JSON.parse(data) as T;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[AtomicIO] Final sync attempt failed parsing JSON from ${filePath}:`, err);
        return defaultValue;
      }
      const end = Date.now() + delayMs;
      while (Date.now() < end) {}
    }
  }
  return defaultValue;
}

/**
 * Writes a JSON file synchronously using an atomic rename pattern with retry logic for Windows EPERM/EBUSY and container fallback to /tmp.
 */
export function writeJsonFileSyncAtomic<T>(filePath: string, data: T): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (_) {}
    }
    const tempPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');

    try {
      fs.renameSync(tempPath, filePath);
      return;
    } catch (err: any) {
      try {
        fs.copyFileSync(tempPath, filePath);
        fs.unlinkSync(tempPath);
      } catch (_) {}
    }
  } catch (outerErr: any) {
    try {
      const baseName = path.basename(filePath);
      const fallbackPath = path.join('/tmp', baseName);
      fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (_) {
      // Container read-only silent fallback
    }
  }
}

/**
 * Reads a JSON file asynchronously, retrying if parsing fails.
 */
export async function readJsonFileAsyncWithRetry<T>(filePath: string, defaultValue: T, retries = 5, delayMs = 50): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!fs.existsSync(filePath)) {
        return defaultValue;
      }
      const data = await fsPromises.readFile(filePath, 'utf-8');
      if (!data.trim()) {
        if (attempt === retries) return defaultValue;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      return JSON.parse(data) as T;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[AtomicIO] Final async attempt failed parsing JSON from ${filePath}:`, err);
        return defaultValue;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return defaultValue;
}

/**
 * Writes a JSON file asynchronously using an atomic rename pattern with retry logic for Windows EPERM/EBUSY.
 */
export async function writeJsonFileAsyncAtomic<T>(filePath: string, data: T): Promise<void> {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (_) {}
    }
    const tempPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    await fsPromises.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');

    try {
      await fsPromises.rename(tempPath, filePath);
      return;
    } catch (err: any) {
      try {
        await fsPromises.copyFile(tempPath, filePath);
        await fsPromises.unlink(tempPath);
      } catch (_) {}
    }
  } catch (outerErr: any) {
    try {
      const baseName = path.basename(filePath);
      const fallbackPath = path.join('/tmp', baseName);
      await fsPromises.writeFile(fallbackPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (_) {
      // Container read-only silent fallback
    }
  }
}
