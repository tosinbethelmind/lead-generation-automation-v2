const fs = require('fs');

async function sendCorrectedFouani() {
  const adminPhone = '2348022791227';

  const fouaniMsg = `🏢 *[CORRECTED DEAL: FOUANI IKEJA]*
━━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* 17-19 Allen Avenue, Ikeja, Lagos
💼 *Sector:* Commercial Electronics & Appliances Importers
📦 *Order Volume:* $50,000 USD (Single Container Clearance)
💵 *Commercial Rate:* ₦1,520 / USD (Same-Day Window)
💰 *YOUR SPREAD PROFIT:* *+₦1,250,000 NGN*
📞 *Target Phone:* \`0810 754 0008\`

🟢 *WHATSAPP (1-TAP):*
👉 https://wa.me/2348107540008?text=Good%20day%20Fouani%20Ikeja%20procurement%20team!%20Bethelmind%20Analytics%20has%20locked%20your%20%2450%2C000%20USD%20supplier%20clearance%20rate%20at%20%E2%82%A61%2C520%2F%24%20with%20instant%20escrow.

🟡 *SMS STAGE 1 (WARM HOOK):*
_Good day! Please is this the procurement desk for Fouani on Allen Avenue, Ikeja?_

🔵 *SMS STAGE 2 (RATE OFFER):*
_Bethelmind Analytics: Locked $50k factory clearance rate at N1,520/$ with instant escrow. Call/WA 08022791227 to confirm._
━━━━━━━━━━━━━━━━━━━━━━`;

  const res = await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: fouaniMsg, lineId: 1 })
  });
  const data = await res.json();
  console.log('✅ Corrected Fouani delivered to admin WhatsApp! Msg ID:', data.messageId);
}

sendCorrectedFouani().catch(console.error);
