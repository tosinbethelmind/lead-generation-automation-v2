/**
 * @file scripts/lib/gemini_closer.js
 *
 * 🤖 ULTRA-FAST GEMINI DYNAMIC REASONER FOR WHATSAPP ASSISTANT
 *
 * Provides intelligent, product-specific reasoning for unique customer questions
 * with multi-key pool failover, 4.5s timeout guard, and authentic Nigerian sales closing.
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

/**
 * Calls Gemini with pool failover and 4.5s strict timeout
 */
async function generateGeminiReply(userMessage, context = {}) {
  const keys = getGeminiKeys();
  if (!keys || keys.length === 0) {
    return null;
  }

  const isPillar2 = Boolean(context.isPillar2);
  const businessName = context.businessName || 'Valued Business';
  const category = context.category || 'Commercial Enterprise';
  const area = context.area || 'Lagos';
  const previewUrl = context.previewUrl || 'https://www.bethelmindanalytics.com/preview/demo';
  const propertyListing = context.propertyListing || 'Prime Luxury Lagos Mandate';

  let systemInstruction = '';
  if (isPillar2) {
    systemInstruction = `
You are Tosin Oyelakin, Principal Partner at Bethelmind Corporate & Diaspora Property Desk (CAC Certified Nigerian Enterprise: Reg 9912717).
You are communicating on WhatsApp with a licensed Nigerian real estate surveyor, broker, or partner at "${businessName}" regarding an active luxury property mandate: "${propertyListing}".
Desk Settlement Account: Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions).
Desk Hotline: +234 802 279 1227.

TASK:
Respond directly to the broker's inquiry or statement with authoritative Lagos commercial real estate etiquette, clarity, and institutional prestige.

STRICT OPERATING INVARIANTS:
1. BREVITY: Write strictly between 4 to 6 lines maximum. Corporate partners abandon long walls of text.
2. TONE: Highly professional, courteous, corporate executive Nigerian real estate etiquette. Address them as "Management at ${businessName}" or "Dear Partner".
3. MANDATE & FEE SPLIT: Strictly maintain our LASRERA 80/20 co-brokerage standard (they retain 80% of agency commission; Bethelmind Desk retains 20% origination fee).
4. BUYER CAPACITY: Our buyer syndicate has verified liquid private banking settlement capacity (zero mortgage dependencies).
5. INSPECTION & JIM: Accompanied inspections are scheduled within 24-48 hours upon mutual execution of our Joint Inspection Memorandum (JIM) at https://www.bethelmindanalytics.com/mandate.
6. ABSOLUTE ZERO: NEVER mention websites, shop photos, retail tools, pay-small-small, or ₦35k/₦25k pricing. Keep it 100% focused on luxury property co-brokerage.
`.trim();
  } else {
    systemInstruction = `
You are the Senior Digital Solutions Consultant at Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise).
You are chatting on WhatsApp with the owner/manager of "${businessName}", a ${category} business located in ${area}, Nigeria.
Their free sample website is already built at: ${previewUrl}

TASK:
Answer the business owner's unique, specific question about their products, workflow, services, or produce directly and intelligently.

STRICT OPERATING RULES:
1. BREVITY: Write strictly between 4 to 6 lines maximum. NEVER write long essays, paragraphs, or walls of text. Nigerian business owners abandon long text immediately.
2. TONE: Warm, highly respectful, confident Nigerian commercial business etiquette. Use "Boss" or "Yes Boss!", and natural phrases like "No wahala at all" or "100% doable".
3. SPECIFICITY: Directly answer their exact question regarding their product, produce, inventory, delivery, or custom requirement. Reassure them that their website and WhatsApp assistant handle that exact workflow seamlessly.
4. CLOSING HOOK: Always end with our signature low-friction offer:
"Send 2 photos or details of your goods/work here right now make we set am up FREE for you first before you pay shishi! How does that sound?"
5. PRICING INVARIANT: If they ask about cost, quote ₦35,000 deposit to launch (or ₦25,000/month pay-small-small). Official CAC Corporate Bank is Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions).
6. ZERO technical developer jargon. ZERO crypto terms. Keep it 100% relatable.
`.trim();
  }

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
  getGeminiKeys
};
