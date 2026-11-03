const fs = require('fs');

let code = fs.readFileSync('src/app/tools/page.tsx', 'utf8');

// Ensure 'use client'; is at the very top
code = code.replace(/const toolToServiceMap: Record<string, string> = {[\s\S]*?};\r?\n\r?\n/, '');
code = code.trim();

if (!code.startsWith("'use client';")) {
  code = code.replace(/'use client';\r?\n?/, '');
  code = "'use client';\r\n\r\n" + code;
}

// Now insert toolToServiceMap right after imports
const mapCode = `\r\nconst toolToServiceMap: Record<string, string> = {
  'solar-boq': 'solar_boq',
  'tokunbo-duty': 'vin_checker',
  'salon-booking': 'salon_booking',
  'shortlet-booking-escrow': 'shortlet_escrow',
  'website-to-android-app': 'website_to_app',
  'school-fee-sizer': 'school_fee',
  'real-estate-manager': 'estate_rent',
  'fmcg-dispatch': 'retail_inventory',
  'gps-tracker-fuel-audit': 'dispatch_tracker',
};\r\n`;

code = code.replace("import { TurnkeySmeSetupBanner } from '@/components/TurnkeySmeSetupBanner';", "import { TurnkeySmeSetupBanner } from '@/components/TurnkeySmeSetupBanner';" + mapCode);

fs.writeFileSync('src/app/tools/page.tsx', code, 'utf8');
console.log('✅ Fixed tools/page.tsx so use client is at the top');
