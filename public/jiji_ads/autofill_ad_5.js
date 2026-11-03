// Autofill Script for Jiji Ad #5: Salon & Spa Appointment Booking App with...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #5: Salon & Spa Appointment Booking App with Deposit Lock • Stop Client No-Shows", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Salon & Spa Appointment Booking App with Deposit Lock • Stop Client No-Shows");
    console.log("✔ Set Title:", "Salon & Spa Appointment Booking App with Deposit Lock • Stop Client No-Shows");
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
      setReactInputValue(descInput, "Eliminate empty salon chairs and missed appointments with automated 24/7 booking!\n\nWhen clients book appointments and fail to show up, you lose valuable hours and turn away paying walk-in customers.\n\nWe build online appointment scheduling systems for hair salons, aesthetic clinics, spas, and makeup artists that lock client time slots with upfront bank deposits.\n\nTHE \"SALON REVENUE LOCK\" BUNDLE:\n1. 24/7 Automated Mobile Booking Calendar connected to WhatsApp [Value: ₦75,000]\n2. Mandatory 25%–50% Upfront Reservation Deposit Lock via Moniepoint [Value: ₦45,000]\n3. Automated SMS & WhatsApp Appointment Reminders (Cuts no-shows by 90%) [Value: ₦30,000]\n4. Stylist / Doctor Commission Split & Daily Revenue Tracking [Value: ₦35,000]\n5. Customer Treatment History & Birthday Promo Messenger [Value: ₦25,000]\n6. FREE BONUS: Fast 24-Hour Turnkey Deployment Guarantee [Value: ₦20,000]\n\nTOTAL VALUE: ₦230,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nGuarantee your booking revenue upfront before you touch a single client.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the live booking engine free!\n\nSEARCH TAGS: beauty salon website, spa booking app, barbershop software, dental clinic appointment system, makeup artist website, lash technician booking, salon management software lagos.");
    } else {
      descInput.innerText = "Eliminate empty salon chairs and missed appointments with automated 24/7 booking!\n\nWhen clients book appointments and fail to show up, you lose valuable hours and turn away paying walk-in customers.\n\nWe build online appointment scheduling systems for hair salons, aesthetic clinics, spas, and makeup artists that lock client time slots with upfront bank deposits.\n\nTHE \"SALON REVENUE LOCK\" BUNDLE:\n1. 24/7 Automated Mobile Booking Calendar connected to WhatsApp [Value: ₦75,000]\n2. Mandatory 25%–50% Upfront Reservation Deposit Lock via Moniepoint [Value: ₦45,000]\n3. Automated SMS & WhatsApp Appointment Reminders (Cuts no-shows by 90%) [Value: ₦30,000]\n4. Stylist / Doctor Commission Split & Daily Revenue Tracking [Value: ₦35,000]\n5. Customer Treatment History & Birthday Promo Messenger [Value: ₦25,000]\n6. FREE BONUS: Fast 24-Hour Turnkey Deployment Guarantee [Value: ₦20,000]\n\nTOTAL VALUE: ₦230,000\nPRICING & ACTIVATION PLANS:\n👉 PLAN A (Monthly Flex): ₦35,000 Setup + ₦7,000/month maintenance\n👉 PLAN B (Annual Smart-Saver — Best Value): ₦80,000 All-Inclusive (1 FULL YEAR FREE — Save ₦39,000!)\n\nGuarantee your booking revenue upfront before you touch a single client.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp to test the live booking engine free!\n\nSEARCH TAGS: beauty salon website, spa booking app, barbershop software, dental clinic appointment system, makeup artist website, lash technician booking, salon management software lagos.";
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
