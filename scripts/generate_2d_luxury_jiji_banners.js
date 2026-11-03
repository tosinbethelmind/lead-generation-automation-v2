const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

/**
 * ⚡ 100% JIJI-COMPLIANT LUXURY 2D ADVERT BANNERS GENERATOR
 * STRICT RULES:
 * - ZERO Prices on images (No ₦, no setup fee, no annual fee)
 * - ZERO Phone numbers / WhatsApp numbers on images
 * - ZERO Physical addresses on images
 * - High-converting luxury obsidian & champagne gold branding
 * - CAC Certified Enterprise seal & guaranteed SLA trust badges
 */

const ADS_TO_RENDER = [
  {
    id: 2,
    filename: 'ad_2_website_ai_closer_luxury.png',
    tag: 'DIGITAL COMMERCE & SALES',
    title: '24-HOUR EXPRESS WEBSITE + 24/7 WHATSAPP CLOSER',
    subtitle: 'Stop Losing Customers to Competitors on Google Search',
    features: [
      'Official Mobile Business Website (Fast-Loading on All Phones)',
      '24/7 AI WhatsApp Sales Closer (Replies & Sells in 3 Seconds)',
      'Google Maps & Local Search SEO Ranking Setup Included',
      'Moniepoint & OPay Anti-Fake Alert Payment Verification'
    ],
    accentColor: '#38bdf8'
  },
  {
    id: 3,
    filename: 'ad_3_solar_boq_sizer_luxury.png',
    tag: 'RENEWABLE ENERGY & SOLAR',
    title: 'SOLAR INVERTER BOQ LOAD SIZER & QUOTING TOOL',
    subtitle: 'Close 3x More Solar Projects on WhatsApp with Zero Paperwork',
    features: [
      'Interactive Appliance Load Picker (ACs, Fridges, Pumps)',
      'Instant WhatsApp BOQ Proposal Generated in 60 Seconds',
      'Motor Inrush Surge Protection Calculator (No Blown Inverters)',
      'Band A Tariff vs Generator Fuel Savings Payback Clock'
    ],
    accentColor: '#f59e0b'
  },
  {
    id: 4,
    filename: 'ad_4_fake_alert_shield_luxury.png',
    tag: 'FINTECH & STORE SECURITY',
    title: 'ANTI-FAKE ALERT SHIELD & CASHIER THEFT AUDIT',
    subtitle: 'Stop Photoshopped Transfer Receipts & Cashier Deficits Instantly',
    features: [
      'Real-Time Moniepoint & Paystack Webhook Verification',
      'Instant Green Security Pass Sent to Cashier Phone on Real Credit',
      'Multi-Branch Cashier Shift Reconciliation in 60 Seconds',
      'Automated WhatsApp Digital Receipts for Genuine Buyers'
    ],
    accentColor: '#10b981'
  },
  {
    id: 5,
    filename: 'ad_5_salon_deposit_booking_luxury.png',
    tag: 'BEAUTY, CLINICS & SPAS',
    title: '24/7 APPOINTMENT BOOKING WITH DEPOSIT LOCK',
    subtitle: 'Eliminate Empty Salon Chairs & No-Show Appointment Losses',
    features: [
      '24/7 Mobile Self-Service Booking Calendar on WhatsApp',
      'Mandatory Upfront Reservation Deposit Lock via Moniepoint',
      'Automated WhatsApp Appointment Reminders (Cuts No-Shows 90%)',
      'Stylist & Doctor Commission Split Daily Revenue Ledger'
    ],
    accentColor: '#ec4899'
  },
  {
    id: 6,
    filename: 'ad_6_school_fee_portal_luxury.png',
    tag: 'EDUCATION & SCHOOL ADMIN',
    title: 'SCHOOL TERM FEE RECOVERY & RESULT PIN PORTAL',
    subtitle: 'Stop Unpaid Fees & Eliminate Bursar Cash Leakage Completely',
    features: [
      'Automated Digital Result Gating (Report Cards Locked Until Paid)',
      'Scratch-Card & Electronic Result Checker PIN Generator',
      '3-Stage Installment Debt Aging Matrix (Resumption, Mid-Term, Exams)',
      'Polite WhatsApp Balance Reminders Sent to Parents Automatically'
    ],
    accentColor: '#6366f1'
  },
  {
    id: 7,
    filename: 'ad_7_tenant_rent_portal_luxury.png',
    tag: 'REAL ESTATE & ESTATES',
    title: 'ESTATE SERVICE CHARGE & TENANT RENT PORTAL',
    subtitle: 'Manage Facility Diesel, Security & Rent with Zero Disputes',
    features: [
      'Itemized Utility Billing (Generator Diesel, Security, Waste, Water)',
      'Automated Rent Renewal WhatsApp Reminders (30, 14, 7 Days)',
      'Instant Digital Rent Receipts & Unalterable Accounting Ledger',
      'Visitor Gate Pass QR Code Generator for Estate Security Guards'
    ],
    accentColor: '#14b8a6'
  },
  {
    id: 8,
    filename: 'ad_8_dispatch_waybill_tracker_luxury.png',
    tag: 'LOGISTICS & HAULAGE',
    title: 'INTERSTATE DISPATCH & WAYBILL TRACKING ENGINE',
    subtitle: 'Stop 50+ Daily "Where Is My Parcel?" WhatsApp Inquiries',
    features: [
      'Automated SMS & WhatsApp Tracking Links on Package Intake',
      'Real-Time Milestones (Intake, In Transit, Arrived Hub, Delivered)',
      'Digital Proof of Delivery (POD) Signature & Recipient Photo',
      'Driver Interstate Highway Diesel Mileage & Siphoning Audit'
    ],
    accentColor: '#f97316'
  },
  {
    id: 9,
    filename: 'ad_9_stock_theft_ledger_luxury.png',
    tag: 'RETAIL & FMCG FACTORIES',
    title: 'MULTI-STORE INVENTORY & WATER FACTORY RECONCILER',
    subtitle: 'Stop Employee Stock Shrinkage, Cash Deficits & Driver Fraud',
    features: [
      'Multi-Branch Real-Time Stock Sync Across Shops & Warehouse',
      'Sachet Water Route Reconciliation (Bags vs Cash vs Burst Allowance)',
      'Dual-Signoff Digital Gate Pass for Inter-Branch Transfers',
      'Staff Permission Gating (Attendants Cannot Edit or Clear Sales)'
    ],
    accentColor: '#8b5cf6'
  },
  {
    id: 10,
    filename: 'ad_10_construction_estimator_luxury.png',
    tag: 'BUILDING & CONSTRUCTION',
    title: 'BUILDING MATERIAL ESTIMATOR & BOQ CALCULATOR',
    subtitle: 'Eliminate Contractor Material Inflation & Site Breakage Waste',
    features: [
      'Precision Cement, Sand & Granite Mix Sizer for Foundations & Decking',
      'Floor Tile Square-Meter & Adhesive Calculator with 12% Cut Buffer',
      'Emulsion & Gloss Paint Wall Coverage Estimator',
      '1-Tap Bankable Itemized BOQ PDF Generator with Current Lagos Prices'
    ],
    accentColor: '#eab308'
  },
  {
    id: 11,
    filename: 'ad_11_shortlet_booking_escrow_luxury.png',
    tag: 'SHORTLET & HOSPITALITY',
    title: 'SHORTLET DIRECT BOOKING & CAUTION ESCROW APP',
    subtitle: 'Stop 20% Airbnb Commission Losses & DisCo Token Arguments',
    features: [
      'Direct Guest Booking Calendar with Instant Paystack/OPay Deposit Lock',
      'Automated DisCo Electricity Meter Quota vs Caution Refund Sizer',
      'Digital Check-In Passport/ID Verification & Property Agreement',
      'Instant WhatsApp Gate Pass Code for Estate Security Guards'
    ],
    accentColor: '#10b981'
  },
  {
    id: 14,
    filename: 'ad_14_website_to_android_app_luxury.png',
    tag: 'MOBILE APPS & APK CREATION',
    title: 'WEBSITE TO ANDROID APP IN 24H (NO CODING)',
    subtitle: 'Put Your Business On Customer Homescreens • Direct APK & PWA',
    features: [
      'Turn Any Business Website into an Official Installable Android App (.APK)',
      '1-Tap Direct WhatsApp & Instagram Bio Download Link',
      'Native WhatsApp Chat, Direct Phone Calls & OPay/Moniepoint Deep-Links',
      'Branded App Icon, Offline Fallback & Zero Google Play $25 Delay'
    ],
    accentColor: '#06b6d4'
  }
];

