/**
 * src/lib/cloudflareSession.ts
 *
 * Manages Cloudflare `cf_clearance` cookie lifecycle for Jiji.ng.
 *
 * How it works:
 *  1. `extractCloudflareSession()` launches a stealth Puppeteer browser,
 *     navigates to jiji.ng, waits for Cloudflare's JS challenge to be
 *     solved, and extracts the resulting `cf_clearance` + `__cf_bm` cookies.
 *  2. The cookies are stored in an in-memory cache with a 25-minute TTL
 *     (Cloudflare's real TTL is 30 min — we refresh 5 min early).
 *  3. `getCloudflareCookieHeader()` returns a ready-to-use `Cookie` string
 *     to attach to any plain HTTP fetch() targeting jiji.ng.
 *     If the cache is empty or expired, it auto-triggers a fresh extraction.
 *
 * This is the biggest single anti-bot win because:
 *  - One Puppeteer solve covers hundreds of plain fetch() calls
 *  - Plain fetch() is much faster and cheaper than launching browsers
 *  - The cf_clearance token proves a real browser already solved the JS challenge
 */

import { addLog } from '@/lib/googleSheets';

interface CfSession {
  cfClearance: string;    // cf_clearance cookie value
  cfBm: string;           // __cf_bm cookie value (optional but helps)
  userAgent: string;      // UA used when the cookie was obtained (MUST match on reuse)
  extractedAt: number;    // Unix ms timestamp
}

// In-memory cache — persists for the lifetime of the Node process
let _session: CfSession | null = null;
const SESSION_TTL_MS = 25 * 60 * 1000; // 25 minutes

// Prevent concurrent extraction races
let _extractionInProgress: Promise<CfSession | null> | null = null;

/**
 * Returns true if a valid, non-expired session exists.
 */
export function hasValidCfSession(): boolean {
  if (!_session) return false;
  return (Date.now() - _session.extractedAt) < SESSION_TTL_MS;
}

/**
 * Launch a stealth Puppeteer browser, navigate to jiji.ng, wait for
 * Cloudflare to issue cookies, then return them.
 */
async function extractSessionFromBrowser(): Promise<CfSession | null> {
  let browser: any = null;
  try {
    await addLog('Jiji CF Session', 'INFO', 'Extracting fresh Cloudflare session via stealth browser...');

    const { launchBrowser, applyStealthToPage } = await import('@/lib/browserLauncher');
    const { getNextUAProfile } = await import('@/lib/scraperHeaders');
    const ua = getNextUAProfile();

    browser = await launchBrowser();
    const page = await browser.newPage();
    await applyStealthToPage(page);

    // Force-set a consistent UA (must match what we send with the cookie later)
    await page.setUserAgent(ua.userAgent);

    // Navigate to jiji.ng root — Cloudflare challenge is on the home page
    await page.goto('https://jiji.ng/', {
      waitUntil: 'networkidle2',
      timeout: 45000
    });

    // Give Cloudflare's JS challenge time to complete (it runs for ~3-8s)
    await new Promise(r => setTimeout(r, 5000));

    // Verify we actually got past the challenge (look for Jiji content)
    const title = await page.title().catch(() => '');
    if (title.toLowerCase().includes('attention required') || title.toLowerCase().includes('cloudflare')) {
      console.error('[CF Session] Cloudflare challenge not solved. Title:', title);
      await addLog('Jiji CF Session', 'WARN', `Challenge not solved. Page title: "${title}"`);
      return null;
    }

    // Extract all cookies for jiji.ng
    const cookies: { name: string; value: string }[] = await page.cookies('https://jiji.ng');
    const cfClearance = cookies.find(c => c.name === 'cf_clearance')?.value || '';
    const cfBm        = cookies.find(c => c.name === '__cf_bm')?.value || '';

    if (!cfClearance) {
      console.error('[CF Session] cf_clearance cookie not found after navigation');
      await addLog('Jiji CF Session', 'WARN', 'cf_clearance not found — site may not require challenge right now, or extraction failed.');
      // Return a minimal session even without cf_clearance (site may not have issued one)
    }

    const session: CfSession = {
      cfClearance,
      cfBm,
      userAgent: ua.userAgent,
      extractedAt: Date.now(),
    };

    _session = session;
    console.log(`[CF Session] Extracted cf_clearance. Valid for 25 minutes.`);
    await addLog('Jiji CF Session', 'SUCCESS', `cf_clearance extracted successfully. UA: ${ua.userAgent.substring(0, 60)}...`);
    return session;

  } catch (err: any) {
    console.error('[CF Session] Extraction failed:', err.message);
    await addLog('Jiji CF Session', 'ERROR', `Session extraction failed: ${err.message}`).catch(() => {});
    return null;
  } finally {
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
  }
}

/**
 * Get a valid Cloudflare session, extracting a fresh one if needed.
 * Deduplicates concurrent callers — only one browser launch happens at a time.
 */
export async function getOrExtractCfSession(): Promise<CfSession | null> {
  // Fast path: valid cached session
  if (hasValidCfSession()) {
    return _session;
  }

  // Deduplicate concurrent extraction requests
  if (_extractionInProgress) {
    return _extractionInProgress;
  }

  _extractionInProgress = extractSessionFromBrowser().finally(() => {
    _extractionInProgress = null;
  });

  return _extractionInProgress;
}

/**
 * Returns a `Cookie` header string and the matching User-Agent for use
 * in plain fetch() calls to jiji.ng.
 *
 * Usage in proxyRotator / fetchJijiHtml:
 *   const { cookieHeader, userAgent } = await getCloudflareCookieHeader();
 *   headers['Cookie'] = cookieHeader;
 *   headers['User-Agent'] = userAgent;
 */
export async function getCloudflareCookieHeader(): Promise<{
  cookieHeader: string;
  userAgent: string;
}> {
  const session = await getOrExtractCfSession();
  if (!session) {
    return { cookieHeader: '', userAgent: '' };
  }

  const parts: string[] = [];
  if (session.cfClearance) parts.push(`cf_clearance=${session.cfClearance}`);
  if (session.cfBm)        parts.push(`__cf_bm=${session.cfBm}`);

  return {
    cookieHeader: parts.join('; '),
    userAgent: session.userAgent,
  };
}

/**
 * Manually invalidate the session (e.g. after receiving a 403).
 */
export function invalidateCfSession(): void {
  console.log('[CF Session] Session invalidated — will re-extract on next request.');
  _session = null;
}
