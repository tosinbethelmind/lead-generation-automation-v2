const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testAuth() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  console.log('Using config:', config);

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext();

  // Parse sessionCookie into Playwright cookie objects
  if (config.sessionCookie) {
    const rawCookies = config.sessionCookie.split(';');
    const cookieObjects = rawCookies.map(c => {
      const parts = c.trim().split('=');
      const name = parts[0];
      const value = parts.slice(1).join('=');
      return {
        name,
        value,
        domain: '.jiji.ng',
        path: '/'
      };
    }).filter(c => c.name && c.value);

    await context.addCookies(cookieObjects);
    console.log('Injected cookies:', cookieObjects.map(c => c.name));
  }

  const page = await context.newPage();
  await page.goto('https://jiji.ng/post-ad', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  console.log('URL:', page.url());
  const content = await page.content();
  const title = await page.title();
  console.log('Title:', title);

  const hasPostAd = content.includes('Post ad') || content.includes('Title*');
  console.log('Has Post ad form:', hasPostAd);

  const hasSignIn = content.includes('Sign in') || content.includes('Log in');
  console.log('Has Sign in:', hasSignIn);

  await browser.close();
}

testAuth().catch(console.error);
