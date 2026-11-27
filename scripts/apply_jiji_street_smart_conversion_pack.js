const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const HIGH_CONVERTING_JIJI_DECK = [
  {
    adId: '55774340',
    editUrl: 'https://jiji.ng/edit-free-ad-55774340.html',
    title: 'Website Design in Lagos • Fast 24 Hours Delivery & WhatsApp Store',
    price: '40000',
    imageFile: 'ad_2_website_ai_closer_luxury.png',
    desc: `Are you tired of losing paying customers who search for your business on Google and only see competitors?

Do you sell clothes, shoes, bags, gadgets, perfumes, or salon services and spend all day sending pictures and prices on WhatsApp until your phone hangs?

We build and launch your official mobile business website + automated WhatsApp sales system in exactly 24 HOURS.

WHAT YOUR NEW BUSINESS WEBSITE DOES FOR YOU:
1. Official Mobile Website: Loads ultra-fast on all Android phones, iPhones, and laptops.
2. 24/7 WhatsApp Sales Assistant: Replies to customer inquiries, shows available products, and sends prices automatically in 3 seconds.
3. 36-State Delivery Fee Sizer: Customers automatically see shipping costs to Lagos, Abuja, Port Harcourt, Ibadan, or any state.
4. Fake Alert Proof Bank Checkout: Direct Moniepoint and OPay payment verification.
5. Google Search & Google Maps Setup: Appear when people search for your business name or service in your area.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working mobile website prototype on your own phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji now to see a live working demo for your business!`
  },
  {
    adId: '55776882',
    editUrl: 'https://jiji.ng/edit-free-ad-55776882.html',
    title: 'Solar Inverter Load Calculator & WhatsApp Quotation Generator',
    price: '40000',
    imageFile: 'ad_3_solar_boq_sizer_luxury.png',
    desc: `ATTENTION SOLAR INSTALLERS & INVERTER DEALERS IN NIGERIA:

Stop wasting 2 to 3 hours calculating appliance loads and typing BOQ proposals for clients who end up bargaining down your profit or ghosting you!

We give you an automated Solar & Inverter BOQ Sizing Calculator branded with your company name, logo, and WhatsApp number.

HOW IT HELPS YOU CLOSE 3X MORE SOLAR PROJECTS:
1. Interactive Appliance Sizer: Client selects their ACs, refrigerators, pumping machines, TVs, and lights.
2. Instant WhatsApp BOQ Quotation: Automatically calculates exact Inverter kVA, Solar Panel wattage, and Lithium battery bank needed, then sends a professional quote in 60 seconds.
3. Motor Inrush Surge Protection: Automatically warns clients against undersized inverters tripping when freezers or pumps start.
4. Band A NEPA vs Fuel Payback Clock: Shows clients in black and white how much money they save compared to running generators at current fuel prices.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working solar calculator demo on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the interactive solar demo right now!`
  },
  {
    adId: '55777070',
    editUrl: 'https://jiji.ng/edit-free-ad-55777070.html',
    title: 'Online Store Website for Boutiques & Supermarkets • Moniepoint POS',
    price: '40000',
    imageFile: 'ad_4_fake_alert_shield_luxury.png',
    desc: `Stop falling victim to fake bank transfer alerts, photoshopped receipts, and sales attendants stealing daily cash!

In Nigeria today, boutiques, supermarkets, pharmacies, and phone stores lose hundreds of thousands of Naira monthly to fake bank transfer screenshots.

We build an automated Online Store Website + Moniepoint Bank Transfer Shield for your retail store.

WHAT IT DOES:
1. Real-Time Bank Credit Verification: Directly verifies Moniepoint, OPay, and Paystack incoming bank transfers in real time.
2. Green Security Pass: Cashier receives an instant green checkmark on their phone when real money hits your account. Never release goods on fake SMS again!
3. Shift Reconciliation in 60 Seconds: Reconcile daily cash in hand against POS transactions to stop cashier theft.
4. Automated WhatsApp Digital Receipts: Sends buyers digital receipts automatically.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working store website on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to see a live demo for your store today!`
  },
  {
    adId: '55777491',
    editUrl: 'https://jiji.ng/edit-free-ad-55777491.html',
    title: 'Beauty Salon & Clinic Appointment Booking Website • WhatsApp System',
    price: '40000',
    imageFile: 'ad_5_salon_deposit_booking_luxury.png',
    desc: `Tired of clients booking salon or clinic appointments and failing to show up while you turn away paying walk-in customers?

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
Tap "Start Chat" on Jiji or message on WhatsApp to test the live booking calendar!`
  },
  {
    adId: '55782977',
    editUrl: 'https://jiji.ng/edit-free-ad-55782977.html',
    title: 'School Portal Website Design & Online Student Result PIN Checker',
    price: '40000',
    imageFile: 'ad_6_school_fee_portal_luxury.png',
    desc: `Stop tracking school fee defaulters manually on messy exercise books and Excel sheets!

Recover unpaid term fees on schedule and modernize your school administration with our automated School Fee Recovery & Online Result PIN Checker Portal.

HOW IT HELPS YOUR SCHOOL:
1. Digital Result Gating: Report cards and examination broadsheets remain locked online until school fees are fully cleared.
2. Electronic PIN Generator: Generate electronic PINs or scratch cards for parents to check results online.
3. Broadsheet Exam Scoring: Teachers enter continuous assessment and exam scores to generate printable PDF report cards.
4. Automatic WhatsApp Debt Reminders: Sends polite automated balance reminders directly to parents.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working school portal demo on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or WhatsApp for a live portal demonstration for your school!`
  },
  {
    adId: '55790165',
    editUrl: 'https://jiji.ng/edit-free-ad-55790165.html',
    title: 'Real Estate & Property Management Website • Estate Service Charge',
    price: '40000',
    imageFile: 'ad_7_tenant_rent_portal_luxury.png',
    desc: `Manage residential estate service charges, generator diesel bills, and tenant rent collections with ZERO disputes!

We deploy cloud property management portals for estate executive committees, landlords, and facility management firms across Nigeria.

WHAT IT DOES:
1. Itemized Utility Billing: Automatically bills generator diesel, security, waste disposal, and water dues.
2. Automated Rent & Service Charge Reminders: Sends reminders via WhatsApp 30, 14, and 7 days before due date.
3. Instant Digital Rent Receipts: Generates unalterable digital receipts with payment reconciliation.
4. Visitor Gate Pass QR Codes: Generates digital gate passes for estate security guards.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working estate portal demo on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to test the live estate portal demo!`
  },
  {
    adId: '55790380',
    editUrl: 'https://jiji.ng/edit-free-ad-55790380.html',
    title: 'Logistics & Interstate Delivery Website Design with Waybill Tracker',
    price: '40000',
    imageFile: 'ad_8_dispatch_waybill_tracker_luxury.png',
    desc: `Stop answering 50+ repeated "Where is my package?" phone calls every single day!

We build automated dispatch and waybill tracking websites for courier companies, haulage operators, and interstate transport delivery hubs.

WHAT IT DOES:
1. Automatic Tracking Links: Shippers automatically receive SMS & WhatsApp tracking links when packages are booked.
2. Real-Time Milestone Status: Package Intake, In Transit, Arrived Hub, Out for Delivery.
3. Digital Proof of Delivery (POD): Signature and recipient photo verification upon handover.
4. Interstate Driver Mileage & Fuel Audit: Protects your logistics business against fuel siphoning.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working logistics tracking demo on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message on WhatsApp to test a live tracking link now!`
  },
  {
    adId: '55796997',
    editUrl: 'https://jiji.ng/edit-free-ad-55796997.html',
    title: 'Multi-Branch Retail Inventory & Pure Water Factory Stock Software',
    price: '40000',
    imageFile: 'ad_9_stock_theft_ledger_luxury.png',
    desc: `Running 2 or more retail shop branches or a Sachet/Bottle Water Factory? Stop losing millions to inventory theft, unrecorded stock shrinkage, and driver cash fraud!

We build multi-branch inventory tracking and production accounting software for Nigerian retailers and factory owners.

WHAT IT DOES:
1. Multi-Branch Real-Time Stock Sync: Monitor stock across Shop 1, Shop 2, and Central Warehouse in real time from your phone.
2. Sachet Water Route Reconciliation: Reconcile bags loaded vs cash returned vs verified burst allowance for delivery drivers.
3. Inter-Branch Transfer Gate Pass: Dual sign-off digital gate pass prevents off-the-books stock movement.
4. Staff Permission Gating: Sales attendants cannot edit prices, delete receipts, or clear sales history.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working inventory ledger on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message on WhatsApp to test the live inventory demo!`
  },
  {
    adId: '55797060',
    editUrl: 'https://jiji.ng/edit-free-ad-55797060.html',
    title: 'Building Material Estimator & BOQ Calculator Website for Builders',
    price: '40000',
    imageFile: 'ad_10_construction_estimator_luxury.png',
    desc: `Eliminate building material waste and contractor over-budgeting on your construction sites!

We deploy computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.

WHAT IT DOES:
1. Concrete & Decking Mix Calculator: Precision cement, sand tonnage, and granite mix sizer for foundations, beams, and slabs.
2. Floor Tile & Adhesive Sizer: Square-meter calculation with 12% cut breakage buffer.
3. Paint Wall Coverage Calculator: Emulsion and gloss paint bucket estimators.
4. 1-Tap Itemized BOQ PDF Generator: Generates professional engineering bills of quantities using current Lagos market prices.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working construction calculator demo on your phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to test the material calculator demo now!`
  },
  {
    adId: '51159464',
    editUrl: 'https://jiji.ng/edit-free-ad-51159464.html',
    title: 'Convert Business Website to Android Mobile App • APK in 24 Hours',
    price: '40000',
    imageFile: 'banner_51159464_1793622633384.png',
    desc: `Turn your existing business website or online store into an installable Android Mobile App in 24 hours!

Give your customers a 1-tap app icon on their phone home screens, send push notifications for new products, and stop losing buyers to mobile browser tabs.

WHAT IT DOES:
1. Complete Android APK Production Build: Ready for direct customer download via WhatsApp or Instagram bio.
2. Offline Screen Caching: Loads fast even on weak MTN, Airtel, or Glo networks.
3. 1-Tap WhatsApp Direct In-App Chat Integration.
4. Zero Google Play $25 Account Delay: Start sharing your installable app with customers immediately.

PRICING & ACTIVATION:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000)
👉 ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 3 corporate emails

100% RISK-FREE GUARANTEE:
You test your working demo APK on your Android phone before paying any balance!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to test a demo APK on your Android phone right now!`
  }
];

