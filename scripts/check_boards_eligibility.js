const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const candidateBoards = [
  { id: 24, name: 'Business' },
  { id: 15, name: 'Computers / Tech' },
  { id: 78, name: 'Car Talk' },
  { id: 14, name: 'Properties' },
  { id: 19, name: 'Education' },
  { id: 38, name: 'Food' },
  { id: 32, name: 'Webmasters' },
  { id: 22, name: 'Sports' }
];

async function checkBoardsEligibility() {
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: sessionPath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  console.log('--- BOARD ELIGIBILITY AUDIT FOR ACCOUNT: Bethelsolution ---');
  for (const b of candidateBoards) {
    try {
      await page.goto(`https://www.nairaland.com/newtopic?board=${b.id}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const title = await page.title();
      const hasInput = await page.$('input[name="title"]');
      const isRestricted = title.includes("can't post in this section") || title.includes('try again in a few weeks');
      console.log(`Board #${b.id} [${b.name}]: ${hasInput ? '✅ ELIGIBLE (Can post now)' : (isRestricted ? '❌ RESTRICTED (Account too new for this board)' : '⚠️ ' + title)}`);
    } catch (e) {
      console.log(`Board #${b.id} [${b.name}]: Error ${e.message}`);
    }
  }

  await browser.close();
}

checkBoardsEligibility().catch(console.error);
