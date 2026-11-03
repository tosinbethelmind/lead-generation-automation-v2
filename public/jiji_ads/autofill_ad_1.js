// Autofill Script for Jiji Ad #1: Tokunbo Car VIN Check & Customs Duty Rep...
// Run this directly in the Developer Tools Console on https://jiji.ng/post-ad

(function() {
  console.log("%c[Bethelmind Autofill] Deploying Ad #1: Tokunbo Car VIN Check & Customs Duty Report • US Auction Photos in 10 Mins", "color: #10b981; font-weight: bold; font-size: 14px;");

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
    setReactInputValue(titleInput, "Tokunbo Car VIN Check & Customs Duty Report • US Auction Photos in 10 Mins");
    console.log("✔ Set Title:", "Tokunbo Car VIN Check & Customs Duty Report • US Auction Photos in 10 Mins");
  } else {
    console.warn("⚠ Title input not detected. Please click the Title field.");
  }

  // 2. Fill Price
  const priceInput = document.querySelector('input[name="price"]') || 
                     document.querySelector('input[placeholder*="Price" i]');
  if (priceInput) {
    setReactInputValue(priceInput, "12500");
    console.log("✔ Set Price:", "12500");
  }

  // 3. Fill Description
  const descInput = document.querySelector('textarea[name="description"]') || 
                    document.querySelector('textarea[placeholder*="Description" i]') || 
                    document.querySelector('div[contenteditable="true"]');
  if (descInput) {
    if (descInput.tagName === 'TEXTAREA') {
      setReactInputValue(descInput, "Buying a Tokunbo car in Lagos, Abuja, or Berger? NEVER transfer money to any car dealer until you run a verified chassis number (VIN) audit!\n\nOver 48% of Tokunbo cars imported into Nigeria were bought from US Copart and IAAI salvage auctions with severe flood damage, saltwater immersion, deployed airbags, or rolled-back mileage.\n\nWHAT IS INCLUDED IN YOUR 10-MINUTE VERIFICATION BUNDLE:\n1. Original US Copart & IAAI Salvage Crash Photos (See the exact car before it was panel-beaten) [Value: ₦15,000]\n2. Genuine Odometer Mileage & Illegal Rollback Audit [Value: ₦10,000]\n3. Hurricane Flood, Saltwater Immersion & Structural Frame Damage Check [Value: ₦10,000]\n4. Nigeria Customs Service (NCS) Import Duty & C-Number Paper Verification [Value: ₦15,000]\n5. Fair Nigerian Market Price Valuation so you don't overpay the dealer [Value: ₦10,000]\n6. FREE BONUS: Top 10 Red Flags Car Dealers Hide Inspection Checklist [Value: ₦5,000]\n\nTOTAL VALUE: ₦65,000\nPRICING OPTIONS:\n👉 Single Car Audit: Only ₦12,500 all-inclusive!\n👉 Car Dealer 3-Car Bundle: ₦25,000 (Save ₦12,500 on 3 inspections)\n\n100% ACCURACY GUARANTEE: Full PDF report + auction photos delivered directly to your WhatsApp in 10 minutes or 100% money back!\n\n⚡ CALL OR WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp with the 17-digit VIN now!\n\nSEARCH TAGS: carfax nigeria, vin checker lagos, tokunbo car inspection, customs duty paper check, copart salvage auction photos, autocheck report, berger car inspection, buy tokunbo car abuja.");
    } else {
      descInput.innerText = "Buying a Tokunbo car in Lagos, Abuja, or Berger? NEVER transfer money to any car dealer until you run a verified chassis number (VIN) audit!\n\nOver 48% of Tokunbo cars imported into Nigeria were bought from US Copart and IAAI salvage auctions with severe flood damage, saltwater immersion, deployed airbags, or rolled-back mileage.\n\nWHAT IS INCLUDED IN YOUR 10-MINUTE VERIFICATION BUNDLE:\n1. Original US Copart & IAAI Salvage Crash Photos (See the exact car before it was panel-beaten) [Value: ₦15,000]\n2. Genuine Odometer Mileage & Illegal Rollback Audit [Value: ₦10,000]\n3. Hurricane Flood, Saltwater Immersion & Structural Frame Damage Check [Value: ₦10,000]\n4. Nigeria Customs Service (NCS) Import Duty & C-Number Paper Verification [Value: ₦15,000]\n5. Fair Nigerian Market Price Valuation so you don't overpay the dealer [Value: ₦10,000]\n6. FREE BONUS: Top 10 Red Flags Car Dealers Hide Inspection Checklist [Value: ₦5,000]\n\nTOTAL VALUE: ₦65,000\nPRICING OPTIONS:\n👉 Single Car Audit: Only ₦12,500 all-inclusive!\n👉 Car Dealer 3-Car Bundle: ₦25,000 (Save ₦12,500 on 3 inspections)\n\n100% ACCURACY GUARANTEE: Full PDF report + auction photos delivered directly to your WhatsApp in 10 minutes or 100% money back!\n\n⚡ CALL OR WHATSAPP: 0802 279 1227\nBethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)\nTap \"Start Chat\" on Jiji or message us on WhatsApp with the 17-digit VIN now!\n\nSEARCH TAGS: carfax nigeria, vin checker lagos, tokunbo car inspection, customs duty paper check, copart salvage auction photos, autocheck report, berger car inspection, buy tokunbo car abuja.";
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
