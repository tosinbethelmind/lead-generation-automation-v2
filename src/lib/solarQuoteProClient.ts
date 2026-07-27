import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://szyuterncawfxwzhvwcf.supabase.co';
const ACTIVE_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY';

function isValidKeyForProject(keyStr: string | undefined): boolean {
  if (!keyStr || typeof keyStr !== 'string') return false;
  const trimmed = keyStr.trim();
  if (trimmed.length < 20 || trimmed === 'undefined' || trimmed === 'null') return false;
  try {
    const parts = trimmed.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload.ref === 'szyuterncawfxwzhvwcf';
    }
  } catch (e) {}
  return false;
}

function getValidUrl(): string {
  const candidates = [process.env.SOLARQUOTEPRO_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL];
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.trim().includes('szyuterncawfxwzhvwcf')) {
      return c.trim();
    }
  }
  return ACTIVE_SUPABASE_URL;
}

function getValidKey(): string {
  const candidates = [
    process.env.SOLARQUOTEPRO_SUPABASE_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ];
  for (const c of candidates) {
    if (c && isValidKeyForProject(c)) {
      return c.trim();
    }
  }
  return ACTIVE_SUPABASE_KEY;
}

let cachedSolarClient: any = null;

export function getSolarQuoteProSupabase() {
  if (!cachedSolarClient) {
    cachedSolarClient = createClient(getValidUrl(), getValidKey(), {
      auth: {
        persistSession: false,
      },
    });
  }
  return cachedSolarClient;
}

export const solarQuoteProSupabase = new Proxy({} as any, {
  get(_target, prop, receiver) {
    const client = getSolarQuoteProSupabase();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
