const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

const domain = 'bethelmindanalytics.com';

async function checkSpecificDns() {
  console.log('=== EXACT DNS RECORD CHECK FOR BREVO ===\n');

  // 1. CNAME brevo1._domainkey
  await new Promise(r => {
    dns.resolveCname(`brevo1._domainkey.${domain}`, (err, addresses) => {
      if (err) {
        console.log(`1. CNAME brevo1._domainkey.${domain}: ❌ NOT FOUND (${err.code})`);
      } else {
        console.log(`1. CNAME brevo1._domainkey.${domain}: ✅ FOUND ->`, addresses);
      }
      r();
    });
  });

  // 2. CNAME brevo2._domainkey
  await new Promise(r => {
    dns.resolveCname(`brevo2._domainkey.${domain}`, (err, addresses) => {
      if (err) {
        console.log(`2. CNAME brevo2._domainkey.${domain}: ❌ NOT FOUND (${err.code})`);
      } else {
        console.log(`2. CNAME brevo2._domainkey.${domain}: ✅ FOUND ->`, addresses);
      }
      r();
    });
  });

  // 3. TXT for brevo-code
  await new Promise(r => {
    dns.resolveTxt(domain, (err, records) => {
      if (err) {
        console.log(`3. TXT @ (${domain}): ❌ ERROR (${err.code})`);
      } else {
        const flat = records.map(r => r.join(''));
        const found = flat.find(t => t.includes('brevo-code'));
        if (found) {
          console.log(`3. TXT brevo-code: ✅ FOUND -> "${found}"`);
        } else {
          console.log(`3. TXT brevo-code: ❌ NOT FOUND in existing records:`, flat);
        }
      }
      r();
    });
  });

  // 4. TXT _dmarc
  await new Promise(r => {
    dns.resolveTxt(`_dmarc.${domain}`, (err, records) => {
      if (err) {
        console.log(`4. TXT _dmarc.${domain}: ❌ NOT FOUND (${err.code})`);
      } else {
        const flat = records.map(r => r.join(''));
        console.log(`4. TXT _dmarc.${domain}: ✅ FOUND ->`, flat);
      }
      r();
    });
  });
}

checkSpecificDns();
