const { chromium } = require('playwright');

async function testTriChannelApprovalFlow() {
  console.log('--- TESTING AUTOMATED TRI-CHANNEL APPROVAL MODAL & FLOW ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } }); // Mobile viewport

  try {
    // 1. Load the admin mobile page
    console.log('1. Loading http://localhost:3006/admin/mobile?pillar=pillar2 ...');
    await page.goto('http://localhost:3006/admin/mobile?pillar=pillar2', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForSelector('text=Verified Interested Buyer', { timeout: 15000 });
    console.log('✅ Page loaded successfully in Pillar 2 mode.');

    // 2. Locate the 1-Tap Approve button
    const approveBtn = page.locator('button:has-text("1-Tap Approve")').first();
    const btnExists = await approveBtn.count() > 0;
    console.log(`Found [🚀 1-Tap Approve] button: ${btnExists}`);

    if (btnExists) {
      console.log('Clicking [🚀 1-Tap Approve]...');
      await approveBtn.click();

      // Verify the progress modal appears
      await page.waitForSelector('text=AUTOMATED TRI-CHANNEL DISPATCH', { timeout: 5000 });
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

      // Wait for completion (backend simulation + dispatch)
      console.log('Waiting for automation completion banner...');
      await page.waitForSelector('text=ALL 3 PLATFORMS AUTOMATED & DISPATCHED', { timeout: 15000 });
      console.log('🎉 Automation successfully completed across all 3 platforms!');

      // Take visual verification screenshot
      await page.screenshot({ path: 'public/qa-screenshots/tri_channel_approval_modal_live.png' });
      console.log('📸 Saved verification screenshot to public/qa-screenshots/tri_channel_approval_modal_live.png');
    }

  } catch (err) {
    console.error('❌ Test Error:', err.message);
  } finally {
    await browser.close();
  }
}

testTriChannelApprovalFlow();
