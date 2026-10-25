const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const commands = [
    'echo "=== ALL ROUTES IN /root/lead-generation-automation-v2/src/app ==="',
    'find /root/lead-generation-automation-v2/src/app -maxdepth 2 -type d',
    'echo "=== CHECKING /root/lead-generation-automation-v2/src/app/tools ==="',
    'find /root/lead-generation-automation-v2/src/app/tools -maxdepth 2 -type d 2>/dev/null || true',
    'echo "=== NAIRALAND ENGINE ON VPS ==="',
    'head -n 60 /root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js'
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
