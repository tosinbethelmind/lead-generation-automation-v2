/**
 * @file src/lib/pillarOneCatalog.ts
 * 
 * 🏛️ BETHELMIND DIGITAL SOLUTIONS — PILLAR ONE COMMERCIAL SUITE CATALOG
 * CAC Certified Nigerian Enterprise (Reg: 9912717)
 * Primary Corporate Settlement: Moniepoint Microfinance Bank (6805375225)
 * Admin Desk WhatsApp: +234 802 279 1227
 * 
 * Harmonized 2026 Commercial Pricing:
 * - Option 1: Starter Turnkey (100% One-Time, ₦0 Monthly) -> ₦80,000 Flat (50% Milestone Deposit: ₦40,000; ₦95,000 for portals)
 * - Option 2: Full Turnkey Custom Domain Suite -> ₦75,000 Milestone Deposit (₦150,000 Total)
 */

export interface PillarOneService {
  id: string;
  title: string;
  shortTitle: string;
  category: 'Web & Mobile' | 'Engineering & Energy' | 'Fintech & Security' | 'Hospitality & Real Estate' | 'Retail & Supply Chain' | 'EdTech & Portals' | 'Automotive';
  badge: string;
  headline: string;
  problem: string;
  solution: string;
  deliverables: string[];
  pricing: {
    isPortal?: boolean;
    starterSetup: number;
    starterMonthly: number;
    annualPass: number;
    annualSavings: number;
    turnkeyDeposit: number;
    turnkeyTotal: number;
  };
  deliverySla: string;
  liveDemoUrl: string;
  whatsappPitchTemplate: (businessName: string, customUrl?: string) => string;
}

