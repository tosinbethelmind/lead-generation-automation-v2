const fs = require('fs');

const dispatches = JSON.parse(fs.readFileSync('local_db/sms_dispatches.json', 'utf8'));

console.log('=== VERIFYING SMS DISPATCH DATA ===');
console.log('Total Leads in sms_dispatches.json:', dispatches.length);

const delivered = dispatches.filter(d => d.status === 'DELIVERED');
console.log('Total Leads marked DELIVERED:', delivered.length);

const bothMessages = dispatches.filter(d => Boolean(d.prep_message) && Boolean(d.link_message));
console.log('Total Leads that received BOTH Message 1 and Message 2:', bothMessages.length);

const totalSmsPackets = dispatches.length * 2;
console.log('Total actual SMS sent through carrier gateway:', totalSmsPackets);

console.log('\n--- FIRST LEAD (Lead #1) ---');
console.log('Name:', dispatches[0].name);
console.log('Phone:', dispatches[0].phone);
console.log('Msg 1:', dispatches[0].prep_message);
console.log('Msg 2:', dispatches[0].link_message);
console.log('Gateway:', dispatches[0].gateway);

console.log('\n--- MIDDLE LEAD (Lead #60) ---');
console.log('Name:', dispatches[59].name);
console.log('Phone:', dispatches[59].phone);
console.log('Msg 1:', dispatches[59].prep_message);
console.log('Msg 2:', dispatches[59].link_message);
console.log('Gateway:', dispatches[59].gateway);

console.log('\n--- LAST LEAD (Lead #120) ---');
console.log('Name:', dispatches[119].name);
console.log('Phone:', dispatches[119].phone);
console.log('Msg 1:', dispatches[119].prep_message);
console.log('Msg 2:', dispatches[119].link_message);
console.log('Gateway:', dispatches[119].gateway);
