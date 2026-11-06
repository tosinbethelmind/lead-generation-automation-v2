const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('cd /root/lead-generation-automation-v2 && node -e "const { handlePostContactInquiry } = require(\\"./scripts/lib/closer_engine\\"); const res = handlePostContactInquiry(\\"Hello, I am interested in Interstate Dispatch Waybill Tracker\\", { businessName: \\"Your Business\\", phone: \\"6825525166330\\" }); console.log(JSON.stringify(res));"', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026' });
