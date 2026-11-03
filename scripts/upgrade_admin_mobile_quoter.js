const fs = require('fs');

let code = fs.readFileSync('src/app/admin/mobile/page.tsx', 'utf8');

const isCRLF = code.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';

// 1. Add import of PILLAR_ONE_SERVICES if not present
if (!code.includes('PILLAR_ONE_SERVICES')) {
  code = code.replace(
    "import Pillar2ControlView from '../../../components/admin/Pillar2ControlView';",
    `import Pillar2ControlView from '../../../components/admin/Pillar2ControlView';${eol}import { PILLAR_ONE_SERVICES, getPillarOneService } from '@/lib/pillarOneCatalog';`
  );
  console.log('✅ Added PILLAR_ONE_SERVICES import to admin mobile page');
}

// 2. Add state for claimServiceId and claimWebsiteUrl
if (!code.includes('claimServiceId')) {
  code = code.replace(
    "const [claimCategory, setClaimCategory] = useState('Commercial Business');",
    `const [claimCategory, setClaimCategory] = useState('Commercial Business');${eol}  const [claimServiceId, setClaimServiceId] = useState('website_ai');${eol}  const [claimWebsiteUrl, setClaimWebsiteUrl] = useState('');`
  );
  console.log('✅ Added claimServiceId and claimWebsiteUrl state');
}

// 3. Update handleClaimSubmit to include serviceId and customUrl
const oldBody = `body: JSON.stringify({
          action: 'claim_lead_site',
          businessName: claimName,
          phone: claimPhone,
          category: claimCategory,
          area: claimArea
        })`;

const newBody = `body: JSON.stringify({
          action: 'claim_lead_site',
          businessName: claimName,
          phone: claimPhone,
          category: claimCategory,
          area: claimArea,
          serviceId: claimServiceId,
          customUrl: claimWebsiteUrl
        })`;

if (code.includes('action: \'claim_lead_site\'')) {
  code = code.replace(oldBody, newBody);
  console.log('✅ Updated handleClaimSubmit payload');
}

// 4. Update Tab 3 navigation label
code = code.replace(
  "{ key: 'claim', label: '🌐 Claim Site', count: activeProspects.length }",
  "{ key: 'claim', label: '⚡ 1-Tap Quoter & Claim', count: '13 Tools' }"
);
console.log('✅ Updated Tab 3 navigation label');

// 5. Update Tab 3 form header & dropdown
const oldTab3Header = `<div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Zero-Touch Builder</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>Instant Website Generator &amp; Claim</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Enter any Nigerian business to generate their live preview link &amp; WhatsApp pitch in seconds.
              </p>
            </div>`;

const newTab3Header = `<div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Pillar 1 Commercial Engine</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0' }}>⚡ 1-Tap Quoter &amp; Instant Generator</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Generate instant branded preview links, bankable invoice cards &amp; WhatsApp pitches across all 13 Pillar 1 solutions.
              </p>
            </div>`;

code = code.replace(oldTab3Header, newTab3Header);

// Replace the industry selector with the 13 Pillar 1 services selector + optional website url
const oldIndustrySelect = `<div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>INDUSTRY / SECTOR</label>
                <select
                  value={claimCategory}
                  onChange={e => setClaimCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Solar & Inverter Engineering">Solar &amp; Inverter Engineering</option>
                  <option value="Fashion, Boutique & Retail">Fashion, Boutique &amp; Retail</option>
                  <option value="Beauty, Hair & Spa Salon">Beauty, Hair &amp; Spa Salon</option>
                  <option value="Real Estate & Facility Management">Real Estate &amp; Facility Management</option>
                  <option value="Automotive, Spare Parts & Mechanics">Automotive, Spare Parts &amp; Mechanics</option>
                  <option value="Private School & Education">Private School &amp; Education</option>
                  <option value="Restaurant, Food & Bakery">Restaurant, Food &amp; Bakery</option>
                  <option value="Logistics & Dispatch Aggregator">Logistics &amp; Dispatch</option>
                  <option value="Commercial Business">General Commercial Business</option>
                </select>
              </div>`;

const newServiceSelect = `<div>
                <label style={{ fontSize: '11px', color: '#d4af37', fontWeight: 800 }}>⚡ SELECT PILLAR 1 SOLUTION TO OFFER *</label>
                <select
                  value={claimServiceId}
                  onChange={e => {
                    const sid = e.target.value;
                    setClaimServiceId(sid);
                    const s = PILLAR_ONE_SERVICES.find(item => item.id === sid);
                    if (s) setClaimCategory(s.category);
                  }}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    padding: '9px 10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginTop: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  {PILLAR_ONE_SERVICES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.pricing.isPortal ? '₦45k Setup / ₦95k Annual' : '₦35k Setup / ₦80k Annual'})
                    </option>
                  ))}
                </select>
              </div>

              {claimServiceId === 'website_to_app' && (
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', borderRadius: '8px', padding: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>EXISTING WEBSITE URL TO WRAP (.APK) *</label>
                  <input
                    type="url"
                    value={claimWebsiteUrl}
                    onChange={e => setClaimWebsiteUrl(e.target.value)}
                    placeholder="e.g. https://www.clientbusiness.com"
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #0284c7',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#ffffff',
                      fontSize: '12px',
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                    Wraps this existing website into a native Android APK in 24 hours.
                  </div>
                </div>
              )}`;

