const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const vin = 'JHLRD1851WC804433';
  const cmd = `curl -s -X POST http://127.0.0.1:5000/api/vin/report -H "Content-Type: application/json" -d '{"vin":"${vin}","bypassPayment":true}'`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      try {
        const json = JSON.parse(out);
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Raw output:', out);
      }
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
