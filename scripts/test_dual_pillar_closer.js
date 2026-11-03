const { handlePostContactInquiryAsync, lookupLeadForWhatsApp } = require('./lib/closer_engine');

async function runTests() {
  console.log('🧪 RUNNING DUAL-PILLAR WHATSAPP AI CLOSER TESTS...\n');

  const testCases = [
    {
      name: 'PILLAR 2: Ora Egbunike confirms availability',
      phone: '08038774238',
      text: 'Good day Tosin, yes the 7-bedroom mansion in Amen Estate is still available under our primary mandate.',
      expectedPillar: 'Pillar 2'
    },
    {
      name: 'PILLAR 2: Diya Fatimilehin inquires about buyer identity',
      phone: '09053964068',
      text: 'Who is the direct buyer for the Victoria Island house? Can we speak with them?',
      expectedPillar: 'Pillar 2'
    },
    {
      name: 'PILLAR 2: Jide Taiwo requests 50/50 commission split',
      phone: '07052090092',
      text: 'Regarding the Banana Island villa, can we do a 50/50 split instead of 80/20?',
      expectedPillar: 'Pillar 2'
    },
    {
      name: 'PILLAR 2: Knight Frank agrees and requests JIM',
      phone: '08035678912',
      text: 'Agreed, send over the Joint Inspection Memorandum for execution.',
      expectedPillar: 'Pillar 2'
    },
    {
      name: 'PILLAR 1: Standard SME Lead asks for website pricing',
      phone: '08031234567',
      text: 'How much does it cost to build this website for my shop?',
      expectedPillar: 'Pillar 1'
    },
    {
      name: 'PILLAR 1: Retail vendor sends shop photos',
      phone: '08031234567',
      text: 'Here are the photos of my boutique in Ikeja',
      expectedPillar: 'Pillar 1'
    }
  ];

  for (const tc of testCases) {
    console.log(`================================================================`);
    console.log(`🔍 TEST: ${tc.name}`);
    console.log(`📱 Sender: ${tc.phone} | Expected: ${tc.expectedPillar}`);
    console.log(`💬 Message: "${tc.text}"`);

    const leadInfo = lookupLeadForWhatsApp(tc.phone, tc.text);
    console.log(`📋 Resolved Context: isPillar2=${Boolean(leadInfo.isPillar2)} | Name="${leadInfo.businessName}" | Category="${leadInfo.category}"`);

    const decision = await handlePostContactInquiryAsync(tc.text, {
      businessName: leadInfo.businessName,
      category: leadInfo.category,
      area: leadInfo.area,
      phone: tc.phone,
      slug: leadInfo.slug,
      previewUrl: leadInfo.previewUrl
    });

    console.log(`🎯 Intent: ${decision.intent}`);
    console.log(`🤖 AI Reply:\n${decision.messageText}\n`);

    if (tc.expectedPillar === 'Pillar 2') {
      const isCleanPillar2 = decision.intent.startsWith('PILLAR2_') &&
        !decision.messageText.includes('₦35,000') &&
        !decision.messageText.includes('shop photos') &&
        !decision.messageText.includes('pay-small-small');
      if (isCleanPillar2) {
        console.log(`✅ PASS: Correctly handled as 100% Pillar 2 Institutional Luxury Mandate!`);
      } else {
        console.error(`❌ FAIL: Pillar 2 leaked Pillar 1 SME content!`);
        process.exit(1);
      }
    } else {
      const isCleanPillar1 = !decision.intent.startsWith('PILLAR2_') &&
        (decision.messageText.includes('website') || decision.messageText.includes('₦35,000') || decision.messageText.includes('shop'));
      if (isCleanPillar1) {
        console.log(`✅ PASS: Correctly handled as Pillar 1 SME Commercial Web/Tool!`);
      } else {
        console.error(`❌ FAIL: Pillar 1 misclassified!`);
        process.exit(1);
      }
    }
  }

  console.log(`\n🎉 ALL DUAL-PILLAR AI CLOSER TESTS PASSED WITH 100% ACCURACY!`);
}

runTests().catch(console.error);
