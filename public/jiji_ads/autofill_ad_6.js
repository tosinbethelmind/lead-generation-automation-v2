// Autofill Script for Jiji Ad #6: Private School Term Fee Portal & Online ...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #6: Private School Term Fee Portal & Online Result Checker • Stop Fee Defaulters", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Private School Term Fee Portal & Online Result Checker • Stop Fee Defaulters");
    console.log("✔ Set Title:", "Private School Term Fee Portal & Online Result Checker • Stop Fee Defaulters");
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
      setReactInputValue(descInput, "Stop tracking school fee defaulters manually on messy exercise books and Excel sheets!\n\nRecover unpaid school fees on schedule and modernize your school administration with our automated Term Fee Recovery & Digital Result Portal.\n\nTHE \"SCHOOL REVENUE RECOVERY\" BUNDLE:\n1. Automated Digital Result Gating (Report cards locked until fees clear 100%) [Value: ₦120,000]\n2. Scratch-Card & Electronic Result Checker PIN Generator [Value: ₦45,000]\n3. 3-Stage Installment Debt Aging Matrix (Resumption, Mid-Term, Exam Week) [Value: ₦50,000]\n4. Instant Moniepoint & Paystack Term Fee Bank Reconciliation [Value: ₦40,000]\n5. Termly Broadsheet Exam Scoring & Printable PDF Report Cards [Value: ₦50,000]\n6. FREE BONUS: Automated Polite WhatsApp Balance Reminders for Parents [Value: ₦30,000]\n\nTOTAL VALUE: ₦335,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Termly Flex): ₦45,000 Setup + ₦10,000/month (or ₦25,000/term)\n👉 PLAN B (Annual Academic Session Pass): ₦95,000 All-Inclusive (Covers all 3 terms — 1 Full Year Free Maintenance!)\n\nRecover school fees on time and eliminate bursar cash leakage this session.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nSend a message on Jiji or WhatsApp for a live portal demonstration for your school today!\n\nSEARCH TAGS: school portal nigeria, school management software, online result checker, report card printing software, school fees payment portal, private school website, secondary school portal lagos.");
    } else {
      descInput.innerText = "Stop tracking school fee defaulters manually on messy exercise books and Excel sheets!\n\nRecover unpaid school fees on schedule and modernize your school administration with our automated Term Fee Recovery & Digital Result Portal.\n\nTHE \"SCHOOL REVENUE RECOVERY\" BUNDLE:\n1. Automated Digital Result Gating (Report cards locked until fees clear 100%) [Value: ₦120,000]\n2. Scratch-Card & Electronic Result Checker PIN Generator [Value: ₦45,000]\n3. 3-Stage Installment Debt Aging Matrix (Resumption, Mid-Term, Exam Week) [Value: ₦50,000]\n4. Instant Moniepoint & Paystack Term Fee Bank Reconciliation [Value: ₦40,000]\n5. Termly Broadsheet Exam Scoring & Printable PDF Report Cards [Value: ₦50,000]\n6. FREE BONUS: Automated Polite WhatsApp Balance Reminders for Parents [Value: ₦30,000]\n\nTOTAL VALUE: ₦335,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Termly Flex): ₦45,000 Setup + ₦10,000/month (or ₦25,000/term)\n👉 PLAN B (Annual Academic Session Pass): ₦95,000 All-Inclusive (Covers all 3 terms — 1 Full Year Free Maintenance!)\n\nRecover school fees on time and eliminate bursar cash leakage this session.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nSend a message on Jiji or WhatsApp for a live portal demonstration for your school today!\n\nSEARCH TAGS: school portal nigeria, school management software, online result checker, report card printing software, school fees payment portal, private school website, secondary school portal lagos.";
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
