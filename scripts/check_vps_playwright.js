const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /root/lead-generation-automation-v2 && node -e "try { require(\'playwright\'); console.log(\'Playwright available!\'); } catch(e) { console.log(\'Playwright missing:\', e.message); }"', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log('Result:\n' + out);
      conn.end();
    }).on('data', d => out += d.toString());
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
