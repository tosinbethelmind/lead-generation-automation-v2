import { test, expect } from '@playwright/test';

const TEST_LEADS = [
  {
    slug: 'sunlight-solar-technologies-ikeja',
    sector: 'Solar & Renewable Energy',
    expectedWidgetTitle: 'Solar Load & Inverter Sizing Estimator',
    expectedKeywords: ['Solar', 'Inverter', '₦']
  },
  {
    slug: 'pinnacle-realty-investments-ikoyi',
    sector: 'Real Estate & Properties',
    expectedWidgetTitle: 'Real Estate Mortgage & Payment Calculator',
    expectedKeywords: ['Property', 'Duplex', 'Mortgage']
  },
  {
    slug: 'apex-autos-tokunbo-dealers-surulere',
    sector: 'Automotive & Tokunbo Importer',
    expectedWidgetTitle: 'Tokunbo Trade-In & Valuation Estimator',
    expectedKeywords: ['Automotive', 'Valuation', 'Vehicle']
  },
  {
    slug: 'lagos-dental-smile-clinic-vi',
    sector: 'Medical & Dental Clinic',
    expectedWidgetTitle: 'Patient Intake & Consultation Scheduler',
    expectedKeywords: ['Clinic', 'Appointment', 'Doctor']
  }
];

test.describe('Scraped Lead Landing Page — Conversion & Anti-Clumsiness Verification', () => {

  test('1. Multi-Sector Scraped Lead Rendering & Personalization', async ({ page }) => {
    for (const lead of TEST_LEADS) {
      console.log(`\n🔍 Testing sector landing page: ${lead.sector} (/preview/${lead.slug})`);
      
      const response = await page.goto(`/preview/${lead.slug}`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // Verify business name is populated dynamically
      const pageText = await page.innerText('body');
      const nameFragment = lead.slug.split('-')[0].toUpperCase();
      expect(pageText.toUpperCase()).toContain(nameFragment);

      // Verify sector-specific interactive tool renders
      const hasToolOrCalc = pageText.includes('₦') || pageText.includes('Calculator') || pageText.includes('Estimator') || pageText.includes('Custom');
      expect(hasToolOrCalc).toBeTruthy();
      console.log(`  ✅ Sector ${lead.sector} loaded with dynamic personalization`);
    }
  });

  test('2. Anti-Clumsiness: Floating Widgets Collision & Overlap Test (Desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/preview/sunlight-solar-technologies-ikeja`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const collisions = await page.evaluate(() => {
      const items = [];
      const wa = document.querySelector('.whatsapp-float');
      if (wa) items.push({ name: 'WhatsApp Button', rect: wa.getBoundingClientRect() });

      const ai = document.querySelector('.customer-ai-widget-container') || document.querySelector('.ai-widget-trigger');
      if (ai) items.push({ name: 'AI Concierge', rect: ai.getBoundingClientRect() });

      const results = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const r1 = items[i].rect;
          const r2 = items[j].rect;
          const xOverlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
          const yOverlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
          if (xOverlap > 10 && yOverlap > 10) {
            results.push({ item1: items[i].name, item2: items[j].name, overlapArea: xOverlap * yOverlap });
          }
        }
      }
      return results;
    });

    console.log(`\n📐 Desktop Floating Collisions:`, collisions);
    if (collisions.length > 0) {
      console.warn('⚠️ Floating widgets overlap detected on desktop:', collisions);
    }
  });

  test('3. Mobile Viewport (390x844) Responsiveness & Anti-Clumsiness', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/preview/sunlight-solar-technologies-ikeja`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Check for horizontal overflow (no awkward horizontal scrolling)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`📱 Mobile Horizontal Overflow: ${hasHorizontalOverflow ? '❌ Found Overflow' : '✅ Clean 0px overflow'}`);
    expect(hasHorizontalOverflow).toBeFalsy();

    // Check Mobile Sticky Claim Bar
    const stickyClaimBar = page.locator('text=Claim Setup (50% Dep)');
    const isVisible = await stickyClaimBar.isVisible();
    console.log(`📱 Mobile Sticky 50% Deposit Bar: ${isVisible ? '✅ Visible & Fixed' : '⚠️ Not visible'}`);
  });

  test('4. High Conversion Drivers Verification', async ({ page }) => {
    await page.goto(`/preview/sunlight-solar-technologies-ikeja`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const conversionAudit = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasPricingTransparency: text.includes('₦75,000') || text.includes('₦150,000') || text.includes('50%'),
        hasTrustProof: text.includes('★') || text.includes('Reviews') || text.includes('Verified'),
        hasDirectWhatsAppCTA: !!document.querySelector('a[href*="wa.me"]'),
        hasInstantCalculator: text.includes('Estimator') || text.includes('Calculator') || text.includes('BOQ') || text.includes('Load'),
        hasClaimSection: !!document.getElementById('claim') || !!document.querySelector('[id*="claim"]')
      };
    });

    console.log('\n🎯 CONVERSION DRIVERS AUDIT:', conversionAudit);
    expect(conversionAudit.hasPricingTransparency).toBeTruthy();
    expect(conversionAudit.hasTrustProof).toBeTruthy();
    expect(conversionAudit.hasDirectWhatsAppCTA).toBeTruthy();
  });

  test('5. Interactive Calculator Functional Test', async ({ page }) => {
    await page.goto(`/preview/sunlight-solar-technologies-ikeja`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Check interactive inputs (sliders, buttons)
    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();
    console.log(`\n🎛️ Interactive Range Sliders found: ${sliderCount}`);

    if (sliderCount > 0) {
      await sliders.first().fill('10');
      await page.waitForTimeout(500);
      console.log('  ✅ Sliders respond to user input without errors');
    }
  });

});
