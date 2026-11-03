const fs = require('fs');

let content = fs.readFileSync('src/app/preview/[lead_id]/page.tsx', 'utf8');

// Add APK bullet to Option 1
const opt1Target = '<li>• 48-Hour Live Delivery SLA &amp; Handover Guarantee</li>';
const opt1Add = '<li>• 48-Hour Live Delivery SLA &amp; Handover Guarantee</li>\r\n                  <li>• 📱 Installable Android App (.APK) package &amp; Mobile PWA included</li>';

if (content.includes(opt1Target) && !content.includes('Installable Android App (.APK) package')) {
  content = content.replace(opt1Target, opt1Add);
}

// Add APK bullet to Option 2
const opt2Target = '<li>• 100% Full Code &amp; Domain Ownership + 60-Day VIP Priority Support</li>';
const opt2Add = '<li>• 100% Full Code &amp; Domain Ownership + 60-Day VIP Priority Support</li>\r\n                  <li>• 📱 Native Android App (.APK) compiled &amp; ready for customer WhatsApp sharing</li>';

if (content.includes(opt2Target) && !content.includes('Native Android App (.APK) compiled')) {
  content = content.replace(opt2Target, opt2Add);
}

fs.writeFileSync('src/app/preview/[lead_id]/page.tsx', content, 'utf8');
console.log('Successfully added Android App (.APK) value bullets to preview/[lead_id]/page.tsx');
