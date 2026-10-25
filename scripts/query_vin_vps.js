const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const vin = 'JHLRD1851WC804433';
  const cmd = `
    echo "=== 1. DECODING VIN ON VPS (PORT 5000) ==="
    curl -s -X POST http://127.0.0.1:5000/api/vin/decode -H "Content-Type: application/json" -d '{"vin":"${vin}"}'
    echo ""
    echo "=== 2. FETCHING FULL REPORT ON VPS (PORT 5000) ==="
    curl -s -X POST http://127.0.0.1:5000/api/vin/report -H "Content-Type: application/json" -d '{"vin":"${vin}","bypassPayment":true}'
    echo ""
  `;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
