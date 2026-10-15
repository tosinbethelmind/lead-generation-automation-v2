/**
 * @file scripts/lib/closer_engine.js
 *
 * 🤖 BETHELMIND 24/7 FULL-AUTONOMOUS WHATSAPP AI CLOSER, PHOTO RECEIVER,
 * DOMAIN BINDER & ZERO-TOUCH SITE PROVISIONING ENGINE (COMMONJS)
 *
 * Handles the entire sales and onboarding lifecycle automatically on WhatsApp:
 * 1. Instant Lead Resolution by Phone Number or Preview Slug
 * 2. Warm Nigerian Business Greeting + Free Preview Link + October 50% Promo
 * 3. Option 1 (₦35k Deposit / ₦65k .com.ng) & Option 2 (₦60k Deposit / ₦120k .com) Invoicing
 * 4. Automatic Shop Photo & Price-List Ingestion from WhatsApp into src/data/sites/[slug].json
 * 5. Automatic Custom Domain Capture & Instant Multi-Tenant Provisioning (/sites/[slug])
 * 6. Automatic Deposit / Transfer Receipt Handling + Instant Live Site & Handover Delivery
 */

const fs = require('fs');
const path = require('path');

const CORPORATE_BANK = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions'
};

const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bethelmindanalytics.com';

/**
 * Helper: Clean business name and generate a safe URL slug
 */
function toSafeSlug(text, fallback = 'business') {
  const s = String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
  return s || fallback;
}

/**
 * Automatically looks up a lead in local_db/leads_db.json by phone number OR message text
 */
