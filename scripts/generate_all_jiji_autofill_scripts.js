const fs = require('fs');
const path = require('path');

const ALL_13_ADS = [
  {
    id: 1,
    title: "Tokunbo Car VIN Check & Customs Duty Report • US Auction Photos in 10 Mins",
    price: 12500,
    priceStr: "₦12,500",
    imgFile: "ad_1_vin_checker.png",
    category: "Services > Automotive Services > Vehicle Inspection",
    desc: `Buying a Tokunbo car in Lagos, Abuja, or Berger? NEVER transfer money to any car dealer until you run a verified chassis number (VIN) audit!

Over 48% of Tokunbo cars imported into Nigeria were bought from US Copart and IAAI salvage auctions with severe flood damage, saltwater immersion, deployed airbags, or rolled-back mileage.

WHAT IS INCLUDED IN YOUR 10-MINUTE VERIFICATION BUNDLE:
1. Original US Copart & IAAI Salvage Crash Photos (See the exact car before it was panel-beaten) [Value: ₦15,000]
2. Genuine Odometer Mileage & Illegal Rollback Audit [Value: ₦10,000]
3. Hurricane Flood, Saltwater Immersion & Structural Frame Damage Check [Value: ₦10,000]
4. Nigeria Customs Service (NCS) Import Duty & C-Number Paper Verification [Value: ₦15,000]
5. Fair Nigerian Market Price Valuation so you don't overpay the dealer [Value: ₦10,000]
6. FREE BONUS: Top 10 Red Flags Car Dealers Hide Inspection Checklist [Value: ₦5,000]

TOTAL VALUE: ₦65,000
PRICING OPTIONS:
👉 Single Car Audit: Only ₦12,500 all-inclusive!
👉 Car Dealer 3-Car Bundle: ₦25,000 (Save ₦12,500 on 3 inspections)

100% ACCURACY GUARANTEE: Full PDF report + auction photos delivered directly to your WhatsApp in 10 minutes or 100% money back!

⚡ CALL OR WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp with the 17-digit VIN now!

SEARCH TAGS: carfax nigeria, vin checker lagos, tokunbo car inspection, customs duty paper check, copart salvage auction photos, autocheck report, berger car inspection, buy tokunbo car abuja.`
  },
  {
    id: 2,
    title: "24-Hour Express Business Website Design, Google SEO & 24/7 WhatsApp AI Closer",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_2_website_ai_closer.png",
    category: "Services > Computer & IT Services > Web Design",
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
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance (Keep it running for just ₦230/day!)
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE HOSTING & MAINTENANCE — Save ₦39,000!)
👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 100% code handover

100% RISK-FREE GUARANTEE: Test your live working website prototype free on your phone before paying 1 Kobo!

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to see a live working demo for your business right now!

SEARCH TAGS: website design lagos, web designer abuja, ecommerce website nigeria, business website developer, cheap website design, company profile website, online store setup, google seo ranking.`
  },
  {
    id: 3,
    title: "Solar & Inverter WhatsApp Quoting Tool & Load Calculator for Solar Installers",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_3_solar_boq_sizer.png",
    category: "Services > Computer & IT Services > Software",
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
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)
👉 PLAN C (Full Custom Suite): ₦75,000 deposit (₦150,000 total)

Close 3x more solar projects on autopilot with zero paperwork stress.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the interactive demo now!

SEARCH TAGS: solar installation nigeria, 5kva inverter price, 3.5kva solar system, felicity lithium battery, solar load calculator, luminous inverter lagos, solar boq generator, tubular battery price.`
  },
  {
    id: 4,
    title: "Stop Fake Bank Alerts & Cashier Theft • Moniepoint & OPay Transfer Shield",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_4_fake_alert_shield.png",
    category: "Services > Computer & IT Services > Software",
    desc: `Stop falling victim to fake bank transfer alerts, photoshopped receipts, and sales attendants stealing cash!

In today's Nigeria, cashiers and store owners lose hundreds of thousands of Naira monthly to fake NIP bank transfer screenshots generated by scammers.

We deploy an automated Bank Transfer Shield for boutiques, supermarkets, gadget stores, pharmacies, and clinics.

THE "STORE REVENUE SHIELD" BUNDLE:
1. Real-Time Moniepoint & Paystack Bank Webhook Verification [Value: ₦80,000]
2. Instant Cryptographic Green Pass sent to cashier's phone when real money clears [Value: ₦40,000]
3. Multi-Branch Cashier Shift Audit (Stops sales attendants pocketing cash) [Value: ₦45,000]
4. Automated WhatsApp Digital Receipts sent to verified buyers [Value: ₦30,000]
5. End-of-Day POS vs Cash Drawer Reconciliation in 60 seconds [Value: ₦25,000]
6. FREE BONUS: "Zero Fake Alert" Window & Counter Anti-Scam Security Decals [Value: ₦10,000]

TOTAL VALUE: ₦230,000
PRICING & ACTIVATION PLANS:
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)

Protect your daily business revenue 100%. One-time setup, zero monthly stress.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to protect your store today!

SEARCH TAGS: pos machine lagos, moniepoint pos terminal, opay pos machine, fake alert software, receipt printer, supermarket cashier software, retail billing software, stop fake transfer.`
  },
  {
    id: 5,
    title: "Salon & Spa Appointment Booking App with Deposit Lock • Stop Client No-Shows",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_5_salon_deposit_booking.png",
    category: "Services > Health & Beauty Services",
    desc: `Eliminate empty salon chairs and missed appointments with automated 24/7 booking!

When clients book appointments and fail to show up, you lose valuable hours and turn away paying walk-in customers.

We build online appointment scheduling systems for hair salons, aesthetic clinics, spas, and makeup artists that lock client time slots with upfront bank deposits.

THE "SALON REVENUE LOCK" BUNDLE:
1. 24/7 Automated Mobile Booking Calendar connected to WhatsApp [Value: ₦75,000]
2. Mandatory 25%–50% Upfront Reservation Deposit Lock via Moniepoint [Value: ₦45,000]
3. Automated SMS & WhatsApp Appointment Reminders (Cuts no-shows by 90%) [Value: ₦30,000]
4. Stylist / Doctor Commission Split & Daily Revenue Tracking [Value: ₦35,000]
5. Customer Treatment History & Birthday Promo Messenger [Value: ₦25,000]
6. FREE BONUS: Fast 24-Hour Turnkey Deployment Guarantee [Value: ₦20,000]

TOTAL VALUE: ₦230,000
PRICING & ACTIVATION PLANS:
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)

Guarantee your booking revenue upfront before you touch a single client.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the live booking engine free!

SEARCH TAGS: beauty salon website, spa booking app, barbershop software, dental clinic appointment system, makeup artist website, lash technician booking, salon management software lagos.`
  },
  {
    id: 6,
    title: "Private School Term Fee Portal & Online Result Checker • Stop Fee Defaulters",
    price: 45000,
    priceStr: "₦45,000",
    imgFile: "ad_6_school_fee_portal.png",
    category: "Services > Computer & IT Services > Software",
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
👉 PLAN A (Termly Flex): ₦45,000 Setup + ₦10,000/month (or ₦25,000/term)
👉 PLAN B (Annual Academic Session Pass): ₦95,000 All-Inclusive (Covers all 3 terms — 1 Full Year Free Maintenance!)

Recover school fees on time and eliminate bursar cash leakage this session.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Send a message on Jiji or WhatsApp for a live portal demonstration for your school today!

SEARCH TAGS: school portal nigeria, school management software, online result checker, report card printing software, school fees payment portal, private school website, secondary school portal lagos.`
  },
  {
    id: 7,
    title: "Estate Service Charge & Tenant Rent Portal • Generator Diesel & Utility Ledger",
    price: 45000,
    priceStr: "₦45,000",
    imgFile: "ad_7_tenant_rent_portal.png",
    category: "Services > Real Estate Services",
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
👉 PLAN A (Monthly Flex): ₦45,000 Setup + ₦10,000/month
👉 PLAN B (Annual Estate Pass — Best Value): ₦95,000 All-Inclusive (1 FULL YEAR FREE MAINTENANCE — Save ₦45,000!)

Eliminate rent arguments and keep your estate property accounts 100% reconciled.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp for your live estate demo today!

SEARCH TAGS: estate management software, property management portal lagos, service charge receipt, tenant rent collection app, estate security gate pass, facility management software abuja.`
  },
  {
    id: 8,
    title: "Interstate Dispatch Waybill Tracker • Automated SMS & Delivery Status System",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_8_dispatch_waybill_tracker.png",
    category: "Services > Chauffeur & Logistics Services",
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
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)

