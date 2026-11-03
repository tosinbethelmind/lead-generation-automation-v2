// Autofill Script for Jiji Ad #3: Solar & Inverter WhatsApp Quoting Tool &...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #3: Solar & Inverter WhatsApp Quoting Tool & Load Calculator for Solar Installers", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Solar & Inverter WhatsApp Quoting Tool & Load Calculator for Solar Installers");
    console.log("✔ Set Title:", "Solar & Inverter WhatsApp Quoting Tool & Load Calculator for Solar Installers");
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
      setReactInputValue(descInput, "ATTENTION SOLAR INSTALLERS & INVERTER DEALERS:\n\nStop wasting hours doing manual load calculations for prospective clients who end up ghosting you or bargaining down your profit!\n\nWe deploy an automated Solar & Inverter BOQ Load Sizing Calculator branded with your company name, logo, and direct WhatsApp hotline.\n\nTHE \"SOLAR CLOSER SUITE\" BUNDLE:\n1. Interactive Appliance Load Calculator (ACs, fridges, pumping machines, lighting) [Value: ₦80,000]\n2. Instant WhatsApp BOQ Quotation Generator sent to client in 60 seconds [Value: ₦50,000]\n3. Motor Inrush Surge Protection Sizer (Prevents inverters tripping or blowing up) [Value: ₦30,000]\n4. NEPA Band A Tariff (₦209/kWh) vs Generator Fuel Payback ROI Clock [Value: ₦35,000]\n5. 1-Tap Bankable PDF Engineering Proposal Generator with your logo [Value: ₦40,000]\n6. FREE BONUS: 5-Year Lithium LiFePO4 vs Tubular Gel Battery Cost Comparison Sheet [Value: ₦20,000]\n\nTOTAL VALUE: ₦255,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n👉 PLAN C (Full Custom Suite): ₦75,000 deposit (₦150,000 total)\n\nClose 3x more solar projects on autopilot with zero paperwork stress.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the interactive demo now!\n\nSEARCH TAGS: solar installation nigeria, 5kva inverter price, 3.5kva solar system, felicity lithium battery, solar load calculator, luminous inverter lagos, solar boq generator, tubular battery price.");
    } else {
      descInput.innerText = "ATTENTION SOLAR INSTALLERS & INVERTER DEALERS:\n\nStop wasting hours doing manual load calculations for prospective clients who end up ghosting you or bargaining down your profit!\n\nWe deploy an automated Solar & Inverter BOQ Load Sizing Calculator branded with your company name, logo, and direct WhatsApp hotline.\n\nTHE \"SOLAR CLOSER SUITE\" BUNDLE:\n1. Interactive Appliance Load Calculator (ACs, fridges, pumping machines, lighting) [Value: ₦80,000]\n2. Instant WhatsApp BOQ Quotation Generator sent to client in 60 seconds [Value: ₦50,000]\n3. Motor Inrush Surge Protection Sizer (Prevents inverters tripping or blowing up) [Value: ₦30,000]\n4. NEPA Band A Tariff (₦209/kWh) vs Generator Fuel Payback ROI Clock [Value: ₦35,000]\n5. 1-Tap Bankable PDF Engineering Proposal Generator with your logo [Value: ₦40,000]\n6. FREE BONUS: 5-Year Lithium LiFePO4 vs Tubular Gel Battery Cost Comparison Sheet [Value: ₦20,000]\n\nTOTAL VALUE: ₦255,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n👉 PLAN C (Full Custom Suite): ₦75,000 deposit (₦150,000 total)\n\nClose 3x more solar projects on autopilot with zero paperwork stress.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the interactive demo now!\n\nSEARCH TAGS: solar installation nigeria, 5kva inverter price, 3.5kva solar system, felicity lithium battery, solar load calculator, luminous inverter lagos, solar boq generator, tubular battery price.";
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
