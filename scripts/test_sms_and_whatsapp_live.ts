import path from 'path';
import fs from 'fs';
import { sendSmsMessage } from '../src/lib/sms';
import { sendWhatsAppMessage } from '../src/lib/whatsapp';

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = (match[2] || '').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

process.env.DRY_RUN = 'false';

async function runLiveTest() {
  console.log('====================================================');
  console.log('📱 & 💬 TESTING SMS GATEWAY AND WHATSAPP LIVE DISPATCH');
  console.log('====================================================');
  console.log('Target Phone: +2348022791227');

  const lead = {
    lead_id: 'test_lead_001',
    name: 'Tosin Bethelmind',
    phone_e164: '+2348022791227',
    phone_raw: '+2348022791227',
    email: 'BETHELMINDRECRUIT@GMAIL.COM'
  };

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

  const endpoints = [
    'http://10.50.220.22:8082',
    'http://100.107.243.108:8082',
    'http://10.219.238.123:8082'
  ];

  console.log('\n--- 1. Testing Carrier Android SMS Gateway ---');
  let smsSuccess = false;
  for (const ep of endpoints) {
    try {
      console.log(`Trying SMS Endpoint: ${ep}...`);
      const overrideConfig = {
        smsProvider: 'gateway',
        smsGatewayUrl: ep,
        smsGatewayToken: 'f34af5ea-f657-41b1-b83e-4a59eb786e57',
        businessSignature: 'Bethelmind Analytics'
      };

      const res = await sendSmsMessage(
        lead,
        `${origin}/preview/${lead.lead_id}`,
        'Hello {{lead.name}}, live SMS test from your Bethelmind Lead Engine! Link: {{previewUrl}}',
        overrideConfig
      );
      console.log(`✅ SMS SENT SUCCESSFULLY via ${ep}:`, res);
      smsSuccess = true;
      break;
    } catch (err: any) {
      console.log(`⚠️ SMS Endpoint ${ep} returned:`, err.message);
    }
  }

  if (!smsSuccess) {
    console.log('💡 Note on SMS: Ensure "Enable service" checkbox is checked in your Android SMS Gateway app settings screen.');
  }

  console.log('\n--- 2. Testing WhatsApp Message Sender ---');
  try {
    const waRes = await sendWhatsAppMessage(
      lead,
      `${origin}/preview/${lead.lead_id}`,
      origin,
      'Hi {{lead.name}}, live WhatsApp outreach test from Bethelmind Lead Engine! Link: {{previewUrl}}'
    );
    console.log('✅ WHATSAPP SENT SUCCESSFULLY:', waRes);
  } catch (err: any) {
    console.log('⚠️ WhatsApp Notice:', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 TEST DISPATCH RUN COMPLETED');
  console.log('====================================================');
}

runLiveTest();
