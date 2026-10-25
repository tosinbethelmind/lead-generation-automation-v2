const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  const vin = 'JHLRD1851WC804433';
  const remotePdf = `/root/lead-generation-automation-v2/public/reports/REP-${vin}.pdf`;
  const localDir = path.join(__dirname, '..', 'public', 'reports');
  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
  const localPdf = path.join(localDir, `REP-${vin}.pdf`);

  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastGet(remotePdf, localPdf, (err2) => {
      if (err2) throw err2;
      console.log('✓ Successfully downloaded generated PDF to:', localPdf);
      
      // Also copy on VPS to /var/www/naija-hub/tokunbo-vin-checker/public/reports/
      conn.exec(`mkdir -p /var/www/naija-hub/tokunbo-vin-checker/public/reports && cp ${remotePdf} /var/www/naija-hub/tokunbo-vin-checker/public/reports/`, (err3, stream3) => {
        if (err3) throw err3;
        stream3.on('close', () => {
          console.log('✓ Mirrored PDF to /var/www/naija-hub/tokunbo-vin-checker/public/reports/');
          conn.end();
        });
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
