const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function dispatchApprovedMandate() {
  const { recordPillar2Dispatch, checkPillar2PacingEligibility } = require('../src/lib/pillar2/pillar2Pacer');
  const { createClient } = require('@supabase/supabase-js');

  const ticketId = 'DEAL-AMEN-500M-2606';
  const brokerName = 'Ora Egbunike & Associates';
  const brokerPhone = '08021061457';
  const brokerEmail = 'info@oraegbunike.com';
  const propertyTitle = '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway for sale';
  const propertyPrice = '₦ 500,000,000';

  console.log('🏛️ Commencing WhatsApp Dispatch for Approved Deal:', ticketId);
  console.log('Target Broker:', brokerName, `(${brokerPhone})`);

  // 1. Check Pacer
  const pacer = await checkPillar2PacingEligibility(true);
  console.log(`Current Daily Quota: ${pacer.sentToday}/${pacer.maxDaily} sent today.`);

  const cleanPhone = brokerPhone.replace(/\D/g, '');
  const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);

  const script = `Good day,
My name is Tosin Oyelakin from Bethelmind Digital Solutions (CAC Certified: Reg 9912717).

I am contacting you regarding your verified prime listing: "${propertyTitle}" listed at ${propertyPrice}.

We operate the Bethelmind Corporate & Diaspora Property Desk, onboarding verified Lekki Phase 1 / VI direct mandates for our incoming Q4 diaspora investor brief and corporate executive allocations.

Before logging your property into our active mandate book:
1. Is this property still directly available under your primary mandate?
2. Do you confirm agreement to our standard 80/20 agency fee split (you retain 80% of the agency commission, Bethelmind retains 20% origination fee) under LASRERA guidelines?

Once confirmed, we issue our Joint Inspection Memorandum (JIM) so that whenever an inspection is scheduled with our buyer, your commission and our 20% origination fee are legally secured. Thank you.`;

  // 2. Dispatch via Contabo VPS WhatsApp Gateway
  const vpsUrl = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8080/send';
  const apiKey = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';

  console.log(`\n📲 Sending WhatsApp Mandate to +${e164} via Line 1...`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(vpsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
    body: JSON.stringify({
      phone: e164,
      message: script,
      isColdOutreach: false,
      lineId: 1
    }),
    signal: controller.signal
  });
  clearTimeout(timeout);

  console.log('HTTP Status:', res.status, res.statusText);
  const data = await res.json().catch(() => ({}));
  console.log('VPS WhatsApp Response:', data);

  if (res.ok && (data.success || data.messageId)) {
    console.log(`\n✅ WHATSAPP CONFIRMED DELIVERED! Message ID: ${data.messageId}`);

    // 3. Record in Pacer
    await recordPillar2Dispatch({
      ticketId,
      recipient: `${brokerName} (${brokerPhone})`,
      channel: `Contabo VPS WhatsApp Line 1 (${data.messageId})`
    });

    // 4. Record to Supabase logs
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        await supabase.from('logs').insert({
          run_id: 'pillar2_mandates',
          step: 'PILLAR2_DISPATCHED',
          status: 'SUCCESS',
          message: JSON.stringify({
            ticketId,
            opportunityTitle: propertyTitle,
            recipientName: brokerName,
            recipientPhone: brokerPhone,
            recipientEmail: brokerEmail,
            status: 'DISPATCHED_MULTI_CHANNEL',
            dispatchedAt: new Date().toISOString(),
            gateway: `Contabo VPS WhatsApp Line 1 (${data.messageId})`,
            channels: {
              whatsapp: { status: 'DISPATCHED_VPS', messageId: data.messageId, dispatchedAt: new Date().toISOString() }
            }
          }),
          tenant_id: 'default'
        });
        console.log('☁️ Persisted dispatch confirmation to Supabase Cloud logs.');
      } catch (err) {
        console.log('Supabase log error:', err.message);
      }
    }
  } else {
    console.error('❌ WhatsApp dispatch failed:', data);
  }
}

dispatchApprovedMandate().catch(console.error);
