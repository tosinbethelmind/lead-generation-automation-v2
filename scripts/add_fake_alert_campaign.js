const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(enginePath, 'utf8');

const campaignEntry = `  'fake-alert-shield': {
    boardId: 24,
    boardName: 'Business',
    toolSlug: 'retail-catalog',
    titles: [
      'How Lagos Retailers & Supermarkets Stop Weekend Fake Alerts with Automated Webhook Reconciliation',
      'The Fake Alert Epidemic in Nigerian Retail: Why SMS/Email Alerts Fail and How Webhooks Solve It',
      'Stopping Fake Bank Transfers in Walk-in Boutiques: Moniepoint Webhook Verification Matrix'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return \`[b]The Fake Alert Epidemic in Nigerian Retail: Why SMS/Email Alerts Fail and How Direct Webhooks Protect Cashiers[/b]

To business owners, boutique managers, and supermarket operators across Nigeria,

Every weekend, Nigerian retail merchants lose hundreds of thousands of Naira to sophisticated fake bank transfer fraud. 

The two most common fraud schemes:
1. [b]Counterfeit Transfer Receipts:[/b] Fraudsters use mobile graphic apps to generate photorealistic bank debit slips bearing your exact business name.
2. [b]Spoofed SMS Sender IDs:[/b] Bulk SMS gateways are abused to send fake credit alerts impersonating your bank before the customer walks out of the store.

[quote]
[b]The Real Difference: Surface Alerts vs. Programmatic Ledger Reconciliation[/b]

• [b]SMS/Email Alerts:[/b] Highly delayed (especially on weekends) and trivially spoofed. Relying on cashier phones creates long customer queues.
• [b]Automated Webhook Ledger:[/b] The instant a customer transfers funds to your Moniepoint or OPay virtual account, a secure 256-bit server webhook fires directly to your cashier screen or printer in [b]under 2.5 seconds[/b].
• [b]Result:[/b] Goods are never handed over based on customer phone screenshots. Zero fake alerts, zero cashier arguments, and instantaneous digital WhatsApp receipts.
[/quote]

To test how an automated WhatsApp catalog and instant anti-fake alert reconciliation ledger works for retail stores, test the free interactive engine here:

[url=https://www.bethelmindanalytics.com/tools/retail-catalog][b]👉 Test The Free Retail WhatsApp Closer & Anti-Fake Alert Engine[/b][/url]

[b]Business Owners & Retailers:[/b] How does your shop currently handle bank transfer confirmations during peak weekend rush hours? Share your experience below!

[i]Updated: \${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]\`;
    }
  },\n`;

if (!code.includes("'fake-alert-shield':")) {
  code = code.replace("const CAMPAIGN_CATALOG = {", "const CAMPAIGN_CATALOG = {\n" + campaignEntry);
  fs.writeFileSync(enginePath, code, 'utf8');
  console.log('Successfully added fake-alert-shield to CAMPAIGN_CATALOG!');
} else {
  console.log('fake-alert-shield already in CAMPAIGN_CATALOG.');
}
