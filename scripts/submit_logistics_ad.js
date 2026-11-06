const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const AD_55790380 = {
  adId: '55790380',
  editUrl: 'https://jiji.ng/edit-free-ad-55790380.html',
  title: 'Logistics & Interstate Delivery Website with Waybill Tracker',
  price: '40000',
  imageFile: 'ad_8_dispatch_waybill_tracker_luxury.png',
  desc: `Stop answering 50+ repeated "Where is my package?" phone calls every single day!

We deploy automated dispatch and waybill tracking engines for Nigerian courier businesses, haulage contractors, and interstate delivery hubs.

THE "DISPATCH AUTOMATION" BUNDLE:
1. Automated SMS & WhatsApp Tracking Links sent to shippers upon package intake [Value: ₦80,000]
2. Real-Time Milestone Status Updates (Intake, In Transit, Arrived Hub, Delivered) [Value: ₦50,000]
3. Digital Proof-of-Delivery (POD) Signature & Recipient Photo Verification [Value: ₦45,000]
4. Highway Driver Interstate Diesel Mileage Auditor (Flags fuel siphoning) [Value: ₦40,000]
5. GIG, Gokada & Local Dispatch Cost Comparison Calculator [Value: ₦25,000]
6. FREE BONUS: 36-State Interstate Park Delivery Fee Schedule Generator [Value: ₦25,000]

TOTAL VALUE: ₦265,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom Logistics Suite): ₦75,000 deposit (₦150,000 total)

Cut dispatch customer service calls by 85% and build massive trust with shippers.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test a live tracking link now!

SEARCH TAGS: dispatch rider service lagos, waybill tracking software, courier logistics app, delivery rider app, haulage tracking, interstate parcel delivery, gig logistics tracker.`
};

async function updateLogisticsAd() {
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
    if (['image', 'media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
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
  console.log(`Navigating to ${AD_55790380.editUrl}...`);
  await page.goto(AD_55790380.editUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // 1. Fill title
  console.log('-> Updating Title...');
  await page.fill('input[name="title"]', AD_55790380.title);
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  // 2. Upload image if available
  const imgPath = path.resolve(__dirname, `../public/jiji_ads/${AD_55790380.imageFile}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(imgPath)) {
    console.log(`-> Attaching image banner: ${AD_55790380.imageFile}...`);
    await fileInput.setInputFiles(imgPath);
    await page.waitForTimeout(3000);
  }

  // 3. Click Next button
  console.log('-> Clicking Next button...');
  const nextBtn = await page.$('button.b-create-ad-card__next-button');
  if (nextBtn) {
    await nextBtn.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // 4. Update Price and Description
  console.log('-> Updating Price and Description...');
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill(AD_55790380.price);
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
    console.log(`   Price set to NGN ${AD_55790380.price}`);
  }

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(AD_55790380.desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
    console.log('   Description populated');
  }
  await page.waitForTimeout(2000);

  // 5. Submit
  console.log('-> Submitting ad update...');
  const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
  if (submitBtn) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(6000);
    console.log(`SUCCESS! Result URL: ${page.url()}`);
  } else {
    console.warn('Submit button not found!');
  }

  await page.screenshot({ path: 'local_db/ad_55790380_submitted.png' });
  await browser.close();
}

updateLogisticsAd().catch(console.error);
