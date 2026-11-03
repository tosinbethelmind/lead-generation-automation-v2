const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'verify_all_high_profile_leads_and_links.js');
let content = fs.readFileSync(targetFile, 'utf8');

const oldSection = `    // F. Buyer Dossier Validation
    const buyer = ticket.buyerProfile;
    assert(Boolean(buyer), \`[#\${id}] Matched Interested Buyer Profile Exists\`);
    if (buyer) {
      assert(Boolean(buyer.buyerCode), \`[#\${id}] Buyer Code Assigned\`, buyer.buyerCode);
      assert(Boolean(buyer.principalName), \`[#\${id}] Buyer Principal Name Present\`, buyer.principalName);
      assert(Boolean(buyer.allocatedBudgetFormatted), \`[#\${id}] Buyer Allocated Budget Present\`, buyer.allocatedBudgetFormatted);
      assert(Boolean(buyer.purpose), \`[#\${id}] Buyer Acquisition Purpose Defined\`);
      assert(Boolean(buyer.requirements), \`[#\${id}] Specific Property Requirements Defined\`);
      assert(Boolean(buyer.readinessTimeline), \`[#\${id}] Acquisition Timeline Defined\`, buyer.readinessTimeline);
      assert(Boolean(buyer.liquidityStatus), \`[#\${id}] Liquidity / POF Status Verified\`, buyer.liquidityStatus);
    }

    // G. Inbound Call Crib Sheet
    const brief = ticket.inboundCallBrief;
    assert(Boolean(brief), \`[#\${id}] Inbound Call Crib Sheet Attached\`);
    if (brief) {
      assert(Boolean(brief.openingGreeting), \`[#\${id}] Opening Greeting Phone Script Attached\`);
      assert(Boolean(brief.buyerProfileResponse), \`[#\${id}] "Who Is Your Buyer?" Phone Script Attached\`);
      assert(Boolean(brief.inspectionProtocol), \`[#\${id}] Inspection & 80/20 Fee Lock Script Attached\`);
      assert(Boolean(brief.commissionSummary?.brokerCutFormatted), \`[#\${id}] 80% Partner Split Math Pre-Calculated\`, brief.commissionSummary?.brokerCutFormatted);
      assert(Boolean(brief.commissionSummary?.bethelmindCutFormatted), \`[#\${id}] 20% Bethelmind Cut Math Pre-Calculated\`, brief.commissionSummary?.bethelmindCutFormatted);
    }`;

const newSection = `    // F. Buyer Dossier Validation
    const buyer = ticket.buyerProfile;
    assert(Boolean(buyer), \`[#\${id}] Matched Interested Buyer Profile Exists\`);
    if (buyer) {
      assert(Boolean(buyer.buyerCode), \`[#\${id}] Buyer Code Assigned\`, buyer.buyerCode);
      assert(Boolean(buyer.principalName), \`[#\${id}] Buyer Principal Name Present\`, buyer.principalName);
      assert(Boolean(buyer.allocatedBudgetFormatted), \`[#\${id}] Buyer Allocated Budget Present\`, buyer.allocatedBudgetFormatted);
      assert(Boolean(buyer.purpose), \`[#\${id}] Buyer Acquisition Purpose Defined\`);
      assert(Boolean(buyer.requirements), \`[#\${id}] Specific Property Requirements Defined\`);
      assert(Boolean(buyer.readinessTimeline), \`[#\${id}] Acquisition Timeline Defined\`, buyer.readinessTimeline);
      assert(Boolean(buyer.liquidityStatus), \`[#\${id}] Liquidity / POF Status Verified\`, buyer.liquidityStatus);

      // F2. Representative Contact Verification
      const rep = buyer.representativeContact;
      assert(Boolean(rep), \`[#\${id}] Buyer Representative Contact Attached\`);
      if (rep) {
        assert(Boolean(rep.name), \`[#\${id}] Representative Name Defined\`, rep.name);
        const repPhoneCheck = validateNigerianPhone(rep.phone);
        assert(repPhoneCheck.valid, \`[#\${id}] Representative Phone Valid\`, rep.phone);
        const repEmailCheck = validateEmail(rep.email);
        assert(repEmailCheck.valid, \`[#\${id}] Representative Email Valid\`, rep.email);
        assert(Boolean(rep.officeAddress), \`[#\${id}] Representative Lagos Office Address Defined\`);
      }

      // F3. Source Attribution & Cross-Check Verification
      const source = buyer.sourceAttribution;
      assert(Boolean(source), \`[#\${id}] Source Attribution Record Attached\`);
      if (source) {
        assert(Boolean(source.sourceName), \`[#\${id}] Source Registry Name Defined\`, source.sourceName);
        assert(Boolean(source.sourceUrl && source.sourceUrl.startsWith('https://')), \`[#\${id}] Source Cross-Check URL Format\`);
        assert(Boolean(source.proofOfFundsRef), \`[#\${id}] Proof of Funds Reference Attached\`, source.proofOfFundsRef);
      }
    }

    // G. Inbound Call Crib Sheet
    const brief = ticket.inboundCallBrief;
    assert(Boolean(brief), \`[#\${id}] Inbound Call Crib Sheet Attached\`);
    if (brief) {
      assert(Boolean(brief.openingGreeting), \`[#\${id}] Opening Greeting Phone Script Attached\`);
      assert(Boolean(brief.buyerProfileResponse), \`[#\${id}] "Who Is Your Buyer?" Phone Script Attached\`);
      assert(Boolean(brief.inspectionProtocol), \`[#\${id}] Inspection & 80/20 Fee Lock Script Attached\`);
      assert(Boolean(brief.commissionSummary?.brokerCutFormatted), \`[#\${id}] 80% Partner Split Math Pre-Calculated\`, brief.commissionSummary?.brokerCutFormatted);
      assert(Boolean(brief.commissionSummary?.bethelmindCutFormatted), \`[#\${id}] 20% Bethelmind Cut Math Pre-Calculated\`, brief.commissionSummary?.bethelmindCutFormatted);
      assert(Boolean(brief.processMap && brief.processMap.length >= 6), \`[#\${id}] 6-Stage Process Map Attached in Brief\`);
    }`;

content = content.replace(/\r\n/g, '\n');
content = content.replace(oldSection.replace(/\r\n/g, '\n'), newSection);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('✅ Updated verify_all_high_profile_leads_and_links.js with deep representative & source tests!');
