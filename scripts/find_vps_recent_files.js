const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = 'find / -maxdepth 4 -mmin -720 -not -path "*/proc/*" -not -path "*/sys/*" -not -path "*/.pm2/*" -not -path "*/.npm/*" -not -path "*/.cache/*" -not -path "*/node_modules/*" 2>/dev/null';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log('Modified in last 12 hours:\n' + out);
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
