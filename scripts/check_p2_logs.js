const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -i -C 2 -E "pillar2|mandate|broker|ora egbunike|jide taiwo|broll|diya fatimilehin|knight frank|ubosi eleh|alpha mead" /root/.pm2/logs/*.log | tail -n 80', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- PILLAR 2 OUTREACH LOGS ON VPS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
