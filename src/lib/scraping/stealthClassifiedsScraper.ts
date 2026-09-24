/**
 * @file src/lib/scraping/stealthClassifiedsScraper.ts
 * 
 * 🥷 PUPPETEER-EXTRA STEALTH CLASSIFIEDS PHONE REVEALER
 * Bethelmind Analytics Lagos Desk · 2026 Edition
 * 
 * Capabilities:
 * 1. Bypasses Cloudflare / Bot detection on classifieds (Jiji.ng, BusinessList.com.ng).
 * 2. Clicks "Show Contact" / "Show Phone Number" buttons dynamically.
 * 3. Extracts authentic unmasked Nigerian carrier telephone numbers.
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export interface ClassifiedContactResult {
  url: string;
  revealedPhone: string;
  sellerName: string;
  success: boolean;
  error?: string;
}

export class StealthClassifiedsScraper {
  /**
   * Reveals hidden phone number on a classified advert page
   */
  async revealPhoneNumber(adUrl: string, timeoutMs = 12000): Promise<ClassifiedContactResult> {
    const result: ClassifiedContactResult = {
      url: adUrl,
      revealedPhone: '',
      sellerName: '',
      success: false
    };

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1280,800'
        ]
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate to target ad page
      await page.goto(adUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs });

      // Attempt to click contact / show number button
      const showBtnSelectors = [
        'button:has-text("Show Contact")',
        'button:has-text("Show Number")',
        'button:has-text("Call")',
        '.qa-show-contact-button',
        'button[class*="contact"]',
        'div[class*="phone-button"]',
        'a[href^="tel:"]'
      ];

      for (const sel of showBtnSelectors) {
        try {
          const btn = await page.$(sel);
          if (btn) {
            await btn.click();
            await page.waitForTimeout(1000);
            break;
          }
        } catch (_) {}
      }

      // Extract phone from page content
      const content = await page.content();
      const phoneRegex = /(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/g;
      const matches = content.match(phoneRegex);

      if (matches && matches.length > 0) {
        result.revealedPhone = matches[0].replace(/\s+/g, '');
        result.success = true;
      }

      // Extract seller / title name
      const title = await page.title();
      result.sellerName = title.split('-')[0].split('|')[0].trim();

    } catch (err: any) {
      result.error = err.message;
    } finally {
      if (browser) {
        try { await browser.close(); } catch (_) {}
      }
    }

    return result;
  }
}

export const stealthClassifiedsScraper = new StealthClassifiedsScraper();
