const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('netstat -tlpn | grep 8080', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- PORT 8080 PROCESS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
