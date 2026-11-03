// Autofill Script for Jiji Ad #13: Hidden GPS Car Tracker & Fleet System • ...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #13: Hidden GPS Car Tracker & Fleet System • Phone Remote Engine Cut & Fuel Siphon Alert", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Hidden GPS Car Tracker & Fleet System • Phone Remote Engine Cut & Fuel Siphon Alert");
    console.log("✔ Set Title:", "Hidden GPS Car Tracker & Fleet System • Phone Remote Engine Cut & Fuel Siphon Alert");
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "55000");
    console.log("✔ Set Price:", "55000");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, "Protect your car, truck, or commercial bus from vehicle theft and driver fuel fraud!\n\nOur hidden GPS tracking systems give you 24/7 live control of your vehicle right from your smartphone anywhere in Nigeria.\n\nTHE \"ULTIMATE VEHICLE SECURITY\" BUNDLE:\n1. 24/7 Real-Time Live Vehicle Location Tracking via Mobile App (Android & iPhone) [Value: ₦60,000]\n2. Remote Engine Cut-Off (Kill vehicle engine from your phone anywhere in Nigeria) [Value: ₦35,000]\n3. Geo-Fencing (Instant WhatsApp alert if vehicle leaves designated route/city) [Value: ₦25,000]\n4. Fuel Consumption vs Mileage Audit (Flags diesel siphoning and fake driver receipts) [Value: ₦35,000]\n5. In-Cabin Voice Monitoring Microphone (Listen to in-car conversations clearly) [Value: ₦25,000]\n6. 90-Day Trip History & Mileage Playback [Value: ₦20,000]\n7. FREE BONUS: Professional Clean Installation with Zero Wire-Cutting [Value: ₦15,000]\n\nTOTAL VALUE: ₦215,000\nSPECIAL ALL-INCLUSIVE PRICE TODAY: ONLY ₦55,000 (HARDWARE + INSTALLATION + 1 YEAR APP ACCESS)!\n\nSame-day installation across Lagos and Abuja. 100% anti-theft guarantee.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp with your car model to book installation today!\n\nSEARCH TAGS: car tracker lagos, hidden gps tracker nigeria, vehicle tracking installation, remote engine cut tracker, fuel monitoring device, fleet tracker abuja, anti car theft device.");
    } else {
      descInput.innerText = "Protect your car, truck, or commercial bus from vehicle theft and driver fuel fraud!\n\nOur hidden GPS tracking systems give you 24/7 live control of your vehicle right from your smartphone anywhere in Nigeria.\n\nTHE \"ULTIMATE VEHICLE SECURITY\" BUNDLE:\n1. 24/7 Real-Time Live Vehicle Location Tracking via Mobile App (Android & iPhone) [Value: ₦60,000]\n2. Remote Engine Cut-Off (Kill vehicle engine from your phone anywhere in Nigeria) [Value: ₦35,000]\n3. Geo-Fencing (Instant WhatsApp alert if vehicle leaves designated route/city) [Value: ₦25,000]\n4. Fuel Consumption vs Mileage Audit (Flags diesel siphoning and fake driver receipts) [Value: ₦35,000]\n5. In-Cabin Voice Monitoring Microphone (Listen to in-car conversations clearly) [Value: ₦25,000]\n6. 90-Day Trip History & Mileage Playback [Value: ₦20,000]\n7. FREE BONUS: Professional Clean Installation with Zero Wire-Cutting [Value: ₦15,000]\n\nTOTAL VALUE: ₦215,000\nSPECIAL ALL-INCLUSIVE PRICE TODAY: ONLY ₦55,000 (HARDWARE + INSTALLATION + 1 YEAR APP ACCESS)!\n\nSame-day installation across Lagos and Abuja. 100% anti-theft guarantee.\n\n⚡ CALL / WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp with your car model to book installation today!\n\nSEARCH TAGS: car tracker lagos, hidden gps tracker nigeria, vehicle tracking installation, remote engine cut tracker, fuel monitoring device, fleet tracker abuja, anti car theft device.";
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
