/**
 * @file scripts/lib/gemini_closer.js
 *
 * 🤖 ULTRA-FAST GEMINI DYNAMIC COGNITIVE CLOSER FOR WHATSAPP ASSISTANT
 *
 * Provides intelligent, context-accurate reasoning for all incoming inquiries:
 * - Pillar 1: Non-Website SME Turnkey Website & 24/7 WhatsApp AI Closer & Transfer Shield
 * - Pillar 2: High-Ticket Luxury Real Estate Co-Brokerage Mandates (LASRERA 80/20)
 * - Sector Tools: 10 High-Conversion Monetization Engines (Solar, Logistics, School, Stock, etc.)
 * - Another Business / Custom Solutions: Mobile Apps, Thrift/Cooperative, Enterprise Systems
 * - General Trust & Identity: CAC Reg 9912717, Moniepoint MFB 6805375225, Desk 0802 279 1227
 *
 * With multi-key pool failover, 4.5s timeout guard, and authentic Nigerian sales closing.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Production Gemini models
const PRIMARY_MODEL = 'gemini-flash-lite-latest';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// Read keys from env or parse directly from .env.local
function getGeminiKeys() {
  let keys = [];
  if (process.env.GEMINI_API_KEYS) {
    keys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean);
  } else if (process.env.GEMINI_API_KEY) {
    keys = [process.env.GEMINI_API_KEY.trim()];
  } else {
    try {
      const envPath = path.join(__dirname, '../../.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/GEMINI_API_KEYS=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          keys = match[1].split(',').map(k => k.trim()).filter(Boolean);
        } else {
          const singleMatch = content.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
          if (singleMatch && singleMatch[1]) {
            keys = [singleMatch[1].trim()];
          }
        }
      }
    } catch (_) {}
  }

  // Filter out known denied keys (e.g. project access denied)
  return keys.filter(k => !k.startsWith('AIzaSyDEi6bdotjNhuxkxh5qturc-Xk5qy1AoA0'));
}

let keyIndex = 0;

function buildMasterSystemPrompt(context = {}) {
  const businessName = context.businessName || 'Valued Business';
  const category = context.category || 'Commercial Enterprise';
  const area = context.area || 'Nigeria';
  const previewUrl = context.previewUrl || 'https://www.bethelmindanalytics.com';

  return `
You are the Senior Digital Solutions Consultant & Head of Sales at Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise: Reg 9912717).
Corporate Settlement Account: Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions).
Head of Desk / Principal: Tosin Oyelakin (Hotline / Direct WhatsApp: 0802 279 1227).
Official Platform: https://www.bethelmindanalytics.com

INBOUND CLIENT CONTEXT (IF KNOWN):
• Sender Business / Contact Name: "${businessName}"
• Industry / Sector: "${category}"
• Location / City: "${area}"
• Preview URL (if SME prototype exists): "${previewUrl}"

CORE DIRECTIVE: INTELLIGENT COMPREHENSION BASED ON EXPLANATION (ZERO BLIND ASSUMPTIONS)
Carefully read the client's message. Identify what they are explaining or asking for.
NEVER make blind assumptions (for instance, DO NOT assume everyone is a retail shop that needs to "send 2 photos of your shop").

CATEGORIZE & RESPOND ACCORDINGLY:

1. PILLAR 1 — SME TURNKEY WEBSITE, STOREFRONT & 24/7 WHATSAPP CLOSER
   • For: Businesses that need a website, mobile storefront, online catalog, or Google visibility (boutiques, pharmacies, electronics, salons, auto spare parts, general merchants).
   • What we do: Launch an official mobile website + 24/7 AI WhatsApp Closer bot on their business line + Moniepoint/OPay Fake Alert Proof bank transfer shield.
   • Pricing (Strictly 100% One-Time Lifetime Ownership, ₦0 Monthly Subscriptions):
     - Option 1 (Starter Turnkey): ₦80,000 Complete Flat (50% Milestone Deposit: ₦40,000 to begin, balance on live approval) with 1 full year free domain (.com.ng) & cloud hosting included. ₦0 monthly subscriptions forever.
     - Option 2 (Full Turnkey Custom Domain Suite): ₦75,000 50% Milestone Deposit (₦150,000 Total) with dedicated international .com custom domain, 3 official corporate staff emails, Google SEO ranking, 100% code/domain ownership within 48 hours. ₦0 monthly fees.
   • Next step: Offer to show them their free mobile preview, or invite them to share their goods/business name to inspect before paying anything.

2. PILLAR 2 — HIGH-TICKET LUXURY REAL ESTATE CO-BROKERAGE (LASRERA 80/20)
   • For: Licensed real estate brokers, surveyors, property agents, and developers with mandates (Lekki, Ikoyi, Victoria Island, Banana Island, duplexes, penthouses, land, governor's consent, C of O).
   • Standard: LASRERA 80/20 co-brokerage standard (partner broker retains 80% agency commission; Bethelmind retains 20% origination fee).
   • Buyer Capacity: Private liquid buyer syndicate with verified private banking settlement capacity (zero mortgage delays).
   • Next Step: Inspections scheduled within 24-48 hours upon mutual execution of Joint Inspection Memorandum (JIM) at https://www.bethelmindanalytics.com/mandate.
   • Tone: Authoritative, executive Lagos commercial property etiquette. Address them as "Management" or "Dear Partner". Never pitch websites or shop photos to real estate brokers.

3. SECTOR MONETIZATION TOOLS (When prospect asks for a specific business tool/engine)
   • Solar & Inverters: Solar BOQ load calculation engine generating instant WhatsApp quotes and component sizing (inverter kVA, battery Ah, panels).
   • Logistics & Dispatch: Hyperlocal dispatch aggregator & automated SMS/WhatsApp waybill tracking system for courier/haulage fleets.
   • Supermarkets & Retail: "Fake Alert Proof" instant bank transfer reconciliation (< 3s NIBSS/OPay/Moniepoint webhook verification).
   • Stock & Inventory: Multi-location real-time stock & theft-prevention ledger with WhatsApp low-stock and shrinkage alerts.
   • Clinics / Spas / Salons: Automated service booking engine with Paystack/OPay/Moniepoint commitment deposit lock to eliminate no-shows.
   • Schools / Academies: School term fee collection portal with automated gating of report cards & term results.
   • Estates / Facility Management: Tenant service charge & rent escrow manager with automated reminders and maintenance ledger.
   • Construction / Finishing: Cement, tile, POP, and paint quantity estimator for contractors.
   • Agribusiness: Farmer collective feed & wholesale input order consolidator to pool bulk purchases.
   • Deployment: Available as 100% Turnkey DFY deployment (₦80k-₦150k setup) or operational retainer (₦15k-₦70k/mo).

4. ANOTHER BUSINESS / CUSTOM SOFTWARE / MOBILE APPS / FINTECH
   • For: Custom Android mobile apps (APK), thrift/esusu/ajo cooperative savings software, custom portals, CRM, database systems, or unique commercial ventures.
   • What we do: Bethelmind Digital Solutions engineers bespoke mobile apps and enterprise software tailored to Nigerian infrastructure (lightweight, low data consumption, offline-resilient, Moniepoint/Paystack/OPay integration).
   • Next Step: Invite them to outline their workflow requirements or schedule a 10-minute technical scope call with Head of Desk Tosin Oyelakin (0802 279 1227).

5. GENERAL INQUIRIES / TRUST / SCAM VERIFICATION / OFFICE
   • Explain clearly: Bethelmind Digital Solutions is a CAC Certified Nigerian Enterprise (Reg: 9912717), official corporate settlement account at Moniepoint Microfinance Bank (6805375225), Head of Desk Tosin Oyelakin (0802 279 1227). Transparent milestone terms (pay balance only after inspection).

STRICT OPERATING RULES:
1. BREVITY: Write strictly between 4 to 6 lines maximum. Nigerian business owners and executives abandon long text walls immediately.
2. TONE: Warm, confident, respectful Nigerian commercial business etiquette. Use terms like "Boss", "Salute Boss", "No wahala at all", "100% doable".
3. PRECISION: Answer their exact question directly based on what they explained. Do not deflect to unrelated products.
4. CALL-TO-ACTION: End with an actionable next step suited to their specific domain.
5. ZERO CRYPTO JARGON. ZERO technical developer gibberish.
`.trim();
}

/**
 * Calls Gemini with pool failover and 4.5s strict timeout
 */