async function applyStreetSmartConversionPack() {
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
  const report = [];

  console.log(`Starting High-Converting Street-Smart update across ${HIGH_CONVERTING_JIJI_DECK.length} Jiji ads...\n`);

  for (let i = 0; i < HIGH_CONVERTING_JIJI_DECK.length; i++) {
    const ad = HIGH_CONVERTING_JIJI_DECK[i];
    console.log(`============================================================`);
    console.log(`[${i + 1}/${HIGH_CONVERTING_JIJI_DECK.length}] Updating Ad #${ad.adId}`);
    console.log(`New Title: ${ad.title}`);
    console.log(`Hook Price: ₦${ad.price}`);
    console.log(`New Image: ${ad.imageFile}`);
    console.log(`============================================================`);

    try {
      await page.goto(ad.editUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);

      // Check Step 1 title input
      const titleInput = await page.waitForSelector('input[name="title"]', { timeout: 10000 }).catch(() => null);

      if (titleInput) {
        console.log('-> Updating Title to High-Search Keyword...');
        await titleInput.fill(ad.title);
        await titleInput.dispatchEvent('input');
        await titleInput.dispatchEvent('change');
        await page.waitForTimeout(1000);

        // Upload fresh high-contrast banner
        const bannerPath = path.resolve(__dirname, `../public/jiji_ads/${ad.imageFile}`);
        const fileInput = await page.$('input[type="file"]');
        if (fileInput && fs.existsSync(bannerPath)) {
          console.log(`-> Uploading High-Contrast Billboard Banner (${ad.imageFile})...`);
          await fileInput.setInputFiles(bannerPath);
          await page.waitForTimeout(4000);
        }

        // Click Next button
        const nextBtn = await page.$('button.b-create-ad-card__next-button');
        if (nextBtn) {
          console.log('-> Clicking Next button...');
          await nextBtn.click({ force: true });
          await page.waitForTimeout(4000);
        }
      }

      // Step 2: Price and Description
      await page.waitForSelector('textarea[name="description"]', { timeout: 10000 }).catch(() => null);

      console.log(`-> Setting Inquiry Price to ₦${ad.price}...`);
      const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
      if (priceInput) {
        await priceInput.fill(ad.price);
        await priceInput.dispatchEvent('input');
        await priceInput.dispatchEvent('change');
      }

      console.log('-> Updating Plain Street-Smart Nigerian Copy...');
      const descInput = await page.$('textarea[name="description"]');
      if (descInput) {
        await descInput.fill(ad.desc);
        await descInput.dispatchEvent('input');
        await descInput.dispatchEvent('change');
      }
      await page.waitForTimeout(2000);

      // Submit
      console.log('-> Submitting update to Jiji...');
      const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
      if (submitBtn) {
        await submitBtn.click({ force: true });
        await page.waitForTimeout(7000);
        const finalUrl = page.url();
        console.log(`✔ Ad #${ad.adId} submitted! Final URL: ${finalUrl}`);
        report.push({ adId: ad.adId, title: ad.title, price: ad.price, status: 'SUCCESS', finalUrl });
      } else {
        console.warn(`⚠ Submit button not found for Ad #${ad.adId}`);
        report.push({ adId: ad.adId, title: ad.title, status: 'NO_SUBMIT_BUTTON' });
      }

      await page.screenshot({ path: `local_db/street_smart_ad_${ad.adId}.png` });

    } catch (err) {
      console.error(`❌ Error updating Ad #${ad.adId}:`, err.message);
      report.push({ adId: ad.adId, title: ad.title, status: 'ERROR', error: err.message });
    }

    console.log('Waiting 5s before next advert...\n');
    await page.waitForTimeout(5000);
  }

  fs.writeFileSync('local_db/jiji_street_smart_report.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\n============================================================');
  console.log('HIGH-CONVERTING STREET-SMART REVOLUTION COMPLETED!');
  console.log(JSON.stringify(report, null, 2));
  console.log('============================================================');

  await browser.close();
}

applyStreetSmartConversionPack().catch(console.error);
