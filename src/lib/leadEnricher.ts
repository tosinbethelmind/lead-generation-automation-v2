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
import { detectCMS, resolveUpgradeStrategy } from './websiteAnalysis';

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

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

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
 * Helper to scan subpages (contact/about) on the website for contacts.
 */
async function scanSubpagesForContacts(html: string, baseUrlStr: string): Promise<{ phone: string | null; email: string | null }> {
  let phone: string | null = null;
  let email: string | null = null;
  try {
    const $ = cheerio.load(html);
    const baseUrl = new URL(baseUrlStr);
    const subpageLinks: string[] = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim() || '';
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, baseUrlStr);
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
  return { phone, email };
}

/**
 * Fetch a business website and extract phone numbers, email addresses, and social links
 * from both the homepage and up to 2 contact/about subpages. Supports Puppeteer browser fallback.
 */
export async function enrichFromWebsite(url: string, browser?: any): Promise<{
  phone: string | null;
  email: string | null;
  socials?: Record<string, string>;
  cmsPlatform?: string;
  upgradeStrategy?: string;
  cmsConfidence?: string;
  pluginSuggestions?: string[];
  embedNote?: string;
}> {
  if (!url || !url.startsWith('http')) return { phone: null, email: null, socials: {} };

  let phone: string | null = null;
  let email: string | null = null;
  let socials: Record<string, string> = {};
  
  let cmsPlatform = 'custom';
  let upgradeStrategy = 'script_embed';
  let cmsConfidence = 'low';
  let pluginSuggestions: string[] = [];
  let embedNote = '';

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

    if (resp.ok) {
      const html = await resp.text();
      const homepageContacts = extractContactsFromHtml(html);
      socials = extractSocialLinksFromHtml(html);
      phone = homepageContacts.phone;
      email = homepageContacts.email;

      // CMS detection
      const headersMap: Record<string, string> = {};
      resp.headers.forEach((val, key) => { headersMap[key] = val; });
      const cmsResult = detectCMS(html, headersMap, url);
      cmsPlatform = cmsResult.cms;
      cmsConfidence = cmsResult.confidence;
      
      const strategyResult = resolveUpgradeStrategy(cmsResult.cms);
      upgradeStrategy = strategyResult.upgradeStrategy;
      pluginSuggestions = strategyResult.pluginSuggestions;
      embedNote = strategyResult.embedNote;

      if (!phone || !email) {
        const subpageContacts = await scanSubpagesForContacts(html, url);
        if (!phone && subpageContacts.phone) phone = subpageContacts.phone;
        if (!email && subpageContacts.email) email = subpageContacts.email;
      }
    }
  } catch (e: any) {
    console.warn(`[leadEnricher] Direct fetch failed for ${url}: ${e.message}. Trying Puppeteer fallback...`);
  }

  // Puppeteer Browser fallback if available and standard fetch did not retrieve full details
  if (browser) {
    let page: any = null;
    try {
      page = await browser.newPage();
      await page.setUserAgent(WEB_USER_AGENT);
      await page.setViewport({ width: 1280, height: 800 });
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      const html = await page.content();
      const homepageContacts = extractContactsFromHtml(html);
      const pageSocials = extractSocialLinksFromHtml(html);
      
      if (!phone && homepageContacts.phone) phone = homepageContacts.phone;
      if (!email && homepageContacts.email) email = homepageContacts.email;
      socials = { ...socials, ...pageSocials };

      // Redo CMS detection if we were not able to get it or default Custom
      if (cmsPlatform === 'custom') {
        const cmsResult = detectCMS(html, {}, url);
        cmsPlatform = cmsResult.cms;
        cmsConfidence = cmsResult.confidence;
        
        const strategyResult = resolveUpgradeStrategy(cmsResult.cms);
        upgradeStrategy = strategyResult.upgradeStrategy;
        pluginSuggestions = strategyResult.pluginSuggestions;
        embedNote = strategyResult.embedNote;
      }

      if (!phone || !email) {
        const subpageUrl = await page.evaluate((currentUrl: string) => {
          const links = Array.from(document.querySelectorAll('a[href]'));
          const currentDomain = new URL(currentUrl).hostname;
          for (const link of links) {
            const href = (link as HTMLAnchorElement).href;
            try {
              const u = new URL(href, currentUrl);
              if (u.hostname === currentDomain) {
                const pathLower = u.pathname.toLowerCase();
                if (pathLower.includes('contact') || pathLower.includes('about') || pathLower.includes('info')) {
                  return u.href;
                }
              }
            } catch (_) {}
          }
          return null;
        }, url);

        if (subpageUrl) {
          await page.goto(subpageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
          await new Promise(r => setTimeout(r, 1500));
          const subHtml = await page.content();
          const subContacts = extractContactsFromHtml(subHtml);
          if (!phone && subContacts.phone) phone = subContacts.phone;
          if (!email && subContacts.email) email = subContacts.email;
        }
      }
    } catch (err: any) {
      console.warn(`[leadEnricher] Puppeteer website fallback failed for ${url}:`, err.message);
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  return { 
    phone, 
    email, 
    socials,
    cmsPlatform,
    upgradeStrategy,
    cmsConfidence,
    pluginSuggestions,
    embedNote
  };
}

/**
 * Perform a targeted DuckDuckGo HTML search for a business name and location,
 * then extract emails, phones, and social links from the search snippets.
 */
export async function enrichContactsViaSearch(name: string, city: string): Promise<{
  phone: string | null;
  email: string | null;
  socials: Record<string, string>;
}> {
  const result: { phone: string | null; email: string | null; socials: Record<string, string> } = {
    phone: null,
    email: null,
    socials: {}
  };

  try {
    const query = `"${name}" "${city}" contact email OR phone OR site`;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://duckduckgo.com/'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resp.ok) return result;

    const html = await resp.text();
    const $ = cheerio.load(html);
    const snippetsText: string[] = [];
    
    $('.web-result').each((_, elem) => {
      const titleNode = $(elem).find('.result__title a');
      const snippetNode = $(elem).find('.result__snippet');
      const href = titleNode.attr('href') || '';
      const snippet = snippetNode.text() || '';

      snippetsText.push(titleNode.text() + ' ' + snippet);

      let cleanUrl = href;
      if (href.includes('uddg=')) {
        try {
          const parts = href.split('uddg=');
          if (parts[1]) {
            cleanUrl = decodeURIComponent(parts[1].split('&')[0]);
          }
        } catch (_) {}
      }

      if (cleanUrl) {
        const urlLower = cleanUrl.toLowerCase();
        if (urlLower.includes('facebook.com/') && !result.socials.facebook) {
          result.socials.facebook = cleanUrl;
        } else if (urlLower.includes('instagram.com/') && !result.socials.instagram) {
          result.socials.instagram = cleanUrl;
        } else if ((urlLower.includes('linkedin.com/company/') || urlLower.includes('linkedin.com/in/')) && !result.socials.linkedin) {
          result.socials.linkedin = cleanUrl;
        } else if ((urlLower.includes('twitter.com/') || urlLower.includes('x.com/')) && !result.socials.twitter) {
          result.socials.twitter = cleanUrl;
        }
      }
    });

    const combinedText = snippetsText.join(' \n ');
    const phones = extractPhonesFromText(combinedText);
    const emails = extractEmailsFromText(combinedText);

    if (phones.length > 0) result.phone = normalizePhone(phones[0], 'NG');
    if (emails.length > 0) result.email = emails[0];

    return result;
  } catch (err: any) {
    console.error(`[enrichContactsViaSearch] search failed for ${name}:`, err.message);
    return result;
  }
}

/**
 * Super-charged lead enrichment function that runs homepage fetch -> subpage fetch -> Puppeteer fallback -> search fallback.
 */
export async function enrichLeadContacts(
  lead: any,
  browser?: any
): Promise<{
  phone: string | null;
  email: string | null;
  socials: Record<string, string>;
  enriched: boolean;
  cmsPlatform?: string;
  upgradeStrategy?: string;
  cmsConfidence?: string;
  pluginSuggestions?: string[];
  embedNote?: string;
}> {
  let currentPhone = lead.phone_e164 || lead.phone_raw || null;
  let currentEmail = lead.email || null;
  let currentSocials: Record<string, string> = {};
  
  if (lead.social_links) {
    try {
      currentSocials = JSON.parse(lead.social_links);
    } catch (_) {}
  }

  let enriched = false;
  let cmsPlatform = '';
  let upgradeStrategy = '';
  let cmsConfidence = '';
  let pluginSuggestions: string[] = [];
  let embedNote = '';

  // Stage 1: Website enrichment (if website exists)
  if (lead.website) {
    try {
      const result = await enrichFromWebsite(lead.website, browser);
      if (result.email && !currentEmail) {
        currentEmail = result.email;
        enriched = true;
      }
      if (result.phone && !currentPhone) {
        currentPhone = result.phone;
        enriched = true;
      }
      if (result.socials && Object.keys(result.socials).length > 0) {
        currentSocials = { ...currentSocials, ...result.socials };
        enriched = true;
      }

      cmsPlatform = result.cmsPlatform || 'custom';
      upgradeStrategy = result.upgradeStrategy || 'script_embed';
      cmsConfidence = result.cmsConfidence || 'low';
      pluginSuggestions = result.pluginSuggestions || [];
      embedNote = result.embedNote || '';

      // Mutate passed-in lead object to propagate website intelligence fields automatically
      lead.cms_platform = cmsPlatform;
      lead.upgrade_strategy = upgradeStrategy;
      lead.cms_confidence = cmsConfidence;
      lead.plugin_suggestions = JSON.stringify(pluginSuggestions);
      lead.embed_note = embedNote;

      lead.cmsPlatform = cmsPlatform;
      lead.upgradeStrategy = upgradeStrategy;
      lead.cmsConfidence = cmsConfidence;
      lead.pluginSuggestions = pluginSuggestions;
      lead.embedNote = embedNote;

    } catch (e: any) {
      console.warn(`[enrichLeadContacts] website enrichment failed for ${lead.website}:`, e.message);
    }
  } else {
    lead.cms_platform = '';
    lead.upgrade_strategy = '';
    lead.cms_confidence = '';
    lead.plugin_suggestions = '[]';
    lead.embed_note = '';
  }

  // Stage 2: DuckDuckGo search fallback (if still missing email OR phone)
  if (!currentEmail || !currentPhone) {
    try {
      const searchResult = await enrichContactsViaSearch(lead.name || '', lead.city || 'Lagos');
      if (searchResult.email && !currentEmail) {
        currentEmail = searchResult.email;
        enriched = true;
      }
      if (searchResult.phone && !currentPhone) {
        currentPhone = searchResult.phone;
        enriched = true;
      }
      if (searchResult.socials && Object.keys(searchResult.socials).length > 0) {
        currentSocials = { ...currentSocials, ...searchResult.socials };
        enriched = true;
      }
    } catch (e: any) {
      console.warn(`[enrichLeadContacts] search-based enrichment failed for ${lead.name}:`, e.message);
    }
  }

  return {
    phone: currentPhone,
    email: currentEmail,
    socials: currentSocials,
    enriched,
    cmsPlatform,
    upgradeStrategy,
    cmsConfidence,
    pluginSuggestions,
    embedNote
  };
}

/**
 * Uses Gemini API to validate and score a scraped lead's relevance.
 * Returns score, reason, isRelevant status, and a pitchAngle label for the best upgrade to pitch.
 */
export async function validateLeadWithAI(lead: any, apiKey: string): Promise<{
  score: number;
  reason: string;
  isRelevant: boolean;
  pitchAngle: string;
}> {
  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website !== 'None');
  try {
    const prompt = `You are an expert B2B sales strategist for a web & automation agency. Evaluate this business lead and determine the best upgrade to pitch them.

Lead Details:
- Name: ${lead.name}
- Category/Industry: ${lead.category}
- Address/Location: ${lead.address || ''}
- Website: ${lead.website || 'None'}
- Google Rating: ${lead.rating || 0} (${lead.reviewsCount || 0} reviews)

Evaluate and Score:
1. Relevance: Is this an active commercial entity or business that benefits from digital services? (Score 0-5)
2. Upgrade Potential:
   - If they have NO website: They urgently need a new website. This is a warm lead. (Rate 3-5 points)
   - If they already HAVE a website: They are HIGH-VALUE — they understand digital and are excellent candidates for advanced upgrades like custom CRM integrations, AI chatbots, online booking engines, WhatsApp automation, Paystack/Flutterwave payment integration, loyalty programs, and automated invoicing. (MUST rate 4-5 points)

For the pitchAngle field, choose EXACTLY ONE of these labels based on their industry and whether they have a website:
- If NO website: "New Website Design"
- If has website + medical/clinic/salon/spa: "Online Booking & Intake"
- If has website + restaurant/food/cafe: "Table Reservation System"
- If has website + auto/car/dealer/logistics: "Trade-In Estimator & CRM"
- If has website + retail/shop/fashion/boutique: "Paystack Checkout & E-Commerce"
- If has website + legal/consulting/finance: "Client Portal & Invoicing"
- If has website + any other business: "CRM Integration & WhatsApp Automation"

Output ONLY a JSON response:
{
  "score": [Total score out of 10],
  "reason": "[1 sentence: why this score and what specific feature upgrade they need]",
  "pitchAngle": "[EXACTLY one label from the list above]"
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 256,
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
      const defaultPitch = hasWebsite ? 'CRM Integration & WhatsApp Automation' : 'New Website Design';
      return {
        score,
        reason: parsed.reason || '',
        isRelevant: score >= 5,
        pitchAngle: parsed.pitchAngle || defaultPitch
      };
    }
  } catch (err: any) {
    console.error('AI validation check error:', err.message);
  }
  const defaultPitch = hasWebsite ? 'CRM Integration & WhatsApp Automation' : 'New Website Design';
  return { score: 10, reason: 'AI validation check bypassed or failed', isRelevant: true, pitchAngle: defaultPitch };
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
 * @param skipEnrichment - If true, skips slow website HTTP enrichment (use in hot scraping paths)
 */
export async function extractMapsLeadData(page: any, query: string, skipEnrichment = false): Promise<{
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
    // Skip this slow HTTP call when skipEnrichment=true (e.g. Maps-Free hot path)
    let websiteEnrichedPhone: string | null = null;
    let socialLinks = '';
    if (fields.website && !skipEnrichment) {
      try {
        const enriched = await enrichFromWebsite(fields.website);
        if (!email && enriched.email) email = enriched.email;
        if (!rawPhone && enriched.phone) websiteEnrichedPhone = enriched.phone;
        if (enriched.socials) {
          socialLinks = JSON.stringify(enriched.socials);
        }
      } catch (_) {
        // Enrichment is best-effort; don't fail the whole scrape
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
