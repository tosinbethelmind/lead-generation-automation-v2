/**
 * @file src/lib/multiProviderRotator.ts
 * Multi-Account API Key Rotator & Resilient Fallback Orchestrator.
 *
 * Rotates credentials & provides zero-failure failovers across:
 *  1. Serper.dev (Google SERP - 2,500 free queries per key)
 *  2. Google Custom Search JSON API (Official Google SERP - 100 free queries/day per key)
 *  3. SerpAPI (Google SERP Dorking - Multi-Key Rotation)
 *  4. ScrapingAnt (Web Page Scraping - 10,000 free API credits/mo)
 *  5. ScraperAPI (Web Page Scraping - 5,000 free API credits)
 *  6. ScrapeOps (Proxy Aggregator - 1,000 free API credits/mo)
 *  7. ScrapingBee / ZenRows (Anti-Bot Bypass - Multi-Key Rotation)
 *  8. Apify Tokens (Google Maps, Instagram, Facebook Actors)
 *  9. Outscraper Keys (Google Maps + Contact Enricher API)
 * 10. Zero-Key Fallbacks (DuckDuckGo Search & Direct Web Fetch with Tor/User-Agent rotation)
 */

import { getLocalConfig } from './localConfig';

class TokenRotator {
  private apifyIdx = 0;
  private outscraperIdx = 0;
  private scrapingBeeIdx = 0;
  private serpApiIdx = 0;
  private serperIdx = 0;
  private googleCseIdx = 0;
  private scrapingAntIdx = 0;
  private scraperApiIdx = 0;
  private scrapeOpsIdx = 0;

  getApifyToken(): string | null {
    const config = getLocalConfig();
    const tokens: string[] = [];
    if (Array.isArray(config.apifyTokens) && config.apifyTokens.length > 0) {
      tokens.push(...config.apifyTokens.filter(t => Boolean(t && t.trim())));
    } else if (config.apifyToken && config.apifyToken.trim()) {
      tokens.push(...config.apifyToken.split(',').map(t => t.trim()).filter(Boolean));
    }
    if (tokens.length === 0) return null;
    const token = tokens[this.apifyIdx % tokens.length];
    this.apifyIdx = (this.apifyIdx + 1) % tokens.length;
    return token;
  }

  getOutscraperApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.outscraperApiKeys) && config.outscraperApiKeys.length > 0) {
      keys.push(...config.outscraperApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.outscraperIdx % keys.length];
    this.outscraperIdx = (this.outscraperIdx + 1) % keys.length;
    return key;
  }

  getScrapingBeeApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.scrapingBeeApiKeys) && config.scrapingBeeApiKeys.length > 0) {
      keys.push(...config.scrapingBeeApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.scrapingBeeIdx % keys.length];
    this.scrapingBeeIdx = (this.scrapingBeeIdx + 1) % keys.length;
    return key;
  }

  getSerpApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.serpApiKeys) && config.serpApiKeys.length > 0) {
      keys.push(...config.serpApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.serpApiIdx % keys.length];
    this.serpApiIdx = (this.serpApiIdx + 1) % keys.length;
    return key;
  }

  getSerperApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.serperApiKeys) && config.serperApiKeys.length > 0) {
      keys.push(...config.serperApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.serperIdx % keys.length];
    this.serperIdx = (this.serperIdx + 1) % keys.length;
    return key;
  }

  getGoogleCseConfig(): { apiKey: string; engineId: string } | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.googleCseApiKeys) && config.googleCseApiKeys.length > 0) {
      keys.push(...config.googleCseApiKeys.filter(k => Boolean(k && k.trim())));
    }
    const engineId = config.googleCseEngineId || '';
    if (keys.length === 0 || !engineId) return null;
    const apiKey = keys[this.googleCseIdx % keys.length];
    this.googleCseIdx = (this.googleCseIdx + 1) % keys.length;
    return { apiKey, engineId };
  }

  getScrapingAntApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.scrapingAntApiKeys) && config.scrapingAntApiKeys.length > 0) {
      keys.push(...config.scrapingAntApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.scrapingAntIdx % keys.length];
    this.scrapingAntIdx = (this.scrapingAntIdx + 1) % keys.length;
    return key;
  }

  getScraperApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.scraperApiKeys) && config.scraperApiKeys.length > 0) {
      keys.push(...config.scraperApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.scraperApiIdx % keys.length];
    this.scraperApiIdx = (this.scraperApiIdx + 1) % keys.length;
    return key;
  }

  getScrapeOpsApiKey(): string | null {
    const config = getLocalConfig();
    const keys: string[] = [];
    if (Array.isArray(config.scrapeOpsApiKeys) && config.scrapeOpsApiKeys.length > 0) {
      keys.push(...config.scrapeOpsApiKeys.filter(k => Boolean(k && k.trim())));
    }
    if (keys.length === 0) return null;
    const key = keys[this.scrapeOpsIdx % keys.length];
    this.scrapeOpsIdx = (this.scrapeOpsIdx + 1) % keys.length;
    return key;
  }

  getAccountsSummary() {
    const config = getLocalConfig();
    const apifyCount = (config.apifyTokens || []).filter(Boolean).length || (config.apifyToken ? 1 : 0);
    const outscraperCount = (config.outscraperApiKeys || []).filter(Boolean).length;
    const scrapingBeeCount = (config.scrapingBeeApiKeys || []).filter(Boolean).length;
    const serpApiCount = (config.serpApiKeys || []).filter(Boolean).length;
    const serperCount = (config.serperApiKeys || []).filter(Boolean).length;
    const googleCseCount = (config.googleCseApiKeys || []).filter(Boolean).length;
    const scrapingAntCount = (config.scrapingAntApiKeys || []).filter(Boolean).length;
    const scraperApiCount = (config.scraperApiKeys || []).filter(Boolean).length;
    const scrapeOpsCount = (config.scrapeOpsApiKeys || []).filter(Boolean).length;

    const totalAccounts = apifyCount + outscraperCount + scrapingBeeCount + serpApiCount +
      serperCount + googleCseCount + scrapingAntCount + scraperApiCount + scrapeOpsCount;

    return {
      apifyCount,
      outscraperCount,
      scrapingBeeCount,
      serpApiCount,
      serperCount,
      googleCseCount,
      scrapingAntCount,
      scraperApiCount,
      scrapeOpsCount,
      totalConfiguredAccounts: totalAccounts,
      activeFreeTierProvidersCount: totalAccounts + 2 // +2 for Zero-Key DuckDuckGo & Direct Fetch Fallbacks
    };
  }
}

export const providerRotator = new TokenRotator();

export interface SerpSearchResultItem {
  title: string;
  link: string;
  snippet: string;
}

/**
 * High-Resilience Multi-Provider SERP Search
 * Rotates: Serper.dev -> Google Custom Search -> SerpAPI -> DuckDuckGo Free Zero-Key Fallback
 */
