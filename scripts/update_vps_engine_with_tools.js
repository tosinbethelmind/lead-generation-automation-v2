const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    // Read current engine file from VPS
    let engineData = '';
    const readStream = sftp.createReadStream('/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js');
    readStream.on('data', d => engineData += d.toString());
    readStream.on('end', () => {
      console.log('Read engineData from VPS, length:', engineData.length);

      // Check if tokunbo-vin-checker already in catalog
      if (!engineData.includes("'tokunbo-vin-checker':")) {
        const vinCampaignCode = `
  'tokunbo-vin-checker': {
    boardId: 78,
    boardName: 'Car Talk',
    toolSlug: 'vin',
    titles: [
      'How to Check Tokunbo VIN Free & Detect Auction Water-Damage Before Wiring Millions in Lagos',
      'Lagos Auto Buyers Guide: 17-Digit VIN Decoders, Copart Salvage Traps & NCS Customs Duty (2026)',
      'Before You Buy That Tokunbo Lexus RX350 or Corolla in Lagos: Free Salvage & VIN Decoder'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return \`[b]How to Check Tokunbo VIN Free & Detect Auction Water-Damage Before Wiring Millions in Lagos[/b]

To all car buyers, auto enthusiasts, and Tokunbo car dealers on Nairaland,

With standard Tokunbo vehicles (Lexus RX350, Toyota Corolla, Camry, Honda Accord) currently trading between [b]₦14,000,000 to ₦26,000,000[/b] in Lagos, buying a bad car with hidden salvage history is an expensive mistake.

Over 35% of auction vehicles shipped through Tin Can and PTML ports have hidden issues:
[quote]
[b]The 3 Big Traps in Nigerian Tokunbo Dealerships:[/b]
1. [b]Flood & Saltwater Submersion:[/b] Hurricane flood-damaged cars from Texas/Florida auctioned as clean titles. Corroded wiring harnesses cause electrical fires within 3 months.
2. [b]Odometer Rollback:[/b] Mileage wound back from 180,000 miles to 65,000 miles before container loading.
3. [b]Stolen Catalytic Converters:[/b] Exhaust components hollowed out before port discharge, triggering immediate check engine lights.
[/quote]

[b]How to Verify Any 17-Digit VIN Free Before Leaving Home:[/b]
Instead of paying roadside mechanics to guess, you can decode the complete factory specs, NHTSA recalls, and auction history free on your phone:

[url=https://www.bethelmindanalytics.com/vin][b]🚗 Test The Free 17-Digit Tokunbo VIN & Salvage Checker[/b][/url]
[url=https://t.me/BethelmindAsistantBot][b]🤖 Run on 24/7 Telegram Master Bot: @BethelmindAsistantBot (Send /vin)[/b][/url]

[quote]
[b]💳 Need an Official Stamped NCS Valuation & VIN Passport Certificate?[/b]
Generate an instant official PDF report for vehicle registration, customs clearance, or buyer confidence (₦2,500 via Card/OPay):
👉 [url=https://selar.com/showlove/bethelmind?amount=2500][b]Order Official Stamped VIN Certificate (₦2,500 via Selar)[/b][/url]
[/quote]

[quote]
[b]⚡ Enterprise Notice for Lagos Auto Dealers & Clearing Agents:[/b]
Deploy this exact live 17-digit VIN Customs Duty & Salvage History Checker on your dealership website and WhatsApp profile:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Turnkey Custom Domain Suite):[/b] ₦75,000 Deposit (₦150,000 Total) — Dedicated .com.ng domain + Google SEO.
Settlement: Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Car Buyers & Dealers:[/b] Drop your 17-digit VIN or vehicle model below for instant audit specs!

[i]Updated: \${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]\`;
    }
  },
`;
        engineData = engineData.replace("const CAMPAIGN_CATALOG = {", "const CAMPAIGN_CATALOG = {" + vinCampaignCode);
        console.log('Added tokunbo-vin-checker to CAMPAIGN_CATALOG');
      }

      // Check if BOARDS contains vin and arbitrage
      if (!engineData.includes("vin: {")) {
        engineData = engineData.replace(
          "const BOARDS = {",
          "const BOARDS = {\n  vin: { id: 78, name: 'Car Talk', slug: 'tokunbo-vin-checker' },\n  arbitrage: { id: 24, name: 'Business', slug: 'p2p-arbitrage' },"
        );
        console.log('Added vin and arbitrage to BOARDS');
      }

      // Upload updated engineData
      const writeStream = sftp.createWriteStream('/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js');
      writeStream.write(engineData);
      writeStream.end(() => {
        console.log('Successfully written updated nairaland_autonomous_engine.js to VPS');
        conn.end();
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
