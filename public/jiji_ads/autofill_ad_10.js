// Autofill Script for Jiji Ad #10: Building Material Estimator & BOQ Calcul...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #10: Building Material Estimator & BOQ Calculator • Cement, Tile & Paint Sizer", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Building Material Estimator & BOQ Calculator • Cement, Tile & Paint Sizer");
    console.log("✔ Set Title:", "Building Material Estimator & BOQ Calculator • Cement, Tile & Paint Sizer");
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
      setReactInputValue(descInput, "Eliminate building material waste and contractor over-budgeting on your construction sites!\n\nWe deploy instant computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.\n\nTHE \"SITE MATERIAL SHIELD\" BUNDLE:\n1. Precision Cement, Sand Tonnage & Granite Mix Calculator for Decking & Foundations [Value: ₦75,000]\n2. Floor Tile Square-Meter, Adhesive & Grout Packaging Sizer with 12% Cut Buffer [Value: ₦45,000]\n3. Emulsion & Gloss Paint Bucket Wall Coverage Calculator [Value: ₦35,000]\n4. POP Ceiling Sheets, Drywall Screws & Perimeter Track Estimator [Value: ₦35,000]\n5. Artisan Inflation Reality Check (Flags over-ordered materials instantly) [Value: ₦40,000]\n6. FREE BONUS: 1-Tap Professional Itemized BOQ PDF Generator with current Lagos prices [Value: ₦30,000]\n\nTOTAL VALUE: ₦260,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nProtect your construction budget from contractor inflation and stolen site materials.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the site material estimator now!\n\nSEARCH TAGS: building contractor lagos, boq bill of quantities, dangote cement price today, floor tiles calculation, pop ceiling design, building material estimator, quantity surveying software.");
    } else {
      descInput.innerText = "Eliminate building material waste and contractor over-budgeting on your construction sites!\n\nWe deploy instant computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.\n\nTHE \"SITE MATERIAL SHIELD\" BUNDLE:\n1. Precision Cement, Sand Tonnage & Granite Mix Calculator for Decking & Foundations [Value: ₦75,000]\n2. Floor Tile Square-Meter, Adhesive & Grout Packaging Sizer with 12% Cut Buffer [Value: ₦45,000]\n3. Emulsion & Gloss Paint Bucket Wall Coverage Calculator [Value: ₦35,000]\n4. POP Ceiling Sheets, Drywall Screws & Perimeter Track Estimator [Value: ₦35,000]\n5. Artisan Inflation Reality Check (Flags over-ordered materials instantly) [Value: ₦40,000]\n6. FREE BONUS: 1-Tap Professional Itemized BOQ PDF Generator with current Lagos prices [Value: ₦30,000]\n\nTOTAL VALUE: ₦260,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nProtect your construction budget from contractor inflation and stolen site materials.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the site material estimator now!\n\nSEARCH TAGS: building contractor lagos, boq bill of quantities, dangote cement price today, floor tiles calculation, pop ceiling design, building material estimator, quantity surveying software.";
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
