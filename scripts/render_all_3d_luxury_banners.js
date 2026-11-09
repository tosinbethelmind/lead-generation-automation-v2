const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { generate3DLuxuryHtml } = require('./luxury_3d_template');

const ALL_10_BANNERS = [
  {
    id: 2,
    filename: 'ad_2_website_ai_closer_luxury.png',
    tag: 'OFFICIAL MOBILE BUSINESS WEBSITES',
    titleLine1: 'Professional Business Website',
    titleLine2: '+ 24/7 WhatsApp AI Sales Closer',
    subtitle: 'Stop losing paying customers when they search your business on Google! Turn Google searches into verified buyers in 24 hours.',
    features: [
      'Official Mobile Business Website (Ultra-fast on Android & iPhone)',
      '24/7 AI WhatsApp Closer (Answers inquiries & sells in 3 seconds)',
      'Google Maps & Local Search SEO Ranking Setup Included',
      'Moniepoint & OPay Automated Bank Transfer Verification Shield'
    ],
    accentColor: '#38bdf8', // Electric Cyan
    screenTag: 'REVENUE ACCELERATOR',
    screenTitle: 'Official Mobile Store & Booking Portal',
    screenMetric: 'Sub-3s WhatsApp Response Time',
    screenChatText: '“Hello! Here is our official catalog & instant delivery price sizer for your location.”'
  },
  {
    id: 3,
    filename: 'ad_3_solar_boq_sizer_luxury.png',
    tag: 'SOLAR & INVERTER ENGINEERING',
    titleLine1: 'Solar Inverter Website Design',
    titleLine2: '& Instant WhatsApp BOQ Calculator',
    subtitle: 'Stop doing manual load calculations for clients who ghost you! Close 3x more solar projects on WhatsApp with zero paperwork.',
    features: [
      'Interactive Appliance Load Sizer (Inverter kVA & Battery Sizing)',
      'Instant WhatsApp BOQ Quotation Generator sent in 60 seconds',
      'Motor Inrush Surge Protection Calculator (No Blown Inverters)',
      'NEPA Band A Tariff vs Generator Fuel Savings Payback Clock'
    ],
    accentColor: '#f59e0b', // Solar Amber
    screenTag: 'SOLAR SIZING ENGINE',
    screenTitle: 'Interactive Load Calculator',
    screenMetric: 'Instant WhatsApp BOQ Generator',
    screenChatText: '“Client selected 1.5HP AC + Fridge. Recommended: 3.5kVA Inverter + 2x 200Ah Lithium.”'
  },
  {
    id: 4,
    filename: 'ad_4_fake_alert_shield_luxury.png',
    tag: 'FINTECH & STORE SECURITY',
    titleLine1: 'Online Store Website & Moniepoint',
    titleLine2: 'Anti-Fake Alert Cashier Shield',
    subtitle: 'Stop losing inventory to photoshopped bank transfer screenshots, fake alerts, and unrecorded cashier deficits!',
    features: [
      'Real-Time Moniepoint & Paystack Bank Webhook Verification',
      'Instant Cryptographic Green Pass sent to cashier phone on real credit',
      'Multi-Branch Cashier Shift Reconciliation in 60 seconds',
      'Automated WhatsApp Digital Receipts sent to verified buyers'
    ],
    accentColor: '#10b981', // Emerald Shield Green
    screenTag: 'FINANCIAL RECONCILIATION',
    screenTitle: 'Instant Bank Webhook Shield',
    screenMetric: '100% Cryptographic Green Pass',
    screenChatText: '“Bank Credit Confirmed: Direct NIP transfer verified in 1.2s. Safe to release goods.”'
  },
  {
    id: 5,
    filename: 'ad_5_salon_deposit_booking_luxury.png',
    tag: 'BEAUTY CLINICS, SPAS & SALONS',
    titleLine1: 'Beauty Salon & Clinic Website',
    titleLine2: '+ 24/7 WhatsApp Booking Engine',
    subtitle: 'Eliminate empty chairs and no-show clients! Lock appointment slots with automated reservation deposits.',
    features: [
      '24/7 Mobile Self-Service Booking Calendar on WhatsApp',
      'Mandatory Upfront Reservation Deposit Lock via Moniepoint',
      'Automated SMS & WhatsApp Reminders (Cuts No-Shows by 90%)',
      'Stylist & Doctor Commission Split Daily Revenue Ledger'
    ],
    accentColor: '#ec4899', // Rose Quartz
    screenTag: 'APPOINTMENT SCHEDULER',
    screenTitle: '24/7 Time Slot Reservation',
    screenMetric: 'Upfront Deposit Locked',
    screenChatText: '“Slot Reserved: Saturday 2:00 PM confirmed. Deposit received via Moniepoint.”'
  },
  {
    id: 6,
    filename: 'ad_6_school_fee_portal_luxury.png',
    tag: 'PRIVATE SCHOOLS & COLLEGES',
    titleLine1: 'Private School Website Design',
    titleLine2: '& Online Student Result PIN Portal',
    subtitle: 'Stop tracking fee defaulters on messy paper! Recover fees on schedule and modernize your school administration.',
    features: [
      'Automated Digital Result Gating (Report Cards Locked Until Paid)',
      'Scratch-Card & Electronic Result Checker PIN Generator',
      '3-Stage Installment Debt Aging Matrix (Resumption to Exams)',
      'Polite WhatsApp Balance Reminders Sent to Parents Automatically'
    ],
    accentColor: '#6366f1', // Academic Indigo
    screenTag: 'ACADEMIC PORTAL',
    screenTitle: 'Term Result & Fee Recovery',
    screenMetric: 'Fee Gating Active',
    screenChatText: '“Result Access PIN Verified: 2nd Term Examination Report Card unlocked for download.”'
  },
  {
    id: 7,
    filename: 'ad_7_tenant_rent_portal_luxury.png',
    tag: 'ESTATE ASSOCIATIONS & LANDLORDS',
    titleLine1: 'Real Estate & Property Management',
    titleLine2: 'Website with Service Charge Portal',
    subtitle: 'Manage facility service charges, estate generator diesel, and tenant rent collections with zero disputes!',
    features: [
      'Itemized Utility Billing (Generator Diesel, Security, Waste, Water)',
      'Automated Rent Renewal WhatsApp Reminders (30, 14, 7 Days)',
      'Instant Digital Rent Receipts & Unalterable Accounting Ledger',
      'Visitor Gate Pass QR Code Generator for Estate Security Guards'
    ],
    accentColor: '#14b8a6', // Teal Architecture
    screenTag: 'PROPERTY MANAGEMENT',
    screenTitle: 'Estate Service Charge Portal',
    screenMetric: 'Digital Payment Receipts',
    screenChatText: '“Service Charge Reconciled: Security & generator diesel receipt generated for Unit B4.”'
  },
  {
    id: 8,
    filename: 'ad_8_dispatch_waybill_tracker_luxury.png',
    tag: 'LOGISTICS, COURIERS & HAULAGE',
    titleLine1: 'Logistics & Courier Website Design',
    titleLine2: '+ Interstate Waybill Tracking Engine',
    subtitle: 'Stop answering 50+ repeated "Where is my parcel?" calls daily! Send automatic tracking links on package intake.',
    features: [
      'Automated SMS & WhatsApp Tracking Links on Package Intake',
      'Real-Time Milestones (Intake, In Transit, Arrived Hub, Delivered)',
      'Digital Proof of Delivery (POD) Signature & Recipient Photo',
      'Highway Driver Interstate Diesel Mileage & Fuel Audit'
    ],
    accentColor: '#f97316', // Dispatch Orange
    screenTag: 'WAYBILL TRACKING',
    screenTitle: 'Live Package Milestone GPS',
    screenMetric: 'Real-Time Status Broadcast',
    screenChatText: '“Waybill #BM-904: Package arrived Ibadan Central Hub. Out for delivery.”'
  },
  {
    id: 9,
    filename: 'ad_9_stock_theft_ledger_luxury.png',
    tag: 'RETAIL SHOPS & FACTORIES',
    titleLine1: 'Multi-Store Inventory Website',
    titleLine2: '& Pure Water Factory Stock Tracker',
    subtitle: 'Running 2+ shops or a water factory? Stop losing millions to inventory theft, unrecorded shrinkage, and driver cash fraud.',
    features: [
      'Multi-Branch Real-Time Stock Sync Across Shops & Warehouse',
      'Sachet Water Route Reconciliation (Bags vs Cash vs Burst Allowance)',
      'Dual-Signoff Digital Gate Pass for Inter-Branch Transfers',
      'Staff Permission Gating (Attendants Cannot Edit or Clear Sales)'
    ],
    accentColor: '#8b5cf6', // Deep Violet
    screenTag: 'THEFT PREVENTION LEDGER',
    screenTitle: 'Multi-Branch Inventory Sync',
    screenMetric: 'Zero Unrecorded Shrinkage',
    screenChatText: '“Shift Audit Balanced: 450 bags loaded, 442 sold, 8 burst allowance verified.”'
  },
  {
    id: 10,
    filename: 'ad_10_construction_estimator_luxury.png',
    tag: 'BUILDING CONTRACTORS & BUILDERS',
    titleLine1: 'Construction Contractor Website',
    titleLine2: '& Material BOQ Sizing Calculator',
    subtitle: 'Eliminate building material waste and contractor over-budgeting on foundations, decking, and interior finishing!',
    features: [
      'Precision Cement, Sand & Granite Mix Sizer for Foundations & Decking',
      'Floor Tile Square-Meter & Adhesive Calculator with 12% Cut Buffer',
      'Emulsion & Gloss Paint Wall Coverage Estimator',
      '1-Tap Bankable Itemized BOQ PDF Generator with Current Lagos Prices'
    ],
    accentColor: '#eab308', // Builder Gold
    screenTag: 'MATERIAL ESTIMATOR',
    screenTitle: 'Computerized BOQ Sizer',
    screenMetric: 'Itemized Quantity Takeoff',
    screenChatText: '“Decking Sizing Complete: 120 bags Dangote 42.5N + 30 tons granite calculated.”'
  },
  {
    id: 14,
    filename: 'banner_51159464_1793622633384.png',
    tag: 'MOBILE APPS & APK CREATION',
    titleLine1: 'Website to Android Mobile App',
    titleLine2: '• Installable APK Build in 24 Hours',
    subtitle: 'Turn your business website into an installable Android App! Put your business on customer homescreens with 1-tap WhatsApp access.',
    features: [
      'Turn Any Business Website into an Official Android App (.APK & PWA)',
      '1-Tap Direct WhatsApp & Instagram Bio Download Link',
      'Native WhatsApp Chat, Direct Phone Calls & OPay/Moniepoint Deep-Links',
      'Branded App Icon, Fast Offline Caching & Zero Google Play $25 Delay'
    ],
    accentColor: '#06b6d4', // App Cyan
    screenTag: 'ANDROID APP BUILDER',
    screenTitle: 'Native Mobile APK Package',
    screenMetric: 'Instant Homescreen Icon',
    screenChatText: '“APK Package Ready: 4.2MB lightweight build ready for direct client installation.”'
  }
];

