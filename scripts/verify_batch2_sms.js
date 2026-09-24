const fs = require('fs');

const d = JSON.parse(fs.readFileSync('local_db/sms_dispatches.json', 'utf8'));

// Batch 2 was the last 150 entries
const batch2 = d.slice(-150);

console.log('=== BATCH 2 VERIFICATION ===');
console.log('Total Leads in Batch 2:', batch2.length);

const delivered = batch2.filter(b => b.status === 'DELIVERED');
console.log('Batch 2 Leads Confirmed DELIVERED:', delivered.length);

const first = batch2[0];
const last = batch2[batch2.length - 1];

console.log('\nFirst Lead of Batch 2:');
console.log(`- Business: ${first.name} (${first.phone})`);
console.log(`- Time: ${new Date(first.timestamp).toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' })} WAT`);
console.log(`- Status: ${first.status} via ${first.gateway}`);

console.log('\nLast Lead of Batch 2:');
console.log(`- Business: ${last.name} (${last.phone})`);
console.log(`- Time: ${new Date(last.timestamp).toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' })} WAT`);
console.log(`- Status: ${last.status} via ${last.gateway}`);
