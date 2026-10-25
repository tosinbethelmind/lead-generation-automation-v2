const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const code = `
const fs = require('fs');
const path = '/root/lead-generation-automation-v2/local_db/nairaland_campaigns.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const validThreads = (data.threads || []).filter(t => t.url && !t.url.includes('/do_newtopic'));
console.log('Original count:', (data.threads || []).length);
console.log('Valid threads count:', validThreads.length);
validThreads.forEach(t => console.log(' - ' + t.id + ': ' + t.title + ' (' + t.campaignKey + ')'));

data.threads = validThreads;
data.stats = data.stats || {};
data.stats.totalPosted = validThreads.length;

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully cleaned nairaland_campaigns.json on VPS');
`;

    const writeStream = sftp.createWriteStream('/root/lead-generation-automation-v2/scripts/clean_campaigns_ledger.js');
    writeStream.write(code);
    writeStream.end(() => {
      console.log('Uploaded clean_campaigns_ledger.js to VPS via SFTP');
      conn.exec('node /root/lead-generation-automation-v2/scripts/clean_campaigns_ledger.js', (err2, stream) => {
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
