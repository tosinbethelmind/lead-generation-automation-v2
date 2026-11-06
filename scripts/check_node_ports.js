const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('ss -tlpn | grep node', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- NODE PORTS ON VPS ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
