const { Client } = require('ssh2');
const c = new Client();
c.on('ready', () => {
  c.exec('grep -n -C 10 "Inbound Closer" /root/lead-generation-automation-v2/scripts/evolution_api_server.js', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- VPS EVOLUTION SERVER ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026' });
