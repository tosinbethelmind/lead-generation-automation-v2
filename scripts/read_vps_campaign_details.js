const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /root/lead-generation-automation-v2 && node -e "
    const fs = require('fs');
    const content = fs.readFileSync('scripts/nairaland_autonomous_engine.js', 'utf8');
    
    function extract(key) {
      const idx = content.indexOf(\"'\" + key + \"':\");
      if (idx === -1) return key + ' not found';
      return content.substring(idx, idx + 2000);
    }
    
    console.log('=== P2P ARBITRAGE ===');
    console.log(extract('p2p-arbitrage'));
    console.log('=== TOKUNBO VIN CHECKER ===');
    console.log(extract('tokunbo-vin-checker'));
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
