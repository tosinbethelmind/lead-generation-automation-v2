const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function updateAd4Properly() {
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
  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    if (['media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
      return route.abort();
    }
    return route.continue();
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  const editUrl = 'https://jiji.ng/edit-free-ad-55777491.html';
  console.log('Navigating to', editUrl);

  await page.goto(editUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);

  console.log('URL after navigation:', page.url());

  // Step 1: Wait for title input with 20s timeout
  console.log('Waiting for title input...');
  const titleInput = await page.waitForSelector('input[name="title"]', { timeout: 20000 }).catch(() => null);

  if (titleInput) {
    console.log('-> Updating Title...');
    await titleInput.fill('Beauty Salon & Clinic Appointment Booking Website • WhatsApp System');
    await titleInput.dispatchEvent('input');
    await titleInput.dispatchEvent('change');
    await page.waitForTimeout(1000);

    const bannerPath = path.resolve(__dirname, '../public/jiji_ads/ad_5_salon_deposit_booking_luxury.png');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && fs.existsSync(bannerPath)) {
      console.log('-> Uploading ad_5_salon_deposit_booking_luxury.png...');
      await fileInput.setInputFiles(bannerPath);
      await page.waitForTimeout(4000);
    }

    const nextBtn = await page.waitForSelector('button.b-create-ad-card__next-button', { timeout: 10000 }).catch(() => null);
    if (nextBtn) {
      console.log('-> Clicking Next button...');
      await nextBtn.click({ force: true });
      await page.waitForTimeout(4000);
    }
  } else {
    console.log('Title input not found. Checking if already on Step 2...');
  }

  // Step 2: Price and Description
  console.log('Waiting for Step 2 price / description...');
  await page.waitForSelector('textarea[name="description"]', { timeout: 15000 }).catch(() => null);

  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    console.log('-> Setting Price to 40000...');
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
  if (descInput) {
    console.log('-> Updating Description...');
    await descInput.fill(desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
  }
  await page.waitForTimeout(2000);

  const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
  if (submitBtn) {
    console.log('-> Submitting update to Jiji...');
    await submitBtn.click({ force: true });
    await page.waitForTimeout(7000);
    console.log('✔ Submission completed! Final URL:', page.url());
  }

  await page.screenshot({ path: 'local_db/ad_4_final_success.png' });
  await browser.close();
}

updateAd4Properly().catch(console.error);
