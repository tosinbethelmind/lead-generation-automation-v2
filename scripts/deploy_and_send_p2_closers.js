const { Client } = require('ssh2');
const path = require('path');

const VPS_CONFIG = {
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000,
  keepaliveInterval: 10000
};

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ SSH ready. Opening SFTP...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const localFile = path.join(__dirname, 'send_pillar2_closers.js');
    const remoteFile = '/root/lead-generation-automation-v2/scripts/send_pillar2_closers.js';

    sftp.fastPut(localFile, remoteFile, (uploadErr) => {
      if (uploadErr) throw uploadErr;
      console.log('📦 Uploaded send_pillar2_closers.js to VPS.');

      console.log('🚀 Executing node /root/lead-generation-automation-v2/scripts/send_pillar2_closers.js on VPS...');
      conn.exec('node /root/lead-generation-automation-v2/scripts/send_pillar2_closers.js', (execErr, stream) => {
        if (execErr) throw execErr;
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', () => {
          conn.end();
          console.log('🏁 Execution finished.');
        });
      });
    });
  });
}).connect(VPS_CONFIG);
