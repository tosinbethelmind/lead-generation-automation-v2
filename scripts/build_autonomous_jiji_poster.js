const fs = require('fs');
const path = require('path');

const imgPath8 = path.join(process.cwd(), 'public', 'jiji_ads', 'ad_8_dispatch_waybill_tracker.png');
const imgBase64_8 = fs.readFileSync(imgPath8).toString('base64');

const scriptCode = `/**
 * ⚡ BULLETPROOF JIJI POSTER FOR AD #8 (Lagos, Ojodu)
 * Bethelmind Digital Solutions
 */

(function runAd8Poster() {
  console.clear();
  console.log('%c🚀 JIJI AD #8 (Interstate Dispatch & Waybill Tracker)...', 'color:#10b981; font-weight:bold; font-size:16px;');

  const AD = {
    id: 8,
    title: "Interstate Dispatch Aggregator & Real-Time Waybill Tracker",
    price: 35000,
    priceStr: "₦35,000",
    imgName: "ad_8_dispatch_waybill_tracker.png",
    imgB64: "${imgBase64_8}",
    desc: \`Stop answering repeated "Where is my parcel?" phone calls from customers.

We build automated dispatch and freight logistics engines for Nigerian courier businesses, haulage contractors, and interstate delivery hubs.

WHAT IS INCLUDED:
- Automated SMS and WhatsApp tracking links dispatched upon package intake
- Real-time milestone status updates (Loaded, In Transit, Arrived Hub, Delivered)
- Digital proof-of-delivery signature & recipient photo verification
- Highway driver diesel trip mileage auditor (flags fuel siphoning)
- GIG, Gokada & local dispatch cost comparison calculator

Build trust and cut dispatch management costs in half. Send a message on Jiji to test the waybill tracker now.\`
  };

  function setNative(el, val) {
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
    if (setter) setter.call(el, val); else el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // 1. Fill Title
  const titleInput = document.querySelector('input[placeholder*="Title" i], input[name*="title" i], input[aria-label*="Title" i]');
  if (titleInput) {
    setNative(titleInput, AD.title);
    console.log('✅ Title populated for Ad #8');
  }

  // 2. Attach Photo
  const hasPhoto = document.querySelector('.b-file-uploader__preview, img[src*="blob:"], .b-image-preview');
  if (!hasPhoto) {
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
        console.log('✅ Photo automatically attached for Ad #8!');
      }
    } catch (e) {
      console.warn('Photo notice:', e.message);
    }
  }

  // 3. Fill Description if on Step 2
  const descBox = document.querySelector('textarea, div[contenteditable="true"]');
  if (descBox) {
    if (descBox.tagName === 'TEXTAREA') setNative(descBox, AD.desc);
    else { descBox.innerText = AD.desc; descBox.dispatchEvent(new Event('input', { bubbles: true })); }
    console.log('✅ Description populated for Ad #8');
  }

  // 4. Fill Price if on Step 2
  const priceBox = document.querySelector('input[type="number"], input[placeholder*="Price" i], input[name*="price" i]');
  if (priceBox) {
    setNative(priceBox, String(AD.price));
    console.log('✅ Price (₦35,000) populated for Ad #8');
  }

  console.log('🎉 Ad #8 script executed!');
})();
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'jiji_ads', 'jiji_console_autofill.js'), scriptCode, 'utf8');
console.log('Successfully updated jiji_console_autofill.js for Ad #8!');
