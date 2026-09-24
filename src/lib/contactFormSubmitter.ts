/**
 * @file contactFormSubmitter.ts
 * High-Speed & Resilient Automated Contact Form Submitter
 * 
 * Features:
 * 1. Fast HTTP / DNS Preflight check (<= 7s) to handle Nigerian hosting TTFB with automatic protocol failover.
 * 2. URL Sanitization: Strips concatenated URLs, commas, spaces, and normalizes endpoints.
 * 3. Parallel Cheerio Discovery for contact subpages (/contact, /contact-us, /get-in-touch, /about).
 * 4. Smart Form Field Mapping (Standard HTML, WordPress CF7/WPForms/Elementor, Gravity Forms).
 * 5. Lightweight Direct Fetch POST with AJAX nonce & hidden input preservation.
 * 6. ZERO-FAILURE CASCADE: If form is protected by reCAPTCHA, Cloudflare 403, or lacks form elements,
 *    it extracts discovered emails (or verified lead.email) and delivers proposal directly via Multi-SMTP Pooler!
 * 7. Reusable Pooled Puppeteer fallback for dynamic JS forms.
 */

import dns from 'dns';
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

import * as cheerio from 'cheerio';
import http from 'http';
import https from 'https';
import axios from 'axios';
import { getLocalChromePath } from './browserLauncher';
import { multiSmtpPooler } from './email/multiSmtpPooler';

export interface SubmissionResult {
  success: boolean;
  notes: string;
  methodUsed: 'fetch' | 'browser' | 'smtp_pool_cascade' | 'none';
}

export interface WebformLeadTarget {
  lead_id?: string;
  name?: string;
  business_name?: string;
  category?: string;
  website?: string;
  phone?: string;
  email?: string;
  area?: string;
}

const COMMON_CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/contactus',
  '/get-in-touch',
  '/about-us',
  '/about'
];

const EXCLUDED_AGGREGATORS = /jiji\.ng|finelib\.com|businesslist\.com\.ng|vconnect\.com|bing\.com|google\.com|facebook\.com|instagram\.com|twitter\.com|x\.com|tiktok\.com|youtube\.com|linkedin\.com|wa\.me|t\.me|tariffnumber\.com|jaspector\.com|houzz\.com|taplink\.ws|linktr\.ee|carrd\.co|bio\.link|beacons\.ai|wa\.link|solo\.to|heylink\.me/i;

const keepAliveHttpAgent = new http.Agent({ keepAlive: true, maxSockets: 25 });
const keepAliveHttpsAgent = new https.Agent({ keepAlive: true, maxSockets: 25, rejectUnauthorized: false });

const fastHttpClient = axios.create({
  httpAgent: keepAliveHttpAgent,
  httpsAgent: keepAliveHttpsAgent,
  timeout: 7000,
  maxRedirects: 5,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
});

// Singleton Browser Pool with Mutex & Task Counter
let sharedBrowserInstance: any = null;
let browserLaunchPromise: Promise<any> | null = null;
let activeBrowserTasks = 0;
let browserIdleTimer: NodeJS.Timeout | null = null;

async function getSharedBrowser() {
  if (browserIdleTimer) {
    clearTimeout(browserIdleTimer);
    browserIdleTimer = null;
  }

  if (sharedBrowserInstance && (sharedBrowserInstance.connected === true || sharedBrowserInstance.process?.())) {
    return sharedBrowserInstance;
  }

  if (browserLaunchPromise) {
    return browserLaunchPromise;
  }

  browserLaunchPromise = (async () => {
    try {
      const puppeteerExtra = (await import('puppeteer-extra')).default;
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      puppeteerExtra.use(StealthPlugin());

      const localPath = getLocalChromePath();
      const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync'
      ];

      sharedBrowserInstance = await (puppeteerExtra as any).launch({
        executablePath: localPath || undefined,
        headless: true,
        args
      });
      return sharedBrowserInstance;
    } finally {
      browserLaunchPromise = null;
    }
  })();

  return browserLaunchPromise;
}

