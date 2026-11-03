const fs = require('fs');

let code = fs.readFileSync('src/app/marketplace/page.tsx', 'utf8');

// Replace TIERS starter
code = code.replace(
  /id: 'starter'[\s\S]*?oneTimeNGN: 75000,\s*monthlyNGN: 15000,\s*originalOneTimeNGN: 150000,/,
  `id: 'starter',
    name: 'Official Website + AI Closer',
    badge: 'Starter Go-Live',
    icon: Zap,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    oneTimeNGN: 35000,
    monthlyNGN: 7000,
    originalOneTimeNGN: 140000,`
);

// Replace TIERS pro
code = code.replace(
  /id: 'pro'[\s\S]*?oneTimeNGN: 185000,\s*monthlyNGN: 35000,\s*originalOneTimeNGN: 370000,/,
  `id: 'pro',
    name: 'Full Custom Domain Suite',
    badge: 'Enterprise Turnkey (50% Deposit)',
    icon: Star,
    color: '#d4af37',
    gradient: 'linear-gradient(135deg, #d4af37, #b38f22)',
    oneTimeNGN: 75000,
    monthlyNGN: 0,
    originalOneTimeNGN: 280000,`
);

// Replace TIERS vip
code = code.replace(
  /id: 'vip'[\s\S]*?oneTimeNGN: 480000,\s*monthlyNGN: 75000,\s*originalOneTimeNGN: 950000,/,
  `id: 'vip',
    name: 'Web Portal + Android App (.APK)',
    badge: 'Web + Android App',
    icon: Crown,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    oneTimeNGN: 85000,
    monthlyNGN: 7000,
    originalOneTimeNGN: 350000,`
);

fs.writeFileSync('src/app/marketplace/page.tsx', code, 'utf8');
console.log('✅ Marketplace pricing updated to ₦35k / ₦75k / ₦85k');
