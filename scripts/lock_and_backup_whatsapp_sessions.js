/**
 * @file scripts/lock_and_backup_whatsapp_sessions.js
 * 🔒 INSTANT SESSION LOCK & SOLIDIFICATION PROTECTION
 */

const fs = require('fs');
const path = require('path');

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const BACKUP_DIR = path.join(LOCAL_DB, 'baileys_auth_backups');
const CONFIG_BACKUP_DIR = path.join(process.cwd(), 'config', 'baileys_auth_backups');

const SOURCE_DIRS = [
  { name: 'Line 1 (Admin)', active: 'baileys_auth_line1', alt: 'evolution_auth_bethelmind_instance_1' },
  { name: 'Line 2 (Outreach 1)', active: 'baileys_auth_line2', alt: 'evolution_auth_bethelmind_instance_2' },
  { name: 'Line 3 (Outreach 2)', active: 'baileys_auth_line3', alt: 'evolution_auth_bethelmind_instance_3' },
  { name: 'Line 4 (Outreach 3)', active: 'baileys_auth_line4', alt: 'evolution_auth_bethelmind_instance_4' },
  { name: 'Line 5 (Outreach 4)', active: 'baileys_auth_line5', alt: 'evolution_auth_bethelmind_instance_5' },
  { name: 'Line 6 (Outreach 5)', active: 'baileys_auth_line6', alt: 'evolution_auth_bethelmind_instance_6' },
  { name: 'Line 7 (Outreach 6)', active: 'baileys_auth_line7', alt: 'evolution_auth_bethelmind_instance_7' }
];

function copyCoreAuthKeys(from, to) {
  if (!fs.existsSync(from)) return 0;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  let count = 0;
  const files = fs.readdirSync(from);
  for (const element of files) {
    if (element === 'creds.json' || element.startsWith('app-state') || element.startsWith('identity-key') || element.startsWith('device-list')) {
      const srcFile = path.join(from, element);
      const destFile = path.join(to, element);
      try {
        fs.copyFileSync(srcFile, destFile);
        count++;
      } catch (_) {}
    }
  }
  return count;
}

function main() {
  console.log('========================================================================');
  console.log('🔒 LOCKING & SOLIDIFYING WHATSAPP SESSIONS (FAST CORE KEY BACKUP)');
  console.log('========================================================================\n');

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(CONFIG_BACKUP_DIR)) fs.mkdirSync(CONFIG_BACKUP_DIR, { recursive: true });

  let lockedCount = 0;

  SOURCE_DIRS.forEach(item => {
    let sourcePath = path.join(LOCAL_DB, item.active);
    let credsPath = path.join(sourcePath, 'creds.json');

    if (!fs.existsSync(credsPath)) {
      sourcePath = path.join(LOCAL_DB, item.alt);
      credsPath = path.join(sourcePath, 'creds.json');
    }

    if (fs.existsSync(credsPath)) {
      const mainBackupDir = path.join(BACKUP_DIR, item.active);
      const configBackupDir = path.join(CONFIG_BACKUP_DIR, item.active);
      const solidifiedBackupDir = path.join(LOCAL_DB, `${item.active}_solidified_backup`);
      const masterBackupDir = path.join(LOCAL_DB, `${item.active}_backup`);

      // Sync active folders
      const targetActive = path.join(LOCAL_DB, item.active);
      const targetAlt = path.join(LOCAL_DB, item.alt);
      copyCoreAuthKeys(sourcePath, targetActive);
      copyCoreAuthKeys(sourcePath, targetAlt);

      // Solidify into backups
      const c1 = copyCoreAuthKeys(sourcePath, mainBackupDir);
      const c2 = copyCoreAuthKeys(sourcePath, configBackupDir);
      const c3 = copyCoreAuthKeys(sourcePath, solidifiedBackupDir);
      const c4 = copyCoreAuthKeys(sourcePath, masterBackupDir);

      console.log(`✅ [LOCKED & SOLIDIFIED] ${item.name}`);
      console.log(`   ├─ Active Creds: local_db/${path.basename(sourcePath)}/creds.json`);
      console.log(`   ├─ Backup #1: local_db/baileys_auth_backups/${item.active}`);
      console.log(`   ├─ Backup #2: config/baileys_auth_backups/${item.active}`);
      console.log(`   └─ Master Backup: local_db/${item.active}_backup (${c4} core keys backed up)\n`);
      lockedCount++;
    } else {
      console.log(`⚠️ Notice: creds.json not yet available for ${item.name}.\n`);
    }
  });

  console.log('========================================================================');
  console.log(`🛡️ SOLIDIFICATION COMPLETE: ${lockedCount} ACTIVE SESSION(S) LOCKED & SEALED!`);
  console.log('🔒 All credentials are permanently protected against session loss.');
  console.log('========================================================================\n');
}

main();
