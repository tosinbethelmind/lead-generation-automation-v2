const fs = require('fs');
const { chromium } = require('playwright');

const editUrls = [
  "https://jiji.ng/edit-free-ad-55797060.html",
  "https://jiji.ng/edit-free-ad-55796997.html",
  "https://jiji.ng/edit-free-ad-55790380.html",
  "https://jiji.ng/edit-free-ad-55790165.html",
  "https://jiji.ng/edit-free-ad-55782977.html",
  "https://jiji.ng/edit-free-ad-55777491.html",
  "https://jiji.ng/edit-free-ad-55777070.html",
  "https://jiji.ng/edit-free-ad-55776882.html",
  "https://jiji.ng/edit-free-ad-55774340.html",
  "https://jiji.ng/edit-free-ad-55605082.html"
];

async function inspectEachAd() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();

  const results = [];

  for (let i = 0; i < editUrls.length; i++) {
    const u = editUrls[i];
    console.log(`[${i+1}/${editUrls.length}] Opening ${u} ...`);
    try {
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(3000);

      const adData = await page.evaluate(() => {
        const titleInput = document.querySelector('input[name="title"]') || document.querySelector('input[placeholder*="Title" i]');
        const priceInput = document.querySelector('input[name="price"]') || document.querySelector('input[placeholder*="Price" i]');
        const descTextarea = document.querySelector('textarea[name="description"]') || document.querySelector('textarea[placeholder*="Description" i]');
        const categoryText = document.querySelector('.b-category-select, [class*="category"]') ? document.querySelector('.b-category-select, [class*="category"]').innerText.trim() : null;

        return {
          title: titleInput ? titleInput.value : null,
          titleMaxLength: titleInput ? titleInput.maxLength : null,
          price: priceInput ? priceInput.value : null,
          descPreview: descTextarea ? descTextarea.value.slice(0, 150) : null,
          descLength: descTextarea ? descTextarea.value.length : null,
          category: categoryText
        };
      });

      const adId = u.match(/edit-free-ad-(\d+)\.html/)[1];
      console.log(`   -> Found Ad ID ${adId}: "${adData.title}" | Price: ${adData.price}`);
      results.push({ adId, editUrl: u, ...adData });

      if (i === 0) {
        // Save first edit page screenshot to inspect the full form layout
        await page.screenshot({ path: 'local_db/first_edit_page_layout.png' });
      }
    } catch (err) {
      console.error(`   -> Error loading ${u}:`, err.message);
    }
  }

  fs.writeFileSync('local_db/jiji_all_active_ads_inspected.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n--- Finished Inspecting All 10 Adverts ---');
  await browser.close();
}

inspectEachAd().catch(console.error);
