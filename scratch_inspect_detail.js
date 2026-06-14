const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/ikeja/cars/honda-ridgeline-rts-2008-black-zTx7xvbiRAL15rBTr5XYp0T5.html';
  console.log('Navigating to', url);
  const logData = {};
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 5000));
    
    // Find all buttons, links, or divs that look like show contact or show phone
    const elements = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('button, a, div, span'));
      return all
        .filter(el => {
          const text = el.textContent.toLowerCase();
          const className = el.className.toString().toLowerCase();
          const id = el.id.toString().toLowerCase();
          return text.includes('show contact') || text.includes('phone') || className.includes('contact') || className.includes('phone') || id.includes('contact') || id.includes('phone');
        })
        .slice(0, 15)
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent.trim().substring(0, 50),
          outerHTML: el.outerHTML.substring(0, 200)
        }));
    });
    logData.matchingElements = elements;

    // Try clicking anything with class that includes contact/phone or text "show contact"
    const clicked = await page.evaluate(async () => {
      const btn = Array.from(document.querySelectorAll('button, a, div')).find(el => {
        const text = el.textContent.toLowerCase();
        return text.includes('show contact') || text.includes('show phone');
      });
      if (btn) {
        btn.click();
        return { clicked: true, tag: btn.tagName, text: btn.textContent.trim() };
      }
      return { clicked: false };
    });
    logData.clickAction = clicked;
    
    if (clicked.clicked) {
      await new Promise(r => setTimeout(r, 3000));
      // Look for phone text or tel link
      const phoneDetails = await page.evaluate(() => {
        const telLink = document.querySelector('a[href^="tel:"]');
        const phoneElements = Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const text = el.textContent.trim();
            // simple check for phone number shape (e.g. Nigerian numbers)
            return /^[+]?[0-9\s-]{7,15}$/.test(text) || text.includes('080') || text.includes('081') || text.includes('090') || text.includes('070');
          })
          .map(el => ({
            tagName: el.tagName,
            className: el.className,
            text: el.textContent.trim()
          }));
        return {
          tel: telLink ? telLink.getAttribute('href') : null,
          phoneTexts: phoneElements.slice(0, 20)
        };
      });
      logData.phoneDetails = phoneDetails;
    }
  } catch (err) {
    logData.error = err.message;
  } finally {
    await browser.close();
    fs.writeFileSync('detail_inspect_results.json', JSON.stringify(logData, null, 2));
    console.log('Results written to detail_inspect_results.json');
  }
}

run();
