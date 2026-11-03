// Autofill Script for Jiji Ad #7: Estate Service Charge & Tenant Rent Port...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #7: Estate Service Charge & Tenant Rent Portal • Generator Diesel & Utility Ledger", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Estate Service Charge & Tenant Rent Portal • Generator Diesel & Utility Ledger");
    console.log("✔ Set Title:", "Estate Service Charge & Tenant Rent Portal • Generator Diesel & Utility Ledger");
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "45000");
    console.log("✔ Set Price:", "45000");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, "Manage residential estate facility service charges and tenant rent collections with ZERO disputes!\n\nWe deploy cloud-based property management portals for landlords, estate executive associations, and facility management firms across Nigeria.\n\nTHE \"ESTATE RECONCILIATION\" BUNDLE:\n1. Automated Rent Renewal Reminders sent via SMS & WhatsApp (30, 14, 7 days) [Value: ₦90,000]\n2. Itemized Facility Utility Billing (Generator diesel, security, waste, water) [Value: ₦60,000]\n3. Instant Digital Rent Receipts & Unalterable Payment Ledger [Value: ₦45,000]\n4. Landlord Disbursement Ledger & Monthly Diesel Consumption Audit [Value: ₦40,000]\n5. Transparent Tenant Maintenance Ticket & Defect Tracking Dashboard [Value: ₦35,000]\n6. FREE BONUS: Visitor Gate Pass QR Access Generator for Estate Security Guards [Value: ₦30,000]\n\nTOTAL VALUE: ₦300,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦45,000 Setup + ₦10,000/month\n👉 PLAN B (Annual Estate Pass — Best Value): ₦95,000 All-Inclusive (1 FULL YEAR FREE MAINTENANCE — Save ₦45,000!)\n\nEliminate rent arguments and keep your estate property accounts 100% reconciled.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp for your live estate demo today!\n\nSEARCH TAGS: estate management software, property management portal lagos, service charge receipt, tenant rent collection app, estate security gate pass, facility management software abuja.");
    } else {
      descInput.innerText = "Manage residential estate facility service charges and tenant rent collections with ZERO disputes!\n\nWe deploy cloud-based property management portals for landlords, estate executive associations, and facility management firms across Nigeria.\n\nTHE \"ESTATE RECONCILIATION\" BUNDLE:\n1. Automated Rent Renewal Reminders sent via SMS & WhatsApp (30, 14, 7 days) [Value: ₦90,000]\n2. Itemized Facility Utility Billing (Generator diesel, security, waste, water) [Value: ₦60,000]\n3. Instant Digital Rent Receipts & Unalterable Payment Ledger [Value: ₦45,000]\n4. Landlord Disbursement Ledger & Monthly Diesel Consumption Audit [Value: ₦40,000]\n5. Transparent Tenant Maintenance Ticket & Defect Tracking Dashboard [Value: ₦35,000]\n6. FREE BONUS: Visitor Gate Pass QR Access Generator for Estate Security Guards [Value: ₦30,000]\n\nTOTAL VALUE: ₦300,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦45,000 Setup + ₦10,000/month\n👉 PLAN B (Annual Estate Pass — Best Value): ₦95,000 All-Inclusive (1 FULL YEAR FREE MAINTENANCE — Save ₦45,000!)\n\nEliminate rent arguments and keep your estate property accounts 100% reconciled.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp for your live estate demo today!\n\nSEARCH TAGS: estate management software, property management portal lagos, service charge receipt, tenant rent collection app, estate security gate pass, facility management software abuja.";
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
