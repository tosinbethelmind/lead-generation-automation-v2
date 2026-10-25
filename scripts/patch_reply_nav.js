const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(file, 'utf8');

const oldCheck = `      console.log(\`Checking thread: \${thread.title} (\${thread.url})...\`);
    try {
      await page.goto(thread.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.warn('⚠️ Session expired. Skipping bumps.');
        break;
      }

      // Check if fast reply form exists (input[name="body"] or textarea)
      const hasReplyBox = await page.$('textarea[name="body"]');
      if (hasReplyBox) {`;

const newCheck = `      const threadIdMatch = (thread.id && !thread.id.startsWith('NL-')) ? thread.id : (thread.url ? thread.url.match(/\\/(\\d+)\\//) : null);
      const threadId = Array.isArray(threadIdMatch) ? threadIdMatch[1] : threadIdMatch;
      if (!threadId) {
        console.log(\`Skipping thread without numeric ID: \${thread.title}\`);
        continue;
      }

      const replyUrl = \`https://www.nairaland.com/newpost?topic=\${threadId}\`;
      console.log(\`Navigating to reply page for "\${thread.title}": \${replyUrl}...\`);
    try {
      await page.goto(replyUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.warn('⚠️ Session expired. Skipping bumps.');
        break;
      }

      const hasReplyBox = await page.$('textarea[name="body"]');
      if (hasReplyBox) {`;

if (code.includes('Checking thread: ${thread.title}')) {
  code = code.replace(oldCheck.replace(/\n/g, '\r\n'), newCheck.replace(/\n/g, '\r\n'));
  if (!code.includes('newpost?topic=')) {
    code = code.replace(oldCheck, newCheck);
  }
}

// Also in post submission wait for redirect on reply
const oldSubmit = `        await page.click('input[value="Submit"]');
        await page.waitForTimeout(3000);

        thread.lastBumpedAt = new Date().toISOString();`;

const newSubmit = `        console.log('Submitting bump reply...');
        await page.click('input[value="Submit"]');
        
        // Wait up to 15s for Cloudflare or redirect
        for (let w = 0; w < 6; w++) {
          await page.waitForTimeout(2000);
          if (page.url().includes('/' + threadId + '/')) {
            console.log('✓ Bump confirmed on live thread!');
            break;
          }
        }

        thread.lastBumpedAt = new Date().toISOString();`;

if (code.includes('await page.click(\'input[value="Submit"]\');')) {
  code = code.replace(oldSubmit.replace(/\n/g, '\r\n'), newSubmit.replace(/\n/g, '\r\n'));
  if (!code.includes('✓ Bump confirmed on live thread!')) {
    code = code.replace(oldSubmit, newSubmit);
  }
}

fs.writeFileSync(file, code, 'utf8');
console.log('Successfully updated bumpAndReplyToThreads to navigate to /newpost?topic=ID!');
