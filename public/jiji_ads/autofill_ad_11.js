// Autofill Script for Jiji Ad #11: Fast CAC Business Name & Company Registr...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #11: Fast CAC Business Name & Company Registration (LTD) • Approved in 3 to 5 Days", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Fast CAC Business Name & Company Registration (LTD) • Approved in 3 to 5 Days");
    console.log("✔ Set Title:", "Fast CAC Business Name & Company Registration (LTD) • Approved in 3 to 5 Days");
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "38500");
    console.log("✔ Set Price:", "38500");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, "Register your Business Name or Private Limited Company (LTD) with the Corporate Affairs Commission (CAC) in 3 to 5 working days without delay or agent overcharging!\n\nDon't let the Central Bank or commercial banks freeze your personal accounts for business transactions. Upgrade to a certified corporate account today.\n\nTHE \"FAST-TRACK CORPORATE COMPLIANCE\" BUNDLE:\n1. Official CAC Name Availability Search & Instant Reservation [Value: ₦15,000]\n2. Certified CAC Digital Registration Certificate with official QR Verification [Value: ₦35,000]\n3. Certified Status Report / Memorandum & Articles of Association (MEMART) [Value: ₦25,000]\n4. Corporate Tax Identification Number (TIN) for immediate business banking [Value: ₦15,000]\n5. Free Corporate Bank Account Opening Facilitation (Moniepoint, OPay, Wema) [Value: ₦20,000]\n6. FREE BONUS: Corporate Seal & Digital Stamp Design Pack [Value: ₦15,000]\n\nTOTAL VALUE: ₦125,000\nTRANSPARENT ALL-INCLUSIVE PRICING:\n👉 Business Name Registration: ₦38,500 all-inclusive\n👉 Private Limited Company (LTD, 1M Share Capital): ₦85,000 all-inclusive\n\n100% Guaranteed Approval or Full Refund. \n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji to check your proposed business name availability free now!\n\nSEARCH TAGS: cac registration lagos, business name registration, registered limited company ltd, cac certificate, firs tin number, open corporate bank account, business registration agent abuja.");
    } else {
      descInput.innerText = "Register your Business Name or Private Limited Company (LTD) with the Corporate Affairs Commission (CAC) in 3 to 5 working days without delay or agent overcharging!\n\nDon't let the Central Bank or commercial banks freeze your personal accounts for business transactions. Upgrade to a certified corporate account today.\n\nTHE \"FAST-TRACK CORPORATE COMPLIANCE\" BUNDLE:\n1. Official CAC Name Availability Search & Instant Reservation [Value: ₦15,000]\n2. Certified CAC Digital Registration Certificate with official QR Verification [Value: ₦35,000]\n3. Certified Status Report / Memorandum & Articles of Association (MEMART) [Value: ₦25,000]\n4. Corporate Tax Identification Number (TIN) for immediate business banking [Value: ₦15,000]\n5. Free Corporate Bank Account Opening Facilitation (Moniepoint, OPay, Wema) [Value: ₦20,000]\n6. FREE BONUS: Corporate Seal & Digital Stamp Design Pack [Value: ₦15,000]\n\nTOTAL VALUE: ₦125,000\nTRANSPARENT ALL-INCLUSIVE PRICING:\n👉 Business Name Registration: ₦38,500 all-inclusive\n👉 Private Limited Company (LTD, 1M Share Capital): ₦85,000 all-inclusive\n\n100% Guaranteed Approval or Full Refund. \n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji to check your proposed business name availability free now!\n\nSEARCH TAGS: cac registration lagos, business name registration, registered limited company ltd, cac certificate, firs tin number, open corporate bank account, business registration agent abuja.";
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
