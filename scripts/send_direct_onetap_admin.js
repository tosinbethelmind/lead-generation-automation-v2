const axios = require('axios');

async function sendDirectOneTapLink() {
  const url = 'http://169.58.182.92:8080/message/sendText/bethelmind_instance_1';
  const apiKey = 'evolution_bethelmind_secret_2026';

  const msg = 
`*1-TAP FULL ADMIN ACCESS (ZERO PASSWORD REQUIRED)*

Tap this link on your phone to open the Full Admin Dashboard with full super-admin access:

👉 *FULL ADMIN DASHBOARD:*
https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin

👉 *MOBILE COMMAND CENTER:*
https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile

👉 *LEAD CRM & OUTREACH:*
https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/crm

(This link automatically logs you in as Super Admin in 1 tap!)`;

  try {
    const res = await axios.post(url, {
      number: '2348022791227',
      text: msg
    }, {
      headers: { apikey: apiKey },
      timeout: 10000
    });
    console.log('✅ Short 1-Tap Link Dispatched! ID:', res.data?.key?.id || 'OK');
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}

sendDirectOneTapLink();
