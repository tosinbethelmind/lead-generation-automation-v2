const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -A 8 -B 2 "6825525166330" /root/.pm2/logs/bethelmind-evolution-out.log', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Log output:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026' });
