const axios = require('axios');

async function sendMobileAdminLink() {
  const url = 'http://169.58.182.92:8080/message/sendText/bethelmind_instance_1';
  const apiKey = 'evolution_bethelmind_secret_2026';

  const msg = 
`📱 *BETHELMIND LAGOS DESK — SMARTPHONE CONTROL CENTER*

Good day Boss! Here is your private direct link to control the entire lead generation, customer outreach, and website auto-generation engine directly from your phone:

👉 *Open Command Center:*
https://www.bethelmindanalytics.com/admin/mobile

⚡ *Everything you can do directly on your smartphone:*
1. 📡 *Outreach Radar:* Track daily 600 Emails, 300 Webforms, 120 SMS & 7 WhatsApp lines in real-time.
2. 🟢 *1-Tap Lead Claim:* Enter any business name & phone to generate their official mobile website and instant WhatsApp closing pitch.
3. 💬 *Inbound WhatsApp Closer Desk:* View prospect replies, trigger AI closer responses, or take over chat with 1 tap.
4. 🌐 *Custom Domain Onboarding:* Connect any client's .com / .com.ng domain in seconds.
5. 🤖 *AI Objections Tester:* Test sales objections in Nigerian Pidgin & commercial English before sending to leads.

💡 *Pro-Tip:* Open the link in Chrome (Android) or Safari (iPhone), tap 'Add to Home Screen' to use it like a native mobile app!`;

  try {
    console.log('Sending mobile admin command center link to WhatsApp: 2348022791227 ...');
    const res = await axios.post(url, {
      number: '2348022791227',
      text: msg
    }, {
      headers: { apikey: apiKey },
      timeout: 10000
    });
    console.log('✅ WhatsApp message dispatched successfully!');
    console.log('Response:', res.data);
  } catch (err) {
    console.error('❌ Failed to dispatch WhatsApp message:', err.response ? err.response.data : err.message);
  }
}

sendMobileAdminLink();
