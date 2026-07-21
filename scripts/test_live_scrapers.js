/**
 * test_live_scrapers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fires REAL (non-sandbox) requests at the live Vercel deployment and prints
 * a pass/fail report for each scraper.
 *
 * Usage:
 *   node scripts/test_live_scrapers.js
 *
 * Set BASE_URL env var to override the target:
 *   BASE_URL=http://localhost:3005 node scripts/test_live_scrapers.js
 */

let BASE_URL = 'https://lead-generation-automation-e0oitxcsi.vercel.app';
const TIMEOUT_MS = 90000; // allow up to 90s for comprehensive Puppeteer runs

// ANSI colour helpers
const GREEN  = (s) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const CYAN   = (s) => `\x1b[36m${s}\x1b[0m`;
const BOLD   = (s) => `\x1b[1m${s}\x1b[0m`;

async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function runScraper({ name, endpoint, body }) {
  const url = `${BASE_URL}${endpoint}`;
  const start = Date.now();
  try {
    console.log(CYAN(`  → POST ${url}`));
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.log(RED(`  ✗ ${name} — HTTP ${res.status} (${elapsed}s)`));
      console.log(RED(`    ${text.substring(0, 200)}`));
      return { name, ok: false, mode: 'error', added: 0, leads: 0, elapsed };
    }

    let data;
    const responseText = await res.text();
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.log(RED(`  ✗ ${name} — Failed to parse JSON response (status: ${res.status}, content-type: ${res.headers.get('content-type')})`));
      console.log(RED(`    Response snippet: ${responseText.substring(0, 300).replace(/\n/g, ' ')}`));
      return { name, ok: false, mode: 'error', added: 0, leads: 0, elapsed };
    }
    const mode    = data.mode    || 'unknown';
    const added   = data.added   ?? '?';
    const skipped = data.skipped ?? '?';
    const leads   = Array.isArray(data.leads) ? data.leads.length : '?';

    const modeTag = mode === 'sandbox'  ? YELLOW(`[${mode}]`)
                  : mode === 'live'     ? GREEN(`[${mode}]`)
                  : mode === 'cloud'    ? GREEN(`[${mode}]`)
                  : `[${mode}]`;

    console.log(GREEN(`  ✓ ${name}`) + ` ${modeTag} — added: ${added}, skipped: ${skipped}, leads: ${leads}, time: ${elapsed}s`);

    if (Array.isArray(data.leads) && data.leads.length > 0) {
      const sample = data.leads[0];
      console.log(`    Sample → name: "${sample.name || '—'}", phone: "${sample.phone_e164 || '—'}", source: "${sample.source || '—'}"`);
    }

    return { name, ok: true, mode, added, skipped, leads: Number(leads) || 0, elapsed };
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(RED(`  ✗ ${name} — ${err.name === 'AbortError' ? 'TIMED OUT' : err.message} (${elapsed}s)`));
    if (err.cause) {
      console.log(RED(`    Cause: ${err.cause.message || err.cause}`));
    }
    if (err.stack && !err.message.includes('fetch failed')) {
      console.log(RED(`    Stack: ${err.stack}`));
    }
    return { name, ok: false, mode: 'error', added: 0, leads: 0, elapsed };
  }
}

