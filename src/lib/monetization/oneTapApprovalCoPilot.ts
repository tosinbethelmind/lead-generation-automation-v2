/**
 * @file src/lib/monetization/oneTapApprovalCoPilot.ts
 * 
 * 1-TAP CO-PILOT HUMAN APPROVAL ENGINE FOR THE 5 MONEY ENGINES.
 * 
 * Architecture:
 * 1. Automatically formats deals from any of the 5 engines into structured approval cards.
 * 2. Generates HMAC-signed 1-tap URLs (expires in 48 hours).
 * 3. Dispatches 1-tap card to Admin WhatsApp (0802 279 1227) & bethelmindrecruit@gmail.com.
 * 4. User taps 1 link to instantly approve; system executes downstream actions (dispatches SMS, registers domain, routes lead, issues invoice).
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { dispatchSecureEmail, getBaseUrl } from './smtpTransporterPool';
import { OPAY_BENEFICIARY_CONFIG } from './directNairaAutoLiquidationRouter';
import { sendAdminWhatsAppNotification, ADMIN_PHONE_E164 } from './adminWhatsAppNotifier';

const HMAC_SECRET = process.env.APPROVAL_HMAC_SECRET || 'bethelmind_copilot_secret_2026_lagos';
const APPROVAL_MEMORY_FILE = path.join(process.cwd(), 'local_db', 'one_tap_copilot_tickets.json');

export interface CoPilotApprovalTicket {
  ticketId: string;
  engineType: 'ENGINE_1_GMB' | 'ENGINE_2_APPOINTMENT' | 'ENGINE_3_DOMAIN' | 'ENGINE_4_BUNDLE' | 'ENGINE_5_PROTOTYPE';
  title: string;
  targetBusinessName: string;
  targetLocation: string;
  targetContactPhone: string;
  projectedRevenueNGN: number;
  upfrontMilestoneNGN: number;
  dealSummary: string;
  actionPayload: any;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  signature: string;
  expiresAt: number; // Unix timestamp
  createdAt: string;
}

export function generateTicketSignature(ticketId: string, engineType: string, revenue: number, expiresAt: number): string {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${ticketId}:${engineType}:${revenue}:${expiresAt}`)
    .digest('hex')
    .substring(0, 32);
}

export function verifyTicketSignature(ticketId: string, engineType: string, revenue: number, expiresAt: number, signature: string): boolean {
  if (Date.now() > expiresAt) return false;
  const expected = generateTicketSignature(ticketId, engineType, revenue, expiresAt);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function loadStoredTickets(): Record<string, CoPilotApprovalTicket> {
  try {
    if (fs.existsSync(APPROVAL_MEMORY_FILE)) {
      return JSON.parse(fs.readFileSync(APPROVAL_MEMORY_FILE, 'utf8'));
    }
  } catch (_) {}
  return {};
}

export function saveStoredTicket(ticket: CoPilotApprovalTicket): void {
  try {
    const dir = path.dirname(APPROVAL_MEMORY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const all = loadStoredTickets();
    all[ticket.ticketId] = ticket;
    fs.writeFileSync(APPROVAL_MEMORY_FILE, JSON.stringify(all, null, 2));
  } catch (_) {}
}

/**
 * Creates and stages a new 1-Tap Co-Pilot ticket.
 */
