const fs = require('fs');

let content = fs.readFileSync('src/app/tools/page.tsx', 'utf8');

// 1. Add Smartphone to imports if not present
if (!content.includes('Smartphone')) {
  content = content.replace(/Factory/, 'Factory,\r\n  Smartphone');
}

// 2. Add Tool Item before cleaning-fumigation-sizer
const marker = "id: 'cleaning-fumigation-sizer'";
const idx = content.indexOf(marker);

if (idx !== -1 && !content.includes('website-to-android-app')) {
  // Find the `{` before this marker
  const lastBrace = content.lastIndexOf('{', idx);
  const newTool = `  {\r\n    id: 'website-to-android-app',\r\n    title: 'Instant Website-to-Android App (.APK) & PWA Generator',\r\n    badge: '24h Mobile App Wrapper',\r\n    category: 'b2b',\r\n    description: 'Converts any existing business website or ecommerce catalog into an installable Android APK with custom splash screen, push notifications, offline fallback, and direct WhatsApp bio link.',\r\n    icon: Smartphone,\r\n    color: 'text-[#06b6d4]',\r\n    href: '/tools/website-to-android-app',\r\n    upsell: '₦35k Setup + ₦7k/mo (or ₦80k Annual)'\r\n  },\r\n`;
  content = content.slice(0, lastBrace) + newTool + content.slice(lastBrace);
  fs.writeFileSync('src/app/tools/page.tsx', content, 'utf8');
  console.log('Successfully added website-to-android-app tool to tools/page.tsx');
} else {
  console.log('Notice: already exists or marker not found');
}
