const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const commands = [
    'echo "=== TOKUNBO VIN CHECKER ==="',
    'head -n 40 /var/www/naija-hub/tokunbo-vin-checker/server.js 2>/dev/null || cat /var/www/naija-hub/tokunbo-vin-checker/package.json 2>/dev/null',
    'echo "=== P2P ARBITRAGE BOT ==="',
    'head -n 40 /var/www/naija-hub/p2p-arbitrage-bot/server.js 2>/dev/null || cat /var/www/naija-hub/p2p-arbitrage-bot/package.json 2>/dev/null',
    'echo "=== MOBILE MONITOR ==="',
    'head -n 40 /var/www/naija-hub/mobile-monitor/server.js 2>/dev/null || cat /var/www/naija-hub/mobile-monitor/package.json 2>/dev/null'
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
