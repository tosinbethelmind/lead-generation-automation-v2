const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('ps -fp 1823594', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- PID 1823594 INFO ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