Cut dispatch customer service calls by 85% and build massive trust with shippers.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test a live tracking link now!

SEARCH TAGS: dispatch rider service lagos, waybill tracking software, courier logistics app, delivery rider app, haulage tracking, interstate parcel delivery, gig logistics tracker.`
  },
  {
    id: 9,
    title: "Multi-Store Retail Inventory & Water Factory Route Reconciliation App • Stop Theft",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_9_stock_theft_ledger.png",
    category: "Services > Computer & IT Services > Software",
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
👉 Single Branch / Shop: ₦35,000 Setup + ₦7,000/mo (OR ₦80,000 Annual Pass — 1 Full Year Free)
👉 Multi-Branch / Factory Master Suite: ₦65,000 Setup + ₦12,000/mo (OR ₦140,000 Annual Pass — 1 Full Year Free)

Know your exact stock levels and daily profit from your phone anywhere in the world.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Send a message on Jiji or WhatsApp for a live interactive multi-store demo right now!

SEARCH TAGS: inventory software lagos, supermarket pos software, pure water accounting software, stock keeping app, retail pos machine, sachet water factory manager, multi branch inventory.`
  },
  {
    id: 10,
    title: "Building Material Estimator & BOQ Calculator • Cement, Tile & Paint Sizer",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_10_construction_estimator.png",
    category: "Services > Building & Construction > Building Services",
    desc: `Eliminate building material waste and contractor over-budgeting on your construction sites!

We deploy instant computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.

THE "SITE MATERIAL SHIELD" BUNDLE:
1. Precision Cement, Sand Tonnage & Granite Mix Calculator for Decking & Foundations [Value: ₦75,000]
2. Floor Tile Square-Meter, Adhesive & Grout Packaging Sizer with 12% Cut Buffer [Value: ₦45,000]
3. Emulsion & Gloss Paint Bucket Wall Coverage Calculator [Value: ₦35,000]
4. POP Ceiling Sheets, Drywall Screws & Perimeter Track Estimator [Value: ₦35,000]
5. Artisan Inflation Reality Check (Flags over-ordered materials instantly) [Value: ₦40,000]
6. FREE BONUS: 1-Tap Professional Itemized BOQ PDF Generator with current Lagos prices [Value: ₦30,000]

TOTAL VALUE: ₦260,000
PRICING & ACTIVATION PLANS:
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)

Protect your construction budget from contractor inflation and stolen site materials.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the site material estimator now!

SEARCH TAGS: building contractor lagos, boq bill of quantities, dangote cement price today, floor tiles calculation, pop ceiling design, building material estimator, quantity surveying software.`
  },
  {
    id: 11,
    title: "Fast CAC Business Name & Company Registration (LTD) • Approved in 3 to 5 Days",
    price: 38500,
    priceStr: "₦38,500",
    imgFile: "ad_11_cac_registration.png",
    category: "Services > Legal Services > Corporate Law",
    desc: `Register your Business Name or Private Limited Company (LTD) with the Corporate Affairs Commission (CAC) in 3 to 5 working days without delay or agent overcharging!

Don't let the Central Bank or commercial banks freeze your personal accounts for business transactions. Upgrade to a certified corporate account today.

THE "FAST-TRACK CORPORATE COMPLIANCE" BUNDLE:
1. Official CAC Name Availability Search & Instant Reservation [Value: ₦15,000]
2. Certified CAC Digital Registration Certificate with official QR Verification [Value: ₦35,000]
3. Certified Status Report / Memorandum & Articles of Association (MEMART) [Value: ₦25,000]
4. Corporate Tax Identification Number (TIN) for immediate business banking [Value: ₦15,000]
5. Free Corporate Bank Account Opening Facilitation (Moniepoint, OPay, Wema) [Value: ₦20,000]
6. FREE BONUS: Corporate Seal & Digital Stamp Design Pack [Value: ₦15,000]

TOTAL VALUE: ₦125,000
TRANSPARENT ALL-INCLUSIVE PRICING:
👉 Business Name Registration: ₦38,500 all-inclusive
👉 Private Limited Company (LTD, 1M Share Capital): ₦85,000 all-inclusive

100% Guaranteed Approval or Full Refund. 

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji to check your proposed business name availability free now!

SEARCH TAGS: cac registration lagos, business name registration, registered limited company ltd, cac certificate, firs tin number, open corporate bank account, business registration agent abuja.`
  },
  {
    id: 12,
    title: "Shortlet Direct Booking Website & Caution Deposit Lock • Stop 20% Airbnb Fees",
    price: 35000,
    priceStr: "₦35,000",
    imgFile: "ad_12_shortlet_booking_escrow.png",
    category: "Services > Real Estate Services",
    desc: `Stop paying 15% to 20% Airbnb and Booking.com commissions on your shortlet apartments!

We build direct guest booking portals with automated caution deposit locks for Nigerian shortlet hosts and serviced apartment managers.

THE "SHORTLET PROFIT MAXIMIZER" BUNDLE:
1. Direct Mobile Guest Booking Portal with Date & Night Sizer [Value: ₦85,000]
2. Automated Caution Deposit Hold with Automated Refund Release upon check-out [Value: ₦50,000]
3. Fair-Usage DisCo Electricity Token Calculator (Auto-deducts excess AC power usage) [Value: ₦45,000]
4. Guest Digital ID & NIN / Driver's License KYC Verification [Value: ₦35,000]
5. Automated Check-in Instructions & Smart Door Lock Passcode Messenger [Value: ₦30,000]
6. FREE BONUS: Instant Moniepoint & Paystack Payment Settlement to your bank [Value: ₦25,000]

TOTAL VALUE: ₦270,000
PRICING & ACTIVATION PLANS:
👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance
👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)

Keep 100% of your rental profits and build your own loyal direct guest database.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test our live shortlet portal today!

SEARCH TAGS: shortlet apartment lekki, airbnb management lagos, serviced apartments ikoyi, shortlet booking website, caution fee management, luxury shortlet vi, holiday apartments abuja.`
  },
  {
    id: 13,
    title: "Hidden GPS Car Tracker & Fleet System • Phone Remote Engine Cut & Fuel Siphon Alert",
    price: 55000,
    priceStr: "₦55,000",
    imgFile: "ad_13_gps_fuel_mileage_tracker.png",
    category: "Services > Automotive Services > Tracking Services",
    desc: `Protect your car, truck, or commercial bus from vehicle theft and driver fuel fraud!

Our hidden GPS tracking systems give you 24/7 live control of your vehicle right from your smartphone anywhere in Nigeria.

THE "ULTIMATE VEHICLE SECURITY" BUNDLE:
1. 24/7 Real-Time Live Vehicle Location Tracking via Mobile App (Android & iPhone) [Value: ₦60,000]
2. Remote Engine Cut-Off (Kill vehicle engine from your phone anywhere in Nigeria) [Value: ₦35,000]
3. Geo-Fencing (Instant WhatsApp alert if vehicle leaves designated route/city) [Value: ₦25,000]
4. Fuel Consumption vs Mileage Audit (Flags diesel siphoning and fake driver receipts) [Value: ₦35,000]
5. In-Cabin Voice Monitoring Microphone (Listen to in-car conversations clearly) [Value: ₦25,000]
6. 90-Day Trip History & Mileage Playback [Value: ₦20,000]
7. FREE BONUS: Professional Clean Installation with Zero Wire-Cutting [Value: ₦15,000]

TOTAL VALUE: ₦215,000
SPECIAL ALL-INCLUSIVE PRICE TODAY: ONLY ₦55,000 (HARDWARE + INSTALLATION + 1 YEAR APP ACCESS)!

Same-day installation across Lagos and Abuja. 100% anti-theft guarantee.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp with your car model to book installation today!

SEARCH TAGS: car tracker lagos, hidden gps tracker nigeria, vehicle tracking installation, remote engine cut tracker, fuel monitoring device, fleet tracker abuja, anti car theft device.`
  }
];

