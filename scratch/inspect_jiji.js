const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  // Abort heavy resource types to prevent memory crash
  await page.route('**/*', (route) => {
    const type = route.request().resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
      route.abort();
    } else {
      route.continue();
    }
  });

  const url = 'https://jiji.ng/lagos/cars';
  console.log('Navigating to', url);
  
  try {
    // Navigate with a short timeout and commit wait
    await page.goto(url, { waitUntil: 'commit', timeout: 15000 });
    console.log('Committed. Waiting 4 seconds for DOM...');
    await new Promise(r => setTimeout(r, 4000));

    const title = await page.title();
    console.log('Page Title:', title);

    if (title.includes('Cloudflare') || title.includes('Attention Required')) {
      console.log('Blocked by Cloudflare! Content HTML:');
      const html = await page.content();
      console.log(html.substring(0, 1000));
      return;
    }

    // Inspect listing card wrappers and their parents
    const structure = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.b-list-advert-base, .qa-advert-list-item, div.b-list-advert__item-wrapper'));
      if (cards.length === 0) {
        return { count: 0, html: document.body.innerHTML.substring(0, 1000) };
      }
      return cards.slice(0, 3).map(el => {
        return {
          tagName: el.tagName,
          className: el.className,
          href: el.getAttribute('href'),
          parentTagName: el.parentElement ? el.parentElement.tagName : null,
          parentClassName: el.parentElement ? el.parentElement.className : null,
          hasAnchorInside: !!el.querySelector('a'),
          innerHtmlSample: el.innerHTML.substring(0, 300)
        };
      });
    });

    console.log('Structure result:', JSON.stringify(structure, null, 2));

  } catch (err) {
    console.error('Error during scrape:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
