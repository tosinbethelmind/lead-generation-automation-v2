const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  const remoteCmd = `node -e '
    const fs = require("fs");
    const path = "/root/lead-generation-automation-v2/local_db/sms_dispatches.json";
    if (!fs.existsSync(path)) { console.log("Not found"); process.exit(0); }
    const list = JSON.parse(fs.readFileSync(path, "utf8"));
    const oct16 = list.filter(d => (d.timestamp || "").startsWith("2026-10-16"));
    console.log("Oct 16 leads messaged:", oct16.length);
    let msgs = 0;
    oct16.forEach(i => {
      if (i.prep_message) msgs++;
      if (i.link_message) msgs++;
      if (!i.prep_message && !i.link_message && (i.message || i.text)) msgs++;
    });
    console.log("Total SMS packets delivered:", msgs);
    console.log("Sample lead 0:", JSON.stringify(oct16[0]));
    console.log("Sample lead last:", JSON.stringify(oct16[oct16.length - 1]));
  '`;

  conn.exec(remoteCmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', () => conn.end());
  });
}).on('error', err => {
  console.error('SSH Error:', err.message);
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
