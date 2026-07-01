import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe.configure({ mode: 'serial' });

const SCRAPERS = [
  { id: 'google', name: 'Google Places API', query: 'sandbox dentist' },
  { id: 'maps-free', name: 'Google Maps (Free)', query: 'sandbox dentist' },
  { id: 'duckduckgo', name: 'DuckDuckGo Search', query: 'sandbox dentist' },
  { id: 'osm', name: 'OpenStreetMap', query: 'sandbox dentist' },
  { id: 'jiji', name: 'Jiji Crawler', query: 'sandbox dentist' },
  { id: 'instagram', name: 'Instagram Scraper', query: 'sandbox dentist' },
  { id: 'facebook', name: 'Facebook Scraper', query: 'sandbox dentist' },
  { id: 'tiktok', name: 'TikTok Scraper', query: 'sandbox dentist' }
];

for (const scraper of SCRAPERS) {
  test(`E2E Hybrid Queue Scrape Test - ${scraper.name}`, async ({ page }) => {
    // Set a reasonable timeout for individual actions
    page.setDefaultTimeout(20000);

    // Set localStorage onboarding_complete to true before the page loads to skip setup wizard
    await page.addInitScript(() => {
      window.localStorage.setItem('onboarding_complete', 'true');
    });

    // Listen for console logs inside the browser page
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    // Listen for unhandled exceptions inside the browser page
    page.on('pageerror', exception => {
      console.error(`[BROWSER EXCEPTION] ${exception.message}`);
    });

    try {
      console.log(`🚀 Loading app and testing scraper: ${scraper.name}...`);
      
      // Use the configured baseURL
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Wait for the body to be visible
      await page.locator('body').waitFor({ state: 'visible' });

      // Dismiss any existing stuck banners (e.g. error banner)
      const errorCloseButton = page.locator('button.absolute.right-4, button[aria-label="Close"], button:has-text("x"), button:has-text("×")');
      const count = await errorCloseButton.count().catch(() => 0);
      if (count > 0) {
        console.log(`Dismissing ${count} existing banners...`);
        for (let i = 0; i < count; i++) {
          await errorCloseButton.nth(i).click().catch(() => {});
        }
      }

      // Click on the Maps Scraper button in the sidebar to navigate (with hydration-resilient retry)
      console.log('Navigating to Maps Scraper tab...');
      const mapsScraperSidebar = page.locator('button:has-text("Maps Scraper")').first();
      await mapsScraperSidebar.click();

      // Verify if tab content renders. If not, retry click.
      let tabActive = false;
      for (let i = 0; i < 5; i++) {
        const isCardRendered = await page.locator(`#scraper-card-${scraper.id}`).isVisible().catch(() => false);
        if (isCardRendered) {
          tabActive = true;
          break;
        }
        console.log(`Tab content not visible yet (attempt ${i + 1}/5). Retrying tab click...`);
        await page.waitForTimeout(1000);
        await mapsScraperSidebar.click().catch(() => {});
      }

      if (!tabActive) {
        throw new Error(`Failed to switch to Scrapers tab for ${scraper.name}.`);
      }
      console.log(`✅ Navigated to Scrapers tab for ${scraper.name}.`);

      // Click the scraper provider card (with hydration-resilient retry)
      console.log(`Selecting ${scraper.name} provider card...`);
      const providerCard = page.locator(`#scraper-card-${scraper.id}`).first();
      await providerCard.click();

      // Locate the search query input by placeholder variations
      const queryInput = page.locator('input[placeholder*="Dentists"], input[placeholder*="cars"], input[placeholder*="keyword"], input[placeholder*="search"]').first();

      // Verify if scraper options input renders. If not, retry click.
      let cardSelected = false;
      for (let i = 0; i < 5; i++) {
        const isInputVisible = await queryInput.isVisible().catch(() => false);
        if (isInputVisible) {
          cardSelected = true;
          break;
        }
        console.log(`Query input not visible yet (attempt ${i + 1}/5). Retrying card click...`);
        await page.waitForTimeout(1000);
        await providerCard.click().catch(() => {});
      }

      if (!cardSelected) {
        throw new Error(`Failed to select ${scraper.name} card.`);
      }
      console.log(`✅ ${scraper.name} card selected.`);

      // Fill in the query input
      console.log(`Typing sandbox query: "${scraper.query}"...`);
      await queryInput.fill(scraper.query);
      console.log('✅ Filled query.');

      // Click 'Execute Scraper'
      console.log('Clicking Execute Scraper button...');
      const executeButton = page.locator('button:has-text("Execute Scraper")').first();
      await executeButton.click();
      console.log('✅ Clicked Execute Scraper.');

      // Wait for the status indicator to show queueing or running
      console.log('Monitoring status changes...');
      const statusSpan = page.locator('span', { hasText: /Job queued|Waiting|Executing/ }).first();
      await expect(statusSpan).toBeVisible({ timeout: 15000 });
      const initialText = await statusSpan.textContent();
      console.log(`✅ Status banner visible: "${initialText?.trim()}"`);

      // Wait for completion status message (usually within 10-20 seconds in sandbox mode)
      console.log('Waiting for job completion...');
      const successSpan = page.locator('span', { hasText: /completed|success/i }).first();
      await expect(successSpan).toBeVisible({ timeout: 45000 });
      const finalText = await successSpan.textContent();
      console.log(`🎉 Success banner visible: "${finalText?.trim()}"`);
      console.log(`🎉 ${scraper.name} test completed successfully!`);
    } catch (err: any) {
      console.error(`❌ ${scraper.name} test failed with error:`, err.message);
      const screenshotPath = path.resolve(process.cwd(), `scratch/failure_${scraper.id}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Saved failure screenshot to: ${screenshotPath}`);
      throw err;
    }
  });
}
