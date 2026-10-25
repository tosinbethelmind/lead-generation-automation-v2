const fs = require('fs');
const path = require('path');

// 1. Patch Navbar.tsx
const navbarPath = path.join(__dirname, '..', 'src', 'components', 'home', 'Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Replace desktop Mobile Desk link
navbarContent = navbarContent.replace(
  /href="\/admin\/mobile\?token=bethelmind_admin_2026"([\s\S]*?)📱 Mobile Desk/g,
  'href="/tools"$1⚡ Sector Tools'
);

// Replace mobile menu Mobile Command Hub link
navbarContent = navbarContent.replace(
  /href="\/admin\/mobile\?token=bethelmind_admin_2026"([\s\S]*?)📱 Mobile Command Hub \(Desk Login\)/g,
  'href="/tools"$1⚡ Explore All Sector Tools Directory'
);

// Replace any remaining bethelmind_admin_2026 in Navbar
navbarContent = navbarContent.replace(/\?token=bethelmind_admin_2026/g, '');

fs.writeFileSync(navbarPath, navbarContent, 'utf8');
console.log('SUCCESS: Navbar.tsx patched!');

// 2. Patch Footer.tsx
const footerPath = path.join(__dirname, '..', 'src', 'components', 'home', 'Footer.tsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');

footerContent = footerContent.replace(
  /<Link href="\/admin\/mobile\?token=bethelmind_admin_2026"[\s\S]*?>[\s\S]*?<\/Link>/g,
  '<Link href="/tools" style={{ color: \'#38bdf8\', textDecoration: \'none\', fontSize: \'0.85rem\', fontWeight: 700 }}>⚡ Sector Tools Directory</Link>'
);

fs.writeFileSync(footerPath, footerContent, 'utf8');
console.log('SUCCESS: Footer.tsx patched!');