if (code.includes(oldIndustrySelect)) {
  code = code.replace(oldIndustrySelect, newServiceSelect);
  console.log('✅ Replaced industry select with 13 Pillar 1 services selector');
} else {
  console.log('⚠️ oldIndustrySelect not found');
}

// 6. Update claimResult display card to include Onboard link and Copy button
const oldClaimResultPitchButtons = `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href={claimResult.waLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>Send Pre-Filled Pitch on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(claimResult.prefilledWhatsAppPitch, 'Pitch message')}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={13} />
                    <span>Copy Full WhatsApp Pitch Text</span>
                  </button>
                </div>`;

const newClaimResultPitchButtons = `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {claimResult.onboardUrl && (
                    <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '2px' }}>
                      <b>Client Admission &amp; Invoice Link:</b><br />
                      <a href={claimResult.onboardUrl} target="_blank" rel="noreferrer" style={{ color: '#d4af37', textDecoration: 'underline' }}>
                        {claimResult.onboardUrl}
                      </a>
                    </div>
                  )}

                  <a
                    href={claimResult.waLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>Send Pre-Filled Pitch on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(claimResult.prefilledWhatsAppPitch, 'Pitch message')}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={13} />
                    <span>Copy Full WhatsApp Pitch Text</span>
                  </button>

                  {claimResult.onboardUrl && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(claimResult.onboardUrl, 'Admission Link')}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #d4af37',
                        color: '#d4af37',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Copy size={13} />
                      <span>Copy Client Admission &amp; Invoice URL</span>
                    </button>
                  )}
                </div>`;

if (code.includes(oldClaimResultPitchButtons)) {
  code = code.replace(oldClaimResultPitchButtons, newClaimResultPitchButtons);
  console.log('✅ Updated claimResult pitch buttons');
} else {
  console.log('⚠️ oldClaimResultPitchButtons not found');
}

// 7. Update old ₦70,000 pitch text in "Recent Leads Ready to Claim"
const oldLeadPitch = "Launch today for ₦70,000 flat (1-Year All-Inclusive, Zero Monthly Bills).\\nMoniepoint Bank: 6805375225 - Bethelmind Digital Solutions.";
const newLeadPitch = "Launch today: ₦35,000 Setup + ₦7,000/mo (OR ₦80,000 Annual Pass with 1 Full Year Free Maintenance).\\nMoniepoint Bank: 6805375225 - Bethelmind Digital Solutions.";
if (code.includes(oldLeadPitch)) {
  code = code.replace(oldLeadPitch, newLeadPitch);
  console.log('✅ Updated 70k pitch to 35k/80k in active prospects list');
}

// 8. Update Tab 4 Onboard package options
const oldTab4Options = `<option value="Starter Official Website (.com.ng)">Option 1: Starter Go-Live 1-Year All-Inclusive (₦70,000 Flat)</option>
                  <option value="Corporate Growth Suite (.com)">Option 2: Full Turnkey Custom Domain Suite (₦150,000 Total)</option>
                  <option value="School / Estate Result & Escrow Portal">Option 3: School / Estate Automated Portal (₦85,000)</option>`;

const newTab4Options = `<option value="Starter Go-Live (₦35,000 Setup + ₦7,000/mo)">Option 1: Starter Go-Live (₦35,000 Setup + ₦7,000/mo)</option>
                  <option value="Annual Value Pass (₦80,000 Flat — 1 Year Free)">Option 2: Annual Value Pass (₦80,000 Flat — 1 Year Free Maintenance)</option>
                  <option value="School / Estate / Shortlet Portal (₦45,000 Setup / ₦95,000 Annual)">Option 3: School / Estate / Shortlet Portal (₦45,000 / ₦95,000 Annual)</option>
                  <option value="Full Turnkey Custom Domain Suite (₦75,000 Deposit / ₦150,000 Total)">Option 4: Full Turnkey Custom Domain Suite (₦75,000 Deposit / ₦150,000 Total)</option>`;

if (code.includes(oldTab4Options)) {
  code = code.replace(oldTab4Options, newTab4Options);
  console.log('✅ Updated Tab 4 domain package options');
} else {
  console.log('⚠️ oldTab4Options not found');
}

fs.writeFileSync('src/app/admin/mobile/page.tsx', code, 'utf8');
