const fs = require('fs');
const { chromium } = require('playwright');

async function inspectCloseBtnStyles() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });

  const styles = await page.evaluate(() => {
    const wrapper = document.querySelector('.b-image-item__wrapper');
    const item = document.querySelector('.b-image-item');
    const controls = document.querySelector('.b-image-item__contorls');
    const btn = document.querySelector('.b-image-item__close-btn');

    const getBox = el => el ? el.getBoundingClientRect().toJSON() : null;
    const getComp = el => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        visibility: s.visibility,
        opacity: s.opacity,
        pointerEvents: s.pointerEvents,
        position: s.position,
        zIndex: s.zIndex
      };
    };

    return {
      wrapperBox: getBox(wrapper),
      wrapperStyle: getComp(wrapper),
      itemBox: getBox(item),
      itemStyle: getComp(item),
      controlsBox: getBox(controls),
      controlsStyle: getComp(controls),
      btnBox: getBox(btn),
      btnStyle: getComp(btn)
    };
  });

  console.log('Styles & Positions:', JSON.stringify(styles, null, 2));

  // Now let's try moving mouse directly to wrapper center
  if (styles.wrapperBox) {
    const x = styles.wrapperBox.x + styles.wrapperBox.width / 2;
    const y = styles.wrapperBox.y + styles.wrapperBox.height / 2;
    console.log(`Moving mouse to (${x}, ${y})...`);
    await page.mouse.move(x, y);
    await page.waitForTimeout(1000);

    const stylesAfterHover = await page.evaluate(() => {
      const btn = document.querySelector('.b-image-item__close-btn');
      const controls = document.querySelector('.b-image-item__contorls');
      const getComp = el => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        return { display: s.display, visibility: s.visibility, opacity: s.opacity };
      };
      return {
        controls: getComp(controls),
        btn: getComp(btn),
        btnBox: btn ? btn.getBoundingClientRect().toJSON() : null
      };
    });
    console.log('Styles after mouse move:', JSON.stringify(stylesAfterHover, null, 2));

    if (stylesAfterHover.btnBox && stylesAfterHover.btnBox.width > 0) {
      const bx = stylesAfterHover.btnBox.x + stylesAfterHover.btnBox.width / 2;
      const by = stylesAfterHover.btnBox.y + stylesAfterHover.btnBox.height / 2;
      console.log(`Clicking exact button coordinates (${bx}, ${by})...`);
      await page.mouse.click(bx, by);
      await page.waitForTimeout(2000);

      const check = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
      console.log('Remaining images after mouse click at coords:', check);
    }
  }

  await browser.close();
}

inspectCloseBtnStyles().catch(console.error);
