const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

dns.resolveNs('bethelmindanalytics.com', (err, addresses) => {
  if (err) console.error('NS lookup error:', err);
  else console.log('Nameservers for bethelmindanalytics.com:', addresses);
});
