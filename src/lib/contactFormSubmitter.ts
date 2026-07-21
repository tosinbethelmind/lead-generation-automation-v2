/**
 * @file contactFormSubmitter.ts
 * Automated system to discover contact pages on business websites,
 * detect form fields, and autovalidate/autofill customized pitches.
 * Falls back to Puppeteer browser automation if quick Fetch fails.
 */

import * as cheerio from 'cheerio';
import { launchBrowser } from './browserLauncher';
import { Lead } from './googleSheets';
import { getPitchDetails } from './pitchHelper';
import { addLog } from './googleSheets';

interface SubmissionResult {
  success: boolean;
  notes: string;
  methodUsed: 'fetch' | 'browser' | 'none';
}

const COMMON_CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/contactus',
  '/get-in-touch',
  '/getintouch',
  '/about',
  '/about-us',
  '/support',
  '/send-message'
];

/**
 * Searches the homepage HTML for contact links.
 */
function findContactLinks(html: string, baseUrlStr: string): string[] {
  const urls: string[] = [];
  try {
    const $ = cheerio.load(html);
    const baseUrl = new URL(baseUrlStr);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim() || '';
      if (!href) return;

      try {
        const absUrl = new URL(href, baseUrlStr);
        // Only crawl on the same domain
        if (absUrl.hostname === baseUrl.hostname) {
          const pathLower = absUrl.pathname.toLowerCase();
          const matchesPath = COMMON_CONTACT_PATHS.some(p => pathLower.includes(p));
          if (matchesPath && !urls.includes(absUrl.href)) {
            urls.push(absUrl.href);
          }
        }
      } catch (_) {}
    });
  } catch (_) {}

  // Fallback to appending common paths in case of no explicitly found links
  const targetDomain = new URL(baseUrlStr).origin;
  COMMON_CONTACT_PATHS.forEach(p => {
    const candidate = `${targetDomain}${p}`;
    if (!urls.includes(candidate)) {
      urls.push(candidate);
    }
  });

  return urls;
}

/**
 * Tries to submit a form using plain Cheerio scraping and POST fetch requests.
 */
async function tryFetchFormSubmit(
  contactUrl: string,
  pitch: { name: string; email: string; phone: string; message: string }
): Promise<{ success: boolean; notes: string }> {
  try {
    const resp = await fetch(contactUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html'
      }
    });

    if (!resp.ok) {
      return { success: false, notes: `HTTP ${resp.status} fetching contact page` };
    }

    const html = await resp.text();
    const $ = cheerio.load(html);
    const formEl = $('form').first();

    if (!formEl.length) {
      return { success: false, notes: 'No HTML form tags found on page' };
    }

    let action = formEl.attr('action') || '';
    if (!action) {
      action = contactUrl;
    } else if (!action.startsWith('http')) {
      action = new URL(action, contactUrl).href;
    }

    const method = (formEl.attr('method') || 'POST').toUpperCase();
    const inputs: Array<{ name: string; value: string }> = [];

    // Find input and textarea fields
    formEl.find('input, textarea, select').each((_, elem) => {
      const name = $(elem).attr('name') || '';
      if (!name) return;

      const type = ($(elem).attr('type') || '').toLowerCase();
      if (type === 'submit' || type === 'button') return;

      // Assign value based on semantic input matching
      let val = $(elem).attr('value') || '';
      const nameLower = name.toLowerCase();

      if (nameLower.includes('name')) {
        val = pitch.name;
      } else if (nameLower.includes('email') || type === 'email') {
        val = pitch.email;
      } else if (nameLower.includes('phone') || nameLower.includes('tel') || nameLower.includes('mobile') || type === 'tel') {
        val = pitch.phone;
      } else if (nameLower.includes('message') || nameLower.includes('msg') || nameLower.includes('comment') || nameLower.includes('body') || elem.name === 'textarea') {
        val = pitch.message;
      }

      inputs.push({ name, value: val });
    });

    if (inputs.length === 0) {
      return { success: false, notes: 'Form contains no input fields' };
    }

    // Submit form via HTTP POST
    const bodyParams = new URLSearchParams();
    inputs.forEach(i => bodyParams.append(i.name, i.value));

    console.log(`[contactFormSubmitter] POSTing to form action ${action} with ${inputs.length} fields`);
    
    const postResp = await fetch(action, {
      method: method === 'GET' ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: method === 'GET' ? undefined : bodyParams.toString()
    });

    if (postResp.ok) {
      return { success: true, notes: `Form successfully POSTed to ${action} via Fetch.` };
    } else {
      return { success: false, notes: `Form POST to ${action} failed with status ${postResp.status}` };
    }
  } catch (err: any) {
    return { success: false, notes: `Fetch error: ${err.message}` };
  }
}

