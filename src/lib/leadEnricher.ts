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

export function verifyEmailAddress(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return false;

  const DISPOSABLE_DOMAINS = new Set([
    'mailinator.com', 'tempmail.com', '10minutemail.com', 'yopmail.com', 'sharklasers.com',
    'guerrillamail.com', 'dispostable.com', 'getairmail.com', 'burnermail.io', 'burnermail.net',
    'temp-mail.org', 'tempmailo.com', '10minutemail.co.za', 'throwawaymail.com', 'maildrop.cc'
  ]);
  
  const domain = clean.split('@')[1] || '';
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  const localPart = clean.split('@')[0] || '';
  if (['test', 'na', 'none', 'unknown', 'info', 'example', 'noreply', 'no-reply'].includes(localPart) && 
      ['example.com', 'test.com', 'none.com', 'domain.com'].includes(domain)) {
    return false;
  }
  
  if (domain === 'example.com' || domain === 'test.com' || domain === 'none.com' || domain === 'yoursite.com' || domain === 'wixpress.com' || domain === 'squarespace.com' || domain === 'emailprotected') {
    return false;
  }

  return true;
}

/**
 * Extract all emails found in a raw text string.
 * Filters out obvious false-positives and unverified emails.
 */
export function extractEmailsFromText(text: string): string[] {
  if (!text) return [];
  const matches = text.match(EMAIL_REGEX) || [];
  const seen = new Set<string>();
  return matches
    .map(e => e.toLowerCase().trim())
    .filter(e => {
      if (seen.has(e)) return false;
      if (!verifyEmailAddress(e)) return false;
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
 * Extract social media links from HTML content using Cheerio.
 */
function extractSocialLinksFromHtml(html: string): Record<string, string> {
  try {
    const $ = cheerio.load(html);
    const socials: Record<string, string> = {};
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim() || '';
      if (!href) return;
      const hrefLower = href.toLowerCase();
      if (hrefLower.includes('facebook.com/') && !socials.facebook) {
        socials.facebook = href;
      } else if (hrefLower.includes('instagram.com/') && !socials.instagram) {
        socials.instagram = href;
      } else if ((hrefLower.includes('linkedin.com/in/') || hrefLower.includes('linkedin.com/company/')) && !socials.linkedin) {
        socials.linkedin = href;
      } else if (hrefLower.includes('tiktok.com/') && !socials.tiktok) {
        socials.tiktok = href;
      } else if ((hrefLower.includes('twitter.com/') || hrefLower.includes('x.com/')) && !socials.twitter) {
        socials.twitter = href;
      } else if (hrefLower.includes('youtube.com/') && !socials.youtube) {
        socials.youtube = href;
      }
    });
    return socials;
  } catch (_) {
    return {};
  }
}

/**
 * Extract email and phone contacts from raw HTML content.
 */
function extractContactsFromHtml(html: string): { phone: string | null; email: string | null } {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  const bodyText = $('body').text();

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
}

/**
 * Fetch a business website and extract phone numbers, email addresses, and social links
 * from both the homepage and up to 2 contact/about subpages concurrently.
 */
export async function enrichFromWebsite(url: string): Promise<{
  phone: string | null;
  email: string | null;
  socials?: Record<string, string>;
}> {
  if (!url || !url.startsWith('http')) return { phone: null, email: null, socials: {} };

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

    if (!resp.ok) return { phone: null, email: null, socials: {} };

    const html = await resp.text();
    const homepageContacts = extractContactsFromHtml(html);
    const socials = extractSocialLinksFromHtml(html);

    let phone = homepageContacts.phone;
    let email = homepageContacts.email;

    // If still missing phone or email, scan for contact/about subpages on the same domain
    if (!phone || !email) {
      try {
        const $ = cheerio.load(html);
        const baseUrl = new URL(url);
        const subpageLinks: string[] = [];

        $('a[href]').each((_, el) => {
          const href = $(el).attr('href')?.trim() || '';
          if (!href) return;

          try {
            const absoluteUrl = new URL(href, url);
            if (absoluteUrl.hostname === baseUrl.hostname) {
              const pathLower = absoluteUrl.pathname.toLowerCase();
              if (
                pathLower.includes('contact') ||
                pathLower.includes('about') ||
                pathLower.includes('info')
              ) {
                if (!subpageLinks.includes(absoluteUrl.href)) {
                  subpageLinks.push(absoluteUrl.href);
                }
              }
            }
          } catch (_) {}
        });

        // Crawl up to 2 unique contact subpages in parallel
        const targetSubpages = subpageLinks.slice(0, 2);
        if (targetSubpages.length > 0) {
          const subpagePromises = targetSubpages.map(async (subUrl) => {
            try {
              const subController = new AbortController();
              const subTimeout = setTimeout(() => subController.abort(), 4000);

              const subResp = await fetch(subUrl, {
                headers: {
                  'User-Agent': WEB_USER_AGENT,
                  Accept: 'text/html',
                },
                signal: subController.signal,
              });
              clearTimeout(subTimeout);

              if (subResp.ok) {
                const subHtml = await subResp.text();
                return extractContactsFromHtml(subHtml);
              }
            } catch (_) {}
            return { phone: null, email: null };
          });

          const subResults = await Promise.all(subpagePromises);
          for (const res of subResults) {
            if (!phone && res.phone) phone = res.phone;
            if (!email && res.email) email = res.email;
          }
        }
      } catch (err) {
        console.error('[leadEnricher] subpage crawler error:', err);
      }
    }

    return { phone, email, socials };
  } catch (_) {
    return { phone: null, email: null, socials: {} };
  }
}

