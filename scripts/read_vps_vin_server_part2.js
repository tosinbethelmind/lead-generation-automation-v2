const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `node -e "
    const fs = require('fs');
    const content = fs.readFileSync('/var/www/naija-hub/tokunbo-vin-checker/server.js', 'utf8');
    console.log(content.substring(1500));
  "`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log(out);
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
