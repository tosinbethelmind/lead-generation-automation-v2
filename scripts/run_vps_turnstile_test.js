const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const solverScript = `
const { createStealthBrowser } = require('./nairaland_autonomous_engine');

async function testTurnstileClear() {
  console.log('Testing Turnstile resolution on /newtopic?board=24...');
  const { browser, context } = await createStealthBrowser(true);
  const page = await context.newPage();

  await page.goto('https://www.nairaland.com/newtopic?board=24', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto note:', e.message));

  for (let i = 0; i < 15; i++) {
    const title = await page.title();
    console.log(\`[\${i+1}/15] Title: "\${title}" | URL: \${page.url()}\`);
    if (title.includes('New Topic') || (await page.$('input[name="title"]'))) {
      console.log('🎉 Form painted! Turnstile passed automatically!');
      break;
    }

    // Check for Cloudflare Turnstile iframe
    for (const frame of page.frames()) {
      if (frame.url().includes('cloudflare') || frame.url().includes('turnstile') || frame.url().includes('challenge')) {
        const box = await frame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, #challenge-stage');
        if (box) {
          console.log('Found Turnstile checkbox in frame. Clicking...');
          await box.click().catch(() => {});
        }
      }
    }
    await page.waitForTimeout(2000);
  }

  const hasInput = await page.$('input[name="title"]');
  console.log('Final result: has input[name="title"]?:', Boolean(hasInput));
  await browser.close();
}

testTurnstileClear().catch(console.error);
`;

  conn.sftp((err, sftp) => {
    if (err) throw err;
    const ws = sftp.createWriteStream('/root/lead-generation-automation-v2/scripts/test_turnstile_newtopic.js');
    ws.write(solverScript);
    ws.end(() => {
      conn.exec('cd /root/lead-generation-automation-v2 && node scripts/test_turnstile_newtopic.js 2>&1', (err2, stream) => {
        if (err2) throw err2;
        let out = '';
        stream.on('close', (code) => {
          console.log('Exit code:', code);
          console.log(out);
          conn.end();
        }).on('data', d => out += d.toString());
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
