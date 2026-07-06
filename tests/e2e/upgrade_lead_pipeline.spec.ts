import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

test.describe('Website Upgrade & Modernization Lead Pipeline E2E Verification', () => {
  // Override baseURL to port 3006 where Next.js dev server runs
  test.use({ baseURL: 'http://localhost:3006' });

  let originalConfig: string;
  const configPath = path.join(__dirname, '../../config.json');
  const leadsDbPath = path.join(__dirname, '../../local_db/leads_db.json');

  const mockLeads = [
    {
      lead_id: 'mock_upgrade_lead_1',
      source: 'GOOGLE',
      name: 'Luxe Couture Lagos Upgrade',
      category: 'fashion',
      phone_e164: '+2348000000001',
      phone_raw: '08000000001',
      email: 'luxe-upgrade@example.com',
      website: 'https://luxe-existing-site.com',
      status: 'NEW',
      collected_at: new Date().toISOString(),
      rating: 4.5,
      reviews_count: 23,
      area: 'Lekki Phase 1',
      city: 'Lagos'
    },
    {
      lead_id: 'mock_new_build_lead_1',
      source: 'GOOGLE',
      name: 'New Couture Lagos Build',
      category: 'fashion',
      phone_e164: '+2348000000002',
      phone_raw: '08000000002',
      email: 'new-build@example.com',
      website: 'None',
      status: 'NEW',
      collected_at: new Date().toISOString(),
      rating: 4.2,
      reviews_count: 12,
      area: 'Ikeja',
      city: 'Lagos'
    }
  ];

  test.beforeAll(async () => {
    // 1. Save original config
    originalConfig = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(originalConfig);
    
    // Save current storageMode & dryRun
    parsed.storageMode = 'local';
    parsed.dryRun = true;
    fs.writeFileSync(configPath, JSON.stringify(parsed, null, 2));

    // 2. Seed local JSON database
    const localDbDir = path.join(__dirname, '../../local_db');
    if (!fs.existsSync(localDbDir)) {
      fs.mkdirSync(localDbDir, { recursive: true });
    }
    fs.writeFileSync(leadsDbPath, JSON.stringify(mockLeads, null, 2));

    // 3. Seed Supabase database if configured (since environment variable STORAGE_MODE might override configuration)
    const origParsed = JSON.parse(originalConfig);
    const supabaseUrl = origParsed.supabaseUrl;
    const supabaseKey = origParsed.supabaseKey;
    if (supabaseUrl && supabaseKey) {
      console.log('Seeding mock leads to Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const toInsert = mockLeads.map(l => ({
        lead_id: l.lead_id,
        source: l.source,
        name: l.name,
        category: l.category,
        address: '',
        area: l.area,
        city: l.city,
        phone_e164: l.phone_e164,
        phone_raw: l.phone_raw,
        email: l.email,
        website: l.website,
        rating: l.rating,
        reviews_count: l.reviews_count,
        status: l.status,
        collected_at: l.collected_at,
        notes: '[source:GOOGLE]Mock Lead for E2E validation',
        generated_copy: null,
        design_theme: null
      }));

      // Delete potential leftover leads first
      await supabase.from('leads').delete().in('lead_id', ['mock_upgrade_lead_1', 'mock_new_build_lead_1']);
      
      const { error } = await supabase.from('leads').insert(toInsert);
      if (error) {
        console.warn('Failed to seed leads in Supabase:', error.message);
      } else {
        console.log('Seeded leads successfully in Supabase.');
      }
    }
  });

  test.afterAll(async () => {
    // Restore config
    if (originalConfig) {
      fs.writeFileSync(configPath, originalConfig);
    }

    // Cleanup local leads database
    if (fs.existsSync(leadsDbPath)) {
      fs.unlinkSync(leadsDbPath);
    }

    // Cleanup Supabase database
    const origParsed = JSON.parse(originalConfig);
    const supabaseUrl = origParsed.supabaseUrl;
    const supabaseKey = origParsed.supabaseKey;
    if (supabaseUrl && supabaseKey) {
      console.log('Cleaning up mock leads from Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('leads').delete().in('lead_id', ['mock_upgrade_lead_1', 'mock_new_build_lead_1']);
      if (error) {
        console.warn('Failed to cleanup leads from Supabase:', error.message);
      } else {
        console.log('Cleaned up leads successfully from Supabase.');
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => console.log(`[BROWSER UNCAUGHT EXCEPTION] ${err.message}`));
    page.on('requestfailed', request => console.log(`[BROWSER REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`));
  });

  test('01_dashboard_crm_filtering_by_project_type', async ({ page }) => {
    // Complete onboarding localStorage to skip wizard
    await page.addInitScript(() => {
      window.localStorage.setItem('onboarding_complete', 'true');
    });

    console.log('Loading dashboard...');
    await page.goto('/');
    await page.waitForTimeout(1000);

    console.log('Navigating to Leads CRM...');
    const crmBtn = page.locator('button', { hasText: 'Leads CRM' });
    await crmBtn.click();
    await page.waitForTimeout(1000);

    // Verify both mock leads are displayed under "All Project Types"
    console.log('Verifying all project types filter default...');
    const rowsAll = page.locator('tbody tr');
    await expect(rowsAll.filter({ hasText: 'Luxe Couture Lagos Upgrade' })).toBeVisible();
    await expect(rowsAll.filter({ hasText: 'New Couture Lagos Build' })).toBeVisible();

    // Select "Modernization & Upgrade-Ready (Has Site)"
    console.log('Filtering by Modernization & Upgrade-Ready...');
    const websiteFilterSelect = page.locator('select').nth(2); // 3rd dropdown in filters row
    await websiteFilterSelect.selectOption('UPGRADE');
    await page.waitForTimeout(800);

    // Assert only Luxe Couture Lagos Upgrade is visible
    await expect(rowsAll.filter({ hasText: 'Luxe Couture Lagos Upgrade' })).toBeVisible();
    await expect(rowsAll.filter({ hasText: 'New Couture Lagos Build' })).not.toBeVisible();

    // Select "New Build Prospects (No Site)"
    console.log('Filtering by New Build Prospects...');
    await websiteFilterSelect.selectOption('NEW_BUILD');
    await page.waitForTimeout(800);

    // Assert only New Couture Lagos Build is visible
    await expect(rowsAll.filter({ hasText: 'Luxe Couture Lagos Upgrade' })).not.toBeVisible();
    await expect(rowsAll.filter({ hasText: 'New Couture Lagos Build' })).toBeVisible();
  });

  test('02_preview_generation_rules_for_upgrade_lead', async ({ page }) => {
    console.log('Loading generated landing page preview for UPGRADE lead...');
    // We navigate to /preview/mock_upgrade_lead_1 directly which triggers copy generation if not cached
    await page.goto('/preview/mock_upgrade_lead_1');

    // Wait for the copy generation/theme loading screen to disappear
    console.log('Waiting for generation process to complete...');
    await page.locator('text=Generating custom design theme').waitFor({ state: 'detached', timeout: 30000 });

    // Scroll down to the booking/customizer section
    await page.evaluate(() => {
      window.scrollTo(0, 800);
    });
    await page.waitForTimeout(1000);

    // Assert upgrade-focused copywriting and CTAs are rendered
    const step1TitleUpgrade = page.locator('text=Step 1: Choose System Automations');
    await expect(step1TitleUpgrade).toBeVisible({ timeout: 15000 });

    const subtitleUpgrade = page.locator('text=Select Interactive Features for Your Website');
    await expect(subtitleUpgrade).toBeVisible();

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const ctaUpgradeButton = page.locator('a:has-text("Secure My Website Upgrade & Automations")');
    await expect(ctaUpgradeButton).toBeVisible();
  });

  test('03_preview_generation_rules_for_new_build_lead', async ({ page }) => {
    console.log('Loading generated landing page preview for NEW BUILD lead...');
    await page.goto('/preview/mock_new_build_lead_1');

    // Wait for the copy generation/theme loading screen to disappear
    console.log('Waiting for generation process to complete...');
    await page.locator('text=Generating custom design theme').waitFor({ state: 'detached', timeout: 30000 });

    // Scroll down to booking/customizer section
    await page.evaluate(() => {
      window.scrollTo(0, 800);
    });
    await page.waitForTimeout(1000);

    // Assert new-build-focused copywriting and CTAs are rendered
    const step1TitleNewBuild = page.locator('text=Step 1: Choose Website Automations');
    await expect(step1TitleNewBuild).toBeVisible({ timeout: 15000 });

    const subtitleNewBuild = page.locator('text=Select Interactive Features for Your Site');
    await expect(subtitleNewBuild).toBeVisible();

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const ctaNewBuildButton = page.locator('a:has-text("Secure My Custom Website & Domain")');
    await expect(ctaNewBuildButton).toBeVisible();
  });
});
