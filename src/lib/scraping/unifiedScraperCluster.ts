/**
 * @file src/lib/scraping/unifiedScraperCluster.ts
 * 
 * Unified Multi-Engine Scraper Cluster (2026 Resilient Fallback Edition)
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * Orchestrates 8 Powerful Scraper Engines with Auto-Failover:
 * 1. Scrapling (Adaptive DOM Selectors & Stealth bypass).
 * 2. Curl-Impersonate (curl_cffi): TLS & JA3/JA4 fingerprint impersonation for Cloudflare bypass.
 * 3. Crawl4AI: Asynchronous LLM web crawler & structured parser.
 * 4. Browser-Use: Playwright autonomous browser agent.
 * 5. AutoScraper: Fast automatic pattern learning scraper.
 * 6. Firecrawl (@mendable/firecrawl-js / API): LLM markdown extraction.
 * 7. Scrapy: High-speed structured crawler spider.
 * 8. Cheerio & Built-in Stealth: Ultra-fast local request pool with Client Hints.
 */

import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import { validateAndFormatNigerianPhone, sanitizeBusinessName, sanitizeBusinessEmail } from '../outreach/leadSanitizerPipeline';
import { scraplingEngine } from './scraplingFallbackEngine';

const execAsync = util.promisify(exec);

export interface ScraperClusterConfig {
  url: string;
  category?: string;
  area?: string;
  enginePreference?: 'auto' | 'scrapling' | 'curl_cffi' | 'patchright' | 'crawl4ai' | 'browser_use' | 'autoscraper' | 'firecrawl' | 'scrapy' | 'cheerio';
  timeoutMs?: number;
}

export interface ClusterLead {
  id: string;
  name: string;
  phone: string;
  phoneE164: string;
  carrier: string;
  email?: string;
  category: string;
  area: string;
  address: string;
  hasWebsite: boolean;
  source: string;
  confidenceScore: number;
  engineTag: string;
  scrapedAt: string;
}

export interface ClusterScrapeResult {
  url: string;
  engineUsed: string;
  leadsFound: number;
  leads: ClusterLead[];
  durationMs: number;
}

export class UnifiedScraperCluster {
  private concurrencyLimit = pLimit(4);
  private seenPhoneHashes = new Set<string>();