// Target directory
const outDir = path.join(__dirname, '../public/jiji_ads');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Generate individual autofill scripts
ALL_13_ADS.forEach(ad => {
  const scriptContent = `// Autofill Script for Jiji Ad #${ad.id}: ${ad.title.slice(0, 40)}...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #${ad.id}: ${ad.title.replace(/"/g, '\\"')}", "color: #10b981; font-weight: bold; font-size: 14px;");

  function setReactInputValue(input, value) {
    if (!input) return false;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                                   Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  // 1. Fill Title
  const titleInput = document.querySelector('input[name="title"]') || 
                     document.querySelector('input[placeholder*="Title" i]') || 
                     document.querySelector('input[placeholder*="Ad title" i]');
  if (titleInput) {
    setReactInputValue(titleInput, ${JSON.stringify(ad.title)});
    console.log("✔ Set Title:", ${JSON.stringify(ad.title)});
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "${ad.price}");
    console.log("✔ Set Price:", "${ad.price}");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, ${JSON.stringify(ad.desc)});
    } else {
      descInput.innerText = ${JSON.stringify(ad.desc)};
      descInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    console.log("✔ Set Description successfully.");
  } else {
    console.warn("⚠ Description textarea not detected.");
  }

  // 4. Fill Phone Number
  const phoneInput = document.querySelector('input[name="phone"]') || 
                     document.querySelector('input[placeholder*="Phone" i]');
  if (phoneInput && !phoneInput.value) {
    setReactInputValue(phoneInput, "08022791227");
    console.log("✔ Set Phone Number: 08022791227");
  }

  console.log("%c[Success] Advert data populated! Please review and click 'Post Ad'.", "color: #3b82f6; font-weight: bold;");
})();
`;

  fs.writeFileSync(path.join(outDir, `autofill_ad_${ad.id}.js`), scriptContent, 'utf8');
});

