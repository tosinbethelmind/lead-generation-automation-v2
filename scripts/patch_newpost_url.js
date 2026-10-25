const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(file, 'utf8');

const targetStr = `    console.log(\`Checking thread: \${thread.title} (\${thread.url})...\`);
    try {
      await page.goto(thread.url, { waitUntil: 'domcontentloaded', timeout: 25000 });`;

const replaceStr = `    const threadIdMatch = (thread.id && !thread.id.startsWith('NL-')) ? thread.id : (thread.url ? thread.url.match(/\\/(\\d+)\\//) : null);
    const threadId = Array.isArray(threadIdMatch) ? threadIdMatch[1] : threadIdMatch;
    if (!threadId) {
      console.log(\`Skipping unposted or placeholder thread: \${thread.title}\`);
      continue;
    }
    const replyUrl = \`https://www.nairaland.com/newpost?topic=\${threadId}\`;
    console.log(\`Navigating to reply page for "\${thread.title}": \${replyUrl}...\`);
    try {
      await page.goto(replyUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
} else {
  code = code.replace(targetStr.replace(/\n/g, '\r\n'), replaceStr.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(file, code, 'utf8');
console.log('Successfully updated navigation to newpost?topic=ID!');
