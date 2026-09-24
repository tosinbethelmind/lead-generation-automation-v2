/**
 * @file src/lib/outreach/spintaxEngine.ts
 * 
 * 2026 DYNAMIC SPINTAX & COPY PERMUTATION ENGINE
 * 
 * Prevents text hash comparison and pattern blacklisting across bulk email, SMS, and Social DMs
 * by generating unique, natural text variations for every message.
 */

/**
 * Parses nested Spintax format `{option1|option2|option3}` and returns a randomly selected option.
 */
export function parseSpintax(text: string): string {
  const spintaxRegex = /\{([^{}]+)\}/g;
  
  let result = text;
  while (spintaxRegex.test(result)) {
    result = result.replace(spintaxRegex, (_, choicesStr) => {
      const choices = choicesStr.split('|');
      const index = Math.floor(Math.random() * choices.length);
      return choices[index];
    });
  }
  return result;
}

/**
 * Generates N unique permutations from a spintax template string.
 */
export function generateSpintaxVariations(template: string, count: number = 10): string[] {
  const variations = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 20;

  while (variations.size < count && attempts < maxAttempts) {
    variations.add(parseSpintax(template));
    attempts++;
  }

  return Array.from(variations);
}

/**
 * Spintax templates for Email & Social DM Outreach
 */
export const SPINTAX_TEMPLATES = {
  permissionIcebreaker: `{Good day|Hello|Greetings}! 👋 Is this the {management team|leadership|directorate|executive desk} at *{bizName}* in {area}?

We {built|engineered|configured} a private 24/7 AI WhatsApp Customer Closer + Quoting Portal for *{bizName}* (₦0 Upfront).

{May I|Should we|Would you like us to} send your private demo link and 15s audio briefing?`,

  prototypeDelivery: `Here is your private interactive prototype for *{bizName}*:
👉 {previewUrl}

🎙️ (Tap the green audio soundwave pill on page for your 15s audio briefing)

⚡ Key Capabilities Built For {bizName}:
• 24/7 AI WhatsApp Sales Closer (< 3s response time, natural Nigerian tone)
• Moniepoint & Paystack Direct Bank Credit Verification
• Google Maps Local SEO Discovery & Instant Lead Push Alerts

To claim your portal with ₦0 upfront or get a 1-line script embed for your existing site, tap below:
📲 WhatsApp: {whatsappUrl}

Best regards,
*{senderName}* • Bethelmind Analytics Lagos Desk`,

  emailSubject: `{Stop losing after-hours inquiry leads|Automating 24/7 AI Quotes|Exclusive ₦0 Web Prototype} for {bizName}`,
};
