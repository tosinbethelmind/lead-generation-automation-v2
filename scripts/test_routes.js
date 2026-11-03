const http = require('http');

function testUrl(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3006${path}`, (res) => {
      console.log(`[${res.statusCode}] ${path}`);
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', (err) => {
      console.error(`[ERR] ${path}:`, err.message);
      resolve(500);
    });
    req.setTimeout(15000, () => {
      console.log(`[TIMEOUT] ${path}`);
      req.destroy();
      resolve(504);
    });
  });
}

async function run() {
  await testUrl('/services');
  await testUrl('/onboard');
  await testUrl('/tools');
}

run();
