import fs from 'fs';
import path from 'path';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const COPILOT_PATH = path.join(LOCAL_DB, 'one_tap_copilot_tickets.json');
const PIPELINE_PATH = path.join(LOCAL_DB, 'pipeline_deals.json');
const ORDERS_DIR = path.join(process.cwd(), 'data', 'orders');

if (!fs.existsSync(ORDERS_DIR)) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true });
}

function approveAndIssueInvoices() {
  console.log('⚡ [CO-PILOT APPROVAL DESK] Processing pending deal tickets...\n');

  if (!fs.existsSync(COPILOT_PATH)) {
    console.log('No copilot tickets found.');
    return;
  }

  const tickets = JSON.parse(fs.readFileSync(COPILOT_PATH, 'utf8'));
  let deals: Record<string, any> = {};
  if (fs.existsSync(PIPELINE_PATH)) {
    try { deals = JSON.parse(fs.readFileSync(PIPELINE_PATH, 'utf8')); } catch (_) {}
  }

  const nowIso = new Date().toISOString();
  let approvedCount = 0;

  for (const [ticketId, ticket] of Object.entries(tickets) as [string, any][]) {
    if (ticket.status === 'PENDING_APPROVAL') {
      ticket.status = 'APPROVED';
      ticket.approvedAt = nowIso;
      ticket.settlementAccount = {
        bankName: 'OPay Digital Services',
        accountNumber: '7034297995',
        accountName: 'Oyelakin Tosin Matthew'
      };

      // Generate invoice card
      const invoiceNumber = `BM-INV-${ticketId.replace('CP-', '')}`;
      const invoicePayload = {
        invoiceNumber,
        ticketId,
        clientName: ticket.targetBusinessName,
        clientLocation: ticket.targetLocation,
        clientPhone: ticket.targetContactPhone,
        totalProjectValueNGN: ticket.projectedRevenueNGN,
        milestoneDepositDueNGN: ticket.upfrontMilestoneNGN,
        deliverables: [
          '24/7 AI WhatsApp Sales & Quoting Assistant Integration',
          'Sector Calculation Engine (BOQ Load Sizer / Pricing Quoter)',
          'Custom Brand Commercial Web Prototype & Domain Staging',
          'Automated Direct-to-OPay & Paystack Verification Gateway',
          'Executive PDF Quote Generator & Instant WhatsApp Delivery',
          '48-Hour SLA Deployment Guarantee'
        ],
        settlementBank: {
          bankName: 'OPay Digital Services',
          accountNumber: '7034297995',
          accountName: 'Oyelakin Tosin Matthew'
        },
        paymentReference: `REF-${ticketId}`,
        status: 'INVOICE_DISPATCHED_AWAITING_PAYMENT',
        issuedAt: nowIso
      };

      ticket.invoice = invoicePayload;

      // Update in pipeline deals
      const dealId = `deal_${ticketId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      deals[dealId] = {
        id: dealId,
        lead_id: ticketId,
        title: `${ticket.targetBusinessName} — ${ticket.title}`,
        stage_id: 'invoice_sent',
        sector: ticket.engineType,
        value: ticket.projectedRevenueNGN,
        currency: 'NGN',
        contact_name: ticket.targetBusinessName,
        contact_phone: ticket.targetContactPhone,
        contact_email: '',
        category: ticket.title,
        area: ticket.targetLocation,
        city: 'Lagos',
        assigned_to: 'Admin Closer Desk',
        notes: `Approved by Co-Pilot. Invoice ${invoiceNumber} issued for ₦${ticket.upfrontMilestoneNGN.toLocaleString()} upfront milestone.`,
        probability: 70,
        expected_close_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        created_at: ticket.createdAt || nowIso,
        updated_at: nowIso,
        custom_fields: JSON.stringify({ invoiceNumber, milestoneDue: ticket.upfrontMilestoneNGN })
      };

      // Write formal invoice file
      fs.writeFileSync(
        path.join(ORDERS_DIR, `${invoiceNumber}.json`),
        JSON.stringify(invoicePayload, null, 2),
        'utf8'
      );

      approvedCount++;
      console.log(`✅ Approved Ticket ${ticketId}: ${ticket.targetBusinessName}`);
      console.log(`   • Value: ₦${ticket.projectedRevenueNGN.toLocaleString()} (Deposit Due: ₦${ticket.upfrontMilestoneNGN.toLocaleString()})`);
      console.log(`   • Invoice: ${invoiceNumber} -> OPay (7034297995)\n`);
    }
  }

  fs.writeFileSync(COPILOT_PATH, JSON.stringify(tickets, null, 2), 'utf8');
  fs.writeFileSync(PIPELINE_PATH, JSON.stringify(deals, null, 2), 'utf8');

  console.log(`🎉 Success! Approved and issued invoices for ${approvedCount} deal tickets.`);
}

approveAndIssueInvoices();
