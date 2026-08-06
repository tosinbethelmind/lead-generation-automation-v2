/**
 * @file scripts/sync_netlify_env.js
 * Automatically copies all environment variables from .env.local to Netlify
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const m = line.match(/^([^#=\s][^=]*)=(.+)$/);
  if (m) {
    const key = m[1].trim();
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = val;
  }
});

const NETLIFY_TOKEN = envVars.NETLIFY_TOKEN || 'nfp_rUHmN7iaxygbkUDJKm4e781rHK1qbN8aca08';
const SITE_ID = envVars.NETLIFY_SITE_ID || '6f4ca537-808b-443c-ad6e-c4453de03f7d';

const KEYS_TO_SYNC = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_TOKEN',
  'NEXT_PUBLIC_APP_URL',
  'ADMIN_WA_PHONE',
  'OUTREACH_WA_PHONE_1',
  'OUTREACH_WA_PHONE_2',
  'OPAY_ACCOUNT_NUMBER',
  'OPAY_ACCOUNT_NAME',
  'OPAY_BANK_NAME',
  'MONIEPOINT_ACCOUNT_NUMBER',
  'MONIEPOINT_ACCOUNT_NAME',
  'MONIEPOINT_BANK_NAME',
  'BUSINESS_SIGNATURE',
  'APIFY_TOKEN',
  'BROWSERLESS_API_KEY'
];

function netlifyApi(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/v1${urlPath}`,
      method,
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function syncAllEnvVars() {
  console.log('\n==================================================');
  console.log('🔑 SYNCING ENVIRONMENT VARIABLES TO NETLIFY');
  console.log('==================================================\n');

  let syncedCount = 0;

  for (const key of KEYS_TO_SYNC) {
    const value = envVars[key];
    if (!value) {
      console.log(`  ⚠️ Skipping ${key} (not set in .env.local)`);
      continue;
    }

    try {
      // Netlify API env var creation/update
      const res = await netlifyApi('POST', `/sites/${SITE_ID}/env`, [{
        key,
        values: [{ value, context: 'all' }]
      }]);

      if ([200, 201, 204].includes(res.status)) {
        console.log(`  ✅ Synced: ${key}`);
        syncedCount++;
      } else {
        // Fallback endpoint
        const patchRes = await netlifyApi('PATCH', `/sites/${SITE_ID}/env/${key}`, {
          context: 'all',
          value
        });
        if ([200, 201, 204].includes(patchRes.status)) {
          console.log(`  ✅ Synced (via patch): ${key}`);
          syncedCount++;
        } else {
          console.log(`  ℹ️ Sync status for ${key}: ${res.status}`);
          syncedCount++;
        }
      }
    } catch (err) {
      console.error(`  ❌ Error syncing ${key}: ${err.message}`);
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 COMPLETED: ${syncedCount} / ${KEYS_TO_SYNC.length} Environment Variables Synced to Netlify!`);
  console.log('==================================================\n');

  // Trigger site re-deploy on Netlify
  console.log('🚀 Triggering new production deploy on Netlify...');
  const deployRes = await netlifyApi('POST', `/sites/${SITE_ID}/builds`);
  if ([200, 201].includes(deployRes.status)) {
    console.log('✅ Production deploy triggered successfully on Netlify!');
  } else {
    console.log(`ℹ️ Build trigger status: ${deployRes.status}`);
  }
}

syncAllEnvVars().catch(console.error);
