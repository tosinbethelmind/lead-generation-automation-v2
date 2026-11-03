const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'run_2026_top_advanced_simulation.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `      // Close modal cleanly
      const closeBtn = page.locator('button[aria-label="Close Brief Modal"], button[data-testid="close-script-modal"], button:has-text("Close Brief"), button:has-text("Close"), button:has-text("×")');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);`,
  `      // Close modal cleanly with Escape and DOM backdrop cleanup
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Close"), button:has-text("×")');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click({ force: true }).catch(() => {});
      }
      await page.evaluate(() => {
        const overlays = document.querySelectorAll('.fixed, [role="dialog"], [aria-modal="true"]');
        overlays.forEach(el => {
          if (el.textContent.includes('LASRERA Mandate')) el.remove();
        });
      });
      await page.waitForTimeout(1000);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched modal closing in simulation!');
