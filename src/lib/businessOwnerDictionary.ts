/**
 * Business Owner Plain-English Dictionary & Selling Narrative
 * Translates technical marketing & tracking terms into clear business value copy and highlights zero-code app compatibility.
 */

export interface ToolExplanation {
  id: string;
  techName: string;
  businessName: string;
  salesPitchHook: string; // Core sales narrative hook
  category: 'growth' | 'conversion' | 'automation';
  shortSummary: string;
  roiBadge: string;
  compatibleApps: string[]; // Common tools business owners already use
  explanation: string;
  beforeVsAfter: {
    before: string;
    after: string;
  };
  addonPriceNGN: number;
}

export const BUSINESS_OWNER_TOOL_DICTIONARY: Record<string, ToolExplanation> = {
  meta_capi: {
    id: 'meta_capi',
    techName: 'Meta Conversions API (CAPI) & GA4 Proxy',
    businessName: '🛡️ Anti-Adblock Buyer Tracker',
    salesPitchHook: 'Plugs directly into your Facebook & Instagram Ad Account in 60 seconds.',
    category: 'growth',
    shortSummary: 'Captures 100% of buyers that Safari, iPhones, and ad-blockers hide from your Facebook Ads.',
    roiBadge: '+25% Ad Attribution Accuracy',
    compatibleApps: ['Facebook Ads Manager', 'Instagram Ads', 'Google Analytics 4', 'Shopify'],
    explanation: 'Modern smartphones and web browsers block normal Facebook Pixels. This tool sends purchase signals directly from your web server to Facebook, ensuring every single lead and sale is credited so your ads get smarter faster.',
    beforeVsAfter: {
      before: 'Facebook misses up to 40% of sales made on iPhones, wasting your ad budget.',
      after: '100% of buyer conversions are reported to Meta so your cost per lead drops.'
    },
    addonPriceNGN: 45000,
  },

  journey_analytics: {
    id: 'journey_analytics',
    techName: 'Customer Journey DOM Mutation Analytics',
    businessName: '👁️ Visitor Screen Replay & Heatmap',
    salesPitchHook: 'Works instantly on any website (WordPress, Shopify, Wix, or Custom HTML).',
    category: 'conversion',
    shortSummary: 'Watch video-style replays of how buyers navigate your site and where they get confused.',
    roiBadge: 'Fix Hidden Conversion Leaks',
    compatibleApps: ['WordPress', 'Elementor', 'Shopify', 'Wix', 'Google Chrome'],
    explanation: 'Ever wonder why people visit your site but leave without buying? This tool records mouse movements, button clicks, and scroll depth so you can pinpoint exact spots where customers hesitate.',
    beforeVsAfter: {
      before: 'You guess why visitors bounce without buying.',
      after: 'You see exact video recordings of user confusion and fix friction points in minutes.'
    },
    addonPriceNGN: 35000,
  },

  facebook_ads_dashboard: {
    id: 'facebook_ads_dashboard',
    techName: 'Meta Marketing API Insights Connector',
    businessName: '📊 Ad Spend & Profit Dashboard',
    salesPitchHook: 'Zero migration! Replaces complex ad manager tables with 1-click WhatsApp profit alerts.',
    category: 'growth',
    shortSummary: 'Shows exactly how much money you spend on ads vs. how much net profit each ad campaign makes.',
    roiBadge: 'Stop Wasting Ad Money',
    compatibleApps: ['Facebook Ads', 'WhatsApp', 'Google Sheets', 'Paystack'],
    explanation: 'Calculates your Cost Per Lead (CPL) and Return On Ad Spend (ROAS) in real time. It automatically alerts you when an ad is underperforming so you can pause losing campaigns.',
    beforeVsAfter: {
      before: 'Confusing Facebook Ads Manager dashboards with complicated metrics.',
      after: 'Clear green/red indicators showing which ads generate profit vs. loss.'
    },
    addonPriceNGN: 45000,
  },

  email_drip: {
    id: 'email_drip',
    techName: 'Behavioral Transactional & Marketing Drip Engine',
    businessName: '✉️ Hands-Free Auto Follow-Up Emailer',
    salesPitchHook: 'Syncs 1-click with Mailchimp, SendGrid, Gmail, or your custom business email.',
    category: 'automation',
    shortSummary: 'Automatically emails new leads welcome offers, testimonials, and reminders while you sleep.',
    roiBadge: '+35% Lead Conversion',
    compatibleApps: ['Mailchimp', 'SendGrid', 'Resend', 'Gmail', 'Outlook'],
    explanation: '80% of sales require 5 follow-up contacts. This engine automatically sends timed, personalized emails to prospects after they submit a form, nurturing them into paying clients without manual work.',
    beforeVsAfter: {
      before: 'Manual emailing or forgotten leads after initial contact.',
      after: 'Automated 7-day follow-up sequence running 24/7 in the background.'
    },
    addonPriceNGN: 75000,
  },

  ai_lead_scoring: {
    id: 'ai_lead_scoring',
    techName: 'Predictive Machine Learning Lead Qualifier',
    businessName: '🎯 Hot Buyer Radar',
    salesPitchHook: 'Pushes high-priority VIP buyers straight to your Google Sheets & WhatsApp phone.',
    category: 'conversion',
    shortSummary: 'Ranks your leads 0–100 so your sales team calls high-spending VIP customers first.',
    roiBadge: 'Double Sales Team Efficiency',
    compatibleApps: ['Google Sheets', 'HubSpot', 'Zoho CRM', 'WhatsApp'],
    explanation: 'Uses AI to evaluate lead responses, company size, and urgency. It highlights high-ticket buyers so your team focuses energy on prospects ready to pay immediately.',
    beforeVsAfter: {
      before: 'Sales reps waste hours calling low-budget tire kickers.',
      after: 'Sales reps call 90+ score VIP buyers first, closing deals twice as fast.'
    },
    addonPriceNGN: 55000,
  },

  whatsapp_bot: {
    id: 'whatsapp_bot',
    techName: 'Baileys / Twilio WhatsApp Webhook Automation',
    businessName: '🤖 24/7 WhatsApp Auto-Responder Bot',
    salesPitchHook: 'Connects to your personal or business WhatsApp number in 1 tap.',
    category: 'automation',
    shortSummary: 'Instantly answers customer inquiries and books appointments inside WhatsApp 24/7.',
    roiBadge: 'Instant Customer Reply',
    compatibleApps: ['WhatsApp Business', 'Google Calendar', 'Paystack', 'Moniepoint DVA'],
    explanation: 'Connects your website directly to WhatsApp. When a lead submits an inquiry, the bot instantly replies, provides quotes, and collects details straight to your phone.',
    beforeVsAfter: {
      before: 'Leads wait hours for a reply and leave for competitors.',
      after: 'Instant sub-second WhatsApp responses with interactive buttons.'
    },
    addonPriceNGN: 95000,
  },

  // ── 1. WhatsApp Speed-to-Lead & Catalog Closer ──
  whatsapp_speed_lead: {
    id: 'whatsapp_speed_lead',
    techName: 'Instant Conversational WhatsApp Closer & Catalog AI',
    businessName: '⚡ WhatsApp Speed-to-Lead & Catalog Closer',
    salesPitchHook: 'Never lose an 11 PM buyer again. Converts clicks to instant WhatsApp sales in < 3s.',
    category: 'conversion',
    shortSummary: 'Automated assistant sends product pictures, prices, and answers FAQs 24/7, routing warm leads directly to your WhatsApp.',
    roiBadge: '3x Faster Sales Conversion',
    compatibleApps: ['WhatsApp Business', 'Instagram Direct', 'TikTok Shop', 'Paystack'],
    explanation: 'When Instagram, TikTok, or web visitors drop inquiries, this assistant replies in under 3 seconds with product catalogs, photos, and prices, collecting payments while competitors sleep.',
    beforeVsAfter: {
      before: 'Customers wait 30 minutes for DMs, get frustrated, and buy from your competitor.',
      after: 'Immediate 3-second WhatsApp reply with photos, pricing, and 1-tap bank checkout.'
    },
    addonPriceNGN: 30000,
  },

  // ── 2. Solar Sizing & Instant Quotation Engine ──
  solar_sizing_boq: {
    id: 'solar_sizing_boq',
    techName: 'Solar & Inverter Load Sizing & PDF BOQ Engine',
    businessName: '☀️ Solar & Inverter Sizing & Instant Quoter',
    salesPitchHook: 'Turn your website into an automated sales engineer with instant downloadable PDF quotes.',
    category: 'conversion',
    shortSummary: 'Interactive appliance load calculator that generates recommended system tiers, battery sizing, and PDF estimates.',
    roiBadge: 'Zero Tire-Kicker Wasted Hours',
    compatibleApps: ['WhatsApp', 'Google Sheets', 'PDF Generator', 'Email'],
    explanation: 'Customers select appliances (TVs, fridges, ACs, pumps). The tool automatically sizes the inverter (e.g. 5kVA/48V), batteries, solar panels, and issues an official PDF quote with 50% deposit instructions.',
    beforeVsAfter: {
      before: 'Hours spent doing manual Excel sizing for tire-kickers who cannot afford the quote.',
      after: 'Automated 30-second appliance sizing with instant downloadable PDF quotation.'
    },
    addonPriceNGN: 45000,
  },

  // ── 3. Fake Alert Proof Bank Transfer Reconciliation ──
  fake_alert_proof: {
    id: 'fake_alert_proof',
    techName: 'Dynamic Dedicated Virtual Account Reconciliation Gateway',
    businessName: '🛡️ "Fake Alert Proof" Bank Transfer Box',
    salesPitchHook: 'Eliminate transfer verification queues and fake alert fraud forever in 5 seconds flat.',
    category: 'automation',
    shortSummary: 'Generates a dedicated virtual account number per bill, confirming verified credit on-screen in 5 seconds.',
    roiBadge: '100% Fake Alert Immune',
    compatibleApps: ['Paystack', 'Moniepoint', 'OPay', 'POS Terminal'],
    explanation: 'Generates a unique dynamic bank account number for each transaction. When the customer transfers from any Nigerian bank, the webhook confirms the credit in 5 seconds on the screen.',
    beforeVsAfter: {
      before: 'Staff wait 10 minutes checking banking apps or get scammed with photoshopped alerts.',
      after: 'Automated 5-second green screen confirmation with zero staff manual checks.'
    },
    addonPriceNGN: 25000,
  },

  // ── 4. Hyperlocal Dispatch Aggregator & Waybill Tracker ──
  hyperlocal_dispatch: {
    id: 'hyperlocal_dispatch',
    techName: 'LGA Zone Distance Pricing & SMS Waybill Tracker',
    businessName: '📦 Hyperlocal Dispatch & Waybill Tracker',
    salesPitchHook: 'Compete with Chowdeck and Gokada infrastructure in your local zone.',
    category: 'automation',
    shortSummary: 'Auto-assigns delivery zones, calculates distance fees, issues SMS tracking links, and alerts riders.',
    roiBadge: '-70% Where-Is-My-Driver Calls',
    compatibleApps: ['Termii SMS', 'Google Maps', 'WhatsApp Rider Groups', 'Paystack'],
    explanation: 'Clients book deliveries online, receive transparent distance pricing by LGA, and get live SMS waybill tracking codes. Riders receive 1-tap route coordinates on WhatsApp.',
    beforeVsAfter: {
      before: 'Customers call 10 times asking "where is my driver?" while dispatchers panic.',
      after: 'Live self-serve SMS waybill tracking link with automated rider dispatch.'
    },
    addonPriceNGN: 35000,
  },

  // ── 5. Multi-Location Stock & Theft-Prevention Ledger ──
  stock_theft_prevention: {
    id: 'stock_theft_prevention',
    techName: 'Real-Time Decentralized Inventory & Discrepancy Alert Ledger',
    businessName: '📊 Multi-Location Anti-Theft Stock Ledger',
    salesPitchHook: 'Monitor your shops from your phone and catch inventory leaks before month-end.',
    category: 'automation',
    shortSummary: 'Mobile inventory tracker paired with your catalog. Sales auto-decrement stock with daily discrepancy alerts to the owner.',
    roiBadge: 'Stop Off-the-Books Theft',
    compatibleApps: ['WhatsApp Alerts', 'Google Sheets', 'Mobile POS', 'Barcode Scanner'],
    explanation: 'Every item sold auto-decrements inventory across branches. If stock does not match cash or items go missing, an immediate theft-prevention alert is sent straight to the owner WhatsApp.',
    beforeVsAfter: {
      before: 'Shop staff sell items off the books and claim goods were "damaged".',
      after: 'Every single SKU tracked in real time with daily variance audits on your phone.'
    },
    addonPriceNGN: 45000,
  },

  // ── 6. Automated Service Booking & Deposit Lock Engine ──
  service_booking_deposit: {
    id: 'service_booking_deposit',
    techName: 'Deposit-Gated Calendar & Automated Reminder Bridge',
    businessName: '📅 Service Booking & Deposit Lock Engine',
    salesPitchHook: 'Cut no-shows to zero and collect upfront commitments automatically.',
    category: 'conversion',
    shortSummary: 'Calendar scheduling widget that requires a mandatory booking deposit before locking the appointment slot.',
    roiBadge: 'Zero No-Shows Guaranteed',
    compatibleApps: ['Google Calendar', 'Paystack', 'Moniepoint', 'WhatsApp Business'],
    explanation: 'Clients select salon chair, mechanic bay, or event date. The slot is locked only upon verified ₦5,000 deposit, followed by automated WhatsApp reminders 24h and 2h before the booking.',
    beforeVsAfter: {
      before: 'Clients book slots, never show up, and tie down chairs and staff with zero penalty.',
      after: '100% upfront committed clients with automatic non-refundable deposit lock.'
    },
    addonPriceNGN: 30000,
  },

  // ── 7. Tenant Service Charge & Rent Escrow Manager ──
  tenant_escrow_manager: {
    id: 'tenant_escrow_manager',
    techName: 'Estate Levy Billing & Digital Gate Pass Clearance Portal',
    businessName: '🏢 Tenant Service Charge & Levy Manager',
    salesPitchHook: 'Automate your entire estate levy collection and end audit disputes.',
    category: 'automation',
    shortSummary: 'Resident portal that auto-generates monthly levy invoices, reconciles transfers, and issues gate passes.',
    roiBadge: '95% On-Time Dues Collection',
    compatibleApps: ['Paystack DVA', 'Moniepoint', 'WhatsApp Broadcast', 'Estate Security Gate'],
    explanation: 'Automates diesel, security, and maintenance levy invoicing for estates and commercial plazas. Issues instant digital receipts and gate codes upon payment, sending reminder notices to defaulters.',
    beforeVsAfter: {
      before: 'Chasing 40 tenants via paper receipts with constant audit quarrels.',
      after: 'Automated digital bills, instant bank reconciliation, and barcode gate passes.'
    },
    addonPriceNGN: 65000,
  },

  // ── 8. Construction & Interior Material Estimator ──
  construction_material_estimator: {
    id: 'construction_material_estimator',
    techName: 'Parametric m² Bill of Quantities & Material Generator',
    businessName: '🏗️ Construction Material & BOQ Estimator',
    salesPitchHook: 'Win high-budget clients by presenting corporate, transparent quotes in 2 minutes.',
    category: 'conversion',
    shortSummary: 'Clients input floor space (m²) or perimeter to receive an exact bill of quantities (cement, zinc, tiles, paint).',
    roiBadge: 'Transparent Corporate Bidding',
    compatibleApps: ['WhatsApp Quote Bridge', 'PDF Exporter', 'Dangote Price Matrix'],
    explanation: 'Tilers, POP plasterers, and roofing contractors let prospective clients enter their room or compound dimensions. It outputs a verified itemized material list, building trust and closing projects faster.',
    beforeVsAfter: {
      before: 'Clients suspect artisan over-billing, causing delays and lost bids.',
      after: 'Transparent mathematical bill of quantities generated in 2 minutes.'
    },
    addonPriceNGN: 35000,
  },

  // ── 9. Private School Term Fee Portal with Result Gating ──
  school_fee_result_gating: {
    id: 'school_fee_result_gating',
    techName: 'School Tuition Reconciliation & Result PIN Gate Portal',
    businessName: '🎓 Private School Term Fee & Result Gate',
    salesPitchHook: 'Collect 95% of school fees before midterm without arguing with parents.',
    category: 'automation',
    shortSummary: 'Hosts end-of-term student report cards behind a fee-clearance gate (results unlock only when fees are cleared).',
    roiBadge: 'Zero Termly Tuition Debt',
    compatibleApps: ['Paystack School Payments', 'Moniepoint DVA', 'SMS Alert Gate', 'Student Portal'],
    explanation: 'Parents log in to view exam scores and report cards. The portal gates result access until tuition is marked as paid, issuing immediate digital fee clearance receipts.',
    beforeVsAfter: {
      before: 'Parents owe tuition into the holidays, delaying teacher salaries.',
      after: '95% of fees collected on time because report cards unlock automatically upon payment.'
    },
    addonPriceNGN: 55000,
  },

  // ── 10. Bulk Agribusiness Feed & Input Order Consolidator ──
  agribusiness_order_consolidator: {
    id: 'agribusiness_order_consolidator',
    techName: 'Agro Batch Aggregation & Logistics Scheduling Hub',
    businessName: '🌾 Bulk Agribusiness Order Consolidator',
    salesPitchHook: 'Automate smallholder order batches and eliminate farm dispatch chaos.',
    category: 'automation',
    shortSummary: 'Batch-order portal where farmers lock in weekly feed/chick bags, choose delivery routes, and settle via invoice.',
    roiBadge: 'Predictable Weekly Mill Volume',
    compatibleApps: ['WhatsApp Order Bridge', 'Google Sheets Fleet', 'Bank Transfer Invoices'],
    explanation: 'Feed millers and agrochemical dealers aggregate smallholder orders into scheduled weekly truck runs, avoiding haphazard deliveries and guaranteeing advance cash settlement.',
    beforeVsAfter: {
      before: 'Farmers calling randomly, leading to delivery route chaos and stockouts.',
      after: 'Pre-scheduled weekly batch orders with advance payment confirmation.'
    },
    addonPriceNGN: 45000,
  },
};
