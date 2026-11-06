const fs = require('fs');
const file = 'src/components/admin/Pillar2ControlView.tsx';
let code = fs.readFileSync(file, 'utf8');
const isCrlf = code.includes('\r\n');
if (isCrlf) code = code.replace(/\r\n/g, '\n');

// 1. Update import
const oldImport = "import { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/luxuryListings';";
const newImport = "import { PRIME_LUXURY_LISTINGS, VERIFIED_NIGERIAN_BROKERS } from '@/lib/pillar2/luxuryListings';";
if (code.includes(oldImport)) {
  code = code.replace(oldImport, newImport);
  console.log('Import updated');
} else {
  console.log('Import already updated or not found');
}

// 2. Update allDisplayTickets useMemo
const targetBlock = `  // Guaranteed all 8 luxury deals from backend OR pure fallback from PRIME_LUXURY_LISTINGS
  const allDisplayTickets: any[] = React.useMemo(() => {
    const rawAll = pillar2Data?.allTickets || [];
    const lookup = new Map<string, any>();
    
    // Seed with guaranteed baseline luxury assets from pure PRIME_LUXURY_LISTINGS
    PRIME_LUXURY_LISTINGS.forEach(l => {
      const propertyVal = l.priceNGN;
      const agencyCommissionPool = Math.round(propertyVal * 0.05);
      const bethelmindCut = Math.round(agencyCommissionPool * 0.20);
      const cleanPhone = String(l.brokerContact.phone).replace(/\\D/g, '');
      const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
      const script = \`Good day \${l.brokerContact.name}, my name is Tosin Oyelakin, Principal at Bethelmind Digital Solutions (CAC Certified: Reg 9912717). We are onboarding verified luxury mandates for our incoming Q4 diaspora investor brief and corporate executive allocations in Lagos.\\n\\nWe identified your verified listing for \${l.title} (\${l.priceFormatted}). Under LASRERA co-brokerage guidelines, we propose our standard 80/20 agency fee arrangement (your firm retains 80% of agency commission, Bethelmind retains 20% origination fee).\\n\\nReview certified buyer brief & 80/20 mandate: https://www.bethelmindanalytics.com/deal/\${l.id}\\n\\n1. Is this property still directly available under your mandate?\\n2. Do you confirm agreement to the standard 80/20 fee split?\\n\\nOnce confirmed, we issue our Joint Inspection Memorandum (JIM) before accompanied walkthrough.\`;
      const sms = \`LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for \${l.title.slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.\`;

      lookup.set(l.id, {
        ticketId: l.id,
        title: \`Pillar 2 Mandate: \${l.title}\`,
        propertyValueNGN: propertyVal,
        projectedRevenueNGN: bethelmindCut,
        targetBusinessName: l.brokerContact.name,
        targetContactPhone: l.brokerContact.phone,
        targetContactEmail: l.brokerContact.email,
        targetLocation: l.location.area + ', ' + l.location.city,
        listingUrl: \`https://www.bethelmindanalytics.com/deal/\${l.id}\`,
        status: 'PENDING_APPROVAL',
        preDraftedScript: script,
        smsText: sms,
        emailSubject: \`[LASRERA Co-Brokerage Mandate] Bethelmind Digital Solutions x \${l.brokerContact.name} - \${l.title}\`,
        emailBody: script,
        directChatLink: \`https://wa.me/\${e164}?text=\${encodeURIComponent(script)}\`,
        smsLink: \`sms:+\${e164}?body=\${encodeURIComponent(sms)}\`,
        emailLink: \`mailto:\${l.brokerContact.email}?subject=\${encodeURIComponent(\`[LASRERA Co-Brokerage Mandate] Bethelmind x \${l.brokerContact.name}\`)}&body=\${encodeURIComponent(script)}\`,
        buyerProfile: l.buyerProfile
      });
    });

    rawAll.forEach((t: any) => {
      const matchKey = Array.from(lookup.keys()).find(k => t.ticketId?.startsWith(k) || k.startsWith(t.ticketId));
      if (matchKey) {
        lookup.set(matchKey, { ...lookup.get(matchKey), ...t, buyerProfile: t.buyerProfile || lookup.get(matchKey)?.buyerProfile });
      } else if (t.ticketId) {
        lookup.set(t.ticketId, t);
      }
    });

    return Array.from(lookup.values());
  }, [pillar2Data]);`;

