const { chromium } = require('playwright');
const path = require('path');

async function checkBoardNames() {
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const context = await browser.newContext({ storageState: sessionPath, locale: 'en-US' });
  const page = await context.newPage();

  // Let's check Nairaland homepage to get board links and names!
  await page.goto('https://www.nairaland.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const boardLinks = await page.$$eval('a[href*="/"]', links => {
    return links
      .filter(a => a.href.match(/nairaland\.com\/([a-z0-9-]+)$/i))
      .map(a => ({ name: a.innerText.trim(), href: a.href, slug: a.href.split('/').pop() }))
      .filter(a => a.name && a.name.length > 2 && a.name.length < 35);
  });

  console.log('Nairaland Boards Found on Homepage:');
  console.log(JSON.stringify(boardLinks, null, 2));

  // Also let's check a few specific board URLs like /investments, /business, /computers, /programming, /phones
  const testSlugs = ['investment', 'business', 'computers', 'phones', 'jobs', 'car-talk', 'properties'];
  for (const s of testSlugs) {
    await page.goto(`https://www.nairaland.com/${s}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const newTopicLink = await page.$eval('a[href*="/newtopic?board="]', a => a.href).catch(() => null);
    console.log(`Section /${s} -> New Topic URL:`, newTopicLink);
  }

  await browser.close();
}

checkBoardNames().catch(console.error);
