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
  console.log('✅ SSH connected to Contabo VPS (169.58.182.92).');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      return;
    }

    const filesToUpload = [
      {
        local: path.join(__dirname, 'lib', 'pillar2_closer.js'),
        remote: '/root/lead-generation-automation-v2/scripts/lib/pillar2_closer.js'
      },
      {
        local: path.join(__dirname, 'send_pillar2_closers.js'),
        remote: '/root/lead-generation-automation-v2/scripts/send_pillar2_closers.js'
      }
    ];

    let completed = 0;
    filesToUpload.forEach(({ local, remote }) => {
      sftp.fastPut(local, remote, (uploadErr) => {
        if (uploadErr) {
          console.error(`❌ Upload failed for ${local}:`, uploadErr);
        } else {
          console.log(`📦 Synced ${path.basename(local)} -> ${remote}`);
        }
        completed++;
        if (completed === filesToUpload.length) {
          console.log('🔄 Restarting bethelmind-evolution on VPS...');
          conn.exec('pm2 restart bethelmind-evolution', (execErr, stream) => {
            if (execErr) {
              console.error('Exec error:', execErr);
              conn.end();
              return;
            }
            stream.on('data', d => process.stdout.write(d));
            stream.stderr.on('data', d => process.stderr.write(d));
            stream.on('close', () => {
              console.log('✅ VPS PM2 bethelmind-evolution successfully restarted with calibrated curation copy.');
              conn.end();
            });
          });
        }
      });
    });
  });
}).connect(VPS_CONFIG);
