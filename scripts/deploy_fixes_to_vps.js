/**
 * @file scripts/deploy_fixes_to_vps.js
 * Sequential SFTP upload to Contabo VPS with clean error handling.
 */

const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const VPS_CONFIG = {
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000,
  keepaliveInterval: 10000
};

const FILES_TO_SYNC = [
  { local: 'scripts/lib/bankable_invoice.js', remote: '/root/lead-generation-automation-v2/scripts/lib/bankable_invoice.js' },
  { local: 'scripts/lib/closer_engine.js', remote: '/root/lead-generation-automation-v2/scripts/lib/closer_engine.js' },
  { local: 'local_db/commercial_invoices.json', remote: '/root/lead-generation-automation-v2/local_db/commercial_invoices.json' },
  { local: 'scripts/evolution_api_server.js', remote: '/root/lead-generation-automation-v2/scripts/evolution_api_server.js' },
  { local: 'scripts/lib/pillar2_closer.js', remote: '/root/lead-generation-automation-v2/scripts/lib/pillar2_closer.js' },
  { local: 'scripts/lib/pillar2_contacts_registry.js', remote: '/root/lead-generation-automation-v2/scripts/lib/pillar2_contacts_registry.js' },
  { local: 'scripts/lib/gemini_closer.js', remote: '/root/lead-generation-automation-v2/scripts/lib/gemini_closer.js' },
  { local: 'src/lib/pillar2/pillar2Engine.ts', remote: '/root/lead-generation-automation-v2/src/lib/pillar2/pillar2Engine.ts' }
];

function uploadSingleFile(sftp, localFile, remoteFile) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err) => {
      if (err) return reject(err);
      console.log(`📦 Synced: ${localFile} -> ${remoteFile}`);
      resolve();
    });
  });
}

function runRemoteCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', d => out += d);
      stream.stderr.on('data', d => out += d);
      stream.on('close', () => resolve(out));
    });
  });
}

async function deploy() {
  console.log('🚀 Connecting to Contabo VPS (169.58.182.92)...');
  const conn = new Client();

  conn.on('error', (err) => {
    console.error('SSH Connection error:', err.message);
  });

  conn.on('ready', async () => {
    console.log('✅ SSH Connection established. Opening SFTP session...');
    
    // Ensure remote lib & local_db directory exists first
    await runRemoteCommand(conn, 'mkdir -p /root/lead-generation-automation-v2/scripts/lib /root/lead-generation-automation-v2/src/lib/pillar2 /root/lead-generation-automation-v2/local_db');

    conn.sftp(async (err, sftp) => {
      if (err) {
        console.error('SFTP Error:', err);
        conn.end();
        return;
      }

      try {
        for (const item of FILES_TO_SYNC) {
          const localPath = path.join(process.cwd(), item.local);
          if (fs.existsSync(localPath)) {
            await uploadSingleFile(sftp, localPath, item.remote);
          } else {
            console.warn(`⚠️ Local file not found: ${localPath}`);
          }
        }

        console.log('\n🔄 Restarting PM2 bethelmind-evolution on VPS...');
        const pm2Result = await runRemoteCommand(conn, 'pm2 restart bethelmind-evolution && pm2 status bethelmind-evolution');
        console.log('📊 PM2 STATUS:\n', pm2Result);

      } catch (uploadErr) {
        console.error('Upload Error:', uploadErr.message);
      } finally {
        sftp.end();
        conn.end();
        console.log('✅ Deployment process finished.');
      }
    });
  }).connect(VPS_CONFIG);
}

deploy().catch(console.error);
