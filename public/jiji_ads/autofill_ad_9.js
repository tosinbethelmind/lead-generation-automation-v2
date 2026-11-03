// Autofill Script for Jiji Ad #9: Multi-Store Retail Inventory & Water Fac...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #9: Multi-Store Retail Inventory & Water Factory Route Reconciliation App • Stop Theft", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Multi-Store Retail Inventory & Water Factory Route Reconciliation App • Stop Theft");
    console.log("✔ Set Title:", "Multi-Store Retail Inventory & Water Factory Route Reconciliation App • Stop Theft");
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
      setReactInputValue(descInput, "Running 2 or more retail shop branches or a Sachet/Bottle Water Factory? Stop losing millions to inventory theft, unrecorded stock shrinkage, and driver cash fraud!\n\nDishonest sales attendants and delivery drivers take advantage when you're not physically watching: selling goods off-the-books, claiming burst sachet bags, faking inter-branch transfers, and pocketing daily sales cash.\n\nTHE \"MULTI-STORE & FACTORY THEFT PREVENTION\" BUNDLE:\n1. Multi-Branch Real-Time Stock Sync across Shop 1, Shop 2, and Central Warehouse [Value: ₦120,000]\n2. Sachet & Bottle Water Route Reconciliation (Bags loaded vs Cash returned vs Verified Burst Allowance) [Value: ₦75,000]\n3. Inter-Branch Transfer Reconciliation with Dual-Signoff Digital Gate Pass [Value: ₦60,000]\n4. Staff Permission Gating (Attendants cannot edit prices, delete receipts, or clear sales) [Value: ₦45,000]\n5. Instant WhatsApp Theft Alerts sent to owner for suspicious manual stock deductions [Value: ₦40,000]\n6. End-of-Day Shift Cash vs POS Bank Credit Reconciliation in 60s [Value: ₦30,000]\n7. FREE BONUS: Barcode Scanner & Thermal Receipt Printer Setup Guide [Value: ₦20,000]\n\nTOTAL VALUE: ₦390,000\nPRICING & ACTIVATION PLANS:\n👉 Single Branch / Shop: ₦35,000 Setup + ₦7,000/mo (OR ₦80,000 Annual Pass — 1 Full Year Free)\n👉 Multi-Branch / Factory Master Suite: ₦65,000 Setup + ₦12,000/mo (OR ₦140,000 Annual Pass — 1 Full Year Free)\n\nKnow your exact stock levels and daily profit from your phone anywhere in the world.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nSend a message on Jiji or WhatsApp for a live interactive multi-store demo right now!\n\nSEARCH TAGS: inventory software lagos, supermarket pos software, pure water accounting software, stock keeping app, retail pos machine, sachet water factory manager, multi branch inventory.");
    } else {
      descInput.innerText = "Running 2 or more retail shop branches or a Sachet/Bottle Water Factory? Stop losing millions to inventory theft, unrecorded stock shrinkage, and driver cash fraud!\n\nDishonest sales attendants and delivery drivers take advantage when you're not physically watching: selling goods off-the-books, claiming burst sachet bags, faking inter-branch transfers, and pocketing daily sales cash.\n\nTHE \"MULTI-STORE & FACTORY THEFT PREVENTION\" BUNDLE:\n1. Multi-Branch Real-Time Stock Sync across Shop 1, Shop 2, and Central Warehouse [Value: ₦120,000]\n2. Sachet & Bottle Water Route Reconciliation (Bags loaded vs Cash returned vs Verified Burst Allowance) [Value: ₦75,000]\n3. Inter-Branch Transfer Reconciliation with Dual-Signoff Digital Gate Pass [Value: ₦60,000]\n4. Staff Permission Gating (Attendants cannot edit prices, delete receipts, or clear sales) [Value: ₦45,000]\n5. Instant WhatsApp Theft Alerts sent to owner for suspicious manual stock deductions [Value: ₦40,000]\n6. End-of-Day Shift Cash vs POS Bank Credit Reconciliation in 60s [Value: ₦30,000]\n7. FREE BONUS: Barcode Scanner & Thermal Receipt Printer Setup Guide [Value: ₦20,000]\n\nTOTAL VALUE: ₦390,000\nPRICING & ACTIVATION PLANS:\n👉 Single Branch / Shop: ₦35,000 Setup + ₦7,000/mo (OR ₦80,000 Annual Pass — 1 Full Year Free)\n👉 Multi-Branch / Factory Master Suite: ₦65,000 Setup + ₦12,000/mo (OR ₦140,000 Annual Pass — 1 Full Year Free)\n\nKnow your exact stock levels and daily profit from your phone anywhere in the world.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nSend a message on Jiji or WhatsApp for a live interactive multi-store demo right now!\n\nSEARCH TAGS: inventory software lagos, supermarket pos software, pure water accounting software, stock keeping app, retail pos machine, sachet water factory manager, multi branch inventory.";
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
