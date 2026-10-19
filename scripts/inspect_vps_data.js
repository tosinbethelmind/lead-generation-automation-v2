const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const remoteCmd = `node -e '
    const fs = require("fs");
    function inspect(p, name) {
      if (!fs.existsSync(p)) { console.log(name, "NOT FOUND"); return; }
      try {
        const d = JSON.parse(fs.readFileSync(p, "utf8"));
        if (Array.isArray(d)) {
          console.log("=== " + name + " (Count: " + d.length + ") ===");
          console.log(JSON.stringify(d.slice(-10), null, 2));
        } else {
          console.log("=== " + name + " ===");
          console.log(JSON.stringify(d, null, 2).slice(0, 500));
        }
      } catch (e) {
        console.log(name, "error:", e.message);
      }
    }
    inspect("/root/lead-generation-automation-v2/local_db/crm_leads.json", "CRM LEADS");
    inspect("/root/lead-generation-automation-v2/local_db/opt_out_blacklist.json", "OPT OUTS");
    inspect("/root/lead-generation-automation-v2/local_db/whatsapp_daily_outreach_log.json", "WA OUTREACH LOG");
  '`;
  conn.exec(remoteCmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).on('error', e => console.error(e.message))
.connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
