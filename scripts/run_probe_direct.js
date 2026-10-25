const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const probe = `
const { createStealthBrowser } = require('./nairaland_autonomous_engine');
const fs = require('fs');

async function probeNewTopic() {
  const { browser, context } = await createStealthBrowser(true);
  const page = await context.newPage();
  console.log('Navigating to newtopic?board=24...');
  await page.goto('https://www.nairaland.com/newtopic?board=24', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));

  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());
  const bodyText = await page.innerText('body').catch(() => '');
  console.log('Body snippet:', bodyText.slice(0, 300).replace(/\\n/g, ' '));

  const hasTitleInput = await page.$('input[name="title"]');
  console.log('Has input[name="title"]?:', Boolean(hasTitleInput));

  await browser.close();
}
probeNewTopic().catch(console.error);
`;

  conn.sftp((err, sftp) => {
    if (err) throw err;
    const ws = sftp.createWriteStream('/root/lead-generation-automation-v2/scripts/probe_newtopic.js');
    ws.write(probe);
    ws.end(() => {
      conn.exec('cd /root/lead-generation-automation-v2 && node scripts/probe_newtopic.js 2>&1', (err2, stream) => {
        if (err2) throw err2;
        let out = '';
        stream.on('close', (code) => {
          console.log('Exit code:', code);
          console.log('Output:\n' + out);
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
