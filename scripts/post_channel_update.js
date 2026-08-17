/**
 * @file scripts/post_channel_update.js
 * CLI & Automated Runner for WhatsApp Channel Updates & Offers.
 * 
 * Usage:
 *   node scripts/post_channel_update.js
 *   node scripts/post_channel_update.js --category=offer
 *   node scripts/post_channel_update.js --category=case_study
 */

const http = require('http');
const https = require('https');

const args = process.argv.slice(2);
let category = null;

for (const arg of args) {
  if (arg.startsWith('--category=')) {
    category = arg.split('=')[1];
  }
}

const PREBUILT_UPDATES = {
  offer: `🚀 *Complete ₦185k Business Growth Portal Setup (3 Slots Left This Week)*

Is your business still losing sales because of manual WhatsApp orders? 🛑

With our *All-In-One Bethelmind Business Portal*, you get:
✅ Custom-designed high-converting website
✅ Automated Virtual Bank Transfer checkout (Moniepoint/OPay)
✅ 24/7 AI WhatsApp Auto-Responder for inquiries
✅ Integrated Google Maps SEO Ranking Engine

*Setup Fee:* ₦185,000 (Normally ₦350,000)
⚡ *Only 3 business slots available this week.*

👉 Claim your portal & preview your custom mockup now:
🔗 https://www.bethelmindanalytics.com/#pricing

───────────────────
📢 *Stay updated with daily growth hacks:*
👉 Follow our channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l
✍️ _Bethelmind Analytics & Strategy_`,

  case_study: `📊 *Case Study: How an SME Generated ₦4.2M in 30 Days via Automated Outreach*

Here is the exact breakdown of how we automated client acquisition for a B2B contractor in Lekki, Lagos:

1️⃣ *Targeted Scraping:* Harvested 250 verified high-intent property developers and facility managers.
2️⃣ *2-Step Permission WhatsApp Outreach:* Started with a friendly inquiry — ZERO spam, zero bans.
3️⃣ *Interactive Pricing Calculator:* Sent leads an instant customized quote link directly on their mobile phone.
4️⃣ *Outcome:* 18 hot qualified inquiries booked, resulting in 4 closed enterprise contracts worth ₦4.2M.

💡 *Takeaway:* You don't need a huge marketing team — you just need an automated pipeline that never sleeps.

📲 Want us to build this exact lead engine for your business? Chat with our CEO:
🔗 https://wa.me/2348022791227

───────────────────
📢 *Stay updated with daily growth hacks:*
👉 Follow our channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l
✍️ _Bethelmind Analytics & Strategy_`,

  growth_tip: `💡 *Quick Tech Tip: Why Slow Websites Kill Nigerian Mobile Sales*

Did you know? ⚡
Over *78% of internet traffic in Nigeria* comes from mobile devices on 3G/4G networks.

If your website takes more than *3.5 seconds* to load:
❌ 53% of mobile visitors immediately click back
❌ Google penalizes your local search ranking
❌ You waste ad spend on clicks that never see your offer

*How to fix it:*
1. Compress all hero images to modern WebP format
2. Remove bloated plugins & heavy scripts
3. Use a high-speed CDN (Content Delivery Network)

🌐 Test your current speed & request a free audit here:
🔗 https://www.bethelmindanalytics.com

───────────────────
📢 *Stay updated with daily growth hacks:*
👉 Follow our channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l
✍️ _Bethelmind Analytics & Strategy_`
};

function run() {
  const selectedKey = category && PREBUILT_UPDATES[category] ? category : 'offer';
  const content = PREBUILT_UPDATES[selectedKey];
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(content)}`;

  console.log('\n======================================================');
  console.log('📢 BETHELMIND WHATSAPP CHANNEL BROADCAST ENGINE');
  console.log('======================================================');
  console.log(`Channel Target: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l`);
  console.log(`Theme: ${selectedKey.toUpperCase()}\n`);
  console.log('--- [BROADCAST CONTENT] ---');
  console.log(content);
  console.log('\n---------------------------');
  console.log('\n⚡ 1-Click Direct WhatsApp Share / Post Link:');
  console.log(shareUrl);
  console.log('\n======================================================\n');
}

run();
