const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

async function testTermiiNumberSend() {
  const termiiApiKey = process.env.TERMII_API_KEY || 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  const targetPhone = '2348022791227';
  const text = `Bethelmind Test: SMS via Number API at ${new Date().toLocaleTimeString('en-NG')}. Moniepoint 6805375225.`;

  console.log(`Testing Termii /api/sms/number/send to ${targetPhone}...`);
  try {
    const res = await fetch('https://api.ng.termii.com/api/sms/number/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetPhone,
        sms: text,
        api_key: termiiApiKey
      })
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log('Termii Number Send Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testTermiiNumberSend();
