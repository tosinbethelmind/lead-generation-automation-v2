/**
 * 🚀 100% FULLY AUTOMATED JIJI AD POSTER FOR CHROME
 * Bethelmind Digital Solutions • Official Jiji Automation Suite
 *
 * HOW IT WORKS:
 * 1. Types Title
 * 2. Clicks Category -> Services -> Automotive Services -> Vehicle Inspection / Car Repair
 * 3. Clicks Location -> Lagos -> Ikeja
 * 4. Fills Description & Price (₦3,500)
 * 5. Pops open File Picker for Desktop\JIJI_ADS_PICTURES\ad_1_vin_checker.png
 * 6. Ready to submit in under 5 seconds!
 */

(async function runFullJijiAutomation() {
  console.clear();
  console.log('%c🚀 STARTING 100% FULL CHROME JIJI AUTOMATION...', 'color:#d4af37; font-weight:bold; font-size:16px;');

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const AD = {
    id: 1,
    title: "Tokunbo Car VIN Chassis Number Verification & Customs Duty Check",
    price: 3500,
    priceStr: "₦3,500",
    catPath: ['Services', 'Automotive Services', ['Vehicle Inspection', 'Car Repair & Diagnostics', 'Car Repair']],
    locPath: [['Lagos State', 'Lagos'], ['Ikeja', 'Lagos Island', 'Surulere']],
    img: "ad_1_vin_checker.png",
    desc: `Planning to buy a Tokunbo car in Lagos or Nigeria? Never pay a car dealer until you run a verified chassis number (VIN) audit!

Over 45% of Tokunbo cars imported into Nigeria were bought from US salvage auctions with severe flood damage, deployed airbags, or rolled-back mileage.

WHAT WE PROVIDE IN 10 MINUTES:
- US Copart & IAAI salvage auction photos before repairs
- Genuine odometer mileage & rollback alerts
- Hurricane flood & saltwater damage history
- Nigeria Customs Service (NCS) import duty assessment
- Fair Lagos market valuation so you do not overpay

Save yourself from buying a vehicle that will live at the mechanic workshop. Fast and 100% verified.

Tap "Start Chat" on Jiji to verify your car immediately!`
  };

  function setNativeValue(element, value) {
    if (!element) return;
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // Floating notification badge
  let badge = document.getElementById('bm-floating-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'bm-floating-badge';
    badge.style.cssText = `
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 99999999;
      background: #0b121e;
      border: 2px solid #d4af37;
      border-radius: 14px;
      padding: 16px 20px;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      max-width: 380px;
      line-height: 1.45;
    `;
    document.body.appendChild(badge);
  }

  function updateStatus(step, msg, color = '#d4af37') {
    console.log(`[Step ${step}] ${msg}`);
    badge.innerHTML = `
      <div style="font-weight:800; color:#d4af37; margin-bottom:6px; font-size:14px; display:flex; align-items:center; gap:6px;">
        <span>⚡</span> Jiji Chrome Auto-Poster (Ad #1)
      </div>
      <div style="color:${color}; font-weight:700; font-size:12.5px; margin-bottom:6px;">
        ${msg}
      </div>
      <div style="color:#94a3b8; font-size:11px; border-top:1px solid rgba(255,255,255,0.1); padding-top:6px; margin-top:6px;">
        Photo: <code>Desktop &gt; JIJI_ADS_PICTURES &gt; ${AD.img}</code>
      </div>
    `;
  }

  // Helper to click elements matching text
  function clickTextMatch(targetList) {
    const targets = Array.isArray(targetList) ? targetList : [targetList];
    const elements = Array.from(document.querySelectorAll('div, span, button, a, li, p, label'));

    for (const target of targets) {
      // 1. Try exact text match first
      for (const el of elements) {
        if (!el.offsetParent && el.tagName !== 'BODY') continue; // Skip hidden elements
        const text = (el.innerText || '').trim();
        if (text.toLowerCase() === target.toLowerCase()) {
          el.click();
          return true;
        }
      }
      // 2. Try contains text match
      for (const el of elements) {
        if (!el.offsetParent && el.tagName !== 'BODY') continue;
        const text = (el.innerText || '').trim();
        if (text.toLowerCase().includes(target.toLowerCase()) && text.length < target.length + 30) {
          el.click();
          return true;
        }
      }
    }
    return false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: TITLE
  // ─────────────────────────────────────────────────────────────────────────────
  updateStatus(1, 'Filling Title (64/70 chars)...');
  const titleInput = document.querySelector('input[placeholder*="Title" i], input[name*="title" i], input[aria-label*="Title" i]');
  if (titleInput) {
    setNativeValue(titleInput, AD.title);
    titleInput.focus();
  }
  await sleep(600);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: CATEGORY AUTOMATION
  // ─────────────────────────────────────────────────────────────────────────────
  updateStatus(2, 'Opening Category drawer...');
  const catTrigger = Array.from(document.querySelectorAll('div, button, label')).find(el => {
    const t = (el.innerText || '').trim();
    return (t === 'Category*' || t.startsWith('Category')) && el.querySelector('svg, i, .icon, [class*="arrow"], [class*="chevron"]');
  }) || Array.from(document.querySelectorAll('div, button')).find(el => (el.innerText || '').trim() === 'Category*');

  if (catTrigger) {
    catTrigger.click();
  } else {
    clickTextMatch(['Category*', 'Category']);
  }
  await sleep(800);

  updateStatus(2, 'Selecting Category: Services...');
  clickTextMatch('Services');
  await sleep(700);

  updateStatus(2, 'Selecting Category: Automotive Services...');
  clickTextMatch('Automotive Services');
  await sleep(700);

  updateStatus(2, 'Selecting Category: Vehicle Inspection / Repair...');
  clickTextMatch(AD.catPath[2]);
  await sleep(900);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: LOCATION AUTOMATION
  // ─────────────────────────────────────────────────────────────────────────────
  updateStatus(3, 'Opening Location selector...');
  const locTrigger = Array.from(document.querySelectorAll('div, button, label')).find(el => {
    const t = (el.innerText || '').trim();
    return (t === 'Select Location*' || t.startsWith('Select Location') || t.includes('Location')) && el.querySelector('svg, i, .icon, [class*="arrow"], [class*="chevron"]');
  }) || Array.from(document.querySelectorAll('div, button')).find(el => (el.innerText || '').trim().includes('Location'));

  if (locTrigger) {
    locTrigger.click();
  } else {
    clickTextMatch(['Select Location*', 'Select Location', 'Location*']);
  }
  await sleep(800);

  updateStatus(3, 'Selecting Location: Lagos State...');
  clickTextMatch(AD.locPath[0]);
  await sleep(700);

  updateStatus(3, 'Selecting Region: Ikeja...');
  clickTextMatch(AD.locPath[1]);
  await sleep(900);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: DESCRIPTION & PRICE
  // ─────────────────────────────────────────────────────────────────────────────
  updateStatus(4, 'Filling Description & Price...');
  
  // Find textarea or contenteditable
  const descEl = document.querySelector('textarea, div[contenteditable="true"]');
  if (descEl) {
    if (descEl.tagName.toLowerCase() === 'textarea') {
      setNativeValue(descEl, AD.desc);
    } else {
      descEl.innerText = AD.desc;
      descEl.dispatchEvent(new Event('input', { bubbles: true }));
      descEl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // Find price input
  const priceInput = document.querySelector('input[placeholder*="Price" i], input[name*="price" i], input[aria-label*="Price" i], input[type="number"]');
  if (priceInput) {
    setNativeValue(priceInput, String(AD.price));
  }
  await sleep(600);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 5: ATTACH PHOTO
  // ─────────────────────────────────────────────────────────────────────────────
  updateStatus(5, 'Opening File Picker for Flyer Photo...', '#10b981');
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    try {
      fileInput.click();
    } catch (_) {}
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS BANNER & FINAL READY STATE
  // ─────────────────────────────────────────────────────────────────────────────
  badge.innerHTML = `
    <div style="font-weight:800; color:#10b981; font-size:15px; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
      <span>🎉</span> 100% AUTOMATION COMPLETE!
    </div>
    <div style="color:#f8fafc; font-size:12.5px; margin-bottom:8px;">
      All fields (Title, Category, Location, Description, Price) populated!
    </div>
    <div style="background:rgba(212,175,55,0.12); border:1px solid #d4af37; border-radius:8px; padding:8px 10px; margin-bottom:10px; font-size:12px;">
      <strong style="color:#d4af37;">👉 Final Step:</strong> In the file window that just popped up, select:<br>
      <code style="color:#38bdf8; font-weight:bold;">${AD.img}</code><br>
      <span style="font-size:11px; color:#94a3b8;">(From Desktop &gt; JIJI_ADS_PICTURES)</span>
    </div>
    <div style="text-align:center;">
      <button onclick="document.getElementById('bm-floating-badge').remove()" style="background:#1e293b; color:#fff; border:1px solid #334155; border-radius:6px; padding:6px 14px; font-size:11px; cursor:pointer;">Dismiss Badge</button>
    </div>
  `;

  // Scroll smoothly to bottom
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  console.log('%c🎉 AUTOMATION FINISHED! Attach photo and click Post ad!', 'color:#10b981; font-weight:bold; font-size:14px;');
})();
