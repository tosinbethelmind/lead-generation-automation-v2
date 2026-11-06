const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const AD_55774340 = {
  adId: '55774340',
  editUrl: 'https://jiji.ng/edit-free-ad-55774340.html',
  title: 'Professional Business Website Design in 24 Hours • ₦40k Deposit',
  price: '40000',
  imageFile: 'ad_2_website_ai_closer_luxury.png',
  desc: `Stop losing paying customers when they search for your business on Google!

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
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 100% code handover

100% RISK-FREE GUARANTEE: Test your live working website prototype free on your phone before paying 1 Kobo!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to see a live working demo for your business right now!

SEARCH TAGS: website design lagos, web designer abuja, ecommerce website nigeria, business website developer, cheap website design, company profile website, online store setup, google seo ranking.`
};

async function updateAd() {
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
  console.log(`Navigating to ${AD_55774340.editUrl}...`);
  await page.goto(AD_55774340.editUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // 1. Fill title
  console.log('-> Updating Title...');
  await page.fill('input[name="title"]', AD_55774340.title);
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  // 2. Upload image if file input is available
  const imgPath = path.resolve(__dirname, `../public/jiji_ads/${AD_55774340.imageFile}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(imgPath)) {
    console.log(`-> Attaching image banner: ${AD_55774340.imageFile}...`);
    await fileInput.setInputFiles(imgPath);
    await page.waitForTimeout(3000);
  }

  // 3. Click Next button with force: true
  console.log('-> Clicking Next button...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // 4. Update Price and Description
  console.log('-> Updating Price and Description...');
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill(AD_55774340.price);
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
    console.log(`   Price set to NGN ${AD_55774340.price}`);
  }

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(AD_55774340.desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
    console.log('   Description populated');
  }
  await page.waitForTimeout(2000);

  // 5. Submit
  console.log('-> Submitting ad update...');
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(6000);
    console.log(`SUCCESS! Result URL: ${page.url()}`);
  } else {
    console.warn('Submit button not found!');
  }

  await page.screenshot({ path: 'local_db/ad_55774340_submitted.png' });
  await browser.close();
}

updateAd().catch(console.error);
