const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `node -e "
    const fs = require('fs');
    console.log('=== VPS NAIRALAND DB ===');
    try {
      const nl = JSON.parse(fs.readFileSync('/root/lead-generation-automation-v2/local_db/nairaland_campaigns.json', 'utf8'));
      console.log(JSON.stringify(nl, null, 2));
    } catch(e) { console.log('NL err:', e.message); }

    console.log('=== VPS OMNICHANNEL DB ===');
    try {
      const oc = JSON.parse(fs.readFileSync('/root/lead-generation-automation-v2/local_db/omnichannel_campaigns.json', 'utf8'));
      console.log(JSON.stringify(oc, null, 2));
    } catch(e) { console.log('OC err:', e.message); }

    console.log('=== VPS GROWTH TELEMETRY ===');
    try {
      const gt = JSON.parse(fs.readFileSync('/root/lead-generation-automation-v2/local_db/growth_telemetry.json', 'utf8'));
      console.log('Telemetry records:', gt.length);
      console.log('Latest cycle:', JSON.stringify(gt[0], null, 2));
    } catch(e) { console.log('GT err:', e.message); }
  "`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
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
