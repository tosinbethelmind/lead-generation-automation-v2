const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('grep -rn "Endpoint not found" /root/lead-generation-automation-v2/ /root/video-automation-vidrush/ 2>/dev/null', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- FOUND STRING ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
