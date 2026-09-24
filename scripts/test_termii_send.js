async function testSms() {
  const apiKey = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  const payload = {
    to: '2348022791227',
    from: 'N-Alert',
    sms: 'Good day! This is a live SMS delivery test from Bethelmind Analytics Lagos Desk.',
    type: 'plain',
    channel: 'generic',
    api_key: apiKey
  };
  try {
    const res = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Termii Send Result:', data);
  } catch (e) {
    console.error('Termii send error:', e.message);
  }
}

testSms();
