const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

const req = https.request('https://api.brevo.com/v3/senders/domains/bethelmindanalytics.com', {
  headers: {
    'api-key': config.brevoApiKey,
    'accept': 'application/json'
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});
req.end();
