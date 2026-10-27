const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  const local = path.join(__dirname, 'autonomous_growth_and_conversion_supervisor.js');
  const remote = '/root/lead-generation-automation-v2/scripts/autonomous_growth_and_conversion_supervisor.js';

  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(local, remote, (err2) => {
      if (err2) throw err2;
      console.log('✓ Uploaded autonomous growth supervisor to VPS');

      // Register or restart on PM2
      const cmd = `pm2 delete bethelmind-growth-supervisor 2>/dev/null || true && pm2 start /root/lead-generation-automation-v2/scripts/autonomous_growth_and_conversion_supervisor.js --name bethelmind-growth-supervisor --max-memory-restart 60M && pm2 save`;
      conn.exec(cmd, (err3, stream) => {
        if (err3) throw err3;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
          console.log('VPS PM2 Output:\n' + out);
          conn.end();
        });
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
