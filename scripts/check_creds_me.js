const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = [
    'for i in 1 2 4 6 7; do',
    '  echo "=== Line $i ==="',
    '  grep -o \'"me":{[^}]*}\' /root/lead-generation-automation-v2/local_db/baileys_auth_line$i/creds.json || echo "No me field"',
    '  grep -o \'"registered":[a-z]*\' /root/lead-generation-automation-v2/local_db/baileys_auth_line$i/creds.json || echo "No registered field"',
    'done'
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
