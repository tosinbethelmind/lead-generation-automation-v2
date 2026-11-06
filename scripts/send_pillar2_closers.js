const http = require('http');

const P2_CLOSING_DISPATCHES = [
  {
    jid: '6825525166330@lid',
    label: 'Pillar 2 Prospect 1 (Amen Estate / Lekki Mandate)',
    message: `Good day Management at *Amen Estate / Lekki Mandate Partner* 🤝

We are following up regarding our diaspora buyer allocation for:
🏛️ *Mandate Listing:* 7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)

Here is our exact institutional closing procedure to proceed immediately:

1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*
Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):
👉 https://www.bethelmindanalytics.com/mandate
*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*

2️⃣ *Accompanied Physical Inspection:*
Our buyer's legal counsel (Barrister Babatunde Alabi & family liaison) is prepared for accompanied physical inspection within 24 to 48 hours of your electronic endorsement.

3️⃣ *Direct Desk Counter-Signature & Call:*
Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and align with your team on gate access & inspection timing.

🏛️ *Bethelmind Corporate & Diaspora Property Desk*
• CAC Certified Nigerian Enterprise (Reg: 9912717)
• Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
• Desk Closer Hotline: +234 802 279 1227

What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?`
  },
  {
    jid: '62251289604110@lid',
    label: 'Pillar 2 Prospect 2 (Lekki Phase 1 Luxury Mandate)',
    message: `Good day Management at *Lekki Phase 1 Luxury Mandate Partner* 🤝

We received your confirmation regarding your interest in our diaspora buyer co-brokerage mandate for:
🏛️ *Mandate Listing:* 5bdrm Luxury Smart Duplex with Private Pool in Lekki Phase 1 (₦1.1B)

Here is our exact institutional closing procedure to proceed immediately:

1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*
Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):
👉 https://www.bethelmindanalytics.com/mandate
*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*

2️⃣ *Accompanied Physical Inspection:*
Our buyer's legal counsel (Barrister Babatunde Alabi & family liaison) is prepared for accompanied physical inspection within 24 to 48 hours of your electronic endorsement.

3️⃣ *Direct Desk Counter-Signature & Call:*
Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and align with your team on gate access & inspection timing.

🏛️ *Bethelmind Corporate & Diaspora Property Desk*
• CAC Certified Nigerian Enterprise (Reg: 9912717)
• Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
• Desk Closer Hotline: +234 802 279 1227

What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?`
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
        console.log(`[Pillar 2 Dispatched] ${p.label} (${p.jid}) -> HTTP ${res.statusCode}: ${data}`);
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
  console.log('Dispatching Pillar 2 Senior Closer Joint Inspection Memorandum (JIM) packages via Line 1...');
  for (const p of P2_CLOSING_DISPATCHES) {
    await sendOne(p);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('Pillar 2 dispatch complete.');
}

run();
