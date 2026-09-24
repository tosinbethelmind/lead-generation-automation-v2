/**
 * scripts/send_fixed_links.js
 * Sends the direct, guaranteed working Vercel preview links to the 5 prospects.
 */
const http = require('http');

const prospects = [
  { phone: '09036254245', slug: 'favourites_kitchen', name: "FAVOURITES' KITCHEN" },
  { phone: '08067733756', slug: 'zeek_solar_shop', name: 'Zeek Solar Shop' },
  { phone: '09013568040', slug: 'blessife_catering_services', name: 'BlessIfe catering services' },
  { phone: '08147626861', slug: 'lagos_business_owner', name: 'Business Owner' },
  { phone: '08038246324', slug: 'healthcare_kaduna_34', name: 'Healthcare Kaduna' }
];

async function sendLink(prospect) {
  return new Promise((resolve) => {
    let cleanPhone = prospect.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    }
    const targetJid = `${cleanPhone}@s.whatsapp.net`;
    const directUrl = `https://lead-generation-automation-v2-dk3imdpd4-tosin4.vercel.app/preview/${prospect.slug}`;
    const message = `Hello ${prospect.name}! 👋\n\nHere is the updated direct link to view your live sample website:\n👉 ${directUrl}\n\nIt opens instantly. Let us know what you think! 😊`;

    const payload = JSON.stringify({
      phone: cleanPhone,
      message: message
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3007,
      path: '/send-message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        console.log(`✅ Sent to ${prospect.phone} (${prospect.name}): Status ${res.statusCode}`);
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Error sending to ${prospect.phone}:`, err.message);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Sending direct working links to prospects...');
  for (const p of prospects) {
    await sendLink(p);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('Done dispatching updated links!');
}

run();
