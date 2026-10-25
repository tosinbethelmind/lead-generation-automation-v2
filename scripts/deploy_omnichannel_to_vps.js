const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const scriptFiles = [
  'pinterest_infographic_generator.js',
  'pinterest_autonomous_engine.js',
  'reddit_autonomous_engine.js',
  'quora_autonomous_engine.js',
  'omnichannel_social_master.js'
];

const pinFiles = [
  'tokunbo-vin-pin.png',
  'p2p-arbitrage-pin.png',
  'solar-boq-pin.png',
  'fake-alert-pin.png',
  'pins_manifest.json'
];

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to Contabo VPS (169.58.182.92)...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    // Helper for sequential fastPut
    async function uploadAll() {
      for (const f of scriptFiles) {
        const local = path.join(__dirname, f);
        const remote = `/root/lead-generation-automation-v2/scripts/${f}`;
        await new Promise((res, rej) => {
          sftp.fastPut(local, remote, (errP) => {
            if (errP) {
              console.error(`Failed ${f}:`, errP.message);
              rej(errP);
            } else {
              console.log(`✓ Uploaded script: ${f}`);
              res();
            }
          });
        });
      }

      for (const p of pinFiles) {
        const localP = path.join(__dirname, '..', 'public', 'pins', p);
        const remoteP = `/root/lead-generation-automation-v2/public/pins/${p}`;
        if (fs.existsSync(localP)) {
          await new Promise((res, rej) => {
            sftp.fastPut(localP, remoteP, (errP) => {
              if (errP) {
                console.error(`Failed pin ${p}:`, errP.message);
                rej(errP);
              } else {
                console.log(`✓ Uploaded pin asset: ${p}`);
                res();
              }
            });
          });
        }
      }

      console.log('All files uploaded successfully!');
      conn.end();
    }

    uploadAll().catch(e => {
      console.error('Upload sequence error:', e);
      conn.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
