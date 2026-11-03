const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'components', 'admin', 'Pillar2ControlView.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add import of PRIME_LUXURY_LISTINGS if not present
if (!content.includes('PRIME_LUXURY_LISTINGS')) {
  content = content.replace(
    "import { \n  Briefcase,",
    "import { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/pillar2Engine';\nimport { \n  Briefcase,"
  );
  if (!content.includes('PRIME_LUXURY_LISTINGS')) {
    content = "import { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/pillar2Engine';\n" + content;
  }
}

// 2. Locate the start of callBriefModalTicket modal
const modalHeaderTarget = `{/* Property & Partner Banner */}`;
if (!content.includes(modalHeaderTarget)) {
  console.error('Could not find modalHeaderTarget');
  process.exit(1);
}

// Find lines from `{/* Interested Buyer Detailed Dossier Card */}` to `{/* Financial Numbers Card`
const regex = /\{\/\* Interested Buyer Detailed Dossier Card \*\/\}[\s\S]*?\{\/\* Financial Numbers Card/m;

const replacement = `{/* Interested Buyer Detailed Dossier Card with Contact & Source */}
            {(() => {
              const activeTicketId = callBriefModalTicket.ticketId || '';
              const matchedListing = PRIME_LUXURY_LISTINGS.find(l => 
                activeTicketId.toLowerCase().includes(l.id.toLowerCase()) || 
                l.id.toLowerCase().includes(activeTicketId.toLowerCase())
              );
              const activeBuyer = callBriefModalTicket.buyerProfile || matchedListing?.buyerProfile;
              const repContact = activeBuyer?.representativeContact || matchedListing?.buyerProfile?.representativeContact;
              const srcAttribution = activeBuyer?.sourceAttribution || matchedListing?.buyerProfile?.sourceAttribution;
              const processMap = callBriefModalTicket.inboundCallBrief?.processMap || [
                { stepNumber: 1, title: 'Outbound Mandate Broadcast', action: 'Tap WhatsApp/SMS/Email on deal card to send proposal & link.', timing: 'Immediate / Business hours' },
                { stepNumber: 2, title: 'Broker Inbound Call / Response', action: 'Broker calls 0802 279 1227. Use Opening Script #1 to confirm primary mandate.', timing: 'Within 2 - 24 hours' },
                { stepNumber: 3, title: 'Digital E-Signature on Phone', action: 'Broker opens deal link, draws signature on screen, locking 80/20 non-circumvention.', timing: 'Takes 60 seconds' },
                { stepNumber: 4, title: 'Accompanied Inspection Booking', action: 'Introduce Buyer Legal Counsel to broker for on-site physical walkthrough.', timing: 'Within 24 - 48 hours' },
                { stepNumber: 5, title: 'Lands Registry Title Search', action: 'Buyer legal team verifies C of O / Governor Consent at Alausa Lands Bureau.', timing: '3 - 5 business days' },
                { stepNumber: 6, title: 'Closing Consideration & 80/20 Wire', action: 'Purchase paid; 80% to broker; 20% origination fee to Moniepoint 6805375225.', timing: 'At deed execution' }
              ];

              return (
                <>
                  {activeBuyer && (
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
                          🎯 Interested Buyer Profile ({activeBuyer.buyerCode || 'BM-BUYER'})
                        </span>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '999px', padding: '1px 7px', fontSize: '9px', fontWeight: 800 }}>
                          Liquid Wire Ready
                        </span>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff' }}>
                          {activeBuyer.principalName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {activeBuyer.title}
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
                            {activeBuyer.allocatedBudgetFormatted}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Acquisition Timeline</div>
                          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800 }}>
                            {activeBuyer.readinessTimeline}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        <b style={{ color: '#38bdf8' }}>Specific Purpose:</b> {activeBuyer.purpose}
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        <b style={{ color: '#38bdf8' }}>Requirements:</b> {activeBuyer.requirements}
                      </div>
                      <div style={{ fontSize: '9px', color: '#10b981' }}>
                        <b>Liquidity Status:</b> {activeBuyer.liquidityStatus}
                      </div>

                      {/* Buyer Representative / Lagos Legal Contact Block */}
                      {repContact && (
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
                            {repContact.name}
                          </div>
                          <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                            {repContact.role}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
                            <a
                              href={\`tel:\${repContact.phone}\`}
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
                              📞 {repContact.phone}
                            </a>
                            <a
                              href={\`mailto:\${repContact.email}\`}
                              style={{
                                background: '#1e293b',
                                color: '#cbd5e1',
                                padding: '3px 7px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                textDecoration: 'none'
                              }}
                            >
                              ✉️ {repContact.email}
                            </a>
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                            🏢 {repContact.officeAddress}
                          </div>
                        </div>
                      )}

                      {/* Source Attribution & Cross-Check Link */}
                      {srcAttribution && (
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
                              {srcAttribution.verificationDate}
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                            Source: <b>{srcAttribution.sourceName}</b>
                          </div>
                          <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                            POF Reference: <code style={{ color: '#fbbf24' }}>{srcAttribution.proofOfFundsRef}</code>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                            <span style={{ fontSize: '8px', color: '#10b981', fontWeight: 700 }}>
                              ✓ {srcAttribution.statutoryCompliance}
                            </span>
                            <a
                              href={srcAttribution.sourceUrl}
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
                      {processMap.map((step: any, idx: number) => (
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
                  </div>
                </>
              );
            })()}

            {/* Financial Numbers Card`;

if (!regex.test(content)) {
  console.error('Regex match failed on content');
  process.exit(1);
}

content = content.replace(regex, replacement);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('✅ Successfully applied complete Crib Sheet fix to Pillar2ControlView.tsx!');
