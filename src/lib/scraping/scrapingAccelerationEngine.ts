/**
 * @file src/lib/scraping/scrapingAccelerationEngine.ts
 * 
 * High-Speed Resilient Commercial Scraping Acceleration Engine (2026 Edition)
 * Bethelmind Analytics Commercial Growth System
 * 
 * Powered by:
 * - p-limit: Dynamic concurrency control preventing IP rate limits & socket exhaustion.
 * - p-retry: Exponential backoff & jitter resilience for directory network calls.
 * - axios + Keep-Alive: High-speed connection reuse.
 * - leadSanitizerPipeline: Real-time carrier prefix detection and zero-synthetic lead filtering.
 */

import http from 'http';
import https from 'https';
import crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';
import pLimit from 'p-limit';
import pRetry from 'p-retry';
import * as cheerio from 'cheerio';
import { validateAndFormatNigerianPhone, sanitizeBusinessName, sanitizeBusinessEmail } from '../outreach/leadSanitizerPipeline';

export interface RawScrapedItem {
  name?: string;
  phone?: string;
  email?: string;
  category?: string;
  area?: string;
  address?: string;
  website?: string;
  sourceUrl?: string;
}

export interface AcceleratedLead {
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

export interface ScrapingSessionSummary {
  timestamp: string;
  totalFound: number;
  validHarvested: number;
  duplicatesSkipped: number;
  rejectedSynthetic: number;
  durationMs: number;
  leads: AcceleratedLead[];
}

export class ScrapingAccelerationEngine {
  private httpClient: AxiosInstance;
  private concurrencyLimiter = pLimit(15);
  private dedupeHashes = new Set<string>();

  constructor() {
    const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
    const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

    this.httpClient = axios.create({
      timeout: 10000,
      httpAgent,
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
  }

  /**
   * Seed deduplication cache with existing phone hashes
   */
  public seedExistingHashes(phones: string[]) {
    phones.forEach(p => {
      const clean = p.replace(/\D/g, '');
      if (clean) {
        this.dedupeHashes.add(crypto.createHash('sha256').update(clean).digest('hex'));
      }
    });
  }

  /**
   * High-speed resilient page scraper with exponential backoff retry
   */
  public async fetchHtmlWithRetry(url: string): Promise<string> {
    return pRetry(
      async () => {
        const response = await this.httpClient.get(url);
        return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      },
      {
        retries: 2,
        minTimeout: 500,
        factor: 2
      }
    );
  }

  /**
   * Extracts commercial business contacts from HTML content
   */
  public parseDirectoryHtml(html: string, fallbackCategory = 'Commercial SME', fallbackArea = 'Lagos'): RawScrapedItem[] {
    const results: RawScrapedItem[] = [];
    const $ = cheerio.load(html);

    const phonePattern = /(?:\+?234|0)[789][01]\d{8}/g;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    $('article, .listing, .result-item, .business-card, .company, div[data-lead]').each((_, el) => {
      const text = $(el).text();
      const title = $(el).find('h2, h3, .title, .name, a.company-name').first().text().trim();
      const phones = text.match(phonePattern) || [];
      const emails = text.match(emailPattern) || [];

      if (title && phones.length > 0) {
        results.push({
          name: title,
          phone: phones[0],
          email: emails[0],
          category: fallbackCategory,
          area: fallbackArea
        });
      }
    });

    return results;
  }

  /**
   * Process raw items through high-speed sanitization & deduplication
   */
  public processAndSanitizeBatch(items: RawScrapedItem[], sourceLabel = 'directory'): {
    validLeads: AcceleratedLead[];
    duplicates: number;
    rejected: number;
  } {
    const validLeads: AcceleratedLead[] = [];
    let duplicates = 0;
    let rejected = 0;

    for (const item of items) {
      const phoneCheck = validateAndFormatNigerianPhone(item.phone);
      const nameCheck = sanitizeBusinessName(item.name, item.category);
      const emailCheck = sanitizeBusinessEmail(item.email);

      if (!phoneCheck.isValid || !nameCheck.isValid) {
        rejected++;
        continue;
      }

      const phoneClean = phoneCheck.cleanLocal!;
      const phoneHash = crypto.createHash('sha256').update(phoneClean).digest('hex');

      if (this.dedupeHashes.has(phoneHash)) {
        duplicates++;
        continue;
      }

      this.dedupeHashes.add(phoneHash);

      const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const engineTag = (item.category || '').toLowerCase().includes('freight')
        ? 'ENGINE_2_FREIGHT_OTC'
        : 'ENGINE_1_SME_PROTOTYPE';

      validLeads.push({
        id: leadId,
        name: nameCheck.cleanName,
        phone: phoneClean,
        phoneE164: phoneCheck.phoneE164!,
        carrier: phoneCheck.carrier || 'UNKNOWN',
        email: emailCheck.isValid ? emailCheck.cleanEmail : undefined,
        category: item.category || 'Commercial Enterprise',
        area: item.area || 'Lagos',
        address: item.address || `${item.area || 'Lagos'} Commercial District`,
        hasWebsite: Boolean(item.website),
        source: sourceLabel,
        confidenceScore: 85 + (emailCheck.isValid ? 15 : 0),
        engineTag,
        scrapedAt: new Date().toISOString()
      });
    }

    return { validLeads, duplicates, rejected };
  }
}
