/**
 * @file src/lib/scraping/katanaCrawlerBridge.ts
 * 
 * 🗡️ KATANA HIGH-SPEED ENDPOINT CRAWLER BRIDGE
 * Bethelmind Analytics Lagos Desk · 2026 Edition
 * 
 * Powered by ProjectDiscovery Katana (Go v1.7.0):
 * - Crawls entire domains in sub-seconds
 * - Discovers hidden contact forms, email mailto endpoints, and JavaScript API links
 * - Feeds discovered URLs directly to Metascraper & Playwright
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const KATANA_BIN = path.join(process.cwd(), 'bin', 'katana.exe');

export interface KatanaCrawlResult {
  url: string;
  contactUrls: string[];
  allEndpoints: string[];
  extractedEmails: string[];
  durationMs: number;
}

export class KatanaCrawlerBridge {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = fs.existsSync(KATANA_BIN);
    if (!this.isAvailable) {
      console.warn('⚠️ Katana binary not found at bin/katana.exe. Falling back to HTTP crawling.');
    }
  }

  /**
   * Crawls a single domain using Katana binary
   * @param domainUrl e.g. https://example.com
   * @param maxDepth Crawl depth (default: 2)
   * @param timeoutSec Maximum execution time in seconds (default: 15)
   */
  async crawlDomain(domainUrl: string, maxDepth = 2, timeoutSec = 15): Promise<KatanaCrawlResult> {
    const startTime = Date.now();
    const result: KatanaCrawlResult = {
      url: domainUrl,
      contactUrls: [],
      allEndpoints: [],
      extractedEmails: [],
      durationMs: 0
    };

    if (!this.isAvailable) {
      result.durationMs = Date.now() - startTime;
      return result;
    }

    let cleanUrl = domainUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    return new Promise((resolve) => {
      const endpoints: string[] = [];
      const timer = setTimeout(() => {
        try { child.kill(); } catch (_) {}
      }, timeoutSec * 1000);

      // katana -u <url> -d <depth> -silent -ct 5s -jc
      // -jc enables javascript parsing
      // -silent outputs clean URLs line by line
      const args = [
        '-u', cleanUrl,
        '-d', maxDepth.toString(),
        '-silent',
        '-ct', '5s',
        '-jc',
        '-c', '10'
      ];

      const child = spawn(KATANA_BIN, args, {
        cwd: process.cwd(),
        windowsHide: true
      });

      child.stdout.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (line && line.startsWith('http')) {
            endpoints.push(line);
          }
        }
      });

      child.on('close', () => {
        clearTimeout(timer);
        result.allEndpoints = Array.from(new Set(endpoints));

        // Filter contact URLs
        const contactKeywords = /contact|about|quote|reach|touch|feedback|inquir|support/i;
        result.contactUrls = result.allEndpoints.filter(u => contactKeywords.test(u));

        // Extract any mailto links directly discovered
        result.allEndpoints.forEach(u => {
          if (u.includes('mailto:')) {
            const match = u.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (match && match[1]) {
              result.extractedEmails.push(match[1].toLowerCase());
            }
          }
        });

        result.extractedEmails = Array.from(new Set(result.extractedEmails));
        result.durationMs = Date.now() - startTime;
        resolve(result);
      });

      child.on('error', () => {
        clearTimeout(timer);
        result.durationMs = Date.now() - startTime;
        resolve(result);
      });
    });
  }
}

export const katanaCrawlerBridge = new KatanaCrawlerBridge();