function generateHtml(ad) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      background: #070b14;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #ffffff;
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    /* Ambient Glows */
    .bg-glow-1 {
      position: absolute;
      top: -100px;
      left: -100px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, ${ad.accentColor}25 0%, transparent 70%);
      filter: blur(80px);
      z-index: 1;
    }
    .bg-glow-2 {
      position: absolute;
      bottom: -150px;
      right: -150px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, #d4af3720 0%, transparent 70%);
      filter: blur(90px);
      z-index: 1;
    }

    /* Subtle Grid Overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      z-index: 2;
      opacity: 0.8;
    }

    /* Top Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: linear-gradient(135deg, #d4af37 0%, #aa8620 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 24px;
      color: #070b14;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    .brand-name {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #f8fafc;
    }
    .cac-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.35);
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Hero Section */
    .hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 10px;
    }
    .sector-tag {
      font-size: 15px;
      font-weight: 800;
      color: ${ad.accentColor};
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 46px;
      font-weight: 900;
      line-height: 1.12;
      letter-spacing: -1px;
      color: #ffffff;
      max-width: 960px;
    }
    .hero-subtitle {
      font-size: 21px;
      font-weight: 600;
      color: #94a3b8;
      line-height: 1.4;
      max-width: 900px;
    }

    /* 2D Luxury Feature Card */
    .feature-card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 32px 36px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      margin-top: 6px;
    }
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      font-size: 19px;
      font-weight: 700;
      color: #e2e8f0;
      line-height: 1.35;
    }
    .check-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: ${ad.accentColor}25;
      border: 1.5px solid ${ad.accentColor};
      color: ${ad.accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* High-Converting CTA Box (100% JIJI-COMPLIANT: NO Price, NO Phone Number) */
    .cta-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1.5px solid rgba(212, 175, 55, 0.4);
      padding: 24px 36px;
      border-radius: 20px;
      position: relative;
      z-index: 10;
    }
    .cta-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cta-badge {
      font-size: 25px;
      font-weight: 900;
      color: #34d399;
      letter-spacing: -0.5px;
    }
    .cta-sub {
      font-size: 15px;
      color: #94a3b8;
      font-weight: 700;
    }
    .cta-btn {
      background: linear-gradient(135deg, #d4af37 0%, #aa8620 100%);
      color: #070b14;
      padding: 18px 36px;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
    }

    /* Footer Trust */
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 14px;
      color: #64748b;
      font-weight: 600;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .trust-item strong {
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="grid-overlay"></div>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="brand-box">
      <div class="brand-logo">B</div>
      <div class="brand-name">Bethelmind Digital Solutions</div>
    </div>
    <div class="cac-badge">CAC Certified (Reg: 9912717)</div>
  </div>

  <!-- Hero Section -->
  <div class="hero-content">
    <span class="sector-tag">• ${ad.tag}</span>
    <h1 class="hero-title">${ad.title}</h1>
    <p class="hero-subtitle">${ad.subtitle}</p>

    <!-- 2D Luxury Card -->
    <div class="feature-card">
      <div class="feature-list">
        ${ad.features.map(f => `
          <div class="feature-item">
            <div class="check-icon">✓</div>
            <div>${f}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- 100% Compliant Conversion Box -->
  <div class="cta-box">
    <div class="cta-left">
      <div class="cta-badge">⚡ 24-48h Guaranteed Express Delivery</div>
      <div class="cta-sub">Test Live Working Prototype on Your Phone Before Handover</div>
    </div>
    <div class="cta-btn">TAP "START CHAT" FOR FREE DEMO</div>
  </div>

  <!-- Footer Trust -->
  <div class="footer-bar">
    <div class="trust-item">⚡ <strong>Live in 24-48 Hours</strong></div>
    <div class="trust-item">🔒 <strong>CAC Certified Enterprise</strong></div>
    <div class="trust-item">📱 <strong>Test Free on Phone Before Handover</strong></div>
  </div>
</body>
</html>`;
}

async function renderAll() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 }
  });

  const desktopDir = 'C:\\Users\\HomePC\\Desktop\\JIJI_ADS_PICTURES';
  const publicDir = path.join(__dirname, '../public/jiji_ads');

  for (const ad of ADS_TO_RENDER) {
    console.log(`Rendering luxury image for Ad #${ad.id}: ${ad.filename} ...`);
    const html = generateHtml(ad);
    await page.setContent(html, { waitUntil: 'networkidle' });
    
    // Save to public/jiji_ads
    const publicPath = path.join(publicDir, ad.filename);
    await page.screenshot({ path: publicPath });

    // Save to Desktop/JIJI_ADS_PICTURES
    if (fs.existsSync(desktopDir)) {
      const desktopPath = path.join(desktopDir, ad.filename);
      await page.screenshot({ path: desktopPath });
    }

    console.log(`✔ Saved: ${ad.filename}`);
  }

  await browser.close();
  console.log('\n--- All 100% Jiji-Compliant Luxury Advert Banners Rendered Successfully! ---');
}

renderAll().catch(console.error);
