const { Client } = require('ssh2');

async function check() {
  const conn = new Client();
  conn.on('ready', () => {
    const cmd = `
      echo "=== EVOLUTION LOGS AROUND 05:58 AND RECENT ==="
      tail -n 250 ~/.pm2/logs/bethelmind-evolution-out.log
    `;
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      let out = '';
      stream.on('data', d => out += d);
      stream.on('close', () => {
        console.log(out);
        conn.end();
      });
    });
  }).connect({
    host: '169.58.182.92',
    port: 22,
    username: 'root',
    password: 'bethelmind2026'
  });
}

check().catch(console.error);
