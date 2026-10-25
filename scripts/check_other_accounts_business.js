const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkAccountOnBusiness(sessionFileName, label) {
  const sessionPath = path.join(__dirname, '..', 'local_db', sessionFileName);
  if (!fs.existsSync(sessionPath)) {
    console.log(`${label}: Session file missing.`);
    return;
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: sessionPath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  try {
    await page.goto('https://www.nairaland.com/newtopic?board=24', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const title = await page.title();
    const hasInput = await page.$('input[name="title"]');
    console.log(`${label} on Board 24 (Business): Title: "${title}" | Has Input?: ${Boolean(hasInput)}`);
  } catch (e) {
    console.log(`${label} error: ${e.message}`);
  }
  await browser.close();
}

async function main() {
  await checkAccountOnBusiness('nairaland_session_kenetwork2026.json', 'Account kenetwork2026');
  await checkAccountOnBusiness('nairaland_session_4thmainland.json', 'Account 4thmainland');
}

main().catch(console.error);
