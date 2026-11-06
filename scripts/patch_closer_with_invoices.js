const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'lib/closer_engine.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Add bankable_invoice import if missing
if (!code.includes("require('./bankable_invoice')")) {
  code = code.replace(
    "const { isPillar2Conversation, handlePillar2Inquiry } = require('./pillar2_closer');",
    "const { isPillar2Conversation, handlePillar2Inquiry } = require('./pillar2_closer');\nconst { createOrGetCommercialInvoice, OFFICIAL_CORPORATE_SETTLEMENT } = require('./bankable_invoice');"
  );
}

// 2. Add ACTIVE BUYING SIGNAL / EXPLICIT INTEREST handler
const buyingSignalBlock = `  // ── 1C-1. ACTIVE BUYING SIGNAL / EXPLICIT INTEREST / INVOICE REQUEST ─────────
  const isExplicitInterest = 
    /\\b(we are interested|i am interested|i'm interested|we're interested|very interested|ready to start|want to start|ready to launch|send invoice|how to pay|how do i pay|payment details|account details|account number|send account|let's do this|let's start|i want to pay|send the account|where do i pay|how much deposit)\\b/i.test(msg) ||
    (/^interested\\b/i.test(msg) && msg.length < 35);

  if (isExplicitInterest) {
    let detectedPackage = 'SME_TURNKEY_WEBSITE';
    if (/logistics|dispatch|waybill|delivery|haulage|cargo|courier/i.test(msg)) {
      detectedPackage = 'LOGISTICS_WAYBILL_PORTAL';
    } else if (/estate|service charge|tenant|rent|diesel|facility/i.test(msg)) {
      detectedPackage = 'ESTATE_SERVICE_CHARGE_PORTAL';
    } else if (/solar|inverter|boq|load|sizing|battery/i.test(msg)) {
      detectedPackage = 'SOLAR_BOQ_ENGINE';
    } else if (/app|android|apk/i.test(msg)) {
      detectedPackage = 'ANDROID_APP_CONVERSION';
    } else if (/corporate|option 2|\\.com\\b/i.test(msg)) {
      detectedPackage = 'CORPORATE_SUITE';
    } else if (/logistics|delivery|transport/i.test(category)) {
      detectedPackage = 'LOGISTICS_WAYBILL_PORTAL';
    } else if (/solar|energy|inverter/i.test(category)) {
      detectedPackage = 'SOLAR_BOQ_ENGINE';
    } else if (/estate|real estate|property/i.test(category)) {
      detectedPackage = 'ESTATE_SERVICE_CHARGE_PORTAL';
    }

    const invoice = createOrGetCommercialInvoice({
      clientName: name !== 'Your Business' ? name : (resolved.businessName || 'Valued Business Client'),
      clientPhone: leadData.phone || resolved.phone || '',
      clientEmail: leadData.email || resolved.email || '',
      category: category,
      packageType: detectedPackage
    });

    return {
      intent: 'ACTIVE_BUYING_INTEREST_INVOICE_GENERATED',
      isOptOut: false,
      messageText:
        \`Salute Boss at *\${name}*! 🤝 Fantastic decision to move forward.\\n\\n\` +
        \`We have prepared your Official Commercial Proforma Invoice & 48-Hour SLA Deployment Agreement:\\n\` +
        \`📄 *Invoice Ref:* *\${invoice.invoiceId}*\\n\` +
        \`🔗 *Live Agreement & Itemized Scope:* \${invoice.invoiceUrl}\\n\\n\` +
        \`📦 *Package:* *\${invoice.packageName}*\\n\` +
        \`💰 *Standard Setup:* *₦\${invoice.totalNgn.toLocaleString()}*\\n\` +
        \`⚡ *50% Commitment Deposit:* *₦\${invoice.depositNgn.toLocaleString()}* (or *₦25,000/month* Pay-Small-Small)\\n\` +
        \`*(Balance of ₦\${invoice.balanceNgn.toLocaleString()} is payable ONLY after your system is live and verified on Google!)*\\n\` +
        \`⏱️ *Guaranteed Go-Live Date:* *\${invoice.guaranteedDeliveryDate}* (48-Hour Legal SLA)\\n\\n\` +
        \`🏛️ *Official Corporate Settlement Account:*\\n\` +
        \`• *Bank:* Moniepoint Microfinance Bank\\n\` +
        \`• *Account Number:* *6805375225*\\n\` +
        \`• *Account Name:* Bethelmind Digital Solutions\\n\` +
        \`• *CAC Registration:* Reg: 9912717\\n\\n\` +
        \`Drop your transfer receipt here once sent to lock in your live deployment slot today!\`,
      suggestedAction: 'AWAIT_DEPOSIT_PAYMENT',
      directPaymentEligible: true,
      invoiceId: invoice.invoiceId,
      invoiceUrl: invoice.invoiceUrl
    };
  }\n\n`;

if (!code.includes('ACTIVE_BUYING_INTEREST_INVOICE_GENERATED')) {
  code = code.replace(
    "  // ── 1C. PERMISSION AFFIRMATIVE",
    buyingSignalBlock + "  // ── 1C. PERMISSION AFFIRMATIVE"
  );
}

