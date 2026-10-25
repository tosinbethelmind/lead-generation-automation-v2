const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const USERNAME = '4thmainland';
const PASSWORD = 'bethelmind2026';
const SESSION_FILE = path.join(__dirname, '..', 'local_db', `nairaland_session_${USERNAME}.json`);

async function login() {
  console.log(`Starting login for ${USERNAME}...`);
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    console.log('Navigating to Nairaland login page...');
    await page.goto('https://www.nairaland.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('Filling credentials...');
    await page.fill('input[name="login"]', USERNAME);
    await page.fill('input[name="password"]', PASSWORD);
    await page.waitForTimeout(1000);

    console.log('Clicking Login button...');
    await page.click('input[value="Login"]');

    console.log('Waiting for response or Turnstile verification...');
    
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1500);
      const url = page.url();
      const body = await page.innerText('body').catch(() => '');

      if (body.includes('Logout') || new RegExp(`Welcome,\\s+${USERNAME}`, 'i').test(body) || body.includes(USERNAME)) {
        console.log(`SUCCESS: Logged in as ${USERNAME}! URL: ${url}`);
        const dir = path.dirname(SESSION_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await context.storageState({ path: SESSION_FILE });
        console.log(`Saved session state to: ${SESSION_FILE}`);
        
        // Also save to data/
        const altFile = path.join(__dirname, '..', 'data', `nairaland_session_${USERNAME}.json`);
        const altDir = path.dirname(altFile);
        if (!fs.existsSync(altDir)) fs.mkdirSync(altDir, { recursive: true });
        await context.storageState({ path: altFile });

        await browser.close();
        return { success: true, url };
      }

      // Check for Turnstile frame
      const frames = page.frames();
      for (const frame of frames) {
        if (frame.url().includes('cloudflare') || frame.url().includes('turnstile') || frame.url().includes('challenge')) {
          console.log('Detected Cloudflare Turnstile frame. Checking for box...');
          const box = await frame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, #challenge-stage');
          if (box) {
            await box.click().catch(() => {});
            console.log('Clicked Turnstile box.');
          }
        }
      }
    }

    const currentUrl = page.url();
    console.log('Final URL after wait loop:', currentUrl);
    const finalBody = await page.innerText('body').catch(() => '');
    if (finalBody.includes('Logout') || finalBody.includes(USERNAME)) {
      console.log(`SUCCESS on final check for ${USERNAME}!`);
      await context.storageState({ path: SESSION_FILE });
      await browser.close();
      return { success: true };
    }

    const screenshotPath = path.join(__dirname, '..', 'local_db', `login_${USERNAME}_result.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Updated screenshot saved to: ${screenshotPath}`);

    await browser.close();
    return { success: false, url: currentUrl };
  } catch (err) {
    console.error('Error during login:', err.message);
    await browser.close();
    return { success: false, error: err.message };
  }
}

login().then(res => {
  console.log('Final Result:', JSON.stringify(res));
  process.exit(res.success ? 0 : 1);
});
