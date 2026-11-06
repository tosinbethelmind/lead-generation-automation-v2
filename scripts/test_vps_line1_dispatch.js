const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testDirectSend() {
  const vpsUrl = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8080/send';
  const apiKey = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';
  
  console.log('Sending probe with targetLine: 1 and isColdOutreach: false ...');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      body: JSON.stringify({
        phone: '2348022791227',
        message: '🧪 Bethelmind WhatsApp Connectivity Probe: System status check.',
        isColdOutreach: false,
        lineId: 1
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    console.log('HTTP Status:', res.status, res.statusText);
    const data = await res.json().catch(() => ({}));
    console.log('Server Response:', data);
  } catch (err) {
    console.log('Probe failed:', err.message);
  }
}

testDirectSend();
