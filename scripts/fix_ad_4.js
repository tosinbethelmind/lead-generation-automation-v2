const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd4() {
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
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    if (['media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();
  const url = 'https://jiji.ng/edit-free-ad-55777491.html';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Body snippet:', bodyText.replace(/\s+/g, ' '));

  const titleInput = await page.$('input[name="title"]');
  console.log('Title input present:', !!titleInput);

  if (titleInput) {
    console.log('Updating Title...');
    await titleInput.fill('Beauty Salon & Clinic Appointment Booking Website • WhatsApp System');
    await titleInput.dispatchEvent('input');
    await titleInput.dispatchEvent('change');
    await page.waitForTimeout(1000);

    const bannerPath = path.resolve('public/jiji_ads/ad_5_salon_deposit_booking_luxury.png');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && fs.existsSync(bannerPath)) {
      console.log('Uploading banner...');
      await fileInput.setInputFiles(bannerPath);
      await page.waitForTimeout(4000);
    }

    const nextBtn = await page.$('button.b-create-ad-card__next-button');
    if (nextBtn) {
      console.log('Clicking Next...');
      await nextBtn.click({ force: true });
      await page.waitForTimeout(4000);
    }
  }

  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  console.log('Price input present:', !!priceInput);
  if (priceInput) {
    console.log('Setting price to 40000...');
    await priceInput.fill('40000');
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
  }

  const desc = `Tired of clients booking salon or clinic appointments and failing to show up while you turn away paying walk-in customers?

We build a 24/7 online appointment booking website for hair salons, aesthetic clinics, spas, and makeup artists that locks client time slots with upfront bank deposits.

HOW IT PROTECTS YOUR REVENUE:
1. 24/7 Self-Service Booking on WhatsApp: Clients choose available date, time, and service from their phone.
2. Reservation Deposit Lock: Requires an upfront booking deposit via Moniepoint or OPay before confirming the slot.
3. Automated WhatsApp Reminders: Sends reminders 24 hours and 2 hours before the appointment (cuts no-shows by 90%).
4. Stylist & Specialist Commission Tracking: Automatically tracks daily service revenue and staff commissions.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working booking portal on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message on WhatsApp to test the live booking calendar!`;

  const descInput = await page.$('textarea[name="description"]');
  console.log('Desc input present:', !!descInput);
  if (descInput) {
    console.log('Filling description...');
    await descInput.fill(desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
  }

  const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
  console.log('Submit button present:', !!submitBtn);
  if (submitBtn) {
    console.log('Submitting...');
    await submitBtn.click({ force: true });
    await page.waitForTimeout(6000);
    console.log('Submission result URL:', page.url());
  }

  await page.screenshot({ path: 'local_db/ad_4_final_check.png' });
  await browser.close();
}

fixAd4().catch(console.error);