function releaseBrowserTask() {
  activeBrowserTasks = Math.max(0, activeBrowserTasks - 1);
  if (activeBrowserTasks === 0) {
    if (browserIdleTimer) clearTimeout(browserIdleTimer);
    browserIdleTimer = setTimeout(async () => {
      if (activeBrowserTasks === 0 && sharedBrowserInstance) {
        try {
          await sharedBrowserInstance.close();
        } catch (_) {}
        sharedBrowserInstance = null;
      }
    }, 15000);
  }
}

/**
 * Strips concatenated URLs, commas, and trailing garbage.
 */
export function sanitizeWebsiteUrl(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let clean = raw.trim();
  if (clean.includes(',')) clean = clean.split(',')[0].trim();
  if (clean.includes(';')) clean = clean.split(';')[0].trim();
  if (clean.includes(' ')) clean = clean.split(' ')[0].trim();
  clean = clean.replace(/['"]+/g, '').replace(/\/+$/, '');
  return clean;
}

export function extractEmailsFromHtml(html: string): string[] {
  if (!html) return [];
  const matches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const excluded = /example\.com|test\.com|sentry|bootstrap|w3\.org|wp-content|placeholder|\.png|\.jpg|\.webp|schema\.org/i;
  return Array.from(new Set(matches.map(m => m.toLowerCase().trim()).filter(m => !excluded.test(m))));
}

/**
 * Fast Preflight Check with automatic HTTP/HTTPS failover & resilient 7s timeout.
 */
async function preflightDomainCheck(urlStr: string): Promise<{ ok: boolean; finalUrl: string; html?: string; discoveredEmails: string[] }> {
  let cleanUrl = sanitizeWebsiteUrl(urlStr);
  if (!cleanUrl) return { ok: false, finalUrl: urlStr, discoveredEmails: [] };
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  // 1. Try initial URL
  try {
    const resp = await fastHttpClient.get(cleanUrl, { timeout: 7000 });
    if (resp.status >= 200 && resp.status < 400) {
      const html = typeof resp.data === 'string' ? resp.data : '';
      return {
        ok: true,
        finalUrl: resp.request?.res?.responseUrl || cleanUrl,
        html,
        discoveredEmails: extractEmailsFromHtml(html)
      };
    }
  } catch (_) {}

  // 2. Automatic Protocol Failover: http -> https or https -> http
  const alternateUrl = cleanUrl.startsWith('http://')
    ? cleanUrl.replace('http://', 'https://')
    : cleanUrl.replace('https://', 'http://');

  try {
    const resp = await fastHttpClient.get(alternateUrl, { timeout: 7000 });
    if (resp.status >= 200 && resp.status < 400) {
      const html = typeof resp.data === 'string' ? resp.data : '';
      return {
        ok: true,
        finalUrl: resp.request?.res?.responseUrl || alternateUrl,
        html,
        discoveredEmails: extractEmailsFromHtml(html)
      };
    }
  } catch (_) {}

  return { ok: false, finalUrl: cleanUrl, discoveredEmails: [] };
}

/**
 * Discovers strictly ONE primary contact URL per website to eliminate multi-page spinning.
 */
function extractSingleContactLink(homepageHtml: string, baseUrlStr: string): string {
  let primaryTarget = '';
  try {
    const $ = cheerio.load(homepageHtml);
    const baseUrl = new URL(baseUrlStr);

    // 1. Check if homepage itself has an embedded contact form
    let homepageHasContactForm = false;
    $('form').each((_i: number, f: any) => {
      const $f = $(f);
      const hasTextarea = $f.find('textarea').length > 0 || $f.find('input[name*="message" i], input[name*="msg" i], input[name*="comment" i]').length > 0;
      const hasEmail = $f.find('input[type="email"], input[name*="email" i]').length > 0;
      const isSearch = $f.find('input[name="s"], input[name="q"], input[name="search" i]').length > 0;
      if (hasTextarea && hasEmail && !isSearch) {
        homepageHasContactForm = true;
        return false;
      }
    });

    if (homepageHasContactForm) {
      return baseUrlStr;
    }

    // 2. Find first explicit contact navigation link
    $('a[href]').each((_i: number, el: any) => {
      if (primaryTarget) return;
      const href = $(el).attr('href')?.trim() || '';
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      try {
        const absUrl = new URL(href, baseUrlStr);
        if (absUrl.hostname.replace(/^www\./, '') === baseUrl.hostname.replace(/^www\./, '')) {
          const pathLower = absUrl.pathname.toLowerCase();
          const matches = COMMON_CONTACT_PATHS.some(p => pathLower.includes(p));
          if (matches) {
            primaryTarget = absUrl.href;
          }
        }
      } catch (_) {}
    });
  } catch (_) {}

  if (primaryTarget) return primaryTarget;

  // 3. Fallback to single standard /contact path
  try {
    const origin = new URL(baseUrlStr).origin;
    return `${origin}/contact`;
  } catch (_) {
    return baseUrlStr;
  }
}

/**
 * High-speed form submission via Cheerio & Axios POST.
 */
async function tryFetchFormSubmit(
  contactUrl: string,
  pitch: { name: string; email: string; phone: string; message: string }
): Promise<{ success: boolean; is404OrDead: boolean; isDynamicPage: boolean; notes: string; discoveredEmails: string[] }> {
  try {
    const resp = await fastHttpClient.get(contactUrl, { timeout: 5000 });
    if (resp.status >= 400) {
      return { success: false, is404OrDead: true, isDynamicPage: false, notes: `HTTP ${resp.status}`, discoveredEmails: [] };
    }

    const html = typeof resp.data === 'string' ? resp.data : '';
    const emailsOnContactPage = extractEmailsFromHtml(html);

    if (!html) {
      return { success: false, is404OrDead: false, isDynamicPage: false, notes: 'Empty response', discoveredEmails: [] };
    }

    const $ = cheerio.load(html);
    let targetForm: any = null;

    // 1. Locate form with strict contact signature
    $('form').each((_i: number, f: any) => {
      const $f = $(f);
      const hasTextarea = $f.find('textarea').length > 0 || $f.find('input[name*="message" i], input[name*="msg" i], input[name*="comment" i]').length > 0;
      const hasEmail = $f.find('input[type="email"], input[name*="email" i]').length > 0;
      const isSearch = $f.find('input[name="s"], input[name="q"], input[name="search" i]').length > 0;
      const isLogin = ($f.attr('action') || '').includes('login') || ($f.attr('action') || '').includes('logout');

      if (hasTextarea && hasEmail && !isSearch && !isLogin) {
        targetForm = $f;
        return false;
      }
    });

    // 2. Fallback: Form with at least textarea or message input
    if (!targetForm) {
      $('form').each((_i: number, f: any) => {
        const $f = $(f);
        const hasTextarea = $f.find('textarea').length > 0 || $f.find('input[name*="message" i]').length > 0;
        const isSearch = $f.find('input[name="s"], input[name="q"], input[name="search" i]').length > 0;
        const isLogin = ($f.attr('action') || '').includes('login') || ($f.attr('action') || '').includes('logout');

        if (hasTextarea && !isSearch && !isLogin) {
          targetForm = $f;
          return false;
        }
      });
    }

    if (!targetForm) {
      const hasJsApp = html.includes('root') || html.includes('__next') || html.includes('lovable') || html.includes('elementor');
      return { success: false, is404OrDead: false, isDynamicPage: hasJsApp, notes: 'No contact form element found on page', discoveredEmails: emailsOnContactPage };
    }

    const formEl: any = targetForm;
    let action = (formEl.attr('action') || '').trim();
    if (!action || action === '#' || action.startsWith('javascript:')) {
      action = contactUrl;
    } else if (!action.startsWith('http')) {
      action = new URL(action, contactUrl).href;
    }

    const method = (formEl.attr('method') || 'POST').toUpperCase();
    const inputs: Array<{ name: string; value: string }> = [];

    formEl.find('input, textarea, select').each((_i: number, elem: any) => {
      const name = $(elem).attr('name') || '';
      if (!name) return;

      const type = ($(elem).attr('type') || '').toLowerCase();
      if (type === 'submit' || type === 'button' || type === 'image') return;

      let val = $(elem).attr('value') || '';
      const nameLower = name.toLowerCase();

      // Preserve all hidden tokens (CSRF, _wpcf7, nonces, form_id) untouched!
      if (type === 'hidden') {
        inputs.push({ name, value: val });
        return;
      }

      // Honeypot Protection: Detect hidden anti-spam fields (WPForms, CF7, Gravity Forms, Elementor)
      const style = ($(elem).attr('style') || '').toLowerCase();
      const parentStyle = ($(elem).parent().attr('style') || '').toLowerCase();
      const elemClass = ($(elem).attr('class') || '').toLowerCase();
      const parentClass = ($(elem).parent().attr('class') || '').toLowerCase();
      const id = ($(elem).attr('id') || '').toLowerCase();

      const isHiddenViaCss = style.includes('display:none') || style.includes('display: none') || 
                             style.includes('visibility:hidden') || style.includes('visibility: hidden') ||
                             parentStyle.includes('display:none') || parentStyle.includes('display: none');
      const isHoneypotName = /hp|honeypot|botcheck|antispam|extra_field|_wpcf7_honeypot|wpforms\[hp\]/i.test(nameLower) ||
                             /hp|honeypot|botcheck/i.test(id) ||
                             /honeypot|hp-field|gform_validation/i.test(elemClass) ||
                             /honeypot|hp-field|gform_validation/i.test(parentClass);

      if (isHiddenViaCss || isHoneypotName) {
        // Leave completely blank to avoid tripping spam traps
        inputs.push({ name, value: '' });
        return;
      }

      if (nameLower.includes('name') || nameLower.includes('author') || nameLower.includes('first_name') || nameLower.includes('your-name')) {
        val = pitch.name;
      } else if (nameLower.includes('email') || type === 'email' || nameLower.includes('your-email')) {
        val = pitch.email;
      } else if (nameLower.includes('phone') || nameLower.includes('tel') || nameLower.includes('mobile') || type === 'tel' || nameLower.includes('your-tel')) {
        val = pitch.phone;
      } else if (nameLower.includes('subject') || nameLower.includes('your-subject')) {
        val = '24/7 AI Automation & WhatsApp Growth Portal Proposal';
      } else if (nameLower.includes('message') || nameLower.includes('msg') || nameLower.includes('comment') || nameLower.includes('body') || nameLower.includes('your-message') || elem.name === 'textarea') {
        val = pitch.message;
      }

      inputs.push({ name, value: val });
    });

    if (inputs.length === 0) {
      return { success: false, is404OrDead: false, isDynamicPage: true, notes: 'Form contains no visible input fields', discoveredEmails: emailsOnContactPage };
    }

    const bodyParams = new URLSearchParams();
    inputs.forEach(i => bodyParams.append(i.name, i.value));

    const domainOrigin = new URL(contactUrl).origin;
    const postResp = await fastHttpClient({
      method: method === 'GET' ? 'GET' : 'POST',
      url: action,
      data: method === 'GET' ? undefined : bodyParams.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': contactUrl,
        'Origin': domainOrigin
      },
      timeout: 6000,
      validateStatus: () => true
    });

    if (postResp.status >= 200 && postResp.status < 400) {
      return { success: true, is404OrDead: false, isDynamicPage: false, notes: `Form POSTed to ${action} (Status ${postResp.status})`, discoveredEmails: emailsOnContactPage };
    } else {
      return { success: false, is404OrDead: false, isDynamicPage: false, notes: `Form POST returned HTTP ${postResp.status}`, discoveredEmails: emailsOnContactPage };
    }
  } catch (err: any) {
    const is404 = err.response && err.response.status >= 400;
    return { success: false, is404OrDead: Boolean(is404), isDynamicPage: false, notes: `Fetch error: ${err.message}`, discoveredEmails: [] };
  }
}

/**
 * Automates form submission via shared browser pool for dynamic pages.
 */
async function tryBrowserFormSubmit(
  contactUrl: string,
  pitch: { name: string; email: string; phone: string; message: string }
): Promise<{ success: boolean; notes: string }> {
  activeBrowserTasks++;
  let page: any = null;
  try {
    const browser = await getSharedBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      await page.setRequestInterception(true);
      page.on('request', (req: any) => {
        try {
          const resourceType = req.resourceType();
          if (['image', 'media', 'font'].includes(resourceType)) {
            req.abort().catch(() => {});
          } else {
            req.continue().catch(() => {});
          }
        } catch (_) {
          try { req.continue().catch(() => {}); } catch (_) {}
        }
      });
    } catch (_) {}

    await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
    await new Promise(r => setTimeout(r, 600));

    const filled = await page.evaluate((payload: any) => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select')) as HTMLElement[];
      if (inputs.length === 0) return false;

      let nameFilled = false;
      let emailFilled = false;
      let phoneFilled = false;
      let msgFilled = false;

      inputs.forEach((el: any) => {
        const type = (el.type || '').toLowerCase();
        const name = (el.name || '').toLowerCase();
        const id = (el.id || '').toLowerCase();
        const placeholder = (el.placeholder || '').toLowerCase();
        const tag = el.tagName.toLowerCase();

        if (type === 'hidden' || type === 'submit' || type === 'button') return;

        // Honeypot Protection: Detect hidden fields or anti-spam honeypot classes/names
        const computed = window.getComputedStyle(el);
        if (computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0' || el.offsetParent === null) {
          return;
        }
        if (/hp|honeypot|botcheck|antispam|extra_field|_wpcf7_honeypot|wpforms\[hp\]/i.test(name) || /hp|honeypot|botcheck/i.test(id) || /honeypot|hp-field|gform_validation/i.test(el.className || '')) {
          return;
        }

        const isNameMatch = name.includes('name') || id.includes('name') || placeholder.includes('name') || name.includes('author');
        const isEmailMatch = type === 'email' || name.includes('email') || id.includes('email') || placeholder.includes('email') || name.includes('mail');
        const isPhoneMatch = type === 'tel' || name.includes('phone') || id.includes('phone') || placeholder.includes('phone') || name.includes('tel') || name.includes('mobile');
        const isMsgMatch = tag === 'textarea' || name.includes('message') || id.includes('message') || placeholder.includes('message') || name.includes('msg') || name.includes('comment') || name.includes('body');

        if (!nameFilled && isNameMatch) {
          el.value = payload.name;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          nameFilled = true;
        } else if (!emailFilled && isEmailMatch) {
          el.value = payload.email;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          emailFilled = true;
        } else if (!phoneFilled && isPhoneMatch) {
          el.value = payload.phone;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          phoneFilled = true;
        } else if (!msgFilled && isMsgMatch) {
          el.value = payload.message;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          msgFilled = true;
        }
      });

      return nameFilled || emailFilled || msgFilled;
    }, pitch);

    if (!filled) {
      return { success: false, notes: 'Could not auto-map input fields in DOM' };
    }

    const submitClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"], a.submit, a.button')) as HTMLElement[];
      const submitBtn = buttons.find(b => {
        const text = (b.innerText || b.textContent || (b as any).value || '').toLowerCase();
        const isTypeSubmit = (b as any).type === 'submit';
        const matchesText = /submit|send|book|quote|contact|message|reach|inquire|inquiry|dispatch|start/i.test(text);
        return isTypeSubmit || matchesText;
      });

      if (submitBtn) {
        submitBtn.click();
        return true;
      }

      const form = document.querySelector('form');
      if (form) {
        try {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          form.submit();
        } catch (_) {}
        return true;
      }

      return false;
    });

    if (!submitClicked) {
      return { success: false, notes: 'Submit button not located' };
    }

    await new Promise(r => setTimeout(r, 1000));
    return { success: true, notes: 'Browser submit completed and dispatched.' };

  } catch (err: any) {
    return { success: false, notes: `Browser error: ${err.message}` };
  } finally {
    if (page) {
      try { await page.close(); } catch (_) {}
    }
    releaseBrowserTask();
  }
}

