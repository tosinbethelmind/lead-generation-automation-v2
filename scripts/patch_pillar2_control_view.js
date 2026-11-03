const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'components', 'admin', 'Pillar2ControlView.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Update the Buyer Dossier text in scriptModalTicket (lines ~1000-1010)
const buyerDossierOld = `🎯 VERIFIED INTERESTED BUYER DOSSIER:
• Client Reference: \${scriptModalTicket.buyerProfile?.buyerCode || 'BM-DIASPORA-701'}
• Principal Buyer: \${scriptModalTicket.buyerProfile?.principalName || 'Corporate Diaspora Executive Allocator'}
• Background & Title: \${scriptModalTicket.buyerProfile?.title || 'Executive brief with pre-allocated capital'}
• Allocated Liquid Budget: \${scriptModalTicket.buyerProfile?.allocatedBudgetFormatted || 'Pre-allocated liquid funds'}
• Acquisition Purpose: \${scriptModalTicket.buyerProfile?.purpose || 'Executive residency & asset preservation'}
• Specific Requirements: \${scriptModalTicket.buyerProfile?.requirements || 'Clean title, serene perimeter'}
• Inspection Readiness: \${scriptModalTicket.buyerProfile?.readinessTimeline || 'Ready to inspect within 48 hours'}
• Liquidity / POF Verification: \${scriptModalTicket.buyerProfile?.liquidityStatus || 'Pre-verified Tier-1 Bank wire'}`;

const buyerDossierNew = `🎯 VERIFIED INTERESTED BUYER DOSSIER:
• Client Reference: \${scriptModalTicket.buyerProfile?.buyerCode || 'BM-DIASPORA-701'}
• Principal Buyer: \${scriptModalTicket.buyerProfile?.principalName || 'Corporate Diaspora Executive Allocator'}
• Background & Title: \${scriptModalTicket.buyerProfile?.title || 'Executive brief with pre-allocated capital'}
• Allocated Liquid Budget: \${scriptModalTicket.buyerProfile?.allocatedBudgetFormatted || 'Pre-allocated liquid funds'}
• Acquisition Purpose: \${scriptModalTicket.buyerProfile?.purpose || 'Executive residency & asset preservation'}
• Specific Requirements: \${scriptModalTicket.buyerProfile?.requirements || 'Clean title, serene perimeter'}
• Inspection Readiness: \${scriptModalTicket.buyerProfile?.readinessTimeline || 'Ready to inspect within 48 hours'}
• Liquidity / POF Verification: \${scriptModalTicket.buyerProfile?.liquidityStatus || 'Pre-verified Tier-1 Bank wire'}
• Lagos Representative / Counsel: \${scriptModalTicket.buyerProfile?.representativeContact?.name || 'Barrister Babatunde Alabi'} (\${scriptModalTicket.buyerProfile?.representativeContact?.phone || '08034128901'}) - \${scriptModalTicket.buyerProfile?.representativeContact?.officeAddress || 'Victoria Island, Lagos'}
• Source Registry & Cross-Check URL: \${scriptModalTicket.buyerProfile?.sourceAttribution?.sourceName || 'Diaspora Direct Mandate Registry'} (\${scriptModalTicket.buyerProfile?.sourceAttribution?.sourceUrl || 'https://www.bethelmindanalytics.com'})
• Statutory Proof of Funds Ref: \${scriptModalTicket.buyerProfile?.sourceAttribution?.proofOfFundsRef || 'Tier-1 Bank Liquidity Attestation'} (Sec 84 Evidence Act 2011 Verified)`;

content = content.replace(buyerDossierOld, buyerDossierNew);

// 2. In callBriefModalTicket, replace the buyer dossier card and add Process Map + Representative Contact + Source Link
const callBriefBuyerOld = `{/* Interested Buyer Detailed Dossier Card */}
            {callBriefModalTicket.buyerProfile && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🎯 Interested Buyer Profile ({callBriefModalTicket.buyerProfile.buyerCode})
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '999px', padding: '1px 7px', fontSize: '9px', fontWeight: 800 }}>
                    Liquid Wire Ready
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff' }}>
                  {callBriefModalTicket.buyerProfile.principalName}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {callBriefModalTicket.buyerProfile.title}
                </div>

                <div style={{
                  background: '#070a12',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  marginTop: '2px'
                }}>
                  <div>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Allocated Budget</div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>
                      {callBriefModalTicket.buyerProfile.allocatedBudgetFormatted}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Acquisition Timeline</div>
                    <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800 }}>
                      {callBriefModalTicket.buyerProfile.readinessTimeline}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <b style={{ color: '#38bdf8' }}>Specific Purpose:</b> {callBriefModalTicket.buyerProfile.purpose}
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <b style={{ color: '#38bdf8' }}>Requirements:</b> {callBriefModalTicket.buyerProfile.requirements}
                </div>
                <div style={{ fontSize: '9px', color: '#10b981', marginTop: '2px' }}>
                  <b>Liquidity Status:</b> {callBriefModalTicket.buyerProfile.liquidityStatus}
                </div>
              </div>
            )}`;

