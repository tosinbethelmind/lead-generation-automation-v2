import path from 'path';
import fs from 'fs';
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

async function testWhatsAppLive() {
  console.log('====================================================');
  console.log('💬 TESTING LIVE WHATSAPP DISPATCH TO +2348022791227');
  console.log('====================================================');

  const lead = {
    lead_id: 'test_lead_001',
    name: 'Tosin Bethelmind',
    phone_e164: '+2348022791227',
    phone_raw: '+2348022791227',
    email: 'BETHELMINDRECRUIT@GMAIL.COM'
  };

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

  try {
    const res = await sendWhatsAppMessage(
      lead,
      `${origin}/preview/${lead.lead_id}`,
      origin,
      'Hi {{lead.name}}, live WhatsApp verification test from your ApexReach Lead Engine! Link: {{previewUrl}}'
    );
    console.log('✅ WHATSAPP RESULT:', res);
  } catch (err: any) {
    console.error('❌ WhatsApp Error:', err.message);
  }
}

testWhatsAppLive();
