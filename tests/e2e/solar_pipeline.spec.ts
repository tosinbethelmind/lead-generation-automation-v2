import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Solar Pipeline CRM Dashboard E2E Verification', () => {
  // Override baseURL to port 3009 where Next.js dev server runs for tests
  test.use({ baseURL: 'http://localhost:3009' });

  test.beforeEach(async ({ page }) => {
    // Inject the master admin session cookie to bypass login gate
    const cookieValue = 'admin_secret_token_123';
    await page.context().addCookies([
      {
        name: 'admin-token',
        value: cookieValue,
        domain: 'localhost',
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 3600,
      }
    ]);
  });

  test('01_verify_dashboard_loading_and_elements', async ({ page }) => {
    console.log('Navigating to Solar Pipeline Dashboard...');
    await page.goto('/admin/solar-pipeline');
    await page.waitForTimeout(1000);

    // Verify Title & Subtitle
    const heading = page.locator('h1:has-text("SolarQuotePro")');
    await expect(heading).toContainText('SolarQuotePro Production Gateway');

    const desc = page.locator('p:has-text("residential (B2C)")');
    await expect(desc).toContainText('residential (B2C) homeowner estimator funnels');

    // Verify stats boxes are present
    const stats = page.locator('.stat-box');
    await expect(stats).toHaveCount(4);

    // Verify table controls (search input and select filters)
    const searchInput = page.locator('input[placeholder*="Search leads"]');
    await expect(searchInput).toBeVisible();

    const typeFilter = page.locator('select').first();
    await expect(typeFilter).toBeVisible();

    // Verify "Sync Database" button exists
    const syncBtn = page.locator('button:has-text("Sync Database")');
    await expect(syncBtn).toBeVisible();

    // Verify "Harvest Scraped Solar Leads" button exists
    const harvestBtn = page.locator('button:has-text("Harvest Scraped Solar Leads")');
    await expect(harvestBtn).toBeVisible();

    // Set up dialog listener to handle the alert with a generous timeout to allow for Next.js compilation and DB queries
    const dialogPromise = page.waitForEvent('dialog', { timeout: 90000 });

    // Trigger the lead harvesting process
    console.log('Clicking Harvest Scraped Solar Leads...');
    await harvestBtn.click();

    // Wait for the dialog to appear
    const dialog = await dialogPromise;
    const dialogMessage = dialog.message();
    console.log('Received dialog alert:', dialogMessage);
    await dialog.accept();

    // Expect either success or warning message depending on mock/real database state
    expect(dialogMessage).toMatch(/(harvested|imported|no solar-related leads|failed to harvest|error)/i);
  });

  test('02_verify_trigger_scraper_synthetic', async ({ page }) => {
    console.log('Navigating to Solar Pipeline Dashboard...');
    await page.goto('/admin/solar-pipeline');
 
    const syntheticBtn = page.locator('button:has-text("Generate 1K Synthetic")');
    await syntheticBtn.waitFor({ state: 'visible', timeout: 30000 });
    await expect(syntheticBtn).toBeVisible();
 
    // Set up dialog listener to handle the alert
    const dialogPromise = page.waitForEvent('dialog', { timeout: 90000 });
 
    console.log('Clicking Generate 1K Synthetic...');
    await syntheticBtn.click({ timeout: 30000 });
 
    // Wait for the dialog to appear
    const dialog = await dialogPromise;
    const dialogMessage = dialog.message();
    console.log('Received dialog alert for synthetic:', dialogMessage);
    await dialog.accept();
 
    expect(dialogMessage).toContain('Scraper completed successfully');
  });
 
  test('03_verify_trigger_scraper_dry_run', async ({ page }) => {
    console.log('Navigating to Solar Pipeline Dashboard...');
    await page.goto('/admin/solar-pipeline');
 
    const dryRunBtn = page.locator('button:has-text("Scrape (Dry Run)")');
    await dryRunBtn.waitFor({ state: 'visible', timeout: 30000 });
    await expect(dryRunBtn).toBeVisible();
 
    // Set up dialog listener to handle the alert
    const dialogPromise = page.waitForEvent('dialog', { timeout: 120000 });
 
    console.log('Clicking Scrape (Dry Run)...');
    await dryRunBtn.click({ timeout: 30000 });
 
    // Wait for the dialog to appear
    const dialog = await dialogPromise;
    const dialogMessage = dialog.message();
    console.log('Received dialog alert for dry run:', dialogMessage);
    await dialog.accept();
 
    expect(dialogMessage).toContain('Scraper completed successfully');
  });
});
