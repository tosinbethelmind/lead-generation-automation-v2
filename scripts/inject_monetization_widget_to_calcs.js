const fs = require('fs');
const path = require('path');

const calcDir = 'c:/Users/HomePC/Desktop/website Projects/lead generation automation/public/calc';
const files = fs.readdirSync(calcDir).filter(f => f.endsWith('.html') && f !== 'index.html');

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(calcDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('monetization-widget.js')) {
    html = html.replace('</body>', '  <script src="/calc/monetization-widget.js"></script>\r\n</body>');
    fs.writeFileSync(filePath, html, 'utf8');
    modifiedCount++;
  }
}

console.log(`Successfully injected monetization-widget.js into ${modifiedCount} calculators/games in public/calc!`);
