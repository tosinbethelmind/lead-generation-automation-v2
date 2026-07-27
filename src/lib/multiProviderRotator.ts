/**
 * @file src/lib/multiProviderRotator.ts
 * Multi-Account API Key Rotator & Fallback Orchestrator.
 *
 * Rotates API credentials across:
 *  1. Apify Tokens (Google Maps, Instagram, Facebook Actors)
 *  2. Outscraper Keys (Google Maps + Contact Enricher API)
 *  3. ScrapingBee / ZenRows Keys (Bypass Anti-Bot on Directory sites)
 *  4. SerpAPI Keys (Google SERP Dorking for Social Leads)
 */

import { getLocalConfig } from './localConfig';

class TokenRotator {
  private apifyIdx = 0;
  private outscraperIdx = 0;
  private scrapingBeeIdx = 0;
  private serpApiIdx = 0;

  /**
   * Get Next Active Apify Token (Rotates across multi-account tokens)
   */
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

  /**
   * Get Next Outscraper API Key
   */
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

  /**
   * Get Next ScrapingBee / ZenRows API Key
   */
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

  /**
   * Get Next SerpAPI Key
   */
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

  /**
   * Get Summary of Active Accounts
   */
  getAccountsSummary() {
    const config = getLocalConfig();
    const apifyCount = (config.apifyTokens || []).filter(Boolean).length || (config.apifyToken ? 1 : 0);
    const outscraperCount = (config.outscraperApiKeys || []).filter(Boolean).length;
    const scrapingBeeCount = (config.scrapingBeeApiKeys || []).filter(Boolean).length;
    const serpApiCount = (config.serpApiKeys || []).filter(Boolean).length;

    return {
      apifyCount,
      outscraperCount,
      scrapingBeeCount,
      serpApiCount,
      totalConfiguredAccounts: apifyCount + outscraperCount + scrapingBeeCount + serpApiCount
    };
  }
}

export const providerRotator = new TokenRotator();

/**
 * Fetch raw web page via ScrapingBee / ZenRows fallback if direct fetch fails
 */
export async function fetchWithAntiBotProxy(targetUrl: string, headers?: Record<string, string>): Promise<string | null> {
  const apiKey = providerRotator.getScrapingBeeApiKey();
  
  if (apiKey) {
    try {
      // Determine if key is ZenRows (40 hex chars) or ScrapingBee
      const isZenRows = apiKey.length === 40 || !apiKey.startsWith('SB-');
      const proxyUrl = isZenRows
        ? `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${encodeURIComponent(targetUrl)}`
        : `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render_js=false`;

      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (resp.ok) {
        return await resp.text();
      }
    } catch (_) {
      // Fallback to direct fetch below
    }
  }

  // Direct fetch fallback
  try {
    const resp = await fetch(targetUrl, {
      headers: headers || {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (resp.ok) return await resp.text();
  } catch (_) {
    return null;
  }

  return null;
}
