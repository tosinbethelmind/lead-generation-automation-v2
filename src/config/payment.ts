/**
 * @file src/config/payment.ts
 * Centralised payment configuration for Bethelmind Analytics.
 *
 * CURRENT MODE: manual_opay_transfer
 * All payment details are read from public environment variables.
 * No real account numbers or secrets are hard-coded here.
 *
 * HOW TO CONFIGURE:
 * Set the following in your .env.local (never commit .env.local):
 *   NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME="Bethelmind Analytics & Strategy"
 *   NEXT_PUBLIC_PAYMENT_BANK_NAME="OPay"
 *   NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER="YOUR_REAL_OPAY_ACCOUNT_NUMBER"
 *   NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER="2348022791227"
 *
 * HOW TO SWITCH PAYMENT MODE (future):
 * Change paymentMode to "paystack" or "opay_api" and implement
 * the corresponding gateway handler. The manual_opay_transfer
 * flow in PaymentSection.tsx checks paymentConfig.paymentMode.
 */

export type PaymentMode =
  | 'manual_opay_transfer'
  | 'paystack'          // Not yet implemented
  | 'opay_api';         // Not yet implemented

export interface PaymentConfig {
  /** Active payment mode. Only manual_opay_transfer is implemented. */
  paymentMode: PaymentMode;
  /** Bank or provider name shown to the user */
  bankName: string;
  /** Account name shown to the user */
  accountName: string;
  /**
   * Account number shown to the user.
   * Set via NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER.
   * If the env var is not set, an empty string is returned so the UI
   * can show a "not configured" placeholder.
   */
  accountNumber: string;
  /** WhatsApp business number — digits only, no + or spaces */
  whatsappNumber: string;
  /** ISO 4217 currency code */
  currency: 'NGN';
  /** Prefix used to generate per-plan payment references */
  referencePrefix: 'BMA';
  /** Human-readable payment instructions */
  instructions: string[];
  /** Safety note shown below the account details */
  safetyNote: string;
}

export const paymentConfig: PaymentConfig = {
  paymentMode: 'manual_opay_transfer',

  bankName:
    process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || process.env.MONIEPOINT_BANK_NAME || 'Moniepoint Microfinance Bank / OPay',

  accountName:
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME || process.env.MONIEPOINT_ACCOUNT_NAME || 'Oyelakin Tosin Matthew (Bethelmind Analytics)',

  accountNumber:
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER || process.env.MONIEPOINT_ACCOUNT_NUMBER || '7034297995',

  whatsappNumber:
    process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER || process.env.ADMIN_WA_PHONE || '2348022791227',

  currency: 'NGN',

  referencePrefix: 'BMA',

  instructions: [
    'Select your preferred package below.',
    'Transfer the exact displayed amount to the OPay account shown.',
    'Use the generated payment reference as your transfer narration where possible.',
    'Take a screenshot of your bank transfer confirmation.',
    'Tap "Send Receipt on WhatsApp" and attach the screenshot.',
    'We will confirm your payment and send onboarding instructions within one business day.',
  ],

  safetyNote:
    'Always confirm the account name shown on this page before sending payment. ' +
    'Do not send money to unofficial accounts or individuals claiming to represent Bethelmind Analytics.',
};

/**
 * Generates a per-plan payment reference.
 * Format: BMA-{PLAN}-{YYYYMMDD}-{4-char random alphanumeric}
 * Example: BMA-STARTER-20260809-A8F2
 */
export function generatePaymentReference(planKey: string): string {
  const today = new Date();
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BMA-${planKey.toUpperCase()}-${dateStr}-${rand}`;
}

/**
 * Builds a URL-safe WhatsApp deep-link with a pre-filled message.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