  /**
   * Execute multi-engine scrape with automatic failover across all 8 engines
   */
  public async scrape(config: ScraperClusterConfig): Promise<ClusterScrapeResult> {
    const startTime = Date.now();
    const { url, category = 'Commercial SME', area = 'Lagos', enginePreference = 'auto' } = config;

    let leads: ClusterLead[] = [];
    let engineUsed: string = enginePreference;

    // Step 1: Scrapling Adaptive In-Memory Engine (2026 Best-in-Class)
    if (enginePreference === 'scrapling' || enginePreference === 'auto') {
      try {
        const html = await scraplingEngine.fetchWithResilience(url, 'unified_cluster_target', { timeout: 7000 });
        const extracted = scraplingEngine.adaptivelyExtractLeads(html, {
          url,
          category,
          city: area,
          area,
          source: 'SCRAPLING_ADAPTIVE_2026'
        });

        if (extracted.length > 0) {
          leads = extracted.map(e => ({
            id: e.id,
            name: e.name,
            phone: e.phone,
            phoneE164: e.phoneE164,
            carrier: e.carrier,
            email: e.email,
            category: e.category,
            area: e.area,
            address: e.address || `${area} Commercial Hub`,
            hasWebsite: Boolean(e.website),
            source: url,
            confidenceScore: e.confidenceScore,
            engineTag: e.extractionStrategy,
            scrapedAt: e.scrapedAt
          }));
          engineUsed = 'scrapling_adaptive_2026';
        }
      } catch (_) {
        // Fallback to Cheerio / Python bridge
      }
    }

    // Step 2: Fast Cheerio Fetch (for standard non-protected sites)
    if (leads.length === 0 && (enginePreference === 'cheerio' || enginePreference === 'auto')) {
      try {
        leads = await this.scrapeWithCheerio(url, category, area);
        if (leads.length > 0) {
          engineUsed = 'cheerio_fast';
        }
      } catch (err) {
        // Fallback to Python multi-engine bridge
      }
    }

    // Step 3: Python Bridge (scrapling / curl_cffi / crawl4ai / browser_use / autoscraper / firecrawl / scrapy)
    if (leads.length === 0) {
      try {
        const pyResult = await this.concurrencyLimit(() => this.executePythonBridge(url, enginePreference, category, area));
        if (pyResult && pyResult.leads && pyResult.leads.length > 0) {
          leads = pyResult.leads.map((l: any) => ({
            id: l.id || `lead_cluster_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: l.name,
            phone: l.phone,
            phoneE164: l.phoneE164 || `+234${l.phone.substring(1)}`,
            carrier: l.carrier || 'UNKNOWN',
            email: l.email || undefined,
            category: l.category || category,
            area: l.area || area,
            address: l.address || `${area} Commercial District`,
            hasWebsite: Boolean(l.hasWebsite),
            source: l.source || url,
            confidenceScore: l.confidenceScore || 85,
            engineTag: l.engineTag || 'PYTHON_BRIDGE',
            scrapedAt: l.scrapedAt || new Date().toISOString()
          }));
          engineUsed = pyResult.engine || 'python_bridge_auto';
        }
      } catch (err) {
        // Bridge failed, return current leads array
      }
    }

    return {
      url,
      engineUsed,
      leadsFound: leads.length,
      leads,
      durationMs: Date.now() - startTime
    };
  }

  /**
   * Fast Cheerio scraper for standard non-protected websites
   */
  private async scrapeWithCheerio(url: string, category: string, area: string): Promise<ClusterLead[]> {
    const res = await axios.get(url, {
      timeout: 8000,
      headers: scraplingEngine.getStealthHeaders()
    });

    const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    if (html.includes('cf-browser-verification') || html.includes('Attention Required! | Cloudflare')) {
      throw new Error('Cloudflare anti-bot detected');
    }

    return this.parseAndSanitizeHtml(html, url, category, area, 'CHEERIO_FAST');
  }

  /**
   * Execute python scraper bridge script
   */
  private async executePythonBridge(url: string, engine: string, category: string, area: string): Promise<any> {
    const bridgeScript = path.join(process.cwd(), 'scripts', 'python_scraper_cluster_bridge.py');
    const cmd = `python "${bridgeScript}" --url "${url}" --engine "${engine}" --category "${category}" --area "${area}"`;

    const { stdout } = await execAsync(cmd, { timeout: 12000, windowsHide: true });
    return JSON.parse(stdout.trim());
  }

  /**
   * Extract, sanitize & validate leads from raw HTML or text
   */
  private parseAndSanitizeHtml(html: string, url: string, category: string, area: string, engineTag: string): ClusterLead[] {
    const leads: ClusterLead[] = [];
    const $ = cheerio.load(html);

    const phonePattern = /(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    $('article, .listing, .result-item, .business-card, .company, div[data-lead]').each((_, el) => {
      const text = $(el).text();
      const rawName = $(el).find('h2, h3, .title, .name, a.company-name').first().text().trim();
      const phones = text.match(phonePattern) || [];
      const emails = text.match(emailPattern) || [];

      if (rawName && phones.length > 0) {
        const phoneVal = validateAndFormatNigerianPhone(phones[0]);
        const nameVal = sanitizeBusinessName(rawName, category);
        const emailVal = emails[0] ? sanitizeBusinessEmail(emails[0]) : { isValid: false, cleanEmail: undefined };

        if (phoneVal.isValid && nameVal.isValid && !this.seenPhoneHashes.has(phoneVal.cleanLocal!)) {
          this.seenPhoneHashes.add(phoneVal.cleanLocal!);

          leads.push({
            id: `lead_cluster_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: nameVal.cleanName,
            phone: phoneVal.cleanLocal!,
            phoneE164: phoneVal.phoneE164!,
            carrier: phoneVal.carrier || 'UNKNOWN',
            email: emailVal.isValid ? emailVal.cleanEmail : undefined,
            category,
            area,
            address: `${area} Commercial District`,
            hasWebsite: text.toLowerCase().includes('www.') || text.toLowerCase().includes('http'),
            source: url,
            confidenceScore: 85 + (emailVal.isValid ? 15 : 0),
            engineTag,
            scrapedAt: new Date().toISOString()
          });
        }
      }
    });

    return leads;
  }
}

export const unifiedScraperCluster = new UnifiedScraperCluster();

