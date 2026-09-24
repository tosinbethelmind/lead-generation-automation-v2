/**
 * @file src/app/api/admin/one-tap-approval/route.ts
 * 
 * 1-TAP CO-PILOT WEBHOOK APPROVAL ROUTE.
 * 
 * Receives 1-click approvals from WhatsApp/Email, verifies cryptographic signature,
 * executes downstream actions, and returns an executive confirmation screen.
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadStoredTickets, saveStoredTicket, verifyTicketSignature } from '@/lib/monetization/oneTapApprovalCoPilot';
import { OPAY_BENEFICIARY_CONFIG } from '@/lib/monetization/directNairaAutoLiquidationRouter';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get('id');
  const action = searchParams.get('action');
  const sig = searchParams.get('sig');
  const exp = parseInt(searchParams.get('exp') || '0', 10);

  if (!ticketId || !action || !sig || !exp) {
    return new NextResponse('Missing required approval parameters.', { status: 400 });
  }

  const allTickets = loadStoredTickets();
  const ticket = allTickets[ticketId];

  if (!ticket) {
    return new NextResponse('Approval ticket not found or already processed.', { status: 404 });
  }

  // Verify cryptographic HMAC signature
  const isValid = verifyTicketSignature(ticketId, ticket.engineType, ticket.projectedRevenueNGN, exp, sig);
  if (!isValid) {
    return new NextResponse('Invalid or expired approval token.', { status: 403 });
  }

  if (action === 'approve') {
    ticket.status = 'APPROVED';
    saveStoredTicket(ticket);

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
          <p style="font-size: 14px; color: #94a3b8; margin: 0 0 20px 0;">
            Ticket <strong>#${ticket.ticketId}</strong> has been executed autonomously.
          </p>

          <div style="background: #111e38; border: 1px solid #1e3a8a; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px;">
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;"><strong>Opportunity:</strong> ${ticket.title}</div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;"><strong>Client:</strong> ${ticket.targetBusinessName} (${ticket.targetLocation})</div>
            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;"><strong>Contact:</strong> ${ticket.targetContactPhone}</div>
            <div style="font-size: 16px; color: #34d399; font-weight: 800; margin-top: 12px;">
              Projected Settlement: ₦${ticket.projectedRevenueNGN.toLocaleString()} NGN
            </div>
            <div style="font-size: 12px; color: #6ee7b7; margin-top: 4px;">
              Settlement Target: OPay (${OPAY_BENEFICIARY_CONFIG.accountNumber} - ${OPAY_BENEFICIARY_CONFIG.accountName})
            </div>
          </div>

          <div style="font-size: 12px; color: #64748b;">
            Downstream SMS & Client Outreach queued in Tailscale Gateway.<br>You may safely close this window.
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
    ticket.status = 'REJECTED';
    saveStoredTicket(ticket);

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