// 2. Master console switcher script
const masterConsoleScript = `// ============================================================
// BETHELMIND DIGITAL SOLUTIONS — MASTER JIJI CONSOLE AUTOFILL
// CAC Certified Nigerian Enterprise (Reg: 9912717)
// Usage: Paste this into the console on https://jiji.ng/post-ad,
// then call: deployJijiAd(1) through deployJijiAd(13)
// ============================================================

window.BETHELMIND_JIJI_ADS = ${JSON.stringify(ALL_13_ADS, null, 2)};

window.deployJijiAd = function(adNumber) {
  const ad = window.BETHELMIND_JIJI_ADS.find(a => a.id === Number(adNumber));
  if (!ad) {
    console.error("Ad #" + adNumber + " not found. Valid numbers are 1 to 13.");
    return;
  }

  console.log("%c[Bethelmind] Injecting Ad #" + ad.id + ": " + ad.title, "color: #d4af37; font-weight: bold; font-size: 14px;");

  function setReactInputValue(input, value) {
    if (!input) return false;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                                   Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  const titleInput = document.querySelector('input[name="title"]') || 
                     document.querySelector('input[placeholder*="Title" i]') || 
                     document.querySelector('input[placeholder*="Ad title" i]');
  if (titleInput) setReactInputValue(titleInput, ad.title);

  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) setReactInputValue(priceInput, String(ad.price));

  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, ad.desc);
    } else {
      descInput.innerText = ad.desc;
      descInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  const phoneInput = document.querySelector('input[name="phone"]') || 
                     document.querySelector('input[placeholder*="Phone" i]');
  if (phoneInput && !phoneInput.value) setReactInputValue(phoneInput, "08022791227");

  console.log("%c✔ Ad #" + ad.id + " successfully filled! Review and click Post.", "color: #10b981; font-weight: bold;");
};

console.log("%c✔ Bethelmind Jiji Master Autofill Engine Ready!", "color: #10b981; font-size: 16px; font-weight: bold;");
console.log("Run: deployJijiAd(1) for Tokunbo VIN Check");
console.log("Run: deployJijiAd(2) for 24h Express Website & WhatsApp Closer");
console.log("Run: deployJijiAd(3) for Solar BOQ Quoter");
console.log("Run: deployJijiAd(4) for Anti-Fake Alert POS Shield");
console.log("Run: deployJijiAd(5) for Salon Booking with Deposit");
console.log("Run: deployJijiAd(6) for School Fee & Result PIN Portal");
console.log("Run: deployJijiAd(7) for Estate Service Charge Portal");
console.log("Run: deployJijiAd(8) for Interstate Dispatch Tracker");
console.log("Run: deployJijiAd(9) for Multi-Store Retail & Water Factory Ledger");
console.log("Run: deployJijiAd(10) for Building Material Estimator");
console.log("Run: deployJijiAd(11) for CAC Business & Company Registration");
console.log("Run: deployJijiAd(12) for Shortlet Direct Booking Website");
console.log("Run: deployJijiAd(13) for Hidden GPS Car & Fleet Tracker");
`;

