import { handleReturningClientInquiry } from '../src/lib/monetization/returningClientEngine';

async function testReturningFlow() {
  console.log('Testing returning VIP client flow for Jacio International...');

  const incomingText = 'Hello Tosin, we have another China supplier batch for $50,000 USD today. What is the rate?';
  const result = handleReturningClientInquiry('2348185587222', incomingText);

  console.log('\n--- AUTO-REPLY GENERATED FOR CLIENT ---');
  console.log(result.vipResponse);

  console.log('\n--- HIGH-PRIORITY ALERT SENT TO ADMIN ---');
  console.log(result.adminNotification);

  // Send the live demonstration alert to admin WhatsApp
  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '2348022791227', message: result.adminNotification, lineId: 2 })
  });

  console.log('\n✅ Repeat VIP alert successfully delivered to Admin WhatsApp!');
}

testReturningFlow().catch(console.error);
