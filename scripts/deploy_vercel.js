const fs = require('fs');
const { execSync } = require('child_process');
const { runTestSuite } = require('./deep_landing_page_and_tool_tester');

let token = '';
if (fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    if (line.trim().startsWith('VERCEL_TOKEN=')) {
      token = line.trim().replace('VERCEL_TOKEN=', '').trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!token) {
  console.error('No VERCEL_TOKEN found in .env.local');
  process.exit(1);
}

console.log('Deploying to Vercel production...');
try {
  execSync(`npx vercel --prod --yes --token ${token}`, { encoding: 'utf8', stdio: 'inherit' });
  console.log('✅ Vercel production build deployed successfully!');
  console.log('\n🔍 Executing Automated Post-Deployment QA Suite on Live Production...');
  
  runTestSuite('https://www.bethelmindanalytics.com').then(qaResult => {
    if (qaResult.ok) {
      console.log('🎉 100% PRODUCTION VERIFICATION PASSED! Site is healthy, responsive, and ready for client outreach.');
    } else {
      console.error(`🚨 POST-DEPLOYMENT QA ALERT: ${qaResult.failed} checks failed! Review issues before sending traffic.`);
      process.exit(1);
    }
  }).catch(err => {
    console.error('QA Suite Execution Error:', err);
    process.exit(1);
  });
} catch (e) {
  console.error('Vercel deployment error:', e.message);
  process.exit(1);
}
