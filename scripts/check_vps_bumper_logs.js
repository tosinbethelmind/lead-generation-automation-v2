const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('pm2 status bethelmind-nairaland-bumper && pm2 logs bethelmind-nairaland-bumper --lines 15 --nostream', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log('VPS Bumper PM2 Log:\n' + out);
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
