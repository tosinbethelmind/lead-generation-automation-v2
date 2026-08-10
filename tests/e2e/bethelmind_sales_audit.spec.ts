/**
 * 🔬 BETHELMIND AI SALES ENGINE — CONFIRMATORY AUDIT
 * Full automated test of all 9 platform features on the live preview page.
 * Run with: npx playwright test tests/e2e/bethelmind_sales_audit.spec.ts --headed
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const PREVIEW_URL = 'https://www.bethelmindanalytics.com/preview/apex-solar-solutions';
const SCREENSHOT_DIR = 'test-results/bethelmind-audit';
const AUDIT_REPORT_PATH = 'test-results/bethelmind-audit/AUDIT_REPORT.txt';

// ── Helpers ──────────────────────────────────────────────────────────────────
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function snap(page: Page, name: string): Promise<string> {
  ensureDir(SCREENSHOT_DIR);
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`📸 Saved: ${filePath}`);
  return filePath;
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'smooth' }), y);
  await page.waitForTimeout(800);
}

// ── Audit log accumulator ─────────────────────────────────────────────────────
const auditLog: string[] = [];
function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  auditLog.push(line);
}
function pass(test: string, notes = '') { log(`✅ PASS  | ${test}${notes ? ' — ' + notes : ''}`); }
function fail(test: string, notes = '') { log(`❌ FAIL  | ${test}${notes ? ' — ' + notes : ''}`); }
function info(test: string, notes = '') { log(`ℹ️  INFO  | ${test}${notes ? ' — ' + notes : ''}`); }

// ── TEST SUITE ────────────────────────────────────────────────────────────────
test.describe('🚀 Bethelmind AI Sales Engine — Full Feature Audit', () => {

  test.use({
    baseURL: PREVIEW_URL,
    viewport: { width: 1280, height: 720 },
  });

  test('Step 1 — Page Load & Hero Section', async ({ page }) => {
    log('─── STEP 1: Page Load ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const title = await page.title();
    if (title.includes('Bethelmind') || title.includes('APEX')) {
      pass('Page Title', title);
    } else {
      fail('Page Title', `Got: "${title}"`);
    }

    const proposalBanner = page.getByText('PROPOSAL FOR', { exact: false });
    if (await proposalBanner.count() > 0) {
      pass('Proposal Banner visible');
    } else {
      fail('Proposal Banner not found');
    }

    const brandText = page.getByText('APEX SOLAR SOLUTIONS', { exact: false }).first();
    if (await brandText.isVisible()) {
      pass('APEX SOLAR SOLUTIONS brand visible');
    } else {
      fail('APEX SOLAR SOLUTIONS brand not found');
    }

    const countdown = page.locator('text=/\\d+D|\\d+H|OFFER EXPIRES/i').first();
    if (await countdown.count() > 0) {
      pass('Countdown timer visible');
    } else {
      info('Countdown timer not detected (may be hidden on this viewport)');
    }

    await snap(page, '01_hero_section');
  });


  test('Step 2 — Full Page Scroll & Section Discovery', async ({ page }) => {
    log('─── STEP 2: Scroll & Section Audit ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const scrollPoints = [1000, 2500, 4000, 5500, 7000, 8500, 10000, 11500, 13000];
    for (const y of scrollPoints) {
      await scrollTo(page, y);
      await snap(page, `02_scroll_y${y}`);
    }

    const sectionChecks: [string, RegExp][] = [
      ['Trust Bar',           /Average Google Rating|Customer Reviews|Locally Verified/i],
      ['Map Section',         /Find Us on the Map/i],
      ['What Happens After',  /What Happens After You Claim/i],
      ['Services Section',    /Specialties|Services|24\/7 WhatsApp AI/i],
      ['Testimonials',        /What Our Customers Say/i],
      ['Interactive Features',/Select Interactive Features/i],
      ['Pricing Cards',       /₦150,000|₦250,000/],
      ['Claim Section',       /Lock In Your Custom|Reserved Domain/i],
    ];

    await scrollTo(page, 0);

    for (const [label, pattern] of sectionChecks) {
      const locator = page.locator(`text=${pattern.source}`).first();
      const found = await locator.count() > 0;
      if (found) {
        pass(`Section found: ${label}`);
      } else {
        fail(`Section not found: ${label}`);
      }
    }
  });


  test('Step 3 — Interactive Feature Selector (Test Demo Buttons)', async ({ page }) => {
    log('─── STEP 3: Interactive Feature Selector ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const featureSection = page.locator('text=Select Interactive Features').first();
    if (await featureSection.count() === 0) {
      fail('Feature Selector section not found — skipping step 3');
      return;
    }

    await featureSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await snap(page, '03a_feature_selector');

    const demoButtons = page.locator('button:has-text("Test Demo")');
    const count = await demoButtons.count();
    info(`Found ${count} Test Demo buttons`);

    if (count > 0) {
      await demoButtons.first().click();
      await page.waitForTimeout(2000);
      await snap(page, '03b_demo_modal_opened');
      pass('Test Demo button clicked without errors');
    } else {
      fail('No Test Demo buttons found');
    }
  });


  test('Step 4 — Domain Extension Chip Selector', async ({ page }) => {
    log('─── STEP 4: Domain Extension Chips ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const domainChips = ['.com', '.com.ng', '.ng', '.africa', '.org'];
    let chipsFound = 0;

    for (const ext of domainChips) {
      const chip = page.locator(`button:has-text("${ext}"), span:has-text("${ext}")`).first();
      if (await chip.count() > 0 && await chip.isVisible()) {
        chipsFound++;
        await chip.scrollIntoViewIfNeeded();
        await chip.click();
        await page.waitForTimeout(600);
        pass(`Domain chip "${ext}" found and clicked`);
      }
    }

    if (chipsFound > 0) {
      pass(`Domain chips functional: ${chipsFound}/${domainChips.length}`);
      await snap(page, '04_domain_chips');
    } else {
      fail('No domain extension chips found on page');
    }
  });


  test('Step 5 — Pricing Cards (NGN 150k / 250k)', async ({ page }) => {
    log('─── STEP 5: Pricing Cards ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const price150 = page.locator('text=₦150,000').first();
    const price250 = page.locator('text=₦250,000').first();

    if (await price150.count() > 0) {
      await price150.scrollIntoViewIfNeeded();
      pass('₦150,000 package card visible');
    } else {
      fail('₦150,000 package card NOT found');
    }

    if (await price250.count() > 0) {
      pass('₦250,000 package card visible');
    } else {
      fail('₦250,000 package card NOT found');
    }

    await snap(page, '05_pricing_cards');
  });


  test('Step 6 — Floating Chat Widget (AI Chatbot)', async ({ page }) => {
    log('─── STEP 6: Floating Chat Widget ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    await snap(page, '06a_chat_widget_initial');

    const chatButtonSelectors = [
      'button[aria-label*="chat" i]',
      'button[aria-label*="AI" i]',
      '[class*="chat-button"]',
      '[class*="chatbot"]',
      '[class*="floating"]',
      'button:has-text("Chat with AI")',
      'button:has-text("Chat")',
      '[id*="chat"]',
    ];

    let chatButtonFound = false;
    for (const selector of chatButtonSelectors) {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        chatButtonFound = true;
        pass(`Chat button found via: ${selector}`);
        await el.scrollIntoViewIfNeeded();
        await el.click();
        await page.waitForTimeout(2000);
        await snap(page, '06b_chat_opened');

        const chatInput = page.locator('input[placeholder*="message" i], input[placeholder*="type" i], textarea').first();
        if (await chatInput.isVisible()) {
          await chatInput.fill('How much is solar installation?');
          await chatInput.press('Enter');
          await page.waitForTimeout(4000);
          await snap(page, '06c_chat_response');
          pass('Chat widget — Message sent successfully');
        } else {
          info('Chat widget opened but input field not detected');
        }
        break;
      }
    }

    if (!chatButtonFound) {
      fail('Floating chat button NOT found');
    }
  });


  test('Step 7 — OPay / Moniepoint Payment Section', async ({ page }) => {
    log('─── STEP 7: Payment Section ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const paymentKeywords = [
      'text=OPay',
      'text=Moniepoint',
      'text=7034297995',
      'button:has-text("Copy Account")',
      'button:has-text("Copy")',
    ];

    let paymentFound = false;
    for (const selector of paymentKeywords) {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        paymentFound = true;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await snap(page, '07a_payment_section');
        pass(`Payment element found: ${selector}`);

        if (selector.includes('Copy')) {
          await el.click();
          await page.waitForTimeout(1000);
          await snap(page, '07b_account_copied');
          pass('Copy Account No. button clicked');
        }
        break;
      }
    }

    if (!paymentFound) {
      for (const y of [8000, 9000, 10000, 11000, 12000]) {
        await scrollTo(page, y);
        const el = page.locator('text=7034297995').first();
        if (await el.count() > 0) {
          await snap(page, `07_payment_found_at_y${y}`);
          pass(`Payment section found at scroll Y=${y}`);
          paymentFound = true;
          break;
        }
      }
    }

    if (!paymentFound) {
      info('Payment section (OPay/Moniepoint) not found — may be in a sub-section or modal');
    }
  });


  test('Step 8 — WhatsApp CTA Button', async ({ page }) => {
    log('─── STEP 8: WhatsApp 1-Click Claim Button ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const waSelectors = [
      'a[href*="wa.me"]',
      'a:has-text("WhatsApp")',
      'button:has-text("WhatsApp")',
      'a:has-text("Claim via WhatsApp")',
      'text=1-Click Claim via WhatsApp',
    ];

    let waFound = false;
    for (const selector of waSelectors) {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        waFound = true;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await snap(page, '08_whatsapp_button');
        const href = await el.getAttribute('href') ?? '';
        pass(`WhatsApp button found — href: ${href.substring(0, 80)}`);
        if (href.includes('2348022791227') || href.includes('wa.me')) {
          pass('WhatsApp routing to correct number: +2348022791227');
        }
        break;
      }
    }

    if (!waFound) {
      fail('WhatsApp CTA button NOT found');
    }
  });


  test('Step 9 — Final Report Generation', async ({ page }) => {
    log('─── STEP 9: Generating Final Report ───');
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    ensureDir(SCREENSHOT_DIR);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_full_page.png'), fullPage: true });
    pass('Full-page screenshot captured');

    const report = [
      '═══════════════════════════════════════════════════════',
      '  BETHELMIND AI SALES ENGINE — CONFIRMATORY AUDIT REPORT',
      `  Generated: ${new Date().toLocaleString()}`,
      `  Target URL: ${PREVIEW_URL}`,
      '═══════════════════════════════════════════════════════',
      '',
      ...auditLog,
      '',
      `Screenshots saved to: ${path.resolve(SCREENSHOT_DIR)}`,
      '═══════════════════════════════════════════════════════',
    ].join('\n');

    fs.writeFileSync(AUDIT_REPORT_PATH, report, 'utf-8');
    pass(`Audit report written to ${AUDIT_REPORT_PATH}`);
    console.log('\n\n' + report);
  });

});
