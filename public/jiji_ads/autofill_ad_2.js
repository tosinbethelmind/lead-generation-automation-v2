// Autofill Script for Jiji Ad #2: 24-Hour Express Business Website Design,...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #2: 24-Hour Express Business Website Design, Google SEO & 24/7 WhatsApp AI Closer", "color: #10b981; font-weight: bold; font-size: 14px;");

  function setReactInputValue(input, value) {
    if (!input) return false;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                                   Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  // 1. Fill Title
  const titleInput = document.querySelector('input[name="title"]') || 
                     document.querySelector('input[placeholder*="Title" i]') || 
                     document.querySelector('input[placeholder*="Ad title" i]');
  if (titleInput) {
    setReactInputValue(titleInput, "24-Hour Express Business Website Design, Google SEO & 24/7 WhatsApp AI Closer");
    console.log("✔ Set Title:", "24-Hour Express Business Website Design, Google SEO & 24/7 WhatsApp AI Closer");
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "35000");
    console.log("✔ Set Price:", "35000");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, "Stop losing paying customers when they search for your business on Google!\n\nWhen customers search your business name on Google and see only directory or social media pages, they assume you are an unverified vendor and refuse to pay before delivery.\n\nWe build and launch your complete, ultra-fast mobile business website + 24/7 WhatsApp AI Closer in exactly 24 HOURS.\n\nTHE \"JIJI SELLER DOMINANCE\" 24-HOUR BUNDLE:\n1. Official Mobile Business Website (Fast-loading on Android, iPhone & Laptops) [Value: ₦120,000]\n2. 24/7 AI WhatsApp Sales Closer (Replies to customer inquiries and sends prices in 3 seconds) [Value: ₦50,000]\n3. Google Search Map & Business Profile SEO Ranking Setup [Value: ₦30,000]\n4. Automated Moniepoint / OPay Bank Transfer Verification Shield (Anti-Fake Alert) [Value: ₦35,000]\n5. 36-State Interstate Delivery Fee Sizer [Value: ₦25,000]\n6. FREE BONUS: Jiji Page 1 Ad SEO Keywords (Save ₦45,000 in monthly Jiji Boosts) [Value: ₦45,000]\n\nTOTAL VALUE: ₦305,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance (Keep it running for just ₦230/day!)\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE HOSTING & MAINTENANCE — Save ₦39,000!)\n👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 100% code handover\n\n100% RISK-FREE GUARANTEE: Test your live working website prototype free on your phone before paying 1 Kobo!\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji to see a live working demo for your business right now!\n\nSEARCH TAGS: website design lagos, web designer abuja, ecommerce website nigeria, business website developer, cheap website design, company profile website, online store setup, google seo ranking.");
    } else {
      descInput.innerText = "Stop losing paying customers when they search for your business on Google!\n\nWhen customers search your business name on Google and see only directory or social media pages, they assume you are an unverified vendor and refuse to pay before delivery.\n\nWe build and launch your complete, ultra-fast mobile business website + 24/7 WhatsApp AI Closer in exactly 24 HOURS.\n\nTHE \"JIJI SELLER DOMINANCE\" 24-HOUR BUNDLE:\n1. Official Mobile Business Website (Fast-loading on Android, iPhone & Laptops) [Value: ₦120,000]\n2. 24/7 AI WhatsApp Sales Closer (Replies to customer inquiries and sends prices in 3 seconds) [Value: ₦50,000]\n3. Google Search Map & Business Profile SEO Ranking Setup [Value: ₦30,000]\n4. Automated Moniepoint / OPay Bank Transfer Verification Shield (Anti-Fake Alert) [Value: ₦35,000]\n5. 36-State Interstate Delivery Fee Sizer [Value: ₦25,000]\n6. FREE BONUS: Jiji Page 1 Ad SEO Keywords (Save ₦45,000 in monthly Jiji Boosts) [Value: ₦45,000]\n\nTOTAL VALUE: ₦305,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance (Keep it running for just ₦230/day!)\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE HOSTING & MAINTENANCE — Save ₦39,000!)\n👉 PLAN C (Full Custom .com Suite): ₦75,000 deposit (₦150,000 total) for dedicated .com domain & 100% code handover\n\n100% RISK-FREE GUARANTEE: Test your live working website prototype free on your phone before paying 1 Kobo!\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji to see a live working demo for your business right now!\n\nSEARCH TAGS: website design lagos, web designer abuja, ecommerce website nigeria, business website developer, cheap website design, company profile website, online store setup, google seo ranking.";
      descInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    console.log("✔ Set Description successfully.");
  } else {
    console.warn("⚠ Description textarea not detected.");
  }

  // 4. Fill Phone Number
  const phoneInput = document.querySelector('input[name="phone"]') || 
                     document.querySelector('input[placeholder*="Phone" i]');
  if (phoneInput && !phoneInput.value) {
    setReactInputValue(phoneInput, "08022791227");
    console.log("✔ Set Phone Number: 08022791227");
  }

  console.log("%c[Success] Advert data populated! Please review and click 'Post Ad'.", "color: #3b82f6; font-weight: bold;");
})();
