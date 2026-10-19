const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const payload = JSON.stringify({
    to: '+2348022791227',
    message: 'Bethelmind test: Airtel SMS Gateway successfully connected over Tailscale!'
  });
  
  // Try POST / with Authorization header
  const cmd = `curl -s -w "\\nHTTP_STATUS: %{http_code}\\n" -X POST -H "Content-Type: application/json" -H "Authorization: f34af5ea-f657-41b1-b83e-4a59eb786e57" -d '${payload}' http://100.107.243.108:8082/`;
  console.log('Executing on VPS:', cmd);

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('SMS GATEWAY OUTPUT:\n', out);
      conn.end();
    });
  });
}).on('error', e => console.error('SSH Error:', e.message))
.connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
