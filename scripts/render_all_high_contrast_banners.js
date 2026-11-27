const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { generateHighContrastHtml } = require('./high_contrast_jiji_template');

const ALL_HIGH_CONTRAST_BANNERS = [
  {
    id: 2,
    filename: 'ad_2_website_ai_closer_luxury.png',
    badgeText: 'WEBSITE DESIGN LAGOS & ABUJA',
    headline1: 'Get Your Shop Website',
    headlineHighlight: 'In Exactly 24 Hours',
    subtext: 'Stop losing paying customers on Google! We launch your official mobile store with automated WhatsApp orders and 36-state delivery.',
    benefits: [
      'Official Mobile Website (Loads ultra-fast on all phones)',
      '24/7 AI WhatsApp Closer (Sends catalog & sells in 3 seconds)',
      'Google Maps & Google Search Ranking Setup Included',
      'Moniepoint & OPay Bank Transfer Verification Shield'
    ],
    accentColor: '#2563eb',
    mockShopName: 'Lagos Fashion & Gadget Store',
    mockShopSubtitle: 'Official Online Store & WhatsApp Checkout',
    mockWidgetHighlight: 'Instant Moniepoint Bank Checkout'
  },
  {
    id: 3,
    filename: 'ad_3_solar_boq_sizer_luxury.png',
    badgeText: 'SOLAR INSTALLERS & DEALERS',
    headline1: 'Solar Load Sizer &',
    headlineHighlight: 'WhatsApp BOQ Quoter',
    subtext: 'Stop wasting hours calculating loads for clients who ghost you! Send instant automated PDF proposals on WhatsApp in 60 seconds.',
    benefits: [
      'Interactive Appliance Load Sizer (ACs, Fridges, Pumps)',
      'Instant WhatsApp Quotation sent to client in 60s',
      'Inverter kVA & Lithium Battery Bank Sizing Matrix',
      'Band A Tariff vs Fuel Payback Savings Calculator'
    ],
    accentColor: '#d97706',
    mockShopName: 'Solar Energy Pro Solutions',
    mockShopSubtitle: 'Computerized Inverter Load Calculator',
    mockWidgetHighlight: 'Instant 60-Second WhatsApp BOQ'
  },
  {
    id: 4,
    filename: 'ad_4_fake_alert_shield_luxury.png',
    badgeText: 'BOUTIQUES & RETAIL SHOPS',
    headline1: 'Online Store Website &',
    headlineHighlight: 'Moniepoint POS Shield',
    subtext: 'Stop falling victim to fake bank transfer alerts, photoshopped receipts, and sales attendants stealing daily cash!',
    benefits: [
      'Real-Time Moniepoint & Paystack Webhook Verification',
      'Instant Green Security Pass sent to cashier phone',
      'Multi-Branch Cashier Shift Audit in 60 seconds',
      'Automated WhatsApp Digital Receipts for buyers'
    ],
    accentColor: '#059669',
    mockShopName: 'Supermarket & Boutique Hub',
    mockShopSubtitle: 'Anti-Fake Alert & Cashier Audit System',
    mockWidgetHighlight: '100% Cryptographic Green Pass'
  },
  {
    id: 5,
    filename: 'ad_5_salon_deposit_booking_luxury.png',
    badgeText: 'BEAUTY SALONS, SPAS & CLINICS',
    headline1: 'Salon Booking Website',
    headlineHighlight: 'With Upfront Deposit Lock',
    subtext: 'Eliminate empty salon chairs and missed appointments! Lock client time slots with automated reservation deposits.',
    benefits: [
      '24/7 Mobile Booking Calendar connected to WhatsApp',
      'Upfront Reservation Deposit Lock via Moniepoint',
      'Automated WhatsApp Reminders (Cuts no-shows 90%)',
      'Stylist & Doctor Commission Split Daily Ledger'
    ],
    accentColor: '#db2777',
    mockShopName: 'Luxury Hair & Aesthetic Spa',
    mockShopSubtitle: '24/7 VIP Appointment Reservation',
    mockWidgetHighlight: 'Upfront Deposit Locked via OPay'
  },
  {
    id: 6,
    filename: 'ad_6_school_fee_portal_luxury.png',
    badgeText: 'PRIVATE SCHOOLS & COLLEGES',
    headline1: 'School Result Checker',
    headlineHighlight: '& Term Fee Recovery Portal',
    subtext: 'Stop tracking fee defaulters on messy exercise books! Lock digital report cards until fees are fully settled.',
    benefits: [
      'Automated Digital Result Gating (No fees = No report card)',
      'Scratch-Card & Electronic PIN Number Generator',
      '3-Stage Debt Aging Matrix (Resumption to Exam Week)',
      'Polite WhatsApp Balance Reminders sent to parents'
    ],
    accentColor: '#4f46e5',
    mockShopName: 'Premier Academy & Model College',
    mockShopSubtitle: 'Online Student Result & Fees Portal',
    mockWidgetHighlight: 'Report Cards Auto-Gated Until Paid'
  },
  {
    id: 7,
    filename: 'ad_7_tenant_rent_portal_luxury.png',
    badgeText: 'ESTATE ASSOCIATIONS & LANDLORDS',
    headline1: 'Estate Service Charge',
    headlineHighlight: '& Tenant Rent Portal',
    subtext: 'Manage residential estate service charges, generator diesel bills, and tenant rent collections with zero disputes!',
    benefits: [
      'Itemized Utility Billing (Generator Diesel, Security, Waste)',
      'Automated WhatsApp Rent Reminders (30, 14, 7 Days)',
      'Instant Digital Rent Receipts & Unalterable Ledger',
      'Estate Security Gate Pass QR Access Generator'
    ],
    accentColor: '#0d9488',
    mockShopName: 'Residential Estate Executive Portal',
    mockShopSubtitle: 'Service Charge & Diesel Audit System',
    mockWidgetHighlight: 'Verified Bank Receipts & Ledger'
  },
  {
    id: 8,
    filename: 'ad_8_dispatch_waybill_tracker_luxury.png',
    badgeText: 'LOGISTICS & INTERSTATE HAULAGE',
    headline1: 'Logistics Website Design',
    headlineHighlight: '+ Waybill Tracking Engine',
    subtext: 'Stop answering 50+ repeated "Where is my parcel?" phone calls daily! Send automatic tracking links on package intake.',
    benefits: [
      'Automated SMS & WhatsApp Tracking Links on Intake',
      'Real-Time Milestones (Intake, In Transit, Arrived Hub)',
      'Digital Proof of Delivery (POD) Signature & Photo',
      'Interstate Driver Diesel Mileage & Siphoning Audit'
    ],
    accentColor: '#ea580c',
    mockShopName: 'Interstate Express Logistics',
    mockShopSubtitle: 'Real-Time Parcel Waybill Tracker',
    mockWidgetHighlight: 'Automatic WhatsApp Tracking Link'
  },
  {
    id: 9,
    filename: 'ad_9_stock_theft_ledger_luxury.png',
    badgeText: 'RETAIL SHOPS & WATER FACTORIES',
    headline1: 'Multi-Store Inventory',
    headlineHighlight: '& Stock Theft Reconciler',
    subtext: 'Running 2+ shop branches or a sachet water factory? Stop losing millions to inventory theft and unrecorded driver cash shortages!',
    benefits: [
      'Multi-Branch Real-Time Stock Sync Across All Shops',
      'Sachet Water Route Reconciliation (Bags vs Cash)',
      'Dual-Signoff Digital Gate Pass for Inter-Branch Transfers',
      'Staff Permission Gating (Attendants Cannot Edit Sales)'
    ],
    accentColor: '#7c3aed',
    mockShopName: 'Multi-Store Retail & Factory Central',
    mockShopSubtitle: 'Theft Prevention & Shift Cash Reconciler',
    mockWidgetHighlight: 'Bags Loaded vs Shift Cash Balanced'
  },
  {
    id: 10,
    filename: 'ad_10_construction_estimator_luxury.png',
    badgeText: 'BUILDING CONTRACTORS & BUILDERS',
    headline1: 'Building Material Sizer',
    headlineHighlight: '& Instant BOQ Calculator',
    subtext: 'Eliminate building material waste and contractor over-budgeting on foundations, decking, and interior tiles!',
    benefits: [
      'Precision Cement, Sand & Granite Mix Sizer for Decking',
      'Floor Tile Square-Meter & Adhesive Sizer with Cut Buffer',
      'Emulsion & Gloss Paint Wall Coverage Estimator',
      '1-Tap Itemized BOQ PDF Generator with Current Lagos Prices'
    ],
    accentColor: '#ca8a04',
    mockShopName: 'Construction & Civil Engineering Hub',
    mockShopSubtitle: 'Computerized Material BOQ Calculator',
    mockWidgetHighlight: 'Itemized BOQ PDF with Current Prices'
  },
  {
    id: 14,
    filename: 'banner_51159464_1793622633384.png',
    badgeText: 'ANDROID APP BUILDER',
    headline1: 'Convert Any Website To',
    headlineHighlight: 'Android App in 24 Hours',
    subtext: 'Put your business on customer phone homescreens! Fast lightweight APK build ready for direct download with push notifications.',
    benefits: [
      'Turn Any Website into an Installable Android App (.APK)',
      '1-Tap WhatsApp Direct In-App Chat Integration',
      'Offline Screen Caching (Loads fast on poor networks)',
      'Zero Tech Skills & Zero Google Play $25 Delay'
    ],
    accentColor: '#0284c7',
    mockShopName: 'Android APK Mobile App Builder',
    mockShopSubtitle: 'Native Android APK Build in 24 Hours',
    mockWidgetHighlight: 'Direct WhatsApp Download Link'
  }
];

