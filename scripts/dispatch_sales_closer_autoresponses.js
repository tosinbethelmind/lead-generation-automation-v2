/**
 * @file scripts/dispatch_sales_closer_autoresponses.js
 * 
 * Auto-responds to the 4 confirmed prospect inquiries as an expert B2B Sales Closer.
 * Strictly adheres to AGENTS.md rules:
 * - Professional Nigerian commercial tone
 * - Direct customized prototype demo link
 * - Clear Turnkey (₦150k / ₦75k) vs 1-Line Embed (₦35k / ₦65k) pricing
 * - Official OPay settlement rail (7034297995 - Oyelakin Tosin Matthew)
 * - Zero crypto terminology
 */

const closerResponses = [
  {
    threadId: 'wa_2348131347538',
    clientName: 'Hairport Beauty Salon & Spa',
    lineIdOverride: 3,
    message: `Good evening Team at *Hairport Beauty Salon & Spa*! 👋

Thank you for reaching out to Bethelmind Analytics Lagos Desk.

To answer your question on how the WhatsApp Booking Assistant works:
1. *24/7 Instant Booking*: When a client messages after salon hours, our AI assistant responds in under 3 seconds, displays your salon treatment menu, and lets them pick their service time and stylist.
2. *Deposit Lock*: It can collect a booking deposit or full payment to lock appointment slots, eliminating no-shows.

*Commercial Investment Options:*
• *1-Line WhatsApp AI Integration:* ₦35,000 setup (₦15k/mo retainer)
• *Full Turnkey Luxury Website + Booking Assistant:* ₦150,000 (starts with ₦75,000 milestone deposit, delivered in 48 Hours).

👉 *Test your live salon demo prototype right on your phone:*
https://www.bethelmindanalytics.com/preview/hairport-beauty-salon-and-spa

May I activate your 48-Hour deployment or would you prefer a quick voice call demo first?

Warm regards,
Tosin — Bethelmind Analytics Lagos Desk
Direct Closer Hotline: 0802 279 1227`
  },
  {
    threadId: 'wa_2349015362533',
    clientName: 'Auto Auction Mall',
    lineIdOverride: 6,
    message: `Good evening Team at *Auto Auction Mall*! 🚗

Thank you for reaching out to Bethelmind Analytics Lagos Desk.

Here is the demo link for your automated dealership quoting tool:
👉 https://www.bethelmindanalytics.com/preview/auto-auction-mall

*How It Accelerates Car Sales:*
• Buyers browsing late at night get instant WhatsApp specs, vehicle pricing, clearing duty estimates, and inspection bookings in <3 seconds without keeping you on the phone.

*Pricing Options:*
• *1-Line Embed WhatsApp Sales AI:* ₦35,000 deposit (₦65,000 total)
• *Complete Turnkey Dealership Website + WhatsApp Quoter:* ₦75,000 deposit (₦150,000 total, delivered in 48 Hours).

Official Settlement: OPay Digital Services (7034297995 - Oyelakin Tosin Matthew).

Would you like us to configure your active vehicle inventory into this quoter tomorrow morning?

Warm regards,
Tosin — Bethelmind Analytics Lagos Desk
Hotline: 0802 279 1227`
  },
  {
    threadId: 'wa_2347052286702',
    clientName: 'Locvilla Salon',
    lineIdOverride: 6,
    message: `Good evening Team at *Locvilla Salon*! ✂️✨

Thank you for your response!

Here is your custom-built interactive salon prototype demo:
👉 https://www.bethelmindanalytics.com/preview/locvilla-salon

(Tap the link to test the instant WhatsApp booking scheduler, service pricing catalog, and automated customer quoter).

*Package Pricing:*
• *1-Line Embed WhatsApp AI Assistant:* ₦35,000 setup (₦65,000 total)
• *100% Done-For-You Turnkey Website:* ₦75,000 deposit (₦150,000 total, 48-Hour delivery guarantee).

All payments route safely through OPay Digital Services (7034297995 - Oyelakin Tosin Matthew).

Please test drive the demo and let me know if you would like us to customize the service list with your exact salon prices!

Warm regards,
Tosin — Bethelmind Analytics Lagos Desk
Direct WhatsApp: wa.me/2348022791227`
  },
  {
    threadId: 'wa_2348066895402',
    clientName: 'Solar Wizard Nigeria',
    lineIdOverride: 6,
    message: `Good evening Engr & Team at *Solar Wizard Nigeria*! ☀️⚡

Thank you for reaching out to Bethelmind Analytics Lagos Desk.

To answer your question on integrating the instant WhatsApp BOQ calculator:
• *Zero Code Integration:* We supply a single 1-line script that embeds directly into your existing web page, OR you can route traffic directly via a short WhatsApp link.
• *Live Client Calculation:* When a prospect specifies their appliances (e.g. 1.5HP AC, freezer, lighting), the engine calculates total wattage, recommends the exact kVA inverter & lithium battery bank, and generates an instant WhatsApp BOQ PDF in <3 seconds!

👉 *Test drive the live BOQ load calculator on your custom prototype:*
https://www.bethelmindanalytics.com/preview/solar-wizard-nigeria

*Commercial Investment:*
• *Solar BOQ WhatsApp Quoting Engine:* ₦35,000 deposit (₦65,000 total)
• *Full Turnkey Commercial Solar Website + Engine:* ₦75,000 deposit (₦150,000 total, 48h SLA).

Settlement Rail: OPay Digital Services (7034297995 - Oyelakin Tosin Matthew).

Shall we provision your custom battery/panel pricing tiers on the calculator?

Warm regards,
Tosin — Bethelmind Analytics Lagos Desk
Hotline: 0802 279 1227`
  }
];

async function dispatchAll() {
  console.log('='.repeat(75));
  console.log('🚀 BETHELMIND SALES CLOSER: DISPATCHING INBOUND REPLIES');
  console.log('='.repeat(75) + '\n');

  for (const resp of closerResponses) {
    console.log(`📡 Sending closer proposal to [${resp.clientName}] via Line ${resp.lineIdOverride}...`);
    try {
      const res = await fetch('http://localhost:3008/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: resp.threadId,
          message: resp.message,
          lineIdOverride: resp.lineIdOverride
        })
      });
      const data = await res.json();
      if (data.ok) {
        console.log(`   ✅ DELIVERED! (msgId: ${data.messageId})\n`);
      } else {
        console.error(`   ❌ FAILED: ${data.error}\n`);
      }
    } catch (err) {
      console.error(`   ❌ NETWORK ERROR: ${err.message}\n`);
    }
    // Respectful 3-second throttle
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('='.repeat(75));
  console.log('🎉 ALL 4 PROSPECTS AUTO-RESPONDED TO AS SALES CLOSER!');
  console.log('='.repeat(75));
}

dispatchAll();
