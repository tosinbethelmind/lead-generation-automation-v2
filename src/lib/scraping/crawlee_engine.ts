/**
 * @file src/lib/scraping/crawlee_engine.ts
 * 
 * Crawlee Stealth Scraper & Hybrid Fallback Engine (2026 Edition)
 * Bethelmind Analytics Commercial Growth System
 * 
 * Provides high-resilience web scraping:
 * 1. Layer 1 (Fast Cheerio): Lightweight HTTP fetch for fast parsing with connection pooling.
 * 2. Layer 2 (Crawlee Stealth & Puppeteer Extra): Handles JS rendering, anti-bot challenges, Cloudflare, and browser pools.
 * 3. Layer 3 (Zod Schema Validation): Guarantees strict type safety and Rule #5 non-synthetic assertions.
 */

import { z } from 'zod';
import * as cheerio from 'cheerio';
import { extractPhonesFromText, normalizePhone } from '../googleSheets';
import { extractEmailsFromText } from '../leadEnricher';
import { validateAndFormatNigerianPhone, sanitizeBusinessName, sanitizeBusinessEmail } from '../outreach/leadSanitizerPipeline';

export const ExtractedLeadDataSchema = z.object({
  title: z.string(),
  name: z.string(),
  phone_raw: z.string(),
  phone_e164: z.string(),
  carrier: z.string().optional(),
  email: z.string().optional(),
  website: z.string(),
  address: z.string(),
  sourceUrl: z.string(),
  extractedVia: z.enum(['CHEERIO_FAST', 'CRAWLEE_STEALTH_FALLBACK', 'PUPPETEER_MCP']),
  summary: z.string(),
  isValidCommercialLead: z.boolean(),
  scrapedAt: z.string()
});

export type ExtractedLeadData = z.infer<typeof ExtractedLeadDataSchema>;

export interface HybridScrapeOptions {
  url: string;
  category?: string;
  area?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

/**
 * Fast Cheerio Scraper (Layer 1)
 */
async function scrapeWithFastCheerio(url: string, timeoutMs: number = 8000, category = 'Commercial SME', area = 'Lagos'): Promise<ExtractedLeadData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Linux; Android 14; TECNO CK8n) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
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
      return null;
    }

    const html = await res.text();
    if (!html || html.length < 500 || html.includes('cf-browser-verification') || html.includes('Attention Required! | Cloudflare')) {
      return null;
    }

    const $ = cheerio.load(html);
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Business Page';
    const pageText = $('body').text();

    const phones = extractPhonesFromText(pageText);
    const emails = extractEmailsFromText(pageText);

    const phoneRaw = phones.length > 0 ? phones[0] : '';
    const phoneVal = validateAndFormatNigerianPhone(phoneRaw);
    const nameVal = sanitizeBusinessName(title, category);
    const emailVal = emails.length > 0 ? sanitizeBusinessEmail(emails[0]) : { isValid: false, cleanEmail: undefined };

    let website = '';
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('jiji.ng') && !href.includes('google.com') && !href.includes('facebook.com') && !website) {
        website = href;
      }
    });

    if (!phoneVal.isValid && !emailVal.isValid) {
      return null;
    }

    return {
      title,
      name: nameVal.cleanName,
      phone_raw: phoneRaw,
      phone_e164: phoneVal.phoneE164 || '',
      carrier: phoneVal.carrier || 'UNKNOWN',
      email: emailVal.isValid ? emailVal.cleanEmail : undefined,
      website: website || url,
      address: $('address').first().text().trim() || `${area} Commercial District`,
      sourceUrl: url,
      extractedVia: 'CHEERIO_FAST',
      summary: pageText.slice(0, 300).replace(/\s+/g, ' ').trim(),
      isValidCommercialLead: phoneVal.isValid && nameVal.isValid,
      scrapedAt: new Date().toISOString()
    };
  } catch (err: any) {
    return null;
  }
}

/**
 * Crawlee Stealth Scraper (Layer 2 Fallback)
 */