async function main() {
  // Auto-detect base URL
  if (process.env.BASE_URL) {
    BASE_URL = process.env.BASE_URL;
  } else if (process.argv.includes('--local') || process.argv.includes('-l')) {
    BASE_URL = 'http://localhost:3005';
    console.log(CYAN(`Targeting local server via flag: ${BASE_URL}`));
  } else {
    // Try to auto-detect if local server on 3005 is active
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 300);
      await fetch('http://localhost:3005/api/scrape/osm', { method: 'OPTIONS', signal: controller.signal });
      clearTimeout(timer);
      BASE_URL = 'http://localhost:3005';
      console.log(CYAN(`Auto-detected local server: ${BASE_URL}`));
    } catch (err) {
      // Check 3006
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 300);
        await fetch('http://localhost:3006/api/scrape/osm', { method: 'OPTIONS', signal: controller.signal });
        clearTimeout(timer);
        BASE_URL = 'http://localhost:3006';
        console.log(CYAN(`Auto-detected local server: ${BASE_URL}`));
      } catch (err2) {
        console.log(CYAN(`No local server detected. Targeting Vercel: ${BASE_URL}`));
      }
    }
  }

  console.log('');
  console.log(BOLD('═══════════════════════════════════════════════════════'));
  console.log(BOLD(' ApexReach Live Scraper Test Suite'));
  console.log(BOLD(`  Target: ${BASE_URL}`));
  console.log(BOLD('═══════════════════════════════════════════════════════'));
  console.log('');

  const scrapers = [
    // ── No-key scrapers (should always produce live data) ──────────────────
    {
      name: 'OpenStreetMap (Overpass/Nominatim)',
      endpoint: '/api/scrape/osm',
      body: { query: 'dentist Lagos', limit: 10 },
    },
    {
      name: 'DuckDuckGo Search Scraper',
      endpoint: '/api/scrape/duckduckgo',
      body: { query: 'dental clinic Lagos Nigeria phone', limit: 10 },
    },
    {
      name: 'Jiji.ng Scraper',
      endpoint: '/api/scrape/jiji',
      body: { url: 'https://jiji.ng/lagos/dental-clinics', limit: 5 },
    },
    {
      name: 'Social – Instagram',
      endpoint: '/api/scrape/social',
      body: { platform: 'INSTAGRAM', query: 'dental clinic Lagos Nigeria', limit: 5 },
    },
    {
      name: 'Social – Facebook',
      endpoint: '/api/scrape/social',
      body: { platform: 'FACEBOOK', query: 'dental clinic Lagos Nigeria', limit: 5 },
    },
    {
      name: 'Social – TikTok',
      endpoint: '/api/scrape/social',
      body: { platform: 'TIKTOK', query: 'dental clinic Lagos Nigeria', limit: 5 },
    },

    // ── API-key dependent ──────────────────────────────────────────────────
    {
      name: 'Google Maps Places API (needs key)',
      endpoint: '/api/scrape/maps',
      body: { query: 'dental clinic in Lagos', limit: 5 },
    },
    {
      name: 'Google Maps Free (Puppeteer)',
      endpoint: '/api/scrape/maps-free',
      body: { query: 'dental clinic Lagos', limit: 5 },
    },
  ];

  const results = [];
  let idx = 0;
  for (const scraper of scrapers) {
    idx++;
    console.log(BOLD(`[${idx}/${scrapers.length}] ${scraper.name}`));
    const result = await runScraper(scraper);
    results.push(result);
    console.log('');
    // Small inter-request delay to avoid hammering the same server
    await new Promise(r => setTimeout(r, 800));
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(BOLD('═══════════════════════════════════════════════════════'));
  console.log(BOLD(' Summary'));
  console.log(BOLD('═══════════════════════════════════════════════════════'));

  let totalAdded = 0;
  let totalLive  = 0;
  let totalFail  = 0;

  for (const r of results) {
    const isGooglePlaces = r.name.includes('Places API');
    const isSandboxFail = r.mode === 'sandbox' && !isGooglePlaces;

    const status = !r.ok || isSandboxFail ? RED('  FAIL   ')
                 : r.mode === 'sandbox'  ? YELLOW('  SANDBOX')
                 : GREEN('  LIVE   ');
    const leads = String(r.leads).padStart(3);
    console.log(`${status}  ${r.name.padEnd(45)} leads: ${leads}  time: ${r.elapsed}s`);
    if (r.ok && !isSandboxFail && r.mode !== 'sandbox') totalLive++;
    if (!r.ok || isSandboxFail) totalFail++;
    totalAdded += Number(r.added) || 0;
  }

  console.log('');
  console.log(`  Live scrapers : ${GREEN(totalLive)}`);
  console.log(`  Failed        : ${totalFail > 0 ? RED(totalFail) : GREEN(totalFail)}`);
  console.log(`  Total added   : ${totalAdded}`);
  console.log('');

  if (totalFail > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(RED('\nUnhandled error: ' + err.message));
  process.exit(1);
});
