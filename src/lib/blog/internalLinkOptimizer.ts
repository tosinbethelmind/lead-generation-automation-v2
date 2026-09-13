/**
 * @file src/lib/blog/internalLinkOptimizer.ts
 * 
 * 🔗 Automated Internal Link Optimizer & Trojan Horse Prototype Bridge
 * Bethelmind Analytics Lagos Desk (www.bethelmindanalytics.com)
 * 
 * Purpose:
 * Scans article HTML and intelligently converts key transactional phrases into
 * contextual internal links, creating an authoritative SEO link-wheel that channels
 * organic Google rank to high-margin tools and DFY business prototypes.
 */

interface LinkRule {
  pattern: RegExp;
  replacementUrl: string;
  anchorText: string;
}

const INTERNAL_LINK_RULES: LinkRule[] = [
  {
    pattern: /\b(Solar BOQ Load Sizer|solar sizing|solar inverter calculator)\b/i,
    replacementUrl: '/tools/solar-quote-pro',
    anchorText: 'Solar BOQ Load Sizer'
  },
  {
    pattern: /\b(Lagos B2B business leads|b2b lead harvester|verified nigerian leads)\b/i,
    replacementUrl: '/tools/lagos-lead-harvester',
    anchorText: 'Lagos B2B Lead Harvester'
  },
  {
    pattern: /\b(15-second voice note|whatsapp voice notes|audio proposal)\b/i,
    replacementUrl: '/tools/whatsapp-voice-notes',
    anchorText: 'WhatsApp Voice Note Generator'
  },
  {
    pattern: /\b(turnkey business portal|dfy commercial website|business prototype)\b/i,
    replacementUrl: '/preview/claim',
    anchorText: '100% Turnkey DFY Business Prototype'
  },
  {
    pattern: /\b(digital assets vault|selar products|commercial dataset)\b/i,
    replacementUrl: '/marketplace',
    anchorText: 'Bethelmind Digital Marketplace & Vault'
  }
];

export class InternalLinkOptimizer {
  /**
   * Optimizes HTML content by injecting high-authority internal links
   */
  public static optimizeLinks(html: string): string {
    let optimized = html;

    for (const rule of INTERNAL_LINK_RULES) {
      // Replace only the first occurrence to avoid unnatural link stuffing
      let replaced = false;
      optimized = optimized.replace(rule.pattern, (match) => {
        if (!replaced) {
          replaced = true;
          return `<a href="${rule.replacementUrl}" class="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">${match}</a>`;
        }
        return match;
      });
    }

    return optimized;
  }
}
