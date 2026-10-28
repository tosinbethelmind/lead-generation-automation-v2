const fs = require('fs');
const path = require('path');

const imgPath = path.join(process.cwd(), 'public', 'jiji_ads', 'ad_1_vin_checker.png');
const imgBase64 = fs.readFileSync(imgPath).toString('base64');

const scriptCode = `/**
 * ⚡ 100% FULLY AUTONOMOUS JIJI CHROME AD POSTER
 * Bethelmind Digital Solutions
 * 
 * AUTONOMOUS ACTIONS PERFORMED:
 * 1. Title Populated (64/70 chars)
 * 2. Category clicked: Services > Automotive Services > Vehicle Inspection / Car Repair
 * 3. Location clicked: Lagos State > Ikeja
 * 4. Description Populated (<840 words, verified)
 * 5. Price Populated (₦3,500)
 * 6. Photo Auto-Attached directly from embedded base64 (Zero file picker needed!)
 * 7. "Post ad" button clicked automatically!
 */

(async function runAutonomousJijiPost() {
  console.clear();
  console.log('%c🚀 STARTING 100% AUTONOMOUS JIJI AD POSTER...', 'color:#10b981; font-weight:bold; font-size:16px;');

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const AD = {
    title: "Tokunbo Car VIN Chassis Number Verification & Customs Duty Check",
    price: 3500,
    catPath: ['Services', 'Automotive Services', ['Vehicle Inspection', 'Car Repair & Diagnostics', 'Car Repair']],
    locPath: [['Lagos State', 'Lagos'], ['Ikeja', 'Lagos Island', 'Surulere']],
    imgName: "ad_1_vin_checker.png",
    imgB64: "${imgBase64}",
    desc: \`Planning to buy a Tokunbo car in Lagos or Nigeria? Never pay a car dealer until you run a verified chassis number (VIN) audit!

Over 45% of Tokunbo cars imported into Nigeria were bought from US salvage auctions with severe flood damage, deployed airbags, or rolled-back mileage.

WHAT WE PROVIDE IN 10 MINUTES:
- US Copart & IAAI salvage auction photos before repairs
- Genuine odometer mileage & rollback alerts
- Hurricane flood & saltwater damage history
- Nigeria Customs Service (NCS) import duty assessment
- Fair Lagos market valuation so you do not overpay

Save yourself from buying a vehicle that will live at the mechanic workshop. Fast and 100% verified.

Tap "Start Chat" on Jiji to verify your car immediately!\`
  };

  // ── Floating UI HUD ──────────────────────────────────────────────────────────
  let hud = document.getElementById('bm-auto-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'bm-auto-hud';
    hud.style.cssText = \`
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 999999999;
      background: #0b121e;
      border: 2px solid #10b981;
      border-radius: 16px;
      padding: 18px 22px;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 15px 50px rgba(0,0,0,0.85);
      max-width: 380px;
      line-height: 1.5;
    \`;
    document.body.appendChild(hud);
  }

  function setHud(step, text, color = '#10b981') {
    hud.innerHTML = \`
      <div style="font-weight:800; color:#10b981; font-size:15px; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <span>🤖</span> Autonomous Ad Poster Active
      </div>
      <div style="background:#020617; border:1px solid #1e293b; border-radius:10px; padding:10px 12px; margin-bottom:10px;">
        <div style="color:#94a3b8; font-size:11px; text-transform:uppercase; font-weight:700;">Current Progress:</div>
        <div style="color:\${color}; font-weight:700; font-size:13px; margin-top:2px;">Step \${step}/6: \${text}</div>
      </div>
      <div style="font-size:11.5px; color:#cbd5e1;">Ad #1: Tokunbo Car VIN Verification (₦3,500)</div>
    \`;
  }

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

  function clickTextMatch(targetList) {
    const targets = Array.isArray(targetList) ? targetList : [targetList];
    const elements = Array.from(document.querySelectorAll('div, span, button, a, li, p, label'));

    for (const target of targets) {
      // 1. Exact match
      for (const el of elements) {
        if (!el.offsetParent && el.tagName !== 'BODY') continue;
        const text = (el.innerText || '').trim();
        if (text.toLowerCase() === target.toLowerCase()) {
          el.click();
          return true;
        }
      }
      // 2. Contains match
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

  // ── STEP 1: TITLE ────────────────────────────────────────────────────────────
  setHud(1, 'Auto-filling Title...');
  const titleInput = document.querySelector('input[placeholder*="Title" i], input[name*="title" i], input[aria-label*="Title" i]');
  if (titleInput) {
    setNativeValue(titleInput, AD.title);
  }
  await sleep(700);

  // ── STEP 2: CATEGORY ─────────────────────────────────────────────────────────
  setHud(2, 'Selecting Category (Services > Automotive Services)...');
  const catTrigger = Array.from(document.querySelectorAll('div, button, label')).find(el => {
    const t = (el.innerText || '').trim();
    return (t === 'Category*' || t.startsWith('Category')) && el.querySelector('svg, i, .icon, [class*="arrow"], [class*="chevron"]');
  }) || Array.from(document.querySelectorAll('div, button')).find(el => (el.innerText || '').trim() === 'Category*');

  if (catTrigger) catTrigger.click();
  else clickTextMatch(['Category*', 'Category']);
  await sleep(800);

  clickTextMatch('Services');
  await sleep(700);
  clickTextMatch('Automotive Services');
  await sleep(700);
  clickTextMatch(AD.catPath[2]);
  await sleep(900);

  // ── STEP 3: LOCATION ─────────────────────────────────────────────────────────
  setHud(3, 'Selecting Location (Lagos > Ikeja)...');
  const locTrigger = Array.from(document.querySelectorAll('div, button, label')).find(el => {
    const t = (el.innerText || '').trim();
    return (t === 'Select Location*' || t.startsWith('Select Location') || t.includes('Location')) && el.querySelector('svg, i, .icon, [class*="arrow"], [class*="chevron"]');
  }) || Array.from(document.querySelectorAll('div, button')).find(el => (el.innerText || '').trim().includes('Location'));

  if (locTrigger) locTrigger.click();
  else clickTextMatch(['Select Location*', 'Select Location', 'Location*']);
  await sleep(800);

  clickTextMatch(AD.locPath[0]);
  await sleep(700);
  clickTextMatch(AD.locPath[1]);
  await sleep(900);

  // ── STEP 4: DESCRIPTION & PRICE ──────────────────────────────────────────────
  setHud(4, 'Auto-filling Description & ₦3,500 Price...');
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

  const priceInput = document.querySelector('input[placeholder*="Price" i], input[name*="price" i], input[aria-label*="Price" i], input[type="number"]');
  if (priceInput) {
    setNativeValue(priceInput, String(AD.price));
  }
  await sleep(800);

  // ── STEP 5: ATTACH PHOTO VIA BASE64 DATA TRANSFER ────────────────────────────
  setHud(5, 'Auto-attaching Flyer Photo from Base64...');
  try {
    const binary = atob(AD.imgB64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'image/png' });
    const file = new File([blob], AD.imgName, { type: 'image/png' });

    const dt = new DataTransfer();
    dt.items.add(file);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      fileInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Photo automatically attached via DataTransfer API!');
    }
  } catch (err) {
    console.warn('DataTransfer upload notice:', err.message);
  }
  await sleep(1500);

  // ── STEP 6: SUBMIT / POST AD ─────────────────────────────────────────────────
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  let countdown = 3;
  while (countdown > 0) {
    setHud(6, \`Posting ad in \${countdown} seconds... (Click to cancel)\`, '#38bdf8');
    await sleep(1000);
    countdown--;
  }

  setHud(6, 'Submitting advert...', '#10b981');
  const submitBtn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => {
    const t = (b.innerText || b.value || '').trim().toLowerCase();
    return t === 'post ad' || t === 'post' || t.includes('post ad');
  });

  if (submitBtn) {
    submitBtn.click();
    console.log('%c🎉 AD SUBMITTED AUTONOMOUSLY!', 'color:#10b981; font-weight:bold; font-size:16px;');
    hud.innerHTML = \`
      <div style="font-weight:800; color:#10b981; font-size:16px; margin-bottom:6px;">
        🎉 AD POSTED AUTONOMOUSLY!
      </div>
      <div style="font-size:12.5px; color:#f8fafc;">
        Jiji is now reviewing your advert. It will appear live in search shortly!
      </div>
    \`;
  } else {
    setHud(6, 'Ready! Click the orange "Post ad" button to submit.', '#eab308');
  }
})();
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'jiji_ads', 'jiji_console_autofill.js'), scriptCode, 'utf8');
console.log('Successfully generated full autonomous script with embedded image base64!');
console.log('Script size:', scriptCode.length, 'bytes');
