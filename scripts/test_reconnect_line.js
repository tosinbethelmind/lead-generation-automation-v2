const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  // Test reconnecting Line 4 or 6 via the local Evolution API endpoint
  // POST /instance/reconnect/bethelmind_instance_4
  const script = [
    'curl -s -X POST http://localhost:8080/instance/reconnect/bethelmind_instance_4',
    'sleep 3',
    'curl -s -X POST http://localhost:8080/instance/reconnect/bethelmind_instance_6',
    'sleep 3',
    'curl -s -X POST http://localhost:8080/instance/reconnect/bethelmind_instance_7',
    'sleep 5',
    'tail -n 25 /root/.pm2/logs/bethelmind-evolution-out.log'
  ].join('\n');

  conn.exec(script, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).on('error', e => console.error(e.message))
.connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
