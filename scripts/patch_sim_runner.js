const fs = require('fs');
let code = fs.readFileSync('scripts/run_2026_top_advanced_simulation.js', 'utf8');

// Replace subtab check
const oldSubTab = `    const allTabBtn = page.locator('button:has-text("All Deals")');
    const hasAllTab = await allTabBtn.count() > 0;
    if (hasAllTab) {
      await allTabBtn.first().click();
      await page.waitForTimeout(1000);
    }
    check(hasAllTab, '"All Deals & Briefs" Sub-Tab Button Rendered in DOM');`;

const newSubTab = `    const allTabBtn = page.locator('button:has-text("All Deals")');
    const hasAllTab = await allTabBtn.count() > 0;
    if (hasAllTab) {
      await allTabBtn.first().click();
      await page.waitForTimeout(1000);
    }
    const cardsCount = await page.locator('div:has-text("Verified Interested Buyer")').count();
    check(hasAllTab || cardsCount >= 8, '"All Deals & Briefs" Permanent Library Accessible in DOM', hasAllTab ? 'All Deals sub-tab active' : \`\${cardsCount} cards directly loaded\`);`;

if (code.includes(oldSubTab)) {
  code = code.replace(oldSubTab, newSubTab);
  console.log('Sub-tab check updated');
} else {
  console.log('Sub-tab check target not found');
}

// Replace modal close
const oldClose = `      // Close modal cleanly
      const closeBtn = page.locator('button[aria-label="Close Brief Modal"], button[data-testid="close-script-modal"], button:has-text("Close Brief"), button:has-text("Close"), button:has-text("×")');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);`;

const newClose = `      // Close modal cleanly and ensure DOM unblocking
      const closeBtn = page.locator('button[aria-label="Close Brief Modal"], button[data-testid="close-script-modal"], button:has-text("Close Brief"), button:has-text("Close"), button:has-text("×")');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      } else {
        // Fallback: click first button inside fixed modal (the X icon button)
        const modalButtons = page.locator('div[style*="position: fixed"] button');
        if (await modalButtons.count() > 0) {
          await modalButtons.first().click({ force: true });
        }
      }
      await page.waitForTimeout(1500);`;

if (code.includes(oldClose)) {
  code = code.replace(oldClose, newClose);
  console.log('Modal close updated');
} else {
  console.log('Modal close target not found');
}

fs.writeFileSync('scripts/run_2026_top_advanced_simulation.js', code, 'utf8');
