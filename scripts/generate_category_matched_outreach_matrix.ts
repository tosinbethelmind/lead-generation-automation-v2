/**
 * @file scripts/generate_category_matched_outreach_matrix.ts
 * 
 * INTELLIGENT CATEGORY-MATCHED OUTREACH MATRIX (SMS + EMBEDDED VOICE NOTE EMAIL + AUDIO).
 * 
 * Configures the exact copy, sector tools, SMS templates, and rich HTML email templates
 * (with glowing embedded voice note audio cards) across all 6 core commercial sectors.
 */

export interface SectorCampaignBlueprint {
  categoryKey: string;
  categoryTitle: string;
  targetHubs: string;
  heroToolName: string;
  smsCopy: string;
  voiceNoteScript: string;
  emailSubject: string;
  emailBodyHtml: (lead: any) => string;
}

export const SECTOR_CAMPAIGN_MATRIX: Record<string, SectorCampaignBlueprint> = {
  SOLAR: {
    categoryKey: 'SOLAR',
    categoryTitle: 'Solar Energy, Inverters & Clean Power EPCs',
    targetHubs: 'Ikeja Industrial Estate, Lekki Phase 1, Victoria Island',
    heroToolName: 'Automated Solar BOQ Load Sizer & Diesel-Savings Calculator',
    smsCopy: 'Good day {BUSINESS_NAME}! Stop wasting 40 mins typing manual solar quotes. We pre-built an automated BOQ load sizer for your {AREA} business. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Good day Engineer at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. High-ticket solar buyers love knowing their exact power requirements before making a decision. We custom-built an interactive load sizing calculator branded for your company in {AREA}, where clients can select their appliances, calculate KVA ratings, and receive an instant PDF quote on WhatsApp. Tap your preview link below to test drive it on your phone!',
    emailSubject: 'Automating Instant Solar BOQ Sizing & WhatsApp PDF Quotes for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #f8fafc; padding: 28px; border-radius: 12px; border: 1px solid #1e293b;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">⚡ Solar Engineering Automation Desk</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">Instant Solar BOQ Load Sizer & 24/7 Quoting Engine for ${lead.name}</h2>
  </div>

  <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Good day Lead Engineering Team at <strong>${lead.name}</strong>,</p>
  <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos Desk. When prospective commercial and residential clients in ${lead.area || 'Lagos'} ask for solar estimates on WhatsApp after closing hours, waiting 24 hours for a manual BOQ cost breakdown often causes them to go with a competitor.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #10b981; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 12px 0;">Listen to our engineer's audio explanation tailored specifically for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open Sizer</a>
  </div>

  <h3 style="color: #38bdf8; font-size: 16px; margin-top: 20px;">⚡ What We Custom-Built For ${lead.name}:</h3>
  <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>Interactive BOQ Load Sizer:</strong> Clients choose appliances (Air Conditioners, Pumps, Fridges) to get exact recommended KVA rating.</li>
    <li><strong>Diesel Fuel Savings Calculator:</strong> Automatically calculates monthly generator fuel savings in Naira.</li>
    <li><strong>Instant WhatsApp PDF Quotes:</strong> Generates branded estimates delivered in under 3 seconds.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive Your Live Portal (₦0 Upfront)</a>
  </div>

  <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #1e293b; padding-top: 16px;">
    Questions? Chat directly with our Lagos Closer Desk on WhatsApp: <a href="https://wa.me/2348022791227" style="color: #38bdf8; text-decoration: none;">0802 279 1227</a><br>
    <strong>Bethelmind Analytics Lagos</strong> · Plot 12 Commercial Corridor, Victoria Island
  </p>
</div>`
  },

  AUTOMOTIVE: {
    categoryKey: 'AUTOMOTIVE',
    categoryTitle: 'Auto Parts Importers & Tokunbo Car Dealerships',
    targetHubs: 'ASPAMDA Trade Fair Complex, Berger Auto Corridor, Apapa',
    heroToolName: 'Nigeria Customs Vehicle Duty Estimator & Port Haulage Sizer',
    smsCopy: 'Good day {BUSINESS_NAME}! Stop repeat calls on customs fees. We pre-built a 24/7 vehicle duty calculator & WhatsApp stock browser for your {AREA} team. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Hello executive team at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. Tokunbo car and auto parts buyers in {AREA} always want to calculate their customs duty and inter-state haulage before paying deposits. We pre-built an interactive portal specifically for {BUSINESS_NAME} with a live customs calculator and 24/7 WhatsApp customer closer. Check your preview link below to test it on your phone!',
    emailSubject: '24/7 Tokunbo Stock Browser & Customs Duty Estimator for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 28px; border-radius: 12px; border: 1px solid #334155;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">🚗 Auto Import & Logistics Automation</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">Customs Duty Estimator & 24/7 Vehicle Browser for ${lead.name}</h2>
  </div>

  <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Good day Executive Management at <strong>${lead.name}</strong>,</p>
  <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos Desk. Automotive buyers across Nigeria contact your desk daily asking for clearance duty estimates and nationwide delivery rates. Answering these manually consumes hours of sales staff time.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #f59e0b; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 12px 0;">Listen to our 15s audio briefing customized for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #f59e0b; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open Auto Portal</a>
  </div>

  <h3 style="color: #f59e0b; font-size: 16px; margin-top: 20px;">⚡ Key Features Built For ${lead.name}:</h3>
  <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>Customs Duty & Clearance Estimator:</strong> Real-time lookup for vehicle make, model, and port clearing fees.</li>
    <li><strong>Inter-State Haulage Delivery Sizer:</strong> Instant shipping cost calculator from Lagos ports to major states.</li>
    <li><strong>Direct Moniepoint/OPay Deposit Gateway:</strong> Allows buyers to lock in vehicle reservations with instant payment verification.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive ${lead.name} Live Portal</a>
  </div>

  <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #334155; padding-top: 16px;">
    Closer Desk Hotline: <a href="https://wa.me/2348022791227" style="color: #f59e0b; text-decoration: none;">0802 279 1227</a> · Bethelmind Analytics Lagos
  </p>
</div>`
  },

  HEALTHCARE: {
    categoryKey: 'HEALTHCARE',
    categoryTitle: 'Medical Clinics, Dental & Specialist Diagnostics',
    targetHubs: 'Lekki Phase 1, Ikeja GRA, Victoria Island, Surulere',
    heroToolName: '24/7 Patient Consultation Booking & HMO Insurance Coverage Lookup',
    smsCopy: 'Good day Doctor / Management at {BUSINESS_NAME}! Eliminate patient no-shows. We pre-built a 24/7 patient booking & HMO lookup portal for your {AREA} clinic. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Hello Doctor, good day! Tosin from Bethelmind Analytics Lagos. Patient inquiries come in at all hours, and fast confirmation is vital for your clinic in {AREA}. We created a private digital patient booking and consultation portal that attaches seamlessly to your WhatsApp desk and confirms appointments automatically with zero patient no-shows. Tap the preview link below to test it!',
    emailSubject: '24/7 Automated Patient Booking & HMO Intake System for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #042f2e; color: #f0fdf4; padding: 28px; border-radius: 12px; border: 1px solid #115e59;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(45, 212, 191, 0.15); color: #2dd4bf; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">🏥 Healthcare Clinic Automation</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">24/7 Patient Booking & HMO Intake for ${lead.name}</h2>
  </div>

  <p style="color: #ccfbf1; font-size: 15px; line-height: 1.6;">Good day Medical Director & Team at <strong>${lead.name}</strong>,</p>
  <p style="color: #ccfbf1; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos. Many private patients seeking specialist care in ${lead.area || 'Lagos'} look for appointment availability after clinic operating hours. Without an automated intake scheduler, these patients often go elsewhere.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); border: 1px solid rgba(45, 212, 191, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #2dd4bf; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #99f6e4; font-size: 12px; margin: 0 0 12px 0;">Listen to our clinical workflow audio briefing for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #0d9488; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open Clinic Portal</a>
  </div>

  <h3 style="color: #2dd4bf; font-size: 16px; margin-top: 20px;">⚡ Key Capabilities Built For ${lead.name}:</h3>
  <ul style="color: #ccfbf1; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>24/7 Doctor & Dental Appointment Booking:</strong> Instant calendar slot booking on WhatsApp.</li>
    <li><strong>HMO Insurance Lookup:</strong> Patients easily confirm their provider (Hygeia, Reliance, AXA Mansard).</li>
    <li><strong>Automated SMS Reminders:</strong> Reduces patient no-shows to near 0%.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #0d9488, #059669); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive Clinic Prototype (₦0 Upfront)</a>
  </div>

  <p style="color: #99f6e4; font-size: 13px; border-top: 1px solid #115e59; padding-top: 16px;">
    Closer Desk Hotline: <a href="https://wa.me/2348022791227" style="color: #2dd4bf; text-decoration: none;">0802 279 1227</a> · Bethelmind Analytics Lagos
  </p>
</div>`
  },

  REAL_ESTATE: {
    categoryKey: 'REAL_ESTATE',
    categoryTitle: 'Real Estate Developers, Luxury Realtors & Shortlets',
    targetHubs: 'Ikoyi, Lekki Phase 1, Victoria Island, Epe Corridor',
    heroToolName: '12-Month Installment Schedule & 4K Video Inspection Booker',
    smsCopy: 'Good day {BUSINESS_NAME}! Help Diaspora & local buyers calculate 12-mo payment plans. We pre-built an interactive property portal for your {AREA} team. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Good day executive team at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. High-net-worth and Diaspora buyers looking at properties in {AREA} need transparent installment payment calculators and fast video inspection booking. We custom-built a private luxury real estate portal for {BUSINESS_NAME} with an automated WhatsApp closer. Tap your preview link below to test drive it!',
    emailSubject: '12-Month Installment Schedule & Inspection Booking Portal for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; padding: 28px; border-radius: 12px; border: 1px solid #27272a;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(234, 179, 8, 0.15); color: #eab308; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">🏠 Real Estate & Property Technology</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">12-Month Installment Calculator & Inspection Booker for ${lead.name}</h2>
  </div>

  <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Good day Executive Team at <strong>${lead.name}</strong>,</p>
  <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos. High-value property buyers and Diaspora clients in the UK/US want flexible payment plans, but calculating 6–12 month milestone schedules manually creates friction that delays commitments.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.1) 100%); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #eab308; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 12px 0;">Listen to our real estate workflow audio briefing for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #ca8a04; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open Property Portal</a>
  </div>

  <h3 style="color: #eab308; font-size: 16px; margin-top: 20px;">⚡ Key Capabilities Built For ${lead.name}:</h3>
  <ul style="color: #d4d4d8; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>12-Month Installment & Mortgage Sizer:</strong> Clients simulate deposit amounts and monthly installment schedules.</li>
    <li><strong>4K Site Inspection Booker:</strong> Automated calendar booking for physical or live WhatsApp video walkthroughs.</li>
    <li><strong>Diaspora Reservation Lock:</strong> Collects instant property reservation deposits verified via Paystack/Moniepoint.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #eab308, #ca8a04); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive Property Prototype</a>
  </div>

  <p style="color: #a1a1aa; font-size: 13px; border-top: 1px solid #27272a; padding-top: 16px;">
    Closer Desk Hotline: <a href="https://wa.me/2348022791227" style="color: #eab308; text-decoration: none;">0802 279 1227</a> · Bethelmind Analytics Lagos
  </p>
</div>`
  },

  WHOLESALE_IMPORTERS: {
    categoryKey: 'WHOLESALE_IMPORTERS',
    categoryTitle: 'Wholesale Merchants, Freight Forwarders & Building Materials',
    targetHubs: 'Alaba International Market, Trade Fair Complex, Apapa Logistics Corridor',
    heroToolName: 'B2B Tiered Bulk Pricing & Inter-State Freight Delivery Calculator',
    smsCopy: 'Good day Management at {BUSINESS_NAME}! Automate your wholesale orders & bulk discounts. We pre-built a 24/7 B2B portal for your {AREA} business. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Hello management team at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. Wholesale buyers across Nigeria looking for your goods in {AREA} want instant bulk discount calculations and verified inter-state delivery costs. We pre-built an interactive 24/7 B2B operations portal for {BUSINESS_NAME} that verifies bank transfers automatically. Tap your preview link below to test drive it!',
    emailSubject: '24/7 B2B Wholesale Pricing & Automated Bank Verification for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e1b4b; color: #ede9fe; padding: 28px; border-radius: 12px; border: 1px solid #3730a3;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(167, 139, 250, 0.15); color: #a78bfa; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">📦 B2B Wholesale & Freight Automation</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">Wholesale Pricing & Automated Bank Verification for ${lead.name}</h2>
  </div>

  <p style="color: #ddd6fe; font-size: 15px; line-height: 1.6;">Good day Executive Management at <strong>${lead.name}</strong>,</p>
  <p style="color: #ddd6fe; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos. Retailers and distributors across major commercial states in Nigeria reach out daily asking for volume discounts and haulage rates. Automating this ensures your desk never misses a high-volume container order.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #a78bfa; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #c4b5fd; font-size: 12px; margin: 0 0 12px 0;">Listen to our 15s audio briefing customized for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #7c3aed; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open B2B Portal</a>
  </div>

  <h3 style="color: #a78bfa; font-size: 16px; margin-top: 20px;">⚡ Key Capabilities Built For ${lead.name}:</h3>
  <ul style="color: #ddd6fe; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>Tiered Wholesale Pricing Engine:</strong> Automatically calculates carton / pallet volume discounts.</li>
    <li><strong>Inter-State Freight Calculator:</strong> Accurate haulage cost estimation from Lagos to any state.</li>
    <li><strong>Automated Bank Transfer Ledger:</strong> Validates payments in seconds without manual slip checking.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #7c3aed, #6366f1); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive B2B Prototype (₦0 Upfront)</a>
  </div>

  <p style="color: #c4b5fd; font-size: 13px; border-top: 1px solid #3730a3; padding-top: 16px;">
    Closer Desk Hotline: <a href="https://wa.me/2348022791227" style="color: #a78bfa; text-decoration: none;">0802 279 1227</a> · Bethelmind Analytics Lagos
  </p>
</div>`
  },

  BEAUTY_FASHION: {
    categoryKey: 'BEAUTY_FASHION',
    categoryTitle: 'Luxury Boutiques, Cosmetics, Spas & Fashion Designers',
    targetHubs: 'Lekki Phase 1, Victoria Island, Ikeja, Surulere',
    heroToolName: '24/7 VIP WhatsApp Fashion Catalog & Order Quoter',
    smsCopy: 'Good day {BUSINESS_NAME}! Stop losing after-hours buyers asking for sizes & stock. We pre-built a 24/7 WhatsApp VIP order quoter for your brand. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Hello creative director at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. High-ticket fashion and beauty buyers in {AREA} inquire late at night asking for product availability, sizes, and instant delivery rates. We built a 24/7 VIP WhatsApp catalog and checkout assistant customized for {BUSINESS_NAME}. Check your preview link below to test drive it on your phone!',
    emailSubject: '24/7 VIP Fashion Catalog & Automated WhatsApp Orders for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #fafafa; padding: 28px; border-radius: 12px; border: 1px solid #3f3f46;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(244, 63, 94, 0.15); color: #f43f5e; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">✨ Luxury Fashion & Beauty Automation</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">24/7 VIP Catalog & Order Automation for ${lead.name}</h2>
  </div>

  <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6;">Good day Executive Team at <strong>${lead.name}</strong>,</p>
  <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos. Premium clients inquiring via Instagram and WhatsApp after business hours often buy elsewhere if they don't receive instant size confirmations and payment details.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #f43f5e; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #fda4af; font-size: 12px; margin: 0 0 12px 0;">Listen to our short audio note tailored specifically for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #f43f5e; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open VIP Catalog</a>
  </div>

  <h3 style="color: #f43f5e; font-size: 16px; margin-top: 20px;">⚡ Custom Tools Built For ${lead.name}:</h3>
  <ul style="color: #e4e4e7; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>Interactive Lookbook & Size Sizer:</strong> Clients check product fit, colors, and availability instantly.</li>
    <li><strong>24/7 WhatsApp Order Closer:</strong> Resolves inquiries in < 3 seconds with Nigerian luxury tone.</li>
    <li><strong>Instant Bank Transfer Validation:</strong> Direct-to-OPay/Moniepoint checkout with automated receipt generation.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #f43f5e, #e11d48); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block;">👉 Test Drive ${lead.name} Live Portal</a>
  </div>

  <p style="color: #a1a1aa; font-size: 13px; border-top: 1px solid #3f3f46; padding-top: 16px;">
    Questions? Chat directly with our Lagos Closer Desk on WhatsApp: <a href="https://wa.me/2348022791227" style="color: #f43f5e; text-decoration: none;">0802 279 1227</a><br>
    <strong>Bethelmind Analytics Lagos</strong> · Victoria Island, Lagos
  </p>
</div>`
  },

  LEGAL_CONSULTING: {
    categoryKey: 'LEGAL_CONSULTING',
    categoryTitle: 'Law Firms, CAC Corporate Registration & Tax Consultants',
    targetHubs: 'Victoria Island, Ikeja GRA, Lekki Phase 1',
    heroToolName: 'CAC Registration Fee Estimator & Paid Advisory Intake Engine',
    smsCopy: 'Good day Counsel / Team at {BUSINESS_NAME}! Stop answering routine fee questions. We pre-built an automated CAC fee calculator & intake portal for your {AREA} firm. Test free: {PREVIEW_URL} (08022791227)',
    voiceNoteScript: 'Good day Counsel at {BUSINESS_NAME}! Tosin from Bethelmind Analytics Lagos. Corporate clients looking to register business names, limited liability companies, or trademarks in {AREA} want clear government fee breakdowns and easy consultation booking. We pre-built an interactive portal for {BUSINESS_NAME} with an automated retainer consultation scheduler. Tap the link below to test drive it!',
    emailSubject: 'Interactive CAC Filing Fee Estimator & Consultation Booking for {BUSINESS_NAME}',
    emailBodyHtml: (lead) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0a09; color: #f5f5f4; padding: 28px; border-radius: 12px; border: 1px solid #292524;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background: rgba(214, 211, 209, 0.15); color: #d6d3d1; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">⚖️ Legal & Corporate Advisory Automation</span>
    <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">CAC Filing Fee Estimator & Advisory Scheduler for ${lead.name}</h2>
  </div>

  <p style="color: #d6d3d1; font-size: 15px; line-height: 1.6;">Good day Counsel & Practice Management at <strong>${lead.name}</strong>,</p>
  <p style="color: #d6d3d1; font-size: 15px; line-height: 1.6;">Tosin here from Bethelmind Analytics Lagos. Founders and corporate clients frequently ask for government filing fee breakdowns (Business Name vs LTD vs NGO). Automating this intake frees your legal team to focus on high-value billable matters.</p>

  <!-- Glowing Voice Note Player Card -->
  <div style="background: linear-gradient(135deg, rgba(214, 211, 209, 0.1) 0%, rgba(168, 162, 158, 0.1) 100%); border: 1px solid rgba(214, 211, 209, 0.3); border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
    <div style="font-size: 13px; color: #e7e5e4; font-weight: bold; margin-bottom: 6px;">🎙️ 15-SECOND NIGERIAN VOICE NOTE BRIEFING (EZINNE)</div>
    <p style="color: #a8a29e; font-size: 12px; margin: 0 0 12px 0;">Listen to our practice automation briefing for ${lead.name}:</p>
    <a href="${lead.previewUrl}" style="background: #44403c; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px;">🔊 Play Voice Note & Open Legal Portal</a>
  </div>

  <h3 style="color: #e7e5e4; font-size: 16px; margin-top: 20px;">⚡ Practice Tools Built For ${lead.name}:</h3>
  <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px;">
    <li><strong>CAC Registration & Filing Fee Lookup:</strong> Instant calculation of filing costs and professional legal fees.</li>
    <li><strong>Paid Legal Consultation Booking:</strong> Automatically collects advisory fees prior to calendar confirmation.</li>
    <li><strong>Secure Client Intake Form:</strong> Streamlines document and ID collection on WhatsApp.</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${lead.previewUrl}" style="background: linear-gradient(135deg, #44403c, #292524); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; display: inline-block; border: 1px solid #78716c;">👉 Test Drive Legal Prototype</a>
  </div>

  <p style="color: #a8a29e; font-size: 13px; border-top: 1px solid #292524; padding-top: 16px;">
    Closer Desk Hotline: <a href="https://wa.me/2348022791227" style="color: #e7e5e4; text-decoration: none;">0802 279 1227</a> · Bethelmind Analytics Lagos
  </p>
</div>`
  }
};
