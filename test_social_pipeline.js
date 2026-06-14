const http = require('http');

// Helper to make POST requests to localhost Next.js server
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
        'Content-Length': data.length
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
  console.log('=== STARTING SOCIAL PIPELINE API TESTS ===\n');

  let validLeadId = null;
  // Test 1: Scrape LinkedIn Leads (Dry run / simulation)
  console.log('[Test 1] Scraping LinkedIn Leads...');
  try {
    const scrapeRes = await postJson('/api/scrape/social', {
      platform: 'linkedin',
      query: 'Software Consultants Lagos',
      limit: 2
    });
    console.log('Status Code:', scrapeRes.status);
    
    if (scrapeRes.status === 200 && scrapeRes.data.success) {
      console.log('✓ Test 1 Passed: Scraper completed successfully.\n');
      if (scrapeRes.data.leads && scrapeRes.data.leads.length > 0) {
        validLeadId = scrapeRes.data.leads[0].lead_id;
      }
    } else {
      console.log('✗ Test 1 Failed.\n');
    }
  } catch (err) {
    console.log('✗ Test 1 Failed with error:', err.message);
    console.log('Note: Ensure the local Next.js dev server is running on port 3000 to test APIs live.\n');
  }

  // Test 2: Social Outreach (Redirect/Payload Prep)
  console.log('[Test 2] Testing Social Outreach Endpoint (LinkedIn redirect verification)...');
  try {
    let targetLeadId = null;
    
    // Read from leads_db.json to get a valid lead ID
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'local_db', 'leads_db.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      const linkedinLeads = data.filter(l => l.source === 'LINKEDIN');
      if (linkedinLeads.length > 0) {
        targetLeadId = linkedinLeads[0].lead_id;
      }
    }
    
    if (!targetLeadId) {
      targetLeadId = validLeadId || 'linkedin-lead-1';
    }
    
    console.log(`Sending outreach request for lead ID: ${targetLeadId}`);
    
    const outreachRes = await postJson('/api/social-outreach', {
      leadIds: [targetLeadId]
    });
    console.log('Status Code:', outreachRes.status);
    console.log('Outreach Response:', JSON.stringify(outreachRes.data, null, 2));

    if (outreachRes.status === 200) {
      console.log('✓ Test 2 Passed: Outreach prepared successfully.\n');
    } else {
      console.log('✗ Test 2 Failed.\n');
    }
  } catch (err) {
    console.log('✗ Test 2 Failed with error:', err.message);
  }

  console.log('=== SOCIAL PIPELINE API TESTS COMPLETED ===');
}

runTests();
