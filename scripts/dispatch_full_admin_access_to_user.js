const axios = require('axios');

async function dispatchFullAdminAccess() {
  const adminPhone = '2348022791227';
  const token = 'bethelmind_admin_2026';
  
  // 1-Click Magic Login Links (Instantly authenticate without typing password)
  const magicFullAdminUrl = `https://www.bethelmindanalytics.com/api/admin/login?token=${token}&redirect=/admin`;
  const magicMobileCenterUrl = `https://www.bethelmindanalytics.com/api/admin/login?token=${token}&redirect=/admin/mobile`;
  const magicCrmUrl = `https://www.bethelmindanalytics.com/api/admin/login?token=${token}&redirect=/admin/crm`;
  const magicApprovalsUrl = `https://www.bethelmindanalytics.com/api/admin/login?token=${token}&redirect=/admin/approvals`;

  console.log('========================================================================');
  console.log(`🚀 DISPATCHING FULL ADMIN ACCESS TO ADMIN: +${adminPhone}`);
  console.log('========================================================================\n');

  // ── 1. SEND VIA WHATSAPP (Instance 1) ─────────────────────────────────────
  const waUrl = 'http://169.58.182.92:8080/message/sendText/bethelmind_instance_1';
  const evolutionKey = 'evolution_bethelmind_secret_2026';

  const waMessage = 
`👑 *BETHELMIND DIGITAL SOLUTIONS — FULL ADMIN MOBILE ACCESS*

Good day Boss! Here is your 1-Tap Magic Login link to run the *FULL ADMIN DASHBOARD* directly on your phone (zero password typing needed):

👉 *1-TAP FULL ADMIN DASHBOARD:*
${magicFullAdminUrl}

📱 *1-TAP MOBILE SMARTPHONE COMMAND CENTER:*
${magicMobileCenterUrl}

🎯 *DIRECT DESK SHORTCUTS:*
• 📊 *Lead CRM Hub:* ${magicCrmUrl}
• ⚡ *AI Approvals & Outbox:* ${magicApprovalsUrl}

🔐 *Your Master Admin Token (if asked):*
\`${token}\`

━━━━━━━━━━━━━━━━━━━━━━
⚡ *What you have 100% full control over:*
1. *Scrapers & Lead Generation:* Inspect leads, start/pause scraper runs.
2. *Outreach Engines:* Control 600 daily emails, 300 webforms & 120 SMS.
3. *Inbound WhatsApp Leads:* View chats, test AI responses, jump into WhatsApp conversations.
4. *1-Tap Website Generator:* Claim sites for leads and bind custom domains (.com / .com.ng).
5. *Live Analytics:* See live views, visitor telemetry, and OPay/Moniepoint bank settlements.

💡 *Note:* If you are checking this on your WhatsApp, this message appears right in your *'Message Yourself'* / *'You'* chat on WhatsApp!`;

  try {
    console.log('[1/2] Sending 1-Tap Magic Admin Links to WhatsApp (+234 802 279 1227)...');
    const waRes = await axios.post(waUrl, {
      number: adminPhone,
      text: waMessage
    }, {
      headers: { apikey: evolutionKey },
      timeout: 10000
    });
    console.log('✅ WhatsApp Message Dispatched Successfully! ID:', waRes.data?.key?.id || waRes.data?.messageId || 'OK');
  } catch (waErr) {
    console.error('⚠️ WhatsApp Dispatch Error:', waErr.response?.data || waErr.message);
  }

  // ── 2. SEND VIA TERMII SMS (Guaranteed Notification Ring on Phone) ─────────
  const termiiApiKey = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  const smsText = `BETHELMIND FULL ADMIN: Tap to open your full admin on phone (zero password needed): ${magicMobileCenterUrl}`;

  try {
    console.log('\n[2/2] Sending Instant SMS Alert via Termii Cloud to +234 802 279 1227...');
    const smsRes = await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: `+${adminPhone}`,
      from: 'N-Alert',
      sms: smsText.slice(0, 158),
      type: 'plain',
      channel: 'generic',
      api_key: termiiApiKey
    }, { timeout: 8000 });
    console.log('✅ Termii SMS Dispatched Successfully!', smsRes.data);
  } catch (smsErr) {
    console.error('⚠️ Termii SMS Error:', smsErr.response?.data || smsErr.message);
    // Fallback to Termii number endpoint
    try {
      const numRes = await axios.post('https://api.ng.termii.com/api/sms/number/send', {
        to: `+${adminPhone}`,
        sms: smsText.slice(0, 158),
        api_key: termiiApiKey
      }, { timeout: 8000 });
      console.log('✅ Termii Number SMS Fallback Dispatched!', numRes.data);
    } catch (e) {
      console.error('⚠️ Termii Fallback also failed:', e.response?.data || e.message);
    }
  }

  console.log('\n========================================================================');
  console.log('🎉 DISPATCH COMPLETE!');
  console.log('========================================================================');
}

dispatchFullAdminAccess();
