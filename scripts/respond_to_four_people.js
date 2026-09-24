/**
 * scripts/respond_to_four_people.js
 * 
 * Instantly triggers the 24/7 AI Closer to respond to prospects who messaged Admin WhatsApp (0802 279 1227).
 * Usage:
 *   node scripts/respond_to_four_people.js 08012345678 08087654321 09011122233 07044455566
 */

const http = require('http');

const phones = process.argv.slice(2).map(p => p.trim()).filter(Boolean);

if (phones.length === 0) {
  console.log('\nUsage: node scripts/respond_to_four_people.js <phone1> <phone2> <phone3> <phone4>');
  console.log('Example: node scripts/respond_to_four_people.js 08022791227 08030001000\n');
  process.exit(1);
}

console.log(`\n🚀 Triggering AI Closer for ${phones.length} prospect(s): ${phones.join(', ')}...`);

const payload = JSON.stringify({ phones });

const req = http.request({
  hostname: '127.0.0.1',
  port: 3007,
  path: '/reply-multiple-prospects',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('\n======================================================');
      console.log('✅ AI CLOSER DISPATCH COMPLETE');
      console.log('======================================================');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Response:', body);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Failed to reach WhatsApp Closer service on port 3007:', e.message);
  process.exit(1);
});

req.write(payload);
req.end();
