async function testValidation() {
  const vpsUrl = 'http://169.58.182.92:8080/send';
  const apiKey = 'evolution_bethelmind_secret_2026';

  console.log('--- Test 1: Sending to non-WhatsApp number (08021061457) ---');
  try {
    const res1 = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      body: JSON.stringify({
        phone: '08021061457',
        message: 'Test message',
        isColdOutreach: false,
        lineId: 1
      })
    });
    console.log('HTTP Status 1:', res1.status);
    console.log('Body 1:', await res1.json());
  } catch (err) {
    console.error('Error 1:', err.message);
  }

  console.log('\n--- Test 2: Sending to verified WhatsApp number (07052090092) ---');
  try {
    const res2 = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      body: JSON.stringify({
        phone: '07052090092',
        message: 'Good day, Bethelmind Digital Solutions (CAC Certified: Reg 9912717) - Direct Inquiry test.',
        isColdOutreach: false,
        lineId: 1
      })
    });
    console.log('HTTP Status 2:', res2.status);
    console.log('Body 2:', await res2.json());
  } catch (err) {
    console.error('Error 2:', err.message);
  }
}

testValidation().catch(console.error);
