const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const remotePath = '/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js';
    const localPath = 'scripts/nairaland_autonomous_engine_vps.js';
    sftp.fastGet(remotePath, localPath, (err2) => {
      if (err2) throw err2;
      console.log('Successfully downloaded nairaland_autonomous_engine.js from VPS to', localPath);
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