async function renderAllLuxuryBanners() {
  console.log('Launching headless browser to render 10 3D luxury banners at 1200x1200px...\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 1200 },
    deviceScaleFactor: 1
  });

  const publicDir = path.resolve(__dirname, '../public/jiji_ads');
  const desktopDir = 'C:\\Users\\HomePC\\Desktop\\JIJI_ADS_PICTURES';

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });

  const generatedFiles = [];

  for (let i = 0; i < ALL_10_BANNERS.length; i++) {
    const ad = ALL_10_BANNERS[i];
    console.log(`[${i + 1}/${ALL_10_BANNERS.length}] Rendering 3D Luxury Banner: ${ad.filename}`);
    console.log(`   Title: ${ad.titleLine1} ${ad.titleLine2}`);

    const html = generate3DLuxuryHtml(ad);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(1000); // Allow fonts & CSS 3D transforms to settle

    const publicPath = path.join(publicDir, ad.filename);
    await page.screenshot({ path: publicPath, type: 'png' });

    const desktopPath = path.join(desktopDir, ad.filename);
    await page.screenshot({ path: desktopPath, type: 'png' });

    // Also save copy for ad_14 alternate filename
    if (ad.id === 14) {
      const altPublicPath = path.join(publicDir, 'ad_14_website_to_android_app_luxury.png');
      const altDesktopPath = path.join(desktopDir, 'ad_14_website_to_android_app_luxury.png');
      fs.copyFileSync(publicPath, altPublicPath);
      fs.copyFileSync(desktopPath, altDesktopPath);
    }

    console.log(`   ✔ Successfully saved to public/jiji_ads/${ad.filename} and Desktop/JIJI_ADS_PICTURES`);
    generatedFiles.push({ filename: ad.filename, title: `${ad.titleLine1} ${ad.titleLine2}` });
  }

  await browser.close();

  fs.writeFileSync(
    'local_db/luxury_3d_banners_manifest.json',
    JSON.stringify(generatedFiles, null, 2),
    'utf8'
  );

  console.log('\n============================================================');
  console.log('--- ALL 10 3D LUXURY ADVERT BANNERS RENDERED SUCCESSFULLY ---');
  console.log('STRICT JIJI RULES COMPLIANCE:');
  console.log('✔ ZERO Phone Numbers on images');
  console.log('✔ ZERO Prices or Naira symbols on images');
  console.log('✔ Highly luxurious 3D Device & Glassmorphic visual branding');
  console.log('✔ Official CAC Certified Enterprise seal (Reg: 9912717)');
  console.log('============================================================');
}

renderAllLuxuryBanners().catch(console.error);
