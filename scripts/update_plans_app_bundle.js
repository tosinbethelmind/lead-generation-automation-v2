const fs = require('fs');

let content = fs.readFileSync('src/config/plans.ts', 'utf8');

const targetStr = 'PLANS_HAVE_WEBSITE: Plan[] = [';
const insertionPoint = content.indexOf(targetStr);

if (insertionPoint !== -1) {
  // Find the end of this array
  const endBracket = content.indexOf('];', insertionPoint);
  if (endBracket !== -1) {
    const newEntry = `  {
    id: 'app_bundle',
    name: 'Turn Website into Installable Android App (.APK)',
    monthlyNGN: 7_000,
    setupFeeNGN: 35_000,
    originalTotalNGN: 180_000,
    totalAmountNGN: 80_000,
    depositAmountNGN: 35_000,
    balanceAmountNGN: 45_000,
    slaHours: 24,
    color: '#06b6d4',
    badge: 'NEW • 24H EXPRESS APP CREATOR',
    tagline: 'Standard Agency Price ₦180,000 → Direct SME Price: ₦35,000 Setup + ₦7,000/mo (or ₦80,000 Annual Pass with 1 Year Free).',
    features: [
      { text: 'Converts any existing website URL into an official installable Android APK' },
      { text: 'Custom 1-Tap Download Page for your WhatsApp Catalog & Instagram Bio' },
      { text: 'Native deep-linking for WhatsApp Chat, Direct Phone Calls & OPay/Moniepoint transfers' },
      { text: 'Custom App Icon, Splash Screen, Offline Fallback & Pull-to-Refresh' },
      { text: 'Zero Google Play Console $25 fee and zero 14-day 20-tester rejection delay' },
      { text: 'Test your working .APK free on your phone before paying the balance' },
    ],
  },\n`;
    
    content = content.slice(0, endBracket) + newEntry + content.slice(endBracket);
    fs.writeFileSync('src/config/plans.ts', content, 'utf8');
    console.log('Successfully added Android APK App Bundle to PLANS_HAVE_WEBSITE in plans.ts');
  } else {
    console.error('Could not find end of PLANS_HAVE_WEBSITE array');
  }
} else {
  console.error('Could not find PLANS_HAVE_WEBSITE');
}
