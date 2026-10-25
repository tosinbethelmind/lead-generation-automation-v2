const { chromium } = require('playwright');
const path = require('path');

async function inspectLiveThread() {
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const context = await browser.newContext({ storageState: sessionPath, locale: 'en-US' });
  const page = await context.newPage();

  console.log('Navigating to Thread 8770162 (Car Talk)...');
  await page.goto('https://www.nairaland.com/8770162/lexus-rx350-corolla-tin-customs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const title = await page.title();
  console.log('Thread Title:', title);

  const body = await page.innerText('body');
  console.log('Contains /vin link?:', body.includes('/vin') || body.includes('bethelmindanalytics.com/vin'));
  console.log('Contains BethelmindAsistantBot?:', body.includes('BethelmindAsistantBot'));
  console.log('Contains ₦2,500 Selar Certificate?:', body.includes('2,500') || body.includes('selar.com'));
  console.log('Contains WhatsApp 0802 279 1227?:', body.includes('0802 279 1227'));

  // Find posts in thread
  const posts = await page.$$eval('td.narrow, div.narrow, table', els => els.length);
  console.log('Number of elements matched:', posts);

  // Print text snippet of the page containing Bethelmind
  const lines = body.split('\n').filter(l => l.trim().length > 0);
  const relevantLines = lines.filter(l => l.includes('Bethelmind') || l.includes('Customs') || l.includes('VIN') || l.includes('0802'));
  console.log('\nRelevant lines from live thread:');
  relevantLines.slice(0, 15).forEach(l => console.log('•', l.trim()));

  await browser.close();
}

inspectLiveThread().catch(console.error);