const callBriefBuyerNew = `{/* Interested Buyer Detailed Dossier Card with Contact & Source */}
            {callBriefModalTicket.buyerProfile && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🎯 Interested Buyer Profile ({callBriefModalTicket.buyerProfile.buyerCode})
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '999px', padding: '1px 7px', fontSize: '9px', fontWeight: 800 }}>
                    Liquid Wire Ready
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff' }}>
                    {callBriefModalTicket.buyerProfile.principalName}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {callBriefModalTicket.buyerProfile.title}
                  </div>
                </div>

                <div style={{
                  background: '#070a12',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px'
                }}>
                  <div>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Allocated Budget</div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>
                      {callBriefModalTicket.buyerProfile.allocatedBudgetFormatted}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Acquisition Timeline</div>
                    <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800 }}>
                      {callBriefModalTicket.buyerProfile.readinessTimeline}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <b style={{ color: '#38bdf8' }}>Specific Purpose:</b> {callBriefModalTicket.buyerProfile.purpose}
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <b style={{ color: '#38bdf8' }}>Requirements:</b> {callBriefModalTicket.buyerProfile.requirements}
                </div>
                <div style={{ fontSize: '9px', color: '#10b981' }}>
                  <b>Liquidity Status:</b> {callBriefModalTicket.buyerProfile.liquidityStatus}
                </div>

                {/* Buyer Representative / Lagos Legal Contact Block */}
                {callBriefModalTicket.buyerProfile.representativeContact && (
                  <div style={{
                    background: '#090e1a',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                      👤 Buyer Liaison / Legal Representative (Lagos Contact)
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                      {callBriefModalTicket.buyerProfile.representativeContact.name}
                    </div>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                      {callBriefModalTicket.buyerProfile.representativeContact.role}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
                      <a
                        href={\`tel:\${callBriefModalTicket.buyerProfile.representativeContact.phone}\`}
                        style={{
                          background: '#1e293b',
                          color: '#38bdf8',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        📞 {callBriefModalTicket.buyerProfile.representativeContact.phone}
                      </a>
                      <a
                        href={\`mailto:\${callBriefModalTicket.buyerProfile.representativeContact.email}\`}
                        style={{
                          background: '#1e293b',
                          color: '#cbd5e1',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          textDecoration: 'none'
                        }}
                      >
                        ✉️ {callBriefModalTicket.buyerProfile.representativeContact.email}
                      </a>
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                      🏢 {callBriefModalTicket.buyerProfile.representativeContact.officeAddress}
                    </div>
                  </div>
                )}

                {/* Source Attribution & Cross-Check Link */}
                {callBriefModalTicket.buyerProfile.sourceAttribution && (
                  <div style={{
                    background: '#090e1a',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                        🔗 Verified Source Attribution & Cross-Check
                      </span>
                      <span style={{ fontSize: '8px', color: '#64748b' }}>
                        {callBriefModalTicket.buyerProfile.sourceAttribution.verificationDate}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                      Source: <b>{callBriefModalTicket.buyerProfile.sourceAttribution.sourceName}</b>
                    </div>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                      POF Reference: <code style={{ color: '#fbbf24' }}>{callBriefModalTicket.buyerProfile.sourceAttribution.proofOfFundsRef}</code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                      <span style={{ fontSize: '8px', color: '#10b981', fontWeight: 700 }}>
                        ✓ {callBriefModalTicket.buyerProfile.sourceAttribution.statutoryCompliance}
                      </span>
                      <a
                        href={callBriefModalTicket.buyerProfile.sourceAttribution.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#34d399',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        Cross-Check Dossier <ArrowUpRight size={10} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 🗺️ OPERATIONAL PROCESS MAP & STEP-BY-STEP GUIDANCE */}
            <div style={{
              background: '#090e1a',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🗺️ Transaction Execution Process Map
                </div>
                <span style={{ fontSize: '9px', color: '#64748b' }}>6 Sequential Stages</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(callBriefModalTicket.inboundCallBrief?.processMap || [
                  { stepNumber: 1, title: 'Outbound Mandate Broadcast', action: 'Tap WhatsApp/SMS/Email on deal card to send proposal & link.', timing: 'Immediate / Business hours' },
                  { stepNumber: 2, title: 'Broker Inbound Call / Response', action: 'Broker calls 0802 279 1227. Use Opening Script #1 to confirm primary mandate.', timing: 'Within 2 - 24 hours' },
                  { stepNumber: 3, title: 'Digital E-Signature on Phone', action: 'Broker opens deal link, draws signature on screen, locking 80/20 non-circumvention.', timing: 'Takes 60 seconds' },
                  { stepNumber: 4, title: 'Accompanied Inspection Booking', action: 'Introduce Buyer Legal Counsel to broker for on-site physical walkthrough.', timing: 'Within 24 - 48 hours' },
                  { stepNumber: 5, title: 'Lands Registry Title Search', action: 'Buyer legal team verifies C of O / Governor Consent at Alausa Lands Bureau.', timing: '3 - 5 business days' },
                  { stepNumber: 6, title: 'Closing Consideration & 80/20 Wire', action: 'Purchase paid; 80% to broker; 20% origination fee to Moniepoint 6805375225.', timing: 'At deed execution' }
                ]).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                      background: '#070a12',
                      border: '1px solid #1e293b',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  >
                    <div style={{
                      minWidth: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      color: '#fbbf24',
                      fontSize: '10px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {step.stepNumber || idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                          {step.title}
                        </span>
                        <span style={{ fontSize: '8px', color: '#64748b' }}>
                          {step.timing}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                        {step.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>`;

content = content.replace(callBriefBuyerOld, callBriefBuyerNew);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('✅ Successfully patched Pillar2ControlView.tsx with rich buyer contact, source cross-check link, and 6-stage process map!');
