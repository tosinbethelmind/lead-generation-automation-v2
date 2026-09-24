const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}
const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
const domain = 'bethelmindanalytics.com';

async function checkNameservers() {
  console.log('1. Checking Nameservers for', domain, '...');
  return new Promise(r => {
    dns.resolveNs(domain, (err, ns) => {
      if (err) console.log('   NS Error:', err.message);
      else console.log('   ✅ Active Nameservers:', ns);
      r();
    });
  });
}

async function checkRecordsOnCloudflare() {
  console.log('\n2. Querying Cloudflare DNS Resolver (1.1.1.1)...');
  const resolver = new dns.Resolver();
  resolver.setServers(['1.1.1.1', '8.8.8.8']);

  // brevo1._domainkey
  await new Promise(r => {
    resolver.resolveCname(`brevo1._domainkey.${domain}`, (err, addresses) => {
      if (err) console.log(`   brevo1._domainkey.${domain}: ❌ ${err.code}`);
      else console.log(`   brevo1._domainkey.${domain}: ✅ FOUND ->`, addresses);
      r();
    });
  });

  // brevo2._domainkey
  await new Promise(r => {
    resolver.resolveCname(`brevo2._domainkey.${domain}`, (err, addresses) => {
      if (err) console.log(`   brevo2._domainkey.${domain}: ❌ ${err.code}`);
      else console.log(`   brevo2._domainkey.${domain}: ✅ FOUND ->`, addresses);
      r();
    });
  });

  // TXT brevo-code
  await new Promise(r => {
    resolver.resolveTxt(domain, (err, records) => {
      if (err) console.log(`   TXT ${domain}: ❌ ${err.code}`);
      else {
        const flat = records.map(x => x.join(''));
        const code = flat.find(t => t.includes('brevo-code'));
        if (code) console.log(`   TXT brevo-code: ✅ FOUND -> "${code}"`);
        else console.log(`   TXT brevo-code: ⚠️ Records:`, flat);
      }
      r();
    });
  });
}

// 3. Query Brevo Domain Status
async function checkBrevoStatus() {
  console.log('\n3. Checking Brevo Domain Authentication Status...');
  return new Promise(r => {
    const req = https.request(`https://api.brevo.com/v3/senders/domains/${domain}`, {
      headers: {
        'api-key': config.brevoApiKey,
        'accept': 'application/json'
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log(`   Brevo Status: Verified: ${data.verified} | Authenticated: ${data.authenticated}`);
          if (data.dns_records) {
            console.log('   DKIM 1 Status:', data.dns_records.dkim1Record?.status);
            console.log('   DKIM 2 Status:', data.dns_records.dkim2Record?.status);
            console.log('   Brevo Code Status:', data.dns_records.brevo_code?.status);
            console.log('   DMARC Status:', data.dns_records.dmarc_record?.status);
          }
        } catch (e) {
          console.log('   Raw:', body);
        }
        r();
      });
    });
    req.end();
  });
}

// 4. Verify Website Status
async function checkWebsite() {
  console.log('\n4. Checking Website Health (https://www.bethelmindanalytics.com)...');
  return new Promise(r => {
    const req = https.get('https://www.bethelmindanalytics.com', res => {
      console.log(`   Website HTTP Status: ${res.statusCode} ${res.statusMessage}`);
      r();
    });
    req.on('error', e => {
      console.log('   Website check error:', e.message);
      r();
    });
  });
}

async function main() {
  await checkNameservers();
  await checkRecordsOnCloudflare();
  await checkBrevoStatus();
  await checkWebsite();
}

main();
