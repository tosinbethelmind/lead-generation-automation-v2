/**
 * scripts/test_all_channels_outreach.js
 * Dispatches test outreach across SMS, WhatsApp, and Email to user's channels.
 */

const BASE_URL = process.env.TEST_URL || 'https://www.bethelmindanalytics.com';
const TOKEN = 'bethelmind_admin_2026';

async function dispatchAllChannels() {
  console.log('================================================================');
  console.log('🚀 DISPATCHING MULTI-CHANNEL TEST (SMS, WhatsApp, Email)');
  console.log(`🌐 Target Endpoint: ${BASE_URL}/api/admin/command-copilot`);
  console.log('================================================================\n');

  try {
    const prompt = 'Send test SMS, WhatsApp, and Email outreach with interactive prototype link to my phone 08022791227 and email tosin@bethelmindanalytics.com';

    console.log(`💬 Executing Command: "${prompt}"...`);

    const res = await fetch(`${BASE_URL}/api/admin/command-copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        command: prompt,
        token: TOKEN
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      console.log('\n✅ Dispatched Successfully!');
      console.log(`📝 Summary: ${data.summary}`);
      console.log(`\n📋 Channel Execution Details:`);
      console.log(JSON.stringify(data.results, null, 2));
      console.log(`\n🔗 Prototype URL: ${data.previewUrl}`);
      console.log(`\n📄 Output:\n${data.output}`);
    } else {
      console.error('\n❌ Dispatch Failed:', data.error || data);
    }
  } catch (err) {
    console.error('❌ Exception during dispatch:', err.message);
  }
}

dispatchAllChannels();
