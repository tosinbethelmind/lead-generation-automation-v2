const { Client } = require('ssh2');

function sendSmsViaVps(phone, message) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      const payload = JSON.stringify({ to: phone, message });
      // Escape for bash single quotes
      const escapedPayload = payload.replace(/'/g, "'\\''");
      const cmd = `curl -s -w "\\nHTTP_STATUS: %{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: f34af5ea-f657-41b1-b83e-4a59eb786e57" -d '${escapedPayload}' http://100.107.243.108:8082/`;
      
      conn.exec(cmd, (err, stream) => {
        if (err) { conn.end(); return reject(err); }
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
          conn.end();
          const match = out.match(/HTTP_STATUS: (\d+)/);
          const status = match ? parseInt(match[1]) : 0;
          if (status === 200) {
            resolve({ success: true, out });
          } else {
            resolve({ success: false, status, out });
          }
        });
      });
    }).on('error', reject)
    .connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 10000 });
  });
}

sendSmsViaVps('+2348022791227', 'Bethelmind Dual Test: SMS + Email with Voice Note ready!')
  .then(res => console.log('RESULT:', res))
  .catch(console.error);
