const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Opening SFTP...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }
    const localContent = fs.readFileSync('scripts/vps_continuous_rotational_harvester.js');
    const remotePath = '/root/lead-generation-automation-v2/scripts/vps_continuous_rotational_harvester.js';
    
    sftp.writeFile(remotePath, localContent, (err) => {
      if (err) {
        console.error('Write error:', err);
        conn.end();
        return;
      }
      console.log('✅ File uploaded successfully to VPS:', remotePath);
      
      const cmd = `
        cd /root/lead-generation-automation-v2
        pm2 delete bethelmind-nationwide-scraper 2>/dev/null || true
        pm2 start scripts/vps_continuous_rotational_harvester.js --name "bethelmind-nationwide-scraper" --max-memory-restart 250M
        pm2 save
        echo "=== WAITING 6 SECONDS FOR PROCESS TO BOOT ==="
        sleep 6
        echo "=== PROCESS LOGS ==="
        pm2 logs bethelmind-nationwide-scraper --lines 25 --nostream
      `;
      conn.exec(cmd, (err, stream) => {
        if (err) {
          console.error('Exec error:', err);
          conn.end();
          return;
        }
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', code => {
          console.log(`\nPM2 deployment finished with exit code: ${code}`);
          conn.end();
        });
      });
    });
  });
}).on('error', err => {
  console.error('SSH Error:', err.message);
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