/**
 * Uses Gemini API to validate and score a scraped lead's relevance.
 * Returns score, reason, and isRelevant status.
 */
export async function validateLeadWithAI(lead: any, apiKey: string): Promise<{
  score: number;
  reason: string;
  isRelevant: boolean;
}> {
  try {
    const prompt = `You are an expert sales growth assistant. Evaluate the following business lead scraped from Google Maps / Jiji to see if it is a high-quality candidate for web design or marketing outreach.

Lead Details:
- Name: ${lead.name}
- Category/Industry: ${lead.category}
- Address/Location: ${lead.address || ''}
- Website: ${lead.website || 'None'}
- Google Rating: ${lead.rating || 0} (${lead.reviewsCount || 0} reviews)

Evaluate:
1. Relevance: Is this an active commercial entity or business that benefits from sales/marketing or has budget? (Score 0-5)
2. Website Need: If they have no website, or a poor/non-functional one, they need a website. If they already have a highly functional modern website, the need is lower. (Score 0-5)

Output ONLY a JSON response in the following format:
{
  "score": [Total score out of 10],
  "reason": "[1 sentence explaining the score]"
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!resp.ok) {
      throw new Error(`Gemini validation call failed: ${resp.statusText}`);
    }

    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const score = Number(parsed.score) || 0;
      return {
        score,
        reason: parsed.reason || '',
        isRelevant: score >= 5
      };
    }
  } catch (err: any) {
    console.error('AI validation check error:', err.message);
  }
  return { score: 10, reason: 'AI validation check bypassed or failed', isRelevant: true };
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
  business_hours?: string;
  reviews_data?: string;
  photos_data?: string;
  social_links?: string;
  services_data?: string;
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

      // Scrape business hours
      let businessHours = '';
      const hoursEl = document.querySelector('div[data-item-id="oh"]') || document.querySelector('[aria-label*="Hours"]');
      if (hoursEl) {
        const rows = Array.from(hoursEl.querySelectorAll('table tr, div.y07Omb'));
        if (rows.length > 0) {
          businessHours = JSON.stringify(rows.map(r => r.textContent?.trim() || ''));
        } else {
          businessHours = JSON.stringify([hoursEl.textContent?.trim() || '']);
        }
      }

      // Scrape reviews
      let reviewsData = '';
      const reviewEls = Array.from(document.querySelectorAll('div.jftiCc, div.DUwDvf, [aria-label*="Review by"]'));
      if (reviewEls.length > 0) {
        const reviews = reviewEls.slice(0, 5).map(el => {
          const authorEl = el.querySelector('.X5nM1, .d1z7Ge, .fontTitleSmall');
          const textEl = el.querySelector('.wiw7ub, .My5gCc, .fontBodyMedium');
          const ratingEl = el.querySelector('span.kvZ3te');
          return {
            author_name: authorEl ? authorEl.textContent?.trim() || 'Anonymous' : 'Anonymous',
            rating: ratingEl ? parseFloat(ratingEl.textContent || '5') : 5,
            text: textEl ? textEl.textContent?.trim() || '' : ''
          };
        }).filter(r => r.text);
        reviewsData = JSON.stringify(reviews);
      }

      // Scrape photos
      let photosData = '';
      const photoImages = Array.from(document.querySelectorAll('img'))
        .map(img => img.getAttribute('src') || '')
        .filter(src => src.includes('googleusercontent.com/p/'))
        .slice(0, 5);
      if (photoImages.length > 0) {
        photosData = JSON.stringify(photoImages);
      }

      // Scrape services / types
      let servicesData = '';
      const typeEls = Array.from(document.querySelectorAll('.DkEaL, button[jsaction*="category"]'));
      if (typeEls.length > 0) {
        const services = typeEls.map(el => el.textContent?.trim() || '').filter(Boolean);
        servicesData = JSON.stringify(services);
      }

      return {
        name,
        address,
        website,
        category,
        rating,
        reviewsCount,
        emailFromAttr,
        emailFromText,
        businessHours,
        reviewsData,
        photosData,
        servicesData
      };
    });

    if (!fields.name) return null;

    // Resolve email: attribute > textContent > website enrichment
    let email =
      fields.emailFromAttr?.includes('@') ? fields.emailFromAttr :
      fields.emailFromText?.includes('@') ? fields.emailFromText : '';

    // If no email yet and website found, fetch website for email + better phone
    let websiteEnrichedPhone: string | null = null;
    let socialLinks = '';
    if (fields.website) {
      const enriched = await enrichFromWebsite(fields.website);
      if (!email && enriched.email) email = enriched.email;
      if (!rawPhone && enriched.phone) websiteEnrichedPhone = enriched.phone;
      if (enriched.socials) {
        socialLinks = JSON.stringify(enriched.socials);
      }
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
      business_hours: fields.businessHours,
      reviews_data: fields.reviewsData,
      photos_data: fields.photosData,
      services_data: fields.servicesData,
      social_links: socialLinks
    };
  } catch (err) {
    console.error('[leadEnricher] extractMapsLeadData error:', err);
    return null;
  }
}
