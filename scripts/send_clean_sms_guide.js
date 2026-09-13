/**
 * Clean Professional Commercial SMS Dispatcher & Formatter
 */
const fs = require('fs');

async function sendCleanSmsGuideToAdmin() {
  const adminPhone = '2348022791227';

  const deals = [
    {
      index: 1,
      name: 'Jacio International Ltd',
      phone: '0818 558 7222',
      location: 'ASPAMDA Trade Fair',
      volume: '$65,000 USD',
      profit: '₦1,625,000',
      smsText: 'Good day Jacio Intl team. Bethelmind Analytics has locked your $65k China supplier FX rate at N1,520/$ with instant escrow. Call/WhatsApp 08022791227.'
    },
    {
      index: 2,
      name: 'Maldini Granites & Marble',
      phone: '0803 307 9719',
      location: 'Surulere, Lagos',
      volume: '$65,000 USD',
      profit: '₦1,625,000',
      smsText: 'Good day Maldini Imports team. Bethelmind Analytics has locked your $65k freight/supplier FX rate at N1,520/$ with instant escrow. Call/WA 08022791227.'
    },
    {
      index: 3,
      name: 'Fouani Electronics',
      phone: '0810 754 0008',
      location: 'Allen Avenue, Ikeja',
      volume: '$85,000 USD',
      profit: '₦2,125,000',
      smsText: 'Good day Fouani Ikeja team. Bethelmind Analytics has locked your $85k factory clearance rate at N1,520/$ with instant escrow. Call/WA 08022791227.'
    },
    {
      index: 4,
      name: 'COHBS International',
      phone: '0817 041 7114',
      location: 'Ikeja, Lagos',
      volume: '$35,000 USD',
      profit: '₦875,000',
      smsText: 'Good day COHBS Intl team. Bethelmind Analytics has locked your $35k hardware supplier rate at N1,520/$ with instant escrow. Call/WA 08022791227.'
    }
  ];

  const headerMsg = `📱 *[PRO-GRADE GSM SMS PUSH & COPY DEALS]*
Clean, punchy 1-page SMS texts formatted for high reply rates on normal phone SMS:`;

  await fetch('http://localhost:5005/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: adminPhone, message: headerMsg, lineId: 1 })
  });

  for (const d of deals) {
    const cardMsg = `📋 *SMS CARD #${d.index}: ${d.name}*
📞 *Send to:* \`${d.phone}\`
📍 *Area:* ${d.location} | *Volume:* ${d.volume}
💰 *Your Spread Profit:* *${d.profit}*

✉️ *COPY-PASTE EXACT SMS TEXT:*
----------------------------------------
${d.smsText}
----------------------------------------

💬 *Or Tap to Chat on WhatsApp:*
https://wa.me/234${d.phone.replace(/\D/g, '').replace(/^0+/, '')}?text=${encodeURIComponent(d.smsText)}`;

    await fetch('http://localhost:5005/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: adminPhone, message: cardMsg, lineId: 1 })
    });
    await new Promise(r => setTimeout(r, 1200));
  }
}

sendCleanSmsGuideToAdmin().catch(console.error);
