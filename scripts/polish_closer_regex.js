const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'lib/closer_engine.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Normalize curly quotes in msg
code = code.replace(
  "const msg = rawMsg.toLowerCase();",
  "const msg = rawMsg.replace(/[\\u2018\\u2019]/g, \"'\").replace(/[\\u201C\\u201D]/g, '\"').toLowerCase().trim();"
);

// 2. Broaden explicit interest regex
const oldRegex = `  const isExplicitInterest = 
    /\\b(we are interested|i am interested|i'm interested|we're interested|very interested|ready to start|want to start|ready to launch|send invoice|how to pay|how do i pay|payment details|account details|account number|send account|let's do this|let's start|i want to pay|send the account|where do i pay|how much deposit)\\b/i.test(msg) ||
    (/^interested\\b/i.test(msg) && msg.length < 35);`;

const newRegex = `  const isExplicitInterest = 
    /\\b(we are interested|i am interested|i'm interested|we're interested|very interested|interested in|ready to start|want to start|ready to launch|send invoice|how to pay|how do i pay|payment details|account details|account number|send account|let's do this|let's start|i want to pay|send the account|where do i pay|how much deposit)\\b/i.test(msg) ||
    (/\\binterested\\b/i.test(msg) && msg.length < 120);`;

code = code.replace(oldRegex, newRegex);

// 3. Update logistics sector handler
const oldLogisticsText = `Salute Boss at *\${name}*! 📦
Stop answering "how much is delivery to Lekki/Ikeja" all day!
Your portal gives customers instant delivery fee quotes and 1-tap WhatsApp pickup requests.

👉 Test your delivery site: \${previewUrl}

Reply *1* to activate under our 50% promo (*₦35,000 deposit*)!`;

const newLogisticsText = `Salute Boss at *\${name}*! 📦
Stop answering "how much is delivery to Lekki/Ikeja" all day!
Your portal gives customers instant delivery fee quotes and 1-tap WhatsApp pickup requests.

👉 Test your delivery site: \${previewUrl}

📄 *Official Proforma Invoice & 48-Hour SLA:* \${(createOrGetCommercialInvoice({ clientName: name, clientPhone: leadData.phone || resolved.phone, category: 'Logistics', packageType: 'LOGISTICS_WAYBILL_PORTAL' })).invoiceUrl}
• Standard Total: *₦70,000* | *Deposit to Launch Today: ₦35,000* (or *₦25,000/mo* Pay-Small-Small)
• *Bank:* Moniepoint MFB • *6805375225* • *Bethelmind Digital Solutions* (CAC Reg: 9912717)

Drop your transfer receipt here to lock in your live deployment within 48 hours!`;

code = code.replace(oldLogisticsText, newLogisticsText);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully polished closer_engine.js quote normalization and interest triggers!');