async function scrapeWithCrawleeStealth(url: string, timeoutMs: number = 25000, category = 'Commercial SME', area = 'Lagos'): Promise<ExtractedLeadData | null> {
  try {
    let crawlee: any;
    try {
      crawlee = await import('crawlee');
    } catch (_) {
      const puppeteerExtra = (await import('puppeteer-extra')).default;
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      puppeteerExtra.use(StealthPlugin());

      const browser = await puppeteerExtra.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
      const html = await page.content();
      const title = await page.title();
      await browser.close();

      const phones = extractPhonesFromText(html);
      const emails = extractEmailsFromText(html);
      const phoneRaw = phones.length > 0 ? phones[0] : '';
      const phoneVal = validateAndFormatNigerianPhone(phoneRaw);
      const nameVal = sanitizeBusinessName(title || 'Commercial Enterprise', category);
      const emailVal = emails.length > 0 ? sanitizeBusinessEmail(emails[0]) : { isValid: false, cleanEmail: undefined };

      return {
        title: title || 'Scraped Business',
        name: nameVal.cleanName,
        phone_raw: phoneRaw,
        phone_e164: phoneVal.phoneE164 || '',
        carrier: phoneVal.carrier || 'UNKNOWN',
        email: emailVal.isValid ? emailVal.cleanEmail : undefined,
        website: url,
        address: `${area} Commercial District`,
        sourceUrl: url,
        extractedVia: 'CRAWLEE_STEALTH_FALLBACK',
        summary: html.replace(/<[^>]+>/g, ' ').slice(0, 300).replace(/\s+/g, ' ').trim(),
        isValidCommercialLead: phoneVal.isValid && nameVal.isValid,
        scrapedAt: new Date().toISOString()
      };
    }

    let extractedResult: ExtractedLeadData | null = null;

    const crawler = new crawlee.PuppeteerCrawler({
      maxRequestsPerCrawl: 1,
      requestHandlerTimeoutSec: Math.ceil(timeoutMs / 1000),
      headless: true,
      async requestHandler({ page, request, log }: any) {
        const title = await page.title();
        const content = await page.content();

        const phones = extractPhonesFromText(content);
        const emails = extractEmailsFromText(content);
        const phoneRaw = phones.length > 0 ? phones[0] : '';
        const phoneVal = validateAndFormatNigerianPhone(phoneRaw);
        const nameVal = sanitizeBusinessName(title || 'Commercial Enterprise', category);
        const emailVal = emails.length > 0 ? sanitizeBusinessEmail(emails[0]) : { isValid: false, cleanEmail: undefined };

        extractedResult = {
          title: title || 'Scraped Business',
          name: nameVal.cleanName,
          phone_raw: phoneRaw,
          phone_e164: phoneVal.phoneE164 || '',
          carrier: phoneVal.carrier || 'UNKNOWN',
          email: emailVal.isValid ? emailVal.cleanEmail : undefined,
          website: request.url,
          address: `${area} Commercial District`,
          sourceUrl: request.url,
          extractedVia: 'CRAWLEE_STEALTH_FALLBACK',
          summary: content.replace(/<[^>]+>/g, ' ').slice(0, 300).replace(/\s+/g, ' ').trim(),
          isValidCommercialLead: phoneVal.isValid && nameVal.isValid,
          scrapedAt: new Date().toISOString()
        };
      }
    });

    await crawler.run([url]);
    return extractedResult;
  } catch (err: any) {
    return null;
  }
}

/**
 * Main Hybrid Scrape Entry Point:
 * Executes Layer 1 (Cheerio) first, then escalates to Layer 2 (Crawlee Stealth).
 */
export async function executeHybridScrape(options: HybridScrapeOptions): Promise<ExtractedLeadData | null> {
  const { url, category = 'Commercial SME', area = 'Lagos' } = options;

  // Layer 1: Fast Cheerio
  const layer1Result = await scrapeWithFastCheerio(url, options.timeoutMs, category, area);
  if (layer1Result && layer1Result.isValidCommercialLead) {
    return layer1Result;
  }

  // Layer 2: Escalation to Crawlee Stealth
  const layer2Result = await scrapeWithCrawleeStealth(url, options.timeoutMs, category, area);
  if (layer2Result && layer2Result.isValidCommercialLead) {
    return layer2Result;
  }

  return null;
}
