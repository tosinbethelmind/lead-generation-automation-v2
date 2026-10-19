/**
 * @file scripts/sync_today_telemetry_to_vps.js
 * 
 * Synchronizes today's confirmed real-action logs (SMS, Emails, Lead Journeys) 
 * and updated evolution_api_server.js to the Contabo VPS (169.58.182.92).
 */

const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const rootDir = path.join(__dirname, '..');

const files = [
  { 
    local: path.join(__dirname, 'evolution_api_server.js'), 
    remote: '/root/lead-generation-automation-v2/scripts/evolution_api_server.js' 
  },
  { 
    local: path.join(rootDir, 'local_db', 'sms_dispatches.json'), 
    remote: '/root/lead-generation-automation-v2/local_db/sms_dispatches.json' 
  },
  { 
    local: path.join(rootDir, 'local_db', 'email_dispatches.json'), 
    remote: '/root/lead-generation-automation-v2/local_db/email_dispatches.json' 
  },
  { 
    local: path.join(rootDir, 'local_db', 'lead_journeys.json'), 
    remote: '/root/lead-generation-automation-v2/local_db/lead_journeys.json' 
  },
  { 
    local: path.join(rootDir, 'local_db', 'activities.json'), 
    remote: '/root/lead-generation-automation-v2/local_db/activities.json' 
  }
];

console.log('Connecting to VPS (169.58.182.92) to synchronize telemetry and API server...');

conn.on('ready', () => {
  console.log('✅ SSH connection established!');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      return;
    }

    let idx = 0;
    function uploadNext() {
      if (idx >= files.length) {
        console.log('All telemetry databases uploaded successfully! Restarting bethelmind-evolution on PM2...');
        conn.exec('pm2 restart bethelmind-evolution && pm2 status', (execErr, stream) => {
          if (execErr) {
            console.error('Exec error:', execErr);
            conn.end();
            return;
          }
          stream.on('data', d => process.stdout.write(d));
          stream.stderr.on('data', d => process.stderr.write(d));
          stream.on('close', (code) => {
            console.log(`\n✅ bethelmind-evolution restarted with code: ${code}`);
            conn.end();
          });
        });
        return;
      }

      const item = files[idx++];
      if (!fs.existsSync(item.local)) {
        console.warn(`⚠️ Skipping missing local file: ${item.local}`);
        uploadNext();
        return;
      }

      console.log(`Uploading ${path.basename(item.local)} (${fs.statSync(item.local).size} bytes) -> ${item.remote}...`);
      const readStream = fs.createReadStream(item.local);
      const writeStream = sftp.createWriteStream(item.remote);
      writeStream.on('close', () => {
        console.log(`✅ ${path.basename(item.local)} synced to VPS.`);
        uploadNext();
      });
      writeStream.on('error', (wErr) => {
        console.error(`SFTP write error for ${item.remote}:`, wErr);
        uploadNext();
      });
      readStream.pipe(writeStream);
    }

    uploadNext();
  });
}).on('error', (err) => {
  console.error('SSH Connection Error:', err.message);
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
