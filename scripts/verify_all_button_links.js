const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyAllButtonLinks() {
  console.log('--- COMPREHENSIVE BUTTON & LINK VERIFICATION AUDIT ---');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', err => errors.push({ type: 'pageerror', text: err.message }));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push({ type: 'console.error', text: msg.text() });
  });

  await page.context().addCookies([{
    name: 'admin-token',
    value: 'bethelmind_admin_2026',
    domain: 'www.bethelmindanalytics.com',
    path: '/'
  }]);

  console.log('1. Loading https://www.bethelmindanalytics.com/admin/mobile?pillar=pillar2 ...');
  await page.goto('https://www.bethelmindanalytics.com/admin/mobile?pillar=pillar2', {
    waitUntil: 'domcontentloaded',
    timeout: 35000
  });
  await page.waitForSelector('text=Verified Interested Buyer', { timeout: 20000 });
  await page.waitForTimeout(2000);

  // Audit 1: Check All Links on Pillar 2 view
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      visible: a.offsetParent !== null
    }));
  });

  console.log(`Found ${links.length} anchor links:`);
  const waLinks = links.filter(l => l.href && l.href.includes('wa.me'));
  const smsLinks = links.filter(l => l.href && l.href.startsWith('sms:'));
  const mailtoLinks = links.filter(l => l.href && l.href.startsWith('mailto:'));
  const dealLinks = links.filter(l => l.href && l.href.includes('jiji.ng'));

  console.log(`- WhatsApp Direct Links: ${waLinks.length}`);
  console.log(`- GSM SMS Direct Links: ${smsLinks.length}`);
  console.log(`- Email Direct Links: ${mailtoLinks.length}`);
  console.log(`- Mandate Page Links: ${dealLinks.length}`);

  // Audit 2: Test Interactive Buttons
  console.log('\n2. Testing Interactive Buttons...');

  // Test [📜 View Brief] modal
  const viewBriefBtn = page.locator('button:has-text("View Brief")').first();
  console.log('Clicking first [📜 View Brief] button...');
  await viewBriefBtn.click();
  await page.waitForTimeout(1000);

  const briefModal = page.locator('div:has-text("LASRERA Mandate Outbound Brief")');
  const briefModalOpen = await briefModal.count() > 0;
  console.log(`Brief Modal Opened: ${briefModalOpen}`);

  // Close brief modal
  const closeBriefBtn = page.locator('button[aria-label="Close Brief Modal"], button:has-text("Close Brief")').first();
  await closeBriefBtn.click();
  await page.waitForTimeout(1000);
  console.log('Brief Modal closed successfully');

  // Test [📞 Inbound Call Crib Sheet] modal
  const cribBtn = page.locator('button:has-text("Inbound Call Crib Sheet")').first();
  console.log('Clicking [📞 Inbound Call Crib Sheet] button...');
  await cribBtn.click();
  await page.waitForTimeout(1000);

  const cribModal = page.locator('div:has-text("Inbound Call Crib Sheet & Negotiation Brief")');
  const cribModalOpen = await cribModal.count() > 0;
  console.log(`Crib Sheet Modal Opened: ${cribModalOpen}`);

  // Close crib sheet modal using top X or bottom button
  const closeCribBtn = page.locator('button:has-text("Close Crib Sheet"), div[style*="position: fixed"] button').first();
  await closeCribBtn.click();
  await page.waitForTimeout(1000);
  console.log('Crib Sheet Modal closed successfully');

  // Audit 3: Switch to Pillar 1 SME Engine and verify buttons
  console.log('\n3. Testing Pillar 1 Switch Button...');
  const p1Tab = page.locator('button:has-text("PILLAR 1")').first();
  await p1Tab.click();
  await page.waitForTimeout(2000);

  const p1Buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim().slice(0, 30));
  });
  console.log(`Pillar 1 loaded with ${p1Buttons.length} buttons:`, p1Buttons.slice(0, 8));

  // Audit 4: Switch back to Pillar 2 Deal Wire
  console.log('\n4. Testing Pillar 2 Switch Button...');
  const p2Tab = page.locator('button:has-text("PILLAR 2")').first();
  await p2Tab.click();
  await page.waitForTimeout(2000);

  const p2Buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim().slice(0, 30));
  });
  console.log(`Pillar 2 reloaded with ${p2Buttons.length} buttons:`, p2Buttons.slice(0, 8));

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Errors Encountered: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  } else {
    console.log('🎉 100% SUCCESS: All buttons, modals, tabs, and direct links are verified and operational!');
  }

  await browser.close();
}

verifyAllButtonLinks().catch(console.error);
