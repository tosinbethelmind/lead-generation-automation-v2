const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const localPath = path.join(__dirname, 'evolution_api_server.js');
const remotePath = '/root/lead-generation-automation-v2/scripts/evolution_api_server.js';

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected. Uploading evolution_api_server.js via SFTP...');
  c.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) throw err;
      console.log('Uploaded successfully! Restarting pm2 bethelmind-evolution...');
      c.exec('pm2 restart bethelmind-evolution', (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.stderr.on('data', d => out += d);
        stream.on('close', () => {
          console.log(out);
          c.end();
        });
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
