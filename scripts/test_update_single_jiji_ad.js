const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testUpdateSingleAd() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 1000 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  
  const targetUrl = 'https://jiji.ng/edit-free-ad-55774340.html';
  console.log(`Navigating to ${targetUrl} ...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const newTitle = "Website Design Lagos • 24h Express Delivery & WhatsApp Closer"; // 62 chars
  const newPrice = "35000";
  const newDesc = `Stop losing paying customers when they search for your business on Google!

When customers search your business name on Google and see only directory or social media pages, they assume you are an unverified vendor and refuse to pay before delivery.

We build and launch your complete, ultra-fast mobile business website + 24/7 WhatsApp AI Closer in exactly 24 HOURS.

THE "JIJI SELLER DOMINANCE" 24-HOUR BUNDLE:
1. Official Mobile Business Website (Fast-loading on Android, iPhone & Laptops) [Value: ₦120,000]
2. 24/7 AI WhatsApp Sales Closer (Replies to customer inquiries and sends prices in 3 seconds) [Value: ₦50,000]
3. Google Search Map & Business Profile SEO Ranking Setup [Value: ₦30,000]
4. Automated Moniepoint / OPay Bank Transfer Verification Shield (Anti-Fake Alert) [Value: ₦35,000]
5. 36-State Interstate Delivery Fee Sizer [Value: ₦25,000]
6. FREE BONUS: Jiji Page 1 Ad SEO Keywords (Save ₦45,000 in monthly Jiji Boosts) [Value: ₦45,000]

TOTAL VALUE: ₦305,000
PRICING & ACTIVATION PLANS:
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance (Keep it running for just ₦230/day!)
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE HOSTING & MAINTENANCE — Save ₦39,000!)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 100% code handover

100% RISK-FREE GUARANTEE: Test your live working website prototype free on your phone before paying 1 Kobo!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to see a live working demo for your business right now!

SEARCH TAGS: website design lagos, web designer abuja, ecommerce website nigeria, business website developer, cheap website design, company profile website, online store setup, google seo ranking.`;

  console.log('Filling form with Playwright native fill...');
  
  // Fill Title
  await page.fill('input[name="title"]', newTitle);
  console.log('✔ Filled Title:', newTitle);

  // Fill Price
  await page.fill('input.qa-enter-price, input[name="price"][type="text"]', newPrice);
  console.log('✔ Filled Price:', newPrice);

  // Fill Description
  await page.fill('textarea[name="description"]', newDesc);
  console.log('✔ Filled Description');

  await page.waitForTimeout(2000);

  // Upload luxury 2D banner image
  const luxuryImgPath = path.resolve(__dirname, '../public/jiji_ads/ad_2_website_ai_closer_luxury.png');
  const fileInput = await page.$('input[type="file"].qa-messenger-send-image, input[type="file"]');
  if (fileInput && fs.existsSync(luxuryImgPath)) {
    console.log(`Uploading luxury 2D image from ${luxuryImgPath} ...`);
    await fileInput.setInputFiles(luxuryImgPath);
    await page.waitForTimeout(4000);
  }

  // Pre-submit screenshot
  await page.screenshot({ path: 'local_db/pre_submit_edit_test.png' });
  console.log('Saved pre-submit screenshot to local_db/pre_submit_edit_test.png');

  // Find submit button
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const isEnabled = await submitBtn.isEnabled();
    const btnText = await submitBtn.innerText();
    console.log(`Submit button found: "${btnText}", enabled: ${isEnabled}`);

    if (isEnabled) {
      console.log('Clicking Submit / Post ad button...');
      await submitBtn.click();
      await page.waitForTimeout(7000);
      console.log('Post-click URL:', page.url());
      await page.screenshot({ path: 'local_db/post_submit_edit_test.png' });
      console.log('Saved post-submit screenshot to local_db/post_submit_edit_test.png');
    } else {
      console.warn('Submit button is disabled.');
    }
  }

  await browser.close();
}

testUpdateSingleAd().catch(console.error);
