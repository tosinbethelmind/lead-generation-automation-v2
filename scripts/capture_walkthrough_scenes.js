/**
 * @file scripts/capture_walkthrough_scenes.js
 * 
 * Captures 12 high-resolution (1280x720) visual scenes directly from the live
 * Dual-Line Obi Table Water OS application for video compilation.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, '..', 'public', 'walkthrough-scenes');
if (!fs.existsSync(scenesDir)) fs.mkdirSync(scenesDir, { recursive: true });

async function captureScenes() {
  console.log('📸 Capturing 12 High-Definition Video Scenes...');
  const browser = await chromium.launch({ headless: true });
  
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  try {
    // -------------------------------------------------------------
    // SCENE 1: Owner PIN Lock Screen
    // -------------------------------------------------------------
    console.log('Capturing Scene 1: Owner PIN Lock Screen...');
    await page.goto('https://www.bethelmindanalytics.com/factory/owner', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_01_owner_pin_empty.png') });

    // Scene 2: Owner Dual-Line Executive Dashboard (Top: P&L)
    console.log('Capturing Scene 2: Owner Dual-Line P&L Dashboard...');
    await page.locator('button:has-text("Demo Auto-Unlock (2026)")').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_02_owner_dashboard_top.png') });

    // Scene 3: Scroll down to PET Preforms & 19L Dispenser Jars
    console.log('Capturing Scene 3: PET Preforms & 19L Jar Deposit Tracker...');
    await page.evaluate(() => window.scrollBy(0, 480));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_03_owner_preforms_and_jars.png') });

    // Scene 4: Scroll down to Driver Shortage Audit & Diesel Slicer
    console.log('Capturing Scene 4: Driver Shortage Debit & Diesel Slicer...');
    await page.evaluate(() => window.scrollBy(0, 480));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_04_owner_driver_shortage.png') });

    // -------------------------------------------------------------
    // SCENE 5: Staff Login Screen (4 Big Cards)
    // -------------------------------------------------------------
    console.log('Capturing Scene 5: Staff Login (4 Big Cards)...');
    await page.goto('https://www.bethelmindanalytics.com/factory/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_05_staff_login_cards.png') });

    // -------------------------------------------------------------
    // SCENE 6: Kenneth Supervisor Sachet Line Console
    // -------------------------------------------------------------
    console.log('Capturing Scene 6: Kenneth Supervisor Sachet Line...');
    await page.locator('button:has-text("Enter")').nth(1).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(scenesDir, 'scene_06_kenneth_sachet_console.png') });

    // Scene 7: Kenneth Bottled Water & 19L Dispenser Jars Tab
    console.log('Capturing Scene 7: Kenneth Bottled Water Tab...');
    await page.locator('button:has-text("Bottled Water & Jars")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_07_kenneth_bottles_console.png') });

    // -------------------------------------------------------------
    // SCENE 8: Blessing Gate Cashier Multi-Product POS
    // -------------------------------------------------------------
    console.log('Capturing Scene 8: Blessing Gate Cashier POS...');
    await page.locator('button:has-text("Blessing (cashier)")').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(scenesDir, 'scene_08_blessing_gate_pos.png') });

    // -------------------------------------------------------------
    // SCENE 9: Musa Route Delivery Driver Manifest
    // -------------------------------------------------------------
    console.log('Capturing Scene 9: Musa Route Driver Manifest...');
    await page.locator('button:has-text("Musa (driver)")').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(scenesDir, 'scene_09_musa_driver_manifest.png') });

    // Scene 10: Scroll to Burst Pouch Rule & 19L Jar Deposit Rule
    console.log('Capturing Scene 10: Burst Pouch Rule & Jar Deposit Rule...');
    await page.evaluate(() => window.scrollBy(0, 380));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_10_musa_pouch_and_jar_rules.png') });

    // -------------------------------------------------------------
    // SCENE 11: 8:00 PM WhatsApp Evening Shift Sync & Summary
    // -------------------------------------------------------------
    console.log('Capturing Scene 11: 8:00 PM WhatsApp Shift Sync...');
    await page.goto('https://www.bethelmindanalytics.com/factory/owner', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Demo Auto-Unlock (2026)")').click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 1100));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_11_whatsapp_evening_sync.png') });

    // -------------------------------------------------------------
    // SCENE 12: NAFDAC Laboratory Quality Log & Certificate
    // -------------------------------------------------------------
    console.log('Capturing Scene 12: NAFDAC Quality Certificate...');
    await page.evaluate(() => window.scrollBy(0, -350));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(scenesDir, 'scene_12_nafdac_compliance_log.png') });

    console.log('🎉 ALL 12 HIGH-DEFINITION SCENES CAPTURED PERFECTLY!');

  } catch (err) {
    console.error('❌ Scene Capture Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScenes();
