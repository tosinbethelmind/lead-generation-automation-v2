const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -i -C 2 -E "EADDRINUSE|error|listen" /root/.pm2/logs/bethelmind-evolution-error.log | tail -n 25', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- ERROR LOGS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