fs.writeFileSync(path.join(outDir, 'jiji_console_autofill.js'), masterConsoleScript, 'utf8');

// 3. Update the Visual Launcher HTML Dashboard
const htmlDashboard = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bethelmind Digital Solutions — 13 Grand-Slam Jiji Offers Launcher</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070b14;
      --card-bg: #0d1322;
      --gold: #d4af37;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #10b981;
      --border: rgba(212, 175, 55, 0.2);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 24px;
      line-height: 1.6;
    }
    .header {
      max-width: 1200px;
      margin: 0 auto 32px auto;
      text-align: center;
      padding: 32px 20px;
      background: radial-gradient(circle at center, #151d33 0%, #070b14 100%);
      border: 1px solid var(--border);
      border-radius: 20px;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      color: #fff;
      margin-bottom: 8px;
    }
    .header .subtitle {
      color: var(--gold);
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .meta-box {
      margin-top: 16px;
      display: inline-flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      background: rgba(0,0,0,0.4);
      padding: 10px 20px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.06);
      font-size: 13px;
    }
    .meta-box strong { color: var(--gold); }
    .grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    .ad-card {
      background: var(--card-bg);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
      position: relative;
    }
    .ad-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: rgba(212, 175, 55, 0.15);
      color: var(--gold);
      margin-bottom: 12px;
    }
    .price-tag {
      font-size: 24px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 12px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .card-desc {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 16px;
      flex-grow: 1;
      max-height: 120px;
      overflow-y: auto;
      background: rgba(0,0,0,0.2);
      padding: 10px;
      border-radius: 8px;
    }
    .btn-row {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    button, a.btn {
      flex: 1;
      text-align: center;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      text-decoration: none;
      transition: 0.2s;
    }
    .btn-copy {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold);
      border: 1px solid var(--border);
    }
    .btn-copy:hover {
      background: var(--gold);
      color: #000;
    }
    .btn-post {
      background: #10b981;
      color: #fff;
    }
    .btn-post:hover {
      background: #059669;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      display: none;
      z-index: 999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="subtitle">CAC Certified Nigerian Enterprise (Reg: 9912717)</div>
    <h1>💎 13 Grand-Slam Jiji Offers Launcher</h1>
    <p style="color: var(--muted); font-size: 14px; max-width: 700px; margin: 8px auto;">
      Deploy, copy, or autofill any of the 13 high-conversion Nigerian SME adverts into Jiji in 1 click.
    </p>
    <div class="meta-box">
      <div>Account: <strong>Moniepoint MFB (6805375225)</strong></div>
      <div>Closer Hotline: <strong>0802 279 1227</strong></div>
      <div>Photos: <strong>C:\\Users\\HomePC\\Desktop\\JIJI_ADS_PICTURES</strong></div>
    </div>
  </div>

  <div class="grid">
    ${ALL_13_ADS.map(ad => `
      <div class="ad-card">
        <div>
          <span class="badge">Ad #${ad.id} • ${ad.category.split('>').pop().trim()}</span>
          <div class="price-tag">${ad.priceStr}</div>
          <div class="card-title">${ad.title}</div>
          <div class="card-desc">${ad.desc.slice(0, 180)}...</div>
        </div>
        <div class="btn-row">
          <button class="btn-copy" onclick="copyAdText(${ad.id})">📋 Copy Text</button>
          <button class="btn-copy" onclick="copyConsoleScript(${ad.id})">⚡ Copy Script</button>
          <a class="btn btn-post" href="https://jiji.ng/post-ad" target="_blank" rel="noopener">Post on Jiji ↗</a>
        </div>
      </div>
    `).join('')}
  </div>

  <div id="toast" class="toast">Copied to clipboard!</div>

  <script>
    const ADS = ${JSON.stringify(ALL_13_ADS)};

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 2500);
    }

    function copyAdText(id) {
      const ad = ADS.find(a => a.id === id);
      const fullText = ad.title + "\\n\\nPrice: " + ad.priceStr + "\\nCategory: " + ad.category + "\\n\\n" + ad.desc;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("Ad #" + id + " Full Text Copied!");
      });
    }

    function copyConsoleScript(id) {
      const scriptUrl = "autofill_ad_" + id + ".js";
      fetch(scriptUrl).then(res => res.text()).then(code => {
        navigator.clipboard.writeText(code).then(() => {
          showToast("Ad #" + id + " Autofill Script Copied! Paste in F12 Console on Jiji.");
        });
      }).catch(() => {
        showToast("Error loading script file.");
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), htmlDashboard, 'utf8');

console.log("✔ Successfully generated all 13 individual autofill scripts, master console script, and HTML dashboard in public/jiji_ads/");
