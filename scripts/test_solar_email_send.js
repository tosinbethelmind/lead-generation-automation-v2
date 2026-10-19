const { MultiSmtpPooler } = require('./multi_smtp_pooler');
const path = require('path');
const fs = require('fs');

async function testSolarEmail() {
  console.log('Testing Solar B2B Executive Email delivery with voice note attachment...');
  const pooler = new MultiSmtpPooler();

  const testLead = {
    name: 'Wavetra Energy Limited',
    business_name: 'Wavetra Energy Limited',
    category: 'Solar Energy Enterprise',
    sector: 'Solar Energy Enterprise',
    area: 'Ikeja',
    city: 'Lagos',
    email: 'bethelmindrecruit@gmail.com', // Test recipient
    id: 'wavetra-energy'
  };

  const mp3Path = path.join(__dirname, '../public/solar_pitch_voice_ng_light.mp3');
  console.log('Voice note path:', mp3Path, 'Exists:', fs.existsSync(mp3Path));

  const result = await pooler.dispatch(testLead);
  console.log('\nEmail Dispatch Result:', result);
}

testSolarEmail().catch(console.error);
