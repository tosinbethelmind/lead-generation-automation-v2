const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('SSH connection established!');
  
  // Let's inspect the last 200 lines of SMS logs on VPS
  const cmd = `
    echo "=== SMS OUT LOG (LAST 40 LINES) ==="
    tail -n 40 /root/.pm2/logs/bethelmind-airtel-sms-out.log
    
    echo "=== TODAY & YESTERDAY SMS LOGS / STATS ==="
    if [ -f /root/lead-generation-automation-v2/local_db/sms_dispatches.json ]; then
      wc -l /root/lead-generation-automation-v2/local_db/sms_dispatches.json
      tail -n 15 /root/lead-generation-automation-v2/local_db/sms_dispatches.json
    fi
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', () => {
      conn.end();
    });
  });
}).on('error', err => {
  console.error('SSH Error:', err.message);
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
