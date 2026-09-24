const axios = require('axios');

async function testGateway() {
  const url = 'http://192.168.0.121:8082/message';
  const token = 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
  
  console.log('Sending test SMS to Admin Phone via Gateway at:', url);
  try {
    const res = await axios.post(url, {
      to: '+2348022791227',
      message: 'Hello Tosin! Live Android GSM SMS Gateway verified for Bethelmind Analytics.'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      timeout: 5000
    });
    console.log('✅ SMS GATEWAY RESPONSE:', res.data);
  } catch (err) {
    console.error('❌ SMS Gateway Error:', err.response ? err.response.data : err.message);
  }
}

testGateway();
