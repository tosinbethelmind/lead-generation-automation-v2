const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    pm2 status
    echo "=== RECENT NAIRALAND BUMPER LOGS ==="
    pm2 logs bethelmind-nairaland-bumper --lines 20 --nostream
    echo "=== RECENT OMNICHANNEL AUTOPILOT LOGS ==="
    pm2 logs bethelmind-omnichannel-autopilot --lines 20 --nostream
  `;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
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
  readyTimeout: 60000,
  keepaliveInterval: 5000
});
