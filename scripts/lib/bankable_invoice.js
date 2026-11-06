/**
 * @file scripts/lib/bankable_invoice.js
 * 
 * 🏛️ BETHELMIND DIGITAL SOLUTIONS — OFFICIAL COMMERCIAL INVOICE & 48-HOUR SLA CONTRACT ENGINE (CommonJS)
 * CAC Certified Nigerian Enterprise (Reg: 9912717)
 * Primary Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 */

const fs = require('fs');
const path = require('path');

const OFFICIAL_CORPORATE_SETTLEMENT = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions',
  cacReg: 'Reg: 9912717',
  closerHotline: '+234 802 279 1227',
  supportEmail: 'tosin@bethelmindanalytics.com'
};

const LOCAL_INVOICE_DB = path.join(process.cwd(), 'local_db', 'commercial_invoices.json');

function createOrGetCommercialInvoice(params) {
  const localDir = path.dirname(LOCAL_INVOICE_DB);
  if (!fs.existsSync(localDir)) {
    try { fs.mkdirSync(localDir, { recursive: true }); } catch (_) {}
  }

  let invoices = [];
  if (fs.existsSync(LOCAL_INVOICE_DB)) {
    try {
      invoices = JSON.parse(fs.readFileSync(LOCAL_INVOICE_DB, 'utf8'));
    } catch (_) {
      invoices = [];
    }
  }

  const cleanPhone = String(params.clientPhone || '').replace(/\D/g, '');
  const existing = invoices.find(inv => 
    (cleanPhone && inv.clientPhone === cleanPhone) && 
    (!params.packageType || inv.packageType === params.packageType)
  );
  if (existing) {
    return existing;
  }

  const packageType = params.packageType || 'SME_TURNKEY_WEBSITE';
  const now = new Date();
  const delivery = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const deliveryFormatted = delivery.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  let packageName = 'Starter Official Business Website + 24/7 WhatsApp AI Closer';
  let totalNgn = 65000;
  let depositNgn = 35000;
  let balanceNgn = 30000;
  let deliverables = [
    'Official .COM.NG domain registration & high-speed cloud hosting',
    'Pre-built mobile-responsive commercial storefront',
    '24/7 AI WhatsApp Closer (< 3s response speed, price list & catalog closer)',
    'OPay / Moniepoint "Fake Alert Proof" transfer reconciliation ledger',
    'Google Search & Maps ranking setup for local discovery',
    '48-Hour Live Production Guarantee (100% money-back SLA)'
  ];

  if (packageType === 'LOGISTICS_WAYBILL_PORTAL') {
    packageName = 'Interstate Dispatch Waybill Tracker & 1-Tap Delivery SMS System';
    totalNgn = 70000;
    depositNgn = 35000;
    balanceNgn = 35000;
    deliverables = [
      'Automated interstate waybill tracking portal with real-time customer lookup',
      'Instant delivery cost calculator for Lagos, Abuja, Port Harcourt & 36 States',
      'Automated SMS & WhatsApp dispatch updates to sender and receiver',
      'Driver & waybill manifest ledger for multi-vehicle tracking',
      'OPay / Moniepoint bank transfer deposit lock for delivery bookings',
      '48-Hour Go-Live Guarantee with staff onboarding walkthrough'
    ];
  } else if (packageType === 'ESTATE_SERVICE_CHARGE_PORTAL') {
    packageName = 'Estate Service Charge & Tenant Rent Escrow Management Portal';
    totalNgn = 80000;
    depositNgn = 40000;
    balanceNgn = 40000;
    deliverables = [
      'Digital tenant service charge & facility fee collection portal',
      'Diesel & security levy breakdown with automated WhatsApp reminders',
      'Instant digital PDF receipts generated upon Moniepoint/OPay payment',
      'Facility manager audit dashboard (arrears, paid units, maintenance ledger)',
      'Tenant issue reporting & maintenance request ticketing module',
      '48-Hour Deployment Guarantee under Bethelmind Legal SLA'
    ];
  } else if (packageType === 'ANDROID_APP_CONVERSION') {
    packageName = 'Turnkey Android Business Mobile App (.APK Build in 24 Hours)';
    totalNgn = 45000;
    depositNgn = 25000;
    balanceNgn = 20000;
    deliverables = [
      'Custom compiled Android application (.APK) with official business branding',
      'Direct WhatsApp chat & catalog ordering integration inside the app',
      'Offline-capable caching for fast performance on 3G/4G Nigerian mobile networks',
      'Home screen 1-tap launcher icon for continuous customer retention',
      'Direct distribution link & QR code flyer for shop counter and social bio',
      'Guaranteed delivery in 24 hours'
    ];
  } else if (packageType === 'SOLAR_BOQ_ENGINE') {
    packageName = 'Solar BOQ Sizing Calculator & Instant WhatsApp Quotation Engine';
    totalNgn = 75000;
    depositNgn = 35000;
    balanceNgn = 40000;
    deliverables = [
      'Interactive residential & commercial load sizer (appliances to kVA/batteries)',
      'Instant WhatsApp Bill of Quantities (BOQ) generator with current pricing',
      'Automated site survey booking & deposit lock engine',
      'Customer financing & installment payment breakdown module',
      'Google Local SEO ranking for solar buyers in your operational corridor',
      '48-Hour Live Production Guarantee'
    ];
  } else if (packageType === 'CORPORATE_SUITE') {
    packageName = 'Full Turnkey Corporate Suite (.COM + 3 Official Staff Emails + SEO)';
    totalNgn = 150000;
    depositNgn = 75000;
    balanceNgn = 75000;
    deliverables = [
      'Dedicated .COM global domain registration + 1 Year High-Speed Cloud Hosting',
      '3 Official corporate staff email addresses (e.g. director@, sales@, info@)',
      'Complete dynamic sector tool & interactive catalog suite',
      '24/7 AI WhatsApp Sales Closer with custom corporate training',
      'Full source code and domain ownership handover within 48 hours',
      '100% Risk Reversal Guarantee (Full refund if not deployed in 48 hours)'
    ];
  }

  const codeSlug = (params.clientName || 'SME').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SME';
  const invoiceId = `INV-BM-${codeSlug}-${Math.floor(1000 + Math.random() * 9000)}-2026`;
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

  const newInvoice = {
    invoiceId,
    clientName: params.clientName,
    clientPhone: cleanPhone,
    clientEmail: params.clientEmail || '',
    category: params.category || 'Commercial Enterprise',
    packageType,
    packageName,
    totalNgn,
    depositNgn,
    balanceNgn,
    slaHours: 48,
    guaranteedDeliveryDate: deliveryFormatted,
    deliverables,
    settlementBank: { ...OFFICIAL_CORPORATE_SETTLEMENT },
    status: 'PENDING_DEPOSIT',
    invoiceUrl: `${appOrigin}/invoice/${invoiceId}`,
    createdAt: new Date().toISOString()
  };

  invoices.unshift(newInvoice);
  try {
    fs.writeFileSync(LOCAL_INVOICE_DB, JSON.stringify(invoices, null, 2), 'utf8');
  } catch (err) {
    console.error('[BankableInvoice] Error saving invoice:', err.message);
  }

  return newInvoice;
}

module.exports = {
  OFFICIAL_CORPORATE_SETTLEMENT,
  createOrGetCommercialInvoice
};
