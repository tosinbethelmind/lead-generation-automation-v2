/**
 * @file scripts/test_unmask_jiji_contact.js
 * Tests unmasking the real 11-digit phone number from a Jiji listing.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function testUnmask() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 }
  });

  if (config.sessionCookie) {
    const cookieObjects = config.sessionCookie.split(';').map(c => {
      const parts = c.trim().split('=');
      return { name: parts[0], value: parts.slice(1).join('='), domain: '.jiji.ng', path: '/' };
    }).filter(c => c.name && c.value);
    await context.addCookies(cookieObjects);
    console.log(`🔑 Injected ${cookieObjects.length} session cookies.`);
  }

  const page = await context.newPage();
  const testUrl = 'https://jiji.ng/lekki-phase/houses-apartments-for-sale/5bdrm-duplex-in-lekki-phase-1-for-sale-tvFPL8keSF6G7oIc9lI7iYRi.html';
  console.log('Navigating to test listing...');
  await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Click Show Contact if present
  try {
    const contactBtn = await page.waitForSelector('button:has-text("Show contact"), div:has-text("Show contact"), .qa-show-contact, .b-show-contacts-button', { timeout: 5000 });
    if (contactBtn) {
      console.log('Found Show Contact button, clicking...');
      await contactBtn.click();
      await page.waitForTimeout(2500);
    }
  } catch (err) {
    console.log('Show Contact button not found or already open:', err.message);
  }

  const extracted = await page.evaluate(() => {
    // Search for telephone links or phone elements
    const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.trim()
    }));

    const authorEl = document.querySelector('.b-seller-block__name, .qa-advert-author-name, .b-advert-author');
    const seller = authorEl ? authorEl.innerText.trim() : 'Listing Broker';

    // Search body text for 11-digit Nigerian phone format (080, 081, 090, 070, +234)
    const bodyText = document.body.innerText;
    const phoneRegex = /(?:\+?234|0)[789][01]\d{8}/g;
    const matches = Array.from(new Set(bodyText.match(phoneRegex) || []));

    return {
      telLinks,
      matches,
      seller
    };
  });

  console.log('Extracted Broker Data:', JSON.stringify(extracted, null, 2));
  await browser.close();
}

testUnmask().catch(e => console.error('Error:', e.message));
