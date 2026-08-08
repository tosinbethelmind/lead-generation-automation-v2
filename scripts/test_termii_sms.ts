import path from 'path';
import fs from 'fs';

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

async function testTermiiRoutes() {
  console.log('====================================================');
  console.log('📱 TESTING TERMII SENDER ID ROUTES FOR +2348022791227');
  console.log('====================================================');

  const apiKey = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  const phone = '2348022791227';
  const messageText = 'Hello Tosin, live SMS verification test from Bethelmind Lead Engine.';

  // Test sender IDs: 'Termii', 'Bethelmind', 'dnd', 'generic'
  const senderIdsToTest = ['Termii', 'Bethelmind', 'dnd', 'N-Alert'];

  for (const senderId of senderIdsToTest) {
    try {
      console.log(`Testing Sender ID: "${senderId}"...`);
      const payload = {
        to: phone,
        from: senderId,
        sms: messageText,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey
      };

      const response = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(`Sender ID "${senderId}" Response:`, data);
      if (data && (data.code === 'ok' || data.message_id)) {
        console.log(`🎉 SUCCESS WITH SENDER ID: "${senderId}"!`);
        break;
      }
    } catch (err: any) {
      console.error(`Sender ID "${senderId}" Error:`, err.message);
    }
  }
}

testTermiiRoutes();
