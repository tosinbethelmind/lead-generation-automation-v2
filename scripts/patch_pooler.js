const fs = require('fs');
const filePath = 'src/lib/email/multiSmtpPooler.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Change pool: true to pool: false for 465
code = code.replace(/pool: true,\s*maxConnections: 5,\s*maxMessages: 100,/g, 'pool: false,');

// Increase Brevo axios timeout to 15000
code = code.replace('timeout: 6000', 'timeout: 15000');

// Enhance error logging for Brevo
code = code.replace(
  "console.warn(`⚠️ [Brevo Circuit-Breaker] Brevo is timing out or quota exhausted. Resting Brevo for 30 minutes.`);",
  "console.warn(`⚠️ [Brevo Warning] ${err.response?.status || err.code}: ${JSON.stringify(err.response?.data || err.message)}`);\n              this.stats.brevo.restingUntil = now + 15 * 60 * 1000;"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated multiSmtpPooler.ts successfully');
