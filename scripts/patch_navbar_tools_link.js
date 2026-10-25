const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '..', 'src', 'components', 'home', 'Navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// Replace desktop button
content = content.replace(
  /href="\/admin\/mobile"/g,
  'href="/tools"'
);
content = content.replace(
  />\s*Mobile Desk\s*<\/Link>/g,
  '>Sector Tools</Link>'
);
content = content.replace(
  />\s*Mobile Command Hub \(Desk Login\)\s*<\/Link>/g,
  '>Sector Tools Directory</Link>'
);

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Updated Navbar.tsx links to /tools!');
