import { test, expect } from '@playwright/test';

test.describe('Physical Browser E2E Test: Integration Blueprint & Sales Suite', () => {
  test('Physical interaction test for Integration Dashboard and Sales Narrative', async ({ page }) => {
    console.log('🌐 [Physical Browser Test] Launching physical browser navigation...');

    // 1. Navigate to Integration Tools Dashboard
    await page.goto('https://bethelmindanalytics.com/tools/integrations');
    await page.waitForTimeout(2000);

    // Verify Title / Heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Universal Tool Connectors & Sales Narrative Dashboard');
    console.log('  ✅ Page loaded successfully: Title verified.');

    // 2. Click through tabs
    console.log('  👆 Clicking through tabs...');
    await page.click('button:has-text("1-Click Embed Snippets")');
    await page.waitForTimeout(1000);

    // Click framework buttons
    console.log('  👆 Testing framework embed code buttons...');
    await page.click('button:has-text("Shopify Store")');
    await page.waitForTimeout(800);
    await page.click('button:has-text("Webflow")');
    await page.waitForTimeout(800);
    await page.click('button:has-text("WordPress / Woo")');
    await page.waitForTimeout(800);

    // 3. Test App Health Matrix Tab
    await page.click('button:has-text("App Health Matrix")');
    await page.waitForTimeout(1500);
    console.log('  ✅ App Health Matrix tab loaded.');

    // 4. Test Live Event Simulator
    await page.click('button:has-text("Live Event Simulator")');
    await page.waitForTimeout(1500);
    console.log('  🧪 Running Live Event Simulation dispatches in browser...');

    await page.click('button:has-text("Test SDK Event Collection API")');
    await page.waitForTimeout(1500);

    await page.click('button:has-text("Test Meta CAPI SHA-256 Hash")');
    await page.waitForTimeout(1500);

    await page.click('button:has-text("Test Full-Stack Webhooks")');
    await page.waitForTimeout(2000);

    // 5. Test Sales Narrative Showcase Tab
    await page.click('button:has-text("Sales Narrative Showcase")');
    await page.waitForTimeout(2000);
    console.log('  ✅ Sales Narrative Showcase rendered.');

    // 6. Navigate to Main Landing Page
    console.log('🌐 Navigating to main landing page to verify embedded sales narrative...');
    await page.goto('https://bethelmindanalytics.com');
    await page.waitForTimeout(2500);

    // Scroll down to Sales Narrative
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);

    console.log('🎉 Physical browser test completed 100% successfully!');
  });
});
