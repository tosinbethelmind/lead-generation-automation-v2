const fs = require('fs');

let content = fs.readFileSync('src/app/tools/[slug]/page.tsx', 'utf8');

const target = "if (/starlink|satellite|mesh|dish/.test(slug)) {";

const addition = `if (/app|apk|wrapper|android|mobile/.test(slug)) {
    return {
      title: 'Instant Website-to-Android App (.APK) & PWA Generator',
      category: 'Mobile Applications & Software',
      tag: '24h Native Mobile App Wrapper',
      summary: 'Converts any existing commercial website or ecommerce catalog into an installable Android APK with custom splash screen, push notifications, offline fallback, and direct WhatsApp bio link.',
      highlightPills: ['Native Android APK (.apk)', 'Direct WhatsApp & Instagram Bio Download', 'Zero Google Play $25 Fee / 20-Tester Wait'],
      sectorTab: 'retail',
    };
  }

  `;

if (content.includes(target) && !content.includes('/app|apk|wrapper|android|mobile/')) {
  content = content.replace(target, addition + target);
  fs.writeFileSync('src/app/tools/[slug]/page.tsx', content, 'utf8');
  console.log('Successfully added app profile to getSectorProfile() in tools/[slug]/page.tsx');
} else {
  console.log('Notice: already exists or target not found');
}
