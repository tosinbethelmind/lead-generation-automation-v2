const fs = require('fs');
const path = require('path');

const imgPath6 = path.join(process.cwd(), 'public', 'jiji_ads', 'ad_6_school_fee_portal.png');
const imgBase64_6 = fs.readFileSync(imgPath6).toString('base64');

const scriptCode = `/**
 * ⚡ 100% AUTONOMOUS JIJI AD POSTER (AD #6 TO #15)
 * Location configured for: Lagos, Ojodu
 * Bethelmind Digital Solutions
 */

(async function runAutonomousJijiPost() {
  console.clear();
  console.log('%c🚀 STARTING AUTONOMOUS POSTER FOR AD #6 (Lagos, Ojodu)...', 'color:#10b981; font-weight:bold; font-size:16px;');

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const ADS = {
    6: {
      id: 6,
      title: "Private School Term Fee Payment Portal & Result PIN Gateway",
      price: 50000,
      priceStr: "₦50,000",
      catPath: ['Services', 'Computer & IT Services', ['Software', 'Web Design & Development', 'Computer & IT']],
      locPath: [['Lagos State', 'Lagos'], ['Ojodu', 'Ojodu / Berger', 'Ikeja']],
      imgName: "ad_6_school_fee_portal.png",
      imgB64: "${imgBase64_6}",
      desc: \`Stop tracking school fee defaulters manually on messy exercise books and spreadsheets.

We provide secure online school fee payment portals for private primary and secondary schools in Nigeria.

WHAT IS INCLUDED:
- Automated result gating (digital report cards locked until fees clear)
- Scratch-card & electronic Result Checker PIN generation
- Instant Moniepoint & Paystack term fee bank transfer reconciliation
- Termly broadsheet exam scoring and report card generation
- Automated WhatsApp fee balance reminders sent to parents

Recover school fees on schedule and modernize your school administration. Send a message on Jiji for a live demo for your school today.\`
    }
  };

  const AD = ADS[6];

  // ── Floating HUD ─────────────────────────────────────────────────────────────
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
      padding: 16px 20px;
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
        <span>🤖</span> Jiji Poster: Ad #6 (School Portal)
      </div>
      <div style="background:#020617; border:1px solid #1e293b; border-radius:10px; padding:10px 12px; margin-bottom:10px;">
        <div style="color:#94a3b8; font-size:11px; text-transform:uppercase; font-weight:700;">Status:</div>
        <div style="color:\${color}; font-weight:700; font-size:13px; margin-top:2px;">\${text}</div>
      </div>
      <div style="font-size:11.5px; color:#cbd5e1;">📍 Location: <strong>Lagos, Ojodu</strong> • Price: <strong>₦50,000</strong></div>
    \`;
  }

  function triggerEvents(el) {
    if (!el) return;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
      el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
    });
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

  function clickText(targetList) {
    const targets = Array.isArray(targetList) ? targetList : [targetList];
    const elements = Array.from(document.querySelectorAll('div, span, button, a, li, p, label'));

    for (const target of targets) {
      for (const el of elements) {
        if (!el.offsetParent && el.tagName !== 'BODY') continue;
        const text = (el.innerText || '').trim();
        if (text.toLowerCase() === target.toLowerCase()) {
          triggerEvents(el);
          return true;
        }
      }
      for (const el of elements) {
        if (!el.offsetParent && el.tagName !== 'BODY') continue;
        const text = (el.innerText || '').trim();
        if (text.toLowerCase().includes(target.toLowerCase()) && text.length < target.length + 30) {
          triggerEvents(el);
          return true;
        }
      }
    }
    return false;
  }

  // ── STEP 1: TITLE ────────────────────────────────────────────────────────────
  setHud(1, 'Filling Title for Ad #6...');
  const titleInput = document.querySelector('input[placeholder*="Title" i], input[name*="title" i], input[aria-label*="Title" i]');
  if (titleInput) {
    setNativeValue(titleInput, AD.title);
  }
  await sleep(700);

  // ── STEP 2: PHOTO ATTACHMENT ─────────────────────────────────────────────────
  const hasPhoto = document.querySelector('.b-file-uploader__preview, img[src*="blob:"], .b-image-preview');
  if (!hasPhoto) {
    setHud(2, 'Attaching School Portal Flyer...');
    try {
      const binary = atob(AD.imgB64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      const blob = new Blob([array], { type: 'image/png' });
      const file = new File([blob], AD.imgName, { type: 'image/png' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (_) {}
    await sleep(800);
  }

  // ── STEP 3: CATEGORY SELECTION ───────────────────────────────────────────────
  setHud(3, 'Selecting Category: Services > Computer & IT Services...');

  // Check suggestion chip first
  const suggestionChip = Array.from(document.querySelectorAll('div, button, span, a')).find(el => {
    const t = (el.innerText || '').toLowerCase();
    return (t.includes('software') || t.includes('computer & it') || t.includes('web design')) && el.offsetParent;
  });

  if (suggestionChip && suggestionChip.innerText.length < 80) {
    triggerEvents(suggestionChip);
    await sleep(800);
  } else {
    const catBox = Array.from(document.querySelectorAll('div, label, button')).find(el => {
      const t = (el.innerText || '').trim();
      return (t.startsWith('Category') || t === 'Category*') && el.querySelector('svg, i, .icon, [class*="chevron"], [class*="arrow"]');
    }) || Array.from(document.querySelectorAll('div')).find(el => (el.innerText || '').trim() === 'Category*');

    if (catBox) {
      triggerEvents(catBox);
      triggerEvents(catBox.parentElement);
      await sleep(700);
    }

    clickText(['Services', 'Service']);
    await sleep(700);
    clickText(['Computer & IT Services', 'Computer & IT', 'IT Services']);
    await sleep(700);
    clickText(AD.catPath[2]);
    await sleep(800);
  }

  // ── STEP 4: LOCATION (LAGOS, OJODU) ──────────────────────────────────────────
  setHud(4, 'Selecting Location: Lagos > Ojodu...');
  const locBox = Array.from(document.querySelectorAll('div, label, button')).find(el => {
    const t = (el.innerText || '').trim();
    return (t.includes('Select Location') || t.includes('Location*')) && el.querySelector('svg, i, .icon, [class*="chevron"], [class*="arrow"]');
  }) || Array.from(document.querySelectorAll('div')).find(el => (el.innerText || '').trim().includes('Select Location'));

  if (locBox) {
    triggerEvents(locBox);
    triggerEvents(locBox.parentElement);
    await sleep(700);
  }

  clickText(AD.locPath[0]);
  await sleep(700);
  clickText(AD.locPath[1]);
  await sleep(800);

  // ── STEP 5: CLICK "NEXT" IF VISIBLE ──────────────────────────────────────────
  const nextBtn = Array.from(document.querySelectorAll('button')).find(b => {
    const t = (b.innerText || '').trim().toLowerCase();
    return t === 'next' || t === 'continue';
  });

  if (nextBtn) {
    setHud(5, 'Advancing to Step 2 (Next)...');
    triggerEvents(nextBtn);
    await sleep(1200);
  }

  // ── STEP 6: DESCRIPTION & ₦50,000 PRICE ──────────────────────────────────────
  let filledStep2 = false;
  for (let attempt = 0; attempt < 8; attempt++) {
    const descEl = document.querySelector('textarea, div[contenteditable="true"]');
    const priceInput = document.querySelector('input[placeholder*="Price" i], input[name*="price" i], input[aria-label*="Price" i], input[type="number"]');

    if (descEl) {
      setHud(6, 'Filling School Portal Description & ₦50k Price...');
      if (descEl.tagName.toLowerCase() === 'textarea') {
        if (!descEl.value || descEl.value.length < 20) setNativeValue(descEl, AD.desc);
      } else {
        if (!descEl.innerText || descEl.innerText.length < 20) {
          descEl.innerText = AD.desc;
          descEl.dispatchEvent(new Event('input', { bubbles: true }));
          descEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }

    if (priceInput) {
      if (!priceInput.value || priceInput.value === '0') {
        setNativeValue(priceInput, String(AD.price));
      }
    }

    if (descEl && priceInput) {
      filledStep2 = true;
      break;
    }
    await sleep(800);
  }

  // ── STEP 7: AUTO-SUBMIT POST AD ──────────────────────────────────────────────
  const postBtn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => {
    const t = (b.innerText || b.value || '').trim().toLowerCase();
    return t === 'post ad' || t === 'post' || t.includes('post ad');
  });

  if (postBtn && filledStep2) {
    setHud(7, 'Posting Ad #6 into review...', '#10b981');
    triggerEvents(postBtn);
    await sleep(1000);
  }

  hud.innerHTML = \`
    <div style="font-weight:800; color:#10b981; font-size:15px; margin-bottom:6px;">
      🎉 AD #6 READY!
    </div>
    <div style="font-size:12px; color:#f8fafc; margin-bottom:8px;">
      School Portal Title &amp; Photo loaded for <strong>Lagos, Ojodu</strong>! If Category or Location needs a tap, click it and press <strong>Next &gt; Post Ad</strong>.
    </div>
  \`;
  console.log('%c🎉 AD #6 COMPLETED!', 'color:#10b981; font-weight:bold; font-size:16px;');
})();
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'jiji_ads', 'jiji_console_autofill.js'), scriptCode, 'utf8');
console.log('Successfully generated autonomous script for Ad #6 (Lagos, Ojodu)!');
