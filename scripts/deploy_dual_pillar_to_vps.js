const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const files = [
  { local: path.join(__dirname, 'lib/pillar2_closer.js'), remote: '/root/lead-generation-automation-v2/scripts/lib/pillar2_closer.js' },
  { local: path.join(__dirname, 'lib/closer_engine.js'), remote: '/root/lead-generation-automation-v2/scripts/lib/closer_engine.js' },
  { local: path.join(__dirname, 'lib/gemini_closer.js'), remote: '/root/lead-generation-automation-v2/scripts/lib/gemini_closer.js' }
];

console.log('Connecting to Contabo VPS (169.58.182.92) to deploy Dual-Pillar Closer Intelligence...');

conn.on('ready', () => {
  console.log('SSH connection established!');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    let idx = 0;
    function uploadNext() {
      if (idx >= files.length) {
        console.log('All Dual-Pillar files uploaded successfully! Restarting PM2 bethelmind-evolution...');
        conn.exec('pm2 restart bethelmind-evolution && pm2 save', (execErr, stream) => {
          if (execErr) throw execErr;
          stream.on('data', d => process.stdout.write(d));
          stream.stderr.on('data', d => process.stderr.write(d));
          stream.on('close', (code) => {
            console.log(`\n✅ PM2 restart complete with code: ${code}`);
            conn.end();
          });
        });
        return;
      }

      const item = files[idx++];
      console.log(`Uploading ${path.basename(item.local)} -> ${item.remote}...`);
      const readStream = fs.createReadStream(item.local);
      const writeStream = sftp.createWriteStream(item.remote);
      writeStream.on('close', () => {
        console.log(`✅ ${path.basename(item.local)} uploaded.`);
        uploadNext();
      });
      readStream.pipe(writeStream);
    }

    uploadNext();
  });
}).on('error', (err) => {
  console.error('SSH Error:', err.message);
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
