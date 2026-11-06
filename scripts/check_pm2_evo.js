const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('pm2 logs bethelmind-evolution --lines 30 --nostream', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- BETHELMIND EVOLUTION LOGS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
