const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = `
const fs = require('fs');
const content = fs.readFileSync('/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js', 'utf8');
const match = content.match(/const CAMPAIGN_CATALOG = \\{([\\s\\S]*?)\\n\\};/);
if (match) {
  const block = match[1];
  const keys = [];
  const regex = /['"]([a-z0-9-]+)['"]\\s*:\\s*\\{/g;
  let m;
  while ((m = regex.exec(block)) !== null) {
    keys.push(m[1]);
  }
  console.log('All Campaign Catalog Keys:', keys);
} else {
  console.log('No match for CAMPAIGN_CATALOG');
}
`;
  conn.exec(`node -e "${script.replace(/\n/g, ' ')}"`, (err, stream) => {
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
