/**
 * @file subscriptionManager.ts
 * Multi-Tenant Subscription Lifecycle & OPay Payment Activation Engine
 * Handles subscription expiry, feature pausing, OPay manual transfer verification, and instant 1-second reactivation.
 */

import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { logActivity } from './activityLogger';

export type SubscriptionStatus = 'active' | 'expired' | 'pending_opay_verification' | 'suspended';

export interface ClientSubscription {
  client_id: string;
  business_name: string;
  contact_phone: string;
  contact_email?: string;
  package_tier: 'starter' | 'pro' | 'vip' | 'luxury';
  status: SubscriptionStatus;
  setup_fee_paid: boolean;
  opay_account_number: string;
  opay_account_name: string;
  subscription_start_iso: string;
  subscription_expiry_iso: string;
  last_payment_reference?: string;
  features_enabled: {
    lead_harvester: boolean;
    ai_customer_agent: boolean;
    whatsapp_voice_notes: boolean;
    ai_voice_caller: boolean;
  };
  notes?: string;
  updated_at: string;
}

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getSubscriptionDbPath(): string {
  return isServerless
    ? path.join('/tmp', 'client_subscriptions.json')
    : path.join(process.cwd(), 'local_db', 'client_subscriptions.json');
}

export function readSubscriptions(): Record<string, ClientSubscription> {
  try {
    const p = getSubscriptionDbPath();
    if (!fs.existsSync(p)) return {};
    return JSON.parse(fs.readFileSync(p, 'utf8') || '{}');
  } catch (_) {
    return {};
  }
}

export function writeSubscriptions(subs: Record<string, ClientSubscription>) {
  try {
    const p = getSubscriptionDbPath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(subs, null, 2), 'utf8');
  } catch (err: any) {
    console.error('[SubscriptionManager] Write error:', err.message);
  }
}

/** Configured OPay Payment Details (Manual Transfer Only) — NO FALLBACKS: missing env vars will throw */
export function getOpayBankTransferDetails() {
  const accountNumber = process.env.OPAY_ACCOUNT_NUMBER;
  const accountName = process.env.OPAY_ACCOUNT_NAME;
  if (!accountNumber || !accountName) {
    throw new Error('[CRITICAL] OPAY_ACCOUNT_NUMBER or OPAY_ACCOUNT_NAME env var is not set. Refusing to serve payment details to prevent wrong-account transfers.');
  }
  return {
    bankName: 'OPay Digital Services',
    accountNumber,
    accountName,
    instructions: 'Make bank transfer to OPay account above. Send receipt screenshot to Admin WhatsApp for instant 1-second reactivation!'
  };
}

/** Configured Moniepoint Payment Details (Manual Transfer Only) — NO FALLBACKS */
export function getMoniepointBankTransferDetails() {
  const accountNumber = process.env.MONIEPOINT_ACCOUNT_NUMBER;
  const accountName = process.env.MONIEPOINT_ACCOUNT_NAME;
  if (!accountNumber || !accountName) {
    throw new Error('[CRITICAL] MONIEPOINT_ACCOUNT_NUMBER or MONIEPOINT_ACCOUNT_NAME env var is not set. Refusing to serve payment details to prevent wrong-account transfers.');
  }
  return {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber,
    accountName,
    instructions: 'Make bank transfer to Moniepoint account above. Send receipt screenshot to Admin WhatsApp for instant 1-second reactivation!'
  };
}

/** Check if a client's subscription is currently active or expired */
export function evaluateClientSubscriptionStatus(clientId: string): {
  isActive: boolean;
  status: SubscriptionStatus;
  daysRemaining: number;
  message: string;
} {
  const subs = readSubscriptions();
  const sub = subs[clientId];

  if (!sub) {
    // Default fallback for preview/trial clients
    return {
      isActive: true,
      status: 'active',
      daysRemaining: 30,
      message: 'Active Trial Subscription'
    };
  }

  const now = new Date();
  const expiry = new Date(sub.subscription_expiry_iso);
  const diffMs = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0 || sub.status === 'expired' || sub.status === 'suspended') {
    return {
      isActive: false,
      status: 'expired',
      daysRemaining: 0,
      message: `🚨 Subscription Expired for ${sub.business_name}. Renew via OPay Bank Transfer.`
    };
  }

  return {
    isActive: true,
    status: sub.status,
    daysRemaining,
    message: `Active Subscription (${daysRemaining} days remaining)`
  };
}

/**
 * Activate or Renew a Client Subscription (1-Second Reactivation)
 * Called when Admin confirms OPay Transfer or receives receipt on WhatsApp.
 */
export async function renewClientSubscriptionOpay(params: {
  clientId: string;
  businessName?: string;
  contactPhone?: string;
  renewalDays?: number;
  opayReference?: string;
}): Promise<ClientSubscription> {
  const { clientId, businessName = 'Lagos Client', contactPhone = '', renewalDays = 30, opayReference = '' } = params;
  
  const subs = readSubscriptions();
  const existing = subs[clientId];

  const now = new Date();
  const newExpiry = new Date();
  newExpiry.setDate(now.getDate() + renewalDays);

  const updatedSub: ClientSubscription = {
    client_id: clientId,
    business_name: existing?.business_name || businessName,
    contact_phone: existing?.contact_phone || contactPhone,
    package_tier: existing?.package_tier || 'pro',
    status: 'active',
    setup_fee_paid: true,
    opay_account_number: getOpayBankTransferDetails().accountNumber,
    opay_account_name: getOpayBankTransferDetails().accountName,
    subscription_start_iso: now.toISOString(),
    subscription_expiry_iso: newExpiry.toISOString(),
    last_payment_reference: opayReference || `OPAY_${Date.now()}`,
    features_enabled: {
      lead_harvester: true,
      ai_customer_agent: true,
      whatsapp_voice_notes: true,
      ai_voice_caller: true,
    },
    updated_at: now.toISOString(),
  };

  subs[clientId] = updatedSub;
  writeSubscriptions(subs);

  // Sync to Supabase activity log
  try {
    await logActivity({
      type: 'subscription_renewed_opay',
      description: `Client ${updatedSub.business_name} (${clientId}) subscription REACTIVATED via OPay transfer. Valid until ${newExpiry.toLocaleDateString()}`,
      metadata: { clientId, renewalDays, opayReference }
    });
  } catch (_) {}

  console.log(`[SubscriptionManager] Client ${clientId} REACTIVATED until ${newExpiry.toISOString()}`);
  return updatedSub;
}

/**
 * Graceful Feature Fallback when Subscription Expired:
 * Returns friendly renewal message for end-customers when a client's subscription has expired.
 */
export function getExpiredSubscriptionFallbackMessage(businessName = 'this business'): string {
  const opay = getOpayBankTransferDetails();
  return `👋 Hello! The AI Customer Care assistant for ${businessName} is currently undergoing scheduled monthly renewal. ` +
    `To reactivate instantly, please contact Admin or transfer to OPay Bank: ${opay.accountNumber} (${opay.accountName}).`;
}
