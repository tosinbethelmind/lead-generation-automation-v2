const { generateSectorPdf } = require('./generate_sector_tool_pdf');
const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

async function runBatchGeneration() {
  const tools = ['solar-boq', 'fake-alert-shield', 'school-portal', 'p2p-arbitrage', 'mortgage-calculator'];
  const generatedReports = [];

  for (const t of tools) {
    console.log(`Generating PDF for ${t}...`);
    try {
      const res = await generateSectorPdf(t);
      generatedReports.push({ tool: t, ...res });
    } catch (e) {
      console.error(`Failed to generate ${t}:`, e.message);
    }
  }

  console.log(`\nGenerated ${generatedReports.length} reports locally.`);
  console.log('Now syncing reports to VPS port 5000 (/var/www/naija-hub/tokunbo-vin-checker/public/reports/)...');

  const conn = new Client();
  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) throw err;

      let remaining = generatedReports.length;
      if (remaining === 0) { conn.end(); return; }

      for (const item of generatedReports) {
        const remoteDest = `/var/www/naija-hub/tokunbo-vin-checker/public/reports/${item.filename}`;
        sftp.fastPut(item.pdfPath, remoteDest, (err2) => {
          if (err2) console.error(`SFTP error on ${item.filename}:`, err2.message);
          else console.log(`✓ Synced to VPS: http://169.58.182.92:5000/reports/${item.filename}`);

          remaining--;
          if (remaining === 0) {
            console.log('\n✓ All sector reports successfully synchronized to VPS!');
            conn.end();
          }
        });
      }
    });
  }).connect({
    host: '169.58.182.92',
    port: 22,
    username: 'root',
    password: 'bethelmind2026',
    readyTimeout: 30000
  });
}

runBatchGeneration().catch(console.error);
