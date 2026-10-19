const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const files = [
  { local: path.join(__dirname, 'lib/nameSanitizer.js'), remote: '/root/lead-generation-automation-v2/scripts/lib/nameSanitizer.js' },
  { local: path.join(__dirname, 'leadClassifier.js'), remote: '/root/lead-generation-automation-v2/scripts/leadClassifier.js' },
  { local: path.join(__dirname, 'lib/closer_engine.js'), remote: '/root/lead-generation-automation-v2/scripts/lib/closer_engine.js' },
  { local: path.join(__dirname, 'multi_line_whatsapp_outbound_engine.js'), remote: '/root/lead-generation-automation-v2/scripts/multi_line_whatsapp_outbound_engine.js' },
  { local: path.join(__dirname, 'dispatch_120_sms_campaign.js'), remote: '/root/lead-generation-automation-v2/scripts/dispatch_120_sms_campaign.js' }
];

console.log('Connecting to VPS to upload updated scripts...');

conn.on('ready', () => {
  console.log('SSH connection established!');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    let idx = 0;
    function uploadNext() {
      if (idx >= files.length) {
        console.log('All files uploaded successfully! Restarting PM2 processes...');
        conn.exec('pm2 restart bethelmind-evolution bethelmind-wa-outreach && pm2 save', (execErr, stream) => {
          if (execErr) throw execErr;
          stream.on('data', d => process.stdout.write(d));
          stream.stderr.on('data', d => process.stderr.write(d));
          stream.on('close', (code) => {
            console.log(`\nPM2 restart complete with code: ${code}`);
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
