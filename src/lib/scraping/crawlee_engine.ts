/**
 * @file src/lib/scraping/crawlee_engine.ts
 * Crawlee Stealth Scraper & Hybrid Fallback Engine.
 * 
 * Provides high-resilience web scraping:
 * 1. Layer 1 (Fast Cheerio): Lightweight HTTP fetch for fast parsing.
 * 2. Layer 2 (Crawlee Stealth): Automatic fallback using Crawlee / Puppeteer Stealth,
 *    handling anti-bot challenges, Cloudflare, headless browser pool management, and retries.
 */

import * as cheerio from 'cheerio';
import { extractPhonesFromText, normalizePhone } from '../googleSheets';
import { extractEmailsFromText } from '../leadEnricher';

export interface ExtractedLeadData {
  title: string;
  name: string;
  phone_raw: string;
  phone_e164: string;
  email: string;
  website: string;
  address: string;
  sourceUrl: string;
  extractedVia: 'CHEERIO_FAST' | 'CRAWLEE_STEALTH_FALLBACK';
  summary: string;
}

export interface HybridScrapeOptions {
  url: string;
  selectorHint?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

/**
 * Fast Cheerio Scraper (Layer 1)
 */
async function scrapeWithFastCheerio(url: string, timeoutMs: number = 8000): Promise<ExtractedLeadData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    const res = await fetch(url, {
      headers: {
        'User-Agent': randomUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[HybridScraper] Layer 1 Cheerio returned status ${res.status} for ${url}`);
      return null;
    }

    const html = await res.text();
    if (!html || html.length < 500 || html.includes('cf-browser-verification') || html.includes('Attention Required! | Cloudflare')) {
      console.warn(`[HybridScraper] Layer 1 detected anti-bot / Cloudflare wall on ${url}`);
      return null;
    }

    const $ = cheerio.load(html);
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Business Page';
    const pageText = $('body').text();

    const phones = extractPhonesFromText(pageText);
    const emails = extractEmailsFromText(pageText);

    const phoneRaw = phones.length > 0 ? phones[0] : '';
    const phoneE164 = phoneRaw ? (normalizePhone(phoneRaw) || '') : '';
    const email = emails.length > 0 ? emails[0] : '';

    let website = '';
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('jiji.ng') && !href.includes('google.com') && !href.includes('facebook.com') && !website) {
        website = href;
      }
    });

    if (!phoneE164 && !email) {
      console.warn(`[HybridScraper] Layer 1 Cheerio yielded no contact details for ${url}, escalating to Crawlee...`);
      return null;
    }

    return {
      title,
      name: title.split('|')[0].split('-')[0].trim(),
      phone_raw: phoneRaw,
      phone_e164: phoneE164,
      email,
      website,
      address: $('address').first().text().trim() || '',
      sourceUrl: url,
      extractedVia: 'CHEERIO_FAST',
      summary: pageText.slice(0, 300).replace(/\s+/g, ' ').trim()
    };
  } catch (err: any) {
    console.warn(`[HybridScraper] Layer 1 Cheerio error: ${err.message}`);
    return null;
  }
}

/**
 * Crawlee Stealth Scraper (Layer 2 Fallback)
 */
async function scrapeWithCrawleeStealth(url: string, timeoutMs: number = 25000): Promise<ExtractedLeadData | null> {
  try {
    console.log(`🚀 [HybridScraper] Escalating to Crawlee Stealth Engine for: ${url}`);
    
    // Dynamic import to handle crawlee or puppeteer-extra fallback
    let crawlee: any;
    try {
      crawlee = await import('crawlee');
    } catch (_) {
      console.warn('[HybridScraper] crawlee package not loaded directly, falling back to Puppeteer Extra Stealth runner...');
      const puppeteerExtra = (await import('puppeteer-extra')).default;
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      puppeteerExtra.use(StealthPlugin());

      const browser = await puppeteerExtra.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
      const html = await page.content();
      const title = await page.title();
      await browser.close();

      const phones = extractPhonesFromText(html);
      const emails = extractEmailsFromText(html);
      const phoneRaw = phones.length > 0 ? phones[0] : '';
      const phoneE164 = phoneRaw ? (normalizePhone(phoneRaw) || '') : '';

      return {
        title: title || 'Scraped Business',
        name: (title || 'Scraped Business').split('|')[0].trim(),
        phone_raw: phoneRaw,
        phone_e164: phoneE164,
        email: emails[0] || '',
        website: url,
        address: '',
        sourceUrl: url,
        extractedVia: 'CRAWLEE_STEALTH_FALLBACK',
        summary: html.replace(/<[^>]+>/g, ' ').slice(0, 300).replace(/\s+/g, ' ').trim()
      };
    }

    let extractedResult: ExtractedLeadData | null = null;

    const crawler = new crawlee.PuppeteerCrawler({
      maxRequestsPerCrawl: 1,
      requestHandlerTimeoutSec: Math.ceil(timeoutMs / 1000),
      headless: true,
      async requestHandler({ page, request, log }: any) {
        log.info(`[Crawlee] Processing stealth request: ${request.url}`);
        const title = await page.title();
        const content = await page.content();

        const phones = extractPhonesFromText(content);
        const emails = extractEmailsFromText(content);
        const phoneRaw = phones.length > 0 ? phones[0] : '';
        const phoneE164 = phoneRaw ? (normalizePhone(phoneRaw) || '') : '';

        extractedResult = {
          title: title || 'Scraped Business',
          name: (title || 'Scraped Business').split('|')[0].trim(),
          phone_raw: phoneRaw,
          phone_e164: phoneE164,
          email: emails[0] || '',
          website: request.url,
          address: '',
          sourceUrl: request.url,
          extractedVia: 'CRAWLEE_STEALTH_FALLBACK',
          summary: content.replace(/<[^>]+>/g, ' ').slice(0, 300).replace(/\s+/g, ' ').trim()
        };
      },
      failedRequestHandler({ request, log, error }: any) {
        log.error(`[Crawlee] Request failed: ${request.url} - ${error.message}`);
      }
    });

    await crawler.run([url]);
    return extractedResult;
  } catch (err: any) {
    console.error(`[HybridScraper] Crawlee Stealth Engine error:`, err.message);
    return null;
  }
}

/**
 * Main Hybrid Scrape Entry Point:
 * Executes Layer 1 (Cheerio) first. If blocked or missing contacts, escalates to Layer 2 (Crawlee Stealth).
 */
export async function executeHybridScrape(options: HybridScrapeOptions): Promise<ExtractedLeadData | null> {
  const { url } = options;
  console.log(`\n🔍 [HybridScraper] Starting hybrid scrape for: ${url}`);

  // Layer 1: Fast Cheerio
  const layer1Result = await scrapeWithFastCheerio(url);
  if (layer1Result && (layer1Result.phone_e164 || layer1Result.email)) {
    console.log(`✅ [HybridScraper] Layer 1 Cheerio SUCCESS in milliseconds: Phone ${layer1Result.phone_e164 || 'N/A'}`);
    return layer1Result;
  }

  // Layer 2: Escalation to Crawlee Stealth
  console.log(`⚡ [HybridScraper] Layer 1 insufficient. Escalating to Layer 2 Crawlee Stealth...`);
  const layer2Result = await scrapeWithCrawleeStealth(url);
  if (layer2Result) {
    console.log(`✅ [HybridScraper] Layer 2 Crawlee Stealth SUCCESS: Phone ${layer2Result.phone_e164 || 'N/A'}`);
    return layer2Result;
  }

  console.warn(`❌ [HybridScraper] All layers completed. No contact data extracted from ${url}`);
  return null;
}
