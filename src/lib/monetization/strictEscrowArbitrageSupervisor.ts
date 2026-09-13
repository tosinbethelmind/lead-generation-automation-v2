/**
 * @file src/lib/monetization/strictEscrowArbitrageSupervisor.ts
 * 
 * SPECIALIZED 24/7 STRICT ESCROW & SPREAD ARBITRAGE SUPERVISOR.
 * 
 * Core Operating Laws:
 * 1. 0.00% Capital Risk: Intermediary margin arbitrage only.
 * 2. Strict Whitelist Diamond Desks: AlphaDesk (#402), BitDelta (#118) only.
 * 3. Continuous Unique Pipeline: Generates unique refs & 15s audio for every lead.
 * 4. Human Co-Pilot Approval Gate: Live payment account is NEVER dispatched
 *    to a client without the user's explicit 1-tap approval on Admin WhatsApp.
 * 5. Deterministic Math Check: wholesaleCost + netProfit === totalDeposit (0 kobo error).
 * 6. Direct-to-OPay Profit Routing: 7034297995 (Oyelakin Tosin Matthew).
 */

import fs from 'fs';
import path from 'path';
import { calculateTradeFinancials } from './financialCalculationGuard';
import { TOP_RATED_DIAMOND_MERCHANTS, formatClientInvoiceWithMandatoryConfirmation } from './topRatedMerchantVault';
import { generateUniqueClientPackage } from './continuousUniqueClientFactory';
import { confirmWholesalePriceBeforeJump } from './wholesalePreFlightGuard';

export interface PendingApprovalTicket {
  ticketId: string;
  clientRef: string;
  clientName: string;
  clientPhone: string;
  orderUSD: number;
  quotedRate: number;
  wholesaleRate: number;
  totalNairaDeposit: string;
  spreadProfitOPay: string;
  chosenMerchant: string;
  merchantAccount: string;
  status: 'AWAITING_USER_APPROVAL' | 'APPROVED_AND_DISPATCHED' | 'REJECTED';
  createdAt: string;
}

export class StrictEscrowArbitrageSupervisor {
  private adminPhone: string = '2348022791227';
  private opayAccount: string = '7034297995';
  private stateFilePath: string = path.join(__dirname, '../../../local_db/escrow_supervisor_state.json');

  constructor() {
    this.ensureStateFile();
  }

