const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('pm2 restart bethelmind-nairaland-bumper && pm2 status bethelmind-nairaland-bumper', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log('PM2 Restart Result:\n' + out);
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
