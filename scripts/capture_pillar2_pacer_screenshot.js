const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  console.log('📸 Launching Chromium for Pillar 2 Paced Outreach Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3006/admin/mobile?pillar=pillar2 ...');
    await page.goto('http://localhost:3006/admin/mobile?pillar=pillar2', {
      waitUntil: 'networkidle',
      timeout: 20000
    });

    await page.waitForTimeout(2000);

    const publicOut = path.join(process.cwd(), 'public', 'qa-screenshots', 'pillar2_paced_outreach_verified.png');
    const artifactOut = path.join('C:\\Users\\HomePC\\.gemini\\antigravity\\brain\\c3ce0b4b-c3e9-42a5-9605-2ee548b49f2d', 'pillar2_paced_outreach_verified.png');

    fs.mkdirSync(path.dirname(publicOut), { recursive: true });
    fs.mkdirSync(path.dirname(artifactOut), { recursive: true });

    await page.screenshot({ path: publicOut, fullPage: false });
    await page.screenshot({ path: artifactOut, fullPage: false });

    console.log('✅ Screenshot saved to:');
    console.log('   1.', publicOut);
    console.log('   2.', artifactOut);
  } catch (err) {
    console.error('❌ Error during capture:', err.message);
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
