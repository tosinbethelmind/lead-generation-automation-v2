const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /root/lead-generation-automation-v2 && node -e "
    const fs = require('fs');
    const content = fs.readFileSync('scripts/nairaland_autonomous_engine.js', 'utf8');
    // Let's see how p2p-arbitrage and tokunbo-vin-checker are configured in CAMPAIGN_CATALOG
    const p2pMatch = content.match(/'p2p-arbitrage':\\s*\\{[\\s\\S]*?generateBody[\\s\\S]*?\\n  \\},/);
    console.log('--- P2P ARBITRAGE CONFIG ---');
    console.log(p2pMatch ? p2pMatch[0].substring(0, 800) : 'Not found');
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
