const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const patcher = `
const fs = require('fs');
const file = '/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js';
let content = fs.readFileSync(file, 'utf8');

if (content.includes("if (campaignKey === 'tokunbo-duty')")) {
  content = content.replace(
    "if (campaignKey === 'tokunbo-duty')",
    "if (campaignKey === 'tokunbo-duty' || campaignKey === 'tokunbo-vin-checker')"
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated getContextualBumpMessage for tokunbo-vin-checker');
} else {
  console.log('tokunbo-vin-checker bump handler already present');
}
`;
    const ws = sftp.createWriteStream('/root/lead-generation-automation-v2/scripts/patch_bump.js');
    ws.write(patcher);
    ws.end(() => {
      conn.exec('node /root/lead-generation-automation-v2/scripts/patch_bump.js', (err2, stream) => {
        if (err2) throw err2;
        let out = '';
        stream.on('close', () => {
          console.log(out);
          conn.end();
        }).on('data', d => out += d.toString());
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