export const PILLAR_ONE_SERVICES: PillarOneService[] = [
  {
    id: 'website_ai',
    title: 'Mobile Business Website + 24/7 AI WhatsApp Sales Closer',
    shortTitle: 'Official Website + AI Closer',
    category: 'Web & Mobile',
    badge: 'FLAGSHIP • 48H EXPRESS',
    headline: 'Stop losing Google searchers and Instagram buyers to competitors who have an official website.',
    problem: 'When Nigerian buyers search for your business on Google right now, they only see third-party directories surrounded by ads for your direct competitors. You lose 60%+ of sales to competitors who respond faster.',
    solution: 'Turnkey official mobile website that loads in sub-1s on MTN/Airtel phones, ranks your business name on Google, and includes a 24/7 AI WhatsApp assistant that quotes prices and closes sales while you sleep.',
    deliverables: [
      'Official Mobile-First Website (.com.ng or .com)',
      'Sub-1s ultra-fast mobile loading on low cellular data',
      '24/7 AI WhatsApp Sales Assistant connected directly to your phone',
      'Interactive product catalog & instant price list',
      'Google Search & Google Maps Business #1 ranking setup',
      'OPay & Moniepoint verified transfer checkout'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/preview/sample-business',
    whatsappPitchTemplate: (biz, url) => 
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions (CAC Reg: 9912717) here.\n\n` +
      `We noticed when prospective customers search for *${biz}* on Google right now, only generic directories show up alongside ads for your competitors because you don't have an official mobile website yet.\n\n` +
      `Instead of waiting weeks for developers, we already built your live Official Mobile Website + 24/7 WhatsApp Sales Assistant for *${biz}*:\n` +
      `👉 Test drive free on your phone: ${url || 'https://www.bethelmindanalytics.com/preview/' + encodeURIComponent(biz.toLowerCase().replace(/[^a-z0-9]/g, ''))}\n\n` +
      `📦 *Pricing Options:*\n` +
      `1️⃣ Starter Go-Live: ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees) (Pay-Small-Small)\n` +
      `2️⃣ Annual Value Pass: ₦80,000 Flat (1 Full Year Free Maintenance — Save ₦39,000!)\n` +
      `3️⃣ Full Custom Domain Suite: ₦75,000 Deposit (₦150k Total)\n\n` +
      `🏛️ Moniepoint MFB: 6805375225 — Bethelmind Digital Solutions.\n` +
      `Reply here or test your link above to go live in 48 hours!`
  },

  {
    id: 'website_to_app',
    title: 'Convert Any Website into Native Android Mobile App (.APK) in 24h',
    shortTitle: 'Website to Android App (.APK)',
    category: 'Web & Mobile',
    badge: 'NEW • 24H EXPRESS',
    headline: 'Turn your existing website into an installable Android APK on your customers\' home screens.',
    problem: 'Customers forget website URLs, browser tabs get lost, and 85%+ of Nigerian smartphone users prefer tapping an app icon on their Android home screen rather than typing web addresses.',
    solution: 'We wrap your existing website into a high-performance Android App (.APK) complete with your custom brand app icon, splash screen, offline fallback, push notifications, and direct WhatsApp ordering.',
    deliverables: [
      'Installable Android .APK ready for immediate customer download',
      'Custom app icon & branded opening splash screen',
      'No $25 Google Play fee or 14-day 20-tester rejection delay required',
      'Dedicated 1-tap download link for your Instagram bio & WhatsApp status',
      'Deep-linking for 1-tap WhatsApp chat & phone call from inside the app',
      'Offline network loss screen with your contact numbers always accessible'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '24 Hours',
    liveDemoUrl: '/tools/website-to-android-app',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Did you know you can put *${biz}* directly onto your customers' Android smartphone home screens as an installable mobile app?\n\n` +
      `We convert your website into a branded Android Mobile App (.APK) within 24 hours:\n` +
      `📱 Branded icon on their phone screen\n` +
      `⚡ Sub-1s loading with zero browser address bar\n` +
      `💬 1-Tap direct WhatsApp button built right into the app\n` +
      `📥 Easy 1-tap download link for your Instagram bio & WhatsApp bio\n\n` +
      `📦 *Pricing:*\n` +
      `• Starter Go-Live: ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees)\n` +
      `• Annual Value Pass: ₦80,000 Flat (1 Full Year Free Maintenance)\n\n` +
      `👉 See details & claim your APK build: ${url || 'https://www.bethelmindanalytics.com/onboard?service=website_to_app&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'solar_boq',
    title: 'Solar & Inverter Load Sizing & Instant WhatsApp BOQ Engine',
    shortTitle: 'Solar BOQ & Quoting Engine',
    category: 'Engineering & Energy',
    badge: 'HIGH DEMAND • NERC BAND A',
    headline: 'Stop doing manual solar calculations on paper while prospective clients buy from faster installers.',
    problem: 'Customers asking "How much for 5kVA?" need instant answers. If you take 4 hours to calculate panel counts and battery bank requirements, they have already messaged 3 other solar companies on Instagram.',
    solution: 'An interactive solar load calculator that lets clients select their home/office appliances, calculates exact inverter kVA, lithium/gel battery counts, and panel wattage, and generates an official branded WhatsApp quote in 5 seconds.',
    deliverables: [
      'Interactive appliance load picker (ACs, fridges, TVs, pumping machines)',
      'Instant Band A DisCo grid tariff vs diesel generator fuel savings breakdown',
      'Automated inverter kVA & battery bank sizer (Lithium vs Gel)',
      '1-Tap WhatsApp BOQ generation with your company name & logo',
      'Lead capture system that forwards client phone numbers straight to your WhatsApp',
      'Paystack/Moniepoint deposit collection for site audit inspections'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/solar-boq',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Are you tired of spending 30 minutes manually drafting solar quotations whenever a prospect asks "how much for 3kVA or 5kVA"?\n\n` +
      `We built a branded Solar & Inverter Load Sizer + Instant WhatsApp BOQ Engine specifically for *${biz}*:\n` +
      `☀️ Customers pick their appliances on their phone\n` +
      `⚡ Sizes inverter, lithium batteries & solar panels automatically\n` +
      `📄 Generates instant WhatsApp quote with your company bank details in 3 seconds!\n\n` +
      `👉 Test drive live demo: ${url || 'https://www.bethelmindanalytics.com/tools/solar-boq'}\n\n` +
      `Launch for *${biz}* today for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees) (or ₦80,000 Annual Pass with 1 Year Free). Moniepoint MFB: 6805375225.`
  },

  {
    id: 'fake_alert',
    title: 'Fake Alert Proof Automated Bank Transfer POS Shield',
    shortTitle: 'Fake Alert & Cashier Shield',
    category: 'Fintech & Security',
    badge: 'SECURITY • RETAIL SHIELD',
    headline: 'Eliminate fake bank transfer alerts, edited screenshots, and cashier theft in your store.',
    problem: 'Nigerian retail stores lose hundreds of thousands monthly to fraudulent SMS alerts, photoshopped bank transfer slips, and cashiers colluding with friends to release goods before funds clear.',
    solution: 'A cloud-based POS screen and cashier tablet app that connects directly to Moniepoint/OPay/Paystack bank transfer webhooks. It flashes green ONLY when the money is genuinely settled in your bank ledger, sounding an audio voice confirmation.',
    deliverables: [
      'Cashier verification tablet/phone interface',
      'Real-time Moniepoint & OPay webhook ledger integration',
      'Audio voice confirmation ("Transfer of ₦24,500 Confirmed")',
      'Anti-screenshot verification (rejects fake bank receipts)',
      'Daily reconciliation report sent to business owner\'s WhatsApp at 8 PM',
      'Multi-cashier theft prevention audit trail'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/preview/sample-retail',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How does your staff currently verify customer bank transfers during busy hours?\n\n` +
      `Fake bank transfer alerts and edited payment screenshots cause massive losses for Nigerian businesses every day.\n\n` +
      `We deploy the *Fake Alert Proof POS Shield* for *${biz}*:\n` +
      `🛡️ Your cashier's screen verifies incoming Moniepoint/OPay credits via real-time bank ledger webhooks\n` +
      `🔊 Sounds an instant audio voice alert the exact second money hits your account\n` +
      `📊 Sends you an 8:00 PM WhatsApp audit summary every evening\n\n` +
      `👉 Setup today for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees): ${url || 'https://www.bethelmindanalytics.com/onboard?service=fake_alert&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'salon_booking',
    title: 'Salon & Aesthetic Clinic 24/7 Appointment Booking + Deposit Lock',
    shortTitle: 'Salon & Clinic Deposit Lock',
    category: 'Retail & Supply Chain',
    badge: 'ANTI-NO-SHOW • BEAUTY & SPA',
    headline: 'Stop empty salon chairs, no-shows, and endless "How much for wig revamp?" DMs.',
    problem: 'Salons and aesthetic clinics suffer from 30%+ no-show rates where clients book a slot and fail to show up, leaving stylists idle. Replying to pricing inquiries manually takes hours every day.',
    solution: 'A 24/7 mobile booking engine that displays your service menu, lets clients choose their stylist and date, and locks the appointment with a mandatory non-refundable deposit (e.g. ₦3,000 - ₦5,000) straight into your account.',
    deliverables: [
      'Mobile service catalog with pricing and photos (braids, wigs, nails, facials)',
      'Real-time stylist & calendar availability scheduler',
      'Automated appointment deposit collection (Moniepoint/Paystack)',
      'Automated SMS & WhatsApp reminder 3 hours before appointment',
      'Client intake consultation form',
      'Staff schedule manager'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/salon-booking',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How many clients booked an appointment this month and failed to show up, wasting your stylists' time?\n\n` +
      `We built a 24/7 Booking Engine + Deposit Lock App for *${biz}*:\n` +
      `💅 Clients pick their hairstyles/services & choose available time slots\n` +
      `🔒 Locks the appointment with an instant deposit (₦3k-₦5k) straight to your bank\n` +
      `📱 Sends automatic WhatsApp reminders to eliminate no-shows completely!\n\n` +
      `👉 Test drive demo: ${url || 'https://www.bethelmindanalytics.com/tools/salon-booking'}\n\n` +
      `Setup for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees, 1 Year Free Hosting). Reply here to go live in 48 hours!`
  },

  {
    id: 'retail_inventory',
    title: 'Multi-Location Stock Theft Prevention & Retail Inventory Ledger',
    shortTitle: 'Multi-Store Stock & Theft Ledger',
    category: 'Retail & Supply Chain',
    badge: 'ANTI-THEFT • PURE WATER & RETAIL',
    headline: 'Track every single carton, pure water bag, and fashion item across stores without losing stock.',
    problem: 'Owners of retail stores, supermarkets, and pure water factories lose millions to shoplifting, unaccounted stock shrinkage, and cashiers selling items off-the-books when the boss is away.',
    solution: 'Cloud-based inventory ledger that tracks opening stock, daily sales, damaged goods, and reorder levels. Sends low-stock and shrinkage alerts directly to the owner\'s WhatsApp every evening.',
    deliverables: [
      'Multi-branch inventory ledger (Shop 1, Shop 2, Main Warehouse)',
      'Barcode / SKU search and quick product lookup',
      'Low stock warning threshold & WhatsApp replenishment alerts',
      'Cashier sales logging with strict permission locks (cashiers cannot edit prices)',
      'Daily 8:00 PM profit and shrinkage WhatsApp executive summary',
      'Offline-capable tablet & mobile phone interface'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/preview/sample-retail',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Do you know your exact physical stock value across your shop right now without doing manual counting?\n\n` +
      `Our Multi-Store Inventory & Theft Prevention App protects *${biz}*:\n` +
      `📦 Real-time tracking of every item sold across branches\n` +
      `🚫 Cashiers cannot alter prices or delete recorded transactions\n` +
      `📱 Instant WhatsApp notification if stock counts don't balance at closing time\n\n` +
      `👉 Deploy today for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees): ${url || 'https://www.bethelmindanalytics.com/onboard?service=retail_inventory&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'shortlet_escrow',
    title: 'Shortlet Apartment Direct Booking Engine & Caution Fee Escrow',
    shortTitle: 'Shortlet Booking & Caution Escrow',
    category: 'Hospitality & Real Estate',
    badge: 'PORTAL • HIGH DEMAND',
    headline: 'Bypass Airbnb/Booking.com 15%-20% commissions and protect your luxury furniture with caution escrow.',
    problem: 'Shortlet operators lose 15-20% of booking revenue to platform commissions, while guests break electronics and appliances without paying for damages because caution fee tracking is messy.',
    solution: 'Direct branded booking portal that lets guests view apartment photos, check real-time calendar availability, pay accommodation + caution deposit, and automates caution fee refund reconciliation upon check-out inspection.',
    deliverables: [
      'Direct guest booking website (Zero 20% Airbnb platform fee)',
      'Real-time date calendar with minimum night rules & weekend surcharges',
      'Automated caution deposit lock & digital receipt generation',
      'Electricity / DisCo token meter quota reconciler',
      'Check-in instructions & gate security PIN dispatch via WhatsApp',
      '1-Tap caution fee refund release upon housekeeper inspection clearance'
    ],
    pricing: {
      isPortal: true,
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 95000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/shortlet-booking-escrow',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Why pay 15% to 20% commission to Airbnb or Booking.com for guests who find your shortlet on Instagram or through referrals?\n\n` +
      `We deploy a Direct Booking Portal + Caution Fee Escrow Engine for *${biz}*:\n` +
      `🏡 Direct calendar reservations with zero commission deductions\n` +
      `🔒 Automates caution fee deposits and check-out damage inspection receipts\n` +
      `⚡ Reconciles electricity token usage & sends gate access codes automatically\n\n` +
      `👉 Test drive demo: ${url || 'https://www.bethelmindanalytics.com/tools/shortlet-booking-escrow'}\n\n` +
      `Launch for ₦55,000 One-Time Flat (₦0 Monthly Fees) (or ₦95,000 Annual Pass with 1 Year Free). Moniepoint MFB: 6805375225.`
  },

  {
    id: 'construction_boq',
    title: 'Building Material Quantity Estimator & Site BOQ Calculator',
    shortTitle: 'Construction BOQ & Material Sizer',
    category: 'Engineering & Energy',
    badge: 'CONTRACTOR SUITE',
    headline: 'Calculate exact cement bags, sand, granite, and POP quantities in seconds without client disputes.',
    problem: 'Contractors and interior decorators spend hours estimating bags of cement, tons of sharp sand, blocks, and paint buckets for clients. Errors lead to cost overruns that eat into profits.',
    solution: 'An instant mobile estimator that converts wall square-meters, room dimensions, and floor plans into exact cement bags, granite tons, block counts, and POP board requirements with current Nigerian market prices.',
    deliverables: [
      'Wall blockwork, plastering & screeding material calculator',
      'Concrete slab mix estimator (Cement : Sharp Sand : Granite ratio)',
      'POP ceiling board & channel calculator',
      'Interior & exterior paint bucket coverage sizer',
      'Automated client PDF BOQ quotation generation with your company letterhead',
      'Instant WhatsApp dispatch button to client'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How quickly can you generate an accurate material estimate when a client sends you room dimensions or building plans?\n\n` +
      `We deploy the Building Material Quantity & BOQ Sizer for *${biz}*:\n` +
      `🧱 Instant calculation of cement bags, block counts, sand & granite\n` +
      `🎨 Paint coverage & POP ceiling material sizer\n` +
      `📄 1-Tap professional BOQ quote sent to your client's WhatsApp in seconds\n\n` +
      `👉 Setup today for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees, 1 Year Free Hosting): ${url || 'https://www.bethelmindanalytics.com/onboard?service=construction_boq&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'school_fee',
    title: 'Private School Term Fee Payment Portal & Online Result PIN Gateway',
    shortTitle: 'School Fee Portal & Result PIN Gateway',
    category: 'EdTech & Portals',
    badge: 'PORTAL • EDTECH SUITE',
    headline: 'End school fee collection headaches: auto-gate digital report cards until term fees are 100% cleared.',
    problem: 'Private schools waste weeks chasing parents for outstanding tuition fees, while bursars struggle with manual bank teller reconciliation and fake bank payment slips.',
    solution: 'A cloud portal where parents pay term school fees via direct bank transfer or card, receive instant digital receipts, and can only access student end-of-term broadsheets and report cards with a PIN generated upon fee confirmation.',
    deliverables: [
      'Student term fee payment portal with class-by-class fee breakdown',
      'Automated Moniepoint/Paystack bank transfer reconciliation',
      'Digital payment receipts sent directly to parent WhatsApp & email',
      'Secure Online Report Card / Broadsheet PIN Checker',
      'Automatic gating: Report cards remain locked until term fees are cleared',
      'Bursar admin dashboard showing unpaid fees and real-time revenue tallies'
    ],
    pricing: {
      isPortal: true,
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 95000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/school-fee-sizer',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Proprietor/Administrator at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How much stress does your bursary go through every term chasing parents for unpaid school fees and verifying bank tellers?\n\n` +
      `We deploy the *School Fee Payment Portal & Result PIN Gateway* for *${biz}*:\n` +
      `🏫 Parents pay school fees easily online or via verified bank transfer\n` +
      `🔒 Digital report cards are automatically locked until fees are 100% verified\n` +
      `📊 Eliminates bursar fake alert scams and gives you real-time revenue collection dashboards\n\n` +
      `👉 Deploy for *${biz}*: ${url || 'https://www.bethelmindanalytics.com/onboard?service=school_fee&biz=' + encodeURIComponent(biz)}\n\n` +
      `₦55,000 One-Time Flat (₦0 Monthly Fees, 1 Year Free Hosting). CAC Certified • Moniepoint MFB: 6805375225.`
  },

  {
    id: 'estate_rent',
    title: 'Residential Estate Service Charge Billing & Tenant Rent Escrow Portal',
    shortTitle: 'Estate Service Charge & Rent Portal',
    category: 'Hospitality & Real Estate',
    badge: 'PORTAL • PROPTECH',
    headline: 'Collect estate dues, diesel surcharges, and security levies without endless WhatsApp arguments.',
    problem: 'Estate executive committees and property managers waste enormous time chasing residents for monthly service charges, security levies, and diesel generator billings with zero transparency.',
    solution: 'A resident self-service portal where homeowners and tenants view monthly service charges, breakdown of diesel generator hours, pay dues via verified transfer, and receive instant digital gate clearance passes.',
    deliverables: [
      'Estate resident billing portal with apartment/house unit mapping',
      'Diesel generator cost & utility service charge breakdown',
      'Direct Moniepoint/Paystack automated payment reconciliation',
      'Digital gate clearance pass generated upon payment',
      'Facility maintenance request ticket manager',
      'Executive committee financial transparency report'
    ],
    pricing: {
      isPortal: true,
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 95000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/real-estate-manager',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Estate Executive at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Managing estate service charges, diesel allocations, and security levies manually is stressful and creates resident distrust.\n\n` +
      `We deploy the *Estate Service Charge & Tenant Portal* for *${biz}*:\n` +
      `🏘️ Residents view their dues & pay via automated bank transfer\n` +
      `⛽ Complete transparency on monthly diesel generator expenditure\n` +
      `🎫 Digital gate clearance passes issued automatically to paid residents\n\n` +
      `👉 Test drive & deploy: ${url || 'https://www.bethelmindanalytics.com/onboard?service=estate_rent&biz=' + encodeURIComponent(biz)}\n\n` +
      `₦55,000 One-Time Flat (₦0 Monthly Fees, 1 Year Free Hosting). Moniepoint MFB: 6805375225.`
  },

  {
    id: 'dispatch_tracker',
    title: 'Interstate Waybill Tracker & Courier Dispatch Aggregator',
    shortTitle: 'Waybill & Dispatch Aggregator',
    category: 'Retail & Supply Chain',
    badge: 'LOGISTICS SUITE',
    headline: 'Stop answering 50 calls a day asking "Where is my parcel?" with automated WhatsApp waybill tracking.',
    problem: 'Logistics operators and interstate transport companies waste hours answering calls from anxious customers asking for package updates, while drivers struggle to coordinate delivery addresses.',
    solution: 'A waybill tracking software where your dispatchers enter waybill numbers, and customers receive automated SMS/WhatsApp milestone updates from departure to arrival and final delivery handoff.',
    deliverables: [
      'Waybill generation portal with tracking number auto-assignment',
      'Customer parcel tracking page (loads fast on any phone)',
      'Automated SMS & WhatsApp dispatch milestones (Loaded, In Transit, Arrived, Delivered)',
      'Driver delivery confirmation photo upload',
      'Cash-on-delivery (COD) reconciliation ledger'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/preview/sample-logistics',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How many phone calls does your team handle daily just answering "Where is my parcel?"\n\n` +
      `We deploy the *Interstate Waybill Tracker & Dispatch App* for *${biz}*:\n` +
      `📦 Instant waybill lookup for customers on your branded link\n` +
      `📱 Automatic WhatsApp alerts sent when packages arrive in state\n` +
      `💰 Tracks Cash-on-Delivery (COD) driver collections accurately\n\n` +
      `👉 Setup for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees): ${url || 'https://www.bethelmindanalytics.com/onboard?service=dispatch_tracker&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'agri_consolidator',
    title: 'Bulk Agribusiness Farm Input Order Consolidator Software Portal',
    shortTitle: 'Agribusiness Order Consolidator',
    category: 'Retail & Supply Chain',
    badge: 'AGRITECH SUITE',
    headline: 'Pool poultry feed, fertilizer, and seed orders across farm clusters to secure wholesale bulk factory prices.',
    problem: 'Individual smallholder poultry, fish, and crop farmers pay exorbitant retail prices for feeds and inputs because they purchase in small quantities rather than pooling orders together.',
    solution: 'A cooperative and cluster procurement portal where farmers pool their weekly bags of broiler feed, day-old chicks, and fertilizer, unlocking manufacturer wholesale pricing and coordinating cluster pickup points.',
    deliverables: [
      'Farmer cooperative bulk order intake portal',
      'Feed & input inventory pool tracker',
      'Automated bank payment ledger with individual member receipts',
      'Bulk supplier PO generator',
      'Cluster distribution point dispatch SMS manager'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/preview/sample-farm',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Farm Leader at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `Skyrocketing feed prices are squeezing farm profits. Pooling member orders unlocks factory-gate wholesale prices.\n\n` +
      `We deploy the *Bulk Agribusiness Order Consolidator* for *${biz}*:\n` +
      `🌾 Farmers order feed and inputs through a simple WhatsApp/mobile portal\n` +
      `📈 Aggregates orders automatically to meet factory minimums\n` +
      `🏦 Tracks member payments and reconciles cluster distribution\n\n` +
      `👉 Deploy today for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees): ${url || 'https://www.bethelmindanalytics.com/onboard?service=agri_consolidator&biz=' + encodeURIComponent(biz)}`
  },

  {
    id: 'vin_checker',
    title: 'Automated Tokunbo VIN Chassis Number & Customs Port Clearance Sizer',
    shortTitle: 'Tokunbo VIN & Customs Sizer',
    category: 'Automotive',
    badge: 'NCS 2026 TARIFF',
    headline: 'Instant foreign auction salvage history, statutory 20% import duty, 15% NAC levy, and port landing cost sizer.',
    problem: 'Car dealers and buyers struggle to calculate statutory Nigeria Customs Service duty tariffs, terminal demurrage, and Copart salvage accident history before committing millions.',
    solution: 'A high-speed VIN and chassis decoder that checks US NHTSA foreign history, Copart salvage records, calculates 2026 Nigeria Customs Service duty rates, and generates client WhatsApp price breakdowns.',
    deliverables: [
      '17-digit VIN chassis number decoder (Year, Make, Model, Engine size)',
      'NCS 2026 statutory import duty (20%) + NAC levy (15%) + VAT (7.5%) sizer',
      'PTML / Tin Can Island port terminal charges and clearing cost matrix',
      'US auction salvage flood/collision audit check',
      'Automated PDF & WhatsApp landing cost breakdown for buyers'
    ],
    pricing: {
      starterSetup: 80000,
      starterMonthly: 0,
      annualPass: 80000,
      annualSavings: 0,
      turnkeyDeposit: 75000,
      turnkeyTotal: 150000
    },
    deliverySla: '48 Hours',
    liveDemoUrl: '/tools/tokunbo-duty',
    whatsappPitchTemplate: (biz, url) =>
      `Good day Boss at *${biz}*! 👋 Bethelmind Digital Solutions here.\n\n` +
      `How quickly do you calculate port clearing costs and customs duty when a customer asks for a Tokunbo vehicle quote?\n\n` +
      `We deploy the *Tokunbo VIN & Customs Sizer* for *${biz}*:\n` +
      `🚗 Decodes 17-digit chassis numbers instantly\n` +
      `📋 Calculates statutory NCS duty, NAC levy & terminal landing costs\n` +
      `📱 Sends your client a branded WhatsApp estimate with your dealership details\n\n` +
      `👉 Test drive demo: ${url || 'https://www.bethelmindanalytics.com/tools/tokunbo-duty'}\n\n` +
      `Deploy for *${biz}* for ₦80,000 One-Time Flat (₦40k Deposit) (₦0 Monthly Fees). Moniepoint MFB: 6805375225.`
  }
];

export function getPillarOneService(id: string): PillarOneService {
  return PILLAR_ONE_SERVICES.find(s => s.id === id) || PILLAR_ONE_SERVICES[0];
}
