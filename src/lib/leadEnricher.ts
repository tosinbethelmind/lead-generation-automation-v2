/**
 * @file leadEnricher.ts
 * Shared utilities for extracting contact details across ALL scrapers.
 *
 * Three tiers:
 *  1. extractFromText()     — fast regex over any plain text / HTML snippet
 *  2. enrichFromWebsite()   — fetch the business website, parse emails & phones
 *  3. extractMapsPhone()    — Puppeteer: read data-item-id attr, click reveal, textContent fallback
 */

import * as cheerio from 'cheerio';
import { normalizePhone, extractPhonesFromText } from './googleSheets';

// ---------------------------------------------------------------------------
// Tier 1 — Regex extraction from text / HTML snippets (no HTTP, instant)
// ---------------------------------------------------------------------------

/** Nigerian email regex — matches common patterns in snippets */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

/**
 * Extract all emails found in a raw text string.
 * Filters out obvious false-positives like example.com, sentry.io, etc.
 */
export function extractEmailsFromText(text: string): string[] {
  if (!text) return [];
  const IGNORE_DOMAINS = new Set([
    'example.com', 'example.org', 'test.com', 'sentry.io',
    'wixpress.com', 'squarespace.com', 'emailprotected',
    'yoursite.com', 'domain.com',
  ]);
  const matches = text.match(EMAIL_REGEX) || [];
  const seen = new Set<string>();
  return matches
    .map(e => e.toLowerCase().trim())
    .filter(e => {
      if (seen.has(e)) return false;
      const domain = e.split('@')[1] || '';
      if (IGNORE_DOMAINS.has(domain)) return false;
      seen.add(e);
      return true;
    });
}

/**
 * Extract phones AND emails from a combined text string.
 * Returns the best phone (first valid NG) and best email (first found).
 */
export function extractContactsFromText(text: string): {
  phone: string | null;
  email: string | null;
} {
  const phones = extractPhonesFromText(text);
  const emails = extractEmailsFromText(text);
  return {
    phone: phones[0] || null,
    email: emails[0] || null,
  };
}

// ---------------------------------------------------------------------------
// Tier 2 — Website enrichment: fetch the business website and parse contacts
// ---------------------------------------------------------------------------

const WEB_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/**
 * Fetch a business website and extract phone numbers and email addresses
 * from the page HTML. Enforces a 6-second timeout and returns nulls on failure.
 */
