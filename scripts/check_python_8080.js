const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('lsof -i :8080 || fuser 8080/tcp', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- PROCESS ON 8080 ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
