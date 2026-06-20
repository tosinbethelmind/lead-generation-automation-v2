const https = require('https');

const data = JSON.stringify({
  query: 'restaurants in Ikeja',
  limit: 2
});

const options = {
  hostname: 'lead-generation-automation-ecru.vercel.app',
  port: 443,
  path: '/api/scrape/maps-free',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending request to Maps-Free Scraper on Vercel...');

const req = https.request(options, (res) => {
  let body = '';
  console.log(`STATUS: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response finished.');
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (e) => {
  console.error('Problem with request:', e);
});

req.write(data);
req.end();
