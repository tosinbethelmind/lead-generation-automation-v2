import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

let testStartTime = Date.now();
const logDir = path.join(__dirname, '../../test-results');
const logPath = path.join(logDir, 'speech-log.json');

// Initialize speech log
function initSpeechLog() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  fs.writeFileSync(logPath, '[]');
  testStartTime = Date.now();
}

// Log speech to file
function logSpeech(text: string) {
  const elapsed = Date.now() - testStartTime;
  try {
    const data = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '[]';
    const logs = JSON.parse(data);
    logs.push({ text, timestamp: elapsed });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Failed to log speech:', err);
  }
}

// ── Speech helper ──────────────────────────────────────────────────
async function speak(page: Page, text: string, delayAfter = 1500) {
  logSpeech(text);
  await page.evaluate((t) => {
    return new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(t);
      u.rate = 1.15; u.pitch = 1.0; u.volume = 1;
      u.onend = () => resolve();
      setTimeout(() => resolve(), 10000); // safety timeout
      speechSynthesis.speak(u);
    });
  }, text);
  await page.waitForTimeout(delayAfter);
}

async function smoothScroll(page: Page, distance = 400, duration = 1200) {
  await page.evaluate(([d, t]) => {
    window.scrollBy({ top: d, behavior: 'smooth' });
    return new Promise(r => setTimeout(r, t));
  }, [distance, duration]);
}