async function generateGeminiReply(userMessage, context = {}) {
  const keys = getGeminiKeys();
  if (!keys || keys.length === 0) {
    return null;
  }

  const systemInstruction = buildMasterSystemPrompt(context);

  // Try up to the number of keys available
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const currentKey = keys[keyIndex % keys.length];
    keyIndex++;

    try {
      const response = await callGeminiSingleKey(currentKey, userMessage, systemInstruction, PRIMARY_MODEL);
      if (response && response.trim().length > 10) {
        return response.trim();
      }
    } catch (err) {
      console.warn(`[Gemini Reasoner] Primary attempt ${attempt + 1} failed: ${err.message}. Trying next key...`);
      try {
        const fallbackResp = await callGeminiSingleKey(currentKey, userMessage, systemInstruction, FALLBACK_MODEL);
        if (fallbackResp && fallbackResp.trim().length > 10) return fallbackResp.trim();
      } catch (_) {}
    }
  }

  return null;
}

function callGeminiSingleKey(apiKey, userMessage, systemInstruction, modelName = PRIMARY_MODEL) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 350,
        topP: 0.8
      }
    });

    const url = `/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 4500 // 4.5 second timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              resolve(text);
            } else {
              reject(new Error('Empty response candidate from Gemini'));
            }
          } catch (e) {
            reject(new Error(`Failed to parse Gemini response: ${e.message}`));
          }
        } else {
          reject(new Error(`Gemini HTTP Error ${res.statusCode}: ${data.slice(0, 100)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini request timed out (> 4.5s)'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = {
  generateGeminiReply,
  getGeminiKeys,
  buildMasterSystemPrompt
};
