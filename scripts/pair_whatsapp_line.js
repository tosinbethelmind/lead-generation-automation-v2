/**
 * @file scripts/pair_whatsapp_line.js
 * 
 * 🚀 1-COMMAND WHATSAPP LINE PAIRING & SOLIDIFICATION CLI
 * Usage: node scripts/pair_whatsapp_line.js <line_number (1-7)> [custom_phone]
 */

const lineId = parseInt(process.argv[2] || '1', 10);
const customPhone = process.argv[3];

const LINES = {
  1: { phone: '2348022791227', display: '0802 279 1227', role: 'Admin Closer Desk' },
  2: { phone: '2347026266946', display: '0702 626 6946', role: 'Outreach Desk 1' },
  3: { phone: '2349046050469', display: '0904 605 0469', role: 'Outreach Desk 2' },
  4: { phone: '2349135129625', display: '0913 512 9625', role: 'Outreach Desk 3' },
  5: { phone: '2347030556877', display: '0703 055 6877', role: 'Outreach Desk 4' },
  6: { phone: '2348119346518', display: '0811 934 6518', role: 'Outreach Desk 5' },
  7: { phone: '2348141609564', display: '0814 160 9564', role: 'Outreach Desk 6' }
};

async function main() {
  if (!LINES[lineId]) {
    console.error('❌ Invalid line number. Choose between 1 and 7.');
    process.exit(1);
  }

  const target = LINES[lineId];
  const phone = (customPhone || target.phone).replace(/\D/g, '');
  const cleanPhone = phone.startsWith('0') && phone.length === 11 ? '234' + phone.substring(1) : phone;

  console.log('========================================================================');
  console.log(`📱 BETHELMIND ANALYTICS: WHATSAPP PAIRING ASSISTANT FOR LINE ${lineId}`);
  console.log(`📞 SIM Phone : +${cleanPhone} (${target.display})`);
  console.log(`🏢 Role      : ${target.role}`);
  console.log('========================================================================\n');

  console.log(`⏳ Requesting 8-digit pairing code from Evolution API on Port 8080...`);

  try {
    const res = await fetch(`http://127.0.0.1:8080/instance/pairingCode/bethelmind_instance_${lineId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: cleanPhone })
    });

    const data = await res.json();
    if (data.pairingCode) {
      console.log('\n╔══════════════════════════════════════════════════════════════╗');
      console.log(`║   🔑 8-DIGIT PAIRING CODE FOR LINE ${lineId} (+${cleanPhone}):        ║`);
      console.log(`║                                                              ║`);
      console.log(`║                 👉  [  ${data.pairingCode}  ]  👈                 ║`);
      console.log(`║                                                              ║`);
      console.log('╚══════════════════════════════════════════════════════════════╝\n');
      console.log(`📲 HOW TO ENTER ON YOUR PHONE:`);
      console.log(`   1. Open WhatsApp on the device with SIM +${cleanPhone}`);
      console.log(`   2. Tap ⋮ (3-dots) or Settings -> Linked Devices`);
      console.log(`   3. Tap "Link a Device"`);
      console.log(`   4. Tap "Link with phone number instead" at the bottom`);
      console.log(`   5. Type the code: ${data.pairingCode}\n`);
      console.log(`🔒 The session will be AUTOMATICALLY locked & sealed across 5 backup vaults upon linking!`);
    } else {
      console.error('❌ Error requesting code:', data.message || data.error);
    }
  } catch (err) {
    console.error('❌ Network error connecting to Evolution Gateway on Port 8080:', err.message);
  }
}

main();
