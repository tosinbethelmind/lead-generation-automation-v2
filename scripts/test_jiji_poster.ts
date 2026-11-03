import { chromium } from 'playwright';
import path from 'path';

async function testSession() {
  const profileDir = path.join(process.cwd(), 'local_db', 'jiji_browser_profile');
  console.log('Testing session in profile:', profileDir);

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await context.newPage();
  await page.goto('https://jiji.ng', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log('Page title:', title);

  const cookies = await context.cookies('https://jiji.ng');
  console.log('Cookies count:', cookies.length);
  const cookieNames = cookies.map(c => c.name);
  console.log('Cookie names:', cookieNames);

  await context.close();
}

testSession().catch(console.error);
