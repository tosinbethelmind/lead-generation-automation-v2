const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cat /var/www/naija-hub/tokunbo-vin-checker/server.js`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log('--- server.js length:', out.length);
      console.log(out.substring(0, 1500));
      conn.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
