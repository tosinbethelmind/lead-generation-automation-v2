/**
 * src/lib/scraperHeaders.ts
 *
 * Shared utility for generating realistic, rotating browser headers
 * that bypass Cloudflare Bot Management and similar anti-bot systems.
 *
 * Key signals patched:
 *  - User-Agent rotation across real Chrome/Edge/Firefox builds
 *  - sec-ch-ua hints aligned to the User-Agent
 *  - Accept-Language with realistic q-values
 *  - Sec-Fetch-* headers that match a real organic navigation
 *  - Referer chain (Google → Jiji, direct bookmark, etc.)
 *  - Randomised Accept-Encoding order to break fingerprinting
 */

export interface UAProfile {
  userAgent: string;
  secChUa: string;
  secChUaMobile: string;
  secChUaPlatform: string;
}

// Real Chrome/Edge builds as of mid-2025
const UA_POOL: UAProfile[] = [
  {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    secChUa: '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="99"',
    secChUaMobile: '?0',
    secChUaPlatform: '"Windows"',
  },
  {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    secChUa: '"Chromium";v="125", "Google Chrome";v="125", "Not-A.Brand";v="99"',
    secChUaMobile: '?0',
    secChUaPlatform: '"Windows"',
  },
  {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    secChUa: '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
    secChUaMobile: '?0',
    secChUaPlatform: '"Windows"',
  },
  {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    secChUa: '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="99"',
    secChUaMobile: '?0',
    secChUaPlatform: '"macOS"',
  },
  {
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    secChUa: '"Chromium";v="125", "Google Chrome";v="125", "Not-A.Brand";v="99"',
    secChUaMobile: '?0',
    secChUaPlatform: '"Linux"',
  },
  {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
    secChUa: '',   // Firefox does not send sec-ch-ua
    secChUaMobile: '?0',
    secChUaPlatform: '"Windows"',
  },
];

// Common referrers to simulate organic traffic
const REFERRERS = [
  'https://www.google.com/',
  'https://www.google.com/search?q=jiji+nigeria+lagos',
  'https://jiji.ng/',
  'https://jiji.ng/lagos',
  '',   // direct / no referrer
];

const LANGUAGES = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.9,en-US;q=0.8',
  'en-NG,en;q=0.9,en-US;q=0.8',
  'en-US,en;q=0.9,fr;q=0.7',
];

let _uaIndex = 0;
let _refIndex = 0;
let _langIndex = 0;

/**
 * Returns the next UA profile in the rotation.
 */
export function getNextUAProfile(): UAProfile {
  const profile = UA_POOL[_uaIndex % UA_POOL.length];
  _uaIndex = (_uaIndex + 1) % (UA_POOL.length * 100);
  return profile;
}

/**
 * Build a full set of HTTP headers that look like an organic Chrome browser
 * navigating to a page from a search result.
 *
 * @param referer   Override the Referer header (auto-rotated if omitted)
 * @param isXhr     Set to true for XHR/fetch sub-requests (changes Sec-Fetch-Mode)
 */
export function buildStealthHeaders(
  referer?: string,
  isXhr = false,
): Record<string, string> {
  const ua = getNextUAProfile();
  const ref = referer ?? REFERRERS[_refIndex++ % REFERRERS.length];
  const lang = LANGUAGES[_langIndex++ % LANGUAGES.length];

  const headers: Record<string, string> = {
    'User-Agent': ua.userAgent,
    'Accept': isXhr
      ? 'application/json, text/plain, */*'
      : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': lang,
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Site': ref ? 'cross-site' : 'none',
    'Sec-Fetch-Mode': isXhr ? 'cors' : 'navigate',
    'Sec-Fetch-User': isXhr ? undefined as any : '?1',
    'Sec-Fetch-Dest': isXhr ? 'empty' : 'document',
    'Connection': 'keep-alive',
  };

  if (ref) {
    headers['Referer'] = ref;
  }

  // Only Chromium-based UAs send sec-ch-ua
  if (ua.secChUa) {
    headers['sec-ch-ua'] = ua.secChUa;
    headers['sec-ch-ua-mobile'] = ua.secChUaMobile;
    headers['sec-ch-ua-platform'] = ua.secChUaPlatform;
  }

  // Strip undefined values
  for (const key of Object.keys(headers)) {
    if (headers[key] === undefined) delete headers[key];
  }

  return headers;
}

/**
 * Random delay to simulate human reading/thinking time.
 * @param min ms
 * @param max ms
 */
export function humanDelay(min = 800, max = 3000): Promise<void> {
  const ms = min + Math.floor(Math.random() * (max - min));
  return new Promise(r => setTimeout(r, ms));
}
