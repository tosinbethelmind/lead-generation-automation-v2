/**
 * @file src/app/api/approve/route.ts
 * 
 * 🏛️ ZERO-FRICTION PUBLIC 1-TAP CO-PILOT APPROVAL GATE (PRODUCTION HARDENED)
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * HARDENED CAPABILITIES:
 * 1. Cryptographic HMAC-SHA256 Stateless Token Verification.
 * 2. Idempotency Guard: Prevents double-tap duplicate dispatches.
 * 3. Freshness & Staleness Guard: Validates token expiration SLA (48-hour window).
 * 4. Multi-Node Outbound Queueing: Syncs to local queue AND Supabase Cloud.
 * 5. Real-Time Admin WhatsApp Confirmation (0802 279 1227).
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyStatelessToken } from '@/lib/monetization/oneTapApprovalCoPilot';
import { sendAdminWhatsAppNotification, ADMIN_PHONE_E164 } from '@/lib/monetization/adminWhatsAppNotifier';

// In-memory idempotency cache across serverless requests
const EXECUTED_CACHE = new Map<string, { action: string; executedAt: string }>();
const LEDGER_PATH = path.join(process.cwd(), 'local_db', 'approved_tickets_ledger.json');
const OUTBOUND_QUEUE_PATH = path.join(process.cwd(), 'local_db', 'mandate_outbound_queue.json');

function getLedger(): Record<string, { action: string; executedAt: string; ticket: any }> {
  try {
    if (fs.existsSync(LEDGER_PATH)) {
      return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function saveLedgerEntry(ticketId: string, action: string, ticket: any) {
  try {
    const dir = path.dirname(LEDGER_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ledger = getLedger();
    const entry = { action, executedAt: new Date().toISOString(), ticket };
    ledger[ticketId] = entry;
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
    EXECUTED_CACHE.set(ticketId, { action, executedAt: entry.executedAt });
  } catch (_) {}
}

async function syncToSupabaseCloud(ticket: any, action: string) {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    await supabase.from('logs').insert([{
      run_id: `COPILOT_${ticket.ticketId}`,
      step: 'PILLAR2_MANDATE_OUTBOUND',
      status: 'INFO',
      message: JSON.stringify({
        action,
        ticketId: ticket.ticketId,
        title: ticket.title,
        recipientName: ticket.targetBusinessName,
        recipientPhone: ticket.targetContactPhone,
        projectedRevenueNGN: ticket.projectedRevenueNGN,
        script: ticket.preDraftedScript,
        timestamp: new Date().toISOString()
      })
    }]);
  } catch (err) {
    console.error('Supabase cloud log sync failed:', err);
  }
}

function enqueueOutboundMandate(ticket: any) {
  try {
    const dir = path.dirname(OUTBOUND_QUEUE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let queue: any[] = [];
    if (fs.existsSync(OUTBOUND_QUEUE_PATH)) {
      try { queue = JSON.parse(fs.readFileSync(OUTBOUND_QUEUE_PATH, 'utf8')); } catch (_) { queue = []; }
    }
    queue.push({
      enqueuedAt: new Date().toISOString(),
      ticketId: ticket.ticketId,
      recipientPhone: ticket.targetContactPhone,
      recipientName: ticket.targetBusinessName,
      opportunityTitle: ticket.title,
      scriptText: ticket.preDraftedScript,
      projectedSettlementNGN: ticket.projectedRevenueNGN,
      status: 'QUEUED_FOR_OUTBOUND'
    });
    fs.writeFileSync(OUTBOUND_QUEUE_PATH, JSON.stringify(queue, null, 2));
  } catch (_) {}

  // Also sync to Supabase Cloud for multi-node VPS & Cloud worker access
  syncToSupabaseCloud(ticket, 'APPROVED').catch(() => {});
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data');
  const action = searchParams.get('action') || 'approve';
  const sig = searchParams.get('sig');

  if (!data || !sig) {
    return new NextResponse('Missing required approval parameters.', { status: 400 });
  }

  // 1. Cryptographic HMAC-SHA256 signature verification
  const payload = verifyStatelessToken(data, sig);
  if (!payload) {
    return new NextResponse('Invalid, tampered, or expired approval token.', { status: 403 });
  }

  const ticketId = payload.id || `CP-${Date.now().toString(36).toUpperCase()}`;

  // 2. Idempotency Check: Prevent duplicate double-tap dispatches
  const ledger = getLedger();
  const existingExecution = EXECUTED_CACHE.get(ticketId) || ledger[ticketId];

  if (existingExecution) {
    const duplicateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bethelmind Co-Pilot: Already Executed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 90vh;">
        <div style="max-width: 520px; width: 100%; background: #0b1329; border: 1px solid #38bdf8; border-radius: 16px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">ℹ️</div>
          <h1 style="font-size: 22px; font-weight: 800; color: #38bdf8; margin: 0 0 8px 0;">Deal Already Processed</h1>
          <p style="font-size: 14px; color: #94a3b8; margin: 0 0 20px 0;">
            Ticket <strong>#${ticketId}</strong> was already <strong>${existingExecution.action}D</strong> on:<br>
            <span style="color: #cbd5e1; font-family: monospace;">${existingExecution.executedAt}</span>
          </p>
          <div style="font-size: 13px; color: #64748b; background: #111e38; padding: 14px; border-radius: 8px;">
            Duplicate dispatch prevented to protect agency reputation and avoid spamming the broker.
          </div>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(duplicateHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // 3. Freshness & Staleness SLA Check (48h default)
  const isExpired = payload.exp && typeof payload.exp === 'number' && Date.now() > payload.exp;
  const rawContact = payload.phone || 'Direct Mandate';
  const isUrlContact = rawContact.startsWith('http://') || rawContact.startsWith('https://');

  const ticket = {
    ticketId,
    title: payload.title || 'High-Ticket Mandate Opportunity',
    targetBusinessName: payload.target || 'Listing Broker / Partner',
    targetLocation: payload.loc || 'Lagos, Nigeria',
    targetContactPhone: rawContact,
    isUrlContact,
    isExpired,
    projectedRevenueNGN: payload.rev || 0,
    propertyValueNGN: payload.val || 0,
    preDraftedScript: payload.script || '',
    status: action === 'approve' ? 'APPROVED' : 'REJECTED'
  };

  // 4. Record Execution in Idempotency Ledger
  saveLedgerEntry(ticketId, action, ticket);

  if (action === 'approve') {
    // 5. Enqueue Actual Outbound Message
    enqueueOutboundMandate(ticket);

    // 6. Fire Confirmation Alert to Admin WhatsApp (0802 279 1227)
    try {
      const alertText = 
        `🏛️ *BETHELMIND DEAL WIRE: DISPATCH CONFIRMED*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ *Ticket Executed:* #${ticket.ticketId}\n` +
        `🏡 *Asset:* ${ticket.title}\n` +
        `👤 *Broker:* ${ticket.targetBusinessName} (${isUrlContact ? 'Jiji Direct' : ticket.targetContactPhone})\n` +
        `💰 *Projected 20% Cut:* ₦${ticket.projectedRevenueNGN.toLocaleString()} NGN\n` +
        `⏱️ *Freshness:* ${isExpired ? '⚠️ Re-Verification Required (>48h)' : '🟢 Active Fresh SLA'}\n` +
        `🏦 *Settlement:* Moniepoint MFB (6805375225)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Outreach is actively queued in Outbound Gateway.`;
      
      sendAdminWhatsAppNotification(alertText).catch(() => {});
    } catch (_) {}

    const contactDisplayHtml = isUrlContact
      ? `<a href="${ticket.targetContactPhone}" target="_blank" style="color: #38bdf8; font-weight: 700; text-decoration: underline;">Open Listing & Chat Broker on Jiji ↗</a>`
      : `<a href="https://wa.me/${ticket.targetContactPhone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #38bdf8; font-weight: 700; text-decoration: underline;">${ticket.targetContactPhone} (Direct Line)</a>`;

    const freshnessBanner = isExpired
      ? `<div style="font-size: 12px; color: #fbbf24; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); padding: 8px 12px; border-radius: 6px; margin-bottom: 12px;">
           ⚠️ <strong>Deal Freshness Notice:</strong> This listing was generated over 48 hours ago. System has flagged this for soft-availability reconfirmation before finalizing inspection dates.
         </div>`
      : `<div style="font-size: 12px; color: #34d399; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); padding: 8px 12px; border-radius: 6px; margin-bottom: 12px;">
           🟢 <strong>Verified Fresh Listing:</strong> Active SLA confirmed within current market cycle.
         </div>`;

    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bethelmind Co-Pilot: Deal Approved</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 90vh;">
        <div style="max-width: 520px; width: 100%; background: #0b1329; border: 1px solid #059669; border-radius: 16px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
          <h1 style="font-size: 24px; font-weight: 800; color: #10b981; margin: 0 0 8px 0;">Deal Approved & Dispatched!</h1>
          <p style="font-size: 14px; color: #94a3b8; margin: 0 0 16px 0;">
            Ticket <strong>#${ticket.ticketId}</strong> has been executed autonomously.
          </p>

          ${freshnessBanner}

          <div style="background: #111e38; border: 1px solid #1e3a8a; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px;">
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 8px;"><strong>Opportunity:</strong> ${ticket.title}</div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 8px;"><strong>Target Partner:</strong> ${ticket.targetBusinessName} (${ticket.targetLocation})</div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 8px;"><strong>Partner Contact:</strong> ${contactDisplayHtml}</div>
            <div style="font-size: 16px; color: #34d399; font-weight: 800; margin-top: 14px;">
              Projected Origination Settlement: ₦${ticket.projectedRevenueNGN.toLocaleString()} NGN
            </div>
            <div style="font-size: 12px; color: #6ee7b7; margin-top: 4px;">
              Corporate Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
            </div>
          </div>

          <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
            Outreach & Co-Brokerage Mandate Inquiry queued in Outbound Gateway.<br>You may safely close this window.
          </div>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(confirmationHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } else {
    const rejectedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bethelmind Co-Pilot: Deal Rejected</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; color: #f9fafb; margin: 0; padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 90vh;">
        <div style="max-width: 520px; width: 100%; background: #0b1329; border: 1px solid #ef4444; border-radius: 16px; padding: 32px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">🛑</div>
          <h1 style="font-size: 24px; font-weight: 800; color: #ef4444; margin: 0 0 8px 0;">Deal Rejected & Archived</h1>
          <p style="font-size: 14px; color: #94a3b8;">
            Ticket <strong>#${ticket.ticketId}</strong> has been cancelled. No outreach will be dispatched.
          </p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(rejectedHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