// 3. Update Critical Transactional Intents
const oldIntents = `'OPT_OUT',
    'PHOTO_RECEIVED_AUTO_UPDATED',
    'PAYMENT_RECEIPT_PROVISIONED',
    'CUSTOM_DOMAIN_LOCKED',
    'READY_TO_PAY_INVOICE',
    'HUMAN_ESCALATION_DESK'`;

const newIntents = `'OPT_OUT',
    'PHOTO_RECEIVED_AUTO_UPDATED',
    'PAYMENT_RECEIPT_PROVISIONED',
    'CUSTOM_DOMAIN_LOCKED',
    'READY_TO_PAY_INVOICE',
    'ACTIVE_BUYING_INTEREST_INVOICE_GENERATED',
    'SECTOR_LOGISTICS_DISPATCH',
    'SECTOR_SOLAR_SPECIALIST',
    'SECTOR_REAL_ESTATE',
    'SECTOR_ANDROID_APP',
    'HUMAN_ESCALATION_DESK'`;

code = code.replace(oldIntents, newIntents);

// 4. Update Solar sector handler to generate invoice
const oldSolar = `  // A. Solar & Inverter
  if (/solar|inverter|battery|kwa|kva|load|panel|panels|backup|nepa|phcn|sizing/i.test(msg)) {
    return {
      intent: 'SECTOR_SOLAR_SPECIALIST',
      isOptOut: false,
      messageText:
        \`Salute Engr / Boss at *\${name}*! ⚡\\n\` +
        \`We built an *Instant Solar Sizer & WhatsApp BOQ Engine* into your site:\\n\` +
        \`• Customers pick appliances (AC, fridge, lights) and get instant inverter/battery size and price.\\n\` +
        \`• Shows them how much generator fuel they save monthly!\\n\` +
        \`• Drops instant quote to your WhatsApp ready to close.\\n\\n\` +
        \`👉 Test your live solar site: \${previewUrl}\\n\\n\` +
        \`Promo is *₦35,000 deposit* to launch. Reply *1* to activate!\`,
      suggestedAction: 'CLOSE_SOLAR_ENGINE',
      directPaymentEligible: true
    };
  }`;

const newSolar = `  // A. Solar & Inverter
  if (/solar|inverter|battery|kwa|kva|load|panel|panels|backup|nepa|phcn|sizing/i.test(msg)) {
    const inv = createOrGetCommercialInvoice({
      clientName: name !== 'Your Business' ? name : (resolved.businessName || 'Solar Partner'),
      clientPhone: leadData.phone || resolved.phone || '',
      clientEmail: leadData.email || resolved.email || '',
      category: 'Solar & Renewable Energy',
      packageType: 'SOLAR_BOQ_ENGINE'
    });
    return {
      intent: 'SECTOR_SOLAR_SPECIALIST',
      isOptOut: false,
      messageText:
        \`Salute Engr / Boss at *\${name}*! ⚡\\n\` +
        \`We built an *Instant Solar Sizer & WhatsApp BOQ Engine* into your site:\\n\` +
        \`• Customers pick appliances (AC, fridge, lights) and get instant inverter/battery size and price.\\n\` +
        \`• Shows generator fuel savings monthly and drops instant quotes to your WhatsApp!\\n\\n\` +
        \`👉 Test your live solar site: \${previewUrl}\\n\\n\` +
        \`📄 *Official Proforma Invoice & 48-Hour SLA:* \${inv.invoiceUrl}\\n\` +
        \`• Total: *₦75,000* | *Deposit to Launch Today: ₦35,000* (or *₦25,000/mo* Pay-Small-Small)\\n\` +
        \`• *Bank:* Moniepoint MFB • *6805375225* • *Bethelmind Digital Solutions* (CAC Reg: 9912717)\\n\\n\` +
        \`Drop your transfer receipt here or reply *1* to activate within 48 hours!\`,
      suggestedAction: 'CLOSE_SOLAR_ENGINE',
      directPaymentEligible: true,
      invoiceId: inv.invoiceId,
      invoiceUrl: inv.invoiceUrl
    };
  }`;

code = code.replace(oldSolar, newSolar);

// 5. Update Logistics sector handler to generate invoice
const oldLogistics = `  // H. Logistics, Dispatch & Haulage
  if (/dispatch|delivery|logistics|courier|haulage|waybill|rider|cargo|freight/i.test(msg)) {
    return {
      intent: 'SECTOR_LOGISTICS_DISPATCH',
      isOptOut: false,
      messageText:
        \`Salute Boss at *\${name}*! 📦\\n\` +
        \`Stop answering "how much is delivery to Lekki/Ikeja" all day!\\n\` +
        \`Your portal gives customers instant delivery fee quotes and 1-tap WhatsApp pickup requests.\\n\\n\` +
        \`👉 Test your delivery site: \${previewUrl}\\n\\n\` +
        \`Reply *1* to activate under our 50% promo (*₦35,000 deposit*)!\`,
      suggestedAction: 'CLOSE_LOGISTICS',
      directPaymentEligible: true
    };
  }`;

