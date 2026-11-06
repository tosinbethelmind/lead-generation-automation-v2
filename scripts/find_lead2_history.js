const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -i -C 5 "62251289604110" /root/.pm2/logs/*.log', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- LOGS FOR 62251289604110 ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
