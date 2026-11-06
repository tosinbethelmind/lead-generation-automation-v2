/**
 * @file scripts/send_closing_messages.js
 * Dispatches formal commercial invoices & SLA contracts to the warm prospects via Line 1 (0802 279 1227)
 */

const http = require('http');

const PROPOSALS = [
  {
    jid: '6825525166330@lid',
    label: 'Lead 1 (Waybill Tracker & Delivery SMS)',
    message: `Salute Boss at *Speedway Logistics*! 🤝 Fantastic decision to move forward.

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
    jid: '62251289604110@lid',
    label: 'Lead 2 (Auxano Solar)',
    message: `Salute Boss at *Auxano Solar*! 🤝 Fantastic decision to move forward.

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

function sendOne(p) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      phone: p.jid,
      message: p.message,
      isColdOutreach: false,
      lineId: 1
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 8080,
      path: '/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'apikey': 'evolution_bethelmind_secret_2026'
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        console.log(`[Sent] ${p.label} (${p.jid}) -> HTTP ${res.statusCode}: ${data}`);
        resolve();
      });
    });

    req.on('error', err => {
      console.error(`[Error] ${p.label}:`, err.message);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Starting closing message dispatch via Evolution Line 1...');
  for (const p of PROPOSALS) {
    await sendOne(p);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('Dispatch complete.');
}

run();
