const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');

async function loginWithCredentials(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('https://www.nairaland.com/login', { waitUntil: 'domcontentloaded', timeout: 25000 });

    await page.fill('input[name="login"]', username);
    await page.fill('input[name="password"]', password);
    await page.waitForTimeout(1000);
    await page.click('input[value="Login"]');

    await page.waitForTimeout(4000);

    const bodyText = await page.innerText('body').catch(() => '');
    const currentUrl = page.url();

    // Check for success
    if (bodyText.includes('Logout') || /Welcome,\s+[A-Za-z0-9_-]+/i.test(bodyText)) {
      const dir = path.dirname(SESSION_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await context.storageState({ path: SESSION_FILE });
      await browser.close();
      return { success: true, message: `Successfully authenticated as ${username}!` };
    }

    // Check for error messages
    if (bodyText.includes('Wrong password') || bodyText.includes('Incorrect') || bodyText.includes('does not exist')) {
      await browser.close();
      return { success: false, error: 'Invalid Nairaland username or password.' };
    }

    if (bodyText.includes('verification') || bodyText.includes('captcha') || bodyText.includes('human')) {
      await browser.close();
      return { success: false, error: 'Nairaland requested a security check. Please log in once via the browser.' };
    }

    await browser.close();
    return { success: false, error: 'Login could not be verified. Please verify credentials.' };
  } catch (err) {
    await browser.close();
    return { success: false, error: err.message };
  }
}

module.exports = { loginWithCredentials };
