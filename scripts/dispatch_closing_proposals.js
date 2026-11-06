const { Client } = require('ssh2');

const VPS_CONFIG = {
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000,
  keepaliveInterval: 10000
};

const PROPOSALS = [
  {
    targetJid: '6825525166330@lid',
    label: 'Lead 1 (Waybill Tracker & Delivery SMS / Estate)',
    text: `Salute Boss at *Speedway Logistics*! 🤝 Fantastic decision to move forward.

We have prepared your Official Commercial Proforma Invoice & 48-Hour SLA Deployment Agreement:
📄 *Invoice Ref:* *INV-BM-SPEE-2549-2026*
🔗 *Live Agreement & Itemized Scope:* https://www.bethelmindanalytics.com/invoice/INV-BM-SPEE-2549-2026

📦 *Package:* *Interstate Dispatch Waybill Tracker & 1-Tap Delivery SMS System*
💰 *Standard Setup:* *₦70,000*
⚡ *50% Commitment Deposit:* *₦35,000* (or *₦25,000/month* Pay-Small-Small)
*(Balance of ₦35,000 is payable ONLY after your system is live and verified on Google!)*
⏱️ *Guaranteed Go-Live Date:* *8 Nov 2026* (48-Hour Legal SLA)

🏛️ *Official Corporate Settlement Account:*
• *Bank:* Moniepoint Microfinance Bank
• *Account Number:* *6805375225*
• *Account Name:* Bethelmind Digital Solutions
• *CAC Registration:* Reg: 9912717

Drop your transfer receipt here once sent to lock in your live deployment slot today!`
  },
  {
    targetJid: '62251289604110@lid',
    label: 'Lead 2 (Auxano Solar)',
    text: `Salute Boss at *Auxano Solar*! 🤝 Fantastic decision to move forward.

We have prepared your Official Commercial Proforma Invoice & 48-Hour SLA Deployment Agreement:
📄 *Invoice Ref:* *INV-BM-AUXA-4110-2026*
🔗 *Live Agreement & Itemized Scope:* https://www.bethelmindanalytics.com/invoice/INV-BM-AUXA-4110-2026

📦 *Package:* *Solar BOQ Sizing Calculator & Instant WhatsApp Quotation Engine*
💰 *Standard Setup:* *₦75,000*
⚡ *50% Commitment Deposit:* *₦35,000* (or *₦25,000/month* Pay-Small-Small)
*(Balance of ₦40,000 is payable ONLY after your system is live and verified on Google!)*
⏱️ *Guaranteed Go-Live Date:* *8 Nov 2026* (48-Hour Legal SLA)

🏛️ *Official Corporate Settlement Account:*
• *Bank:* Moniepoint Microfinance Bank
• *Account Number:* *6805375225*
• *Account Name:* Bethelmind Digital Solutions
• *CAC Registration:* Reg: 9912717

Drop your transfer receipt here once sent to lock in your live deployment slot today!`
  }
];

function runRemoteCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', d => out += d);
      stream.stderr.on('data', d => out += d);
      stream.on('close', () => resolve(out));
    });
  });
}

async function main() {
  console.log('🚀 Connecting to Contabo VPS (169.58.182.92) to dispatch closing proposals...');
  const conn = new Client();

  conn.on('error', (err) => {
    console.error('SSH Connection error:', err.message);
  });

  conn.on('ready', async () => {
    console.log('✅ SSH Connection established.');

    for (const p of PROPOSALS) {
      console.log(`\n📤 Dispatching to ${p.label} (${p.targetJid})...`);
      
      const remoteJs = `
        const http = require('http');
        const req = http.request({
          hostname: '127.0.0.1',
          port: 8080,
          path: '/send',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'evolution_bethelmind_secret_2026'
          }
        }, res => {
          let data = '';
          res.on('data', d => data += d);
          res.on('end', () => console.log('RESPONSE:', res.statusCode, data));
        });
        req.on('error', e => console.error('ERROR:', e.message));
        req.write(JSON.stringify({
          phone: '${p.targetJid}',
          message: ${JSON.stringify(p.text)},
          isColdOutreach: false,
          lineId: 1
        }));
        req.end();
      `;

      const escapedCmd = `node -e ${JSON.stringify(remoteJs)}`;
      const result = await runRemoteCommand(conn, escapedCmd);
      console.log('Result:', result.trim());
      await new Promise(r => setTimeout(r, 2000));
    }

    conn.end();
    console.log('\n🏁 Finished dispatching closing proposals.');
  }).connect(VPS_CONFIG);
}

main().catch(console.error);
