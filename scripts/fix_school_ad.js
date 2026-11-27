const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const AD = {
  adId: '55782977',
  editUrl: 'https://jiji.ng/edit-free-ad-55782977.html',
  title: 'Private School Website Design & Online Student Result PIN Portal',
  price: '40000',
  imageFile: 'ad_6_school_fee_portal_luxury.png',
  desc: `Stop tracking school fee defaulters manually on messy exercise books and Excel sheets!

Recover unpaid school fees on schedule and modernize your school administration with our automated Term Fee Recovery & Digital Result Portal.

THE "SCHOOL REVENUE RECOVERY" BUNDLE:
1. Automated Digital Result Gating (Report cards locked until fees clear 100%) [Value: ₦120,000]
2. Scratch-Card & Electronic Result Checker PIN Generator [Value: ₦45,000]
3. 3-Stage Installment Debt Aging Matrix (Resumption, Mid-Term, Exam Week) [Value: ₦50,000]
4. Instant Moniepoint & Paystack Term Fee Bank Reconciliation [Value: ₦40,000]
5. Termly Broadsheet Exam Scoring & Printable PDF Report Cards [Value: ₦50,000]
6. FREE BONUS: Automated Polite WhatsApp Balance Reminders for Parents [Value: ₦30,000]

TOTAL VALUE: ₦335,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom School Suite): ₦75,000 deposit (₦150,000 total) for dedicated school portal domain & results server

Recover school fees on time and eliminate bursar cash leakage this session.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Send a message on Jiji or WhatsApp for a live portal demonstration for your school today!

SEARCH TAGS: school portal nigeria, school management software, online result checker, report card printing software, school fees payment portal, private school website, secondary school portal lagos.`
};

async function fixSchoolAd() {
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
  console.log(`Navigating to ${AD.editUrl}...`);
  await page.goto(AD.editUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);

  // Check what inputs are visible
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea, button')).map(e => ({
      tag: e.tagName,
      name: e.getAttribute('name'),
      type: e.getAttribute('type'),
      className: e.className,
      id: e.id,
      visible: e.offsetParent !== null
    })).filter(x => x.visible);
  });
  console.log('Visible inputs on page:\n', JSON.stringify(inputs, null, 2));

  // If title input is visible, fill it and attach file
  const titleInput = await page.$('input[name="title"]');
  if (titleInput && await titleInput.isVisible()) {
    console.log('-> Updating Title...');
    await titleInput.fill(AD.title);
    await titleInput.dispatchEvent('input');
    await titleInput.dispatchEvent('change');
  }

  const luxuryImgPath = path.resolve(__dirname, `../public/jiji_ads/${AD.imageFile}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(luxuryImgPath)) {
    console.log(`-> Attaching fresh 3D luxury banner (${AD.imageFile})...`);
    await fileInput.setInputFiles(luxuryImgPath);
    await page.waitForTimeout(4000);
  }

  // Click Next
  const nextBtn = await page.$('button.b-create-ad-card__next-button');
  if (nextBtn) {
    console.log('-> Clicking Next button...');
    await nextBtn.click({ force: true });
    await page.waitForTimeout(4000);
  }

  // Wait for Step 2
  await page.waitForSelector('textarea[name="description"]', { timeout: 10000 }).catch(() => null);

  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill(AD.price);
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
    console.log(`   Price set to NGN ${AD.price}`);
  }

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(AD.desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
    console.log('   Description synced');
  }

  await page.waitForTimeout(2000);

  // Submit
  const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
  if (submitBtn) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(7000);
    console.log(`✔ SUCCESS! Final URL: ${page.url()}`);
  }

  await page.screenshot({ path: 'local_db/live_3d_ad_55782977.png' });
  await browser.close();
}

fixSchoolAd().catch(console.error);