const newLogistics = `  // H. Logistics, Dispatch & Haulage
  if (/dispatch|delivery|logistics|courier|haulage|waybill|rider|cargo|freight/i.test(msg)) {
    const inv = createOrGetCommercialInvoice({
      clientName: name !== 'Your Business' ? name : (resolved.businessName || 'Logistics Partner'),
      clientPhone: leadData.phone || resolved.phone || '',
      clientEmail: leadData.email || resolved.email || '',
      category: 'Logistics & Haulage',
      packageType: 'LOGISTICS_WAYBILL_PORTAL'
    });
    return {
      intent: 'SECTOR_LOGISTICS_DISPATCH',
      isOptOut: false,
      messageText:
        \`Salute Boss at *\${name}*! 📦\\n\` +
        \`Stop answering "how much is delivery to Lekki/Ikeja" all day!\\n\` +
        \`Your portal gives customers instant delivery fee quotes and 1-tap WhatsApp pickup requests.\\n\\n\` +
        \`👉 Test your delivery site: \${previewUrl}\\n\\n\` +
        \`📄 *Official Proforma Invoice & 48-Hour SLA:* \${inv.invoiceUrl}\\n\` +
        \`• Total: *₦70,000* | *Deposit to Launch Today: ₦35,000* (or *₦25,000/mo* Pay-Small-Small)\\n\` +
        \`• *Bank:* Moniepoint MFB • *6805375225* • *Bethelmind Digital Solutions* (CAC Reg: 9912717)\\n\\n\` +
        \`Drop your transfer receipt here or reply *1* to activate within 48 hours!\`,
      suggestedAction: 'CLOSE_LOGISTICS',
      directPaymentEligible: true,
      invoiceId: inv.invoiceId,
      invoiceUrl: inv.invoiceUrl
    };
  }`;

code = code.replace(oldLogistics, newLogistics);

// 6. Update Real Estate / Estate Service Charge handler
const oldEstate = `  // D. Real Estate & Land Banking
  if (/estate|property|house|land|duplex|c of o|governor|realtor|rent|shortlet|inspection/i.test(msg)) {
    return {
      intent: 'SECTOR_REAL_ESTATE',
      isOptOut: false,
      messageText:
        \`Good day Boss at *\${name}*! 🏡\\n\` +
        \`Diaspora and serious home buyers search Google for verified properties.\\n\` +
        \`Your website shows verified listings, photos, and lets clients book physical or video inspections in 1 tap on WhatsApp!\\n\\n\` +
        \`👉 Inspect your property portal: \${previewUrl}\\n\\n\` +
        \`Reply *1* to launch (*₦35k deposit*) or drop 2 property photos here free!\`,
      suggestedAction: 'CLOSE_REAL_ESTATE',
      directPaymentEligible: true
    };
  }`;

const newEstate = `  // D. Real Estate & Land Banking
  if (/estate|property|house|land|duplex|c of o|governor|realtor|rent|shortlet|inspection|tenant|service charge|diesel/i.test(msg)) {
    const isServiceCharge = /service charge|tenant|rent|diesel|facility/i.test(msg);
    const inv = createOrGetCommercialInvoice({
      clientName: name !== 'Your Business' ? name : (resolved.businessName || 'Property Partner'),
      clientPhone: leadData.phone || resolved.phone || '',
      clientEmail: leadData.email || resolved.email || '',
      category: 'Real Estate & Properties',
      packageType: isServiceCharge ? 'ESTATE_SERVICE_CHARGE_PORTAL' : 'SME_TURNKEY_WEBSITE'
    });
    return {
      intent: 'SECTOR_REAL_ESTATE',
      isOptOut: false,
      messageText:
        \`Good day Boss at *\${name}*! 🏡\\n\` +
        (isServiceCharge 
          ? \`Automate your tenant service charges, diesel levies, and maintenance billing!\\nYour portal collects bank payments and sends digital receipts on WhatsApp.\\n\\n\`
          : \`Diaspora and serious home buyers search Google for verified properties.\\nYour website shows verified listings and lets clients book inspections on WhatsApp!\\n\\n\`) +
        \`👉 Inspect your portal: \${previewUrl}\\n\\n\` +
        \`📄 *Official Proforma Invoice & 48-Hour SLA:* \${inv.invoiceUrl}\\n\` +
        \`• Total: *₦\${inv.totalNgn.toLocaleString()}* | *Deposit to Launch Today: ₦\${inv.depositNgn.toLocaleString()}*\\n\` +
        \`• *Bank:* Moniepoint MFB • *6805375225* • *Bethelmind Digital Solutions* (CAC Reg: 9912717)\\n\\n\` +
        \`Drop your transfer receipt here or reply *1* to activate within 48 hours!\`,
      suggestedAction: 'CLOSE_REAL_ESTATE',
      directPaymentEligible: true,
      invoiceId: inv.invoiceId,
      invoiceUrl: inv.invoiceUrl
    };
  }`;

code = code.replace(oldEstate, newEstate);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully updated closer_engine.js with bankable invoice integration!');
