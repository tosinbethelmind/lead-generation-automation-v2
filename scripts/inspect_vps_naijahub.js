const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const commands = [
    'echo "=== /var/www/naija-hub DIRECTORY ==="',
    'ls -la /var/www/naija-hub 2>/dev/null || true',
    'echo "=== CHECKING /var/www/ ==="',
    'ls -la /var/www 2>/dev/null || true',
    'echo "=== CHECKING /root/video-automation-vidrush ==="',
    'ls -la /root/video-automation-vidrush 2>/dev/null || true'
  ].join(' && ');

  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log(out);
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
