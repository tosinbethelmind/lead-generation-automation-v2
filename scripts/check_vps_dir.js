const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('pwd && ls -la /root', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log('VPS root directory:\n' + out);
      conn.end();
    }).on('data', (d) => out += d.toString());
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
