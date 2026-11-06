const { Client } = require('ssh2');
const c = new Client();
c.on('ready', () => {
  c.exec('grep -C 5 "2026-11-06T01:26:19" /root/.pm2/logs/bethelmind-evolution-out.log', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- OUTPUT ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026' });
