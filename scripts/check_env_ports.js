const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -i -E "PORT" /root/lead-generation-automation-v2/.env* 2>/dev/null', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- ENV PORTS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
