/**
 * @file scripts/sms_inbound_webhook_daemon.js
 * 
 * 🤖 AUTONOMOUS INBOUND SMS AUTO-RESPONDER DAEMON
 * 
 * Runs an HTTP server on port 3009 (accessible locally at http://192.168.0.117:3009/sms-inbound).
 * When your Android SMS Gateway app forwards incoming SMS to this webhook:
 * 1. Resolves the prospect's business name from leads_db.json.
 * 2. Generates the exact custom clarification response (<= 158 chars).
 * 3. Immediately dispatches the reply back through http://192.168.0.153:8082/message.
 * 4. Alerts your admin WhatsApp (+234 802 279 1227) with the lead details.
 */

const express = require('express');
const { replyDualChannel } = require('./reply_dual_channel');
const { cleanPhone } = require('./lib/searchphone_engine');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.SMS_WEBHOOK_PORT || 3009;

app.post('/sms-inbound', async (req, res) => {
  const payload = req.body || {};
  console.log('\n📩 [INBOUND SMS RECEIVED VIA WEBHOOK]:', payload);

  // Parse common SMS gateway webhook fields
  const sender = payload.from || payload.sender || payload.phone || payload.number;
  const message = payload.message || payload.text || payload.msg || payload.body || '';

  if (!sender) {
    return res.status(400).json({ error: 'Missing sender phone number' });
  }

  const cleanP = cleanPhone(sender);
  console.log(`📱 Processed Phone: ${cleanP} | Content: "${message}"`);

  // Auto-respond via BOTH SMS and WhatsApp
  try {
    await replyDualChannel(cleanP, message);
    return res.json({ success: true, repliedTo: cleanP });
  } catch (err) {
    console.error('❌ Dual auto-reply error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/status', (req, res) => {
  res.json({
    service: 'Bethelmind Inbound SMS Auto-Responder',
    status: 'online',
    port: PORT,
    webhookEndpoint: `http://192.168.0.117:${PORT}/sms-inbound`
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`📡 INBOUND SMS WEBHOOK LISTENER ACTIVE ON PORT ${PORT}`);
  console.log(`🔗 Webhook URL for Android Gateway App:`);
  console.log(`   http://192.168.0.117:${PORT}/sms-inbound`);
  console.log(`======================================================\n`);
});
