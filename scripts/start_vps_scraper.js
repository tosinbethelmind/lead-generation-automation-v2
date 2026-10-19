/**
 * @file scripts/start_vps_scraper.js
 * Starts the 24/7 nationwide lead scraper daemon inside PM2 on Contabo VPS (169.58.182.92)
 */

const { Client } = require('ssh2');

const VPS_HOST = '169.58.182.92';
const VPS_USER = 'root';
const VPS_PASS = 'bethelmind2026';

const conn = new Client();

console.log(`Connecting to Contabo VPS (${VPS_HOST})...`);

conn.on('ready', () => {
  console.log('✅ Connected to VPS via SSH!');
  
  const cmd = `
    cd /root/lead-generation-automation-v2
    echo "=== PULLING LATEST CODE ON VPS ==="
    git fetch origin main
    git reset --hard origin/main
    
    echo "=== STARTING NATIONWIDE SCRAPER IN PM2 ==="
    pm2 delete bethelmind-nationwide-scraper 2>/dev/null || true
    pm2 start scripts/massive_10k_nationwide_harvester_daemon.js --name "bethelmind-nationwide-scraper" --max-memory-restart 300M
    pm2 save
    
    echo "=== CURRENT PM2 PROCESSES ==="
    pm2 list
    
    echo "=== WAITING 6 SECONDS FOR SCRAPER INITIALIZATION ==="
    sleep 6
    
    echo "=== SCRAPER LOGS ==="
    pm2 logs bethelmind-nationwide-scraper --lines 25 --nostream
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Exec error:', err.message);
      conn.end();
      return;
    }

    stream.on('close', (code) => {
      console.log(`\nCommand finished with exit code: ${code}`);
      conn.end();
    });

    stream.on('data', (data) => {
      process.stdout.write(data);
    });

    stream.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection Error:', err.message);
});

conn.connect({
  host: VPS_HOST,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 30000
});
