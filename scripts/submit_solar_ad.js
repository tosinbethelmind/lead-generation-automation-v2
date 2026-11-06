const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const AD_55776882 = {
  adId: '55776882',
  editUrl: 'https://jiji.ng/edit-free-ad-55776882.html',
  title: 'Solar Inverter Company Website Design & Instant WhatsApp Quoter',
  price: '40000',
  imageFile: 'ad_3_solar_boq_sizer_luxury.png',
  desc: `ATTENTION SOLAR INSTALLERS & INVERTER DEALERS:

Stop wasting hours doing manual load calculations for prospective clients who end up ghosting you or bargaining down your profit!

We deploy an automated Solar & Inverter BOQ Load Sizing Calculator branded with your company name, logo, and direct WhatsApp hotline.

THE "SOLAR CLOSER SUITE" BUNDLE:
1. Interactive Appliance Load Calculator (ACs, fridges, pumping machines, lighting) [Value: ₦80,000]
2. Instant WhatsApp BOQ Quotation Generator sent to client in 60 seconds [Value: ₦50,000]
3. Motor Inrush Surge Protection Sizer (Prevents inverters tripping or blowing up) [Value: ₦30,000]
4. NEPA Band A Tariff (₦209/kWh) vs Generator Fuel Payback ROI Clock [Value: ₦35,000]
5. 1-Tap Bankable PDF Engineering Proposal Generator with your logo [Value: ₦40,000]
6. FREE BONUS: 5-Year Lithium LiFePO4 vs Tubular Gel Battery Cost Comparison Sheet [Value: ₦20,000]

TOTAL VALUE: ₦255,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom Suite): ₦75,000 deposit (₦150,000 total)

Close 3x more solar projects on autopilot with zero paperwork stress.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the interactive demo now!

SEARCH TAGS: solar installation nigeria, 5kva inverter price, 3.5kva solar system, felicity lithium battery, solar load calculator, luminous inverter lagos, solar boq generator, tubular battery price.`
};

async function updateSolarAd() {
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
  console.log(`Navigating to ${AD_55776882.editUrl}...`);
  await page.goto(AD_55776882.editUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // 1. Fill title
  console.log('-> Updating Title...');
  await page.fill('input[name="title"]', AD_55776882.title);
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  // 2. Upload image if available
  const imgPath = path.resolve(__dirname, `../public/jiji_ads/${AD_55776882.imageFile}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(imgPath)) {
    console.log(`-> Attaching image banner: ${AD_55776882.imageFile}...`);
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
    await priceInput.fill(AD_55776882.price);
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
    console.log(`   Price set to NGN ${AD_55776882.price}`);
  }

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(AD_55776882.desc);
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

  await page.screenshot({ path: 'local_db/ad_55776882_submitted.png' });
  await browser.close();
}

updateSolarAd().catch(console.error);
