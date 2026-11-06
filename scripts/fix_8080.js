const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('kill -9 1823594 && pm2 restart bethelmind-evolution', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Result:\n', out);
      setTimeout(() => {
        c.exec('ss -tlpn | grep 8080', (e, s) => {
          let sOut = '';
          s.on('data', d => sOut += d);
          s.on('close', () => {
            console.log('--- SS RESULT FOR 8080 ---:\n', sOut);
            c.end();
          });
        });
      }, 3000);
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