export async function enrichFromWebsite(url: string): Promise<{
  phone: string | null;
  email: string | null;
}> {
  if (!url || !url.startsWith('http')) return { phone: null, email: null };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(url, {
      headers: {
        'User-Agent': WEB_USER_AGENT,
        Accept: 'text/html',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) return { phone: null, email: null };

    const html = await resp.text();
    const $ = cheerio.load(html);

    // Strip scripts and styles — they inflate false-positive matches
    $('script, style, noscript').remove();
    const bodyText = $('body').text();

    // Also scan href="tel:..." and href="mailto:..." links — most reliable
    let telPhone: string | null = null;
    let mailtoEmail: string | null = null;

    $('a[href^="tel:"]').each((_, el) => {
      if (!telPhone) {
        const raw = $(el).attr('href')?.replace('tel:', '').trim() || '';
        telPhone = normalizePhone(raw, 'NG');
      }
    });

    $('a[href^="mailto:"]').each((_, el) => {
      if (!mailtoEmail) {
        const raw = $(el).attr('href')?.replace('mailto:', '').split('?')[0].trim() || '';
        if (raw.includes('@')) mailtoEmail = raw.toLowerCase();
      }
    });

    const { phone: textPhone, email: textEmail } = extractContactsFromText(bodyText);

    return {
      phone: telPhone || textPhone || null,
      email: mailtoEmail || textEmail || null,
    };
  } catch (_) {
    return { phone: null, email: null };
  }
}

// ---------------------------------------------------------------------------
// Tier 3 — Puppeteer Google Maps phone extraction (3 strategies)
// ---------------------------------------------------------------------------

/**
 * Extract phone number from a Google Maps detail page using three strategies:
 *
 * 1. data-item-id attribute  — `button[data-item-id="phone:tel:+234..."]`
 *    Always present even before clicking. Most reliable.
 *
 * 2. Click to reveal         — click the phone button, wait 1.2s, scan sibling spans
 *    For numbers hidden behind a UI interaction.
 *
 * 3. textContent fallback    — read whatever text is inside the button element.
 *
 * Returns { rawPhone, strategy } where strategy is 'attr' | 'click' | 'text' | 'none'.
 */
export async function extractMapsPhone(page: any): Promise<{
  rawPhone: string;
  strategy: 'attr' | 'click' | 'text' | 'none';
}> {
  // Strategy 1: attribute
  const fromAttr: string = await page.evaluate(() => {
    const btn = document.querySelector('button[data-item-id^="phone:tel:"]');
    if (!btn) return '';
    const id = (btn as HTMLElement).getAttribute('data-item-id') || '';
    return id.replace('phone:tel:', '').trim();
  });
  if (fromAttr) return { rawPhone: fromAttr, strategy: 'attr' };

  // Strategy 2: click-to-reveal
  try {
    const btn = await page.$('button[data-item-id^="phone:tel:"]');
    if (btn) {
      await btn.click();
      await new Promise(r => setTimeout(r, 1200));
      const fromClick: string = await page.evaluate(() => {
        const b = document.querySelector('button[data-item-id^="phone:tel:"]');
        if (!b) return '';
        const parent = b.closest('[data-section-id]') || b.parentElement;
        if (parent) {
          for (const s of Array.from((parent as HTMLElement).querySelectorAll('span'))) {
            const t = (s as HTMLElement).textContent?.trim() || '';
            if (/^[\+0][\d\s\-\.]{6,}/.test(t)) return t;
          }
        }
        return (b as HTMLElement).textContent?.trim() || '';
      });
      if (fromClick && /\d{6,}/.test(fromClick)) {
        return { rawPhone: fromClick, strategy: 'click' };
      }
    }
  } catch (_) {
    // Click failed — fall through
  }

  // Strategy 3: textContent fallback
  const fromText: string = await page.evaluate(() => {
    const btn = document.querySelector('button[data-item-id^="phone:tel:"]');
    return btn ? (btn as HTMLElement).textContent?.trim() || '' : '';
  });
  if (fromText) return { rawPhone: fromText, strategy: 'text' };

  return { rawPhone: '', strategy: 'none' };
}

/**
 * Extract ALL available contact data from a Google Maps detail page.
 * Returns name, address, phone, email, website, rating, reviewsCount, category.
 * If website is found, also attempts website enrichment for additional contacts.
 */
export async function extractMapsLeadData(page: any, query: string): Promise<{
  name: string;
  address: string;
  rawPhone: string;
  phoneStrategy: string;
  email: string;
  website: string;
  rating: number;
  reviewsCount: number;
  category: string;
} | null> {
  try {
    // Get phone via 3-strategy method
    const { rawPhone, strategy: phoneStrategy } = await extractMapsPhone(page);

    // Scrape all other fields in one evaluate
    const fields = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const name = h1 ? (h1 as HTMLElement).textContent?.trim() || '' : '';

      const addressBtn = document.querySelector('button[data-item-id="address"]');
      const address = addressBtn ? (addressBtn as HTMLElement).textContent?.trim() || '' : '';

      const webBtn = document.querySelector('a[data-item-id="authority"]');
      const website = webBtn ? (webBtn as HTMLElement).getAttribute('href')?.trim() || '' : '';

      const catEl = document.querySelector('button[jsaction*="category"]') ||
                    document.querySelector('span.DkEaL');
      const category = catEl ? (catEl as HTMLElement).textContent?.trim() || '' : '';

      let rating = 0;
      const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]');
      if (ratingEl) {
        const v = parseFloat((ratingEl as HTMLElement).textContent?.trim() || '0');
        if (!isNaN(v)) rating = v;
      }

      let reviewsCount = 0;
      const reviewsEl = document.querySelector('div.F7nice span[aria-label*="reviews"]');
      if (reviewsEl) {
        const cleaned = (reviewsEl as HTMLElement).textContent?.replace(/\D/g, '') || '';
        if (cleaned) reviewsCount = parseInt(cleaned, 10);
      }

      // Email — Google Maps sometimes shows it in the info section
      const emailBtn = document.querySelector('a[data-item-id^="email:"]');
      const emailFromAttr = emailBtn
        ? ((emailBtn as HTMLElement).getAttribute('data-item-id') || '').replace('email:', '').trim()
        : '';
      const emailFromText = emailBtn ? (emailBtn as HTMLElement).textContent?.trim() || '' : '';

      return { name, address, website, category, rating, reviewsCount, emailFromAttr, emailFromText };
    });

    if (!fields.name) return null;

    // Resolve email: attribute > textContent > website enrichment
    let email =
      fields.emailFromAttr?.includes('@') ? fields.emailFromAttr :
      fields.emailFromText?.includes('@') ? fields.emailFromText : '';

    // If no email yet and website found, fetch website for email + better phone
    let websiteEnrichedPhone: string | null = null;
    if (fields.website && (!email || !rawPhone)) {
      const enriched = await enrichFromWebsite(fields.website);
      if (!email && enriched.email) email = enriched.email;
      if (!rawPhone && enriched.phone) websiteEnrichedPhone = enriched.phone;
    }

    return {
      name: fields.name,
      address: fields.address,
      rawPhone: rawPhone || websiteEnrichedPhone || '',
      phoneStrategy: websiteEnrichedPhone && !rawPhone ? 'website' : phoneStrategy,
      email,
      website: fields.website,
      rating: fields.rating,
      reviewsCount: fields.reviewsCount,
      category: fields.category,
    };
  } catch (err) {
    console.error('[leadEnricher] extractMapsLeadData error:', err);
    return null;
  }
}
