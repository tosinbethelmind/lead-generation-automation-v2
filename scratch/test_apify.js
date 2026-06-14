const http = require('http');

function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(`[Test] Sending ${method} to ${path}...`);
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[Response] Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log('[Response Body]:', JSON.stringify(json, null, 2).substring(0, 1000));
        } catch (e) {
          console.log('[Response Raw]:', data);
        }
        resolve();
      });
    });

    req.on('error', err => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    // Test GET method
    await testEndpoint('GET', '/api/apify?limit=2&query=GETTest');
    console.log('\n-----------------------------------------\n');
    // Test POST method
    await testEndpoint('POST', '/api/apify', { limit: 2, query: 'POSTTest' });
  } catch (err) {
    console.error('Test failed:', err);
  }
}

run();
