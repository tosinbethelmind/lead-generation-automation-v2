const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /root/lead-generation-automation-v2 && node -e "
    const engine = require('./scripts/nairaland_autonomous_engine.js');
    async function check() {
      const { browser, context } = await engine.createStealthBrowser(true);
      const page = await context.newPage();
      console.log('Navigating to https://www.nairaland.com/newtopic?board=15 ...');
      await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log('Page Title:', await page.title());
      console.log('Final URL:', page.url());
      const body = await page.innerText('body');
      console.log('Body snippet (first 600 chars):', body.substring(0, 600));
      const hasTitle = !!(await page.$('input[name=\"title\"]'));
      console.log('Has input[name=title]?:', hasTitle);
      await browser.close();
    }
    check();
  "`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
