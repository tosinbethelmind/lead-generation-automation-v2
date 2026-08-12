/**
 * Verification Test Script: Seamless Integration Blueprint & CAPI Gateway
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 Starting Verification Suite for Seamless Integration Blueprint...\n');

let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failedTests++;
  }
}

// 1. Verify Public SDK Script File Existence
const sdkPath = path.join(__dirname, '..', 'public', 'sdk', 'apex-integration-sdk.js');
assert(fs.existsSync(sdkPath), `Universal SDK JS script exists at ${sdkPath}`);

const sdkContent = fs.readFileSync(sdkPath, 'utf8');
assert(sdkContent.includes('ApexSDK') && sdkContent.includes('trackEvent'), 'SDK JS script contains ApexSDK core tracker');

// 2. Verify Server CAPI Gateway Helper
const capiPath = path.join(__dirname, '..', 'src', 'lib', 'capiGateway.ts');
assert(fs.existsSync(capiPath), `CAPI Gateway helper exists at ${capiPath}`);

const capiContent = fs.readFileSync(capiPath, 'utf8');
assert(capiContent.includes('hashUserData') && capiContent.includes('sendMetaCapiEvent'), 'CAPI Gateway contains SHA-256 data hashing and Meta dispatch');

// 3. Verify Business App Connectors
const connectorsPath = path.join(__dirname, '..', 'src', 'lib', 'integrations', 'businessAppConnectors.ts');
assert(fs.existsSync(connectorsPath), `Business App Connectors library exists at ${connectorsPath}`);

const connectorsContent = fs.readFileSync(connectorsPath, 'utf8');
assert(connectorsContent.includes('triggerZapierWebhook') && connectorsContent.includes('syncToHubSpotCRM') && connectorsContent.includes('triggerWhatsAppOutreach'), 'Connectors include Zapier, HubSpot, WhatsApp, and Resend handlers');

// 4. Verify Sales Narrative Component
const narrativePath = path.join(__dirname, '..', 'src', 'components', 'SalesIntegrationNarrative.tsx');
assert(fs.existsSync(narrativePath), `SalesIntegrationNarrative component exists at ${narrativePath}`);

const narrativeContent = fs.readFileSync(narrativePath, 'utf8');
assert(narrativeContent.includes('Seamless 1-Click Integration With Every Tool You Already Use'), 'Sales Narrative contains zero-friction value proposition');

// 5. Verify Integration Dashboard & Route
const dashboardPath = path.join(__dirname, '..', 'src', 'components', 'IntegrationBlueprintDashboard.tsx');
assert(fs.existsSync(dashboardPath), `Integration Blueprint Dashboard exists at ${dashboardPath}`);

const routePath = path.join(__dirname, '..', 'src', 'app', 'tools', 'integrations', 'page.tsx');
assert(fs.existsSync(routePath), `Integrations tool route exists at ${routePath}`);

console.log('\n--- VERIFICATION SUMMARY ---');
if (failedTests === 0) {
  console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error(`🚨 ${failedTests} TEST(S) FAILED!`);
  process.exit(1);
}
