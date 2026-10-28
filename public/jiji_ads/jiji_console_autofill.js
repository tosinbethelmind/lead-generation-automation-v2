/**
 * Jiji 1-Click Auto-Post Assistant (Bethelmind Digital Solutions)
 * Run this script in the Chrome/Comet Browser Console on https://jiji.ng
 */

(function() {
  // Remove existing assistant if already injected
  const old = document.getElementById('bm-jiji-assistant');
  if (old) old.remove();

  const ADS = [
    {
      id: 1,
      title: "Tokunbo Car VIN Chassis Number Verification & Customs Duty Check",
      price: 3500,
      priceStr: "₦3,500",
      categoryHint: "Services > Automotive Services > Vehicle Inspection",
      img: "ad_1_vin_checker.png",
      desc: `Planning to buy a Tokunbo car in Lagos or Nigeria? Never pay a car dealer until you run a verified chassis number (VIN) audit!

Over 45% of Tokunbo cars imported into Nigeria were bought from US salvage auctions with severe flood damage, deployed airbags, or rolled-back mileage.

WHAT WE PROVIDE IN 10 MINUTES:
- US Copart & IAAI salvage auction photos before repairs
- Genuine odometer mileage & rollback alerts
- Hurricane flood & saltwater damage history
- Nigeria Customs Service (NCS) import duty assessment
- Fair Lagos market valuation so you do not overpay

Save yourself from buying a vehicle that will live at the mechanic workshop. Fast and 100% verified.

Tap "Start Chat" on Jiji to verify your car immediately!`
    },
    {
      id: 2,
      title: "Professional Business Website + 24/7 AI WhatsApp Sales Assistant",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Web Design & Development",
      img: "ad_2_website_ai_closer.png",
      desc: `Stop losing paying customers when they search for your business on Google.

We build modern, fast-loading mobile websites equipped with 24/7 AI WhatsApp sales assistants that reply to inquiries, present product catalogs, and book appointments in under 3 seconds.

WHAT IS INCLUDED:
- Official mobile website optimized for Android & iPhone
- 24/7 WhatsApp AI sales assistant configured with your prices
- OPay & Moniepoint automated bank transfer verification
- Google Search & Google Maps local SEO registration
- Fast 48-Hour delivery guarantee

No coding required. Test your live website prototype free on your phone before paying. Send a message on Jiji to get started today.`
    },
    {
      id: 3,
      title: "Solar System Load Calculator & Instant WhatsApp BOQ Generator",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Computer & IT Services > Software Development",
      img: "ad_3_solar_boq_sizer.png",
      desc: `Avoid DisCo Band A tariffs and high generator diesel bills with precision solar sizing.

We provide computerized solar load audit calculators and automated WhatsApp Bill of Quantities (BOQ) engines for Nigerian solar installers and property owners.

WHAT IS INCLUDED:
- Accurate appliance kVA load audit & 51.2V LiFePO4 battery sizing
- Tier-1 monocrystalline panel wattage & inverter specification
- DisCo Band A vs generator diesel ROI payback calculation
- Instant customer quotation generator sent to WhatsApp
- Bankable PDF engineering proposal sheets

Stop guessing inverter capacities and losing money on undersized systems. Send a message on Jiji for your free solar sizing consultation today.`
    },
    {
      id: 4,
      title: "Automated Bank Transfer Verification & Anti-Fake Alert Shield",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Computer & IT Services > Software",
      img: "ad_4_fake_alert_shield.png",
      desc: `Stop falling victim to fake bank transfer alerts and altered payment screenshots.

We set up automated instant bank transfer verification engines for Nigerian retailers, boutiques, supermarkets, and clinics.

WHAT IS INCLUDED:
- Real-time Moniepoint & Paystack NIP bank webhook settlement
- Instant cryptographic payment passes issued to customer phones
- Zero fake transfer slip losses for cashiers and sales attendants
- Multi-branch cashier ledger tracking
- Instant WhatsApp payment receipts for buyers

Eliminate cashier reconciliation disputes and protect your daily business revenue 100%. Send a message on Jiji to set up your store transfer shield today.`
    },
    {
      id: 5,
      title: "24/7 Salon & Clinic Appointment Booking with Deposit Lock",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Health & Beauty Services",
      img: "ad_5_salon_deposit_booking.png",
      desc: `Eliminate empty salon chairs and missed appointments with automated 24/7 booking.

We build online appointment scheduling systems for hair salons, aesthetic clinics, spas, and makeup artists that lock client time slots with upfront bank deposits.

WHAT IS INCLUDED:
- 24/7 automated booking calendar connected to WhatsApp
- Mandatory 25% to 50% reservation deposit lock via Moniepoint
- Stylist commission split & daily revenue tracking
- Automated appointment reminder notifications to reduce no-shows
- Fast 48-Hour turnkey setup

Protect your valuable business hours and guarantee booking revenue upfront. Send a message on Jiji to test our live booking engine free.`
    },
    {
      id: 6,
      title: "Private School Term Fee Payment Portal & Result PIN Gateway",
      price: 50000,
      priceStr: "₦50,000",
      categoryHint: "Services > Computer & IT Services > Software",
      img: "ad_6_school_fee_portal.png",
      desc: `Stop tracking school fee defaulters manually on messy exercise books and spreadsheets.

We provide secure online school fee payment portals for private primary and secondary schools in Nigeria.

WHAT IS INCLUDED:
- Automated result gating (digital report cards locked until fees clear)
- Scratch-card & electronic Result Checker PIN generation
- Instant Moniepoint & Paystack term fee bank transfer reconciliation
- Termly broadsheet exam scoring and report card generation
- Automated WhatsApp fee balance reminders sent to parents

Recover school fees on schedule and modernize your school administration. Send a message on Jiji for a live demo for your school today.`
    },
    {
      id: 7,
      title: "Estate Rent Escrow & Facility Service Charge Manager Portal",
      price: 50000,
      priceStr: "₦50,000",
      categoryHint: "Services > Real Estate Services",
      img: "ad_7_tenant_rent_portal.png",
      desc: `Manage residential estate service charges and tenant rent collections with zero stress.

We provide cloud-based estate facility portals for landlords, estate managers, and facility management firms across Nigeria.

WHAT IS INCLUDED:
- Automated tenant rent renewal reminders via SMS & WhatsApp
- Itemized facility service charge billing (generator diesel, waste, security)
- Instant digital rent payment receipts and transaction records
- Landlord disbursement ledgers and expense tracking
- Transparent tenant maintenance ticket dashboard

Eliminate rent disputes and keep your property accounts 100% reconciled. Send a message on Jiji for your free property management demo.`
    },
    {
      id: 8,
      title: "Interstate Dispatch Aggregator & Real-Time Waybill Tracker",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Chauffeur & Logistics Services",
      img: "ad_8_dispatch_waybill_tracker.png",
      desc: `Stop answering repeated "Where is my parcel?" phone calls from customers.

We build automated dispatch and freight logistics engines for Nigerian courier businesses, haulage contractors, and interstate delivery hubs.

WHAT IS INCLUDED:
- Automated SMS and WhatsApp tracking links dispatched upon package intake
- Real-time milestone status updates (Loaded, In Transit, Arrived Hub, Delivered)
- Digital proof-of-delivery signature & recipient photo verification
- Highway driver diesel trip mileage auditor (flags fuel siphoning)
- GIG, Gokada & local dispatch cost comparison calculator

Build trust and cut dispatch management costs in half. Send a message on Jiji to test the waybill tracker now.`
    },
    {
      id: 9,
      title: "Multi-Location Retail Inventory & Stock Theft Prevention App",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Computer & IT Services > Software",
      img: "ad_9_stock_theft_ledger.png",
      desc: `Prevent store shrinkage, employee inventory theft, and stock shortages across your branches.

We deploy real-time cloud inventory ledgers for Nigerian boutiques, supermarkets, gadget shops, and retail chains.

WHAT IS INCLUDED:
- Multi-branch real-time stock tracking on mobile and tablet
- Instant WhatsApp alerts for low inventory and unauthorized stock adjustments
- Barcode scanning & cashier shift reconciliation
- Supplier purchase order & wholesale re-order quantity calculator
- Profit margin audit per product variant

Know your exact stock levels and daily gross profit from your phone anywhere in the world. Send a message on Jiji for a live store demo.`
    },
    {
      id: 10,
      title: "Building Material Estimator & BOQ Cost Calculator for Sites",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Building & Construction > Building Services",
      img: "ad_10_construction_estimator.png",
      desc: `Eliminate material waste and over-budgeting on your building projects.

We provide instant computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.

WHAT IS INCLUDED:
- Accurate cement bags, sand tonnage, and granite mix calculator
- Floor tile square-meter, grout, and adhesive packaging sizer
- Emulsion & gloss paint bucket coverage calculator
- POP ceiling sheets, drywall screws, and perimeter track sizer
- Itemized site material Bill of Quantities (BOQ) with current market prices

Protect your construction budget from contractor inflation. Send a message on Jiji to get your construction estimate now.`
    },
    {
      id: 11,
      title: "CAC Business Name & Company Registration Fast Filing Service",
      price: 30000,
      priceStr: "₦30,000",
      categoryHint: "Services > Legal Services > Corporate Law",
      img: "ad_11_cac_registration.png",
      desc: `Register your business name or Private Limited Company (LTD) with the Corporate Affairs Commission (CAC) without delay or agent overcharging.

WHAT IS INCLUDED:
- Official CAC Name Availability Search & Approval
- Tax Identification Number (TIN) for corporate banking
- Official Digital CAC Certificate with QR Verification
- Status Report & Certified Memorandum of Association
- Corporate Bank Account opening facilitation

Operate legally and win corporate contracts. Fast 3 to 7 working days delivery. Tap "Start Chat" on Jiji to begin your registration.`
    },
    {
      id: 12,
      title: "Shortlet Apartment Direct Booking Engine & Caution Fee Escrow",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Real Estate Services",
      img: "ad_12_shortlet_booking_escrow.png",
      desc: `Stop paying 15% to 20% Airbnb and Booking.com commissions on your shortlet apartments.

We build direct guest booking portals with automated caution deposit locks for Nigerian shortlet hosts and apartment managers.

WHAT IS INCLUDED:
- Direct mobile booking portal with date & night calculator
- Mandatory caution deposit hold with automated refund release
- Guest digital ID / driver license KYC verification
- DisCo prepaid electricity token & keycard access dispatch
- Instant Moniepoint & Paystack bank payment settlements

Keep 100% of your rental profits. Send a message on Jiji to test our live shortlet portal today.`
    },
    {
      id: 13,
      title: "GPS Fleet Vehicle Tracker & Diesel Theft Mileage Audit System",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Automotive Services > Tracking Services",
      img: "ad_13_gps_fuel_mileage_tracker.png",
      desc: `Stop drivers from siphoning diesel, making unauthorized night trips, and falsifying interstate fuel receipts.

We deploy computerized vehicle GPS tracking ledgers and fuel consumption audit systems for Nigerian transport, haulage, and delivery operators.

WHAT IS INCLUDED:
- Real-time GPS vehicle tracking with remote engine cut-off
- Fuel tank level vs highway mileage consumption audit
- Instant driver harsh braking and over-speeding alerts
- Geo-fencing & unauthorized route deviation notifications
- Daily trip mileage & maintenance logbook export

Protect your haulage trucks and company vehicles 24/7. Send a message on Jiji for a live system demonstration.`
    },
    {
      id: 14,
      title: "Starlink Satellite Internet Installation & High-Speed Estate Mesh",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Computer & IT Services > Networking",
      img: "ad_14_starlink_installation.png",
      desc: `Eliminate slow GSM mobile internet and frequent fiber optic cable cuts in your home or estate.

We engineer professional Starlink satellite internet setups and whole-building mesh WiFi installations for homes, estates, schools, and remote sites across Nigeria.

WHAT IS INCLUDED:
- Roof dish bracket mounting with zero line-of-sight obstruction
- Dual-WAN seamless failover router (Starlink + 4G backup)
- Gigabit whole-property mesh WiFi 6 coverage with zero dead zones
- Pure sine wave inverter & surge protector integration
- Multi-unit tenant WiFi voucher & bandwidth limiter configuration

Enjoy unlimited 150-250 Mbps internet anywhere in Nigeria. Send a message on Jiji to schedule your installation.`
    },
    {
      id: 15,
      title: "Deep Cleaning & Post-Construction Industrial Fumigation Service",
      price: 35000,
      priceStr: "₦35,000",
      categoryHint: "Services > Cleaning Services > Deep Cleaning",
      img: "ad_15_cleaning_fumigation.png",
      desc: `Move into a spotless, sanitized, and pest-free property without stress or lingering chemical odors.

We provide professional post-construction cleaning and NAFDAC-approved fumigation services for residential duplexes, corporate offices, and commercial sites.

WHAT IS INCLUDED:
- Post-construction paint splatter, cement haze & tile scrubbing
- Heavy-duty floor polishing and window frame restoration
- NAFDAC-approved pest extermination (termites, bedbugs, rodents)
- Hospital-grade microbial disinfection fogging
- Same-day deodorization and move-in inspection certificate

Guaranteed 100% spotless finish. Send a message on Jiji for your free property square-meter estimate today.`
    }
  ];

  let currentAdIndex = 0; // Default to Ad 1

  function setNativeValue(element, value) {
    if (!element) return;
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // Inject Floating Assistant Overlay
  const panel = document.createElement('div');
  panel.id = 'bm-jiji-assistant';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    max-width: 90vw;
    background: #0b121e;
    border: 2px solid #d4af37;
    border-radius: 16px;
    padding: 18px 20px;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    z-index: 99999999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.85);
    line-height: 1.45;
  `;

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:8px;">
      <div style="font-weight:800; font-size:14px; color:#d4af37; display:flex; align-items:center; gap:6px;">
        <span>⚡</span> Jiji 1-Click Post Assistant
      </div>
      <button id="bm-close-btn" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer; padding:2px 6px;">✕</button>
    </div>

    <div style="margin-bottom:12px;">
      <label style="display:block; font-size:11px; text-transform:uppercase; color:#94a3b8; font-weight:700; margin-bottom:4px;">Select Ad to Post:</label>
      <select id="bm-ad-select" style="width:100%; background:#1e293b; color:#fff; border:1px solid #334155; border-radius:8px; padding:7px 10px; font-size:12px; font-weight:600; cursor:pointer;">
        ${ADS.map((a, i) => `<option value="${i}">#${a.id}. ${a.title.slice(0, 38)}... (${a.priceStr})</option>`).join('')}
      </select>
    </div>

    <div style="background:#020617; border:1px solid #1e293b; border-radius:10px; padding:10px 12px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:#94a3b8;">1. Title:</span>
        <span id="bm-st-title" style="font-weight:700; color:#eab308;">Checking...</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:#94a3b8;">2. Category:</span>
        <span id="bm-st-cat" style="font-weight:700; color:#eab308;">Click Category</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:#94a3b8;">3. Location:</span>
        <span id="bm-st-loc" style="font-weight:700; color:#eab308;">Click Location</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:#94a3b8;">4. Description:</span>
        <span id="bm-st-desc" style="font-weight:700; color:#eab308;">Waiting for Step 2</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:#94a3b8;">5. Price:</span>
        <span id="bm-st-price" style="font-weight:700; color:#eab308;">Waiting for Step 2</span>
      </div>
    </div>

    <div style="background:rgba(212,175,55,0.08); border:1px dashed #d4af37; border-radius:10px; padding:10px 12px; margin-bottom:12px; font-size:12px;">
      <div style="font-weight:700; color:#d4af37; margin-bottom:4px;">📁 Photo to Attach:</div>
      <div id="bm-photo-name" style="color:#fff; font-family:monospace; font-size:11px; word-break:break-all;">ad_1_vin_checker.png</div>
      <div style="color:#94a3b8; font-size:10.5px; margin-top:2px;">Location: <code>Desktop &gt; JIJI_ADS_PICTURES</code></div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;">
      <button id="bm-btn-fill" style="background:#d4af37; color:#0b121e; border:none; border-radius:8px; padding:8px 10px; font-weight:800; font-size:12px; cursor:pointer;">⚡ Auto-Fill Now</button>
      <button id="bm-btn-copy-desc" style="background:#1e293b; color:#fff; border:1px solid #334155; border-radius:8px; padding:8px 10px; font-weight:700; font-size:12px; cursor:pointer;">📋 Copy Desc</button>
    </div>

    <div id="bm-status-msg" style="text-align:center; font-size:11px; color:#38bdf8; font-weight:600; min-height:16px;">
      Watching form... Please select Category &amp; Location
    </div>
  `;

  document.body.appendChild(panel);

  const adSelect = document.getElementById('bm-ad-select');
  const closeBtn = document.getElementById('bm-close-btn');
  const fillBtn = document.getElementById('bm-btn-fill');
  const copyDescBtn = document.getElementById('bm-btn-copy-desc');
  const statusMsg = document.getElementById('bm-status-msg');
  const photoNameEl = document.getElementById('bm-photo-name');

  const stTitle = document.getElementById('bm-st-title');
  const stCat = document.getElementById('bm-st-cat');
  const stLoc = document.getElementById('bm-st-loc');
  const stDesc = document.getElementById('bm-st-desc');
  const stPrice = document.getElementById('bm-st-price');

  closeBtn.onclick = () => panel.remove();

  adSelect.onchange = (e) => {
    currentAdIndex = parseInt(e.target.value, 10);
    photoNameEl.innerText = ADS[currentAdIndex].img;
    statusMsg.innerText = `Switched to Ad #${ADS[currentAdIndex].id}`;
    autoFillCurrentAd();
  };

  copyDescBtn.onclick = () => {
    const text = ADS[currentAdIndex].desc;
    navigator.clipboard.writeText(text).then(() => {
      copyDescBtn.innerText = '✓ Copied!';
      setTimeout(() => { copyDescBtn.innerText = '📋 Copy Desc'; }, 1800);
    }).catch(() => {
      // Fallback prompt
      window.prompt('Copy description manually (Ctrl+C):', text);
    });
  };

  fillBtn.onclick = () => {
    autoFillCurrentAd();
  };

  function autoFillCurrentAd() {
    const ad = ADS[currentAdIndex];

    // 1. Title Input
    const titleInput = document.querySelector('input[placeholder*="Title" i], input[name*="title" i], input[aria-label*="Title" i]');
    if (titleInput) {
      if (titleInput.value !== ad.title) {
        setNativeValue(titleInput, ad.title);
      }
      stTitle.innerText = '✓ Filled';
      stTitle.style.color = '#10b981';
    } else {
      stTitle.innerText = 'Missing';
      stTitle.style.color = '#ef4444';
    }

    // 2. Check Category
    const catTextEl = document.querySelector('.b-post-ad-category, [data-qa*="category"], div[class*="category"]');
    // Look for text in category selector
    const catContainer = document.querySelectorAll('div, button');
    let hasCategory = false;
    for (const el of catContainer) {
      if (el.innerText && (el.innerText.includes('Services') || el.innerText.includes('Automotive') || el.innerText.includes('Repair'))) {
        hasCategory = true;
        break;
      }
    }
    if (hasCategory) {
      stCat.innerText = '✓ Selected';
      stCat.style.color = '#10b981';
    } else {
      stCat.innerText = '👉 Click Category';
      stCat.style.color = '#f59e0b';
    }

    // 3. Check Location
    let hasLocation = false;
    for (const el of catContainer) {
      if (el.innerText && (el.innerText.includes('Lagos') || el.innerText.includes('Ikeja') || el.innerText.includes('Abuja'))) {
        hasLocation = true;
        break;
      }
    }
    if (hasLocation) {
      stLoc.innerText = '✓ Selected';
      stLoc.style.color = '#10b981';
    } else {
      stLoc.innerText = '👉 Click Location';
      stLoc.style.color = '#f59e0b';
    }

    // 4. Description Textarea
    const descTextarea = document.querySelector('textarea, div[contenteditable="true"]');
    if (descTextarea) {
      if (descTextarea.tagName.toLowerCase() === 'textarea') {
        if (!descTextarea.value || descTextarea.value.length < 20) {
          setNativeValue(descTextarea, ad.desc);
        }
      } else {
        if (!descTextarea.innerText || descTextarea.innerText.length < 20) {
          descTextarea.innerText = ad.desc;
          descTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      stDesc.innerText = '✓ Filled';
      stDesc.style.color = '#10b981';
    } else {
      stDesc.innerText = 'Select Category First';
      stDesc.style.color = '#94a3b8';
    }

    // 5. Price Input
    const priceInput = document.querySelector('input[placeholder*="Price" i], input[name*="price" i], input[aria-label*="Price" i], input[type="number"]');
    if (priceInput && ad.price) {
      if (!priceInput.value || priceInput.value === '0') {
        setNativeValue(priceInput, String(ad.price));
      }
      stPrice.innerText = `✓ ₦${ad.price.toLocaleString()}`;
      stPrice.style.color = '#10b981';
    } else {
      stPrice.innerText = descTextarea ? 'Check Price' : 'Select Category First';
      stPrice.style.color = '#94a3b8';
    }

    if (descTextarea && priceInput && titleInput) {
      statusMsg.innerText = `🎉 Form Populated! Add Photo (${ad.img}) and click Post!`;
      statusMsg.style.color = '#10b981';
    }
  }

  // Continuous monitoring loop (every 500ms)
  const monitorTimer = setInterval(() => {
    if (!document.getElementById('bm-jiji-assistant')) {
      clearInterval(monitorTimer);
      return;
    }
    autoFillCurrentAd();
  }, 600);

  // Initial fill attempt
  autoFillCurrentAd();

  console.log('✅ Bethelmind Jiji Auto-Post Assistant active on screen!');
})();
