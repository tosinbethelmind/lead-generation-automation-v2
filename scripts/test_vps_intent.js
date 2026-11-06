const { Client } = require('ssh2');
const c = new Client();
c.on('ready', () => {
  c.exec('cd /root/lead-generation-automation-v2 && node -e "const { handlePostContactInquiry } = require(\\"./scripts/lib/closer_engine\\"); console.log(JSON.stringify(handlePostContactInquiry(\\"Hello, I’m interested in Convert Website to Android App • Installable APK in 24h\\", { businessName: \\"Your Business\\", phone: \\"6825525166330\\" })));"', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- VPS INTENT TEST ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
