const fs = require('fs');
const accs = JSON.parse(fs.readFileSync('local_db/nairaland_accounts.json', 'utf8'));

console.log('=== MULTI-ACCOUNT FLEET READINESS ===');
accs.accounts.forEach(a => {
  const hours = a.lastPostedAt ? (Date.now() - new Date(a.lastPostedAt).getTime()) / (1000 * 3600) : 999;
  const ready = hours >= (a.cooldownHours || 12);
  console.log(a.username + ' (ID: ' + a.memberId + '): ' + hours.toFixed(1) + 'h since last post -> ' + (ready ? 'READY 🟢' : 'COOLING ⏳'));
});
