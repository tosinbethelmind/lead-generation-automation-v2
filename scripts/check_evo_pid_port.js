const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('pm2 jlist', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      try {
        const list = JSON.parse(out);
        const evo = list.find(p => p.name === 'bethelmind-evolution');
        console.log('bethelmind-evolution pid:', evo ? evo.pid : 'not found');
        if (evo && evo.pid) {
          c.exec(`ss -tlpn | grep ${evo.pid}`, (e, s) => {
            let sOut = '';
            s.on('data', d => sOut += d);
            s.on('close', () => {
              console.log('Listening ports for bethelmind-evolution:\n', sOut);
              c.end();
            });
          });
          return;
        }
      } catch (err) {
        console.error(err);
      }
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
