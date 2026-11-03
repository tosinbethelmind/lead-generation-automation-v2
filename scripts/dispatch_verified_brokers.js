const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { recordPillar2Dispatch } = require('../src/lib/pillar2/pillar2Pacer');
const { createClient } = require('@supabase/supabase-js');

async function dispatchRealBrokers() {
  const vpsUrl = 'http://169.58.182.92:8080/send';
  const apiKey = 'evolution_bethelmind_secret_2026';

  const targets = [
    {
      ticketId: 'DEAL-AMEN-500M-2606',
      brokerName: 'Ora Egbunike & Associates',
      phone: '08038774238',
      email: 'info@oraegbunike.com',
      propertyTitle: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway for sale',
      price: '₦ 500,000,000'
    },
    {
      ticketId: 'DEAL-VI-850M',
      brokerName: 'Diya Fatimilehin & Co',
      phone: '09053964068',
      email: 'mandates@diyafatimilehin.com',
      propertyTitle: '5-Bedroom Fully Automated Detached House in Victoria Island Commercial Corridor',
      price: '₦ 850,000,000'
    }
  ];

  for (const t of targets) {
    console.log(`\n📲 Dispatching to VERIFIED WhatsApp: ${t.brokerName} (${t.phone})...`);

    const cleanPhone = t.phone.replace(/\D/g, '');
    const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);

    const script = `Good day,
My name is Tosin Oyelakin from Bethelmind Digital Solutions (CAC Certified: Reg 9912717).

I am contacting you regarding your verified prime listing: "${t.propertyTitle}" listed at ${t.price}.

We operate the Bethelmind Corporate & Diaspora Property Desk, onboarding verified Lekki Phase 1 / VI direct mandates for our incoming Q4 diaspora investor brief and corporate executive allocations.

Before logging your property into our active mandate book:
1. Is this property still directly available under your primary mandate?
2. Do you confirm agreement to our standard 80/20 agency fee split (you retain 80% of the agency commission, Bethelmind retains 20% origination fee) under LASRERA guidelines?

Once confirmed, we issue our Joint Inspection Memorandum (JIM) so that whenever an inspection is scheduled with our buyer, your commission and our 20% origination fee are legally secured. Thank you.`;

    const res = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      body: JSON.stringify({
        phone: e164,
        message: script,
        isColdOutreach: false,
        lineId: 1
      })
    });

    const data = await res.json().catch(() => ({}));
    console.log('HTTP Status:', res.status, 'Response:', data);

    if (res.ok && (data.success || data.messageId)) {
      console.log(`✅ DELIVERED TO ${t.brokerName} (${t.phone})! Message ID: ${data.messageId}`);
      await recordPillar2Dispatch({
        ticketId: t.ticketId,
        recipient: `${t.brokerName} (${t.phone})`,
        channel: `Contabo VPS WhatsApp Line 1 (${data.messageId})`
      });

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
              ticketId: t.ticketId,
              opportunityTitle: t.propertyTitle,
              recipientName: t.brokerName,
              recipientPhone: t.phone,
              recipientEmail: t.email,
              status: 'DISPATCHED_MULTI_CHANNEL',
              dispatchedAt: new Date().toISOString(),
              gateway: `Contabo VPS WhatsApp Line 1 (${data.messageId})`,
              channels: {
                whatsapp: { status: 'DISPATCHED_VPS', messageId: data.messageId, dispatchedAt: new Date().toISOString() }
              }
            }),
            tenant_id: 'default'
          });
        } catch (_) {}
      }
    } else {
      console.error(`❌ FAILED for ${t.brokerName}:`, data);
    }
  }
}

dispatchRealBrokers().catch(console.error);