// ── MAIN TEST ──────────────────────────────────────────────────────
test.describe('ApexReach Complete Platform Walkthrough Demo', () => {
  test('01_full_voiced_platform_walkthrough', async ({ page }) => {
    initSpeechLog();

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1 — CONSOLE DASHBOARD
    // ═══════════════════════════════════════════════════════════════
    await page.goto('/');
    await page.waitForTimeout(2000);
    await speak(page, 'Welcome to ApexReach B2B Lead Engine. This is a complete voiced walkthrough of every feature on the platform.');

    // Verify sidebar brand
    await expect(page.locator('h2').filter({ hasText: 'ApexReach' })).toBeVisible();
    await page.waitForTimeout(1000);

    await speak(page, 'The sidebar shows our brand identity, Google sign-in integration, navigation tabs, and live connection status indicators.');
    await page.waitForTimeout(1500);

    // KPI stat cards
    await speak(page, 'The Console dashboard displays four key performance indicators: Total Leads Ingested, Ready for Proposal, Outreach Sent, and Highly Rated Leads.');
    await page.waitForTimeout(2000);

    // Pipeline log
    await speak(page, 'Below the stats, you can see the Pipeline Execution Log showing real-time sync activity, and the Launch Outreach Campaign panel.');
    await page.waitForTimeout(1500);

    // Click Configure & Launch
    const launchBtn = page.locator('button', { hasText: 'Configure & Launch' });
    if (await launchBtn.isVisible()) {
      await launchBtn.click();
      await page.waitForTimeout(1500);
      await speak(page, 'Clicking Configure and Launch takes us directly to the CRM tab with all pending leads pre-selected.');
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 2 — LEADS CRM
    // ═══════════════════════════════════════════════════════════════
    const crmBtn = page.locator('button', { hasText: 'Leads CRM' });
    await crmBtn.click();
    await page.waitForTimeout(2000);
    await speak(page, 'This is the Leads CRM directory. It displays all scraped businesses with their name, category, Google rating, area, email, and lifecycle stage.');

    // Search
    const searchInput = page.locator('input[placeholder*="Search leads"]');
    await searchInput.fill('Luxe');
    await page.waitForTimeout(1500);
    await speak(page, 'We can search leads by name, category, or phone number. Filtering for Luxe Couture.');
    await page.waitForTimeout(1000);
    await searchInput.clear();
    await page.waitForTimeout(800);

    // Status filter
    const statusSelect = page.locator('select').filter({ hasText: 'All Lifecycle Stages' });
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('NEW');
      await page.waitForTimeout(1200);
      await speak(page, 'We can filter leads by lifecycle stage. Showing only NEW uncontacted leads.');
      await page.waitForTimeout(1000);
      await statusSelect.selectOption('CONTACTED');
      await page.waitForTimeout(1000);
      await speak(page, 'Now showing CONTACTED leads that have already received outreach.');
      await statusSelect.selectOption('ALL');
      await page.waitForTimeout(800);
    }

    // Select a lead row
    const firstRow = page.locator('tbody tr').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await page.waitForTimeout(1500);
      await speak(page, 'Clicking a lead row opens the Proposal Outreach Preview panel on the right, showing the personalized message template with dynamic variables.');
    }

    // Select all checkbox
    const selectAll = page.locator('thead input[type="checkbox"]');
    if (await selectAll.isVisible()) {
      await selectAll.click({ force: true });
      await page.waitForTimeout(1000);
      await speak(page, 'We can select all leads using the header checkbox. The outreach send button appears with the count of selected leads.');
      await page.waitForTimeout(1500);
      await selectAll.click({ force: true });
      await page.waitForTimeout(500);
    }

    // Custom message override
    const customCheckbox = page.locator('#useCustomMessage');
    if (await customCheckbox.isVisible()) {
      await customCheckbox.click({ force: true });
      await page.waitForTimeout(1500);
      await speak(page, 'The custom message override lets you write a completely personalized outreach message instead of using the default template. You can insert dynamic tags like lead name, preview URL, rating, and signature.');
      await page.waitForTimeout(1500);
      await customCheckbox.click({ force: true });
      await page.waitForTimeout(500);
    }

    // View Web Page link
    const viewBtn = page.locator('a', { hasText: 'View Web Page' }).first();
    if (await viewBtn.isVisible()) {
      await speak(page, 'Each lead has a View Web Page button that opens their auto-generated AI landing page in a new tab.');
      await page.waitForTimeout(1500);
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 3 — MAPS SCRAPER (ALL 10 PROVIDERS)
    // ═══════════════════════════════════════════════════════════════
    const scrapersBtn = page.locator('button', { hasText: 'Maps Scraper' });
    await scrapersBtn.click();
    await page.waitForTimeout(2000);
    await speak(page, 'The Maps Scraper tab is the lead acquisition engine. ApexReach supports ten different scraper providers.');

    // Cycle through ALL 10 scraper providers
    const scrapers = [
      { value: 'google', name: 'Google Places API with free tier and high quality data' },
      { value: 'maps-free', name: 'Google Maps Free Web Scraper using Playwright headless browser' },
      { value: 'duckduckgo', name: 'DuckDuckGo Search Scraper with HTML crawling, completely free' },
      { value: 'osm', name: 'OpenStreetMap Overpass API, one hundred percent free with no API key required' },
      { value: 'jiji', name: 'Jiji dot N G Crawler using Playwright headless browser, completely free' },
      { value: 'apify', name: 'Apify Google Maps Actor for high scale paid scraping' },
      { value: 'instagram', name: 'Instagram Scraper for finding e-commerce businesses' },
      { value: 'facebook', name: 'Facebook Scraper for shop pages and marketplace listings' },
      { value: 'tiktok', name: 'TikTok Scraper for product video creators' },
      { value: 'linkedin', name: 'LinkedIn Scraper for professional service providers' },
    ];

    for (const s of scrapers) {
      const card = page.locator(`#scraper-card-${s.value}`);
      if (await card.isVisible()) {
        await card.click();
      }
      await page.waitForTimeout(1200);
      await speak(page, s.name, 1500);
    }

    // Set back to Google and fill form
    const googleCard = page.locator('#scraper-card-google');
    if (await googleCard.isVisible()) {
      await googleCard.click();
    }
    await page.waitForTimeout(500);
    const queryInput = page.locator('input[placeholder*="Dentists"]').or(page.locator('input[placeholder*="cars"]')).first();
    if (await queryInput.isVisible()) {
      await queryInput.fill('Car Dealers Lagos');
      await page.waitForTimeout(800);
    }
    const limitInput = page.locator('input[type="number"]');
    if (await limitInput.isVisible()) {
      await limitInput.fill('5');
      await page.waitForTimeout(500);
    }

    await speak(page, 'Lets execute a Google Places scrape for Car Dealers in Lagos with a limit of 5 results.');

    // Click execute scrape
    const executeBtn = page.locator('button', { hasText: /Execute.*Scrape/ });
    if (await executeBtn.isVisible() && await executeBtn.isEnabled()) {
      await executeBtn.click();
      await page.waitForTimeout(4000);
      await speak(page, 'The scraper runs in sandbox mode, automatically filtering out businesses that already have websites and inserting qualified leads into the database.');
    }

    // Show verification rules panel
    await speak(page, 'The Verification Rules panel explains the automated quality checks: website filtering, outreach sync to Google Sheets, and rating floor thresholds.');
    await page.waitForTimeout(1500);

    // ═══════════════════════════════════════════════════════════════
    // PHASE 4 — SYNC LOGS
    // ═══════════════════════════════════════════════════════════════
    const logsBtn = page.locator('button', { hasText: 'Sync Logs' });
    await logsBtn.click();
    await page.waitForTimeout(2000);
    await speak(page, 'The Sync Logs tab shows the complete system audit trail. Every scrape, outreach dispatch, and pipeline event is timestamped and logged with its status.');

    // Refresh button
    const refreshBtn = page.locator('button', { hasText: 'Refresh Timeline' });
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
      await page.waitForTimeout(2000);
      await speak(page, 'Clicking Refresh Timeline pulls the latest log entries from the database.');
    }
    await page.waitForTimeout(1500);

    // ═══════════════════════════════════════════════════════════════
    // PHASE 5 — SETTINGS (EVERY SINGLE OPTION)
    // ═══════════════════════════════════════════════════════════════
    const settingsBtn = page.locator('[data-testid="settings-tab"]');
    await settingsBtn.click();
    await page.waitForTimeout(2000);
    await speak(page, 'The Settings tab contains the complete system configuration. Lets walk through every section.');

    // Section 1: Global Configuration
    await speak(page, 'Section one, Global Configuration. Here you set the Storage Backend Mode, which supports Hybrid, Local JSON, Supabase Postgres, and Google Sheets only modes.');
    await page.waitForTimeout(1500);

    // Storage mode selector
    const storageSelect = page.locator('select').filter({ hasText: 'Hybrid Mode' }).or(page.locator('select').filter({ hasText: 'Supabase' })).first();
    if (await storageSelect.isVisible()) {
      for (const mode of ['hybrid', 'local', 'supabase', 'cloud']) {
        await storageSelect.selectOption(mode);
        await page.waitForTimeout(800);
      }
      await storageSelect.selectOption('supabase');
      await page.waitForTimeout(500);
    }

    // Outreach channel selector
    await speak(page, 'The Default Outreach Channel selector supports Email, WhatsApp, Twilio Cold Call, Jiji Chat, Instagram, Facebook, TikTok, and LinkedIn outreach.');
    const channelSelect = page.locator('select').filter({ hasText: 'Email Outreach' }).or(page.locator('select').filter({ hasText: 'WhatsApp' })).first();
    if (await channelSelect.isVisible()) {
      const channels = ['gmail', 'whatsapp', 'coldcall', 'jiji', 'instagram', 'facebook', 'tiktok', 'linkedin'];
      for (const ch of channels) {
        await channelSelect.selectOption(ch);
        await page.waitForTimeout(700);
      }
      await channelSelect.selectOption('gmail');
      await page.waitForTimeout(500);
    }

    await speak(page, 'You also configure the Business Signature, Google Spreadsheet ID, Google Places API Key, and Gemini AI API Key for copywriting.');
    await page.waitForTimeout(1500);
    await smoothScroll(page, 400);

    // Section 2: Email Provider
    await speak(page, 'Section two, Email Outreach Provider. Switch between Google Workspace Gmail OAuth, Resend dot com API, and Brevo dot com SMTP.');
    const emailProviderSelect = page.locator('select').filter({ hasText: 'Google Workspace' }).or(page.locator('select').filter({ hasText: 'Resend' })).first();
    if (await emailProviderSelect.isVisible()) {
      await emailProviderSelect.selectOption('gmail');
      await page.waitForTimeout(1000);
      await speak(page, 'Gmail OAuth shows fields for Client ID, Client Secret, and Project ID.');
      await emailProviderSelect.selectOption('resend');
      await page.waitForTimeout(1000);
      await speak(page, 'Resend shows the API Key and verified From Email fields.');
      await emailProviderSelect.selectOption('brevo');
      await page.waitForTimeout(1000);
      await speak(page, 'Brevo shows the API Key, Sender Display Name, and Sender Verified Email fields.');
      await emailProviderSelect.selectOption('gmail');
      await page.waitForTimeout(500);
    }
    await smoothScroll(page, 400);

    // Section 3: WhatsApp Provider
    await speak(page, 'Section three, WhatsApp Outreach Provider, with an enable toggle checkbox.');
    const whatsappProviderSelect = page.locator('select').filter({ hasText: 'Meta Business WhatsApp' }).or(page.locator('select').filter({ hasText: 'Evolution' })).first();
    if (await whatsappProviderSelect.isVisible()) {
      await whatsappProviderSelect.selectOption('cloud');
      await page.waitForTimeout(1000);
      await speak(page, 'Meta Cloud API shows Phone Number ID, Access Token, Template Name, and Language Code.');
      await whatsappProviderSelect.selectOption('evolution');
      await page.waitForTimeout(1000);
      await speak(page, 'Evolution API shows the Base URL, Instance API key, Instance Name, and a custom text message template.');
      await whatsappProviderSelect.selectOption('whapi');
      await page.waitForTimeout(1000);
      await speak(page, 'Whapi dot cloud shows the bearer token field and a custom message template.');
      await whatsappProviderSelect.selectOption('cloud');
      await page.waitForTimeout(500);
    }
    await smoothScroll(page, 400);

    // Section 4: Twilio
    await speak(page, 'Section four, Twilio Voice Cold Calling. Configure the Account SID, Auth Token, From Phone Number, and Call Message Template for automated AI voice calls.');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 400);

    // Section 5: Jiji + Social Templates
    await speak(page, 'Section five, Jiji Bulk Messaging Outreach with login credentials and a customizable message template using dynamic placeholders.');
    await page.waitForTimeout(1500);
    await smoothScroll(page, 300);

    await speak(page, 'Below that, you can customize message templates for Instagram, Facebook, TikTok, and LinkedIn outreach channels. Each template supports lead name, rating, review count, preview URL, and signature placeholders.');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 500);

    // Dry Run toggle
    const dryRunCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /Dry Run/i }).or(page.getByText('Enable Dry Run')).first();
    await speak(page, 'Finally, the Dry Run Simulation Mode toggle. When enabled, no real API calls are made. This is essential for testing your pipeline safely.');
    await page.waitForTimeout(1500);

    // Save button
    await speak(page, 'Click Save Configuration Settings to persist all changes to the server.');
    await page.waitForTimeout(1500);

    // ═══════════════════════════════════════════════════════════════
    // PHASE 6 — GOOGLE SIGN-IN SIDEBAR
    // ═══════════════════════════════════════════════════════════════
    await speak(page, 'Back in the sidebar, the Google Cloud Integration panel lets you enter a Project ID and initiate OAuth sign-in. Once linked, your Google identity is displayed with a green status indicator and a sign-out button.');
    await page.waitForTimeout(2000);

    // Sync Pipeline button
    const syncBtn = page.locator('button', { hasText: 'Sync Pipeline' });
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
      await page.waitForTimeout(2000);
      await speak(page, 'The Sync Pipeline button in the header refreshes all stats, leads, and logs simultaneously.');
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 7 — PREVIEW PAGE
    // ═══════════════════════════════════════════════════════════════
    // Navigate to a preview page for an existing lead
    await page.goto('/preview/mock_social_instagram_1781407838565_0');
    await page.waitForTimeout(3000);
    await speak(page, 'This is the auto-generated AI-powered landing page for a scraped lead. Each business gets a unique, conversion-focused website.');

    // Preview banner
    await speak(page, 'The sticky preview banner at the top shows a personalized message and a Claim Website and Domain call-to-action button.');
    await page.waitForTimeout(1500);

    // Hero section
    await speak(page, 'The hero section features a dynamic background image, star rating badge, AI-generated headline and subtitle, and call-to-action buttons.');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 500);

    // Social proof bar
    await speak(page, 'The social proof reputation bar displays the Google rating, verified review count, and locally verified service badge.');
    await page.waitForTimeout(1500);
    await smoothScroll(page, 500);

    // Services grid
    await speak(page, 'The services grid shows AI-generated specialties with emoji icons, titles, and descriptions tailored to the business category.');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 600);

    // About section
    await speak(page, 'The About section includes the business address, phone number, an AI-generated description, and a workspace image with a reputation overlay card.');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 600);

    // Testimonials
    await speak(page, 'Customer testimonials are AI-generated based on the business category, with star ratings and reviewer names.');
    await page.waitForTimeout(1500);
    await smoothScroll(page, 600);

    // Automation demo form
    await speak(page, 'The Interactive Automation Demo section lets visitors test-drive the booking workflow. Lets try the Price Estimator.');
    await page.waitForTimeout(1000);

    // Click the Price Estimator tab
    const priceEstTab = page.locator('button', { hasText: 'Price Estimator' });
    if (await priceEstTab.isVisible()) {
      await priceEstTab.click();
      await page.waitForTimeout(1500);
      await speak(page, 'Switching to the Price Estimator widget to build a customized website quote.');
    }

    // Toggle some estimator checkboxes
    const crmCheckbox = page.locator('label', { hasText: 'CRM Customer Sync' }).locator('input[type="checkbox"]');
    if (await crmCheckbox.isVisible()) {
      await crmCheckbox.check();
      await page.waitForTimeout(500);
    }
    const payCheckbox = page.locator('label', { hasText: 'Payment Gateway' }).locator('input[type="checkbox"]');
    if (await payCheckbox.isVisible()) {
      await payCheckbox.check();
      await page.waitForTimeout(500);
    }

    const nameInput = page.locator('input[placeholder*="John"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Jane Doe');
      await page.waitForTimeout(500);
    }
    const emailInput = page.locator('input[placeholder*="name@example"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('jane@example.com');
      await page.waitForTimeout(500);
    }
    const phoneInput = page.locator('input[placeholder*="+234"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+234 802 987 6543');
      await page.waitForTimeout(500);
    }

    // Click Generate proposal
    const submitBtn = page.locator('button', { hasText: 'Generate Custom Proposal' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      await speak(page, 'The system immediately logs the lead in the background CRM database, triggers simulated WhatsApp chat alert messages, and builds a printable invoice estimate.');
    }

    // Verify WhatsApp simulator feed messages
    const liveFeedHeader = page.locator('strong', { hasText: 'Live Automation Feed' });
    if (await liveFeedHeader.isVisible()) {
      await speak(page, 'On the bottom right, the live WhatsApp simulator simulates automated notification streams to the business owner.');
      await page.waitForTimeout(1500);
    }

    // View printable invoice
    const viewInvoiceBtn = page.locator('button', { hasText: 'View Invoice & Receipt' });
    if (await viewInvoiceBtn.isVisible()) {
      await viewInvoiceBtn.click();
      await page.waitForTimeout(2000);
      await speak(page, 'Opening the automated receipt and invoice proposal. This shows the subtotal, taxes, and graded breakdown items.');
      await expect(page.locator('h2', { hasText: 'ESTIMATE / INVOICE' }).or(page.locator('span', { hasText: 'ESTIMATE / INVOICE' })).first()).toBeVisible();
      await page.waitForTimeout(1500);

      // Close the invoice modal
      const closeInvoiceBtn = page.locator('button').filter({ hasText: 'X' }).first();
      if (await closeInvoiceBtn.isVisible()) {
        await closeInvoiceBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    await smoothScroll(page, 400);

    // Verify Walkthrough Video & Pricing Strategy Section
    const pricingHeader = page.locator('h2', { hasText: 'How ApexReach Scales Your Business' });
    if (await pricingHeader.isVisible()) {
      await speak(page, 'We also display a walkthrough video showing how the system deploys landing pages, plus our standard graded pricing packages: Basic presence, Growth Engine, and Automated Powerhouse.');
      await page.waitForTimeout(2000);
    }

    // Claim section
    await speak(page, 'Finally, the Claim This Website and Domain section is the conversion goal. The business owner enters their name and email to request ownership of the auto-generated site.');
    await page.waitForTimeout(2000);

    // ═══════════════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════════════
    await speak(page, 'That concludes the full ApexReach walkthrough. We covered every feature: dashboard, CRM, all ten scrapers, logs, settings options, sector widgets, and live simulation feeds. Thank you for watching!');
    await page.waitForTimeout(2000);
  });
});
