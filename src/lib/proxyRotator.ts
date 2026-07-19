/**
 * src/lib/proxyRotator.ts
 * 
 * Central proxy pool manager for HTTP-based scrapers.
 * 
 * Reads from config.json:
 *   - webshareProxies: string[]  (e.g. ["http://user:pass@proxy1.webshare.io:80", ...])
 *   - useTorProxy: boolean
 *   - torProxyUrl: string        (e.g. "socks5://127.0.0.1:9050")
 *
 * Assigns a proxy URL per scraper engine using a round-robin strategy,
 * spreading load so no single IP handles all concurrent scrapers.
 *
 * NOTE: Node.js native fetch() does NOT support SOCKS5 directly. For Tor
 * (socks5://), this module wraps the fetch with an https-proxy-agent or
 * socks-proxy-agent automatically. For HTTP proxies, it uses https-proxy-agent.
 * If the proxy agent packages are not installed, it falls back gracefully to
 * direct (no-proxy) fetching.
 */

import { getRuntimeConfig } from './localConfig';

export type ScraperEngine = 'duckduckgo' | 'jiji' | 'instagram' | 'facebook' | 'tiktok' | 'osm' | 'maps-free' | 'social';

interface ProxyEntry {
  url: string;
  type: 'tor' | 'http' | 'https' | 'socks5';
  label: string;
}

// Module-level counter for round-robin assignment
let _roundRobinIndex = 0;

/**
 * Build the full proxy pool from config.json at call time (not cached,
 * so hot-updates to config.json are reflected immediately).
 */
export function getProxyPool(): ProxyEntry[] {
  const config = getRuntimeConfig();
  const pool: ProxyEntry[] = [];

  // Add Tor if enabled
  if (config.useTorProxy && config.torProxyUrl) {
    pool.push({
      url: config.torProxyUrl,
      type: 'socks5',
      label: 'Tor'
    });
  }

  // Add Webshare / custom HTTP proxies
  const webshareList = config.webshareProxies || [];
  for (const proxyUrl of webshareList) {
    if (!proxyUrl || !proxyUrl.trim()) continue;
    const trimmed = proxyUrl.trim();
    pool.push({
      url: trimmed,
      type: trimmed.startsWith('https') ? 'https' : 'http',
      label: trimmed.replace(/\/\/.*@/, '//***@') // mask credentials for logs
    });
  }

  // Also include the legacy scraperProxy / proxyPool single-entry if set
  const legacyProxy = config.scraperProxy || config.proxyPool || '';
  if (legacyProxy && legacyProxy.trim() && legacyProxy !== 'http://testproxy:secret@12.34.56.78:8080') {
    const trimmed = legacyProxy.trim();
    const alreadyAdded = pool.some(p => p.url === trimmed);
    if (!alreadyAdded) {
      pool.push({
        url: trimmed,
        type: trimmed.startsWith('https') ? 'https' : 'http',
        label: trimmed.replace(/\/\/.*@/, '//***@')
      });
    }
  }

  return pool;
}

/**
 * Returns the next proxy URL in the rotation pool (round-robin),
 * or null if no proxies are configured.
 */
export function getNextProxy(): ProxyEntry | null {
  const pool = getProxyPool();
  if (pool.length === 0) return null;
  const entry = pool[_roundRobinIndex % pool.length];
  _roundRobinIndex = (_roundRobinIndex + 1) % (pool.length * 100); // avoid overflow
  return entry;
}

/**
 * Get a proxy specifically assigned for a given scraper engine.
 * Uses round-robin across the pool, but with engine-seeded offsets
 * so different engines tend to get different proxies when run concurrently.
 */
const ENGINE_OFFSETS: Record<string, number> = {
  'duckduckgo': 0,
  'jiji': 1,
  'instagram': 2,
  'facebook': 3,
  'tiktok': 4,
  'osm': 5,
  'maps-free': 6,
  'social': 2,
};

export function getProxyForEngine(engine: ScraperEngine): ProxyEntry | null {
  const pool = getProxyPool();
  if (pool.length === 0) return null;
  const offset = ENGINE_OFFSETS[engine] ?? 0;
  const index = (offset + Math.floor(_roundRobinIndex / Math.max(pool.length, 1))) % pool.length;
  return pool[index];
}

/**
 * Build a proxy-aware RequestInit for Node.js fetch().
 *
 * Uses undici's ProxyAgent (built into Next.js / Node 18+) for HTTP proxies.
 * For SOCKS5 (Tor), attempts to use socks-proxy-agent if available,
 * otherwise falls back to direct fetch with a warning.
 *
 * Returns the headers object to merge into your fetch() options,
 * plus a dispatcher if available.
 */
export async function buildProxyFetchOptions(
  proxy: ProxyEntry | null,
  extraHeaders?: Record<string, string>
): Promise<RequestInit> {
  const headers: Record<string, string> = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    ...extraHeaders
  };

  if (!proxy) {
    return { headers };
  }

  // For HTTP/HTTPS proxies: use undici ProxyAgent (shipped with Next.js)
  if (proxy.type === 'http' || proxy.type === 'https') {
    try {
      const { ProxyAgent } = await import('undici');
      const dispatcher = new ProxyAgent(proxy.url);
      return { headers, dispatcher } as any;
    } catch {
      // undici not available directly, try env-based approach
      console.warn(`[ProxyRotator] undici ProxyAgent unavailable; using HTTP_PROXY env approach for ${proxy.label}`);
      process.env.HTTP_PROXY = proxy.url;
      process.env.HTTPS_PROXY = proxy.url;
      return { headers };
    }
  }

  // For SOCKS5 (Tor): try socks-proxy-agent
  if (proxy.type === 'socks5') {
    try {
      const { SocksProxyAgent } = await import('socks-proxy-agent');
      const agent = new SocksProxyAgent(proxy.url);
      // Pass as 'agent' — some fetches support this via node-fetch compat
      return { headers, agent } as any;
    } catch {
      // Not installed — Tor not usable for direct fetch, fall back silently
      console.warn(`[ProxyRotator] socks-proxy-agent not installed. Tor proxy (${proxy.url}) cannot be used for HTTP fetch. Install it with: npm i socks-proxy-agent`);
    }
  }

  return { headers };
}

/**
 * Convenience wrapper: performs a proxy-aware fetch for a given URL.
 * Automatically picks the next proxy in rotation for the given engine.
 *
 * Usage:
 *   const html = await proxyFetch('duckduckgo', url, { 'User-Agent': ua });
 */
export async function proxyFetch(
  engine: ScraperEngine,
  url: string,
  extraHeaders?: Record<string, string>,
  signal?: AbortSignal
): Promise<Response> {
  const proxy = getProxyForEngine(engine);
  const opts = await buildProxyFetchOptions(proxy, extraHeaders);

  if (proxy) {
    console.log(`[ProxyRotator] ${engine} → ${proxy.label} → ${url.substring(0, 80)}`);
  }

  return fetch(url, { ...opts, signal });
}

/**
 * Log the current proxy pool status. Useful for debugging.
 */
export function logProxyPoolStatus(): void {
  const pool = getProxyPool();
  if (pool.length === 0) {
    console.warn('[ProxyRotator] No proxies configured. All scrapers running on direct IP!');
  } else {
    console.log(`[ProxyRotator] Active proxy pool (${pool.length} entries):`);
    pool.forEach((p, i) => console.log(`  ${i + 1}. [${p.type.toUpperCase()}] ${p.label}`));
  }
}
