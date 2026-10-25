const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established. Installing Playwright Chromium & dependencies on VPS...');
  conn.exec('cd /root/lead-generation-automation-v2 && npx playwright install chromium --with-deps', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Playwright install finished with code: ' + code);
      // Now restart the PM2 bumper process
      conn.exec('pm2 restart bethelmind-nairaland-bumper', (err2, stream2) => {
        if (err2) throw err2;
        stream2.on('close', () => {
          console.log('bethelmind-nairaland-bumper successfully restarted on VPS under PM2!');
          conn.end();
        }).on('data', d => process.stdout.write(d.toString()));
      });
    }).on('data', d => process.stdout.write(d.toString()));
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