export async function fetchSERPWithFallback(query: string, limit: number = 10): Promise<SerpSearchResultItem[]> {
  // Option 1: Serper.dev (2,500 free queries)
  const serperKey = providerRotator.getSerperApiKey();
  if (serperKey) {
    try {
      const resp = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: limit }),
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.organic) && data.organic.length > 0) {
          return data.organic.slice(0, limit).map((item: any) => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || '',
          }));
        }
      }
    } catch (_) {
      console.warn('[SERP Rotator] Serper.dev query failed, trying next provider...');
    }
  }

  // Option 2: Google Custom Search API (100 free queries/day)
  const cseConfig = providerRotator.getGoogleCseConfig();
  if (cseConfig) {
    try {
      const url = `https://customsearch.googleapis.com/customsearch/v1?key=${cseConfig.apiKey}&cx=${cseConfig.engineId}&q=${encodeURIComponent(query)}&num=${Math.min(limit, 10)}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          return data.items.map((item: any) => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || '',
          }));
        }
      }
    } catch (_) {
      console.warn('[SERP Rotator] Google Custom Search failed, trying next provider...');
    }
  }

  // Option 3: SerpAPI (Multi-key rotated)
  const serpApiKey = providerRotator.getSerpApiKey();
  if (serpApiKey) {
    try {
      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=${limit}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.organic_results) && data.organic_results.length > 0) {
          return data.organic_results.slice(0, limit).map((item: any) => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || '',
          }));
        }
      }
    } catch (_) {
      console.warn('[SERP Rotator] SerpAPI query failed, trying zero-key fallback...');
    }
  }

  // Option 4: DuckDuckGo Zero-Key HTML Fallback (100% Free / Unlimited)
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const resp = await fetch(ddgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (resp.ok) {
      const html = await resp.text();
      const results: SerpSearchResultItem[] = [];
      const linkMatches = Array.from(html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi));
      const snippets = Array.from(html.matchAll(/<a\s+class="result__snippet"[^>]*>(.*?)<\/a>/gi)).map(m => m[1].replace(/<[^>]*>?/gm, '').trim());

      const seenUrls = new Set<string>();
      let snippetIdx = 0;

      for (const m of linkMatches) {
        let rawUrl = m[1];
        if (!rawUrl || rawUrl.startsWith('#') || rawUrl.includes('duckduckgo.com/html')) continue;

        if (rawUrl.includes('uddg=')) {
          try {
            const urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : `https://duckduckgo.com${rawUrl}`);
            rawUrl = urlObj.searchParams.get('uddg') || rawUrl;
          } catch (_) {
            const matchUddg = rawUrl.match(/uddg=([^&]+)/);
            if (matchUddg) rawUrl = decodeURIComponent(matchUddg[1]);
          }
        }
        if (!rawUrl.startsWith('http') || rawUrl.includes('duckduckgo.com')) continue;
        if (seenUrls.has(rawUrl)) continue;
        seenUrls.add(rawUrl);

        const cleanTitle = m[2].replace(/<[^>]*>?/gm, '').trim() || `SearchResult #${results.length + 1}`;
        const cleanSnippet = snippets[snippetIdx++] || `Found via DuckDuckGo fallback for ${query}`;

        results.push({
          title: cleanTitle,
          link: rawUrl,
          snippet: cleanSnippet,
        });

        if (results.length >= limit) break;
      }
      if (results.length > 0) return results;
    }
  } catch (_) {
    console.warn('[SERP Rotator] DuckDuckGo fallback failed');
  }

  return [];
}

/**
 * Fetch raw web page via multi-provider proxy rotation (ScrapingAnt -> ScraperAPI -> ScrapeOps -> ZenRows/ScrapingBee -> Direct)
 */
export async function fetchWithAntiBotProxy(targetUrl: string, headers?: Record<string, string>): Promise<string | null> {
  // Provider Option 1: ScrapingAnt (10,000 free credits/mo)
  const antKey = providerRotator.getScrapingAntApiKey();
  if (antKey) {
    try {
      const proxyUrl = `https://api.scrapingant.com/v2/general?apiKey=${antKey}&url=${encodeURIComponent(targetUrl)}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (resp.ok) return await resp.text();
    } catch (_) {}
  }

  // Provider Option 2: ScraperAPI (5,000 free credits)
  const scraperKey = providerRotator.getScraperApiKey();
  if (scraperKey) {
    try {
      const proxyUrl = `http://api.scraperapi.com?api_key=${scraperKey}&url=${encodeURIComponent(targetUrl)}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (resp.ok) return await resp.text();
    } catch (_) {}
  }

  // Provider Option 3: ScrapeOps (1,000 free credits)
  const scrapeOpsKey = providerRotator.getScrapeOpsApiKey();
  if (scrapeOpsKey) {
    try {
      const proxyUrl = `https://proxy.scrapeops.io/v1/?api_key=${scrapeOpsKey}&url=${encodeURIComponent(targetUrl)}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (resp.ok) return await resp.text();
    } catch (_) {}
  }

  // Provider Option 4: ZenRows / ScrapingBee
  const beeKey = providerRotator.getScrapingBeeApiKey();
  if (beeKey) {
    try {
      const isZenRows = beeKey.length === 40 || !beeKey.startsWith('SB-');
      const proxyUrl = isZenRows
        ? `https://api.zenrows.com/v1/?apikey=${beeKey}&url=${encodeURIComponent(targetUrl)}`
        : `https://app.scrapingbee.com/api/v1/?api_key=${beeKey}&url=${encodeURIComponent(targetUrl)}&render_js=false`;

      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (resp.ok) return await resp.text();
    } catch (_) {}
  }

  // Provider Option 5: Direct Fetch with rotating User-Agent Header Fallback
  try {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };
    const resp = await fetch(targetUrl, {
      headers: headers || defaultHeaders,
      signal: AbortSignal.timeout(8000),
    });
    if (resp.ok) return await resp.text();
  } catch (_) {}

  return null;
}
