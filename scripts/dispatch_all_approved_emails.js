const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { getPillar2Telemetry } = require('../src/lib/pillar2/pillar2Engine');
const { sendSmtpMessage, sendBrevoMessage } = require('../src/lib/email');
const { createClient } = require('@supabase/supabase-js');

async function sendEmailsToAllApprovedBrokers() {
  console.log('🏛️ Sending Real Mandate Emails to All Approved Brokers (Hostinger SMTP + Brevo Failover)...');

  const telemetry = await getPillar2Telemetry();
  const approvedTickets = telemetry.allTickets.filter(t => t.status === 'APPROVED');
  console.log(`Found ${approvedTickets.length} approved mandate(s) in active registry.`);

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const t of approvedTickets) {
    const email = t.targetContactEmail || t.actionPayload?.recipientEmail;
    const brokerName = t.targetBusinessName || 'Real Estate Partner';
    const propertyTitle = t.title?.replace('Pillar 2 Mandate: ', '') || 'Luxury Property Mandate';
    const priceFormatted = t.actionPayload?.listingPrice || (t.propertyValueNGN ? `₦${Number(t.propertyValueNGN).toLocaleString()}` : '₦ 500,000,000');

    if (!email || email.includes('@example.com')) {
      console.log(`⚠️ Skipping ${brokerName} (${t.ticketId}): No valid business email on file.`);
      skippedCount++;
      continue;
    }

    console.log(`\n📧 Dispatching Official B2B Email for [${t.ticketId}] to ${brokerName} <${email}> ...`);
    const subject = t.emailSubject || `[LASRERA Co-Brokerage Mandate] Bethelmind Digital Solutions x ${brokerName} - ${propertyTitle}`;
    const body = t.emailBody || `Dear ${brokerName} Management,

Re: Official Co-Brokerage & Joint Mandate Inquiry — ${propertyTitle} (${priceFormatted})

I hope this email finds you well.

My name is Tosin Oyelakin, Principal at Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise: Reg 9912717).

We operate the Bethelmind Corporate & Diaspora Property Desk, onboarding verified direct luxury mandates for our incoming Q4 diaspora investor brief and corporate executive allocations in Lagos.

We have identified your verified listing for:
• Property: ${propertyTitle}
• Listing Value: ${priceFormatted}

Under Lagos State Real Estate Regulatory Authority (LASRERA) co-brokerage guidelines:
1. We request confirmation of primary mandate status for this property.
2. We propose our standard 80/20 agency fee arrangement (your firm retains 80% of the agency commission; Bethelmind retains 20% origination fee).

Upon mutual agreement, our corporate desk executes our formal Joint Inspection Memorandum (JIM) to legally safeguard both parties before buyer inspection.

Corporate Settlement & Desk Verification:
• Bank: Moniepoint Microfinance Bank
• Account Number: 6805375225
• Account Name: Bethelmind Digital Solutions (CAC Reg: 9912717)
• Direct WhatsApp / Closer Hotline: +234 802 279 1227
• Official Portal: https://www.bethelmindanalytics.com

We look forward to a mutually prosperous transaction.

Warm regards,

Tosin Oyelakin
Principal Partner, Commercial & Real Estate Desk
Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
Email: tosin@bethelmindanalytics.com
Desk Hotline: +234 802 279 1227`;

    let deliveredGateway = null;

    // 1. Try Hostinger SMTP
    try {
      await sendSmtpMessage(email, subject, body);
      deliveredGateway = 'Hostinger Direct SMTP (tosin@bethelmindanalytics.com)';
      console.log(`✅ DELIVERED via Hostinger SMTP to ${email}!`);
    } catch (smtpErr) {
      console.log(`⚠️ Hostinger SMTP throttled: ${smtpErr.message}. Attempting Brevo API Failover...`);
      // 2. Fallback to Brevo API v3
      try {
        await sendBrevoMessage(email, subject, body, {});
        deliveredGateway = 'Brevo Cloud API v3 Failover (tosin@bethelmindanalytics.com)';
        console.log(`✅ DELIVERED via Brevo API v3 Failover to ${email}!`);
      } catch (brevoErr) {
        console.error(`❌ Both Hostinger SMTP and Brevo failed for ${email}:`, brevoErr.message);
      }
    }

    if (deliveredGateway) {
      sentCount++;
      if (supabase) {
        await supabase.from('logs').insert({
          run_id: 'pillar2_mandates',
          step: 'PILLAR2_DISPATCHED',
          status: 'SUCCESS',
          message: JSON.stringify({
            ticketId: t.ticketId,
            opportunityTitle: propertyTitle,
            recipientName: brokerName,
            recipientEmail: email,
            recipientPhone: t.targetContactPhone,
            status: 'DISPATCHED_SMTP',
            dispatchedAt: new Date().toISOString(),
            gateway: deliveredGateway,
            channels: {
              email: { status: 'DISPATCHED_SMTP', recipient: email, gateway: deliveredGateway, dispatchedAt: new Date().toISOString() }
            }
          }),
          tenant_id: 'default'
        });
      }
      await new Promise(r => setTimeout(r, 800));
    } else {
      failedCount++;
    }
  }

  console.log('\n============================================================');
  console.log('SUMMARY OF APPROVED MANDATE EMAIL DISPATCHES');
  console.log('============================================================');
  console.log(`Total Approved Mandates : ${approvedTickets.length}`);
  console.log(`Confirmed Delivered     : ${sentCount}`);
  console.log(`Skipped (No Email)      : ${skippedCount}`);
  console.log(`Failed                  : ${failedCount}`);
}

sendEmailsToAllApprovedBrokers().catch(console.error);
