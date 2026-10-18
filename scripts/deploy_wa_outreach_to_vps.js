const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const filesToUpload = [
  {
    local: path.join(__dirname, 'multi_line_whatsapp_outbound_engine.js'),
    remote: '/root/lead-generation-automation-v2/scripts/multi_line_whatsapp_outbound_engine.js'
  },
  {
    local: path.join(__dirname, 'deep_landing_page_and_tool_tester.js'),
    remote: '/root/lead-generation-automation-v2/scripts/deep_landing_page_and_tool_tester.js'
  },
  {
    local: path.join(__dirname, 'dispatch_120_sms_campaign.js'),
    remote: '/root/lead-generation-automation-v2/scripts/dispatch_120_sms_campaign.js'
  }
];

console.log('Connecting to VPS to upload outreach scripts & QA guard...');

conn.on('ready', () => {
  console.log('SSH connection established!');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    let index = 0;
    function uploadNext() {
      if (index >= filesToUpload.length) {
        console.log('✅ All scripts & QA modules uploaded successfully!');
        restartServices();
        return;
      }

      const item = filesToUpload[index++];
      console.log(`Uploading ${path.basename(item.local)} -> ${item.remote}...`);
      const readStream = fs.createReadStream(item.local);
      const writeStream = sftp.createWriteStream(item.remote);

      writeStream.on('close', () => {
        uploadNext();
      });

      readStream.pipe(writeStream);
    }

    function restartServices() {
      console.log('Restarting bethelmind-wa-outreach with QA Pre-Flight Guard on VPS...');

      const cmd = `
        cd /root/lead-generation-automation-v2
        pm2 delete bethelmind-wa-outreach 2>/dev/null || true
        pm2 start scripts/multi_line_whatsapp_outbound_engine.js --name "bethelmind-wa-outreach" --max-memory-restart 200M
        pm2 save
        pm2 list
        echo "=== WAITING 6 SECONDS FOR ENGINE INITIALIZATION & PRE-FLIGHT CHECK ==="
        sleep 6
        pm2 logs bethelmind-wa-outreach --lines 25 --nostream
      `;

      conn.exec(cmd, (execErr, stream) => {
        if (execErr) throw execErr;
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', (code) => {
          console.log(`\nPM2 update complete with exit code: ${code}`);
          conn.end();
        });
      });
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
  readyTimeout: 45000,
  keepaliveInterval: 10000
});
