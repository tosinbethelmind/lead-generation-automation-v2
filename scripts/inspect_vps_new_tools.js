const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const commands = [
    'echo "=== VIN TOOL FILES ==="',
    'ls -la /root/lead-generation-automation-v2/src/app/vin 2>/dev/null || true',
    'echo "=== ARBITRAGE TOOL FILES ==="',
    'ls -la /root/lead-generation-automation-v2/src/app/arbitrage 2>/dev/null || true',
    'echo "=== VIN PROXY API ==="',
    'ls -la /root/lead-generation-automation-v2/src/app/api/vin-proxy 2>/dev/null || true',
    'echo "=== ARBITRAGE PROXY API ==="',
    'ls -la /root/lead-generation-automation-v2/src/app/api/arbitrage-proxy 2>/dev/null || true',
    'echo "=== PM2 10 & 11 DETAILS ==="',
    'pm2 show tokunbo-vin-checker | grep -E "script path|exec mode|status"',
    'pm2 show p2p-arbitrage-bot | grep -E "script path|exec mode|status"',
    'echo "=== NAIRALAND CAMPAIGNS ON VPS ==="',
    'cat /root/lead-generation-automation-v2/local_db/nairaland_campaigns.json'
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
