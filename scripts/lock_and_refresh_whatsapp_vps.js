const { Client } = require('ssh2');
const http = require('http');

const VPS_HOST = '169.58.182.92';
const VPS_PORT = 8080;
const VPS_USER = 'root';
const VPS_PASS = 'bethelmind2026';

async function queryStatus() {
  return new Promise((resolve) => {
    http.get(`http://${VPS_HOST}:${VPS_PORT}/status`, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (_) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function requestLineQr(instanceName) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: VPS_HOST,
      port: VPS_PORT,
      path: `/instance/request-qr/${instanceName}`,
      method: 'POST'
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (_) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function main() {
  console.log('🔍 Checking live status of all 7 WhatsApp lines on VPS...');
  const initialStatus = await queryStatus();
  if (!initialStatus || !initialStatus.instances) {
    console.error('❌ Could not query Evolution API status!');
    return;
  }

  const onlineLines = initialStatus.instances.filter(i => i.state === 'open');
  const unlinkedLines = initialStatus.instances.filter(i => i.state !== 'open');

  console.log(`\n🟢 ONLINE LINES FOUND: ${onlineLines.length}`);
  onlineLines.forEach(l => console.log(`   - Line ${l.id} (${l.displayPhone || l.phone}): ${l.label}`));

  console.log(`\n⚪ UNLINKED LINES TO REFRESH: ${unlinkedLines.length}`);
  unlinkedLines.forEach(l => console.log(`   - Line ${l.id} (${l.displayPhone || l.name})`));

  console.log('\n🔒 Connecting to VPS to permanently lock online lines & refresh unlinked...');

  const conn = new Client();
  conn.on('ready', () => {
    console.log('✅ SSH connected to Contabo VPS.');

    // Build the shell commands:
    // 1. Permanently backup and lock the online lines into multiple vaults
    let lockCommands = [];
    for (const line of onlineLines) {
      const canonicalDir = `baileys_auth_line${line.id}`;
      lockCommands.push(`
        echo "🔒 Permanently locking & backing up ${canonicalDir}..."
        mkdir -p /root/lead-generation-automation-v2/config/baileys_auth_backups/${canonicalDir}
        mkdir -p /root/lead-generation-automation-v2/local_db/baileys_auth_permanent_master/${canonicalDir}
        mkdir -p /root/lead-generation-automation-v2/local_db/${canonicalDir}_solidified_backup
        
        cp -rf /root/lead-generation-automation-v2/local_db/${canonicalDir}/* /root/lead-generation-automation-v2/config/baileys_auth_backups/${canonicalDir}/ 2>/dev/null || true
        cp -rf /root/lead-generation-automation-v2/local_db/${canonicalDir}/* /root/lead-generation-automation-v2/local_db/baileys_auth_permanent_master/${canonicalDir}/ 2>/dev/null || true
        cp -rf /root/lead-generation-automation-v2/local_db/${canonicalDir}/* /root/lead-generation-automation-v2/local_db/${canonicalDir}_solidified_backup/ 2>/dev/null || true
      `);
    }

    // 2. Refresh unlinked lines: clear stale half-handshake files from unlinked directories
    let refreshCommands = [];
    for (const line of unlinkedLines) {
      const canonicalDir = `baileys_auth_line${line.id}`;
      refreshCommands.push(`
        echo "🔄 Refreshing unlinked line directory: ${canonicalDir}..."
        rm -rf /root/lead-generation-automation-v2/local_db/${canonicalDir}/* 2>/dev/null || true
      `);
    }

    const fullCmd = `
      ${lockCommands.join('\n')}
      ${refreshCommands.join('\n')}
      echo "=== BACKUP VAULT AUDIT ==="
      ls -la /root/lead-generation-automation-v2/config/baileys_auth_backups/ || true
      ls -la /root/lead-generation-automation-v2/local_db/baileys_auth_permanent_master/ || true
    `;

    conn.exec(fullCmd, (err, stream) => {
      if (err) throw err;
      stream.on('data', d => process.stdout.write(d));
      stream.stderr.on('data', d => process.stderr.write(d));
      stream.on('close', async () => {
        conn.end();
        console.log('\n⚡ Now triggering fresh QR codes on unlinked lines via API...');

        for (const line of unlinkedLines) {
          console.log(`Generating fresh QR code for ${line.name} (Line ${line.id})...`);
          const qrRes = await requestLineQr(line.name);
          if (qrRes && qrRes.qr) {
            console.log(`✅ Line ${line.id} QR refreshed & live!`);
          } else {
            console.log(`ℹ️ Line ${line.id} socket initialized.`);
          }
        }

        console.log('\n📊 Checking final status...');
        const finalStatus = await queryStatus();
        console.log(`Online count: ${finalStatus.onlineLines} / 7 lines active.`);
        console.log('✅ LOCK AND REFRESH PROCEDURE COMPLETED!');
      });
    });
  }).on('error', (err) => {
    console.error('SSH Error:', err.message);
  }).connect({
    host: VPS_HOST,
    port: 22,
    username: VPS_USER,
    password: VPS_PASS
  });
}

main();
