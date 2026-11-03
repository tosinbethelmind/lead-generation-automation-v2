// Autofill Script for Jiji Ad #8: Interstate Dispatch Waybill Tracker • Au...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #8: Interstate Dispatch Waybill Tracker • Automated SMS & Delivery Status System", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Interstate Dispatch Waybill Tracker • Automated SMS & Delivery Status System");
    console.log("✔ Set Title:", "Interstate Dispatch Waybill Tracker • Automated SMS & Delivery Status System");
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
      setReactInputValue(descInput, "Stop answering 50+ repeated \"Where is my package?\" phone calls every single day!\n\nWe deploy automated dispatch and waybill tracking engines for Nigerian courier businesses, haulage contractors, and interstate delivery hubs.\n\nTHE \"DISPATCH AUTOMATION\" BUNDLE:\n1. Automated SMS & WhatsApp Tracking Links sent to shippers upon package intake [Value: ₦80,000]\n2. Real-Time Milestone Status Updates (Intake, In Transit, Arrived Hub, Delivered) [Value: ₦50,000]\n3. Digital Proof-of-Delivery (POD) Signature & Recipient Photo Verification [Value: ₦45,000]\n4. Highway Driver Interstate Diesel Mileage Auditor (Flags fuel siphoning) [Value: ₦40,000]\n5. GIG, Gokada & Local Dispatch Cost Comparison Calculator [Value: ₦25,000]\n6. FREE BONUS: 36-State Interstate Park Delivery Fee Schedule Generator [Value: ₦25,000]\n\nTOTAL VALUE: ₦265,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nCut dispatch customer service calls by 85% and build massive trust with shippers.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test a live tracking link now!\n\nSEARCH TAGS: dispatch rider service lagos, waybill tracking software, courier logistics app, delivery rider app, haulage tracking, interstate parcel delivery, gig logistics tracker.");
    } else {
      descInput.innerText = "Stop answering 50+ repeated \"Where is my package?\" phone calls every single day!\n\nWe deploy automated dispatch and waybill tracking engines for Nigerian courier businesses, haulage contractors, and interstate delivery hubs.\n\nTHE \"DISPATCH AUTOMATION\" BUNDLE:\n1. Automated SMS & WhatsApp Tracking Links sent to shippers upon package intake [Value: ₦80,000]\n2. Real-Time Milestone Status Updates (Intake, In Transit, Arrived Hub, Delivered) [Value: ₦50,000]\n3. Digital Proof-of-Delivery (POD) Signature & Recipient Photo Verification [Value: ₦45,000]\n4. Highway Driver Interstate Diesel Mileage Auditor (Flags fuel siphoning) [Value: ₦40,000]\n5. GIG, Gokada & Local Dispatch Cost Comparison Calculator [Value: ₦25,000]\n6. FREE BONUS: 36-State Interstate Park Delivery Fee Schedule Generator [Value: ₦25,000]\n\nTOTAL VALUE: ₦265,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nCut dispatch customer service calls by 85% and build massive trust with shippers.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test a live tracking link now!\n\nSEARCH TAGS: dispatch rider service lagos, waybill tracking software, courier logistics app, delivery rider app, haulage tracking, interstate parcel delivery, gig logistics tracker.";
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
