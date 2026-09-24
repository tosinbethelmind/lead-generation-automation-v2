const { execSync } = require('child_process');
const path = require('path');

async function main() {
  console.log('⚡ Triggering Instant 5 Money Engine Executive Briefing...');
  try {
    const code = `
      import('./src/lib/monetization/fiveMoneyThreeHourBriefingEngine').then(async m => {
        const res = await m.checkAndDispatchFiveMoneyThreeHourBriefing(true);
        console.log('✅ Result:', JSON.stringify(res, null, 2));
      }).catch(err => {
        console.error('❌ Error:', err);
      });
    `;
    execSync(`npx tsx -e "${code.replace(/\n/g, ' ')}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (err) {
    console.error('❌ Execution Error:', err.message);
  }
}

main();

