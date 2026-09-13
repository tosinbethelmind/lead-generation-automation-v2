const fs = require('fs');

async function testSend() {
  const payload = {
    phone: '2348022791227',
    message: '🔔 *[BETHELMIND LIVE TEST]*\n\nHello! Because your phone (+234 802 279 1227) is the active sender, WhatsApp places messages sent to yourself in your "You (Message yourself)" chat at the top of your chat list!\n\nHere is Jacio International:\n👉 https://wa.me/2348185587222?text=Good%20day%20Jacio%20team',
    lineId: 1
  };

  const res = await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log('SEND_RESULT:', JSON.stringify(data));
}

testSend().catch(console.error);
