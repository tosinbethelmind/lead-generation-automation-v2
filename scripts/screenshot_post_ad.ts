import { chromium } from 'playwright';
import path from 'path';

async function screenshotPostAd() {
  const profileDir = path.join(process.cwd(), 'local_db', 'jiji_browser_profile');

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const page = await context.newPage();
  await page.goto('https://jiji.ng/post-ad', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'jiji_post_ad_state.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved screenshot to:', screenshotPath);
  console.log('Final URL:', page.url());

  await context.close();
}

screenshotPostAd().catch(console.error);
