import path from 'path';
import fs from 'fs';

/**
 * Returns the writeable directory path for lead website overrides.
 * Falls back to /tmp/overrides if the project directory is read-only (e.g. on Vercel).
 */
export function getOverridesDir(): string {
  const vercelDir = path.join('/tmp', 'overrides');
  const localDir = path.join(process.cwd(), 'src', 'data', 'overrides');
  
  if (process.env.VERCEL) {
    if (!fs.existsSync(vercelDir)) {
      try {
        fs.mkdirSync(vercelDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create Vercel overrides dir:', err);
      }
    }
    return vercelDir;
  }

  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return localDir;
  } catch (err) {
    console.warn(`Local overrides directory not writeable: ${localDir}. Falling back to /tmp/overrides`, err);
    if (!fs.existsSync(vercelDir)) {
      try {
        fs.mkdirSync(vercelDir, { recursive: true });
      } catch (err2) {
        console.error('Failed to create fallback overrides dir:', err2);
      }
    }
    return vercelDir;
  }
}
