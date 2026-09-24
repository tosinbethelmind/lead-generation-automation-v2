const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}
const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
const apiKey = config.brevoApiKey;

console.log('====================================================');
console.log('🔍 VERIFYING DNS & BREVO CONFIGURATION');
console.log('====================================================\n');

// 1. Check Brevo API Senders
function checkBrevoSenders() {
  return new Promise((resolve) => {
    console.log('1. Querying Brevo Verified Senders...');
    const req = https.request('https://api.brevo.com/v3/senders', {
      headers: {
        'api-key': apiKey,
        'accept': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log('   Senders registered:');
          if (data.senders) {
            data.senders.forEach(s => {
              console.log(`   - ${s.name} <${s.email}> [Active: ${s.active}]`);
            });
          } else {
            console.log('   ', body);
          }
        } catch (e) {
          console.log('   Raw:', body);
        }
        resolve();
      });
    });
    req.on('error', e => {
      console.log('   Error:', e.message);
      resolve();
    });
    req.end();
  });
}

// 2. Check Brevo Domains API
function checkBrevoDomains() {
  return new Promise((resolve) => {
    console.log('\n2. Querying Brevo Domains & Authenticated Status...');
    const req = https.request('https://api.brevo.com/v3/senders/domains', {
      headers: {
        'api-key': apiKey,
        'accept': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log('   Brevo Domains response:');
          if (data.domains) {
            data.domains.forEach(d => {
              console.log(`   - Domain: ${d.domain_name} | Authenticated: ${d.authenticated} | Verified: ${d.verified}`);
            });
          } else {
            console.log('   ', JSON.stringify(data, null, 2));
          }
        } catch (e) {
          console.log('   Raw:', body);
        }
        resolve();
      });
    });
    req.on('error', e => {
      console.log('   Error:', e.message);
      resolve();
    });
    req.end();
  });
}

// 3. DNS Lookup directly
async function checkDnsDirect() {
  console.log('\n3. Direct DNS Lookup for bethelmindanalytics.com...');
  const domain = 'bethelmindanalytics.com';

  // TXT records
  await new Promise(r => {
    dns.resolveTxt(domain, (err, records) => {
      if (err) {
        console.log(`   TXT for ${domain}: ${err.message}`);
      } else {
        console.log(`   ✅ TXT records for ${domain}:`);
        records.forEach(rec => console.log(`      "${rec.join('')}"`));
      }
      r();
    });
  });

  // Check DKIM txt if common selector exists (e.g. mail._domainkey or brevo._domainkey or sib._domainkey)
  const selectors = ['mail._domainkey', 'brevo._domainkey', 'sib._domainkey', 'k1._domainkey'];
  for (const sel of selectors) {
    await new Promise(r => {
      dns.resolveTxt(`${sel}.${domain}`, (err, records) => {
        if (!err && records && records.length > 0) {
          console.log(`   ✅ Found DKIM record at ${sel}.${domain}:`);
          records.forEach(rec => console.log(`      "${rec.join('').substring(0, 80)}..."`));
        }
        r();
      });
    });
  }

  // DMARC
  await new Promise(r => {
    dns.resolveTxt(`_dmarc.${domain}`, (err, records) => {
      if (err) {
        console.log(`   _dmarc.${domain}: ${err.message}`);
      } else {
        console.log(`   ✅ DMARC record for ${domain}:`);
        records.forEach(rec => console.log(`      "${rec.join('')}"`));
      }
      r();
    });
  });
}

// 4. Try Live Test Send via Brevo with tosin@bethelmindanalytics.com
function testLiveSend() {
  return new Promise((resolve) => {
    console.log('\n4. Testing Live Email Send from tosin@bethelmindanalytics.com via Brevo API...');
    const payload = JSON.stringify({
      sender: {
        name: 'Tosin | Bethelmind Analytics Lagos Desk',
        email: 'tosin@bethelmindanalytics.com'
      },
      to: [
        { email: 'bethelmindrecruit@gmail.com', name: 'Admin Test' }
      ],
      subject: '✅ DNS & Deliverability Live Verification - Bethelmind Analytics',
      htmlContent: '<p>Hello Admin,</p><p>This email confirms that DNS and Brevo integration for <strong>tosin@bethelmindanalytics.com</strong> is 100% verified and operational!</p>'
    });

    const req = https.request('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'accept': 'application/json',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log(`   Brevo SMTP Send Status: HTTP ${res.statusCode}`);
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`   🎉 SUCCESS! Message ID: ${parsed.messageId}`);
          } else {
            console.log(`   ❌ Brevo Error:`, parsed);
          }
        } catch (_) {
          console.log('   Raw:', body);
        }
        resolve();
      });
    });

    req.on('error', e => {
      console.log('   Network Error:', e.message);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  await checkBrevoSenders();
  await checkBrevoDomains();
  await checkDnsDirect();
  await testLiveSend();
  console.log('\n====================================================');
  console.log('VERIFICATION COMPLETE');
  console.log('====================================================');
}

main();
