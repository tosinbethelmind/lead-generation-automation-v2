/**
 * src/lib/leadHeatScorer.ts
 * 
 * Lead Heat & Intent Scoring Engine:
 * Analyzes incoming message text, budget signals, urgency keywords, and channel details
 * to generate a Lead Heat Score (0-100) and Visual Badge for WhatsApp Notifications.
 */

export interface LeadHeatResult {
  score: number; // 0 - 100
  heatCategory: 'HOT' | 'WARM' | 'COLD';
  badge: string; // Emoji badge for alerts, e.g. "🔥 HOT LEAD (92/100)"
  estimatedValueNgn: number;
  intentSignals: string[];
  buyingUrgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'LOW';
}

export function calculateMessageHeatScore(message: string, phone?: string, channel = 'WHATSAPP'): LeadHeatResult {
  const text = (message || '').toLowerCase();
  let score = 50; // baseline score for any lead making an inquiry
  const signals: string[] = [];

  // 1. High-Urgency & Buying Signal Keywords (+15 to +25 pts)
  if (text.includes('today') || text.includes('now') || text.includes('urgent') || text.includes('asap') || text.includes('immediately')) {
    score += 20;
    signals.push('Immediate urgency indicated (+20)');
  }
  if (text.includes('pay') || text.includes('buy') || text.includes('cost') || text.includes('price') || text.includes('transfer') || text.includes('moniepoint') || text.includes('paystack')) {
    score += 15;
    signals.push('Direct payment/pricing query (+15)');
  }

  // 2. High-Value Custom Feature Requirements (+15 pts)
  if (text.includes('custom') || text.includes('portal') || text.includes('software') || text.includes('saas') || text.includes('application') || text.includes('database') || text.includes('webhook')) {
    score += 15;
    signals.push('High-ticket custom web/software feature requirement (+15)');
  }

  // 3. Specific Business Inquiry Signal (+10 pts)
  if (text.includes('company') || text.includes('business') || text.includes('store') || text.includes('client') || text.includes('office') || text.includes('shop')) {
    score += 10;
    signals.push('Established business entity inquiry (+10)');
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  let heatCategory: 'HOT' | 'WARM' | 'COLD' = 'COLD';
  let badge = '❄️ COLD INQUIRY';
  let buyingUrgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
  let estimatedValueNgn = 185000; // Base B2B Growth Portal price

  if (score >= 80) {
    heatCategory = 'HOT';
    badge = `🔥 HOT LEAD (${score}/100 | High Buying Intent)`;
    buyingUrgency = 'IMMEDIATE';
    estimatedValueNgn = 250000;
  } else if (score >= 60) {
    heatCategory = 'WARM';
    badge = `⚡ WARM LEAD (${score}/100 | Evaluating Options)`;
    buyingUrgency = 'HIGH';
    estimatedValueNgn = 185000;
  } else {
    heatCategory = 'COLD';
    badge = `ℹ️ INFO INQUIRY (${score}/100)`;
    buyingUrgency = 'MODERATE';
    estimatedValueNgn = 75000;
  }

  return {
    score,
    heatCategory,
    badge,
    estimatedValueNgn,
    intentSignals: signals,
    buyingUrgency
  };
}