const replacementBlock = `  // Guaranteed all 8 luxury deals from backend OR pure fallback from PRIME_LUXURY_LISTINGS
  const allDisplayTickets: any[] = React.useMemo(() => {
    const rawAll = pillar2Data?.allTickets || [];
    const lookup = new Map<string, any>();
    
    // Seed with guaranteed baseline luxury assets from pure PRIME_LUXURY_LISTINGS
    PRIME_LUXURY_LISTINGS.forEach((l: any, idx: number) => {
      const broker = l.brokerContact || (Array.isArray(VERIFIED_NIGERIAN_BROKERS) ? VERIFIED_NIGERIAN_BROKERS[idx % VERIFIED_NIGERIAN_BROKERS.length] : null);
      const propertyVal = l.priceNgn || l.priceNGN || 500000000;
      const agencyCommissionPool = Math.round(propertyVal * 0.05);
      const bethelmindCut = Math.round(agencyCommissionPool * 0.20);
      const brokerPhone = broker?.phone || l.buyerProfile?.representativeContact?.phone || '08022791227';
      const cleanPhone = String(brokerPhone).replace(/\\D/g, '');
      const e164 = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
      const brokerName = broker?.name || 'Verified Lagos Broker Partner';
      const brokerEmail = broker?.email || 'commercial@bethelmindanalytics.com';
      const locStr = typeof l.location === 'string' ? l.location : (l.location?.area ? \`\${l.location.area}, \${l.location.city}\` : 'Lagos, Nigeria');
      const script = \`Good day \${brokerName}, my name is Tosin Oyelakin, Principal at Bethelmind Digital Solutions (CAC Certified: Reg 9912717). We are onboarding verified luxury mandates for our incoming Q4 diaspora investor brief and corporate executive allocations in Lagos.\\n\\nWe identified your verified listing for \${l.title} (\${l.priceFormatted || '₦' + propertyVal.toLocaleString()}). Under LASRERA co-brokerage guidelines, we propose our standard 80/20 agency fee arrangement (your firm retains 80% of agency commission, Bethelmind retains 20% origination fee).\\n\\nReview certified buyer brief & 80/20 mandate: https://www.bethelmindanalytics.com/deal/\${l.id}\\n\\n1. Is this property still directly available under your mandate?\\n2. Do you confirm agreement to the standard 80/20 fee split?\\n\\nOnce confirmed, we issue our Joint Inspection Memorandum (JIM) before accompanied walkthrough.\`;
      const sms = \`LASRERA: Bethelmind (CAC 9912717) requests 80/20 co-brokerage for \${String(l.title || 'Mandate').slice(0, 35)}. Review brief / chat Desk: wa.me/2348022791227 or call.\`;

      lookup.set(l.id, {
        ticketId: l.id,
        title: \`Pillar 2 Mandate: \${l.title}\`,
        propertyValueNGN: propertyVal,
        projectedRevenueNGN: bethelmindCut,
        targetBusinessName: brokerName,
        targetContactPhone: brokerPhone,
        targetContactEmail: brokerEmail,
        targetLocation: locStr,
        listingUrl: \`https://www.bethelmindanalytics.com/deal/\${l.id}\`,
        status: 'PENDING_APPROVAL',
        preDraftedScript: script,
        smsText: sms,
        emailSubject: \`[LASRERA Co-Brokerage Mandate] Bethelmind Digital Solutions x \${brokerName} - \${l.title}\`,
        emailBody: script,
        directChatLink: \`https://wa.me/\${e164}?text=\${encodeURIComponent(script)}\`,
        smsLink: \`sms:+\${e164}?body=\${encodeURIComponent(sms)}\`,
        emailLink: \`mailto:\${brokerEmail}?subject=\${encodeURIComponent(\`[LASRERA Co-Brokerage Mandate] Bethelmind x \${brokerName}\`)}&body=\${encodeURIComponent(script)}\`,
        buyerProfile: l.buyerProfile
      });
    });

    rawAll.forEach((t: any) => {
      const matchKey = Array.from(lookup.keys()).find(k => t.ticketId?.startsWith(k) || k.startsWith(t.ticketId));
      if (matchKey) {
        lookup.set(matchKey, { ...lookup.get(matchKey), ...t, buyerProfile: t.buyerProfile || lookup.get(matchKey)?.buyerProfile });
      } else if (t.ticketId) {
        lookup.set(t.ticketId, t);
      }
    });

    return Array.from(lookup.values());
  }, [pillar2Data]);`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  console.log('allDisplayTickets replaced successfully');
} else {
  console.log('targetBlock not found');
}

if (isCrlf) code = code.replace(/\n/g, '\r\n');
fs.writeFileSync(file, code, 'utf8');