/**
 * Automates form submission via Puppeteer rendering.
 */
async function tryBrowserFormSubmit(
  contactUrl: string,
  pitch: { name: string; email: string; phone: string; message: string }
): Promise<{ success: boolean; notes: string }> {
  let browser: any = null;
  let page: any = null;
  try {
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log(`[contactFormSubmitter] Browser navigating to: ${contactUrl}`);
    await page.goto(contactUrl, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));

    // Look for form input selectors in the DOM
    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map((el: any) => {
        return {
          tagName: el.tagName.toLowerCase(),
          type: (el.type || '').toLowerCase(),
          name: el.name || '',
          id: el.id || '',
          placeholder: el.placeholder || '',
          className: el.className || ''
        };
      });
    });

    if (formFields.length === 0) {
      return { success: false, notes: 'No input elements visible on page' };
    }

    // Map labels/properties to identify input identifiers
    let nameSelector = '';
    let emailSelector = '';
    let phoneSelector = '';
    let msgSelector = '';

    for (const f of formFields) {
      const termMatch = (pattern: string) => 
        f.name.toLowerCase().includes(pattern) || 
        f.id.toLowerCase().includes(pattern) || 
        f.placeholder.toLowerCase().includes(pattern);

      const path = f.id ? `#${f.id}` : f.name ? `[name="${f.name}"]` : '';
      if (!path) continue;

      if (termMatch('name') && !nameSelector) {
        nameSelector = path;
      } else if ((termMatch('email') || f.type === 'email') && !emailSelector) {
        emailSelector = path;
      } else if ((termMatch('phone') || termMatch('tel') || termMatch('mobile') || f.type === 'tel') && !phoneSelector) {
        phoneSelector = path;
      } else if ((termMatch('message') || termMatch('msg') || termMatch('body') || termMatch('comment') || f.tagName === 'textarea') && !msgSelector) {
        msgSelector = path;
      }
    }

    // Default selector mappings if specific tags are missing
    if (!nameSelector) nameSelector = 'input[name*="name"], input[placeholder*="Name"]';
    if (!emailSelector) emailSelector = 'input[type="email"], input[name*="email"]';
    if (!phoneSelector) phoneSelector = 'input[type="tel"], input[name*="phone"]';
    if (!msgSelector) msgSelector = 'textarea';

    // Type content into the form
    const typeField = async (sel: string, val: string) => {
      try {
        const el = await page.$(sel);
        if (el) {
          await el.focus();
          await page.keyboard.down('Control');
          await page.keyboard.press('KeyA');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await el.type(val, { delay: 30 });
        }
      } catch (_) {}
    };

    if (nameSelector) await typeField(nameSelector, pitch.name);
    if (emailSelector) await typeField(emailSelector, pitch.email);
    if (phoneSelector) await typeField(phoneSelector, pitch.phone);
    if (msgSelector) await typeField(msgSelector, pitch.message);

    // Look for submit actions
    const clickedSubmit = await page.evaluate(() => {
      // Look for submit inputs / buttons
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]')) as HTMLElement[];
      const submitBtn = buttons.find(b => {
        const text = (b.innerText || b.textContent || (b as any).value || '').toLowerCase();
        return text.includes('submit') || text.includes('send') || text.includes('submit message') || text.includes('send message') || (b as any).type === 'submit';
      });

      if (submitBtn) {
        submitBtn.click();
        return true;
      }

      // Try finding enclosing forms and calling submit() directly
      const form = document.querySelector('form');
      if (form) {
        form.submit();
        return true;
      }

      return false;
    });

    if (!clickedSubmit) {
      return { success: false, notes: 'Failed to locate a submit button' };
    }

    // Wait for submission request processing to complete
    await new Promise(r => setTimeout(r, 4500));
    
    // Evaluate if navigation occurred or text messages suggest success/failure
    const pageText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const isSuccessText = 
      pageText.includes('thank you') || 
      pageText.includes('thanks') || 
      pageText.includes('success') || 
      pageText.includes('message sent') || 
      pageText.includes('received');

    if (isSuccessText) {
      return { success: true, notes: 'Browser submit completed. Success indicators detected in DOM text.' };
    } else {
      return { success: true, notes: 'Browser submit completed. Form values inputed and button clicked.' };
    }
  } catch (err: any) {
    return { success: false, notes: `Browser error: ${err.message}` };
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

/**
 * Main function to trigger automated contact form submissions.
 */
export async function submitContactForm(
  lead: Lead,
  origin: string,
  signature: string
): Promise<SubmissionResult> {
  const result: SubmissionResult = {
    success: false,
    notes: '',
    methodUsed: 'none'
  };

  const website = (lead.website || '').trim();
  if (!website || !website.startsWith('http')) {
    result.notes = 'Skip: Lead has no valid website URL.';
    return result;
  }

  console.log(`📡 [contactFormSubmitter] Starting outreach check on website: ${website}`);
  await addLog('Outreach', 'START', `Contact form scraper routing checking website: ${website}`);

  // Fetch Homepage to find subpages
  let homepageHtml = '';
  try {
    const homepageResp = await fetch(website, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html'
      }
    });
    if (homepageResp.ok) homepageHtml = await homepageResp.text();
  } catch (_) {}

  // Generate dynamic pitch message details
  const pitchDetails = getPitchDetails(lead, origin, signature);
  const messageBody = pitchDetails.emailBody; // use custom email template as the pitch message
  const pitchPayload = {
    name: signature || 'ApexReach Digital',
    email: 'outreach@apexreach.io',
    phone: '+2348000000000',
    message: messageBody
  };

  const contactUrls = homepageHtml ? findContactLinks(homepageHtml, website) : [`${website}/contact`, `${website}/contact-us`];

  console.log(`[contactFormSubmitter] Discovered contact page candidates:`, contactUrls);

  // Attempt submissions sequentially
  for (const contactUrl of contactUrls) {
    // Stage 1: Try Cheerio Fetch POST
    console.log(`[contactFormSubmitter] Attempting Fast Check on ${contactUrl}`);
    const fetchSubmit = await tryFetchFormSubmit(contactUrl, pitchPayload);
    if (fetchSubmit.success) {
      result.success = true;
      result.notes = `Success on ${contactUrl}: ${fetchSubmit.notes}`;
      result.methodUsed = 'fetch';
      break;
    }

    // Stage 2: Browser/Puppeteer Automation fallback
    console.log(`[contactFormSubmitter] Fast Check failed. Attempting Browser Automation fallback on ${contactUrl}. Reason: ${fetchSubmit.notes}`);
    const browserSubmit = await tryBrowserFormSubmit(contactUrl, pitchPayload);
    if (browserSubmit.success) {
      result.success = true;
      result.notes = `Success on ${contactUrl}: ${browserSubmit.notes}`;
      result.methodUsed = 'browser';
      break;
    } else {
      result.notes = `Failed on all pages. Last failure: ${browserSubmit.notes}`;
    }
  }

  if (result.success) {
    await addLog('Outreach', 'SUCCESS', `Contact form submitted for lead "${lead.name}". Method: ${result.methodUsed}. Notes: ${result.notes}`);
  } else {
    await addLog('Outreach', 'WARN', `Contact form submission failed for lead "${lead.name}". Error: ${result.notes}`);
  }

  return result;
}
