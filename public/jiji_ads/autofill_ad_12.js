// Autofill Script for Jiji Ad #12: Shortlet Direct Booking Website & Cautio...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #12: Shortlet Direct Booking Website & Caution Deposit Lock • Stop 20% Airbnb Fees", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Shortlet Direct Booking Website & Caution Deposit Lock • Stop 20% Airbnb Fees");
    console.log("✔ Set Title:", "Shortlet Direct Booking Website & Caution Deposit Lock • Stop 20% Airbnb Fees");
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
      setReactInputValue(descInput, "Stop paying 15% to 20% Airbnb and Booking.com commissions on your shortlet apartments!\n\nWe build direct guest booking portals with automated caution deposit locks for Nigerian shortlet hosts and serviced apartment managers.\n\nTHE \"SHORTLET PROFIT MAXIMIZER\" BUNDLE:\n1. Direct Mobile Guest Booking Portal with Date & Night Sizer [Value: ₦85,000]\n2. Automated Caution Deposit Hold with Automated Refund Release upon check-out [Value: ₦50,000]\n3. Fair-Usage DisCo Electricity Token Calculator (Auto-deducts excess AC power usage) [Value: ₦45,000]\n4. Guest Digital ID & NIN / Driver's License KYC Verification [Value: ₦35,000]\n5. Automated Check-in Instructions & Smart Door Lock Passcode Messenger [Value: ₦30,000]\n6. FREE BONUS: Instant Moniepoint & Paystack Payment Settlement to your bank [Value: ₦25,000]\n\nTOTAL VALUE: ₦270,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nKeep 100% of your rental profits and build your own loyal direct guest database.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test our live shortlet portal today!\n\nSEARCH TAGS: shortlet apartment lekki, airbnb management lagos, serviced apartments ikoyi, shortlet booking website, caution fee management, luxury shortlet vi, holiday apartments abuja.");
    } else {
      descInput.innerText = "Stop paying 15% to 20% Airbnb and Booking.com commissions on your shortlet apartments!\n\nWe build direct guest booking portals with automated caution deposit locks for Nigerian shortlet hosts and serviced apartment managers.\n\nTHE \"SHORTLET PROFIT MAXIMIZER\" BUNDLE:\n1. Direct Mobile Guest Booking Portal with Date & Night Sizer [Value: ₦85,000]\n2. Automated Caution Deposit Hold with Automated Refund Release upon check-out [Value: ₦50,000]\n3. Fair-Usage DisCo Electricity Token Calculator (Auto-deducts excess AC power usage) [Value: ₦45,000]\n4. Guest Digital ID & NIN / Driver's License KYC Verification [Value: ₦35,000]\n5. Automated Check-in Instructions & Smart Door Lock Passcode Messenger [Value: ₦30,000]\n6. FREE BONUS: Instant Moniepoint & Paystack Payment Settlement to your bank [Value: ₦25,000]\n\nTOTAL VALUE: ₦270,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nKeep 100% of your rental profits and build your own loyal direct guest database.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test our live shortlet portal today!\n\nSEARCH TAGS: shortlet apartment lekki, airbnb management lagos, serviced apartments ikoyi, shortlet booking website, caution fee management, luxury shortlet vi, holiday apartments abuja.";
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
