const fs = require('fs');
const path = require('path');

const srvPath = path.join(__dirname, 'evolution_api_server.js');
let code = fs.readFileSync(srvPath, 'utf8');

const target = 'const leadInfo = lookupLeadForWhatsApp(cleanSender, text);';
const replacement = `const leadInfo = lookupLeadForWhatsApp(cleanSender, text);

    // ⏸️ GLOBAL PAUSE FOR PILLAR 1: Stop all automated replies to Pillar 1 prospects
    if (!leadInfo.isPillar2) {
      console.log(\`⏸️ [Inbound Closer] Pillar 1 auto-reply is PAUSED. Inbound from +\${cleanSender} (\${leadInfo.businessName}): "\${text.trim()}". Not sending automated reply.\`);
      if (instances.instance_1?.socket && instances.instance_1?.state === 'open') {
        try {
          const pauseAlert = \`🔔 *[PILLAR 1 MESSAGE RECEIVED (AUTO-REPLY PAUSED)]*\\n• From: +\${cleanSender} (\${leadInfo.businessName || 'SME Business'})\\n• Client Message: "\${text.trim()}"\\n• Status: Automated reply paused per owner instruction. Reply manually if desired.\`;
          await instances.instance_1.socket.sendMessage('2348022791227@s.whatsapp.net', { text: pauseAlert });
        } catch (_) {}
      }
      return;
    }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(srvPath, code, 'utf8');
  console.log('✅ evolution_api_server.js successfully patched to pause Pillar 1 auto-reply.');
} else {
  console.error('❌ Target string not found in evolution_api_server.js');
}
