const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'evolution_api_server.js');
let code = fs.readFileSync(filePath, 'utf8');

const badSnippet = `    if (!isRegistered) {
      console.log([Evolution API] ❌ Phone  is not registered on WhatsApp.);
      return res.status(404).json({ success: false, error: 'NOT_ON_WHATSAPP', message: Phone  is not on WhatsApp. });
    }

    const sent = await inst.socket.sendMessage(jid, { text: message });
    console.log([Evolution API] ✅ Successfully sent WhatsApp message to  (MsgId: ));
    res.json({ success: true, messageId: sent?.key?.id, line: inst.id, phone: inst.phone });
  } catch (err) {
    console.error([Evolution API] ❌ Error in /send for :, err.message);
    res.status(500).json({ error: err.message });
  });
  }
});`;

const cleanSnippet = `    if (!isRegistered) {
      console.log('[Evolution API] ❌ Phone ' + cleanDigits + ' is not registered on WhatsApp.');
      return res.status(404).json({ success: false, error: 'NOT_ON_WHATSAPP', message: 'Phone ' + cleanDigits + ' is not on WhatsApp.' });
    }

    const sent = await inst.socket.sendMessage(jid, { text: message });
    console.log('[Evolution API] ✅ Successfully sent WhatsApp message to ' + jid + ' (MsgId: ' + (sent?.key?.id || 'ok') + ')');
    res.json({ success: true, messageId: sent?.key?.id, line: inst.id, phone: inst.phone });
  } catch (err) {
    console.error('[Evolution API] ❌ Error in /send for ' + phone + ':', err.message);
    res.status(500).json({ error: err.message });
  }
});`;

if (code.includes(badSnippet)) {
  code = code.replace(badSnippet, cleanSnippet);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed syntax in evolution_api_server.js!');
} else {
  // Check with CRLF
  const badCRLF = badSnippet.replace(/\n/g, '\r\n');
  const cleanCRLF = cleanSnippet.replace(/\n/g, '\r\n');
  if (code.includes(badCRLF)) {
    code = code.replace(badCRLF, cleanCRLF);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Fixed CRLF syntax in evolution_api_server.js!');
  } else {
    console.log('Bad snippet not matched');
  }
}
