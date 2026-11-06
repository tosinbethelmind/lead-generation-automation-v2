/**
 * @file src/lib/monetization/invoiceTypes.ts
 * Browser-safe types & constants for Commercial Invoices (Zero node 'fs' imports)
 */

export interface InvoiceRecord {
  invoiceId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  category: string;
  packageType: 'LOGISTICS_WAYBILL_PORTAL' | 'ESTATE_SERVICE_CHARGE_PORTAL' | 'ANDROID_APP_CONVERSION' | 'SOLAR_BOQ_ENGINE' | 'SME_TURNKEY_WEBSITE' | 'CORPORATE_SUITE';
  packageName: string;
  totalNgn: number;
  depositNgn: number;
  balanceNgn: number;
  slaHours: number;
  guaranteedDeliveryDate: string;
  deliverables: string[];
  settlementBank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    cacReg: string;
    closerHotline: string;
    supportEmail: string;
  };
  status: 'PENDING_DEPOSIT' | 'DEPOSIT_CONFIRMED' | 'DELIVERED_ACTIVE';
  invoiceUrl: string;
  createdAt: string;
}

export const OFFICIAL_CORPORATE_SETTLEMENT = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions',
  cacReg: 'Reg: 9912717',
  closerHotline: '+234 802 279 1227',
  supportEmail: 'tosin@bethelmindanalytics.com'
};
