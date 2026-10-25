const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = `
const fs = require('fs');
const file = '/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js';
let content = fs.readFileSync(file, 'utf8');

if (content.includes("if (campaignKey === 'tokunbo-duty')")) {
  content = content.replace(
    "if (campaignKey === 'tokunbo-duty')",
    "if (campaignKey === 'tokunbo-duty' || campaignKey === 'tokunbo-vin-checker')"
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated getContextualBumpMessage to handle tokunbo-vin-checker');
} else {
  console.log('Already updated or pattern not found');
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