/**
 * Main function to submit a proposal through the target website's contact form,
 * with ZERO-FAILURE cascade to Multi-SMTP Pooler when forms are inaccessible or protected.
 */
export async function submitContactForm(
  lead: WebformLeadTarget,
  origin = 'WebContactForm',
  signature = 'Bethelmind Analytics Lagos Desk'
): Promise<SubmissionResult> {
  const result: SubmissionResult = {
    success: false,
    notes: '',
    methodUsed: 'none'
  };

  const rawWebsite = (lead.website || '').trim();
  const website = sanitizeWebsiteUrl(rawWebsite);

  // If website is an aggregator, directory, or invalid, check if we can contact via verified email
  if (!website || !website.startsWith('http') || EXCLUDED_AGGREGATORS.test(website)) {
    if (lead.email && lead.email.includes('@')) {
      const emailRes = await multiSmtpPooler.dispatch({
        ...lead,
        email: lead.email,
        name: lead.name || lead.business_name
      });
      if (emailRes.success) {
        result.success = true;
        result.methodUsed = 'smtp_pool_cascade';
        result.notes = `Delivered directly to verified email via ${emailRes.provider} (MsgId: ${emailRes.messageId})`;
        return result;
      }
    }
    result.notes = 'Skip: Aggregator / Social / Directory URL without contact form.';
    return result;
  }

  // Preflight check domain
  const preflight = await preflightDomainCheck(website);
  if (!preflight.ok) {
    // If domain preflight fails (e.g. DNS or offline site), but lead has verified email, fallback to SMTP pool!
    if (lead.email && lead.email.includes('@')) {
      const emailRes = await multiSmtpPooler.dispatch({
        ...lead,
        email: lead.email,
        name: lead.name || lead.business_name
      });
      if (emailRes.success) {
        result.success = true;
        result.methodUsed = 'smtp_pool_cascade';
        result.notes = `Website offline -> proposal delivered directly to verified email via ${emailRes.provider} (MsgId: ${emailRes.messageId})`;
        return result;
      }
    }
    result.notes = 'Skip: Website domain DNS unresolvable or server unresponsive (<= 7s).';
    return result;
  }

  const cleanName = (lead.name || lead.business_name || 'Management').trim();
  const slug = (lead.lead_id || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, 25);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  const messageBody = `Good day Team ${cleanName},
We noticed after-hours clients often wait hours for quotes. We pre-built a 24/7 AI WhatsApp quoting assistant custom for ${cleanName}.
Test drive live prototype (₦0 Upfront):
${previewUrl}
WhatsApp Closer Desk: wa.me/2348022791227 (0802 279 1227)
— Bethelmind Analytics Lagos Desk`;

  const pitchPayload = {
    name: signature,
    email: 'contact@bethelmindanalytics.com',
    phone: '+2348022791227',
    message: messageBody
  };

  const targetContactUrl = preflight.html ? extractSingleContactLink(preflight.html, preflight.finalUrl) : `${preflight.finalUrl}/contact`;

  // 1. High-Speed Fast Fetch Check & POST
  const fetchResult = await tryFetchFormSubmit(targetContactUrl, pitchPayload);
  if (fetchResult.success) {
    result.success = true;
    result.notes = `Delivered via Fast Fetch on ${targetContactUrl}: ${fetchResult.notes}`;
    result.methodUsed = 'fetch';
    return result;
  }

  // 2. Resilient Browser Fallback (if form requires dynamic JS/CSRF)
  if (fetchResult.isDynamicPage) {
    const browserTarget = fetchResult.is404OrDead ? preflight.finalUrl : targetContactUrl;
    const browserResult = await tryBrowserFormSubmit(browserTarget, pitchPayload);
    if (browserResult.success) {
      result.success = true;
      result.notes = `Delivered via Browser Automation on ${browserTarget}: ${browserResult.notes}`;
      result.methodUsed = 'browser';
      return result;
    }
  }

  // 3. ZERO-FAILURE CASCADE: Form is protected, blocked by WAF/403, or lacks form inputs
  // Deliver proposal directly to business email (either scraped from website or from lead record)
  const candidateEmails = [
    lead.email,
    ...(fetchResult.discoveredEmails || []),
    ...(preflight.discoveredEmails || [])
  ].filter(e => e && typeof e === 'string' && e.includes('@'));

  if (candidateEmails.length > 0) {
    const targetEmail = candidateEmails[0]!;
    const emailRes = await multiSmtpPooler.dispatch({
      ...lead,
      email: targetEmail,
      name: cleanName
    });

    if (emailRes.success) {
      result.success = true;
      result.methodUsed = 'smtp_pool_cascade';
      result.notes = `Zero-Failure Delivery: Form unavailable/protected -> proposal delivered directly to business email (${targetEmail}) via ${emailRes.provider} (MsgId: ${emailRes.messageId})`;
      return result;
    }
  }

  result.notes = `Fetch: ${fetchResult.notes}`;
  return result;
}
