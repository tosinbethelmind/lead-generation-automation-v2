const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /root/lead-generation-automation-v2 && node -e "
    const fs = require('fs');
    const content = fs.readFileSync('scripts/nairaland_autonomous_engine.js', 'utf8');
    const keys = [];
    const re = /'([a-z0-9-]+)':\\s*\\{[\\s\\S]*?boardId:\\s*(\\d+)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      keys.push({ slug: m[1], boardId: m[2] });
    }
    console.log(JSON.stringify(keys, null, 2));
  "`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log('Campaigns in VPS engine:');
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
