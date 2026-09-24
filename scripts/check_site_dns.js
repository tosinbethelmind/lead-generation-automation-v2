const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

dns.resolve4('bethelmindanalytics.com', (err, addresses) => {
  console.log('A records for bethelmindanalytics.com:', err ? err.message : addresses);
});

dns.resolveCname('www.bethelmindanalytics.com', (err, addresses) => {
  console.log('CNAME for www.bethelmindanalytics.com:', err ? err.message : addresses);
});

dns.resolve4('www.bethelmindanalytics.com', (err, addresses) => {
  console.log('A records for www.bethelmindanalytics.com:', err ? err.message : addresses);
});
