const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  const patchScript = `
  const fs = require('fs');
  const file = '/root/lead-generation-automation-v2/scripts/evolution_api_server.js';
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = \`    await inst.socket.presenceSubscribe(jid);
    await inst.socket.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, 600));

    const sent = await inst.socket.sendMessage(jid, { text: message });\`;

  const newCode = \`    // MANDATORY PRE-FLIGHT VERIFICATION: Check onWhatsApp before sending!
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
    }

    await inst.socket.presenceSubscribe(jid);
    await inst.socket.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, 600));

    const sent = await inst.socket.sendMessage(jid, { text: message });\`;

  if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ evolution_api_server.js patched on VPS!');
  } else {
    console.error('⚠️ oldCode snippet not found in evolution_api_server.js');
  }
  `;

  c.exec(`node -e "${patchScript.replace(/\n/g, ' ')}" && pm2 restart bethelmind-evolution`, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', (code) => {
      console.log('Process exited with code:', code);
      c.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