export async function createAndStageApprovalTicket(params: {
  engineType: CoPilotApprovalTicket['engineType'];
  title: string;
  targetBusinessName: string;
  targetLocation: string;
  targetContactPhone: string;
  projectedRevenueNGN: number;
  upfrontMilestoneNGN: number;
  dealSummary: string;
  actionPayload?: any;
}): Promise<{
  ticket: CoPilotApprovalTicket;
  approveUrl: string;
  rejectUrl: string;
  whatsAppCardText: string;
}> {
  const ticketId = `CP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 Hours
  const signature = generateTicketSignature(ticketId, params.engineType, params.projectedRevenueNGN, expiresAt);

  const ticket: CoPilotApprovalTicket = {
    ticketId,
    engineType: params.engineType,
    title: params.title,
    targetBusinessName: params.targetBusinessName,
    targetLocation: params.targetLocation,
    targetContactPhone: params.targetContactPhone,
    projectedRevenueNGN: Math.round(params.projectedRevenueNGN),
    upfrontMilestoneNGN: Math.round(params.upfrontMilestoneNGN),
    dealSummary: params.dealSummary,
    actionPayload: params.actionPayload || {},
    status: 'PENDING_APPROVAL',
    signature,
    expiresAt,
    createdAt: new Date().toISOString()
  };

  saveStoredTicket(ticket);

  const baseUrl = getBaseUrl();
  const approveUrl = `${baseUrl}/api/admin/one-tap-approval?id=${ticketId}&action=approve&sig=${signature}&exp=${expiresAt}`;
  const rejectUrl = `${baseUrl}/api/admin/one-tap-approval?id=${ticketId}&action=reject&sig=${signature}&exp=${expiresAt}`;

  const whatsAppCardText =
    `🏛️ *BETHELMIND CO-PILOT: 1-TAP APPROVAL REQUIRED*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🎯 *Opportunity:* ${params.title}\n` +
    `🏢 *Business:* ${params.targetBusinessName}\n` +
    `📍 *Location:* ${params.targetLocation}\n` +
    `📞 *Client Phone:* ${params.targetContactPhone}\n\n` +
    `💰 *Financial Projection:* \n` +
    `• *Upfront Deposit:* ₦${ticket.upfrontMilestoneNGN.toLocaleString()} NGN\n` +
    `• *Total Net Yield:* ₦${ticket.projectedRevenueNGN.toLocaleString()} NGN\n` +
    `• *Direct Settlement:* OPay (${OPAY_BENEFICIARY_CONFIG.accountNumber})\n\n` +
    `📝 *Deal Summary:*\n${params.dealSummary}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👉 *1-TAP USER COMMANDS:*\n` +
    `✅ *[1-TAP APPROVE & DISPATCH]*:\n${approveUrl}\n\n` +
    `❌ *[REJECT / ARCHIVE]*:\n${rejectUrl}`;

  // 1. Dispatch directly to Admin WhatsApp (0802 279 1227)
  await sendAdminWhatsAppNotification(whatsAppCardText);

  // 2. Dispatch to Executive Email
  await dispatchSecureEmail({
    to: 'bethelmindrecruit@gmail.com',
    subject: `🚨 [1-Tap Approval Required] ${params.title} (₦${ticket.projectedRevenueNGN.toLocaleString()} NGN)`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; padding: 24px;">
        <div style="font-size: 12px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px;">
          ⚡ BETHELMIND 1-TAP CO-PILOT APPROVAL GATE
        </div>
        <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px;">${params.title}</h2>
        <div style="background: #111e38; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #1e3a8a;">
          <div style="font-size: 14px; margin-bottom: 6px;"><strong>Business:</strong> ${params.targetBusinessName} (${params.targetLocation})</div>
          <div style="font-size: 14px; margin-bottom: 6px;"><strong>Contact:</strong> ${params.targetContactPhone}</div>
          <div style="font-size: 16px; color: #10b981; font-weight: 800; margin-top: 10px;">
            Deposit: ₦${ticket.upfrontMilestoneNGN.toLocaleString()} | Net Yield: ₦${ticket.projectedRevenueNGN.toLocaleString()} NGN
          </div>
        </div>
        <div style="display: flex; gap: 12px;">
          <a href="${approveUrl}" style="background: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 800; display: inline-block;">
            ✅ 1-Tap Approve & Dispatch
          </a>
          <a href="${rejectUrl}" style="background: #ef4444; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; display: inline-block; margin-left: 10px;">
            ❌ Reject
          </a>
        </div>
      </div>
    `
  });

  return { ticket, approveUrl, rejectUrl, whatsAppCardText };
}

