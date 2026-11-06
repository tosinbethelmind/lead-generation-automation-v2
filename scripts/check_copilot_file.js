const path = require('path');
const fs = require('fs');

const f = path.join(__dirname, '..', 'local_db', 'one_tap_copilot_tickets.json');
if (fs.existsSync(f)) {
  const t = JSON.parse(fs.readFileSync(f, 'utf8'));
  const all = Object.values(t);
  const approved = all.filter(x => x.status === 'APPROVED');
  console.log('Tickets in one_tap_copilot_tickets.json:', all.length);
  console.log('Approved tickets:', approved.length);
  approved.forEach((x, i) => console.log(`${i+1}. [${x.ticketId}] ${x.title} (${x.targetBusinessName})`));
} else {
  console.log('File does not exist');
}
