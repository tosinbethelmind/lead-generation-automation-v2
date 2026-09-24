/**
 * @file src/lib/monetization/postContactInvoiceEngine.ts
 * 
 * BETHELMIND DIGITAL INVOICE & 48-HOUR SLA CONTRACT ENGINE
 * 
 * Generates official bankable commercial invoices, 50% deposit receipts,
 * and automated direct-to-OPay bank transfer details.
 */

import { OPAY_BENEFICIARY_CONFIG } from './directNairaAutoLiquidationRouter';

export interface CommercialInvoice {
  invoiceNumber: string;
  clientName: string;
  clientCategory: string;
  packageType: 'DFY_TURNKEY_BUILD' | 'EMBED_AI_CLOSER_UPGRADE' | 'FREIGHT_ESCROW_SETTLEMENT';
  totalAmountNgn: number;
  depositAmountNgn: number;
  balanceAmountNgn: number;
  slaHours: number;
  deliveryDate: string;
  beneficiary: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  deliverables: string[];
  termsAndConditions: string;
  formattedWhatsAppInvoice: string;
}

export function generateCommercialInvoice(
  clientName: string,
  clientCategory: string = 'Commercial Enterprise',
  packageType: 'DFY_TURNKEY_BUILD' | 'EMBED_AI_CLOSER_UPGRADE' | 'FREIGHT_ESCROW_SETTLEMENT' = 'DFY_TURNKEY_BUILD'
): CommercialInvoice {
  const invoiceNumber = `INV-BM-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${new Date().getFullYear()}`;
  
  const now = new Date();
  const delivery = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const deliveryDate = delivery.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  let totalAmountNgn = 150000;
  let depositAmountNgn = 75000;
  let balanceAmountNgn = 75000;
  let deliverables = [
    `Custom interactive website & domain registration for ${clientName}`,
    '24/7 AI WhatsApp Closer (< 3s response speed, Nigerian business tone)',
    'Dynamic sector-specific quote & booking calculator',
    'Automated Moniepoint / Paystack payment verification',
    'Google Maps Local SEO setup for high-intent customer discovery',
    '48-Hour Live Production Guarantee & Admin Handoff'
  ];

  if (packageType === 'EMBED_AI_CLOSER_UPGRADE') {
    totalAmountNgn = 65000;
    depositAmountNgn = 35000;
    balanceAmountNgn = 30000;
    deliverables = [
      '1-Line JavaScript / WordPress AI Closer widget embed',
      '24/7 WhatsApp quote dispatcher connected to management line',
      'Dynamic interactive price calculator embed',
      'Same-day 2-hour integration guarantee'
    ];
  } else if (packageType === 'FREIGHT_ESCROW_SETTLEMENT') {
    totalAmountNgn = 1520000; // Sample $1,000 equivalent
    depositAmountNgn = 1520000;
    balanceAmountNgn = 0;
    deliverables = [
      'Guaranteed wholesale FX conversion (₦1,520/$)',
      'Direct Swift MT103 wire delivery to China supplier in < 15 mins',
      '100% CBN-licensed institutional escrow clearing guarantee'
    ];
  }

  const formattedWhatsAppInvoice = 
    `📄 *OFFICIAL COMMERCIAL INVOICE: ${invoiceNumber}*\n` +
    `========================================\n` +
    `👤 *Client:* ${clientName}\n` +
    `🏢 *Industry:* ${clientCategory}\n` +
    `⏱️ *Deployment SLA:* 48 Hours (Guaranteed by ${deliveryDate})\n` +
    `========================================\n\n` +
    `📋 *AGREED DELIVERABLES:*\n` +
    deliverables.map((d, i) => ` ${i+1}. ${d}`).join('\n') + `\n\n` +
    `💰 *FINANCIAL SUMMARY:*\n` +
    `• Total Investment: *₦${totalAmountNgn.toLocaleString()} NGN*\n` +
    `• Initial 50% Milestone Deposit: *₦${depositAmountNgn.toLocaleString()} NGN*\n` +
    `• Final Balance (Upon Handover): *₦${balanceAmountNgn.toLocaleString()} NGN*\n\n` +
    `🏦 *OFFICIAL OPAY SETTLEMENT ACCOUNT:*\n` +
    `• Bank: *${OPAY_BENEFICIARY_CONFIG.bankName}*\n` +
    `• Account Number: *${OPAY_BENEFICIARY_CONFIG.accountNumber}*\n` +
    `• Account Name: *${OPAY_BENEFICIARY_CONFIG.accountName}*\n` +
    `• Narration Ref: *${invoiceNumber}*\n\n` +
    `🛡️ *100% Risk Reversal Guarantee:* If live production deployment is not delivered within 48 hours, full initial deposit is refunded instantly.`;

  return {
    invoiceNumber,
    clientName,
    clientCategory,
    packageType,
    totalAmountNgn,
    depositAmountNgn,
    balanceAmountNgn,
    slaHours: 48,
    deliveryDate,
    beneficiary: {
      bankName: OPAY_BENEFICIARY_CONFIG.bankName,
      accountNumber: OPAY_BENEFICIARY_CONFIG.accountNumber,
      accountName: OPAY_BENEFICIARY_CONFIG.accountName
    },
    deliverables,
    termsAndConditions: '50% initial commitment deposit to commence domain & cloud setup. 50% balance strictly due upon live production inspection.',
    formattedWhatsAppInvoice
  };
}

export function generateBankableInvoiceCard(params: {
  businessName: string;
  phone?: string;
  email?: string;
  category?: string;
  packageTier?: 'TURNKEY_DFY' | 'EMBED_UPGRADE';
}) {
  const pkg = params.packageTier === 'EMBED_UPGRADE' ? 'EMBED_AI_CLOSER_UPGRADE' : 'DFY_TURNKEY_BUILD';
  const inv = generateCommercialInvoice(params.businessName, params.category || 'Commercial SME', pkg);
  return {
    invoiceNumber: inv.invoiceNumber,
    businessName: inv.clientName,
    totalNgn: inv.totalAmountNgn,
    depositNgn: inv.depositAmountNgn,
    balanceNgn: inv.balanceAmountNgn,
    slaHours: inv.slaHours,
    bankDetails: inv.beneficiary,
    whatsappFormatted: inv.formattedWhatsAppInvoice,
  };
}
