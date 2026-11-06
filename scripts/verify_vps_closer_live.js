const { Client } = require('ssh2');
const c = new Client();
c.on('ready', () => {
  c.exec('cd /root/lead-generation-automation-v2 && node -e "const { handlePostContactInquiry } = require(\\"./scripts/lib/closer_engine\\"); const res = handlePostContactInquiry(\\"Hello, I’m interested in Interstate Dispatch Waybill Tracker & Delivery SMS Syst\\", { businessName: \\"Speedway Logistics\\", phone: \\"6825525166330\\" }); console.log(\\"VPS Intent:\\", res.intent, \\"\\nInvoiceId:\\", res.invoiceId, \\"\\nText snippet:\\", res.messageText.substring(0, 150));"', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- VPS VERIFICATION RESULT ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000, keepaliveInterval: 10000 });
