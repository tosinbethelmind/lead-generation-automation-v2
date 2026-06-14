const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            raw: body
          });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING CUSTOM OUTREACH MESSAGE TESTS ===\n');

  // 1. WhatsApp Custom Outreach
  console.log('[Test 1] Testing WhatsApp Custom Message Outreach...');
  try {
    const res = await postJson('/api/whatsapp', {
      leadIds: ['mock_mapsfree_1781407833372_0'],
      dryRunOverride: true,
      customMessage: 'Hello {{lead.name}}! This is a custom WhatsApp message override. Your rating is {{lead.rating}} stars.'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.status === 200 && res.data.success && res.data.results[0].status === 'CONTACTED') {
      console.log('✓ Test 1 Passed!\n');
    } else {
      console.log('✗ Test 1 Failed!\n');
    }
  } catch (err) {
    console.log('✗ Test 1 Error:', err.message, '\n');
  }

  // 2. Social Custom Outreach
  console.log('[Test 2] Testing Social Custom Message Outreach...');
  try {
    const res = await postJson('/api/social-outreach', {
      leadIds: ['mock_social_instagram_1781407838565_0'],
      dryRun: true,
      customMessage: 'Hi {{lead.name}}! This is a custom DM override. Check out: {{previewUrl}}'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.status === 200 && res.data.results[0].messageSent.includes('custom DM override')) {
      console.log('✓ Test 2 Passed!\n');
    } else {
      console.log('✗ Test 2 Failed!\n');
    }
  } catch (err) {
    console.log('✗ Test 2 Error:', err.message, '\n');
  }

  // 3. Jiji Custom Outreach
  console.log('[Test 3] Testing Jiji Custom Message Outreach...');
  try {
    const res = await postJson('/api/jiji', {
      leadIds: ['mock_jiji_1781407836675_0'],
      dryRun: true,
      customMessage: 'Hello {{lead.name}}! This is a custom Jiji message override. Let us know what you think.'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.status === 200 && res.data.results[0].messageSent.includes('custom Jiji message override')) {
      console.log('✓ Test 3 Passed!\n');
    } else {
      console.log('✗ Test 3 Failed!\n');
    }
  } catch (err) {
    console.log('✗ Test 3 Error:', err.message, '\n');
  }

  // 4. Calls Custom Outreach
  console.log('[Test 4] Testing Twilio Calls Custom Message Outreach...');
  try {
    const res = await postJson('/api/calls', {
      leadIds: ['mock_mapsfree_1781407833372_0'],
      dryRunOverride: true,
      customMessage: 'Hello {{lead.name}}! This is a custom Twilio speech synthesis call. Please check {{previewUrl}}.'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.status === 200 && res.data.results[0].status === 'CONTACTED') {
      console.log('✓ Test 4 Passed!\n');
    } else {
      console.log('✗ Test 4 Failed!\n');
    }
  } catch (err) {
    console.log('✗ Test 4 Error:', err.message, '\n');
  }

  // 5. Email Custom Outreach
  console.log('[Test 5] Testing Email Custom Message Outreach...');
  try {
    const res = await postJson('/api/outreach', {
      leadIds: ['mock_social_instagram_1781407838565_0'],
      dryRun: true,
      customSubject: 'Custom Subject for {{lead.name}}',
      customMessage: 'Hello {{lead.name}}! This is a custom Email body override. View details: {{previewUrl}}'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    if (res.status === 200 && res.data.results[0].status === 'CONTACTED') {
      console.log('✓ Test 5 Passed!\n');
    } else {
      console.log('✗ Test 5 Failed!\n');
    }
  } catch (err) {
    console.log('✗ Test 5 Error:', err.message, '\n');
  }

  console.log('=== CUSTOM OUTREACH MESSAGE TESTS COMPLETED ===');
}

runTests();