  private ensureStateFile() {
    const dir = path.dirname(this.stateFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.stateFilePath)) {
      fs.writeFileSync(this.stateFilePath, JSON.stringify({ pendingTickets: [], completedDeals: [], totalProfitSettledNGN: 0 }, null, 2));
    }
  }

  /**
   * Process Inbound Client Request for Payment Account
   * Intercepts and requires explicit Admin 1-Click Approval
   */
  public async handleClientAccountRequest(
    clientRef: string,
    clientName: string,
    clientPhone: string,
    orderUSD: number = 65000,
    quoteRate: number = 1375
  ): Promise<PendingApprovalTicket> {
    console.log(`\n🛡️ [Strict Supervisor]: Intercepting account request from ${clientName} (${clientRef})...`);

    // 1. Pre-Flight Wholesale Price Confirmation
    const wholesaleCheck = await confirmWholesalePriceBeforeJump(orderUSD, quoteRate, 'ALPHADESK_OTC');
    if (!wholesaleCheck.isConfirmed) {
      throw new Error(`Wholesale pre-flight check failed: ${wholesaleCheck.errorMessage}`);
    }

    const wholesaleRate = wholesaleCheck.confirmedWholesaleRateNGN;

    // 2. Deterministic Math Guard
    const financials = calculateTradeFinancials(orderUSD, quoteRate, wholesaleRate);

    // 3. Select Top Verified Diamond Merchant
    const merchant = TOP_RATED_DIAMOND_MERCHANTS['ALPHADESK_OTC'];

    // 3. Generate Secure Approval Ticket
    const ticketId = `TICKET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const ticket: PendingApprovalTicket = {
      ticketId,
      clientRef,
      clientName,
      clientPhone,
      orderUSD,
      quotedRate: quoteRate,
      wholesaleRate,
      totalNairaDeposit: financials.formattedDeposit,
      spreadProfitOPay: financials.formattedProfit,
      chosenMerchant: merchant.corporateName,
      merchantAccount: `${merchant.accountName} (${merchant.escrowBank} - [Live NUBAN Retrieved On Approval])`,
      status: 'AWAITING_USER_APPROVAL',
      createdAt: new Date().toISOString()
    };

    // 4. Save to State
    const state = JSON.parse(fs.readFileSync(this.stateFilePath, 'utf8'));
    state.pendingTickets.push(ticket);
    fs.writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));

    // 5. Build 1-Click WhatsApp Approval Alert for Admin
    const approvalCard = `🚨 *[ACTION REQUIRED: APPROVE PAYMENT ACCOUNT DISPATCH]*
🎫 *Ticket ID:* \`${ticketId}\`
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Client:* ${clientName} (\`${clientRef}\`)
📞 *Phone:* \`${clientPhone}\`
📦 *Order Volume:* $${orderUSD.toLocaleString()} USD
💵 *Client Pays:* *${financials.formattedDeposit}* (@ ₦${quoteRate}/$)
💰 *YOUR SPREAD PROFIT:* *+${financials.formattedProfit}* (OPay \`${this.opayAccount}\`)

🏦 *MERCHANT ESCROW CLEARING DESK:*
• *Desk:* ${merchant.corporateName}
• *Bank:* ${merchant.escrowBank}
• *Account Name:* ${merchant.accountName}
• *Live Account Number:* [Retrieved Live from API upon your approval]
• *Desk Hotline:* \`${merchant.directPhone}\`

🔒 *APPROVAL GATE:*
Reply *APPROVE ${ticketId}* or tap link below to authorize live account generation & delivery to client.

👉 *1-Click Approve on WhatsApp:*
https://wa.me/2348022791227?text=APPROVE%20${ticketId}`;

    // Send Alert to Admin Phone
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: this.adminPhone, message: approvalCard, lineId: 2 })
    }).catch(console.error);

    console.log(`✅ [Strict Supervisor]: Approval Ticket ${ticketId} sent to Admin WhatsApp (${this.adminPhone}).`);
    return ticket;
  }

  /**
   * Execute Approved Dispatch
   */
  public async executeApprovedDispatch(ticketId: string) {
    const state = JSON.parse(fs.readFileSync(this.stateFilePath, 'utf8'));
    const ticket = state.pendingTickets.find((t: PendingApprovalTicket) => t.ticketId === ticketId);

    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found.`);
    }

    if (ticket.status !== 'AWAITING_USER_APPROVAL') {
      console.log(`Ticket ${ticketId} already processed. Status: ${ticket.status}`);
      return;
    }

    // Format the verified final invoice
    const finalInvoice = formatClientInvoiceWithMandatoryConfirmation(
      ticket.clientRef,
      ticket.clientName,
      ticket.orderUSD,
      ticket.quotedRate,
      ticket.wholesaleRate,
      'ALPHADESK_OTC'
    );

    // Dispatch to Client
    const cleanClientPhone = ticket.clientPhone.replace(/\D/g, '');
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanClientPhone, message: finalInvoice, lineId: 2 })
    });

    ticket.status = 'APPROVED_AND_DISPATCHED';
    fs.writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));

    // Confirm to Admin
    const confirmationMsg = `🎉 *[DISPATCH CONFIRMED]*\n\nOfficial Escrow Invoice for *${ticket.clientName}* (${ticket.clientRef}) was successfully delivered to client phone (+${cleanClientPhone})!\n\nSpread margin of *${ticket.spreadProfitOPay}* will settle to OPay ${this.opayAccount} upon bank deposit.`;
    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: this.adminPhone, message: confirmationMsg, lineId: 2 })
    });

    console.log(`🚀 [Strict Supervisor]: Invoice for Ticket ${ticketId} dispatched to client.`);
  }
}
