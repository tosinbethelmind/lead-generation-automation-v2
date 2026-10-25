const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const commands = [
    'echo "=== PM2 LIST ==="',
    'pm2 list',
    'echo "=== ROOT DIRECTORY ==="',
    'ls -la /root',
    'echo "=== RECENTLY MODIFIED FILES IN /root (last 48 hours) ==="',
    'find /root -maxdepth 3 -mtime -2 -type f',
    'echo "=== CHECKING /root/lead-generation-automation-v2 GIT STATUS ==="',
    'cd /root/lead-generation-automation-v2 && git status -s 2>/dev/null || true'
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
