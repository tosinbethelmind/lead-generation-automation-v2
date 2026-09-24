/**
 * @file src/lib/scraping/stealthMetascraperExtractor.ts
 * 
 * 🔍 METASCRAPER & DISPOSABLE EMAIL GUARD
 * Bethelmind Analytics Lagos Desk · 2026 Edition
 * 
 * Capabilities:
 * 1. Rich metadata extraction (Business Title, Description, Favicon, Social Links) via Metascraper.
 * 2. High-precision email discovery with regex + mailto scanning.
 * 3. 100% Genuine B2B Email Protection: Automatic validation against `disposable-email-domains`.
 * 4. Extraction of WhatsApp URLs and Nigerian phone numbers.
 */

import metascraperFactory from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperUrl from 'metascraper-url';
import disposableDomains from 'disposable-email-domains';
import * as cheerio from 'cheerio';
import axios from 'axios';

const disposableSet = new Set(disposableDomains);

const metascraper = metascraperFactory([
  metascraperTitle(),
  metascraperDescription(),
  metascraperUrl()
]);

export interface ExtractedContactMetadata {
  title: string;
  description: string;
  url: string;
  emails: string[];
  phones: string[];
  whatsappLinks: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export class StealthMetascraperExtractor {
  /**
   * Check if an email domain is temporary or disposable
   */
  isDisposableEmail(email: string): boolean {
    if (!email || !email.includes('@')) return true;
    const domain = email.split('@')[1].toLowerCase().trim();
    return disposableSet.has(domain);
  }

  /**
   * Validate if email is a genuine commercial business email
   */
  isGenuineCommercialEmail(email: string): boolean {
    if (!email || !email.includes('@')) return false;
    const clean = email.toLowerCase().trim();
    if (this.isDisposableEmail(clean)) return false;
    if (/example\.com|test\.com|domain\.com|sample\.com|placeholder|user@|name@|email@|your@/i.test(clean)) return false;
    if (/\.(png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot)$/i.test(clean)) return false;
    
    const [user, domain] = clean.split('@');
    if (!user || !domain) return false;
    if (user.length < 2 || domain.length < 4) return false;
    if (/sentry|webpack|polyfill|node_modules|cloudflare|bootstrap|myfavoritemurder/i.test(clean)) return false;

    // Strict validation of recognized commercial TLDs
    const validTld = /\.(com|org|net|co|ng|com\.ng|gov\.ng|edu\.ng|org\.ng|io|biz|info|africa|store|online|tech|ltd|me|pro|app|co\.uk)$/i;
    if (!validTld.test(domain)) return false;

    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts.length > 4) return false;

    return true;
  }

  /**
   * Extract contact information & rich metadata from raw HTML
   */
  async extractFromHtml(html: string, pageUrl: string): Promise<ExtractedContactMetadata> {
    const result: ExtractedContactMetadata = {
      title: '',
      description: '',
      url: pageUrl,
      emails: [],
      phones: [],
      whatsappLinks: [],
      socialLinks: {}
    };

    try {
      const metadata = await metascraper({ html, url: pageUrl });
      result.title = metadata.title || '';
      result.description = metadata.description || '';
      result.url = metadata.url || pageUrl;
    } catch (_) {}

    const $ = cheerio.load(html);
    const bodyText = $('body').text();

    // 1. Extract Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const inlineEmails = bodyText.match(emailRegex) || [];
    const mailtoEmails: string[] = [];
    $('a[href^="mailto:"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const match = href.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (match && match[1]) mailtoEmails.push(match[1]);
    });

    const allEmails = [...inlineEmails, ...mailtoEmails];
    for (const em of allEmails) {
      const clean = em.toLowerCase().trim();
      if (this.isGenuineCommercialEmail(clean) && !result.emails.includes(clean)) {
        result.emails.push(clean);
      }
    }

    // 2. Extract Nigerian Carrier Phone Numbers
    const phoneRegex = /(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g;
    const inlinePhones: string[] = (bodyText.match(phoneRegex) || []) as string[];
    $('a[href^="tel:"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const p = href.replace('tel:', '').trim();
      if (p) inlinePhones.push(p);
    });

    for (const ph of inlinePhones) {
      const cleanDigits = ph.replace(/\D/g, '');
      if (cleanDigits.length >= 10 && cleanDigits.length <= 14 && !result.phones.includes(cleanDigits)) {
        result.phones.push(cleanDigits);
      }
    }

    // 3. Extract WhatsApp Links
    $('a[href*="wa.me"], a[href*="whatsapp.com/send"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href && !result.whatsappLinks.includes(href)) {
        result.whatsappLinks.push(href);
      }
    });

    // 4. Extract Social Profile Links
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('instagram.com/') && !href.includes('/p/') && !result.socialLinks.instagram) {
        result.socialLinks.instagram = href;
      } else if (href.includes('facebook.com/') && !href.includes('/sharer') && !result.socialLinks.facebook) {
        result.socialLinks.facebook = href;
      } else if (href.includes('linkedin.com/company/') && !result.socialLinks.linkedin) {
        result.socialLinks.linkedin = href;
      } else if ((href.includes('twitter.com/') || href.includes('x.com/')) && !result.socialLinks.twitter) {
        result.socialLinks.twitter = href;
      }
    });

    return result;
  }

  /**
   * Fetch and extract contact metadata from a live website URL
   */
  async extractFromUrl(targetUrl: string, timeoutMs = 6000): Promise<ExtractedContactMetadata | null> {
    try {
      const resp = await axios.get(targetUrl, {
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        maxRedirects: 3,
        validateStatus: s => s < 400
      });

      const html = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
      return await this.extractFromHtml(html, targetUrl);
    } catch (_) {
      return null;
    }
  }
}

export const stealthMetascraperExtractor = new StealthMetascraperExtractor();
