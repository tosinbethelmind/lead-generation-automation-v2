const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const local = path.join(__dirname, 'test_turnstile_click_coords.js');
    const remote = '/root/lead-generation-automation-v2/scripts/test_turnstile_click_coords.js';
    sftp.fastPut(local, remote, (err2) => {
      if (err2) throw err2;
      console.log('Uploaded script to VPS, executing...');
      conn.exec('cd /root/lead-generation-automation-v2 && node scripts/test_turnstile_click_coords.js', (err3, stream) => {
        if (err3) throw err3;
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
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
