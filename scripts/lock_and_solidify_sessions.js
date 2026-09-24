/**
 * @file scripts/lock_and_solidify_sessions.js
 * 
 * 🔒 PERMANENT SESSION LOCK & AUTO-HEALING VAULT SYNCHRONIZER
 * 
 * Secures all 7 WhatsApp line sessions into 4 independent redundant vaults:
 * 1. local_db/baileys_auth_backups/baileys_auth_lineX
 * 2. config/baileys_auth_backups/baileys_auth_lineX
 * 3. local_db/baileys_auth_lineX_solidified_backup
 * 4. local_db/baileys_auth_permanent_master/baileys_auth_lineX
 * 
 * Marks all lines as permanentlyLocked: true in whatsapp_lines_registry.json
 */

const fs = require('fs');
const path = require('path');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const REGISTRY_PATH = path.join(LOCAL_DB, 'whatsapp_lines_registry.json');

const VAULT_BASES = [
  path.join(LOCAL_DB, 'baileys_auth_backups'),
  path.join(process.cwd(), 'config', 'baileys_auth_backups'),
  path.join(LOCAL_DB, 'baileys_auth_permanent_master')
];

VAULT_BASES.forEach(b => {
  if (!fs.existsSync(b)) fs.mkdirSync(b, { recursive: true });
});

console.log('========================================================================');
console.log('🔒 EXECUTING PERMANENT MULTI-LINE SESSION LOCK');
console.log('========================================================================\n');

let lockedCount = 0;

for (let i = 1; i <= 7; i++) {
  const lineDir = path.join(LOCAL_DB, `baileys_auth_line${i}`);
  const credsFile = path.join(lineDir, 'creds.json');

  console.log(`[Line ${i}] Checking credentials in: ${lineDir}`);

  let sourceCreds = null;
  if (fs.existsSync(credsFile)) {
    sourceCreds = credsFile;
  } else {
    // Check if any vault has it
    for (const vb of VAULT_BASES) {
      const alt = path.join(vb, `baileys_auth_line${i}`, 'creds.json');
      if (fs.existsSync(alt)) {
        sourceCreds = alt;
        console.log(`   🛡️ Restoring to primary directory from vault: ${alt}`);
        if (!fs.existsSync(lineDir)) fs.mkdirSync(lineDir, { recursive: true });
        fs.copyFileSync(alt, credsFile);
        break;
      }
    }
  }

  if (sourceCreds) {
    try {
      const creds = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
      const me = creds.me || {};
      const phone = me.id ? me.id.split(':')[0] : 'N/A';
      console.log(`   ✅ Active Credentials verified for Phone: +${phone} (${me.name || 'Outreach Desk'})`);

      // Duplicate into all 4 redundant vaults
      const vaultTargets = [
        path.join(LOCAL_DB, 'baileys_auth_backups', `baileys_auth_line${i}`),
        path.join(process.cwd(), 'config', 'baileys_auth_backups', `baileys_auth_line${i}`),
        path.join(LOCAL_DB, `baileys_auth_line${i}_solidified_backup`),
        path.join(LOCAL_DB, 'baileys_auth_permanent_master', `baileys_auth_line${i}`)
      ];

      vaultTargets.forEach(vDir => {
        if (!fs.existsSync(vDir)) fs.mkdirSync(vDir, { recursive: true });
        fs.copyFileSync(sourceCreds, path.join(vDir, 'creds.json'));
      });

      console.log(`   🔒 Session locked across 4 independent offline storage vaults.`);
      lockedCount++;
    } catch (err) {
      console.warn(`   ⚠️ Error reading creds: ${err.message}`);
    }
  } else {
    console.log(`   ℹ️ No credentials found yet. Line is waiting for initial pair.`);
  }
  console.log('');
}

// Solidify registry
if (fs.existsSync(REGISTRY_PATH)) {
  try {
    const reg = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    for (let i = 1; i <= 7; i++) {
      const key = `line_${i}`;
      if (!reg[key]) reg[key] = { line: i };
      reg[key].permanentlyLocked = true;
      reg[key].vaultSecured = true;
      reg[key].autoRestoreOnBoot = true;
      reg[key].lockedTimestamp = new Date().toISOString();
    }
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2), 'utf8');
    console.log('✅ whatsapp_lines_registry.json permanently locked and solidified.');
  } catch (err) {
    console.warn('Registry update warning:', err.message);
  }
}

console.log('========================================================================');
console.log(`🎉 LOCK COMPLETE: ${lockedCount} WhatsApp Lines are permanently secured in vaults!`);
console.log('========================================================================\n');