async function renderHighContrastBanners() {
  console.log('Rendering 10 High-Contrast Street-Smart Jiji Banners...\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 1200 }
  });

  const publicDir = path.resolve(__dirname, '../public/jiji_ads');
  const desktopDir = 'C:\\Users\\HomePC\\Desktop\\JIJI_ADS_PICTURES';

  for (let i = 0; i < ALL_HIGH_CONTRAST_BANNERS.length; i++) {
    const ad = ALL_HIGH_CONTRAST_BANNERS[i];
    console.log(`[${i + 1}/${ALL_HIGH_CONTRAST_BANNERS.length}] Rendering: ${ad.filename}`);
    console.log(`   Headline: ${ad.headline1} ${ad.headlineHighlight}`);

    const html = generateHighContrastHtml(ad);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(800);

    const publicPath = path.join(publicDir, ad.filename);
    await page.screenshot({ path: publicPath, type: 'png' });

    const desktopPath = path.join(desktopDir, ad.filename);
    await page.screenshot({ path: desktopPath, type: 'png' });

    if (ad.id === 14) {
      fs.copyFileSync(publicPath, path.join(publicDir, 'ad_14_website_to_android_app_luxury.png'));
      fs.copyFileSync(desktopPath, path.join(desktopDir, 'ad_14_website_to_android_app_luxury.png'));
    }

    console.log(`   ✔ Rendered & saved successfully!`);
  }

  await browser.close();
  console.log('\n============================================================');
  console.log('ALL 10 HIGH-CONTRAST STREET-SMART BANNERS CREATED!');
  console.log('✔ High-contrast, billboard-style mobile visibility');
  console.log('✔ ZERO Phone Numbers & ZERO Prices (100% Policy-Safe)');
  console.log('✔ Plain Nigerian business benefit copy');
  console.log('============================================================');
}

renderHighContrastBanners().catch(console.error);
