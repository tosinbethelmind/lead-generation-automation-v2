const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const VPS_HOST = '169.58.182.92';
const VPS_USER = 'root';
const VPS_PASS = 'bethelmind2026';
const REMOTE_ROOT = '/root/lead-generation-automation-v2';

const filesToUpload = [
  { local: 'scripts/nairaland_autonomous_engine.js', remote: `${REMOTE_ROOT}/scripts/nairaland_autonomous_engine.js` },
  { local: 'scripts/run_nairaland_daemon.js', remote: `${REMOTE_ROOT}/scripts/run_nairaland_daemon.js` },
  { local: 'local_db/nairaland_accounts.json', remote: `${REMOTE_ROOT}/local_db/nairaland_accounts.json` },
  { local: 'local_db/nairaland_campaigns.json', remote: `${REMOTE_ROOT}/local_db/nairaland_campaigns.json` },
  { local: 'local_db/nairaland_session.json', remote: `${REMOTE_ROOT}/local_db/nairaland_session.json` },
  { local: 'local_db/nairaland_session_kenetwork2026.json', remote: `${REMOTE_ROOT}/local_db/nairaland_session_kenetwork2026.json` },
  { local: 'local_db/nairaland_session_4thmainland.json', remote: `${REMOTE_ROOT}/local_db/nairaland_session_4thmainland.json` }
];

async function deploy() {
  console.log(`Connecting to Contabo VPS (${VPS_HOST})...`);
  const conn = new Client();

  conn.on('ready', () => {
    console.log('✓ SSH Connected. Ensuring remote directories exist...');
    
    conn.exec(`mkdir -p ${REMOTE_ROOT}/scripts ${REMOTE_ROOT}/local_db`, (err, stream) => {
      if (err) throw err;
      stream.on('close', () => {
        console.log('✓ Remote directories ready. Opening SFTP...');
        conn.sftp(async (err, sftp) => {
          if (err) throw err;

          for (const f of filesToUpload) {
            const localPath = path.resolve(__dirname, '..', f.local);
            if (!fs.existsSync(localPath)) {
              console.warn(`File not found: ${localPath}`);
              continue;
            }
            const content = fs.readFileSync(localPath);
            await new Promise((resolve, reject) => {
              sftp.writeFile(f.remote, content, (err) => {
                if (err) return reject(err);
                console.log(`✓ Uploaded: ${f.local} -> ${f.remote}`);
                resolve();
              });
            });
          }

          console.log('\nAll files transferred. Launching PM2 process on VPS...');
          const pm2Cmd = `
            cd ${REMOTE_ROOT}
            pm2 delete bethelmind-nairaland-bumper 2>/dev/null || true
            pm2 start scripts/run_nairaland_daemon.js --name "bethelmind-nairaland-bumper" --max-memory-restart 250M
            pm2 save
            echo "=== WAITING 5 SECONDS FOR STARTUP ==="
            sleep 5
            echo "=== PM2 STATUS ==="
            pm2 status bethelmind-nairaland-bumper
            echo "=== INITIAL LOGS ==="
            pm2 logs bethelmind-nairaland-bumper --lines 20 --nostream
          `;

          conn.exec(pm2Cmd, (err, stream) => {
            if (err) throw err;
            stream.on('data', d => process.stdout.write(d));
            stream.stderr.on('data', d => process.stderr.write(d));
            stream.on('close', (code) => {
              console.log(`\n✓ VPS PM2 deployment completed with code: ${code}`);
              conn.end();
            });
          });
        });
      });
    });
  }).on('error', (err) => {
    console.error('SSH Connection Error:', err.message);
  }).connect({
    host: VPS_HOST,
    port: 22,
    username: VPS_USER,
    password: VPS_PASS,
    readyTimeout: 30000
  });
}

deploy();