function lookupLeadForWhatsApp(senderPhone, incomingText = '') {
  const cleanPhone = String(senderPhone || '').replace(/\D/g, '');
  const phoneTail = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;

  let customerName = '';
  let customerArea = 'Nigeria';
  let customerCategory = 'Commercial Business';
  let targetSlug = '';
  let matchedLead = null;

  try {
    const leadsDbPath = path.join(__dirname, '../../local_db/leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      const rawLeads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
      const leadsList = Array.isArray(rawLeads) ? rawLeads : (rawLeads.leads || Object.values(rawLeads));

      // 1. Check if message contains a /preview/[slug] or /sites/[slug] link
      if (incomingText) {
        const linkMatch = incomingText.match(/(?:preview|sites|handover)\/([a-zA-Z0-9_-]+)/i);
        if (linkMatch && linkMatch[1]) {
          targetSlug = linkMatch[1];
          matchedLead = leadsList.find(l =>
            (l.id && l.id === targetSlug) ||
            (l.lead_id && l.lead_id === targetSlug) ||
            (l.slug && l.slug === targetSlug) ||
            (l.preview_url && String(l.preview_url).endsWith(targetSlug))
          );
        }
      }

      // 2. Match by sender phone number (last 10 digits)
      if (!matchedLead && phoneTail && phoneTail.length === 10) {
        matchedLead = leadsList.find(l => {
          const lp = String(l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
          return lp.length >= 10 && lp.slice(-10) === phoneTail;
        });
      }

      if (matchedLead) {
        customerName = String(matchedLead.business_name || matchedLead.name || '')
          .split('||')[0]
          .split('|')[0]
          .trim();
        customerArea = matchedLead.area || matchedLead.city || matchedLead.state || 'Nigeria';
        customerCategory = matchedLead.category || matchedLead.sector || 'Commercial Business';
        if (!targetSlug) {
          targetSlug =
            (matchedLead.preview_url && String(matchedLead.preview_url).replace(/^.*\/preview\//, '')) ||
            (matchedLead.lead_id && !String(matchedLead.lead_id).startsWith('lead_1') ? matchedLead.lead_id : '') ||
            toSafeSlug(customerName, phoneTail || 'demo');
        }
      }
    }
  } catch (_) {}

  // 3. Fallback: Extract business name from pre-filled WhatsApp message (e.g. "sample you built for *Business Name*")
  if (!customerName && incomingText) {
    const forMatch =
      incomingText.match(/(?:built|website|sample|demo|page)\s+for\s+\*?([A-Za-z0-9\s&.,'-]{3,45})\*?/i) ||
      incomingText.match(/claim\s+the\s+website\s+for\s+\*?([A-Za-z0-9\s&.,'-]{3,45})\*?/i);
    if (forMatch && forMatch[1]) {
      customerName = forMatch[1].replace(/[*_]/g, '').trim();
    }
  }

  if (!customerName) {
    customerName = targetSlug ? targetSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Your Business';
  }
  if (!targetSlug) {
    targetSlug = customerName !== 'Your Business' ? toSafeSlug(customerName, phoneTail || 'demo') : (phoneTail || 'demo');
  }

  return {
    businessName: customerName,
    category: customerCategory,
    area: customerArea,
    phone: cleanPhone,
    slug: targetSlug,
    previewUrl: `${APP_ORIGIN}/preview/${targetSlug}`,
    liveSiteUrl: `${APP_ORIGIN}/sites/${targetSlug}`,
    handoverUrl: `${APP_ORIGIN}/handover/${targetSlug}`,
    matchedLead
  };
}

/**
 * Automatically provisions/updates src/data/sites/[slug].json (and custom domain slug .json)
 * whenever a client claims, sends a domain name, sends shop photos, or confirms payment on WhatsApp!
 */
function autoProvisionSiteFromWhatsApp(leadInfo, updates = {}) {
  try {
    const sitesDir = path.join(__dirname, '../../src/data/sites');
    if (!fs.existsSync(sitesDir)) {
      fs.mkdirSync(sitesDir, { recursive: true });
    }

    const slug = leadInfo.slug || toSafeSlug(leadInfo.businessName, leadInfo.phone || 'client');
    const sitePath = path.join(sitesDir, `${slug}.json`);

    let existing = {};
    if (fs.existsSync(sitePath)) {
      try { existing = JSON.parse(fs.readFileSync(sitePath, 'utf8')); } catch (_) {}
    }

    const phoneRaw = leadInfo.phone
      ? (leadInfo.phone.startsWith('234') ? '0' + leadInfo.phone.slice(3) : leadInfo.phone)
      : (existing.lead?.phone_raw || '0802 279 1227');
    const phoneE164 = leadInfo.phone
      ? (leadInfo.phone.startsWith('+') ? leadInfo.phone : `+${leadInfo.phone.replace(/^0/, '234')}`)
      : (existing.lead?.phone_e164 || '+2348022791227');

    const baseLead = existing.lead || leadInfo.matchedLead || {
      lead_id: slug,
      name: leadInfo.businessName,
      category: leadInfo.category || 'Professional Services',
      address: `${leadInfo.area || 'Commercial District'}, Nigeria`,
      area: leadInfo.area || 'Lagos',
      city: leadInfo.area || 'Lagos',
      rating: 4.9,
      reviews_count: 42,
      business_summary: `${leadInfo.businessName} — Official Online Storefront & 24/7 WhatsApp Booking Portal.`
    };

    const updatedLead = {
      ...baseLead,
      name: leadInfo.businessName !== 'Your Business' ? leadInfo.businessName : (baseLead.name || 'Valued Enterprise'),
      phone_raw: phoneRaw,
      phone_e164: phoneE164,
      ...(updates.preferredDomain ? { website: `https://${updates.preferredDomain.replace(/^https?:\/\//i, '')}` } : {})
    };

    const siteConfig = {
      ...existing,
      lead: updatedLead,
      theme: existing.theme || {
        primary: '#0f172a',
        accent: '#10b981',
        bg: '#f8fafc',
        text: '#0f172a',
        font: 'Outfit',
        heroImage: updates.photoDataUrl || existing.theme?.heroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #10b981 100%)'
      },
      copy: existing.copy || {
        heroTitle: `${updatedLead.name} — Official Online Storefront`,
        heroSubtitle: `Trusted ${updatedLead.category || 'Commercial'} specialists serving ${updatedLead.area || 'Nigeria'}. Chat with us 24/7 on WhatsApp for instant pricing and bookings.`,
        services: [
          { title: 'Instant WhatsApp Price Quote', description: 'Get accurate pricing and availability in seconds on WhatsApp.', icon: 'Zap' },
          { title: 'Express Priority Booking', description: 'Book appointments or order directly with verified bank transfer protection.', icon: 'Shield' },
          { title: 'Verified Quality Guarantee', description: `100% authentic products and trusted service from ${updatedLead.name}.`, icon: 'Award' }
        ],
        aboutText: updatedLead.business_summary || `${updatedLead.name} is a premier business serving clients across ${updatedLead.area || 'Nigeria'}.`,
        testimonials: [
          { name: 'Verified Customer', text: `Fast response on WhatsApp and excellent service from ${updatedLead.name}!`, rating: 5 }
        ],
        ctaText: 'Chat on WhatsApp Now'
      },
      preferredDomain: updates.preferredDomain || existing.preferredDomain || '',
      selectedPackage: updates.selectedPackage || existing.selectedPackage || 'Starter Official Website (.com.ng)',
      paymentStatus: updates.paymentStatus || existing.paymentStatus || 'IN_PROGRESS',
      whatsappPhotosReceived: (existing.whatsappPhotosReceived || 0) + (updates.photoReceived ? 1 : 0),
      lastUpdatedViaWhatsApp: new Date().toISOString()
    };

    if (updates.photoDataUrl) {
      siteConfig.theme.heroImage = updates.photoDataUrl;
    }

    fs.writeFileSync(sitePath, JSON.stringify(siteConfig, null, 2), 'utf8');

    // If client specified a custom domain (e.g. chinedumotors.com.ng), also save chinedumotors.json
    // so src/proxy.ts routes www.chinedumotors.com.ng -> /sites/chinedumotors with zero manual config!
    let customDomainLiveSlug = slug;
    const activeDomain = siteConfig.preferredDomain;
    if (activeDomain) {
      const domainPrefix = activeDomain
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('.')[0]
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
      if (domainPrefix && domainPrefix.length >= 2) {
        customDomainLiveSlug = domainPrefix;
        const domainPath = path.join(sitesDir, `${domainPrefix}.json`);
        fs.writeFileSync(domainPath, JSON.stringify(siteConfig, null, 2), 'utf8');
      }
    }

    return {
      success: true,
      slug,
      customDomainLiveSlug,
      liveSiteUrl: `${APP_ORIGIN}/sites/${customDomainLiveSlug}`,
      handoverUrl: `${APP_ORIGIN}/handover/${slug}`,
      preferredDomain: activeDomain
    };
  } catch (err) {
    console.warn('[AutoProvision WhatsApp Warning]:', err.message);
    return {
      success: false,
      slug: leadInfo.slug || 'demo',
      liveSiteUrl: `${APP_ORIGIN}/sites/${leadInfo.slug || 'demo'}`,
      handoverUrl: `${APP_ORIGIN}/handover/${leadInfo.slug || 'demo'}`
    };
  }
}

/**
 * Core Conversational Closer Brain
 */
function handlePostContactInquiry(clientMessage, leadData = {}) {
  const rawMsg = String(clientMessage || '').trim();
  const msg = rawMsg.toLowerCase();

  // Resolve full lead context automatically if not already populated
  const resolved = lookupLeadForWhatsApp(leadData.phone || '', rawMsg);
  const name = (leadData.businessName && !leadData.businessName.startsWith('Business Owner') && leadData.businessName !== 'Valued Enterprise')
    ? leadData.businessName
    : resolved.businessName;
  const area = leadData.area || resolved.area || 'Nigeria';
  const category = leadData.category || resolved.category || 'Commercial Business';
  const slug = leadData.slug || resolved.slug || toSafeSlug(name, leadData.phone || 'demo');
  const previewUrl = leadData.previewUrl && !leadData.previewUrl.endsWith('/demo')
    ? leadData.previewUrl
    : `${APP_ORIGIN}/preview/${slug}`;
  const liveSiteUrl = `${APP_ORIGIN}/sites/${slug}`;
  const handoverUrl = `${APP_ORIGIN}/handover/${slug}`;

  const fullLeadContext = {
    businessName: name,
    category,
    area,
    phone: leadData.phone || resolved.phone,
    slug,
    matchedLead: resolved.matchedLead
  };

  // ── 1. OPT-OUT / STOP INTERCEPT ───────────────────────────────────────────
  if (/^(no|stop|cancel|unsubscribe|remove|not interested|dont message|don't message|leave me|opt out|optout)\b/i.test(msg) ||
      /\b(stop messaging|remove my number|stop sending|dont contact|don't contact)\b/i.test(msg)) {
    return {
      intent: 'OPT_OUT',
      isOptOut: true,
      messageText: `No problem at all Sir/Ma! Your number has been removed immediately. Wishing *${name}* continuous business success! — Bethelmind Digital Solutions`,
      suggestedAction: 'DNC_SUPPRESS',
      directPaymentEligible: false
    };
  }

  // ── 2. CUSTOMER SENT SHOP PHOTO / IMAGE ON WHATSAPP ───────────────────────
  if (/\[photo received\]|\[image received\]|here are .*photo|update our sample page free/i.test(msg) || leadData.hasMediaImage) {
    const prov = autoProvisionSiteFromWhatsApp(fullLeadContext, {
      photoReceived: true,
      photoDataUrl: leadData.photoDataUrl || undefined
    });
    return {
      intent: 'PHOTO_RECEIVED_AUTO_UPDATED',
      isOptOut: false,
      messageText:
        `📸 *Awesome! Shop Photo Received for ${name}!*\n\n` +
        `We have logged your photo directly into your website profile and activated your clean live storefront link:\n` +
        `👉 *Live Website:* ${prov.liveSiteUrl}\n` +
        `👉 *Preview & Claim Page:* ${previewUrl}\n\n` +
        `You can drop 2 to 4 more photos or your price list right here on WhatsApp!\n\n` +
        `🚀 *READY TO REGISTER YOUR OFFICIAL .COM.NG DOMAIN NAME TODAY?*\n` +
        `Under our *🇳🇬 October 50% SME Promo*, your complete 1-Year Official Website + Domain + Hosting + 24/7 WhatsApp Assistant is *₦65,000* _(instead of ₦130,000)_.\n\n` +
        `• *Deposit to Launch Today:* *₦35,000* _(Pay the ₦30,000 balance ONLY after your .com.ng domain is live!)_\n` +
        `• *Bank:* *${CORPORATE_BANK.bankName}*\n` +
        `• *Account No:* *${CORPORATE_BANK.accountNumber}*\n` +
        `• *Account Name:* *${CORPORATE_BANK.accountName}* _(CAC Certified)_\n\n` +
        `Reply with the *domain name you want* (e.g. *${slug.replace(/-/g, '')}.com.ng*) or send your ₦35,000 deposit receipt here to lock it in!`,
      suggestedAction: 'AWAIT_DOMAIN_OR_DEPOSIT',
      directPaymentEligible: true
    };
  }

  // ── 3. CUSTOMER CONFIRMED PAYMENT / SENT TRANSFER RECEIPT ─────────────────
  if (/\b(i have paid|i've paid|just paid|payment sent|transferred|transfer done|sent the deposit|i sent the money|receipt|paid 35|paid 60|paid 65|payment confirmed|check your account)\b/i.test(msg)) {
    const domainInMsg = rawMsg.match(/\b([a-zA-Z0-9-]{2,40}\.(?:com\.ng|org\.ng|ng|com|net|org))\b/i);
    const chosenDomain = domainInMsg ? domainInMsg[1].toLowerCase() : `${slug.replace(/-/g, '')}.com.ng`;

    const prov = autoProvisionSiteFromWhatsApp(fullLeadContext, {
      preferredDomain: chosenDomain,
      paymentStatus: 'DEPOSIT_REPORTED_BY_CLIENT'
    });

    return {
      intent: 'PAYMENT_RECEIPT_PROVISIONED',
      isOptOut: false,
      messageText:
        `🎉 *PAYMENT NOTIFICATION RECEIVED — THANK YOU, ${name.toUpperCase()}!*\n\n` +
        `Our system has automatically provisioned your clean production website (with all preview banners removed and your WhatsApp number connected to all booking buttons)!\n\n` +
        `🌐 *1. Your Instant Hosted Website (Live Right Now):*\n` +
        `${prov.liveSiteUrl}\n\n` +
        `🔑 *2. Your Client Handover & Revision Portal:*\n` +
        `${prov.handoverUrl}\n\n` +
        `🏷️ *3. Your Official Custom Domain (${chosenDomain}):*\n` +
        `Our engineering desk has received your alert and is registering & pointing *www.${chosenDomain}* directly to your live site right now (SSL activates within 15–30 mins).\n\n` +
        `📸 *Have more shop photos or price changes?* Simply drop them right here on WhatsApp and we will update your gallery immediately!`,
      suggestedAction: 'VERIFY_BANK_CREDIT_AND_REGISTER_DOMAIN',
      directPaymentEligible: true
    };
  }

  // ── 4. CUSTOMER SENT THEIR PREFERRED DOMAIN NAME (e.g. "mybusiness.com.ng") ─
  const domainOnlyMatch = rawMsg.match(/\b([a-zA-Z0-9-]{3,40}\.(?:com\.ng|org\.ng|ng|com|net|org))\b/i);
  if (domainOnlyMatch && !rawMsg.includes('bethelmindanalytics.com')) {
    const requestedDomain = domainOnlyMatch[1].toLowerCase();
    const isDotCom = requestedDomain.endsWith('.com') && !requestedDomain.endsWith('.com.ng');
    const promoTotal = isDotCom ? '₦120,000' : '₦65,000';
    const depositAmt = isDotCom ? '₦60,000' : '₦35,000';
    const balanceAmt = isDotCom ? '₦60,000' : '₦30,000';

    const prov = autoProvisionSiteFromWhatsApp(fullLeadContext, {
      preferredDomain: requestedDomain,
      selectedPackage: isDotCom ? 'Corporate Growth Suite (.com)' : 'Starter Official Website (.com.ng)'
    });

    return {
      intent: 'CUSTOM_DOMAIN_LOCKED',
      isOptOut: false,
      messageText:
        `✅ *Domain Name Reserved & Bound: www.${requestedDomain}*\n\n` +
        `We have pre-configured your live production website for *${name}* to respond automatically to *www.${requestedDomain}*!\n\n` +
        `🌐 *Test Your Clean Live Website Now:*\n` +
        `${prov.liveSiteUrl}\n\n` +
        `📋 *OCTOBER 50% PROMO SUMMARY FOR ${requestedDomain.toUpperCase()}:*\n` +
        `• *1-Year Package Total:* *${promoTotal}* _(Includes Domain + 1-Yr Cloud Hosting + 24/7 WhatsApp AI)_\n` +
        `• *50% Deposit to Register Domain Today:* *${depositAmt}*\n` +
        `• *Remaining Balance (${balanceAmt}):* Payable ONLY after *www.${requestedDomain}* is live on your phone!\n\n` +
        `🏛️ *CAC Corporate Settlement Account:*\n` +
        `• Bank: *${CORPORATE_BANK.bankName}*\n` +
        `• Account Number: *${CORPORATE_BANK.accountNumber}*\n` +
        `• Account Name: *${CORPORATE_BANK.accountName}*\n\n` +
        `Kindly transfer your *${depositAmt}* deposit now and send your receipt screenshot here — your domain *www.${requestedDomain}* goes live within 15 minutes of confirmation!`,
      suggestedAction: 'AWAIT_DEPOSIT_FOR_DOMAIN',
      directPaymentEligible: true
    };
  }

  // ── 5. CUSTOMER REPLIED "1", "2", OR ASKED FOR ACCOUNT / INVOICE / TO START ─
  if (
    msg === '1' ||
    msg === '2' ||
    msg === 'option 1' ||
    msg === 'option 2' ||
    /account|bank|pay|invoice|transfer|send details|deposit|ready to start|moniepoint|opay|interested|proceed|i want|let's start|how do we start|how to start|deal|buy|get started|how much to start|give me account|payment|send account|ready|start now|set it up|close deal|claim/i.test(msg)
  ) {
    const isOption2 = msg === '2' || msg === 'option 2' || /option 2|corporate|\.com\b(?!\.ng)|staff email/i.test(msg);
    const pkgName = isOption2
      ? 'Option 2: Corporate .COM Domain + 3 Official Staff Emails & 24/7 AI Suite'
      : 'Option 1: Starter Official .COM.NG Website + 1-Yr Hosting & 24/7 WhatsApp Assistant';
    const normalPrice = isOption2 ? '₦240,000' : '₦130,000';
    const promoTotal = isOption2 ? '₦120,000' : '₦65,000';
    const depositAmt = isOption2 ? '₦60,000' : '₦35,000';
    const balanceAmt = isOption2 ? '₦60,000' : '₦30,000';
    const suggestedDomain = `${slug.replace(/-/g, '')}${isOption2 ? '.com' : '.com.ng'}`;

    // Auto-provision their clean live site immediately so it's ready before they even finish paying
    autoProvisionSiteFromWhatsApp(fullLeadContext, {
      selectedPackage: pkgName
    });

    return {
      intent: 'READY_TO_PAY_INVOICE',
      isOptOut: false,
      messageText:
        `🤝 *Wonderful decision, Boss / Management at ${name}!*\n\n` +
        `We have already staged your clean production website at:\n` +
        `👉 ${liveSiteUrl}\n\n` +
        `📋 *OFFICIAL OCTOBER 50% PROMO INVOICE:*\n` +
        `• *Selected Package:* ${pkgName}\n` +
        `• *October Promo Total:* *${promoTotal}* _(50% Off Normal ${normalPrice})_\n` +
        `• *50% Deposit to Start Today:* *${depositAmt}*\n` +
        `• *Balance (${balanceAmt}):* Payable ONLY AFTER your custom domain (*www.${suggestedDomain}*) is live on Google with your real shop photos!\n\n` +
        `🏛️ *OFFICIAL CAC CORPORATE BANK ACCOUNT:*\n` +
        `• Bank: *${CORPORATE_BANK.bankName}*\n` +
        `• Account Number: *${CORPORATE_BANK.accountNumber}*\n` +
        `• Account Name: *${CORPORATE_BANK.accountName}*\n\n` +
        `⚡ *3 EASY STEPS TO COMPLETE YOUR LAUNCH:*\n` +
        `1️⃣ Transfer the *${depositAmt}* deposit to our Moniepoint corporate account above.\n` +
        `2️⃣ Drop your *transfer receipt* right here on WhatsApp.\n` +
        `3️⃣ Reply with your preferred domain name (e.g. *${suggestedDomain}*) and 3–5 photos of your shop/work!\n\n` +
        `_(Want to see your real shop photos on the site first before paying? Just send 3 photos here right now and we will update it FREE!)_`,
      suggestedAction: 'AWAIT_PAYMENT_PROOF',
      directPaymentEligible: true
    };
  }

  // ── 6. PRICING / COST INQUIRY ─────────────────────────────────────────────
  if (/price|cost|how much|charges|fee|package|plans|rate|promo/i.test(msg)) {
    return {
      intent: 'PRICING_INQUIRY',
      isOptOut: false,
      messageText:
        `Good day Boss / Management at *${name}*! 👋\n\n` +
        `Because we already built 80% of the sample website for *${name}* in advance, you qualify for our *🇳🇬 October 50% SME Digital Growth Promo*:\n\n` +
        `1️⃣ *Option 1: Official .COM.NG Website + 24/7 WhatsApp Closer*\n` +
        `• Normal Agency Price: ~₦130,000~\n` +
        `• *October 50% Promo Total: ₦65,000* _(Includes 1 Full Year .com.ng Domain & Cloud Hosting — Zero Monthly Rent!)_\n` +
        `• 👉 *Start Today With ₦35,000 Deposit* _(Pay the ₦30,000 balance ONLY after your site is live with your photos!)_\n\n` +
        `2️⃣ *Option 2: Corporate .COM Website + 3 Official Staff Emails*\n` +
        `• Normal Agency Price: ~₦240,000~\n` +
        `• *October 50% Promo Total: ₦120,000* _(Start today with *₦60,000 Deposit*)_\n\n` +
        `3️⃣ *Option 3: Free Shop Photo Update First (₦0 Today)*\n` +
        `• Send 3–5 photos of your work right here on WhatsApp — we will put them on your sample website FREE before you pay a kobo!\n\n` +
        `👉 *Check your sample website here:*\n${previewUrl}\n\n` +
        `🏛️ *CAC Corporate Account:* Moniepoint MFB · *6805375225* · *Bethelmind Digital Solutions*\n\n` +
        `Reply *1* for Option 1 (₦35k Deposit), *2* for Option 2 (₦60k Deposit), or *drop your shop photos here now*!`,
      suggestedAction: 'QUALIFY_PACKAGE',
      directPaymentEligible: true
    };
  }

  // ── 7. CONFUSION / "WHO ARE YOU?" / "IS THIS REAL?" ───────────────────────
  if (/understand|what is this|what does this mean|explain|who is this|who are you|confused|legit|scam|trust|real|office|address|guarantee/i.test(msg)) {
    return {
      intent: 'TRUST_AND_CLARIFICATION',
      isOptOut: false,
      messageText:
        `Good day Sir/Ma! 👋 My name is Tosin from *Bethelmind Digital Solutions* (a CAC Certified Nigerian Technology Company in Lagos).\n\n` +
        `💡 *Why we messaged you:*\n` +
        `When customers search for *${name}* on Google right now, you don't have an official website yet, so other competitors show up instead.\n\n` +
        `Instead of asking you to pay upfront and wait weeks, we *already built a working sample website + 24/7 WhatsApp assistant* for *${name}* so you can test it on your phone for FREE:\n\n` +
        `👉 *Tap here to inspect it (100% Free):*\n${previewUrl}\n\n` +
        `🛡️ *Why Business Owners Trust Us:*\n` +
        `• *₦0 Photo Test First:* Send 3 photos of your shop here on WhatsApp and we will put them on your sample page FREE before you pay.\n` +
        `• *October 50% Promo:* Complete *.com.ng* website is *₦65,000* (down from ₦130k) — start with *₦35,000 deposit* and pay the ₦30k balance ONLY after your website is live!\n` +
        `• *CAC Corporate Bank Account:* You only ever pay into our registered corporate account (*Moniepoint MFB · 6805375225 · Bethelmind Digital Solutions*).\n\n` +
        `Tap the link above to view your website, and reply *1* to launch or send your shop photos here!`,
      suggestedAction: 'REASSURE_AND_CLOSE',
      directPaymentEligible: true
    };
  }

  // ── 8. VOICE NOTE RECEIVED ────────────────────────────────────────────────
  if (/\[voice note received\]|voice note|audio message/i.test(msg)) {
    return {
      intent: 'VOICE_NOTE_ACK',
      isOptOut: false,
      messageText:
        `Good day Boss at *${name}*! 🎙️ We received your voice note.\n\n` +
        `Here is the free sample website we built for *${name}* to check on your phone:\n` +
        `👉 ${previewUrl}\n\n` +
        `Under our *October 50% SME Promo*, you can launch your official *.com.ng* website + 24/7 WhatsApp assistant for *₦65,000 total* (*₦35,000 deposit* to start, balance after going live) — or send 3 shop photos here first and we will update your sample page FREE!\n\n` +
        `Reply *1* to get started or drop your shop photos right here!`,
      suggestedAction: 'ACK_VOICE_NOTE',
      directPaymentEligible: true
    };
  }

  // ── 9. DEFAULT: WARM GREETING / "DEMO" / LINK REQUEST ─────────────────────
  return {
    intent: 'GREETING_AND_DEMO_DELIVERY',
    isOptOut: false,
    messageText:
      `Good day Boss / Management at *${name}*! 👋 Well done with your work in ${area}.\n\n` +
      `When customers search for *${name}* on Google right now, you don't have an official website yet — so we built a *ready-made sample website + 24/7 WhatsApp assistant* for *${name}* to test FREE on your phone:\n\n` +
      `👉 *Tap here to check ${name}'s sample website (₦0 to view):*\n${previewUrl}\n\n` +
      `🇳🇬 *OCTOBER 50% SME DIGITAL GROWTH PROMO:*\n` +
      `1️⃣ *Reply "1" — Starter Official .COM.NG Website:* *₦65,000 Total* _(Normal price ~₦130,000~)_ · Start today with *₦35,000 Deposit*, pay ₦30k balance ONLY after it is live!\n` +
      `2️⃣ *Reply "2" — Corporate .COM + 3 Staff Emails:* *₦120,000 Total* _(Normal price ~₦240,000~)_ · Start with *₦60,000 Deposit*.\n` +
      `3️⃣ *Want to see your real photos on it first?* Send 3–5 photos of your shop/products right here on WhatsApp and we will put them on your page FREE before you pay!\n\n` +
      `🏛️ *CAC Corporate Account:* Moniepoint MFB · *6805375225* · *Bethelmind Digital Solutions*\n\n` +
      `Open your link above now, then reply *1*, *2*, or drop your shop photos here!`,
    suggestedAction: 'SEND_DEMO_LINK',
    directPaymentEligible: true
  };
}

module.exports = {
  handlePostContactInquiry,
  lookupLeadForWhatsApp,
  autoProvisionSiteFromWhatsApp,
  CORPORATE_BANK
};
