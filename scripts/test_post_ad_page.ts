import { chromium } from 'playwright';
import path from 'path';

async function testPostAdPage() {
  const profileDir = path.join(process.cwd(), 'local_db', 'jiji_browser_profile');

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await context.newPage();
  await page.goto('https://jiji.ng/post-ad', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  console.log('Current URL after navigating to post-ad:', page.url());
  console.log('Title:', await page.title());

  // Check if login modal or post-ad form is displayed
  const hasTitleInput = await page.$('input[placeholder*="Title" i], input[name*="title" i]');
  console.log('Has Title Input:', !!hasTitleInput);

  const hasLoginButton = await page.$('button:has-text("Sign in"), a:has-text("Sign in"), text=Sign in');
  console.log('Has Sign in button:', !!hasLoginButton);

  await context.close();
}

testPostAdPage().catch(console.error);
