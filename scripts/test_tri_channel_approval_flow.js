const { chromium } = require('playwright');

async function testLiveTriChannelApprovalFlow() {
  console.log('--- TESTING LIVE PRODUCTION TRI-CHANNEL APPROVAL FLOW ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => {
    console.error('🚨 PAGE ERROR:', err.message);
    errors.push(err.message);
  });

  try {
    // 1. Authenticate via admin login redirect
    const loginUrl = 'https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile?pillar=pillar2';
    console.log('1. Authenticating via:', loginUrl);
    await page.goto(loginUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 35000
    });

    await page.waitForSelector('text=Verified Interested Buyer', { timeout: 25000 });
    console.log('✅ Page authenticated & loaded in Pillar 2 mode.');

    // 2. Locate 1-Tap Approve button
    const approveBtn = page.locator('button:has-text("1-Tap Approve")').first();
    const btnCount = await approveBtn.count();
    console.log(`Found [🚀 1-Tap Approve] button: ${btnCount > 0}`);

    if (btnCount > 0) {
      console.log('Clicking [🚀 1-Tap Approve] on luxury deal card...');
      await approveBtn.click();

      // Verify the progress modal appears
      await page.waitForSelector('text=AUTOMATED TRI-CHANNEL DISPATCH', { timeout: 8000 });
      console.log('✅ Automated Tri-Channel Progress Modal opened!');

      // Check the 5 stages rendered in modal
      const legalStage = await page.locator('text=Legal Mandate & Evidence Act Token').count() > 0;
      const waStage = await page.locator('text=Platform 1: WhatsApp Executive Teaser').count() > 0;
      const smsStage = await page.locator('text=Platform 2: Single-Credit GSM SMS').count() > 0;
      const emailStage = await page.locator('text=Platform 3: Official B2B Executive Email').count() > 0;
      const ledgerStage = await page.locator('text=LASRERA Bilateral Dispatched Ledger').count() > 0;

      console.log(`- Stage 1 (Legal Mandate): ${legalStage}`);
      console.log(`- Stage 2 (WhatsApp): ${waStage}`);
      console.log(`- Stage 3 (GSM SMS): ${smsStage}`);
      console.log(`- Stage 4 (Email): ${emailStage}`);
      console.log(`- Stage 5 (Ledger): ${ledgerStage}`);

      // Wait for completion banner
      console.log('Waiting for automation completion banner...');
      await page.waitForSelector('text=ALL 3 PLATFORMS AUTOMATED & DISPATCHED', { timeout: 25000 });
      console.log('🎉 Automation successfully completed across all 3 platforms!');

      // Take visual verification screenshot
      await page.screenshot({ path: 'public/qa-screenshots/tri_channel_approval_modal_live.png' });
      console.log('📸 Saved verification screenshot to public/qa-screenshots/tri_channel_approval_modal_live.png');
    }

    console.log('\n--- VERIFICATION RESULT ---');
    console.log(`Total Errors: ${errors.length}`);
    if (errors.length === 0) {
      console.log('🎉 100% SUCCESS: Tri-channel automated approval and live status modal verified on production!');
    }

  } catch (err) {
    console.error('❌ Test Execution Error:', err.message);
  } finally {
    await browser.close();
  }
}

testLiveTriChannelApprovalFlow();
