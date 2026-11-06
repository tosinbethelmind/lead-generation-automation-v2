const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ADS_TO_PROCESS = [
  {
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
  },
  {
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

Cut dispatch customer service calls by 85% and build massive trust with shippers.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test a live tracking link now!

SEARCH TAGS: dispatch rider service lagos, waybill tracking software, courier logistics app, delivery rider app, haulage tracking, interstate parcel delivery, gig logistics tracker.`
  },
  {
    adId: '55796997',
    editUrl: 'https://jiji.ng/edit-free-ad-55796997.html',
    title: 'Multi-Store Retail Inventory & Factory Stock Keeping Website',
    price: '40000',
    imageFile: 'ad_9_stock_theft_ledger_luxury.png',
    desc: `Running 2 or more retail shop branches or a Sachet/Bottle Water Factory? Stop losing millions to inventory theft, unrecorded stock shrinkage, and driver cash fraud!

Dishonest sales attendants and delivery drivers take advantage when you're not physically watching: selling goods off-the-books, claiming burst sachet bags, faking inter-branch transfers, and pocketing daily sales cash.

THE "MULTI-STORE & FACTORY THEFT PREVENTION" BUNDLE:
1. Multi-Branch Real-Time Stock Sync across Shop 1, Shop 2, and Central Warehouse [Value: ₦120,000]
2. Sachet & Bottle Water Route Reconciliation (Bags loaded vs Cash returned vs Verified Burst Allowance) [Value: ₦75,000]
3. Inter-Branch Transfer Reconciliation with Dual-Signoff Digital Gate Pass [Value: ₦60,000]
4. Staff Permission Gating (Attendants cannot edit prices, delete receipts, or clear sales) [Value: ₦45,000]
5. Instant WhatsApp Theft Alerts sent to owner for suspicious manual stock deductions [Value: ₦40,000]
6. End-of-Day Shift Cash vs POS Bank Credit Reconciliation in 60s [Value: ₦30,000]
7. FREE BONUS: Barcode Scanner & Thermal Receipt Printer Setup Guide [Value: ₦20,000]

TOTAL VALUE: ₦390,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Multi-Branch / Factory Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & multi-branch ledger

Know your exact stock levels and daily profit from your phone anywhere in the world.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Send a message on Jiji or WhatsApp for a live interactive multi-store demo right now!

SEARCH TAGS: inventory software lagos, supermarket pos software, pure water accounting software, stock keeping app, retail pos machine, sachet water factory manager, multi branch inventory.`
  },
  {
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
  },
  {
    adId: '55790165',
    editUrl: 'https://jiji.ng/edit-free-ad-55790165.html',
    title: 'Real Estate Agency & Property Management Website Design Lagos',
    price: '40000',
    imageFile: 'ad_7_tenant_rent_portal_luxury.png',
    desc: `Manage residential estate facility service charges and tenant rent collections with ZERO disputes!

We deploy cloud-based property management portals for landlords, estate executive associations, and facility management firms across Nigeria.

THE "ESTATE RECONCILIATION" BUNDLE:
1. Automated Rent Renewal Reminders sent via SMS & WhatsApp (30, 14, 7 days) [Value: ₦90,000]
2. Itemized Facility Utility Billing (Generator diesel, security, waste, water) [Value: ₦60,000]
3. Instant Digital Rent Receipts & Unalterable Payment Ledger [Value: ₦45,000]
4. Landlord Disbursement Ledger & Monthly Diesel Consumption Audit [Value: ₦40,000]
5. Transparent Tenant Maintenance Ticket & Defect Tracking Dashboard [Value: ₦35,000]
6. FREE BONUS: Visitor Gate Pass QR Access Generator for Estate Security Guards [Value: ₦30,000]

TOTAL VALUE: ₦300,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom Estate Suite): ₦75,000 deposit (₦150,000 total)

Eliminate rent arguments and keep your estate property accounts 100% reconciled.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp for your live estate demo today!

SEARCH TAGS: estate management software, property management portal lagos, service charge receipt, tenant rent collection app, estate security gate pass, facility management software abuja.`
  }
];

async function runBatch() {
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
  const results = [];

  for (let i = 0; i < ADS_TO_PROCESS.length; i++) {
    const ad = ADS_TO_PROCESS[i];
    console.log(`\n============================================================`);
    console.log(`[${i + 1}/${ADS_TO_PROCESS.length}] Updating Ad #${ad.adId}: ${ad.title}`);
    console.log(`Edit URL: ${ad.editUrl}`);
    console.log(`============================================================`);

    try {
      await page.goto(ad.editUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(3000);

      // Step 1: Update Title
      console.log('-> Updating Title...');
      const titleInput = await page.$('input[name="title"]');
      if (titleInput) {
        await titleInput.fill(ad.title);
        await titleInput.dispatchEvent('input');
        await titleInput.dispatchEvent('change');
        await page.waitForTimeout(1000);
      }

      // Upload image banner if file input exists
      const imgPath = path.resolve(__dirname, `../public/jiji_ads/${ad.imageFile}`);
      const fileInput = await page.$('input[type="file"]');
      if (fileInput && fs.existsSync(imgPath)) {
        console.log(`-> Attaching image banner: ${ad.imageFile}...`);
        await fileInput.setInputFiles(imgPath);
        await page.waitForTimeout(3000);
      }

      // Check if Next button exists and click it with force: true
      const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
      if (nextBtn) {
        console.log('-> Clicking Next button with force: true...');
        await nextBtn.click({ force: true });
        await page.waitForTimeout(3000);
      }

      // Step 2: Price and Description
      console.log('-> Setting Price and Description...');
      const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
      if (priceInput) {
        await priceInput.fill(ad.price);
        await priceInput.dispatchEvent('input');
        await priceInput.dispatchEvent('change');
        console.log(`   Price set to NGN ${ad.price}`);
      }

      const descInput = await page.$('textarea[name="description"]');
      if (descInput) {
        await descInput.fill(ad.desc);
        await descInput.dispatchEvent('input');
        await descInput.dispatchEvent('change');
        console.log('   Description populated');
      }
      await page.waitForTimeout(2000);

      // Submit ad update
      console.log('-> Submitting update to Jiji...');
      const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click({ force: true });
        await page.waitForTimeout(6000);
        const finalUrl = page.url();
        console.log(`✔ Ad #${ad.adId} update submitted! Result URL: ${finalUrl}`);
        results.push({ adId: ad.adId, title: ad.title, status: 'SUCCESS', finalUrl });
      } else {
        console.warn(`⚠ Submit button not found for Ad #${ad.adId}`);
        results.push({ adId: ad.adId, title: ad.title, status: 'NO_SUBMIT_BUTTON' });
      }

      await page.screenshot({ path: `local_db/updated_ad_${ad.adId}.png` });

    } catch (err) {
      console.error(`❌ Error updating Ad #${ad.adId}:`, err.message);
      results.push({ adId: ad.adId, title: ad.title, status: 'ERROR', error: err.message });
    }

    // Delay between edits
    console.log('Waiting 5s before next advert...');
    await page.waitForTimeout(5000);
  }

  // Save updated batch results
  fs.writeFileSync('local_db/jiji_batch_final_report.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n============================================================');
  console.log('--- JIJI BATCH UPDATE COMPLETED ---');
  console.log(JSON.stringify(results, null, 2));
  console.log('============================================================');

  await browser.close();
}

runBatch().catch(console.error);
