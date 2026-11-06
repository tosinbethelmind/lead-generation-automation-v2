const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  c.sftp((err, sftp) => {
    if (err) throw err;
    const remotePath = '/root/patch_evolution2.py';
    const pyScript = `file_path = '/root/lead-generation-automation-v2/scripts/evolution_api_server.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = """    // MANDATORY PRE-FLIGHT VERIFICATION: Check onWhatsApp before sending!
    try {
      const waResults = await inst.socket.onWhatsApp(jid);
      if (waResults && Array.isArray(waResults) && waResults.length > 0 && !waResults[0].exists) {
        console.warn(\`[Evolution API] ❌ RECIPIENT NOT ON WHATSAPP: \${jid} does not exist. Aborting send.\`);
        return res.status(404).json({
          success: false,
          error: 'NOT_ON_WHATSAPP',
          message: \`Phone number \${cleanDigits} is not registered on WhatsApp.\`
        });
      }
    } catch (checkErr) {
      console.warn('[Evolution API] onWhatsApp check warning:', checkErr.message);
    }"""

replacement = """    // MANDATORY PRE-FLIGHT VERIFICATION: Check onWhatsApp before sending!
    try {
      const waResults = await inst.socket.onWhatsApp(jid);
      const exists = waResults && Array.isArray(waResults) && waResults.length > 0 && waResults[0].exists;
      if (!exists) {
        console.warn(\`[Evolution API] ❌ RECIPIENT NOT ON WHATSAPP: \${jid} does not exist. Aborting send.\`);
        return res.status(404).json({
          success: false,
          error: 'NOT_ON_WHATSAPP',
          message: \`Phone number \${cleanDigits} is not registered on WhatsApp.\`
        });
      }
    } catch (checkErr) {
      console.warn('[Evolution API] onWhatsApp check warning:', checkErr.message);
    }"""

if target in code:
    code = code.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS: VPS evolution_api_server.js condition fixed!")
else:
    print("ERROR: target snippet not found in evolution_api_server.js")
`;
    const stream = sftp.createWriteStream(remotePath);
    stream.on('close', () => {
      console.log('Script uploaded.');
      c.exec('python3 /root/patch_evolution2.py && pm2 restart bethelmind-evolution', (execErr, execStream) => {
        if (execErr) throw execErr;
        execStream.on('data', d => process.stdout.write(d));
        execStream.stderr.on('data', d => process.stderr.write(d));
        execStream.on('close', code => {
          console.log('Code:', code);
          c.end();
        });
      });
    });
    stream.end(pyScript);
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
