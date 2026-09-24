const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

// Try authenticate endpoint
const req = https.request('https://api.brevo.com/v3/senders/domains/bethelmindanalytics.com/authenticate', {
  method: 'PUT',
  headers: {
    'api-key': config.brevoApiKey,
    'accept': 'application/json'
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Authenticate result:', res.statusCode, body);
  });
});
req.end();
