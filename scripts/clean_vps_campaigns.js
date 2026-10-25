const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = `
const fs = require('fs');
const path = '/root/lead-generation-automation-v2/local_db/nairaland_campaigns.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Filter out broken /do_newtopic entries
const validThreads = data.threads.filter(t => t.url && !t.url.includes('/do_newtopic'));
console.log('Original threads count:', data.threads.length);
console.log('Valid active threads count:', validThreads.length);
validThreads.forEach(t => console.log(' - ' + t.id + ': ' + t.title + ' (' + t.campaignKey + ')'));

data.threads = validThreads;
fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully cleaned nairaland_campaigns.json on VPS');
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
