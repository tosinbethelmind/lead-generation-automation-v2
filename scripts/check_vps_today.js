const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    echo '=== VPS TODAY TELEMETRY ==='
    curl -s http://127.0.0.1:8080/mobile-telemetry | head -c 500
    echo ''
    echo '=== VPS PM2 LIST ==='
    pm2 list
    echo '=== VPS EVOLUTION RECENT LOGS ==='
    tail -n 60 ~/.pm2/logs/bethelmind-evolution-out.log
  `;
  conn.exec(cmd, (err, stream) => {
    let out = ''; stream.on('data', d => out += d); stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026' });
