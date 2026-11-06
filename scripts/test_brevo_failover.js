const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { sendBrevoMessage } = require('../src/lib/email');

async function testBrevo() {
  console.log('Testing Brevo API delivery for Pillar 2 Mandates...');
  try {
    await sendBrevoMessage(
      'bethelmindrecruit@gmail.com',
      '[LASRERA Co-Brokerage Mandate] Test via Brevo API Failover',
      'This is an official test from Bethelmind Corporate Desk verifying Brevo API failover.',
      {}
    );
    console.log('✅ Brevo API delivered successfully!');
  } catch (err) {
    console.error('❌ Brevo API error:', err.message);
  }
}

testBrevo().catch(console.error);
