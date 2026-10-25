const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const local = path.join(__dirname, 'generate_vin_pdf_report.js');
    const remote = '/root/lead-generation-automation-v2/scripts/generate_vin_pdf_report.js';
    sftp.fastPut(local, remote, (err2) => {
      if (err2) throw err2;
      console.log('Uploaded generate_vin_pdf_report.js to VPS, executing...');
      conn.exec('cd /root/lead-generation-automation-v2 && node scripts/generate_vin_pdf_report.js', (err3, stream) => {
        if (err3) throw err3;
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', (code) => {
          console.log(`VPS PDF Generator exited with code: ${code}`);
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
